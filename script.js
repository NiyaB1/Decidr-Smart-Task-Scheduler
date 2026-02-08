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
addTaskBtn.addEventListener("click", addTask);

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
        createdAt: Date.now()
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
                    <div class="task-name">${task.name}</div>

                    <div class="task-meta">
                        <span class="task-time">⏱ ${task.remainingTime} min</span>
                        <span class="task-priority priority-${task.priority}">
                            ${task.priority}
                        </span>
                        ${
                            task.deadline
                                ? `<span class="task-deadline">⏰ ${formatDeadline(task.deadline)}</span>`
                                : ""
                        }
                    </div>
                </div>

                <div class="task-actions">
                    <button class="btn-delete" title="Delete task">✕</button>
                </div>
            </div>
        `;

        taskEl.querySelector(".btn-delete").addEventListener("click", () => {
            deleteTask(task.id);
        });

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