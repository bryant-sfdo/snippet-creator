'use babel';

export default class SnippetCreatorView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('snippet-creator');

    // Create message element
    const message = document.createElement('div');

    message.textContent = 'The SnippetCreator package is Alive! It\'s ALIVE!';
    selection = atom.workspace.getActiveTextEditor().getLastSelection();
    // message.textContent += selection.getText();
    console.log(selection.getText());
    message.textContent += selection.getText();

    message.classList.add('message');

    this.element.appendChild(message);

    const button = document.createElement('button')

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
