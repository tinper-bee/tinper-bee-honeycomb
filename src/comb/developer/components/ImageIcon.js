import classnames from 'classnames';
import './imageIcon.css';

export function ImageIcon (iconPath, classNames, iconType = ''){
    let component = (
        <span style={{ display: 'inline-block'}}  className={classnames("default-png", classNames)}>
        </span>
    );
    let icon = 'cl cl-cloudapp-o';
    switch(iconType){
      case 'product':
        component =  (
          <span className={classnames( 'image-icon-bg',classNames)}>
                    <i className="cl cl-3boxs" />
                </span>
        )
        break;
      case 'business':
        component =  (
          <span className={classnames( 'image-icon-bg',classNames)}>
                    <i className="cl cl-box-p" />
                </span>
        )
        break;
    }

    if(typeof classNames === 'undefined'){
        classNames = "";
    }
    if(typeof iconPath === 'string'){
        if(/.com/.test(iconPath)){
            component =  (
                <img src={`//${iconPath}`} className={classNames} />
            )
        }else if(/bg-/.test(iconPath)){
            component =  (
                <span className={classnames(iconPath, 'image-icon-bg',classNames)}>
                    <i className="cl cl-cloudapp-o" />
                </span>
            )
        }else if(/-png/.test(iconPath)){
            component = (
                <span style={{ display: 'inline-block'}}  className={classnames(iconPath, classNames)}>
                  <i style={{visibility: "hidden" }} className="cl cl-cloudapp-o" />
                </span>
            )
        }
    }else{
        //console.log("iconPath is not a string")
    }
    return component;
}
