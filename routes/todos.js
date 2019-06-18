let express = require('express');
let todoController = require('../controllers/controllers.js');
let router = express.Router();

router.post('/', todoController.createTodo);

router.get('/', todoController.findTodo);

router.delete('/', todoController.deleteCompleted);

router.patch('/', todoController.checkAll);

router.delete('/:id', todoController.deleteTodo);

router.patch('/:id', todoController.checkAndEditTodo);

module.exports = router;


