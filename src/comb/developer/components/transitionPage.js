import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Button } from 'tinper-bee';
import styles from './transitionPage.css';

const content = {
    "success": {
        message: "恭喜您，您的应用已经部署成功！",
        notice: "正在配置资源，请您稍等..."
    },
    "pending": {
        message: "应用正在部署中，请您稍等...",
        notice: "正在配置资源"
    },
    "failed": {
        message: "很抱歉，您的应用没有部署成功。",
        notice: "可能由于网络原因等导致部署失败，将回到应用详情页面"
    }
}

const propTypes = {

}

const defaultProps = {

}

class TransitionPage extends Component {

    constructor(props){
        super(props);

    }

    handleBack = () => {
        history.go(-2);
    }
    render(){
        const  state  = this.props.params.state;
        let { id, imagecata, logId, appName, offset, appId } = this.props.location.query;

        let path1 = `/fe/appManager/index.html#/publish_detail/${id}`;
        let path2 = `/fe/appManager/index.html#/publish_detail/${id}?key=6&logId=${logId}&appName=${appName}&offset=${offset}&appId=${appId}`;

        return (
            <div className="transition-page">
                <div>
                    <img className="image" src={require(`../assets/appManager/${state}.png`)}/>
                    <div className="content">
                        <p className="message">
                            { content[state].message }
                        </p>
                        <p className="notice">
                            { content[state].notice }
                        </p>
                    </div>
                </div>
                {
                    state != 'pending' ?
                    (
                        <div className="control">
                        {
                            state == 'success' ?
                            (
                                    <a href={path2}>
                                        <Button colors="danger" className="success-button">
                                            查看部署详情
                                        </Button>
                                    </a>

                            ) :
                            (
                                    <Button colors="danger" className="success-button" onClick={ this.handleBack }>
                                        返回
                                    </Button>
                            )
                        }

                                <Link to="/">
                                    <Button className="back-button">
                                        {imagecata ?  '去镜像仓库' : '去持续集成'}
                                    </Button>
                                </Link>

                        </div>
                    ) : ""
                }

            </div>
        )
    }
}

TransitionPage.propTypes = propTypes;
TransitionPage.defaultProps = defaultProps;

export default TransitionPage;
