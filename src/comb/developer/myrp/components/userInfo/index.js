import {Component, PropTypes} from 'react';

import {Row, Col, FormControl, Label, Icon, InputGroup, Button, Message, Switch} from 'tinper-bee';

import VerifyInput from '../../../components/verifyInput/index';

import { email, phone } from '../../../lib/regexp';

import classnames from 'classnames';

import './index.less';

class Inform extends Component {
  static propTypes = {}
  static defaultProps = {}
  state = {
    data: {},
    buttonFlag: false,
    showError: 'none',
    showFlagEmail: true,
    showFlagTel: false,
  }


  render() {

    let {onInputChange, data, onSwitchCheck, showFlagEmail, showFlagTel, removeInfo} = this.props;
    return (
      <div className="informUser">
        <Row className="">
          <div className="clearfix margin-top-20">
            <Col xs={2} className="text-right ">


                            <span
                              onClick={onSwitchCheck('showFlagEmail')}
                              className={classnames({'u-switch': true, 'is-checked': showFlagEmail})}
                              tabIndex="0">
                                <span className="u-switch-inner"/>
                            </span>

              {/*<Switch*/}
              {/*checked={ showFlagEmail }*/}
              {/*onChangeHandler={ onSwitchCheck('showFlagEmail') }*/}
              {/*/>*/}

            </Col>
            <Col xs={3} className="text-right ">
              <Label>
                通知邮箱
              </Label>
            </Col>
            <Col xs={7} className="height-60">
              {
                <div>
                  <VerifyInput
                    message="邮箱格式不正确"
                    isRequire
                    verify={email}>
                  <InputGroup simple>
                    <FormControl
                      value={ data.Email }
                      placeholder="请输入邮箱"
                      onChange={onInputChange('Email')}
                    />

                    <InputGroup.Button onClick={removeInfo('Email')}>
                      <Icon className="close" type="uf-close-c"/>
                    </InputGroup.Button>
                  </InputGroup>
                  </VerifyInput>
                </div>
              }
            </Col>
          </div>
          <div className="clearfix margin-top-20">
            <Col xs={2} className="text-right ">

                            <span
                              onClick={onSwitchCheck('showFlagTel')}
                              className={classnames({'u-switch': true, 'is-checked': showFlagTel})}
                              tabIndex="0">
                                <span className="u-switch-inner"/>
                            </span>

              {/*<Switch*/}
              {/*checked={ showFlagTel }*/}
              {/*onChangeHandler={ onSwitchCheck('showFlagTel') }*/}
              {/*/>*/}
            </Col>
            <Col xs={3} className="text-right">
              <Label>
                通知手机号
              </Label>
            </Col>
            <Col xs={7} className="height-60">
              {
                <div>

                  <VerifyInput
                    message="手机号码格式不正确"
                    isRequire
                    verify={phone}>
                    <InputGroup simple>
                      <FormControl
                        value={data.PhoneNum}
                        placeholder="请输入手机号"
                        onChange={onInputChange('PhoneNum')}
                      />

                      <InputGroup.Button onClick={removeInfo('PhoneNum')}>
                        <Icon className="close" type="uf-close-c"/>
                      </InputGroup.Button>
                    </InputGroup>
                  </VerifyInput>

                </div>
              }
            </Col>
          </div>

        </Row>
      </div>
    )
  }
}

export default Inform;
