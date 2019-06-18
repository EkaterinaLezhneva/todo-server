let Todo = require('../db/DB.js');

exports.createTodo = function (req, res) {

    Todo.create(req.body).then(function (todo) {
        return res.send(todo);
    }).catch(function (err) {
        return res.status(500).send(err);
    })
};
exports.findTodo = function (req, res) {

    Todo.find({}).then(function (todos) {
        return res.send(todos);
    }).catch(function (err) {
        return res.status(500).send(err);
    })
};
exports.deleteCompleted = function (req, res) {

    Todo.deleteMany({status: true}).then(function (todos) {
        return res.send(todos);
    }).catch(function (err) {
        return res.status(500).send(err);
    })
};
exports.checkAll = function (req, res) {

    const status = req.body.isChecked;

    Todo.update({}, {status: status}, {multi: true}).then(function (todos) {
        return res.send(todos);
    }).catch(function (err) {
        return res.status(500).send(err);
    })
};
exports.deleteTodo = function (req, res) {

    Todo.findByIdAndRemove(req.params.id).then(function () {

        return res.sendStatus(200)
    }).catch(function (err) {
        return res.status(500).send(err);
    })
};
exports.checkAndEditTodo = function (req, res) {

    const changes = {};

    if (req.body.status !== undefined) changes.status = req.body.status;
    if (req.body.value !== undefined) changes.value = req.body.value;

    Todo.findByIdAndUpdate(req.params.id, changes).then(function (todo) {

        res.send(todo);
    }).catch(function (err) {
        return res.status(500).send(err);
    })
};