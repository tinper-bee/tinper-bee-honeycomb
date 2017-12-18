import React, { Component } from 'react';
import {Table} from 'tinper-bee';
import {CheckBox} from '../CheckBoxs';
import './index.less';

export default class CheckTable extends Component {
    static defaultProps = {
        isClearChecked: true,
        param: ''
    };
    
    constructor(props) {
        super(props);
        
        this.state = {
			checkedAll:false,
			checkedArray: [],
			checkedList: [],
			checkedBool: false
		};
    }

    componentWillMount () {
        let {selectedBool}= this.props;
        if (selectedBool) {
            this.setState({checkedArray: selectedBool});
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.data!== this.props.data && this.props.isClearChecked) {
            this.setState({
                checkedAll:false,
                checkedArray: [],
                checkedList: [],
                checkedBool: false
            });
        }

        if (nextProps.selectedBool!== this.props.selectedBool) {
            this.setState({
                checkedArray: nextProps.selectedBool
            });
        }
    }
    
    onCheckAll = bool => {
        let checkedArray= [];
        let checkedList= [];
        let { data, selectedList, param }= this.props;
		for (let key in data) {
			checkedArray[key] = bool;
		}
        if (bool) {
            checkedList= JSON.parse(JSON.stringify(data));
            if (param) {
                checkedList= checkedList.map(item => item[param]);
            }
        }
        this.setState({
			checkedAll: bool,
			checkedArray,
			checkedList: bool ? data : [],
			checkedBool: false
        });
        
        selectedList(checkedList, checkedArray);
	};

	onCheckBox = (bool, index) => {
        let {checkedArray, checkedBool, checkedAll} = this.state;
        let {data}= this.props;
		let length= 0;
		checkedArray[index] = bool;
		for (let key in data) {
			if (checkedArray[key]) {
				length++;
			}
		}
		if (length=== data.length) {
			checkedAll= true;
			checkedBool= false;
		} else if (length=== 0) {
			checkedAll= false;
			checkedBool= false;
		} else {
			checkedAll= false;
			checkedBool= true;
		}
		this.checkedHanding(checkedArray, checkedAll, checkedBool);
    };
    
    checkedHanding = (checkedArray, checkedAll, checkedBool) => {
		let { data, selectedList, param }= this.props;
		let checkedList= [];
		for (let key in data) {
			if (checkedArray[key]) {
				checkedList.push(param ? data[key][param] : data[key]);
			}
        }
        
        this.setState({
            checkedAll,
            checkedArray,
            checkedBool,
            checkedList
		});
        selectedList(checkedList, checkedArray);
    };
    
    multiSelect= columns => {
        let { checkedArray, checkedAll } = this.state;
        let { data }= this.props;
        let checkedBool= false;
        let len= data.length;
        while (len--) {
            if (checkedArray[len]) {
                checkedBool = true;
                break;
            }
        }
        let defaultColumns = [
            {
                title: (
                    <CheckBox
                        className="table-checkbox"
                        checked={checkedAll}
                        indeterminate={checkedBool && !checkedAll}
                        isMarginRight={false}
                        onSelect={this.onCheckAll}
                    />
                ),
                key: "checkbox",
                dataIndex: "checkbox",
                width: "5%",
                render: (text, record, index) => {
                    return (
                        <CheckBox
                            className="table-checkbox"
                            checked={checkedArray[index]}
                            isMarginRight={false}
                            onSelect={bool => this.onCheckBox(bool, index)}
                        />
                    );
                }
            }
        ];
        columns = defaultColumns.concat(columns);
        return columns;
    };
	
	render() {
        let { className, columns, data, param, ...others }= this.props;
        let newColumns= this.multiSelect(columns);
        
        return <Table className={`${className} check-table`} columns={newColumns} data={data} {...others}/>
	}
}