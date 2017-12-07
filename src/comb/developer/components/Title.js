import React, {Component} from 'react';
import styles from './Title.css';
import {Link} from 'react-router';
import {Icon} from 'tinper-bee';

const defaultProps = {
  showBack: true,
  isRouter: true,
  backName: '返回'
}


class Title extends Component {
  constructor(props) {
    super(props);
  }

  goBack = () => {
    history.go(-1);
    return false;
  }

  render() {
    const {name, children, showBack, path, isRouter, backName} = this.props;
    let pathProp, back;

    if (path) {
      if (isRouter) {
        back = (
          <Link to={path} style={{color: '#0084ff'}}>
            <Icon type="uf-anglepointingtoleft" style={{verticalAlign: 'middle'}}/>
            <span className="back-word">{backName}</span>
          </Link>
        );
      } else {
        back = (
          <a href='#' onClick={this.goBack} style={{color: '#0084ff'}}>
            <Icon type="uf-anglepointingtoleft" style={{verticalAlign: 'middle'}}/>
            <span className="back-word">{backName}</span>
          </a>
        );
      }
    }

    return (
      <div className="title-back">
        {
          showBack ? (
            <div className="back-in-title">
              {
                path ? back : (
                  <Link to="/" style={{color: '#0084ff'}}>
                    <Icon type="uf-anglepointingtoleft" style={{verticalAlign: 'middle'}}/>
                    <span className="back-word">{backName}</span>
                  </Link>
                )
              }
            </div>
          ) : ""
        }
        <span>{name}</span>
        { children }
      </div>
    )
  }
}

Title.defaultProps = defaultProps;

export default Title;
