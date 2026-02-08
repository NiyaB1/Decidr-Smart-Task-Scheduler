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

    const userPriority = taskPrioritySelect.value || null;

    const task = {
        id: Date.now().toString(),
        name,
        remainingTime: time,
        userPriority,          // 👈 user intent
        priority: null,        // 👈 system-calculated
        deadline: taskDeadlineInput.value || null,
        createdAt: Date.now(),
        isEditing: false
    };

    task.priority = calculatePriority(task);

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
        task.priority = calculatePriority(task);

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
                                    <option value="">auto</option>
                                    <option value="very-high" ${task.userPriority === "very-high" ? "selected" : ""}>
                                        very high
                                    </option>
                                    <option value="high" ${task.userPriority === "high" ? "selected" : ""}>high</option>
                                    <option value="medium" ${task.userPriority === "medium" ? "selected" : ""}>medium</option>
                                    <option value="low" ${task.userPriority === "low" ? "selected" : ""}>low</option>
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

        taskEl.querySelector(".btn-delete")?.addEventListener("click", () => {
            deleteTask(task.id);
        });

        taskEl.querySelector(".edit-btn")?.addEventListener("click", () => {
            task.isEditing = true;
            renderTasks();
        });

        taskEl.querySelector(".save-btn")?.addEventListener("click", () => {
            task.name = taskEl.querySelector(".edit-name").value.trim();
            task.remainingTime = parseInt(taskEl.querySelector(".edit-time").value, 10);

            const selectedUserPriority =
                taskEl.querySelector(".edit-priority").value || null;

            task.userPriority = selectedUserPriority;

            const newDeadline = taskEl.querySelector(".edit-deadline").value;
            task.deadline = newDeadline || null;

            task.priority = calculatePriority(task);
            task.isEditing = false;

            saveTasks();
            renderTasks();
        });

        taskEl.querySelector(".cancel-btn")?.addEventListener("click", () => {
            task.isEditing = false;
            renderTasks();
        });

        taskListEl.appendChild(taskEl);
    });

    saveTasks();
}

function resetForm() {
    taskNameInput.value = "";
    taskTimeInput.value = "";
    taskPrioritySelect.value = ""; // auto
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
    return new Date(deadlineStr).toLocaleString();
}

// ---------- PRIORITY ENGINE ----------
function calculatePriority(task) {
    // 🔒 User-forced override
    if (task.userPriority === "very-high") {
        return "very-high";
    }

    // Respect other explicit user priorities unless deadline escalates
    if (task.userPriority && !task.deadline) {
        return task.userPriority;
    }

    if (task.deadline) {
        const now = new Date();
        const deadline = new Date(task.deadline);
        const diffDays = (deadline - now) / (1000 * 60 * 60 * 24);

        if (diffDays <= 1) return "high";
        if (diffDays <= 3) return "medium";
        return task.userPriority || "low";
    }

    return task.userPriority || "low";
}