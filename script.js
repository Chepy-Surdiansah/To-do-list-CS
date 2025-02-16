const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const categorySelect = document.getElementById("category");
const filterSelect = document.getElementById("filter");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const clearAllButton = document.getElementById("clear-all");
const colorPicker = document.getElementById("color-picker");

// Dark Mode Toggle
const darkModeButton = document.getElementById("dark-mode-toggle");
darkModeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Simpan & Muat Tugas dari Local Storage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#list-container li").forEach(li => {
        tasks.push({
            text: li.querySelector(".task-text").innerText,
            completed: li.classList.contains("completed"),
            category: li.dataset.category,
            color: li.style.backgroundColor
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    listContainer.innerHTML = ""; // Kosongkan daftar sebelum memuat ulang
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTask(task.text, task.completed, task.color, task.category, false));
    updateCounter();
}

// Tambah tugas baru
function addTask(taskText = null, completed = false, taskColor = null, taskCategory = null, save = true) {
    if (!taskText) {
        taskText = inputBox.value.trim();
        taskColor = colorPicker.value;
        taskCategory = categorySelect.value;

        if (!taskText) {
            alert("Silakan masukkan tugas!");
            return;
        }
    }

    const li = document.createElement("li");
    li.style.backgroundColor = taskColor;
    li.classList.add("task-item");
    li.dataset.category = taskCategory; // Simpan kategori dalam atribut data

li.innerHTML = `
    <label style="flex: 1; display: flex; align-items: center;"> 
        <input type="checkbox" class="task-checkbox" ${completed ? "checked" : ""}> 
        <span class="task-text">${taskText} <small>${taskCategory}</small></span> 
    </label> 
    <div class="button-group"> 
        <button class="edit-btn">✏️</button> 
        <button class="delete-btn">❌</button> 
    </div> 
`;

if (completed) {
    li.classList.add("completed");
}

listContainer.appendChild(li);
inputBox.value = "";

if (save) saveTasks();
updateCounter(); // Perbarui jumlah selesai/belum selesai

// Event listener untuk checkbox
const checkbox = li.querySelector(".task-checkbox");
checkbox.addEventListener("change", function () {
    li.classList.toggle("completed", checkbox.checked);
    saveTasks();
    updateCounter();
    filterTasks(); // Perbarui tampilan setelah mengubah status
});

// Edit Tugas
li.querySelector(".edit-btn").addEventListener("click", function () {
    const newText = prompt("Edit tugas:", taskText);
    if (newText) {
     li.querySelector(".task-text").innerText = `${newText} <small>(${taskCategory})</small>`;
     saveTasks();
    }
});

// Hapus Tugas
li.querySelector(".delete-btn").addEventListener("click", function () {
   if (confirm("Hapus tugas ini?")) {
     li.remove();
     saveTasks();
     updateCounter();
   }
});

filterTasks(); // Pastikan filter tetap berlaku setelah menambah tugas
}

// Perbaiki fungsi filter tugas
function filterTasks() {
    const filterValue = filterSelect.value;
    document.querySelectorAll(".task-item").forEach(li => {
        const category = li.dataset.category;
        const isCompleted = li.classList.contains("completed");
      
        if (filterValue === "all" || category === filterValue) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}

// Perbarui Jumlah Selesai/Belum Selesai
function updateCounter() {
    const totalTasks = document.querySelectorAll(".task-item").length;
    const completedTasks = document.querySelectorAll(".task-item.completed").length;
    const uncompletedTasks = totalTasks - completedTasks;
    
    completedCounter.innerText = completedTasks;
    uncompletedCounter.innerText = uncompletedTasks;
}

// Event listener untuk filter
filterSelect.addEventListener("change", filterTasks);

// Event listener untuk hapus semua
clearAllButton.addEventListener("click", () => {
    if (confirm ("Hapus semua tugas?")) {
        listContainer.innerHTML = "";
        localStorage.removeItem("tasks");
        updateCounter();
    }
});

// Panggil fungsi untuk memuat tugas saat halaman dibuat
loadTasks();