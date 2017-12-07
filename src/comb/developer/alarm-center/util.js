import { Message } from 'tinper-bee'


/**
   * 验证实例的状态，只有运行的时候，才可以进行跳转
   */
export function stringToObj(data) {
    let obj={};
    obj[data]=data;
    if(data=="OK"){
        obj.flag=1;
    }else{
       obj.flag=0;
    }
  
    return obj.flag;
}






