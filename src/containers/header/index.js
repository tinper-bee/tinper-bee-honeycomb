import mirror,{actions,connect} from 'mirrorx'
import model from '../../models/header'
import Header from 'components/header/Header'


//初始化数据模型
mirror.model(model);

export default connect(
  state => state.header
)(Header)