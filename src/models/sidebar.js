import {actions} from 'mirrorx'
import * as api from '../services'

export default {
  name: 'sidebar',
  initialState: {
    expanded:false,
    openKeys:[],
    currentOpenKeys:[],
    menus:[],
  },
  reducers: {
    setExpanded(state,expanded) {
      const expand = expanded?false:!state.expanded;
      const currentOpenKeys = expand?state.currentOpenKeys=state.openKeys:state.currentOpenKeys;
      const openkeys = expand?[]:state.currentOpenKeys
      return {
        ...state,
        expanded:expand,
        openKeys:openkeys,
        currentOpenKeys:currentOpenKeys
      }
    },
    setOpenKeys(state,openKeys){
      return {
        ...state,
        openKeys:openKeys
      }
    },
    setMenus(state,menus){
      return {
        ...state,
        menus:menus
      }
    },
    save(state, data) {
      return {
        ...state,
        menus:data
      }
    },
  },
  effects: {
    async load() {
      const {list} = await api.getSideBar()
      actions.sidebar.save(list)
    },
  },
}