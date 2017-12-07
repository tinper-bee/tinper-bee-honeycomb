import { PropTypes } from 'react'
import { Tile } from 'tinper-bee'
import { describes} from '../const'
import withStyle from './withStyle.hoc'

function DashBoard(props) {
  const { logo, number, children, hideNumber, type } = props;
  const { style, className } = props;

  let isprobation = false;
  for(let i = 0, len = describes.length; i < len; ++i){
    if(describes[i].id == type){
      isprobation = describes[i].isprobation;
    }
  }

  return (
    <Tile style={style.main} className={className}>
      <div style={style.banner}>
        <img src={logo} style={style.bannerImg} />
      </div>
      {
        hideNumber
          ? hideNumber
          : (<div style={style.number} title="实例数">
            {number}
            </div>)
      }
      {
        isprobation ?
        (<div style={style.flag}>试用</div>)
        :''
      }
      <div style={style.children}>
        {children}
      </div>
    </Tile>
  );
}

DashBoard.defaultProps = {
  logo: '', // TODO: ask for a default logo
  number: 0,
  hideNumber: false,
  children: 'no data'
}

DashBoard.propTypes = {
  logo: PropTypes.string,
  number: PropTypes.number,
  children: PropTypes.node,
  hideNumber: PropTypes.bool,
}


export default withStyle(() => ({
  main: {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
    padding: 0,
    textAlign: 'center',
    height: '307px',
    boxShadow: '0 0 6px lightgrey',
  },
  banner: {
    height: '120px',
    backgroundColor: '#f7f7f7',
  },
  bannerImg: {
    height: '100%',
  },
  number: {
    position: 'absolute',
    fontSize: '50px',
    color: '#f57323',
    width: '87px',
    lineHeight: '90px',
    right: 0,
    top: 0,
  },
  flag: {
    position: 'absolute',
    top: '-28px',
    left: '-46px',
    width: '110px',
    padding: '41px 0 9px',
    color: 'white',
    backgroundColor: '#fe7323',
    fontSize: '14px',
    transform: 'rotate(-45deg)',
    WebkieTransform: 'rotate(-45deg)',
    msTransform: 'rotate(-45deg)',
  },
  children: {

  }
}))(DashBoard)
