import PropTypes from 'prop-types';
import { ImageIcon } from '../../components/ImageIcon';
import './index.less';
let COLOR = ['red', '#ff9700', '#ff8b80', '#ff72a2'];
export default function NameCard(props) {
  return (
    <div className="name-card">
      <div className="name-card--logo-area"
        style={{ background: COLOR[props.logoIndex] }}
      >
        <span className={`cl cl-no${props.logoIndex} name-card--logo-icon`}></span>
      </div>
      <div className="name-card--body">
        <div className="name-card--avatar" >
          {ImageIcon(props.iconPath)}
        </div>
        <div className="name-card--name"
          title={props.name}
        >
          {props.name}
        </div>

        <div style={{ marginTop: 10 }}>
          {props.userName && (<span className="name-card--user">
            <span className="name-card--user-icon cl cl-provider" />
            <span className="name-card--user-name"
              title={props.userName}
            >
              {props.userName}
            </span>
          </span>)}
          {props.timeStamp && (<span className="name-card--time">
            <span className="name-card--time-icon cl cl-time-02" />
            <span className="name-card--time-name" >
              {props.timeStamp}
            </span>
          </span>)}
        </div>

      </div>
    </div>
  )
}

NameCard.PropTypes = {
  iconPath: PropTypes.string,
  name: PropTypes.string,
}

NameCard.defaultProps = {
  logoIndex: 1,
  iconPath: '',
  name: '',
  userName: '',
  timeStamp: ''

}
