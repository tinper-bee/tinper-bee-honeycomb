import React, { Component } from 'react';
import nodataPic from '../../static/images/nodata.png';
// 表格没有数据时显示的占位图片
export default function NoData() {
    return (
        <div>
            <img src={nodataPic} alt="" />
        </div>
    )
}