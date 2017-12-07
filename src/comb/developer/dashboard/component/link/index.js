import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.less';

export default function Link(props) {
  return (
    <a
      href={props.href}
      className="link"
    >
      <span className="cl cl-add-c-o link--icon" />
      <span className="link--name">创建新应用</span>
    </a>
  )
}

Link.propTypes = {
  href: PropTypes.string.isRequired,
}

// Link.defaultProps = {
// }