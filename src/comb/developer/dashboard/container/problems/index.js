import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.less';
export default class Problem extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
    }))
  }
  static defaultProps = {
    data: [{
      title: '什么是资源池?',
      content: '资源池是一组用来部署应用的主机的集合，它能够更加有效的利用主机或虚拟机的CPU、内存等资源'
    }, {
      title: '如何使用自有资源池？',
      content: '在“资源池”界面，点击右上角“添加资源池”按钮;输入资源池的名称，点击"确定"，等待几秒后，即可看到新建的自有资源池;在创建的自有资源池卡片中点击“添加主机”按钮，输入主机名称，点击“确定”进入接入脚本页面;ssh进入要接入的linux主机，在命令行中输入接入脚本页面的shell脚本，即可自动安装接入脚本，安装状态栏显示“安装成功”后，主机完成接入'
    }, {
      title: '如何快速创建一个应用？',
      content: '进入“持续集成”菜单，点击左上角的“创建新应用”，填写对应的表单即可完成新应用的创建'
    }, {
      title: '如何查看我上传的应用？',
      content: '进入用友云开发者中心，点击左侧菜单栏的“持续集成”，即可看到用户上传的应用'
    }, {
      title: '如何查看应用的详情？',
      content: '进入“应用管理”菜单，点开一个具体的应用，可以显示应用的域名、镜像、创建时间等，同时提供了暂停、重启、销毁、升级、回滚、上架等功能以及应用的实例、属性、事件、监控信息、域名、日志和配置文件等详情信息'
    }, {
      title: '为什么我上传的应用构建失败了？',
      content: '请点击“应用管理”进入上传的应用中，点击“日志”选项卡查看应用日志，在其中寻找报错的详细信息，进而定位问题。描述文件编写错误，应用所需资源无法正常下载等情况，都可能造成应用构建失败'
    }, {
      title: '可以基于源代码进行构建么？',
      content: '用友云开发者中心支持源代码构建和war包进行应用构建，您可以选择任意一种形式'
    }, {
      title: '如何给别人添加资源池权限？',
      content: '进入资源池菜单，找到对应的资源池，在右上角点击权限管理;点击对应授权按钮后，就可以看到已授权用户的信息;可以点击“添加新用户”来增加目标用户的权限，在搜索栏搜索目标用户，选中目标用户后，选择对应权限，点击“授权”即可完成授权;然后就可以看到已授权用户的情况，可以在“操作”栏里对用户的权限进行修改，以及删除授权用户'
    }, {
      title: '开发者中心都支持哪几种类型的应用？',
      content: '共支持8种类型的应用，分别为JavaWeb应用，Dubbo应用，Node.js应用，静态网站，Python应用，Go应用，PHP应用，Java应用'
    }, {
      title: 'docker的应用场景有哪些？',
      content: 'Web 应用的自动化打包和发布;自动化测试和持续集成、发布;在服务型环境中部署和调整数据库或其他的后台应用;从头编译或者扩展现有的OpenShift或Cloud Foundry平台来搭建自己的PaaS环境'
    }]
  }

  state = {
    index: -1,
  }


  componentDidMount(){
    window.addEventListener('resize',this.onResize);
  }
  componentWillUnmount(){
    window.addEventListener('resize',this.onResize);
  }

  showBoard = () => {
    return this.state.index >= 0;
  }

  handleProblemClick = (index) => {
    return (e) => {
      this.setState({
        index,
      });
    }
  }
  handleContentClose = () => {
    this.setState({
      index: -1,
    })
  }

  limitDataLength = (data) => {
    let width = document.documentElement.clientWidth;
    if (width > 1600 && width < 1740 || width < 1060) {
      return data.slice(0, 5)
    }
    else return data.slice(0, 10);
  }



  onResize=()=>{
    this.forceUpdate();
  }
  render() {
    let { data } = this.props;
    let { showBoard } = this;

    data = this.limitDataLength(data);

    return (
      <div className="problem">
        {(!showBoard()) && data.map((item, index) => {
          return (
            <span className="problem--item"
              onClick={this.handleProblemClick(index)}
              title={item.title}
            >
              {item.title}
            </span>
          )
        })}

        {showBoard() && (<div className="problem--board">
          <div>{this.props.data[this.state.index].title}</div>
          <div
            onClick={this.handleContentClose}
            className="problem--ret cl cl-close-c-o"
          />
          {
            textSplit(this.props.data[this.state.index].content)
          }
        </div>)}
      </div>
    )
  }
}


function textSplit(str) {
  let ret = str.split(';');
  if (ret.length == 1) {
    return str;
  }
  return ret.map((item, index) => {
    return (
      <div>
        {index + 1}、{item}
      </div>
    )
  });
}