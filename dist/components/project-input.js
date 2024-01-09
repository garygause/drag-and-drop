var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from './base-component.js';
import { validate } from '../util/validation.js';
import { autobind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';
// ProjectInput class
export class ProjectInput extends Component {
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
            projectState.addProject(title, desc, people);
            this.clearInputs();
            console.log(title);
        }
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
