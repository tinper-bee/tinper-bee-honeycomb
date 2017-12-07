import React,{Component} from 'react';
import ReactDom from 'react-dom';
import {Modal,Button,Row,Col,FormGroup,Label,FormControl} from 'tinper-bee';
import './editModal.css';

class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal:props.show,
            dec:"请添加描述信息",
            description:props.description,
            warning:false
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }
    componentWillReceiveProps(props){
        this.setState({
            showModal:props.show,
            description:props.description
        });
    }
    close() {
        this.setState({
            showModal: false,
            warning:false
        });
    }
    onConfirm() {
      const {onConfirmEdit} = this.props;
      let textareaInfo = ReactDom.findDOMNode(this.refs.description).value;
      if(onConfirmEdit){
        onConfirmEdit(textareaInfo);
      }

      this.setState({
          showModal: false,
          warning:false
      });
    }
    open() {
        this.setState({
            showModal: true
        });
    }


    /**
     * 最多只能输入10个汉字
     */
    handEnter= (event)=>{
       let domInput=ReactDom.findDOMNode(this.refs.description).value;
       if(domInput.length>=11){
            this.setState({
                warning:true
            })
            ReactDom.findDOMNode(this.refs.description).value=domInput.substring(0,10);
       }else{
            this.setState({
                warning:false
            })
       }
    }
    render () {
        const {title,show,id,accesskeyName} = this.props;

        return (

          <span className="delete-key-modal">

              <Modal
              show = { this.state.showModal }
              backdrop = "static"
              onHide = { this.close } >
                  <Modal.Header>
                      <Modal.Title>修改描述信息</Modal.Title>
                  </Modal.Header>

                  <Modal.Body className="">
                        <div className="info">
                            <Row>
                                <Col md={12}>Accesskey:{accesskeyName} </Col>
                            </Row>
                            <Row className="">
                                <Col md={12}>  
                                    <FormGroup>
                                        <Label>描述信息:</Label>
                                        {
                                            this.state.description?( <FormControl ref="description"  defaultValue={this.state.description}  onChange={this.handEnter}/>):
                                                        ( <FormControl ref="description"  placeholder={this.state.dec}  onChange={this.handEnter} />)
                                        }

                                        {
                                            this.state.warning?(<div className="margin-top-10 warning">最多只能显示10个字符 </div>):""
                                        }
                                    </FormGroup>
                                </Col>  
                            </Row>
                        </div>
                  </Modal.Body>

                  <Modal.Footer>
                      <Button onClick={ this.close } shape="border" style={{marginRight: 50}}>关闭</Button>
                      <Button onClick={ this.onConfirm } colors="primary">确认</Button>
                  </Modal.Footer>
             </Modal>
          </span>
        )
    }
}

export default EditModal;
