// Component base class using generics
export class Component {
    constructor(templateId, hostElementId, insertAtBeginning, newElementId) {
        // setup access to dom elements
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        // import template content
        const importedNode = document.importNode(this.templateElement.content, true);
        // get template content
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtBeginning);
    }
    attach(insertAtBeginning) {
        /**
         * attach
         *
         * convenience method for rendering content
         */
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
    }
}
