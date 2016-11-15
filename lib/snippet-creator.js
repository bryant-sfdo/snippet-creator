'use babel';

import SnippetCreatorView from './snippet-creator-view';
import { CompositeDisposable } from 'atom';

export default {

  snippetCreatorView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.snippetCreatorView = new SnippetCreatorView(state.snippetCreatorViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.snippetCreatorView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'snippet-creator:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.snippetCreatorView.destroy();
  },

  serialize() {
    return {
      snippetCreatorViewState: this.snippetCreatorView.serialize()
    };
  },

  toggle() {
    console.log('SnippetCreator was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
