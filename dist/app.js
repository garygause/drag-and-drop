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
        const userPeople = this.peopleInputElement.value;
        // basic validation
        if (this.validateRequiredInputString(userTitle) &&
            this.validateRequiredInputString(userDescr) &&
            this.validateRequiredInputString(userPeople)) {
        }
        if (userTitle.trim().length === 0 ||
            userDescr.trim().length === 0 ||
            userPeople.trim().length === 0) {
            alert('Invalid input.');
            return;
        }
        else {
            return [userTitle, userDescr, +userPeople];
        }
    }
    clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    validateRequiredInputString(value) {
        if (value.trim().length === 0) {
            return false;
        }
        return true;
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.getUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title);
        }
        this.clearInputs();
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
