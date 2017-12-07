import PropTypes from 'prop-types';
import './index.less';

export default function MainLayout(props) {
  return (
    <div className="main-layout">
      {props.children}
    </div>
  )
}