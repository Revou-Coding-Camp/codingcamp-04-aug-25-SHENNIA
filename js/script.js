const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const statusInput = document.getElementById("status-input");
const filterInput = document.getElementById("filter");
const deleteAllBtn = document.getElementById("delete-all");
const todoBody = document.getElementById("todo-body");
const headers = document.querySelectorAll("th[data-sort]");
const statusFilter = document.getElementById("status-filter");

let todos = [];
let sortOrder = {
  text: true,
  date: true,
  status: true,
};

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const stored = localStorage.getItem("todos");
  if (stored) {
    todos = JSON.parse(stored);
  }
}

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const task = todoInput.value.trim();
  const date = dateInput.value;
  const status = statusInput.value;

  if (!task || !date || !status) return alert("Complete all fields!");

  todos.push({
    id: Date.now(),
    text: task,
    date,
    status,
  });

  saveTodos();
  todoForm.reset();
  renderTodos();
});

function renderTodos() {
  const keyword = filterInput.value.toLowerCase();
  const statusSelected = statusFilter.value;

  const filtered = todos.filter(todo =>
    todo.text.toLowerCase().includes(keyword) &&
    (statusSelected === "" || todo.status === statusSelected)
  );

  todoBody.innerHTML = "";

  if (filtered.length === 0) {
    todoBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No task found</td></tr>`;
    return;
  }

  filtered.forEach(todo => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${todo.text}</td>
      <td>${todo.date}</td>
      <td>${todo.status}</td>
      <td class="actions">
        <button onclick="deleteTodo(${todo.id})">Delete</button>
      </td>
    `;
    todoBody.appendChild(tr);
  });
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

deleteAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    todos = [];
    saveTodos();
    renderTodos();
  }
});

filterInput.addEventListener("input", renderTodos);
statusFilter.addEventListener("change", renderTodos);

headers.forEach(header => {
  header.addEventListener("click", () => {
    const key = header.dataset.sort;
    sortOrder[key] = !sortOrder[key];

    todos.sort((a, b) => {
      if (a[key] < b[key]) return sortOrder[key] ? -1 : 1;
      if (a[key] > b[key]) return sortOrder[key] ? 1 : -1;
      return 0;
    });

    saveTodos();
    renderTodos();
  });
});

// Init
loadTodos();
renderTodos();
