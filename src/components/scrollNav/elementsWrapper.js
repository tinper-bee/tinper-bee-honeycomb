import React, { PropTypes } from 'react';
import { Element } from 'react-scroll';
import { content } from './style.css';

const ElementsWrapper = ({ children, items, style, className }) => (
    <div className={content}>
        {children.map((child, i) => (
            <Element style={style} className={className} name={items[i].target} key={i} >{child}</Element>
        ))}
    </div>
);

ElementsWrapper.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]).isRequired,
    style: PropTypes.object,
    className: PropTypes.string
}

export default ElementsWrapper;
