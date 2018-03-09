import {actions} from 'mirrorx'

export default {
  name: 'sidebar',
  initialState: {
    expanded:false,
    openKeys:[],
    menus:[],
  },
  reducers: {
    setExpanded(state,expanded) {
      const expand = expanded?false:!state.expanded;
      return {
        ...state,
        expanded:expand
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
    }
  }
}