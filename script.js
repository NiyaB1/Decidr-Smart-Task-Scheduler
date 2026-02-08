// ---------- STATE ----------
let tasks = [];

// ---------- DOM ELEMENTS ----------
const taskNameInput = document.getElementById("taskName");
const taskTimeInput = document.getElementById("taskTime");
const taskPrioritySelect = document.getElementById("taskPriority");
const taskDeadlineInput = document.getElementById("taskDeadline");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskListEl = document.getElementById("taskList");
const availableTimeInput = document.getElementById("availableTime");
const getSuggestionBtn = document.getElementById("getSuggestionBtn");
const suggestionBox = document.getElementById("suggestionBox");
const suggestionContent = document.getElementById("suggestionContent");

// ---------- INITIAL LOAD ----------
loadTasks();
renderTasks();

// ---------- EVENT LISTENERS ----------
addTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
});

getSuggestionBtn.addEventListener("click", () => {
    suggestTask();
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
        userPriority,      // user intent
        priority: null,    // system-calculated
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

function suggestTask() {
    const availableMinutes = parseInt(availableTimeInput.value, 10);

    if (!availableMinutes || availableMinutes <= 0) {
        alert("Please enter how many minutes you have.");
        return;
    }

    if (tasks.length === 0) {
        alert("No tasks available.");
        return;
    }

    // Recalculate priorities
    tasks.forEach(task => {
        task.priority = calculatePriority(task);
    });

    // Sort using Decide-Now logic
    const sortedTasks = sortTasksForNow(tasks);

    // Find first task that fits time
    const taskToDo = sortedTasks.find(
        task => task.remainingTime <= availableMinutes
    );

    if (!taskToDo) {
        suggestionContent.innerHTML = `
            <p>No task fits within ${availableMinutes} minutes.</p>
        `;
    } else {
        suggestionContent.innerHTML = `
            <div class="suggested-task">
                <h3>${taskToDo.name}</h3>
                <p>⏱ ${taskToDo.remainingTime} min</p>
                <p class="task-priority priority-${taskToDo.priority}">
                    ${taskToDo.priority}
                </p>
                ${
                    taskToDo.deadline
                        ? `<p>⏰ ${formatDeadline(taskToDo.deadline)}</p>`
                        : ""
                }
            </div>
        `;
    }

    suggestionBox.classList.remove("hidden");
}

// ---------- RENDER ----------
function renderTasks() {
    taskListEl.innerHTML = "";

    if (tasks.length === 0) {
        taskListEl.innerHTML = `<p class="empty-state">No tasks yet. Add one above!</p>`;
        return;
    }

    // 🔁 Recalculate priority on every render
    tasks.forEach(task => {
        task.priority = calculatePriority(task);
    });

    // 🧠 Decide-Now sorting
    const sortedTasks = sortTasksForNow(tasks);

    sortedTasks.forEach(task => {
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
            task.userPriority = taskEl.querySelector(".edit-priority").value || null;
            task.deadline = taskEl.querySelector(".edit-deadline").value || null;

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
    taskPrioritySelect.value = "";
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
    // 🔒 user-forced very-high
    if (task.userPriority === "very-high") {
        return "very-high";
    }

    const now = new Date();

    if (task.deadline) {
        const deadline = new Date(task.deadline);
        const diffHours = (deadline - now) / (1000 * 60 * 60);

        if (diffHours <= 24) return "high";
        if (diffHours <= 72) return "medium";
        return task.userPriority || "low";
    }

    return task.userPriority || "low";
}

// ---------- DECIDE-NOW SORT ----------
function getPriorityWeight(priority) {
    switch (priority) {
        case "very-high": return 4;
        case "high": return 3;
        case "medium": return 2;
        case "low": return 1;
        default: return 1;
    }
}

function sortTasksForNow(taskList) {
    return [...taskList].sort((a, b) => {
        // 1. Priority
        const pDiff =
            getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
        if (pDiff !== 0) return pDiff;

        // 2. Deadline
        if (a.deadline && b.deadline) {
            const dDiff = new Date(a.deadline) - new Date(b.deadline);
            if (dDiff !== 0) return dDiff;
        } else if (a.deadline) {
            return -1;
        } else if (b.deadline) {
            return 1;
        }

        // 3. Remaining time
        if (a.remainingTime !== b.remainingTime) {
            return a.remainingTime - b.remainingTime;
        }

        // 4. Created time
        return a.createdAt - b.createdAt;
    });
}