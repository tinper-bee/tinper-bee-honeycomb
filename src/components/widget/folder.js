import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  widgetItem,
  title,
  file_context,
  title_left,
  file_icon,
  title_right,
  context,
  file_num,
  file_title_right,
  widget_file_item
} from './style.css'

const style={
  'position':'absolute',
  'right':'11px',
  'bottom':'9px',
  'color':'#fff'
}
class FolderWidget extends Component {
  render() {
    const {
      data,
      clickHandler,
    } = this.props;
    const {
      widgetName: name,
      children,
      type
    } = data;
    return (
      <li className={`${widgetItem} ${type==2?widget_file_item:""}`} onClick={ clickHandler } >
        <div className={title}>
          <div className={`${title_right} ${file_title_right}`}>{name}</div>
        </div>
        {/*<div className={[context, file_context].join(' ')} >
          { children.map(() => (<div></div>)).slice(0, 9) }
        </div>*/}
        <div className={file_num} style={style}>
          ({children.length})
        </div>
      </li>
    )
  }
}

export default FolderWidget;
