import { Component } from 'react';
import { FormControl, Icon, InputGroup } from 'tinper-bee';
import classnames from 'classnames';

import './index.less';

class Input extends Component{
  static PropTypes = {

  }
  static defaultProps = {

  }
  state = {
    value: ''
  }

  handleChange = (e) => {
    let { onChange } = this.props;
    this.setState({
      value: e.target.value
    })
    onChange && onChange(e.target.value);
  }

  handleClear = () => {
    let { onClear } = this.props;
    this.state({
      value: ''
    })
    onClear && onClear();
  }

  render() {
    let { conClassName,onClear, onChange, ...props } = this.props;

    let { value } = this.state;

    return (
      <InputGroup className={ classnames('dev-input', conClassName) } simple>
        <FormControl
          { ...props }
          value={ value }
          onChange={ this.handleChange }
          type="text"
        />
        <InputGroup.Button shape="border">
          {
            value !== '' ? (
              <Icon onClick={ this.handleClear } className="" type="uf-close-c" />
            ) : null
          }

        </InputGroup.Button>
      </InputGroup>
    )
  }
}

export default Input;
