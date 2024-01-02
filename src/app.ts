// autobind decorator, autobind 'this'
function autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

interface Validatable {
  value: string | number | boolean;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// ProjectInput class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // setup access to dom elements
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    // import template content
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    // get template content
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

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
    this.attach();
  }

  // using a tuple or nothing on error
  // TODO: refactor to generic method and better error handling
  private getUserInput(): [string, string, number] | void {
    const userTitle = this.titleInputElement.value;
    const userDescr = this.descriptionInputElement.value;
    const userPeople = +this.peopleInputElement.value;

    const validatableInputs: Validatable[] = [
      { value: userTitle, required: true, minLength: 5 },
      { value: userDescr, required: true, minLength: 5 },
      { value: userPeople, required: true, min: 0 },
    ];

    // validation
    let isValid = true;
    for (let validatableInput of validatableInputs) {
      isValid = isValid && this.validate(validatableInput);
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

  private validate(input: Validatable): boolean {
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

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.getUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      this.clearInputs();
      console.log(title);
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    /**
     * attach
     *
     * convenience method for rendering content
     */
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const projectInput = new ProjectInput();
