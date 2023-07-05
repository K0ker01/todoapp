const todoList = document.querySelector("#todo-list"),
    todoForm = document.querySelector("#todo-form"),
    addInput = document.querySelector("#add-input"),
    todoItems = document.querySelectorAll(".todo-item"),
    descriptionInput = document.querySelector("#description-input");

function createElement(tag, props, ...children) {
    const element = document.createElement(tag);

    Object.keys(props).forEach(key => (element[key] = props[key]));

    if (children.length > 0) {
        children.forEach(child => {
            if (typeof child === "string") {
                child = document.createTextNode(child);
            }

            element.appendChild(child);
        });
    }

    return element;
}

function createTodoItem(title, description) {
    const checkbox = createElement("input", { type: "checkbox", className: "checkbox" }),
        titleLabel = createElement("label", { className: "title" }, title),
        descriptionLabel = createElement("label", { className: "description" }, description),
        editTitleInput = createElement("input", { type: "text", className: "textfield" }),
        editDescriptionInput = createElement("input", { type: "text", className: "textfield" }),
        todoItemContent = createElement("div", { className: "todo-item__content" }, titleLabel, descriptionLabel),
        todoPreview = createElement("div", { className: "todo-item__preview" }, checkbox, todoItemContent, editTitleInput, editDescriptionInput),
        editButton = createElement("button", { className: "edit" }, "Изменить"),
        deleteButton = createElement("button", { className: "delete" }, "Удалить"),
        todoSettings = createElement("div", { className: "todo-item__settings" }, editButton, deleteButton),
        listItem = createElement("li", { className: "todo-item" }, todoPreview, todoSettings);

    bindEvents(listItem);

    return listItem;
}

function bindEvents(todoItem) {
    const checkbox = todoItem.querySelector(".checkbox"),
        editButton = todoItem.querySelector(".edit"),
        deleteBtn = todoItem.querySelector(".delete");

    checkbox.addEventListener("change", toggleTodoItem);
    editButton.addEventListener("click", editTodoItem);
    deleteBtn.addEventListener("click", deleteTodoItem);
}

function addTodoItem(event) {
    event.preventDefault();

    const title = addInput.value.trim();
    const description = descriptionInput.value.trim();

    if (title !== "" && title.length <= 24) {
        const listItem = createTodoItem(title, description);
        todoList.appendChild(listItem);

        todoForm.reset();
        saveTodoList();
    } else if (title !== "" && title.length >= 24) {
        const listItem = createTodoItem(`${title.substring(0, 24)}...`, description);
        todoList.appendChild(listItem);

        todoForm.reset();
        saveTodoList();
    } else {
        return alert("Необходимо ввести название задачи.");
    }
}

function toggleTodoItem({ target }) {
    const listItem = target.closest(".todo-item"),
        editButton = listItem.querySelector(".edit"),
        deleteBtn = listItem.querySelector(".delete"),
        descriptionLabel = listItem.querySelector(".description");

    listItem.classList.toggle("completed");
    descriptionLabel.classList.toggle("completed");

    if (listItem.classList.contains("completed")) {
        editButton.setAttribute("disabled", "off");
        deleteBtn.setAttribute("disabled", "off");
        descriptionLabel.classList.add("completed");
    } else {
        editButton.removeAttribute("disabled");
        deleteBtn.removeAttribute("disabled");
        descriptionLabel.classList.remove("completed");
    }

    saveTodoList();
}

function editTodoItem({ target }) {
    const listItem = target.closest(".todo-item"),
        checkbox = listItem.querySelector(".checkbox"),
        title = listItem.querySelector(".title"),
        description = listItem.querySelector(".description"),
        editTitleInput = listItem.querySelector(".textfield"),
        editDescriptionInput = listItem.querySelectorAll(".textfield")[1],
        isEditing = listItem.classList.contains("editing");

    if (isEditing) {
        if (editTitleInput.value.trim() !== "" && editTitleInput.value.length <= 24) {
            title.innerText = editTitleInput.value;
        } else if (editTitleInput.value.trim() !== "" && editTitleInput.value.length >= 24) {
            title.innerText = `${editTitleInput.value.substring(0, 24)}...`;
        }

        if (editDescriptionInput.value.trim() !== "") {
            description.innerText = editDescriptionInput.value;
            description.style.display = "block";
        } else {
            description.style.display = "none";
        }

        target.innerText = "Изменить";
        checkbox.style.display = "block";
    } else {
        editTitleInput.value = title.innerText;
        editDescriptionInput.value = description.innerText;
        target.innerText = "Сохранить";

        checkbox.style.display = "none";
        description.style.display = "none";
    }

    listItem.classList.toggle("editing");
    saveTodoList();
}

function deleteTodoItem({ target }) {
    const listItem = target.closest(".todo-item");

    todoList.removeChild(listItem);
    saveTodoList();
}

function saveTodoList() {
    const todoItems = todoList.querySelectorAll(".todo-item");

    const todoListData = Array.from(todoItems).map(item => {
        const title = item.querySelector(".title").innerText;
        const description = item.querySelector(".description").innerText;
        const completed = item.classList.contains("completed");

        return { title, description, completed };
    });

    localStorage.setItem("todoList", JSON.stringify(todoListData));
}

function loadTodoList() {
    const todoListData = localStorage.getItem("todoList");

    if (todoListData) {
        const parsedData = JSON.parse(todoListData);

        parsedData.forEach(item => {
            const listItem = createTodoItem(item.title, item.description);
            if (item.completed) {
                listItem.classList.add("completed");
                listItem.querySelector(".description").classList.add("completed");
            }
            todoList.appendChild(listItem);
        });
    }
}

function main() {
    todoForm.addEventListener("submit", addTodoItem);
    loadTodoList();
}

main();
