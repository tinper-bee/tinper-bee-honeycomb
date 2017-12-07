import {PureComponent, PropTypes} from 'react';

import StepItem from './step-item';

import './index.less';

const STEPINFO = [
  {
    num: '01',
    title: '基本信息'
  },
  {
    num: '02',
    title: '参数配置'
  },
  {
    num: '03',
    title: '创建完成'
  }
];

class Step extends PureComponent {

  render() {
    let {activeStep, onJump} = this.props;
    return (
      <ul className="create-app-step">
        {
          STEPINFO.map((item, index) => {
            //return StepItem(item.num, item.title, activeStep >= index, onJump);
            return (
              <StepItem
                num={item.num}
                showArrow={ index == activeStep }
                title={item.title}
                active={ activeStep >= index }
                onJump={ onJump }
              />
            )
          })
        }
      </ul>
    )
  }
}

export default Step;
