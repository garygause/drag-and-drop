import { Component } from './base-component.js';
import { DragTarget } from '../models/drag-drop.js';
import { Project, ProjectStatus } from '../models/project.js';
import { projectState } from '../state/project-state.js';
import { ProjectItem } from './project-item.js';
import { autobind } from '../decorators/autobind.js';

//ProjectList class
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
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

    // drag listeners
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);
  }

  private renderProjects() {
    this.element.querySelector('ul')!.innerHTML = '';

    for (const project of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    }
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listElement = this.element.querySelector('ul')!;
      listElement.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent): void {
    const id = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      id,
      this.projectType === 'active'
        ? ProjectStatus.Active
        : ProjectStatus.Finished
    );
    console.log(id);
  }

  @autobind
  dragLeaveHandler(event: DragEvent): void {
    const listElement = this.element.querySelector('ul')!;
    listElement.classList.remove('droppable');
  }
}
