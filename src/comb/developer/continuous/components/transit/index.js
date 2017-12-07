import React, {Component} from 'react';
import {Modal, Button, Message} from 'tinper-bee';
import imgempty from 'assets/img/taskEmpty.png';

function TransitModal (show, onClose) {
  return (
    <Modal show={ show }  onHide={onClose}>
      <Modal.Body>
        <div className="config-transit  text-center">
          <img src={imgempty} alt="" />
          <p>没有可供提取的配置文件，如果需要修改请到配置中心哦。</p>
          <Button
            shape="squared"
            colors="primary"
            style={{ color: '#fff', marginTop: 20, marginBottom: 20 }}
          >
            <a href="/confcenter/index.html#confMgr/page">去配置中心</a>
          </Button>
          <Button
            shape="squared"
            colors="primary"
            onClick={ onClose }
            style={{ marginLeft: 50, marginTop: 20, marginBottom: 20 }}
            bordered
          >
            取消
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )

}


export default TransitModal;
