import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './index.less';

export default function ResInfo(props) {
  let [dataMain, dataSub] = props.data || [];

  return (
    <div className="res-info">
      <span className={`cl ${props.iconCls} res-info--icon`} />
      <div className="res-info--body">
        <div className="res-info--blk">
          <div className="res-info--name res-info--name__main">
            {dataMain.name}
          </div>
          <div className="res-info--value res-info--value__main">
            {dataMain.value || 0}
            <span className="res-info--unit">
              {dataMain.unit || ""}
            </span>
          </div>
        </div>
        <div className="res-info--blk">
          <div className="res-info--name res-info--name__sub">
            {dataSub.name}
          </div>
          <div className="res-info--value res-info--value__sub">
            {dataSub.value || 0}
            <span className="res-info--unit">
              {dataSub.unit || ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

ResInfo.propTypes = {
  iconCls: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    unit: PropTypes.string,
  }))
}

ResInfo.defaultProps = {
  iconCls: 'cl-cpu',
  data: []
}