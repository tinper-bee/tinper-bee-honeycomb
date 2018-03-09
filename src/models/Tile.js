import mirror,{actions} from 'mirrorx'
import * as api from '../services'

export default {
  name: 'tile',
  initialState: {
    tiles:[]
  },
  reducers: {
    save(state, data) {
      return {
        ...state,
        tiles:data
      }
    },
  },
  effects: {
    async load() {
      const {list} = await api.getDeskTop()
      actions.tile.save(list)
    },
  },
}