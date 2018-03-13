import nattyFetch from 'natty-fetch'
const PAGE_SIZE = 3
const URL_PREFIX = ''

function request(url, options) {
  const r = nattyFetch.create({
    url: URL_PREFIX + url,
    fit: response => ({
      success: true,
      content: response
    }),
    ...options
  })

  return r()
}


export function getDeskTop() {
  return request('/desktop/getdeskTop', {
    data: {
      _limit: PAGE_SIZE,
    },
    fit: response => {
      return {
        success: true,
        content: {
          list: response.data.workList,
          // should read from header['x-total-count'], but natty-fetch does not
          // provide a way to access response headers
          total: 10
        }
      }
    }
  })
}

export function getSideBar() {
  return request('/web/v1/menu/sidebarList', {
    data: {
      _limit: PAGE_SIZE,
    },
    fit: response => {
      return {
        success: true,
        content: {
          list: response.data,
          // should read from header['x-total-count'], but natty-fetch does not
          // provide a way to access response headers
          total: 10
        }
      }
    }
  })
}

