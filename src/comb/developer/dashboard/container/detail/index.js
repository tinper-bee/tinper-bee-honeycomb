import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Tape from '../../component/tape';
import './index.less';
export default class Detail extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      iconCls: PropTypes.string,
      name: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      unit: PropTypes.string,
    })),
  }
  static defaultProps = {
    data: []
  }
  render() {
    return (
      <div className="detail">
        {this.props.data.map(item => {
          return (
            <Tape {...item}/>
          )
        })}
      </div>
    )
  }
}