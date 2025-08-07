// Ambil elemen DOM
const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const dueDate = document.getElementById("due-date");
const status = document.getElementById("status");
const tableBody = document.getElementById("todo-body");
const search = document.getElementById("search");
const filterStatus = document.getElementById("filter-status");
const deleteAllBtn = document.getElementById("delete-all");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentSort = { column: "", order: "asc" };

// Simpan dan render
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Render tugas ke tabel
function renderTasks() {
  tableBody.innerHTML = "";
  let filtered = tasks.filter(task => {
    const matchSearch = task.task.toLowerCase().includes(search.value.toLowerCase());
    const matchStatus = filterStatus.value === "All" || task.status === filterStatus.value;
    return matchSearch && matchStatus;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="no-task">No task found</td></tr>`;
    return;
  }

  filtered.forEach((t, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.task}</td>
      <td>${t.dueDate}</td>
      <td>${t.status}</td>
      <td><button onclick="deleteTask(${index})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// Tambah task
form.addEventListener("submit", e => {
  e.preventDefault();
  if (taskInput.value && dueDate.value) {
    tasks.push({
      task: taskInput.value.trim(),
      dueDate: dueDate.value,
      status: status.value
    });
    form.reset();
    saveTasks();
  }
});

// Hapus task tunggal
function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
  }
}

// Hapus semua
deleteAllBtn.addEventListener("click", () => {
  if (confirm("Delete ALL tasks?")) {
    tasks = [];
    saveTasks();
  }
});

// Filter & Search
search.addEventListener("input", renderTasks);
filterStatus.addEventListener("change", renderTasks);

// Sort
document.querySelectorAll(".sortable").forEach(header => {
  header.addEventListener("click", () => {
    const key = header.dataset.sort;
    const order = currentSort.column === key && currentSort.order === "asc" ? "desc" : "asc";
    currentSort = { column: key, order };

    tasks.sort((a, b) => {
      let valA = a[key].toLowerCase ? a[key].toLowerCase() : a[key];
      let valB = b[key].toLowerCase ? b[key].toLowerCase() : b[key];
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    saveTasks();
  });
});

// Inisialisasi awal
renderTasks();
