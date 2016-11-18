/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import {CompositeDisposable, TextEditor} from 'atom'
import fs from 'fs'
import path from 'path'
import escapeJSON from 'escape-json-node'


export default class SnippetCreatorView {
  constructor (props, children) {
    this.props = props;

    etch.initialize(this)
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add(this.element, {
      'snippet-creator:close': () => this.cancel(),
      'snippet-creator:tabNext': () => this.tab()
    }));
  }

  render () {
    return (
      <div className="snippet-creator">
      <h2 class='block'>Snippet Creator</h2>
          <div className='snippet-creator-editor' id="PrefixEditor">
            <TextEditor
              mini={true}
              tabLength={2}
              softTabs={true}
              softWrapped={false}
              ref='prefix'
              placeholderText='Prefix / Snippet Name'
            />
          </div>
          <div className='snippet-creator-editor' ref="descriptionEditor">
            <TextEditor
              mini={true}
              tabLength={2}
              softTabs={true}
              softWrapped={false}
              ref='description'
              placeholderText='Description'
            />
          </div>
          <div className='snippet-creator-editor' tabindex="1" ref="sourceEditor">
            <TextEditor
              mini={true}
              ref='source'
              softWrapped={true}
              placeholderText='Source Type'
              lineNumberGutterVisible={false}
              showInvisibles={false}
              autoHeight={false}
              scrollPastEnd={false}
            />
          </div>
          <div className='block'>
            <a href="#" onclick={this.viewSourceTypes.bind(this)} className="btn">View Supported Source Types</a>
          </div>
          <div className='snippet-creator-editor textarea' ref="descriptionEditor">
            <TextEditor
              ref='body'
              softWrapped={true}
              placeholderText='Body'
              lineNumberGutterVisible={false}
              showInvisibles={false}
              autoHeight={false}
              scrollPastEnd={false}
            />
          </div>
        <a href="#" onclick={this.save.bind(this)} className="btn">Save</a>
        <a href="#" onclick={this.cancel.bind(this)} className="btn">Cancel</a>
        <a href="#" onclick={this.openFile.bind(this)} className="btn">Open snippets file</a>
      </div>
    )
  }
  tab(){

  }
  viewSourceTypes(){
    editor = atom.workspace.open().then(
      function(result){
      grammar = Object.keys(atom.grammars.grammarsByScopeName);
      grammar.push("*");
      result.setText(grammar.sort().join('\n'));
    })
  }
  getSnippetFile(){
    return path.join(atom.configDirPath, "snippets.json");
    //return path.join(atom.packages.getActivePackage('snippet-creator').path, 'snippets.json');
  }
  openFile(){
    atom.open({pathsToOpen: [this.getSnippetFile()]})
  }
  save() {
    prefixText = this.refs.prefix.getText();
    descriptionText = this.refs.description.getText();
    sourceText = "."+this.refs.source.getText();
    bodyText = this.convertBody(this.refs.body.getText());
    //Error checking, we can do better later.
    if (!(prefixText && descriptionText && sourceText && bodyText)){
      atom.notifications.addWarning("Saving Snippet Failed.  All fields are required.");
      return;
    }

    var fileName = this.getSnippetFile();
    //If snippets.json doesn't exist and snippets.cson does, we should convert it over.  Eventually we should save this somewhere else, and reload it every time we save.
    fs.exists(fileName, function(exists) {
      that = this;
      if (exists) {
        fs.readFile(fileName, 'utf8', function (err, data) {
                if (err){
                   throw err;
                }
                console.log(data);
                snippets = JSON.parse(data);
                if (!snippets[sourceText]){
                  snippets[sourceText] = {}
                }
                snippets[sourceText][descriptionText] =
                {
                  "prefix": prefixText,
                  "body": bodyText
                }
                console.log(snippets);
                console.log(JSON.stringify(snippets));

                fs.writeFile(fileName, JSON.stringify(snippets, null, 4), (err) => {
                  if (err) throw err;
                  console.log('It\'s saved!');
                });jslog
            }
        );
      }
    });

    this.cancel();
    atom.packages.getActivePackage("snippets").mainModule.loadSnippetsFile(this.getSnippetFile(), function(snippets)
    {
        console.log(snippets);
    });
    // this.props.hide();
  }
  cancel(){
    console.log("Cancelling!");
    this.refs.prefix.setText("");
    this.refs.source.setText("");

    this.refs.description.setText("");
    this.refs.body.setText("");
    this.props.hide();

  }

  convertBody(snippetBody){
    ///TODO: JSON formatting text sucks.  Even the library that I'm using has bugs... Need to revisit this to fix the formatting issue.
    text = snippetBody;
    return escapeJSON(text);
  }
  // Required: Update the component with new properties and children.
  update (props, children) {
    this.refs.body.setText(atom.workspace.getActiveTextEditor().getLastSelection().getText());
    return etch.update(this)
  }

  // Optional: Destroy the component. Async/await syntax is pretty but optional.
  async destroy () {
    // call etch.destroy to remove the element and destroy child components
    await etch.destroy(this)
    // then perform custom teardown logic here...
  }
}
