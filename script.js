const taskInput = document.getElementById("task-input");
const taskList = document.querySelector(".task-list");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");

document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

document.getElementById("add-task").addEventListener("click", () => {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  createTaskElement(taskText);
  saveTaskToLocalStorage(taskText, false);
  taskInput.value = "";
});

searchButton.addEventListener("click", searchTasks);
searchInput.addEventListener("input", searchTasks);

function createTaskElement(taskText, isCompleted = false) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task");

  taskItem.innerHTML = `
    <div class="task-content">
      <div class="circle ${isCompleted ? "completed" : ""}"></div>
      <span class="task-name" style="${isCompleted ? "text-decoration: line-through; color: #aaa;" : ""}">${taskText}</span>
    </div>
    <div class="task-menu">
      <span class="dots-menu">...</span>
      <div class="actions" style="display: none;">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
  `;

  taskList.appendChild(taskItem);
  const circle = taskItem.querySelector(".circle");
  const dotsMenu = taskItem.querySelector(".dots-menu");
  const actions = taskItem.querySelector(".actions");
  const deleteBtn = actions.querySelector(".delete-btn");
  const editBtn = actions.querySelector(".edit-btn");

  circle.addEventListener("click", () => {
    const taskName = taskItem.querySelector(".task-name");
    const isCompleted = circle.classList.toggle("completed");
    if (isCompleted) {
      taskName.style.textDecoration = "line-through";
      taskName.style.color = "#aaa";
    } else {
      taskName.style.textDecoration = "none";
      taskName.style.color = "#333";
    }
    updateTaskInLocalStorage(taskText, isCompleted);
  });

  dotsMenu.addEventListener("click", () => {
    actions.style.display = actions.style.display === "none" ? "flex" : "none";
  });


  deleteBtn.addEventListener("click", () => {
    taskItem.remove();
    deleteTaskFromLocalStorage(taskText);
  });

  editBtn.addEventListener("click", () => enableEditMode(taskItem, taskText));
}

function enableEditMode(taskItem, oldTaskText) {
  const taskNameElement = taskItem.querySelector(".task-name");
  const currentText = taskNameElement.textContent;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = currentText;
  editInput.classList.add("edit-input");

  taskNameElement.replaceWith(editInput);

  const actionsContainer = taskItem.querySelector(".actions");
  actionsContainer.innerHTML = "";
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.classList.add("save-btn");

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.classList.add("cancel-btn");

  actionsContainer.appendChild(saveBtn);
  actionsContainer.appendChild(cancelBtn);

  saveBtn.addEventListener("click", () => {
    const newText = editInput.value.trim();
    if (newText) {
      const updatedTaskName = document.createElement("span");
      updatedTaskName.classList.add("task-name");
      updatedTaskName.textContent = newText;

      editInput.replaceWith(updatedTaskName);
      updateTaskInLocalStorage(oldTaskText, false, newText);
      resetActions(taskItem);
    } else {
      alert("Task cannot be empty!");
    }
  });

  cancelBtn.addEventListener("click", () => {
    const originalTaskName = document.createElement("span");
    originalTaskName.classList.add("task-name");
    originalTaskName.textContent = currentText;
    editInput.replaceWith(originalTaskName);
    resetActions(taskItem);
  });
}
function resetActions(taskItem) {
  const actionsContainer = taskItem.querySelector(".actions");
  actionsContainer.innerHTML = `
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  `;

  const deleteBtn = actionsContainer.querySelector(".delete-btn");
  const editBtn = actionsContainer.querySelector(".edit-btn");

  deleteBtn.addEventListener("click", () => taskItem.remove());
  editBtn.addEventListener("click", () => enableEditMode(taskItem));
}

// Search Tasks
function searchTasks() {
  const filter = searchInput.value.toLowerCase();
  const tasks = taskList.querySelectorAll(".task");

  tasks.forEach((task) => {
    const taskName = task.querySelector(".task-name").textContent.toLowerCase();
    if (taskName.includes(filter)) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
}


// Local Storage Functions
function saveTaskToLocalStorage(taskText, isCompleted) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed: isCompleted });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => createTaskElement(task.text, task.completed));
}

function updateTaskInLocalStorage(oldText, isCompleted, newText = null) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((task) => {
    if (task.text === oldText) {
      return { text: newText || task.text, completed: isCompleted };
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTaskFromLocalStorage(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}











