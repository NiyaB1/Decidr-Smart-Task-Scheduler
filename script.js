// ---------- STATE ----------
let tasks = [];

// ---------- DOM ELEMENTS ----------
const taskNameInput = document.getElementById("taskName");
const taskTimeInput = document.getElementById("taskTime");
const taskPrioritySelect = document.getElementById("taskPriority");
const taskDeadlineInput = document.getElementById("taskDeadline");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskListEl = document.getElementById("taskList");

// ---------- INITIAL LOAD ----------
loadTasks();
renderTasks();

// ---------- EVENT LISTENERS ----------
addTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
});

// ---------- FUNCTIONS ----------

function addTask() {
    const name = taskNameInput.value.trim();
    const time = parseInt(taskTimeInput.value, 10);

    if (!name || !time || time <= 0) {
        alert("Please enter a task name and valid time.");
        return;
    }

    const task = {
        id: Date.now().toString(),
        name,
        remainingTime: time,
        priority: taskPrioritySelect.value || "medium",
        deadline: taskDeadlineInput.value || null,
        createdAt: Date.now(),
        isEditing: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    resetForm();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

function renderTasks() {
    taskListEl.innerHTML = "";

    if (tasks.length === 0) {
        taskListEl.innerHTML = `<p class="empty-state">No tasks yet. Add one above!</p>`;
        return;
    }

    tasks.forEach(task => {
        const taskEl = document.createElement("div");
        taskEl.className = "task-item";

        taskEl.innerHTML = `
            <div class="task-header">
                <div class="task-info">

                    ${
                        task.isEditing
                            ? `<input class="edit-name" type="text" value="${task.name}" />`
                            : `<div class="task-name">${task.name}</div>`
                    }

                    <div class="task-meta">

                        ${
                            task.isEditing
                                ? `<input class="edit-time" type="number" value="${task.remainingTime}" />`
                                : `<span class="task-time">⏱ ${task.remainingTime} min</span>`
                        }

                        ${
                            task.isEditing
                                ? `
                                <select class="edit-priority">
                                    <option value="high" ${task.priority === "high" ? "selected" : ""}>high</option>
                                    <option value="medium" ${task.priority === "medium" ? "selected" : ""}>medium</option>
                                    <option value="low" ${task.priority === "low" ? "selected" : ""}>low</option>
                                </select>
                                `
                                : `<span class="task-priority priority-${task.priority}">
                                    ${task.priority}
                                   </span>`
                        }

                        ${
                            task.isEditing
                                ? `<input class="edit-deadline" type="datetime-local" value="${task.deadline || ""}" />`
                                : task.deadline
                                    ? `<span class="task-deadline">⏰ ${formatDeadline(task.deadline)}</span>`
                                    : ""
                        }

                    </div>
                </div>

                <div class="task-actions">
                    ${
                        task.isEditing
                            ? `
                              <button class="btn btn-success btn-small save-btn">Save</button>
                              <button class="btn btn-secondary btn-small cancel-btn">Cancel</button>
                              `
                            : `
                              <button class="btn btn-secondary btn-small edit-btn">Edit</button>
                              <button class="btn-delete" title="Delete task">✕</button>
                              `
                    }
                </div>
            </div>
        `;

        // DELETE
        const deleteBtn = taskEl.querySelector(".btn-delete");
        if (deleteBtn) {
            deleteBtn.addEventListener("click", () => deleteTask(task.id));
        }

        // EDIT
        const editBtn = taskEl.querySelector(".edit-btn");
        if (editBtn) {
            editBtn.addEventListener("click", () => {
                task.isEditing = true;
                renderTasks();
            });
        }

        // SAVE
        const saveBtn = taskEl.querySelector(".save-btn");
        if (saveBtn) {
            saveBtn.addEventListener("click", () => {
                task.name = taskEl.querySelector(".edit-name").value.trim();
                task.remainingTime = parseInt(taskEl.querySelector(".edit-time").value, 10);
                task.priority = taskEl.querySelector(".edit-priority").value;

                const newDeadline = taskEl.querySelector(".edit-deadline").value;
                task.deadline = newDeadline || null;

                task.isEditing = false;

                saveTasks();
                renderTasks();
            });
        }

        // CANCEL
        const cancelBtn = taskEl.querySelector(".cancel-btn");
        if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
                task.isEditing = false;
                renderTasks();
            });
        }

        taskListEl.appendChild(taskEl);
    });
}

function resetForm() {
    taskNameInput.value = "";
    taskTimeInput.value = "";
    taskPrioritySelect.value = "medium";
    taskDeadlineInput.value = "";
}

// ---------- STORAGE ----------
function saveTasks() {
    localStorage.setItem("decidr_tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem("decidr_tasks");
    tasks = saved ? JSON.parse(saved) : [];
}

// ---------- HELPERS ----------
function formatDeadline(deadlineStr) {
    const date = new Date(deadlineStr);
    return date.toLocaleString();
}