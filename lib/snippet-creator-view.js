/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import {CompositeDisposable, TextEditor} from 'atom'
import fs from 'fs'
import path from 'path'

export default class SnippetCreatorView {
  constructor (props, children) {
    this.props = props;

    etch.initialize(this)
  }


  render () {
    return (
      <div className="snippet-creator">
      <h2 class='block'>Snippet Creator<span class='badge badge-flexible'>2</span></h2>
            <div className='snippet-creator-editor'>
              <TextEditor
                mini={true}
                ref='prefix'
                softWrapped={true}
                placeholderText='Prefix / Snippet Name'
                lineNumberGutterVisible={false}
                showInvisibles={false}
                autoHeight={false}
                scrollPastEnd={false}
              />
            </div>
            <div className='snippet-creator-editor'>
              <TextEditor
                mini={true}
                ref='description'
                softWrapped={true}
                placeholderText='Description'
                lineNumberGutterVisible={false}
                showInvisibles={false}
                autoHeight={false}
                scrollPastEnd={false}
              />
            </div>
        <div>

        <label>
        	Source Type:&nbsp;&nbsp;
              <select ref="source" id="sourceTypes">
                <option>*</option>
                <option>source.c</option>
                <option>source.cake</option>
                <option>source.clojure</option>
                <option>source.coffee</option>
                <option>source.cpp</option>
                <option>source.cs</option>
                <option>source.css</option>
                <option>source.css.less</option>
                <option>source.css.scss</option>
                <option>source.csx</option>
                <option>source.gfm</option>
                <option>source.git-config</option>
                <option>source.go</option>
                <option>source.gotemplate</option>
                <option>source.java</option>
                <option>source.java-properties</option>
                <option>source.js</option>
                <option>source.js.rails</option>
                <option>source.js.jquery</option>
                <option>source.js.regexp</option>
                <option>source.js.regexp.replacement</option>
                <option>source.json</option>
                <option>source.litcoffee</option>
                <option>source.makefile</option>
                <option>source.nant-build</option>
                <option>source.objc</option>
                <option>source.objcpp</option>
                <option>source.perl</option>
                <option>source.perl6</option>
                <option>source.plist</option>
                <option>source.python</option>
                <option>source.regexp.python</option>
                <option>source.ruby</option>
                <option>source.ruby.rails</option>
                <option>source.ruby.rails.rjs</option>
                <option>source.sass</option>
                <option>source.shell</option>
                <option>source.sql</option>
                <option>source.sql.mustache</option>
                <option>source.sql.ruby</option>
                <option>source.strings</option>
                <option>source.toml</option>
                <option>source.yaml</option>
                <option>text.git-commit</option>
                <option>text.git-rebase</option>
                <option>text.html.basic</option>
                <option>text.html.erb</option>
                <option>text.html.gohtml</option>
                <option>text.html.jsp</option>
                <option>text.html.mustache</option>
                <option>text.html.php</option>
                <option>text.html.ruby</option>
                <option>text.hyperlink</option>
                <option>text.junit-test-report</option>
                <option>text.plain</option>
                <option>text.plain.null-grammar</option>
                <option>text.python.console</option>
                <option>text.python.traceback</option>
                <option>text.shell-session</option>
                <option>text.todo</option>
                <option>text.xml</option>
                <option>text.xml.plist</option>
                <option>text.xml.xsl</option>
              </select>
        </label>
        </div>
        <div className='block'>
            <a href="#"><span className='badge badge-success icon icon-zap'>Placeholder</span></a>
        </div>
        <div className='snippet-creator-editor textarea'>
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
  getSnippetFile(){
    return path.join(atom.packages.getActivePackage('snippet-creator').path, 'snippets.json');
  }
  openFile(){
    atom.open({pathsToOpen: [this.getSnippetFile()]})
  }
  /// NODE fs module. fs.readfile.
  save() {
    var fileName = this.getSnippetFile();
    //If snippets.json doesn't exist and snippets.cson does, we should convert it over.  Eventually we should save this somewhere else, and reload it every time we save.
    fs.exists(fileName, function(exists) {
      if (exists) {
        fs.readFile(fileName, 'utf8', function (err, data) {
                if (err){
                   throw err;
                }
                console.log(data);
                this.snippets = JSON.parse(data);
            }
        );
        console.log(this.snippets);

      }
    });

    console.log("SAVE!");
    console.log(this.refs.prefix.getText());
    console.log(this.refs.description.getText());

    atom.packages.getActivePackage("snippets").mainModule.loadSnippetsFile(this.getSnippetFile(), function(){})
    this.refs.description.setText("");
    this.props.hide();
  }

  cancel(){
    console.log("Cancelling!");
    this.refs.prefix.setText("");
    this.refs.description.setText("");
    this.refs.body.setText("");
    this.props.hide();

  }

  convertBody(snippetBody){
    body = snippetBody.replace(/\n/g, '\n');
		var tabLength = atom.config.get('editor').tabLength;
		var tabReplaceRegex = new RegExp("\\s{" + tabLength + "}", ['g']);
		body = body.replace(tabReplaceRegex, '\\t');
		body = body.replace(/\t/g, "\\t");
		body = body.replace(/\"/g, '\\\"');
    body = body.replace(/\\/g, '\\\\');
    body = body.replace(/\//g, '\\\/');
    return body;
  }

  saveSnippets(fileType, prefix, description, body, currentFile){

  }
  // Required: Update the component with new properties and children.
  update (props, children) {
    this.refs.body.setText(this.convertBody(atom.workspace.getActiveTextEditor().getLastSelection().getText()));
    return etch.update(this)
  }

  // Optional: Destroy the component. Async/await syntax is pretty but optional.
  async destroy () {
    // call etch.destroy to remove the element and destroy child components
    await etch.destroy(this)
    // then perform custom teardown logic here...
  }
}
