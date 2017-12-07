import {Component} from 'react';
import {Form, Label, FormControl, FormGroup, Select, Col, Button} from 'tinper-bee';
import { verifyIsSupportGitbuild } from '../../utils';

const Option = Select.Option;

import imgempty from 'assets/img/taskEmpty.png';

const GitInfo = (props) => {

    let {onUrlChange, branchList, onAdd, data} = props;
    let address = '', branch = '';

    let gitUrl = data.gitUrl;


    if (!verifyIsSupportGitbuild(data.appType) && data.status !== 'Create App') {

      return (
        <Col md={12} className="config-empty">
          <img src={imgempty} alt=""/>

          <div>
            <p>目前只有java类型和nodejs应用支持源码构建，我们后续会提供其他应用支持。</p>

          </div>
        </Col>
      )
    }

    if (!gitUrl) {
      return (
        <Col md={12} className="config-empty">
          <img src={imgempty} alt=""/>

          <div>
            <p>当前应用下还没有源码地址，需要您配置一下哦</p>

            <Button
              shape="squared"
              colors="primary"
              onClick={ onAdd }>
              添加源码信息
            </Button>
          </div>
        </Col>
      )
    }

    let url = gitUrl.split('::');
    address = url[0];
    branch = url[1];


    return (
      <Form horizontal style={{width: 500, marginLeft: 20}}>
        <FormGroup>
          <Label>仓库地址</Label>
          <FormControl value={ address }/>
        </FormGroup>
        <FormGroup>
          <Label>分支</Label>
          <Select value={ branch } onSelect={ onUrlChange }>
            {
              branchList.map((item, index) => {
                return (
                  <Option value={ item } key={ index }>
                    { item }
                  </Option>
                )
              })
            }
          </Select>
        </FormGroup>
      </Form>
    )
}

export default GitInfo;
