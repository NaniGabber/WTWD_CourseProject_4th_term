
const main = document.querySelector(".tasker");

const filterFunc = (e) => {
    let tasks = document.querySelectorAll('.task');
    switch (e.target.value) {
        case "in_progress":
            tasks.forEach(e => e.style.display = e.className.includes("task_added") ? "block" : "none");
            break;
        case "done":
            tasks.forEach(e => e.style.display = e.className.includes("task_done") ? "block" : "none");
            break;
        case "deleted":
            tasks.forEach(e => e.style.display = e.className.includes("task_deleted") ? "block" : "none");
            break;
        default:
            tasks.forEach(e => e.style.display = "block");
    }
    
    let addField = document.querySelector('.addButton');
    if(addField)
            addField.parentElement.style.display = "block";
}

class Task {

    constructor() {
        this.elementsInit();
        this.elementsAppend();
    }

    elementsInit() {
        this.input = document.createElement('input');
        this.input.className = "taskInput";
        this.input.placeholder = "Please, input your task here.";
        this.inputConfig();

        this.button = document.createElement('button');
        this.button.className = "taskButton addButton"
        this.button.disabled = true;
        this.buttonConfig();

        this.dateField = document.createElement('div');
        this.dateField.className = "task-date";

    }

    inputConfig() {
        this.input.addEventListener("focus", this.inputEvent);
        this.input.addEventListener("input", this.inputEvent);
    }

    elementsAppend() {
        this.fatherDiv = document.createElement('div');
        this.fatherDiv.className = "task"
        this.fatherDiv.append(this.input);
        this.fatherDiv.append(this.button);
        this.fatherDiv.append(this.dateField);
        main.prepend(this.fatherDiv);

    }
    buttonConfig() {
        this.button.addEventListener("click", this.buttonClick);
    }

    inputEvent(event) {
        let button = event.currentTarget.parentNode.querySelector(".taskButton");
        if (event.currentTarget.value == "") {
            button.disabled = true;
            button.style.cssText = "background-color:grey";
        }
        else {
            button.disabled = false;
            button.style.cssText = "background-color:rgba(0, 255, 34, 0.836);";
        }
    }

    

    buttonClick(event) {
    const getDate = () => new Date().toLocaleDateString("en-US" , {
        year: 'numeric',
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false}); 
    
        let taskdate = event.currentTarget.parentNode.querySelector(".task-date");
        let input = event.currentTarget.parentNode.querySelector(".taskInput");
        if (event.currentTarget.className.includes("addButton")) {
            event.currentTarget.className = event.currentTarget.className.replace("addButton", "doneButton");
            event.currentTarget.style.backgroundColor = 'black';
            input.disabled = true;
           taskdate.textContent = "Task Added: " + getDate();
           taskdate.style.display = "inline-block";
            event.currentTarget.parentNode.className += " task_added";
            input.placeholder = "";
            filterFunc({target:{value: document.querySelector("#filter-by-status-form").value}})

            let newTask = new Task();
        }
        else if (event.currentTarget.className.includes("doneButton")) {
            taskdate.textContent = "Task Done: " + getDate();
            event.currentTarget.className = event.currentTarget.className.replace("doneButton", "removeButton");
            event.currentTarget.style.cssText = "background-color:rgba(255, 0, 0, 0.836)"
            event.currentTarget.parentNode.className = event.currentTarget.parentNode.className.replace("task_added", "task_done");
        }

        else {
            taskdate.textContent = "Task Deleted: " + getDate();
            input.style.textDecoration = "line-through red";
            input.style.width = "444px";
            main.append(event.currentTarget.parentNode);
            event.currentTarget.parentNode.className = event.currentTarget.parentNode.className.replace("task_done", "task_deleted");
            event.currentTarget.remove();
            delete this;
        }
    }
}

let task = new Task();


//////////////////FILTER/////////////////////////////

    
    

document.querySelector("#filter-by-status-form").addEventListener("change", filterFunc);