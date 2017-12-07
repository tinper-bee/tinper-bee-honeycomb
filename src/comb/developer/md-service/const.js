import logoredis from '../assets/img/image_cata/redis.png'
import logomysql from '../assets/img/image_cata/mysql.png'
import logozookeeper from '../assets/img/image_cata/zookeeper.png'
import logorabbitmq from '../assets/img/image_cata/rabbitmq.png'
import logojenkins from '../assets/img/image_cata/jenkins.png'
import logolobanace from '../assets/img/image_cata/lobanace.png'

const logo = {
  redis: logoredis,
  mysql: logomysql,
  mq: logorabbitmq,
  zk: logozookeeper,
  jenkins:logojenkins,
  dclb:logolobanace

}

const redisConf = [{
  type: '基础版',
  disk: '1024',
  mem: '256',
  cpu: '0.2',
  cpuSymbol: '1x'
}, {
  type: '标准版',
  disk: '1024',
  mem: '256',
  cpu: '0.4',
  cpuSymbol: '2x'
}, {
  type: '高级版',
  disk: '2048',
  mem: '512',
  cpu: '0.2',
  cpuSymbol: '1x'
}, {
  type: '尊享版',
  disk: '2048',
  mem: '1024',
  cpu: '0.4',
  cpuSymbol: '2x'
}];

const jenKinsConf = [ {
  type: '高级版',
  disk: '5120',
  mem: '1024',
  cpu: '0.2',
  cpuSymbol: '1x'
}, {
  type: '尊享版',
  disk: '10240',
  mem: '2048',
  cpu: '0.4',
  cpuSymbol: '2x'
}];

const mysqlConf = redisConf;

const serviceConf = {
  redis: redisConf,
  mysql: redisConf,
  mq: redisConf,
  zk: redisConf,
  dclb:redisConf,
  jenkins: jenKinsConf

}

const STATE = {
  'Deploying': 0,
  'Running': 1,
  'Suspend': 2,
  'Restarting': 3,
  'Unkown': 4,
  'Checking':5,
  '0': '部署中',
  '1': '运行中',
  '2': '停止',
  '3': '重启中',
  '4': '未知',
  '5': '检测中',
};

const OPT_EN = ['start', 'stop', 'restart', 'destroy', 'changepw', 'renewal','domain','redirectrule','edit'];
const OPT = {
  START: 0,
  STOP: 1,
  RESTART: 2,
  DESTROY: 3,
  CHGPW: 4,
  RENEWAL: 5,
  DOMAIN:6,
  REDIRECTRULE:7,
  EDIT:8,

  AUTH: 9,

  0: '开启',
  1: '关闭',
  2: '重启',
  3: '销毁',
  4: '修改密码',
  5: '续期',
  6: '域名管理',
  7: '转发策略',
  8: '编辑',
  9: '权限'

}

// map of api property names
const PROPS = {
  redis: {
    insName: 'aliasName',
    id: 'id',
    createTime: 'createTime'
  },
  mysql: {
    insName: 'insName',
    id: "pkMiddlewareMysql",
    createTime: 'ts'
  },
  mq: {
    insName: 'aliasName',
    id: "id",
    createTime: 'ts'
  },
  zk: {
    insName: 'insName',
    id: "pkMiddlewareZk",
    createTime: 'ts'
  },
  jenkins: {
    insName: 'insName',
    id: "pkMiddlewareJenkins",
    createTime: 'ts'
  },
  dclb: {
    insName: 'insName',
    id: "pkMiddlewareNginx",
    createTime: 'ts'
  },
  domain: {
    insName: 'domain',
    id: "pkMiddlewaredomain",
    createTime: 'ts'
  },
  redirectrule: {
    insName: 'insName',
    id: "ruleName",
    createTime: 'ts'
  }

};

const MILLISECS_IN_A_DAY = 1000 * 60 * 60 * 24;


const insStatusStyle = {
  color: 'white',
  display: 'inline',
  padding: '4px 6px',
  borderRadius: '4px',
}

const describes = [
  {
    id: 'redis',
    isprobation: true,
    newSerivce: '/create/redis',
    name: 'Redis',
    bgcolor: '#FFF5F5',
    describe: 'Redis是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。'
  },
 {
   id: 'mysql',
   isprobation: true,
    newSerivce: '/create/mysql',
    name: 'MySQL',
    bgcolor: '#F5FAFF',
    describe: 'MySQL所使用的 SQL 语言是用于访问数据库的最常用标准化语言。MySQL 软件采用了双授权政策，分社区版和商业版，具有体积小、速度快、总体拥有成本低、开放源码等特点。'
  },
  {
    id: 'mq',
    isprobation: true,
    newSerivce: '/create/mq',
    name: 'RabbitMQ',
    bgcolor: '#FFFAF0',
    describe: 'RabbitMQ是一个在AMQP基础上完成的，可复用的企业消息系统。他遵循Mozilla Public License开源协议。'
  },
  {
    id: 'zk',
    isprobation: true,
    newSerivce: '/create/zk',
    name: 'ZooKeeper',
    bgcolor: '#F5FFF5',
    describe: 'ZooKeeper是一个分布式的，开放源码的分布式应用程序协调服务，为分布式应用提供一致性服务的软件，提供的功能包括：配置维护、域名服务、分布式同步、组服务等。'
  },
  {
    id: 'jenkins',
    isprobation: true,
    newSerivce: '/create/jenkins',
    name: 'Jenkins',
    bgcolor: '#F5FFF5',
    describe: 'Jenkins是基于Java开发的持续集成工具，用于监控持续重复的工作，功能包括：1、持续的软件版本发布/测试项目。2、监控外部调用执行的工作。'
  },
  {
    id: 'dclb',
    isprobation: true,
    newSerivce: '/create/dclb',
    name: '负载均衡',
    bgcolor: '#F5FFF5',
    describe: '负载均衡提供监听维度上的域名URL转发功能，用户配置域名或URL，及对应的虚拟服务器组，系统根据相应的民众转发规则进行流量转发。'
  }
];

export {
  logo,
  insStatusStyle,
  serviceConf,
  STATE,
  PROPS,
  OPT,
  OPT_EN,
  MILLISECS_IN_A_DAY,
  describes
}
