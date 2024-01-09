import { Project, ProjectStatus } from '../models/project';

// Project State, singleton, subscriber pattern
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
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
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      // use slice to make a copy
      listenerFn(this.projects.slice());
    }
  }

  moveProject(id: string, status: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === id);
    if (project && project.status !== status) {
      project.status = status;
      this.updateListeners();
    }
  }
}

// global state
export const projectState = ProjectState.getInstance();
