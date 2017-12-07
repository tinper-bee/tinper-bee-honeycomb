import { Component, PropTypes } from 'react'
import { Switch, Clipboard } from 'tinper-bee'

import withStyle from './withStyle.hoc'
import VerifyInput from '../../components/verifyInput'
import { randomString } from '../util'

class Password extends Component {
  static PropTypes = {
    manualPass: PropTypes.string,
    setManualPassword: PropTypes.func,
    setManualPassValidation: PropTypes.func,

    manualPassBack: PropTypes.string,
    setManualPassBack: PropTypes.func,
    setManualPassBackValidation: PropTypes.func,

    autoPass: PropTypes.string,
    setAutoPassword: PropTypes.func,
    setAutoFlag: PropTypes.func,
  }
  static defaultProps = {

  }
  state = {
    auto: false,
  }

  autoIt = () => {
    this.setState({ auto: true });
    // generate auto password herer;

    this.props.setAutoFlag(true);
    const pw = randomString(8);
    this.props.setAutoPassword(pw);

  }
  deAutoIt = () => {
    this.props.setManualPassword('');
    this.props.setManualPassValidation(false);
    this.props.setManualPassBack('');
    this.props.setManualPassBackValidation(false);

    this.setState({ auto: false });
    this.props.setAutoFlag(false);
    this.props.setAutoPassword('')
  }

  copyPassword = (e) => {
    const ele = this.refs.textToCopy;
    ele.select();
    // js=ele.createTextRange()
    js.execCommand('Copy', false, null);
  }

  render() {
    const { style } = this.props;
    return (
      <div style={style.main}>
        <div style={style.manual}>
          <div style={style.select}>
            <div style={style.switch}>
              <input type="radio" name="pwmethod"
                style={style.radio}
                checked={!this.state.auto}
                onClick={this.deAutoIt}
              />
            </div>
            <span style={style.label}>直接输入密码</span>
          </div>
          <div style={Object.assign({}, style.select, { marginLeft: 50 })}>
            <div style={style.switch}>
              <input type="radio" name="pwmethod"
                style={style.radio}
                checked={this.state.auto}
                onClick={this.autoIt}
              />
            </div>
            <span style={style.label}>自动生成密码</span>
          </div>


          {
            !this.state.auto
              ? (
                <div>
                  <div style={style.password}>
                    <span style={Object.assign({}, style.label, { float: 'left' })}>服务密码</span>
                    <VerifyInput
                      verifyClass="verify-class"
                      verify={/^[\d\w]{6,20}$/}
                      isRequire
                      message={'请输入6-20位的字母、数字或者_'}
                      method={'blur'}
                      feedBack={this.props.setManualPassValidation}
                    >
                      <input type="password" style={style.input}
                        autoComplete="new-password"
                        value={this.props.manualPass}
                        onChange={(e) => {
                          this.props.setManualPassword(e.target.value);
                        }}
                      />
                    </VerifyInput>
                  </div>
                  <div style={style.password}>
                    <span style={Object.assign({}, style.label, { float: 'left' })}>确认服务密码</span>
                    <VerifyInput
                      verifyClass="verify-class"
                      verify={() => { return this.props.manualPass === this.props.manualPassBack }}
                      isRequire
                      message={'两次输入密码不相同'}
                      method={'blur'}
                      feedBack={this.props.setManualPassBackValidation}
                    >
                      <input type="password" style={style.input}
                        autoComplete="new-password"
                        value={this.props.manualpassBack}
                        onChange={(e) => { this.props.setManualPassBack(e.target.value) }}
                      />
                    </VerifyInput>
                  </div>
                </div>
              )
              : (
                <div>
                  <span style={style.tips}>系统为您生成的密码</span>
                  <span style={style.autoPass}>
                    <span>{this.props.autoPass}</span>
                    <span className="float-right">
                      <Clipboard
                        text={this.props.autoPass}
                        action="copy"
                      />
                    </span>
                  </span>
                </div>
              )
          }
        </div>
      </div>
    )
  }
}


export default withStyle(() => ({
  main: {
    width: 600,
  },
  switch: {
    display: 'inline-block',
  },
  radio: {
    width: '18px',
    height: '18px',
    top: '4px',
    position: 'relative',
    outline: 'none',
  },
  label: {
    display: 'inline-block',
    color: '#5d5d5d',
    width: 100,
    textAlign: 'left',
    marginLeft: '10px',
  },
  select: {
    display: 'inline-block',
    marginBottom: '25px',
  },
  password: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  input: {
    border: '1px solid #d9d9d9',
    borderRadius: '3px',
    paddingLeft: '5px',
    lineHeight: '26px',
    fontSize: 25,
    width: 490,
    height: 26,
  },

  autoPass: {
    display: 'inline-block',
    width: 170,
    height: 40,
    fontSize: 18,
    padding: 5,
    marginLeft: 10,
    color: '#008bfa',
    backgroundColor: '#f8f8f8',
    border: '1px solid #ccc',

    icon: {
      fontSize: 22,
      float: 'right',
      cursor: 'pointer',
    }
  },
}))(Password)


