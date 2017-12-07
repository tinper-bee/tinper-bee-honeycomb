import React from 'react'

export default function wrapperComponent(child,source) {

  return class wrappers extends Component {

    constructor(props, context) {
      super(props, context);

    }

    render() {
      return (
        <div className="content">
          <Col md={10}>
            <Panel header="文档展示">
              <div dangerouslySetInnerHTML={{__html:marked(self.state.docs)}}></div>
            </Panel>
            <Panel header="实例展示" >
              {createElement(child)}
            </Panel>
            <Panel header="代码演示" >
                            <pre>
                                <code className="hljs">
                                    <div dangerouslySetInnerHTML={{__html:self.state.code}}></div>
                                </code>
                            </pre>

            </Panel>
          </Col>
          <Col md={2}>
            <Panel header="组件目录结构">
              <iframe src={'/src/application/'+source} width="100%" frameBorder="0"></iframe>
            </Panel>
          </Col>
        </div>
      )
    }

  }

}