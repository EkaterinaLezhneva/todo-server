$(document).ready(function () {
    let todos = [];

    $.ajax({

        method: "GET",
        url: '/todos/',
    }).done(todosNew => {

        todos = todosNew;
        render();

    }).fail(function () {

        alert("Error!");

    });

    function checkAndEdit(id, changes) {
        let element;
        todos.forEach((el, i) => {
            if (el._id === id) {
                element = el;
            }
        });

        $.ajax({

            method: "PATCH",
            url: '/todos/' + element._id,
            data: changes
        }).done(() => {

            if (changes.value !== undefined) element.value = changes.value;
            if (changes.status !== undefined) element.status = changes.status;

            render();

        }).fail(function () {

            alert("Error!");

        });
    }

    $('.inputtodo').focus();

    let counter = 0;

    let clickEvent = $('body');

    $("#add_button").on('click', addTask);

    $('input#textinput').keypress(function clickEnter(event) {

        if (event.keyCode == 13) {
            event.preventDefault();
            addTask();
        }
    });

    $(".buttoncheck").on('change', checkAll);

    clickEvent.on('change', '.checkbox', checkTask);

    clickEvent.on('click', '.deletetask', deleteTask);

    clickEvent.on('click', '.buttondel', deleteCompleted);

    $(document).on('dblclick', '.spanclass', edit);

    $(".btn.tab").on('click', function () {

        $('.btn.activeTab').removeClass("activeTab");
        $(this).addClass("activeTab");

        render();
    });
    $(document).on('click', '.pages', function () {

        $('.pages.activePage').removeClass("activePage");
        $(this).addClass("activePage");

        render();
    });

    function edit() {

        let id = $(this).parent().attr('id');

        let editTodo = $(this);

        const li = editTodo.parent();

        let oldValue = editTodo[0].innerHTML;

        $(editTodo).remove();

        const editText = () => {

            const value = editTodoInput.val().trim();


            if (value) {
                checkAndEdit(id, {value: value})


            } else {
                render();
            }

        };

        $(li).prepend(`<input type="text" size="25" id="textedit" class="edittodo" value="${oldValue}">`);

        let editTodoInput = $('.edittodo');

        editTodoInput.focus();

        editTodoInput.keypress(function (event) {

            if (event.keyCode === 13 && editTodoInput.is(':focus')) {

                event.preventDefault();
                editText();
            }
        });

        editTodoInput.blur(() => editText());
    }

    function addTask() {

        let inputTodo = $('.inputtodo');
        const todoName = inputTodo.val();

        const todo = {

            status: false,
            value: todoName
        };

        if (!todoName.trim()) {

            alert("Enter text, please!");
            return false;
        }
        inputTodo[0].value = "";

        $.ajax({

            method: "POST",
            url: '/todos/',
            data: todo

        }).done(todoEl => {

            todos.push(todoEl)
            counter++;
            inputTodo.focus();

            render('last');

        }).fail(function () {

            alert("Error!");

        });

    }

    function checkAll() {

        const isChecked = this.checked;

        $.ajax({

            method: "PATCH",
            url: '/todos/',
            data: {isChecked: isChecked}

        }).done(() => {

            todos.forEach(el => {

                el.status = isChecked;

            });

            render();

        }).fail(function () {

            alert("Error!");

        });
    }

    function checkTask() {
        const isChecked = this.checked;
        let id = $(this).parent().attr('id');
        checkAndEdit(id, {status: isChecked})
    }

    function deleteTask() {

        let id = $(this).parent().attr('id');

        $.ajax({

            method: "DELETE",
            url: '/todos/' + id,

        }).done(function () {

            let index;

            todos.forEach((el, i) => {

                if (el._id === id) {
                    index = i;
                }
            });

            todos.splice(index, 1);
            render();
        }).fail(function () {

            alert("Error!");

        });
    }

    function countTask() {

        const taskCount = $('.count_task')
        taskCount.empty();

        let allTask = todos.length;

        let doneTask = todos.filter(el => {
            return el.status
        }).length;

        let unDone = allTask - doneTask;

        let countTask = '';
        countTask = `<li id="allTask" class="count_task">All <span>${allTask}</span></li><li id="doneTask" class="count_task" >Done <span>${doneTask}</span></li><li id="undoneTask" class="count_task">Undone <span>${unDone}</span></li>`;
        taskCount.append(countTask);
    }

    function deleteCompleted() {

        $.ajax({

            method: "DELETE",
            url: '/todos/',

        }).done(function () {

            todos = todos.filter(el => {
                return !el.status
            });

            render();

        }).fail(function () {

            alert("Error!");

        });
    }

    function detectTabs() {

        let tabId = $('.btn.activeTab').attr('id');

        const checked = (tabId === 'info__completed') ? true : false;

        if (tabId === 'info__all') {

            return todos;
        } else {

            return todos.filter(el => {
                return el.status === checked
            });
        }
    }

    function renderPage(todos, page) {

        const pages = $('.hor_nav ');

        let quantityPages = Math.ceil(todos.length / 5);
        let activePage = parseInt($('.pages.activePage').attr('id')) || 1;

        if (activePage > quantityPages || page === 'last') {
            activePage = quantityPages;
        }
        $('.hor_nav').empty();

        let pagesNumber = '';

        for (let i = 1; i <= quantityPages; i++) {
            const className = (activePage === i) ? 'pages activePage' : 'pages';
            pagesNumber += `<li class="${className}" id="${i}page">${i}</li>`;
        }

        pages.append(pagesNumber);

        let endElement = 5 * activePage;
        let startElement = endElement - 5;
        return todos.slice(startElement, endElement);
    }

    function render(page) {

        let buttonCheck = $('.buttoncheck');

        if (todos.length === 0) {
            buttonCheck.prop('checked', false);
        } else {

            let activeTodos = todos.filter(el => {
                return !el.status
            });

            if (activeTodos.length) {
                buttonCheck.prop('checked', false);
            } else {
                buttonCheck.prop('checked', true);
            }
        }

        const todoList = $('.todolist');

        let task = '';
        let currentTodos = detectTabs();
        let pageTodos = renderPage(currentTodos, page);
        todoList.empty();
        countTask();

        pageTodos.forEach((el) => {

            const className = (el.status) ? 'done-true' : '';
            task += `<li id="${el._id}" class="taskitem list-group-item ${className}"><span class ="spanclass" id="span${el._id}">${_.escape(el.value)}</span><input id="check${el._id}" type="checkbox" class="checkbox"><button type="button" class="btn btn-secondary deletetask " id="del${el._id}">X</button></li>`;
        });

        todoList.append(task);
        $('.done-true .checkbox').prop('checked', true);
    }
});
