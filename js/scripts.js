// Seleção de elementos add task e Edit task//
const todoInput = document.querySelector("#task-input");
const addBtn = document.querySelector("#add-btn");
const editForm = document.querySelector("#edit-task");
const addForm = document.querySelector(".add-task");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const editInput = document.querySelector("#edit-input");
const todoList = document.querySelector("#todo-list");
const editCheckBtn = document.querySelector("#edit-check");
let oldInputValue;

// Seleção de elementos Pesquisa  //
const searchInput = document.querySelector("#search-input");
const filterSelect = document.querySelector("#filter");
const titleSelect = document.querySelector("#all-title");

// Selção de elementos To do List
const checkBtn = document.querySelector(".finish-todo");


// Functions

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
    addForm.classList.toggle("hide");
};

const createTodo = (text, done =0, save =1) =>{
    // Cria uma cópia do modelo usando cloneNode
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("p");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);
    
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fi fi-bs-check"></i>';
    todo.appendChild(doneBtn);
    
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fi fi-rs-pencil"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-todo");
    deleteBtn.innerHTML = '<i class="fi fi-rs-trash"></i>';
    todo.appendChild(deleteBtn);

    //Guardar dados da localStorage (Necessário guardar antes de criar a TODO na tela)
    if (done) {
        todo.classList.add("done");
    }

    if (save) {
        saveTodoLocalStorage({text, done});
    }

    todoList.appendChild(todo);

    // Limpa o campo de input
    todoInput.value = "";
    addBtn.classList.add("released");
    todoInput.focus();
};

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) =>{
        let todoTitle = todo.querySelector("p");
        
        if(todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
            updateTodoLocalStorage(oldInputValue, text);
        };
    });
};

const getSearchTodos = (search) => {

    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) =>{
        let todoTitle = todo.querySelector("p").innerText.toLocaleLowerCase();
        const normalizedSearch = search.toLowerCase();
        todo.style.display = "flex";

        if(!todoTitle.includes(normalizedSearch)) {
            todo.style.display = "none";
        }
    });
    
};

const filterTodos = (filterValue) =>{
    const todos = document.querySelectorAll(".todo");

        switch (filterValue){
            case "all":
                todos.forEach((todo) => (todo.style.display = "flex"));
                break;

            case "done":
                todos.forEach((todo) => todo.classList.contains("done") 
                    ? (todo.style.display = "flex") 
                    : (todo.style.display = "none"));
                break;

            case "todo":
                todos.forEach((todo) => 
                    !todo.classList.contains("done") 
                    ? (todo.style.display = "flex") 
                    : (todo.style.display = "none"));
                break;

            default:
                break;
        };

};

// Eventos

todoInput.addEventListener("input", (e) =>{
    e.preventDefault();
    if(todoInput.value.trim()) {
        addBtn.classList.remove("released");
        return todoInput.value
    } else {
        addBtn.classList.add("released");
    };
});

addBtn.addEventListener("click", () =>{
    const inputValue = todoInput.value;

    if (inputValue) {
        createTodo(inputValue);
    };
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if(parentEl && parentEl.querySelector("p")) {
        todoTitle = parentEl.querySelector("p").innerText;
    }

    if(targetEl.classList.contains("finish-todo")){
        parentEl.classList.toggle("done");

        updateTodoStatusLocalStorage(todoTitle);
    }

    if(targetEl.classList.contains("delete-todo")) {
        parentEl.remove();
        removeTodoLocalStorage(todoTitle);
    }

    if(targetEl.classList.contains("edit-todo")) {
        toggleForms();
        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
});

cancelEditBtn.addEventListener("click", (e) =>{
    toggleForms();
});

editCheckBtn.addEventListener("click", (e) =>{
    const editInputValue = editInput.value;

    if(editInputValue) {
        updateTodo(editInputValue);
    }
    toggleForms();
});

searchInput.addEventListener("keyup", (e) =>{
    const search = e.target.value;
    getSearchTodos(search);
});

filterSelect.addEventListener("change", (e) =>{
    const filterValue = e.target.value;
    filterTodos(filterValue);
});

// Local Storage

const getTodosLocalStorage = () =>{
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    return todos;
};

const saveTodoLocalStorage = (todo) =>{
    const todos = getTodosLocalStorage();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
};

const loadTodos = () =>{
    const todos = getTodosLocalStorage();

    todos.forEach((todo) =>{
        createTodo(todo.text, todo.done, 0);
    });
};

const removeTodoLocalStorage = (todoText) =>{
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText);
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
    
};

const updateTodoStatusLocalStorage = (todoText) => {
     const todos = getTodosLocalStorage();

     todos.map((todo) => todo.text === todoText ? (todo.done = !todo.done) : null);

     localStorage.setItem("todos", JSON.stringify(todos));
    
    
 };

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoOldText ? (todo.text = todoNewText) : null);

    localStorage.setItem("todos", JSON.stringify(todos));
    
};

loadTodos();
