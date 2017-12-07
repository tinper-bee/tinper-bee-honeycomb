import { PropTypes } from 'react'
import withStyle from './withStyle.hoc';
import { Row } from 'tinper-bee';

function Header(props) {
  const { style } = props;
  const { router, widthGoBack } = props;

  return (
    <div style={style.header}>
      {
        widthGoBack && (
          <span style={style.return} onClick={handleReturnClick}>
            <span className="cl cl-arrow-left"></span>
            我的中间件服务
          </span>
        )
      }
      <span style={style.title} >
        {props.children}
      </span>
    </div>
  )

  function handleReturnClick() {
    router.goBack();
  }
}

Header.defaultProps = {
  children: '页标题',
  widthGoBack: true,
}

Header.propTypes = {
  children: PropTypes.node,
  widthGoBack: PropTypes.bool,
}

export default withStyle(() => ({
  header: {
    position: 'relative',
    width: '100%',
    height: ' 46px',
    textAlign: 'center',
    lineHeight: '46px',
    boxShadow: ' 0 2px 3px #d3d3d3',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  return: {
    position: 'absolute',
    width: '20%',
    lineHeight: '46px',
    left: 0,
    textAlign: 'left',
    paddingLeft: '15px',
    zIndex: 100,
    fontSize: '14px',
    color: '#008bfa',
    cursor: 'pointer',
  },
  title: {
    fontSize: '16px',
    width: '100%',
  }
}))(Header);
