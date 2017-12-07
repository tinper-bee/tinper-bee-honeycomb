import { Modal, Table ,Button,Icon,Input} from 'tinper-bee'

export default class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  handleKeydown = (event) => {

      if(event.keyCode == 13){
          this.check();
      }

  }
  render() {
    const { value, editable } = this.state;
    return (<div className="editable-cell">
      {
        editable ?
        <div className="editable-cell-input-wrapper">
          <input
            value={value}
            onChange={this.handleChange}
            onKeyDown = {this.handleKeydown}
          />
          <Icon
            type="uf-correct"
            className="editable-cell-icon-check"
            onClick={this.check}
          />
        </div>
        :
        <div className="editable-cell-text-wrapper">
          {value || ' '}
          <Icon
            type="uf-pencil"
            className="editable-cell-icon"
            onClick={this.edit}
          />
        </div>
      }
    </div>);
  }
}
