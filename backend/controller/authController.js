const Joi = require('joi');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const UserDto = require('../dto/user');
const JWTService = require('../services/JWTService');
const RefreshToken = require('../models/token');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
    async register(req, res, next) {
        const userRegisterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password'),
        });

        const { error } = userRegisterSchema.validate(req.body);
        if (error) return next(error);

        const { username, name, email, password } = req.body;

        try {
            if (await User.exists({ email }) || await User.exists({ username })) {
                return next({ status: 409, message: 'Email or Username already registered' });
            }
        } catch (error) {
            return next(error);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let user;
        try {
            user = await new User({ username, email, name, password: hashedPassword }).save();

            const accessToken = JWTService.signAccessToken({ _id: user._id }, '30m');
            const refreshToken = JWTService.signRefreshToken({ _id: user._id }, '60m');

            await JWTService.storeRefreshToken(refreshToken, user._id);

            res.cookie('accessToken', accessToken, { maxAge: 86400000, httpOnly: true });
            res.cookie('refreshToken', refreshToken, { maxAge: 86400000, httpOnly: true });

            return res.status(201).json({ user: new UserDto(user), auth: true });
        } catch (error) {
            return next(error);
        }
    },

    async login(req, res, next) {
        const userLoginSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(passwordPattern).required()
        });

        const { error } = userLoginSchema.validate(req.body);
        if (error) return next(error);

        const { username, password } = req.body;
        let user;

        try {
            user = await User.findOne({ username });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return next({ status: 401, message: "Invalid username or password" });
            }

            const accessToken = JWTService.signAccessToken({ _id: user._id }, '30m');
            const refreshToken = JWTService.signRefreshToken({ _id: user._id }, '60m');

            await RefreshToken.updateOne({ userId: user._id }, { token: refreshToken }, { upsert: true });

            res.cookie('accessToken', accessToken, { maxAge: 86400000, httpOnly: true });
            res.cookie('refreshToken', refreshToken, { maxAge: 86400000, httpOnly: true });

            return res.status(200).json({ user: new UserDto(user), auth: true });
        } catch (error) {
            return next(error);
        }
    },

    async logout(req, res, next) {
        try {
            await RefreshToken.deleteOne({ userId: req.user._id });
        } catch (error) {
            return next(error);
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ user: null, auth: false });
    },

    async refresh(req, res, next) {
        const originalRefreshToken = req.cookies.refreshToken;
        let userId;

        try {
            userId = JWTService.verifyRefreshToken(originalRefreshToken)._id;
        } catch {
            return next({ status: 401, message: 'Unauthorized' });
        }

        try {
            const match = await RefreshToken.findOne({ userId, token: originalRefreshToken });
            if (!match) return next({ status: 401, message: 'Unauthorized' });

            const accessToken = JWTService.signAccessToken({ _id: userId }, '30m');
            const refreshToken = JWTService.signRefreshToken({ _id: userId }, '60m');

            await RefreshToken.updateOne({ userId }, { token: refreshToken });

            res.cookie('accessToken', accessToken, { maxAge: 86400000, httpOnly: true });
            res.cookie('refreshToken', refreshToken, { maxAge: 86400000, httpOnly: true });

            const user = await User.findById(userId);
            return res.status(200).json({ user: new UserDto(user), auth: true });
        } catch (error) {
            return next(error);
        }
    }
};

module.exports = authController;
