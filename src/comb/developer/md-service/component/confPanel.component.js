import { PropTypes } from 'react'
import withStyle from './withStyle.hoc'

function ConfPanel(props) {
  const { style, type, disk, mem, cpu, active, ...others } = props;

  const mainStyle = active
    ? Object.assign({}, style.main, style.active)
    : style.main;

  return (
    <div style={mainStyle} {...others}>
      <div style={style.header}>
        <div >{type}</div>
        <div style={style.header.sub}>
          硬盘:<span>{disk / 1024}</span>GB
        </div>
      </div>
      <div>
        <div style={Object.assign({}, style.body.block, style.body.borderRight)}>
          <div style={style.body.block.title}>
            内存
          </div>
          <div style={style.body.block.content}>
            <span>{mem}</span>MB
          </div>
        </div>
        <div style={style.body.block}>
          <div style={style.body.block.title}>
            CPU
          </div>
          <div style={style.body.block.content}>
            <span>{cpu}</span>
          </div>
        </div>
      </div>
      {
        active
          ? <span className="cl cl-checked" style={style.checkIcon}></span>
          : false
      }
    </div>
  )
}

ConfPanel.propTypes = {
  style: PropTypes.object,
  disk: PropTypes.number,
  cup: PropTypes.string,
  mem: PropTypes.number,
  active: PropTypes.bool,
  type: PropTypes.string,
}

ConfPanel.defaultProps = {
  style: {},
  type: '基础服务',
  disk: 0,
  cpu: '1x',
  mem: 0,
  active: false,
}

export default withStyle(() => ({
  main: {
    position: 'relative',
    width: '205px',
    height: '145px',
    backgroundColor: 'white',
    border: '1px solid #d9d9d9',
    padding: '15px',
    fontSize: '18px',
    margin: '0 15px 15px 0',
    cursor: 'pointer',
  },
  active: {
    border: '2px solid #008bfa',
  },
  header: {
    height: '65px',
    textAlign: 'left',

    sub: {
      fontSize: '15px',
      color: '#9b9b9b',
    },
  },
  body: {
    block: {
      float: 'left',
      width: '50%',
      textAlign: 'center',

      title: {
        fontSize: '15px',
        color: '#9b9b9b',
      },

      content: {
        fontWeight: 'bold',
        color: '#008bfa',
      },
    },

    borderRight: {
      borderRight: '0.5px solid #ccc',
    },
  },
  checkIcon: {
    position: 'absolute',
    right: '-2px',
    top: '-2px',
    lineHeight: 1,
    fontSize: '25px',
    color: '#008bfa',
  },
}))(ConfPanel)