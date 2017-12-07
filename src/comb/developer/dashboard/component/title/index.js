import PropTypes from 'prop-types';
import './index.less';

export default function Title(props) {
  return (
    <div className="title">
      <span>{props.name}</span>
      {props.children}
    </div>
  )
}

Title.propTypes = {
  name: PropTypes.string,
}

Title.defaultProps = {
  name: '我是标题',
}