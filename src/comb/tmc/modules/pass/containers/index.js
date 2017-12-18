import DatePickerSelect from './DatePickerSelect';
import Ajax from '../../../utils/ajax.js';
import DeleteModal from '../../../containers/DeleteModal';
import MsgModal from '../../../containers/MsgModal';
import Tips from '../../../containers/Tips';
import Radios from '../../../containers/Radios';
import {CheckBox, CheckBoxs} from '../../../containers/CheckBoxs';
import PageJump from '../../../containers/PageJump';
import CheckTable from '../../../containers/CheckTable';
import Refer from '../../../containers/Refer';
import BreadCrumbs from '../../bd/containers/BreadCrumbs';
import Form from 'bee-form';
import { CheckboxItem, RadioItem, TextAreaItem, InputItem, DateTimePickerItem} from 'containers/FormItems';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import moment from 'moment';
import nodataPic from '../../../static/images/nodata.png';
const URL= window.reqURL.pass;
const format = 'YYYY-MM-DD';
const { FormItem } = Form;
const detailOpertion= [
    {path: 'settle', title: '手工结算', msg: '手工结算成功', content: '此操作不可逆，请谨慎操作'},
    {path: 'onpay', title: '网银支付', msg: '网银支付成功', content: ''},
    {path: 'handconfirm', title: '手工确认', msg: '手工确认完成', content: '此操作不可逆，请务必和银行确定实际支付结果后进行操作'},
    {path: 'disable', title: '作废', msg: '作废成功', content: '此操作不可逆，请谨慎操作'},
    {path: 'settle', title: '批量手工结算', msg: '批量手工结算成功', content: '此操作不可逆，请谨慎操作'},
    {path: 'onpaynocheck', title: '网银支付', msg: '网银支付成功', content: ''},
];

export {
    DatePickerSelect, 
    Ajax, 
    DeleteModal, 
    MsgModal, 
    PageJump,
    CheckTable,
    Tips, 
    Radios,
    CheckBox,
    CheckBoxs, 
    Refer, 
    BreadCrumbs, 
    CheckboxItem, 
    RadioItem, 
    TextAreaItem, 
    InputItem, 
    DateTimePickerItem, 
    zhCN, 
    URL, 
    format,
    moment,
    Form,
    FormItem,
    detailOpertion,
    nodataPic
};