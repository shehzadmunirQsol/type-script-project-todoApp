"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var todoItem_1 = require("./todoItem");
var inquirer = __importStar(require("inquirer"));
var jsonTodoCollection_1 = require("./jsonTodoCollection");
var todos = [
    new todoItem_1.TodoItem(1, "Buy Flowers"), new todoItem_1.TodoItem(2, "Get Shoes"),
    new todoItem_1.TodoItem(3, "Collect Tickets"), new todoItem_1.TodoItem(4, "Call Joe", true)
];
//let collection: TodoCollection = new TodoCollection("Adam", todos);
var collection = new jsonTodoCollection_1.JsonTodoCollection("Adam", todos);
var showCompleted = true;
function displayTodoList() {
    console.log(collection.userName + "'s Todo List "
        + ("(" + collection.getItemCounts().incomplete + " items to do)"));
    collection.getTodoItems(showCompleted).forEach(function (item) { return item.printDetails(); });
}
var Commands;
(function (Commands) {
    Commands["Add"] = "Add New Task";
    Commands["Complete"] = "Complete Task";
    Commands["Toggle"] = "Show/Hide Completed";
    Commands["Purge"] = "Remove Completed Tasks";
    Commands["Quit"] = "Quit";
})(Commands || (Commands = {}));
function promptComplete() {
    console.clear();
    inquirer.default.prompt({ type: "checkbox", name: "complete",
        message: "Mark Tasks Complete", choices: collection.getTodoItems(showCompleted).map(function (item) {
            return ({ name: item.task, value: item.id, checked: item.complete });
        })
    }).then(function (answers) {
        var completedTasks = answers["complete"];
        collection.getTodoItems(true).forEach(function (item) {
            return collection.markComplete(item.id, completedTasks.find(function (id) { return id === item.id; }) != undefined);
        });
        promptUser();
    });
}
function promptAdd() {
    console.clear();
    inquirer.default.prompt({ type: "input", name: "add", message: "Enter task:" })
        .then(function (answers) {
        if (answers["add"] !== "") {
            collection.addTodo(answers["add"]);
        }
        promptUser();
    });
}
function promptUser() {
    console.clear();
    displayTodoList();
    inquirer.default.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Commands),
    }).then(function (answers) {
        switch (answers["command"]) {
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser();
                break;
            case Commands.Add:
                promptAdd();
                break;
            case Commands.Complete:
                if (collection.getItemCounts().incomplete > 0) {
                    promptComplete();
                }
                else {
                    promptUser();
                }
                break;
            case Commands.Purge:
                collection.removeComplete();
                promptUser();
                break;
        }
    });
}
promptUser();
// console.clear();
// console.log(`${collection.userName}'s Todo List`);
// //collection.removeComplete();
// console.log(`${collection.userName}'s Todo List `
// + `(${ collection.getItemCounts().incomplete } items to do)`);
// collection.getTodoItems(true).forEach(item => item.printDetails());
