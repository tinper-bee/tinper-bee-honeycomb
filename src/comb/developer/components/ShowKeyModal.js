import React,{Component} from 'react';
import {Modal,Button} from 'tinper-bee';

class ShowKeyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: this.props.show
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.confirm = this.confirm.bind(this);
    }
    componentWillReceiveProps(){
        var self = this;
        setTimeout(()=>{
          self.setState({showModal:self.props.show});
        });

    }
    confirm() {
      const {onConfirmShowKey} = this.props;

      if(onConfirmShowKey){
        onConfirmShowKey();
      }
        this.setState({
            showModal: false
        });
    }
    open() {
        this.setState({
            showModal: true
        });
    }
    close() {
        this.setState({
            showModal: false
        });
    }

    render () {
        const {title,content,show} = this.props;


        return (
          <span>
              {this.props.icon && (<Button size="sm" disabled={this.props.disabled} shape="border" onClick={this.open}><i className={`cl ${this.props.icon}`}></i>{title}</Button>)}
              <Modal
              show = { this.state.showModal }
              backdrop = "static"
              onHide = { this.close } >
                  <Modal.Header>
                      <Modal.Title>{title || "Access Secret"}</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                      {content}
                  </Modal.Body>

                  <Modal.Footer>
                      {this.props.icon && (<Button onClick={ this.close } style={{marginRight: 50}}>取消</Button>)}
                      <Button onClick={ this.confirm } colors="primary">确认</Button>
                  </Modal.Footer>
             </Modal>
          </span>
        )
    }
}

export default ShowKeyModal;
