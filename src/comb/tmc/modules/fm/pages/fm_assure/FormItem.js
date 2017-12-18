import React, { Component } from 'react';
import  Form from 'bee-form';
import { CheckboxItem, RadioItem, TextAreaItem, ReferItem , SelectItem, InputItem, DateTimePickerItem} from 'containers/FormItems';

const { FormItem } = Form;
export default class FormItemTab extends  Component {

	state = {
		tabs: this.props.tabs,
	}
	componentWillReceiveProps(nextProp) {
	    this.setState({
		
	    });
  	}	


	render() {
		let self = this;
		let { tabs} = this.state;
		return (
			<Form useRow={true}
				 submitAreaClassName='classArea'
				 showSubmit={false}　>
				 <FormItem inline={true}
					 showMast={false} labelXs={2} labelSm={2} labelMd={2} labelXsOffset={1} labelMdOffset={1} labelSmOffset={1} xs={1} md={1} sm={1}
					 labelName="实际使用可质押价值本币："
					 method="change">
					 <InputItem name="usinglcamount"
						 type="customer"
						 isViewMode
						 defaultValue={tabs.usinglcamount.value}
					 />
				 </FormItem>
				 <FormItem inline={true}
					 showMast={false} labelXs={1} labelSm={1} labelMd={1} labelXsOffset={2} labelMdOffset={2} labelSmOffset={2} xs={1} md={1} sm={1}
					 labelName="经办人："
					 method="change">
					 <InputItem name="dealer"
						 type="customer"
						 isViewMode
						 defaultValue={tabs.dealer.value}
					 />
				 </FormItem>
				 <FormItem inline={true}
					 showMast={false} labelXs={1} labelSm={1} labelMd={1} labelXsOffset={2} labelMdOffset={2} labelSmOffset={2} xs={1} md={1} sm={1}
					 labelName="日期："
					 method="change">
					 <InputItem name="makedate"
						 type="customer"
						 isViewMode
						 defaultValue={tabs.makedate.value}
					 />
				 </FormItem>
				 <FormItem inline={true}
					 showMast={false} labelXs={2} labelSm={2} labelMd={2} labelXsOffset={1} labelMdOffset={1} labelSmOffset={1} xs={1} md={1} sm={1}
					 labelName="质押协议号："
					 method="change">
					 <InputItem name="pledgepno"
						 type="customer"
						 isViewMode
						 defaultValue={tabs.pledgepno.value}
					 />
				 </FormItem>
				 <FormItem inline={true}
					 showMast={false} labelXs={2} labelSm={2} labelMd={2} labelXsOffset={1} labelMdOffset={1} labelSmOffset={1} xs={1} md={1} sm={1}
					 labelName="规格型号："
					 method="change">
					 <InputItem name="p_specno"
						 type="customer"
						 isViewMode
						 defaultValue={tabs.p_specno.value}
					 />
				 </FormItem>
				 <FormItem inline={true}
					 showMast={false} labelXs={1} labelSm={1} labelMd={1} labelXsOffset={2} labelMdOffset={2} labelSmOffset={2} xs={1} md={1} sm={1}
					 labelName="数量："
					 method="change">
					 <InputItem name="p_count"
						 type="customer"
						 isViewMode
						 defaultValue={tabs.p_count.value}
					 />
				 </FormItem>
				 <FormItem inline={true}
					 showMast={false} labelXs={2} labelSm={2} labelMd={2} labelXsOffset={1} labelMdOffset={1} labelSmOffset={1} xs={1} md={1} sm={1}
					 labelName="单位："
					 method="change">
					 <InputItem name="p_unit"
						 type="customer"
						 isViewMode
						 defaultValue={tabs.p_unit.value}
					 />
				 </FormItem>
				 <FormItem inline={true}
					 showMast={false} labelXs={1} labelSm={1} labelMd={1} labelXsOffset={2} labelMdOffset={2} labelSmOffset={2} xs={1} md={1} sm={1}
					 labelName="单价："
					 method="change">
					 <InputItem name="p_price"
						 type="customer"
						 isViewMode
						 defaultValue={tabs.p_price.value}
					 />
				 </FormItem>
				 <FormItem inline={true}
					 showMast={false} labelXs={1} labelSm={1} labelMd={1} labelXsOffset={2} labelMdOffset={2} labelSmOffset={2} xs={1} md={1} sm={1}
					 labelName="质量："
					 method="change">
					 <InputItem name="p_quality"
						 type="customer"
						 isViewMode
						 defaultValue={tabs.p_quality.value}
					 />
				 </FormItem>
				 <FormItem inline={true}
					 showMast={false} labelXs={1} labelSm={1} labelMd={1} labelXsOffset={2} labelMdOffset={2} labelSmOffset={2} xs={1} md={1} sm={1}
					 labelName="状况："
					 method="change">
					 <InputItem name="p_status"
						 type="customer"
						 isViewMode
						 defaultValue={tabs.p_status.value}
					 />
				 </FormItem>
				 <FormItem inline={true}
					 showMast={false} labelXs={1} labelSm={1} labelMd={1} labelXsOffset={2} labelMdOffset={2} labelSmOffset={2} xs={1} md={1} sm={1}
					 labelName="所在地："
					 method="change">
					 <InputItem name="p_location"
						 type="customer"
						 isViewMode
						 defaultValue={tabs.p_location.value}
					 />
				 </FormItem>
				 <FormItem inline={true}
					 showMast={false} labelXs={1} labelSm={1} labelMd={1} labelXsOffset={2} labelMdOffset={2} labelSmOffset={2} xs={1} md={1} sm={1}
					 labelName="可质押价值："
					 method="change">
					 <InputItem name="maxpledge"
						 type="customer"
						 isViewMode
						 defaultValue={tabs.maxpledge.value}
					 />
				 </FormItem>
			 </Form>
		);
	}
}