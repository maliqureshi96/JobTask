const express = require('express');
const authController = require('../controller/authController');
const auth = require('../middlewares/auth');
const taskController = require('../controller/taskController');


const router = express.Router();


// User Side
/*------------------------ */
//registration
router.post('/register', authController.register);
//login
router.post('/login', authController.login);
//logout
router.post('/logout', auth, authController.logout);
//refresh
router.get('/refresh', authController.refresh);
/*-------------------------*/

// task
/*------------------*/
//create
router.post('/task', auth, taskController.create);

// get all
router.get('/task/all', auth, taskController.getAll);

//get by id
router.get('/task/:id', auth, taskController.getById);

// update
router.put('/task/:id', auth, taskController.update);

// delete
router.delete('/task/:id', auth, taskController.delete);
/*----------------------*/



module.exports = router;