import mirror,{actions,connect} from 'mirrorx'
import model from '../../models/Tile'
import Tile from 'components/platform/tile/Tile'

//初始化数据模型
mirror.model(model);


mirror.hook((action, getState) => {
  const {routing: {location}} = getState()


  if(action.type=='@@router/LOCATION_CHANGE'&&location.pathname === '/') {
    actions.tile.load()
  }
})

export default connect(
  state => state.tile
)(Tile)