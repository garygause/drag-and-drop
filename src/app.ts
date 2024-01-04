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

// ProjectStatus enum
enum ProjectStatus {
  Active,
  Finished,
}

// Project class
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project State, singleton, subscriber pattern
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random.toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(newProject);

    for (const listenerFn of this.listeners) {
      // use slice to make a copy
      listenerFn(this.projects.slice());
    }
  }
}

// global state
const projectState = ProjectState.getInstance();

interface Validatable {
  value: string | number | boolean;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(input: Validatable): boolean {
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

// Component base class using generics
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtBeginning: boolean,
    newElementId?: string
  ) {
    // setup access to dom elements
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    // import template content
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    // get template content
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtBeginning);
  }

  private attach(insertAtBeginning: boolean) {
    /**
     * attach
     *
     * convenience method for rendering content
     */
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

//ProjectList class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private projectType: 'active' | 'finished') {
    super('project-list', 'app', false, `${projectType}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  renderContent() {
    const listId = `${this.projectType}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.projectType.toUpperCase() + ' PROJECTS';
  }

  configure() {
    // setup listener for state
    projectState.addListener((projects: Project[]) => {
      // filter projects by list type
      this.assignedProjects = projects.filter((item) => {
        if (this.projectType === 'active') {
          return item.status === ProjectStatus.Active;
        }
        return item.status === ProjectStatus.Finished;
      });
      this.renderProjects();
    });
  }

  private renderProjects() {
    this.element.querySelector('ul')!.innerHTML = '';

    for (const project of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    }
  }
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  constructor(public hostId: string, private project: Project) {
    super('single-project', hostId, false, project.id);
    this.configure();
    this.renderContent();
  }

  configure(): void {}

  renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent =
      this.project.people.toString() + ' people';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

// ProjectInput class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
