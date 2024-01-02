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
    const userPeople = this.peopleInputElement.value;

    // basic validation
    if (
      this.validateRequiredInputString(userTitle) &&
      this.validateRequiredInputString(userDescr) &&
      this.validateRequiredInputString(userPeople)
    ) {
    }
    if (
      userTitle.trim().length === 0 ||
      userDescr.trim().length === 0 ||
      userPeople.trim().length === 0
    ) {
      alert('Invalid input.');
      return;
    } else {
      return [userTitle, userDescr, +userPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  private validateRequiredInputString(value: string) {
    if (value.trim().length === 0) {
      return false;
    }
    return true;
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.getUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title);
    }
    this.clearInputs();
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
