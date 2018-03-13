import React, { Component } from 'react';
import PropTypes from "prop-types";
import {withRouter,actions,connect} from 'mirrorx'
import WidgetMaker from 'components/widget';
import {
  WidgetCont,
  WidgetTitle,
  item,
  WidgetList,
} from './style.css';


class HomeWidgeList extends Component{
	render(){
    const {
      data: {
        widgetName: name,
        widgetId: id,
        children,
        type,
      },
      noTitle,
      openFolder,
      history,
      style,
    } = this.props;
    const list = children.map((child, i) => {
      const {
        type,
        jsurl,
        widgetId,
        serveCode,
      } = child;
      const Widget = WidgetMaker(child);
      const props = {
        key: `widget-${widgetId}-${i}`,
        data: child,
      };
      if (type === 2) {
        props.clickHandler = () => {
          openFolder(child);
        }
      } else if (type === 3 && !jsurl){
        props.clickHandler = () => {
          history.push(`/serve/${serveCode}`);
        }
      }
      return (
        <Widget { ...props }/>
      );
    })
		return(
      <div className={item} style={style} >
        {
          noTitle ? null : (
            <div className={WidgetTitle} >
              <div>{name}</div>
            </div>
          )
        }
        <div className={WidgetCont}>
          <ul className={WidgetList}>{list}</ul>
        </div>
      </div>
    );
	}
}

export default HomeWidgeList;
