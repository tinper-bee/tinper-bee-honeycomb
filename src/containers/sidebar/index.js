import mirror,{actions,connect} from 'mirrorx'
import model from '../../models/sidebar'
import Sidebar from 'components/sidebar/Sidebar'


//初始化数据模型
mirror.model(model);

mirror.hook((action, getState) => {
  const {routing: {location}} = getState()


  if(action.type=='@@router/LOCATION_CHANGE'&&location.pathname === '/') {
    actions.sidebar.load()
  }
})

export default connect(
  state => state.sidebar
)(Sidebar)