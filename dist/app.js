"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
//ProjectList class
class ProjectList {
    constructor(projectType) {
        this.projectType = projectType;
        // setup access to dom elements
        this.templateElement = document.getElementById('project-list');
        this.hostElement = document.getElementById('app');
        // import template content
        const importedNode = document.importNode(this.templateElement.content, true);
        // get template content
        this.element = importedNode.firstElementChild;
        this.element.id = `${projectType}-projects`;
        this.attach();
        this.renderContent();
    }
    renderContent() {
        const listId = `${this.projectType}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent =
            this.projectType.toUpperCase() + 'PROJECTS';
    }
    attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
}
// ProjectInput class
class ProjectInput {
    constructor() {
        // setup access to dom elements
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        // import template content
        const importedNode = document.importNode(this.templateElement.content, true);
        // get template content
        this.element = importedNode.firstElementChild;
        this.element.id = 'user-input';
        // setup access to input elements
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.peopleInputElement = this.element.querySelector('#people');
        // render content in 'app'
        this.configure();
        this.attach();
    }
    // using a tuple or nothing on error
    // TODO: refactor to generic method and better error handling
    getUserInput() {
        const userTitle = this.titleInputElement.value;
        const userDescr = this.descriptionInputElement.value;
        const userPeople = +this.peopleInputElement.value;
        const validatableInputs = [
            { value: userTitle, required: true, minLength: 5 },
            { value: userDescr, required: true, minLength: 5 },
            { value: userPeople, required: true, min: 1 },
        ];
        // validation
        let isValid = true;
        for (let validatableInput of validatableInputs) {
            isValid = isValid && validate(validatableInput);
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
            this.clearInputs();
            console.log(title);
        }
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    attach() {
        /**
         * attach
         *
         * convenience method for rendering content
         */
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
