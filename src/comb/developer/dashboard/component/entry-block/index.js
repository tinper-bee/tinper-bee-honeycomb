import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import './index.less';
export default class EntryBlock extends PureComponent {

  setHeight = () => {
    let height = document
      .defaultView
      .getComputedStyle(this.refs.block, null)
      .width;
    this.refs.block.style.height = height;
  }
  onResize = () => {
    this.setHeight()
  }
  componentDidMount() {
    this.setHeight();
    window.addEventListener('resize', this.onResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize, false);
  }
  render() {
    let props = this.props;
    return (
      <a
        target="_blank"
        href={props.href}
        ref="block"
        className="entry-block"
      >
        <div
          className="entry-block--body"
        >

          <img
            style={this.props.captionStyle}
            className={`entry-block--icon`}
            src={props.imgsrc}
            width={props.width}
          />
          <div
            className="entry-block--name"
          >
            {props.name}
          </div>
        </div>
      </a>
    )
  }
}

EntryBlock.propTypes = {
  href: PropTypes.string.isRequired,
  imgsrc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  captionStyle: PropTypes.object,
}

// EntryBlock.defaultProps = {
//   href: '',
//   imgsrc: '',
//   name: ''
// }