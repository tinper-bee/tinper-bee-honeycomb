import PropTypes from 'prop-types';
import './index.less';

export default function UpperLayout(props) {
  return (
    <div className="upper-layout">
      {props.children}
    </div>
  )
}