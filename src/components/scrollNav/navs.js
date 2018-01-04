import React from 'react';
import { Link ,animateScroll as scroll} from 'react-scroll';
import {
  link,
  activeLink,
  item,
  cover,
  navs,
} from './style.css';


const Navs = ({
  items,
  offset,
  duration,
  delay
}) => {
  return (
    <div className={cover}>
      <ul className={navs}>
        {
          items = items.map(({ label, target }, i) => (
            <li key={i}>
              <Link
                className={link}
                activeClass={activeLink}
                to={target}
                spy={true}
                smooth={true}
                offset={i==0?(-80):offset}
                duration={duration}
                isDynamic={true}
                delay={delay}>
                {label}
              </Link>
            </li>
          ))
        }
      </ul>
    </div>
  );
};
export default Navs;