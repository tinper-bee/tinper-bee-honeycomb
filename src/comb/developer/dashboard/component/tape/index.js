import PropTypes from 'prop-types';
import './index.less';
export default function Tape(props) {
  let time = milSectoSec(props.value);
  return (
    <div className="tape">
      <span
        className={`cl ${props.iconCls} tape--icon`}
      />
      <span
        className="tape--name"
      >
        {props.name}
      </span>
      <span
        className="tape--value"
      >{props.unit ? time.value : props.value}</span>
      {
        props.unit && (
          <span style={{ fontSize: 'small', verticalAlign: 'sub', color: '#dd3730' }}>
            {time.unit}
          </span>
        )
      }

    </div>
  )
}
function milSectoSec(value = 0) {
  value = parseFloat(value) * 1000;
  value = parseInt(value);
  let ref = {
    value: value,
    unit: 'ms',
  }

  if (value > 1000) {
    let sec = (value / 1000).toFixed(1);
    ref.value = sec;
    ref.unit = 's'
  }
  return ref;
}

Tape.propTypes = {
  iconCls: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  unit: PropTypes.string,
}

Tape.defaultProps = {
  iconCls: '',
  name: '',
  value: 0,
  unit: ''
}