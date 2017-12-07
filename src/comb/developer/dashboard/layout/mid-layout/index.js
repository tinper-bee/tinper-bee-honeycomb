import PropTypes from 'prop-types';
import './index.less';

import MidBoxLayout from '../mid-box-layout';

export default function MidLayout(props) {
  return (
    <div className="mid-layout">
      {props.children}
    </div>
  )
}

MidLayout.Box = MidBoxLayout;