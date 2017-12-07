import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.less';

const COLOR = {
  '资源池报警': '#e3594f',
  '服务报警': '#098ffc',
  '应用报警': '#f0612f',
}

export default class Alert extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      alarm_type: PropTypes.string,
      detail: PropTypes.string,
    }))
  }
  static defaultProps = {
    data: []
  }
  render() {
    let { data } = this.props;
    return (
      <div className="alert">
        {
          (function () {
            if (data && data.length == 0) {
              return (
                <div style={{ fontSize: 15 }}>
                  当前很正常，暂无报警哦
                </div>
              )
            }
          })()
        }
        {data.map(item => {
          return (
            <div className="alert--item"
            >
              <span className="alert--type"
                style={{ color: COLOR[item.alarm_type] || 'red' }}
              >
                {`[${item.alarm_type}]`}
              </span>
              <span className="alert--content"
                title={item.detail}
              >
                {item.detail}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
}