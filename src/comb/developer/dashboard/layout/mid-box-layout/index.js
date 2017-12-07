import PropTypes from 'prop-types';
import './index.less';

export default function MidBoxLayout(props) {
  return (
    <div className={`mid-box-layout ${props.className}`}>
      <div className="mid-box-layout--body">
        {props.children}
      </div>
    </div>
  )
}

MidBoxLayout.propTypes = {
  className: PropTypes.string,
}
MidBoxLayout.defaultProps = {
  className: '',
}
