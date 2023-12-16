// Seleção de elementos add task e Edit task//
const inputTask = document.querySelector("#task-input");
const addBtn = document.querySelector("#add-btn");
const descTask = document.querySelector("#task p");
const templateTask = document.querySelector('#task-template');
const editForm = document.querySelector("#edit-task");
const addForm = document.querySelector(".add-task");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const editInput = document.querySelector("#edit-input");
const todoForm = document.querySelector("#task-list");
let oldInputValue;
const editCheckBtn = document.querySelector("#edit-check");

// Seleção de elementos Pesquisa  //
const searchInput = document.querySelector("#search-input");
const filterSelect = document.querySelector("#filter");
const titleSelect = document.querySelector("#all-title");

// Selção de elementos To do List
const checkBtn = document.querySelector(".finish-todo");


// Functions

const toggleForms = () => {
    editForm.classList.toggle("hide");
    templateTask.classList.toggle("hide");
    addForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");



}

const createTodo = (text) =>{
    // Cria uma cópia do modelo usando cloneNode
    const newTask = templateTask.cloneNode(true);

    // Ajusta o conteúdo da nova tarefa
    descTask.textContent = text;
    
    // Adiciona a nova tarefa à lista de tarefas
    const listTask = document.querySelector('#task-list');
    listTask.appendChild(newTask); 
    templateTask.classList.remove("hide");

    // Limpa o campo de input
    inputTask.value = "";
    addBtn.classList.add("released");
    inputTask.focus();
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll("#task");

    todos.forEach((todo) =>{
        let todoTitle = todo.querySelector("p");
        
        if(todoTitle.innerText == oldInputValue) {
            todoTitle.innerText = text;
        }
    });
};

const getSearchTodos = (search) => {

    const todos = document.querySelectorAll("#task");

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
    const todos = document.querySelectorAll("#task");

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

inputTask.addEventListener("input", (e) =>{
    e.preventDefault();
    if(inputTask.value.trim()) {
        addBtn.classList.remove("released");
        return inputTask.value
    } else {
        addBtn.classList.add("released");
    };
});

addBtn.addEventListener("click", () =>{
    const inputValue = inputTask.value;

    if (inputValue) {
        createTodo(inputValue);
    };
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("li");
    let todoTitle;

    if(parentEl && parentEl.querySelector("p")) {
        todoTitle = parentEl.querySelector("p").innerText;
    }

    if(targetEl.classList.contains("finish-todo")){
        parentEl.classList.toggle("done");
    }

    if(targetEl.classList.contains("delete-todo")) {
        parentEl.remove();
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
})