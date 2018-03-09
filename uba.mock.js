module.exports = {
  "GET": [
    // 账户相关接口
    { "/web/v1/menu/sidebarList": "./mock/api/sidebar.json" },
    { "/middleware/web/v1/mysql/page": "./mock/api/mysql.json" },
    { "/middleware/web/v1/redis/page": "./mock/api/redis.json" },
    { "/middleware/web/v1/mq/page": "./mock/api/mq.json" },
    { "/middleware/web/v1/zk/page": "./mock/api/zk.json" },
    { "/middleware/web/v1/jenkins/page": "./mock/api/jenkins.json" },
    { "/middleware/web/v1/dclb/page": "./mock/api/dclb.json" },
    { "/desktop/getdeskTop":"./mock/api/desktop/getdeskTop.json"}
  ],
  "POST": [
    // 我的相关接口
    { "/Test/post": "./mock/api/test.json" },
    { "/fm/subscribe/searchAppendAcc": "./mock/api/myasset/searchAppendAcc.json" },
    { "/fm/interests/queryInvestAccs": "./mock/api/myasset/queryInvestAccs.json" },
    { "/fm/creditmonitor/list": "./mock/api/creditmonitor/creditmonitor_list.json" },
    { "/bd/project/search": "./mock/api/bd_project/search.json" },
  ]
}
