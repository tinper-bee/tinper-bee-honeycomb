/**
 * 上传应用类型对应的镜像
 * @type {{j2ee: [*], nodejs: [*], nginx: [*], python: [*], go: [*], dubbo: [*], php: [*], j2se: [*]}}
 */
export const DOCKER_IMAGES = {

  j2ee: [
    {
      name: 'Tomcat:6.0.48-JRE8',
      value: 'tomcat:6.0.48-jre8-alpine',
    },
    {
      name: 'Tomcat:6.0.48-JRE7',
      value: 'tomcat:6.0.48-jre7-alpine',
    },
    {
      name: 'Tomcat:7.0.75-JRE8',
      value: 'tomcat:7.0.75-jre8-alpine',
    },
    {
      name: 'Tomcat:7.0.75-JRE7',
      value: 'tomcat:7.0.75-jre7-alpine',
    },
    {
      name: 'Tomcat:8.0.32-JRE8',
      value: 'tomcat:8.0.32-jre8-alpine',
    },
    {
      name: 'Tomcat:8.0.32-JRE7',
      value: 'tomcat:8.0.32-jre7-alpine',
    },
    {
      name: 'Tomcat:8.0.43-JDK7',
      value: 'tomcat:8.0.43-jdk7-alpine',
    },
    {
      name: 'Tomcat:9.0.0.M9-JRE8',
      value: 'tomcat:9.0.0.M9-jre8-alpine',
    },
    {
      name: 'Tomcat:9.0.0.M9-JRE7',
      value: 'tomcat:9.0.0.M9-jre7-alpine',
    },
    {
      name: 'Tomcat:8.0.32-JDK7-apm',
      value: 'tomcat:8.0.32-jdk7-apm-alpine-192',
    },
    {
      name: 'Tomcat:8.0.32-jdk8-apm',
      value: 'tomcat:8.0.32-jdk8-apm-alpine'
    },
  ],
  nodejs: [
    {
      name: 'nodejs: 6.9.2',
      value: 'nodejs: 6.9.2',
    }
  ],
  nginx: [
    {
      name: 'nginx: latest',
      value: 'nginx: latest',
    }
  ],
  python: [
    {
      name: 'python: 2.7',
      value: 'python: 2.7',
    }
  ],
  go: [
    {
      name: 'go: alpine:3.4',
      value: 'go: alpine:3.4',
    }
  ],
  dubbo: [
    {
      name: 'Tomcat:6.0.48-JRE8',
      value: 'tomcat:6.0.48-jre8-alpine',
    },
    {
      name: 'Tomcat:6.0.48-JRE7',
      value: 'tomcat:6.0.48-jre7-alpine',
    },
    {
      name: 'Tomcat:7.0.75-JRE8',
      value: 'tomcat:7.0.75-jre8-alpine',
    },
    {
      name: 'Tomcat:7.0.75-JRE7',
      value: 'tomcat:7.0.75-jre7-alpine',
    },
    {
      name: 'Tomcat:8.0.32-JRE8',
      value: 'tomcat:8.0.32-jre8-alpine',
    },
    {
      name: 'Tomcat:8.0.32-JRE7',
      value: 'tomcat:8.0.32-jre7-alpine',
    },
    {
      name: 'Tomcat:9.0.0.M9-JRE8',
      value: 'tomcat:9.0.0.M9-jre8-alpine',
    },
    {
      name: 'Tomcat:9.0.0.M9-JRE7',
      value: 'tomcat:9.0.0.M9-jre7-alpine',
    },
    {
      name: 'Tomcat:8.0.32-JDK7-apm',
      value: 'tomcat:8.0.32-jdk7-apm-alpine-192',
    },
    {
      name: 'tomcat:8.0.43-jdk7-alpine(jar包使用)',
      value: 'tomcat:8.0.43-jdk7-alpine',
    },
    {
      name: 'tomcat:8.0.43-jdk8-alpine(jar包使用)',
      value: 'tomcat:8.0.43-jdk8-alpine',
    },
  ],

  php: [
    {
      name: 'php: 7.1.6',
      value: 'php: 7.1.6',
    },
  ],
  j2se: [
    {
      name: 'tomcat:8.0.43-jdk7-alpine',
      value: 'tomcat:8.0.43-jdk7-alpine',
    },
    {
      name: 'tomcat:8.0.43-jdk8-alpine',
      value: 'tomcat:8.0.43-jdk8-alpine',
    },
  ]
};

export const IMAGEARRAY = [
  'alpinelinux-png',
  'centos-png',
  'docker-png',
  'elasticsearch-png',
  'fedora-png',
  'haproxy-png',
  'java-png',
  'jenkins-png',
  'jre-png',
  'mysql-png',
  'nginx-png',
  'nodejs-png',
  'php-png',
  'python-png',
  'rabbitmq-png',
  'redis-png',
  'registry-png',
  'tomcat-png',
  'ubuntu-png',
  'wordpress-png',
  'zookeeper-png'
];

export const COLORARRAY = [
  'bg-blue-700', 'bg-orange-600', 'bg-red-A100', 'bg-cyan-500', 'bg-green-500', 'bg-light-blue-400'
]


export const APPTYPE = [
  {
    name: 'Java Web应用',
    value: 'j2ee'
  },
  {
    name: 'Node应用',
    value: 'nodejs'
  },
  {
    name: '静态网站',
    value: 'nginx'
  },
  {
    name: 'Python应用',
    value: 'python'
  },
  {
    name: 'Dubbo应用',
    value: 'dubbo'
  },
  {
    name: 'Go应用',
    value: 'go'
  },
  {
    name: 'PHP应用',
    value: 'php'
  },
  {
    name: 'Java应用',
    value: 'j2se'
  }
]


export const ENV = [
  {
    name: '开发环境',
    key: 'dev',
    value: 'dev'
  },
  {
    name: '测试环境',
    key: 'test',
    value: 'test'
  },
  {
    name: '灰度环境',
    key: 'gray',
    value: 'AB'
  },
  {
    name: '生产环境',
    key: 'prod',
    value: 'pro'
  }
];

export const IS_SUPPORT_GIT_BUILD = ['j2ee', 'nodejs', 'j2se'];

export const NOTICE = {
  j2ee: '*仅可上传类型为.war格式，并大小为不超过200MB的文件',
  j2se: '*仅可上传类型为.jar格式和.zip格式，并大小为不超过200MB的文件',
  dubbo: '*仅可上传类型为.war、.jar或.zip格式，并大小为不超过200MB的文件',
  other: '*仅可上传类型为.tar.gz或.zip格式，并大小为不超过200MB的文件'
};
