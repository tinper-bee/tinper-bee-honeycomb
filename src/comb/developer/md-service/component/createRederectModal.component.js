import React, {
    Component
} from 'react';
import {
    findDOMNode
} from 'react-dom';
import {
    Modal,
    Button,
    Table,
    Pagination,
    Message,
    Upload,
    Select,
    Row,
    Col,
    FormGroup,
    Label,
    Icon
} from 'tinper-bee';
import CodeMirror from 'codemirror';
import {
    Base64
} from 'js-base64';
import qs from 'qs';

import '../../lib/codemirror.css';
import '../../../../lib/codemirror/theme/blackboard.css';

const Option = Select.Option;

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

class createRederectModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confList: [],
            data: [],
            page: 0,
            activePage: 1,
            checkedAll: false,
            checkedArray: [],
            value: '',
            way: 'edit'
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
        if (show && this.state.way === 'edit') {

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
                theme: "monokai",
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
            let content = qs.stringify({
                'fileContent': fileContent
            });

            onEnsure(content, data.configId);
        }
    }

    handleSelectChange = (state) => {
        return (value) => {
            this.setState({
                [state]: value
            })
        }
    }
    handleUploadWar = (info) => {
        let {
            onClose
        } = this.props;
        if (info.file.response.status === 'success') {
            Message.create({
                content: '上传成功',
                color: 'success',
                duration: 1.5
            });
            onClose()
        }
    }


    render() {
        const {
            show,
            onClose,
            data
        } = this.props;
        return (
            <Modal show={ show } size="lg" ref="modal">
                <Modal.Header>
                    <Modal.Title>编辑配置文件</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Col xs={12}>
                        <Row>
                            <Col xs={12}>
                                <Select
                                    value={ this.state.way }
                                    style={{ width: 300, marginBottom: 15 }}
                                    dropdownStyle={{ zIndex: 2000 }}
                                    onChange={this.handleSelectChange('way')}>
                                    <Option value='edit'>修改文本</Option>
                                    <Option value='upload'>上传配置文件</Option>
                                </Select>
                            </Col>
                            <Col xs={12}>
                                {
                                    this.state.way === 'edit' ? (
                                        <div style={{ border: '1px solid #f5f5f5', marginBottom: 15 }}>
                                            <textarea ref="content" value={ this.state.value } />
                                        </div>

                                    ) : (
                                        <FormGroup style={{ margin: '30px auto' }}>
                                            <Col sm={3} xs={4} className="text-right">
                                                <Label>上传配置文件</Label>
                                            </Col>
                                            <Col sm={9} xs={8}>
                                                <Upload
                                                    listType="text"
                                                    action={`/confcenter/api/web/config/file/${data.configId}`}
                                                    onChange={this.handleUploadWar}>
                                                    <Button colors="primary"
                                                            shape="squared">
                                                        <Icon type="uf-upload"/> 上传文件
                                                    </Button>
                                                </Upload>
                                            </Col>
                                        </FormGroup>
                                    )
                                }
                            </Col>
                        </Row>


                    </Col>



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

createRederectModal.defaultProps = defaultProps;

export default createRederectModal;