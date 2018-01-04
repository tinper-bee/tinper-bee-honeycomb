import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import { Loading } from 'tinper-bee';
import Icon from 'components/icon';
import {
  widgetItem,
  title,
  title_left,
  title_right,
  content,
  defaultArea,
  iconImg,
  default_icon
} from './style.css'
import _default_icon from 'assets/image/default.png';

const widgetStyle = [
  // 小
  {
    width: 176
  },
  // 中
  {
    width: 360
  },
  // 大
  {
    width: 360,
    height: 360
  }
];

class WidgetItem extends Component {
  render() {
    const {
      data: {
        background,
        widgetId: id,
        size,
        widgetName: name,
        icon,
      },
      clickHandler,
    } = this.props;

    const style = {
      ...widgetStyle[size - 1],
      backgroundImage: `url(${background})`,
    };
    console.log("icon____"+icon);
    return (
      <li className={`${widgetItem} ${defaultArea}`}
        style={style}
        onClick={clickHandler} >
        <div className={title}>
          <div className={title_right}>{name}</div>
        </div>
        <img src={icon?icon:_default_icon} className={iconImg}/>
      </li>
    );
  }
}

export default WidgetItem;
