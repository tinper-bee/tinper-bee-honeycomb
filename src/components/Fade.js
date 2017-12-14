import React,{createElement,Component} from 'react'
import { Transition } from 'react-transition-group'

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0.01},
  entered: { opacity: 1 },
};

export default function Fade(child,source) {

  return class wrappers extends Component {

    constructor(props, context) {
      super(props, context);

    }

    render() {
      return (
        <Transition in={!this.props.show} appear={true} timeout={duration}>
          {(state) => (
            <div style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}>
              {createElement(child)}
            </div>
          )}
        </Transition>
      )
    }

  }

}