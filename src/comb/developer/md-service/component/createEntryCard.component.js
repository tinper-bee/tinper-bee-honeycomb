import { Tile } from 'tinper-bee'
import withStyle from './withStyle.hoc'
import { Link } from 'react-router'
import { PropTypes } from 'react'

function CreateEntryCard(props) {
  let {
    style, href, logo,
    type = '',
    className,
    labelStyle = {},
    mainStyle = {}
  } = props;

  labelStyle = Object.assign({}, style.label, labelStyle);
  mainStyle = Object.assign({}, style.main, mainStyle);

  return (
    <Tile style={mainStyle} className={className}>
      <Link to={href}>
        <div style={style.banner}>
          <img src={logo} style={style.bannerImg} />
        </div>
        <span style={labelStyle}>创建{type}服务</span>
      </Link>
    </Tile>
  )
}

CreateEntryCard.propTypes = {
  style: PropTypes.object,
  href: PropTypes.string,
  logo: PropTypes.string,
  type: PropTypes.string,
  labelStyle: PropTypes.object,
  mainStyle: PropTypes.object,
}

CreateEntryCard.defaultProps ={
  style: {},
  href: '',
  logo:'',
  type:'中间件',
  lableStyle:{},
  mainStyle:{},
}


export default withStyle(() => ({
  main: {
    width: '230px',
    border: 'none',
    boxShadow: '0 0 6px lightgray',
    textAlign: 'center',
    cursor:'pointer',
  },
  banner: {
    height: '85px',
  },
  bannerImg: {
    position: 'relative',
    maxHeight: '100%',
    maxWidth: '100%',
    top: '-15px',
  },
  label: {
    fontSize: '15px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    positon: 'relative',
    top:-5,
  },
}))(CreateEntryCard)