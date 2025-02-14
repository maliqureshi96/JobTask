const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        username: { type: String, required: true, unique: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] // Reference to tasks
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
