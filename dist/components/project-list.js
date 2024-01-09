var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from './base-component.js';
import { ProjectStatus } from '../models/project.js';
import { projectState } from '../state/project-state.js';
import { ProjectItem } from './project-item.js';
import { autobind } from '../decorators/autobind.js';
//ProjectList class
export class ProjectList extends Component {
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
        projectState.addListener((projects) => {
            // filter projects by list type
            this.assignedProjects = projects.filter((item) => {
                if (this.projectType === 'active') {
                    return item.status === ProjectStatus.Active;
                }
                return item.status === ProjectStatus.Finished;
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
            new ProjectItem(this.element.querySelector('ul').id, project);
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
        projectState.moveProject(id, this.projectType === 'active'
            ? ProjectStatus.Active
            : ProjectStatus.Finished);
        console.log(id);
    }
    dragLeaveHandler(event) {
        const listElement = this.element.querySelector('ul');
        listElement.classList.remove('droppable');
    }
}
__decorate([
    autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dropHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dragLeaveHandler", null);
