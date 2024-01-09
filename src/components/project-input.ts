import { Component } from './base-component';
import { validate, Validatable } from '../util/validation';
import { autobind } from '../decorators/autobind';
import { projectState } from '../state/project-state';

// ProjectInput class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    // setup access to input elements
    this.titleInputElement = this.element.querySelector(
      '#title'
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    )! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      '#people'
    )! as HTMLInputElement;

    // render content in 'app'
    this.configure();
    this.renderContent();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() {}

  // using a tuple or nothing on error
  // TODO: refactor to generic method and better error handling
  private getUserInput(): [string, string, number] | void {
    const userTitle = this.titleInputElement.value;
    const userDescr = this.descriptionInputElement.value;
    const userPeople = +this.peopleInputElement.value;

    const validatableInputs: Validatable[] = [
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

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event) {
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
