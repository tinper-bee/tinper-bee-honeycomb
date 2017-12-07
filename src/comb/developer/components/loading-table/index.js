import React, { Component } from 'react';
import { Table, Pagination } from 'tinper-bee';
import PageLoading from '../loading';

import './index.less';

class LoadingTable extends Component{
    constructor(props){
        super(props);

    }


    render(){
      let {columns, data, showLoading, ...prop} = this.props;
        return(
            <div className="loading-table">
                <Table
                    columns={ columns }
                    data={ data }
                    { ...prop }
                />
                <PageLoading loadingType='rotate' show={ showLoading } container={ this } />
            </div>

        )
    }
}

export default LoadingTable;
