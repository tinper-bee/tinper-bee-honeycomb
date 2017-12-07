import PropTypes from 'prop-types';
import './index.less';

export default function BotLayout(props) {
  return (
    <div className="bot-layout">
      {props.children}
    </div>
  )
}