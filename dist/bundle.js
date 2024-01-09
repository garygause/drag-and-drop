"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    // ProjectStatus enum
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
    // Project class
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
    class State {
        constructor() {
            this.listeners = [];
        }
        addListener(listenerFn) {
            this.listeners.push(listenerFn);
        }
    }
    class ProjectState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance;
        }
        addProject(title, description, people) {
            const newProject = new App.Project(Math.random().toString(), title, description, people, App.ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
        }
        updateListeners() {
            for (const listenerFn of this.listeners) {
                // use slice to make a copy
                listenerFn(this.projects.slice());
            }
        }
        moveProject(id, status) {
            const project = this.projects.find((prj) => prj.id === id);
            if (project && project.status !== status) {
                project.status = status;
                this.updateListeners();
            }
        }
    }
    App.ProjectState = ProjectState;
    // global state
    App.projectState = ProjectState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
    function validate(input) {
        if (input.required) {
            if (input.value.toString().trim().length === 0) {
                return false;
            }
        }
        if (input.minLength && typeof input.value === 'string') {
            if (input.value.trim().length < input.minLength) {
                return false;
            }
        }
        if (input.maxLength && typeof input.value === 'string') {
            if (input.value.trim().length > input.maxLength) {
                return false;
            }
        }
        if (input.min && typeof input.value === 'number') {
            if (input.value < input.min) {
                return false;
            }
        }
        if (input.max && typeof input.value === 'number') {
            if (input.value > input.max) {
                return false;
            }
        }
        return true;
    }
    App.validate = validate;
})(App || (App = {}));
var App;
(function (App) {
    // autobind decorator, autobind 'this'
    function autobind(target, methodName, descriptor) {
        const originalMethod = descriptor.value;
        const adjDescriptor = {
            configurable: true,
            get() {
                const boundFn = originalMethod.bind(this);
                return boundFn;
            },
        };
        return adjDescriptor;
    }
    App.autobind = autobind;
})(App || (App = {}));
var App;
(function (App) {
    // Component base class using generics
    class Component {
        constructor(templateId, hostElementId, insertAtBeginning, newElementId) {
            // setup access to dom elements
            this.templateElement = document.getElementById(templateId);
            this.hostElement = document.getElementById(hostElementId);
            // import template content
            const importedNode = document.importNode(this.templateElement.content, true);
            // get template content
            this.element = importedNode.firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach(insertAtBeginning);
        }
        attach(insertAtBeginning) {
            /**
             * attach
             *
             * convenience method for rendering content
             */
            this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
        }
    }
    App.Component = Component;
})(App || (App = {}));
/// <reference path="base-component.ts" />
var App;
(function (App) {
    // ProjectInput class
    class ProjectInput extends App.Component {
        constructor() {
            super('project-input', 'app', true, 'user-input');
            // setup access to input elements
            this.titleInputElement = this.element.querySelector('#title');
            this.descriptionInputElement = this.element.querySelector('#description');
            this.peopleInputElement = this.element.querySelector('#people');
            // render content in 'app'
            this.configure();
            this.renderContent();
        }
        configure() {
            this.element.addEventListener('submit', this.submitHandler);
        }
        renderContent() { }
        // using a tuple or nothing on error
        // TODO: refactor to generic method and better error handling
        getUserInput() {
            const userTitle = this.titleInputElement.value;
            const userDescr = this.descriptionInputElement.value;
            const userPeople = +this.peopleInputElement.value;
            const validatableInputs = [
                { value: userTitle, required: true, minLength: 3 },
                { value: userDescr, required: true, minLength: 3 },
                { value: userPeople, required: true, min: 1 },
            ];
            // validation
            let isValid = true;
            for (let validatableInput of validatableInputs) {
                isValid = isValid && App.validate(validatableInput);
            }
            if (isValid) {
                return [userTitle, userDescr, userPeople];
            }
            alert('Invalid input.');
            return;
        }
        clearInputs() {
            this.titleInputElement.value = '';
            this.descriptionInputElement.value = '';
            this.peopleInputElement.value = '';
        }
        submitHandler(event) {
            event.preventDefault();
            const userInput = this.getUserInput();
            if (Array.isArray(userInput)) {
                const [title, desc, people] = userInput;
                App.projectState.addProject(title, desc, people);
                this.clearInputs();
                console.log(title);
            }
        }
    }
    __decorate([
        App.autobind
    ], ProjectInput.prototype, "submitHandler", null);
    App.ProjectInput = ProjectInput;
})(App || (App = {}));
/// <reference path="base-component.ts" />
var App;
(function (App) {
    //ProjectList class
    class ProjectList extends App.Component {
        constructor(projectType) {
            super('project-list', 'app', false, `${projectType}-projects`);
            this.projectType = projectType;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        renderContent() {
            const listId = `${this.projectType}-projects-list`;
            this.element.querySelector('ul').id = listId;
            this.element.querySelector('h2').textContent =
                this.projectType.toUpperCase() + ' PROJECTS';
        }
        configure() {
            // setup listener for state
            App.projectState.addListener((projects) => {
                // filter projects by list type
                this.assignedProjects = projects.filter((item) => {
                    if (this.projectType === 'active') {
                        return item.status === App.ProjectStatus.Active;
                    }
                    return item.status === App.ProjectStatus.Finished;
                });
                this.renderProjects();
            });
            // drag listeners
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            this.element.addEventListener('drop', this.dropHandler);
        }
        renderProjects() {
            this.element.querySelector('ul').innerHTML = '';
            for (const project of this.assignedProjects) {
                new App.ProjectItem(this.element.querySelector('ul').id, project);
            }
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const listElement = this.element.querySelector('ul');
                listElement.classList.add('droppable');
            }
        }
        dropHandler(event) {
            const id = event.dataTransfer.getData('text/plain');
            App.projectState.moveProject(id, this.projectType === 'active'
                ? App.ProjectStatus.Active
                : App.ProjectStatus.Finished);
            console.log(id);
        }
        dragLeaveHandler(event) {
            const listElement = this.element.querySelector('ul');
            listElement.classList.remove('droppable');
        }
    }
    __decorate([
        App.autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        App.autobind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        App.autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    App.ProjectList = ProjectList;
})(App || (App = {}));
/// <reference path="base-component.ts" />
var App;
(function (App) {
    class ProjectItem extends App.Component {
        get people() {
            return this.project.people === 1
                ? '1 person'
                : `${this.project.people} people`;
        }
        constructor(hostId, project) {
            super('single-project', hostId, false, project.id);
            this.hostId = hostId;
            this.project = project;
            this.configure();
            this.renderContent();
        }
        configure() {
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector('h2').textContent = this.project.title;
            this.element.querySelector('h3').textContent = this.people;
            this.element.querySelector('p').textContent = this.project.description;
        }
        dragStartHandler(event) {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        }
        dragEndHandler(event) { }
    }
    __decorate([
        App.autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        App.autobind
    ], ProjectItem.prototype, "dragEndHandler", null);
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
/// <reference path="models/drag-drop.ts" />
/// <reference path="models/project.ts" />
/// <reference path="state/project-state.ts" />
/// <reference path="util/validation.ts" />
/// <reference path="decorators/autobind.ts" />
/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />
/// <reference path="components/project-item.ts" />
var App;
(function (App) {
    new App.ProjectInput();
    new App.ProjectList('active');
    new App.ProjectList('finished');
})(App || (App = {}));
