import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {
  Modal,
  Button,
  Table,
  Pagination,
  Message
} from 'tinper-bee';
import CodeMirror from 'codemirror';
import {Base64} from 'js-base64';
import qs from 'qs';

import 'lib/codemirror.css';
import 'lib/codemirror/theme/blackboard.css';

const defaultProps = {
  isSelected: false
};


function completeAfter(cm, pred) {
  let cur = cm.getCursor();
  if (!pred || pred()) setTimeout(function() {
    if (!cm.state.completionActive)
      cm.showHint({
        completeSingle: false
      });
  }, 100);
  return CodeMirror.Pass;
}

function completeIfAfterLt(cm) {
  return completeAfter(cm, function() {
    let cur = cm.getCursor();
    return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) == "<";
  });
}

function completeIfInTag(cm) {
  return completeAfter(cm, function() {
    let tok = cm.getTokenAt(cm.getCursor());
    if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
    let inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
    return inner.tagName;
  });
}

class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confList: [],
      data: [],
      page: 0,
      activePage: 1,
      checkedAll: false,
      checkedArray: [],
      value: ''
    }

  }

  componentWillReceiveProps(nextProps) {
    const {
      show,
      data
    } = nextProps;
    if (show) {
      this.setState({
        value: data.value
      });
    }
  }
  componentDidUpdate() {
    const {
      show,
      data
    } = this.props;
    let modeStr = 'xml';
    if (show) {
      if (this.props.data.path && this.props.data.path.indexOf('properties') > -1) {
        modeStr = 'properties';
      }

      this.editor = CodeMirror.fromTextArea(findDOMNode(this.refs.content), {
        value: data.value,
        lineNumbers: true,
        mode: modeStr,
        keyMap: "sublime",
        autoCloseBrackets: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: "blackboard",
        tabSize: 2,
        extraKeys: {
          "'<'": completeAfter,
          "'/'": completeIfAfterLt,
          "' '": completeIfInTag,
          "'='": completeIfInTag,
          "Ctrl-Space": "autocomplete"
        },
      });

    }
  }
  handleSave = () => {
    let {
      onEnsure,
      data
    } = this.props;
    if (onEnsure instanceof Function) {



      let fileContent = Base64.encode(this.editor.getValue());

      onEnsure(qs.stringify({
        'fileContent': fileContent
      }), data.configId);
    }
  }

  render() {
    const {
      show,
      onClose,
      data
    } = this.props;
    return (
      <Modal show={ show } size="lg">
        <Modal.Header>
          <Modal.Title>编辑配置文件</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>
                        <textarea ref="content" value={ this.state.value }>
                        </textarea>
          </div>
        </Modal.Body>

        <Modal.Footer>

          <Button
            onClick={ onClose }
            shape="squared"
            style={{marginBottom: 15}}>
            取消
          </Button>
          <Button
            colors="primary"
            shape="squared"
            onClick={ this.handleSave }
            style={{marginLeft: 20, marginRight: 20, marginBottom: 15}}>
            保存
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

EditModal.defaultProps = defaultProps;

export default EditModal;
