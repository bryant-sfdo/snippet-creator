/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import $ from 'jquery'
export default class SnippetCreatorView {
  // Required: Define an ordinary constructor to initialize your component.
  constructor (props, children) {
    this.props = props;
    // perform custom initialization here...
    // then call `etch.initialize`:
    etch.initialize(this)
  }

  // Required: The `render` method returns a virtual DOM tree representing the
  // current state of the component. Etch will call `render` to build and update
  // the component's associated DOM element. Babel is instructed to call the
  // `etch.dom` helper in compiled JSX expressions by the `@jsx` pragma above.
  render () {
    return (
      <div className="snippet-creator">
          <input type="text" ref="prefix" className="native-key-bindings" id='prefix' placeholder="Prefix / Snippet name" />
          <input type="text" ref="description" className="native-key-bindings" id='description' placeholder="Description" />
        <div>

        <label>
        	Source Type:
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
        <textarea className="body-text native-key-bindings" ref="body"></textarea>
        <a href="#" className="btn">Save</a>
        <a href="#" className="btn">Cancel</a>

      </div>
    )
  }


  /// NODE fs module. fs.readfile.
  save() {
    console.log("SAVE!");
    console.log(this.refs.prefix.value);
    console.log(this.refs.description.value);
    this.refs.description.value = "";
    this.props.hide();

  }
  // Required: Update the component with new properties and children.
  update (props, children) {
    this.refs.body.value = atom.workspace.getActiveTextEditor().getLastSelection().getText();
    // perform custom update logic here...
    // then call `etch.update`, which is async and returns a promise
    return etch.update(this)
  }

  // Optional: Destroy the component. Async/await syntax is pretty but optional.
  async destroy () {
    // call etch.destroy to remove the element and destroy child components
    await etch.destroy(this)
    // then perform custom teardown logic here...
  }
}
