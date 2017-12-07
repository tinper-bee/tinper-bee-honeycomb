import classNames from 'classnames';
import { Button } from 'tinper-bee';

const CLASS = {
  "01": 'first',
  "02": 'second',
  "03": 'third'
};


const StepItem = ({num, title, active, onJump, showArrow}) => {
  return (
    <li className={ classNames("create-app-step-item", CLASS[num],{ 'active': active})}>
      <div className="ident">STEP</div>
      <div className="num">{num}</div>
      <div className="title">{title}</div>
      {
        num === '02' && active ? <Button bordered className="jump-btn" onClick={ onJump }>跳过</Button> : null
      }
      {
        showArrow ? (
          <div className="step-arrow" />
        ) : null
      }
    </li>
  )
}

export default StepItem;
