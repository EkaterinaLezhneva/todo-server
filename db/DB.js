const mongoose = require('mongoose');
let Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/lezhnyova_node-todo', { useNewUrlParser: true });
let todoSchema= new Schema ({
    value: String,
    status: {type:Boolean, default: false}
});
let Todo = mongoose.model('Todo',todoSchema);
module.exports = Todo;