import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Title from '../../component/title';

import './index.less';

export default class Faq extends PureComponent {
  static PropTypes = {
    style: PropTypes.object,
    name: PropTypes.string,
    more: PropTypes.string,
    target: PropTypes.string,
  }
  static defaultProps = {
    style: {},
    name: '',
    more: ``,
    target: '_blank',
  }
  render() {
    return (
      <div className="faq" style={this.props.style}>
        <Title name={this.props.name}>
          <a
            href={this.props.more}
            target={this.props.target}
            className="faq--more">
            more
          </a>
        </Title>
        <div className="faq--body">
          {this.props.children}
        </div>
      </div>
    )
  }
}