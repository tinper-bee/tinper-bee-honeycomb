import {Message} from 'tinper-bee';
import {HTMLDecode} from '../components/util';
export function domainListData(response,errormessage,successmessage,reFreshFlag) {
    let data = response.data;
    if (!errormessage) {
        errormessage = '数据操作失败'
    } else {
        errormessage = HTMLDecode(errormessage);
    }
    ;
    if (!data)  {
        console.log(errormessage);
        Message.create({content: errormessage, color: 'danger',duration:1});
        return;
    }
    if(successmessage){
        //Message.create({content: successmessage, color: 'success',duration:1});
        return;
    }
    if (data.success == "false") { Message.create({content: data.message, color: 'danger',duration:1}); return;}
    if (data.detailMsg && data.detailMsg.data) {
        if(reFreshFlag) Message.create({content: "操作成功", color: 'success',duration:1});

        return data.detailMsg.data;
    }
}