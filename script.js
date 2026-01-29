// Get DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// Load todos from localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Initialize the app
function init() {
    renderTodos();
    
    // Event listeners
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
}

// Add a new todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        todoInput.style.borderColor = '#ff6b6b';
        todoInput.placeholder = 'Please enter a task!';
        setTimeout(() => {
            todoInput.style.borderColor = '';
            todoInput.placeholder = 'Add a new task...';
        }, 2000);
        return;
    }
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    todos.push(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

// Toggle todo completion
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Render all todos
function renderTodos() {
    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
        return;
    }
    
    todoList.innerHTML = todos.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                aria-label="Mark '${escapeHtml(todo.text)}' as ${todo.completed ? 'incomplete' : 'complete'}"
            />
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" aria-label="Delete task '${escapeHtml(todo.text)}'">Delete</button>
        </li>
    `).join('');
    
    // Attach event listeners using event delegation
    attachEventListeners();
}

// Attach event listeners to todo items
function attachEventListeners() {
    // Use event delegation for checkboxes
    todoList.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        const todoId = parseInt(checkbox.closest('.todo-item').dataset.id);
        checkbox.addEventListener('change', () => toggleTodo(todoId));
    });
    
    // Use event delegation for delete buttons
    todoList.querySelectorAll('.delete-btn').forEach(button => {
        const todoId = parseInt(button.closest('.todo-item').dataset.id);
        button.addEventListener('click', () => deleteTodo(todoId));
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Start the app
init();
