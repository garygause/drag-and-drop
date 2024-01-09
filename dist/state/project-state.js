import { Project, ProjectStatus } from '../models/project.js';
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class ProjectState extends State {
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
        const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
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
// global state
export const projectState = ProjectState.getInstance();
