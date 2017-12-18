import ReactDOM from 'react-dom';
import ToastModal from '../containers/ToastModal';
/*
 * @method 节流、防抖函数
 * @origin created by yangguoqiang @17/11/07
 * @param 
 *     func        {Function}     执行函数
 *     wait        {Number}       间隔时间
 *     immediate   {[Boolean]}    延迟，首次是否执行
 * @return   {Function} 
 * @demo     this.handleClick = debounce(this.handleClick, 100)
 */
export const debounce = (func, wait, immediate) => {
    let timeout
    return () => {
        const context = this
        const args = arguments
        const later = () => {
            timeout = null
            if (!immediate) {
                func.apply(context, args)
            }
        }
        const callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) {
            func.apply(context, args)
        }
    }
}

/*
 * @method 数字格式化,例如 1111111 => ¥1,111,111.00
 * @origin created by 王涛 @17/11/08
 * @param 
 *     num          number                      需要转换的数值
 *     n            int                         小数位数，可不传，默认是  2
 *     separator    string                      分隔符，可不传，默认是  ‘,’
 *     unit         string                      单位，可不传，默认是  ‘¥’
 * @return   {string} 
 * @demo     numFormat(421321344, '¥', 2, ',')  or numFormat(421321344)
 */
export const numFormat = (num, unit= '¥', n= 2, separator= ',') => {
    num= parseFloat(num);
    let varies= '';
    if (num< 0) {
        num*= -1;
        varies= '-';
    }
    n= n>0 ? n : 2;
    if (n>0) {
        num= num.toFixed(n) + '';
    } else {
        num+= '';
    }
    let index= num.indexOf('.')=== -1 ? num.length : num.indexOf('.');
    let arr= [];
    for(let i= 0; i<= index - 1; i++) {
        if ((index-i)%3=== 0 && i!== 0 && i!== index) {
            arr.push(separator, num[i]);
        } else {
            arr.push(num[i]);
        }
    }
    return unit + varies + arr.join('') + num.substr(index);
};


/*
 * @method toast提示框
 * @origin created by 王涛 @17/11/20
 * @param 
 *     toast           {object}, 所含属性如下     
 *          size:      string, 默认mds(尺寸528*32), 还可传sms(236*32), lgs(528*93), 对应设计图的三种尺寸
 *          color:     string, 默认success, 还可传 danger, warning, info, 对应设计图的四种颜色, 四个icon也会根据color值自动带过来
 *          content：  string/number, 默认为'成功了,哈哈哈...', toast显示的提示文字
 *          title:     string/number, 默认为'成功了', 只在size= 'lgs'生效, toast的title
 *          isRemind:  bool, 默认为false, 是否显示 '不在提醒' 关闭按钮, size= 'sms'时默认不显示关闭按钮
 *          duration:  number, 默认3, toast弹框默认显示时间3s, 不用传, 后期由需求统一定
 * @return   {toast组件} 
 * @demo     toast({size: 'lgs', color: 'info', content: 'just a test', title: 'test'})
 */
export const toast = (props) => {
    props= props || {};
    if (props.size && props.size!== 'mds') {
        props.isRemind= false;
    }
    let { isRemind, size }= props;
    size= size || 'mds';
    let isShow= isRemind ? document.getElementsByClassName(`toast-zijinyun-project-${size}`)[0] : document.getElementsByClassName('toast-zijinyun-project')[0];
    //阻止连续多次点击时页面出现多个toast弹框
    if(isShow) {
        return false;
    }
    let div = document.createElement('div');
    div.className= 'toast-zijinyun-project';
    //为不在提醒设置独立class
    if (isRemind) {
        div.className= `toast-zijinyun-project-${size}`;
    }
    document.getElementById('app').appendChild(div);
    const toasts = ReactDOM.render(<ToastModal {...props} />, div);
    return toasts;
};

/*
 * @method 数组求和
 * @origin created by 王涛 @17/11/08
 * @param 
 *     arr        {arr}     数字型数组
 * @return   {sums} 总和
 * @demo     sum([1,2,3,4,5,6,7])
 */
export const sum = (arr) => {
    //阻止多次点击时页面出现多个弹框
    if (!arr.length) {
        return 0;
    } else if (arr.length=== 1) {
        return arr[0];
    }
    let sums= 0;
    arr.forEach(val => sums+= Number(val) || 0);
    return sums;
};


// Extend the default Number object with a formatMoney() method:
// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (2, "$", ",", ".")
/**
 * @method 货币格式化
 * @origin created by sunzeg @17/11/08
 * @param {*} places 小数位数，默认2位
 * @param {*} symbol 货币符号，默认为"￥"
 * @param {*} thousand 千分符，默认为","
 * @param {*} decimal 小数点，默认为"."
 * @return 
 * @demo    123456.formatMoney(2, "$", ",", ".")
 */
Number.prototype.formatMoney = function (places = 2, symbol = "￥", thousand = ",", decimal = ".") {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toScale(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
        console.log(Math.abs(number - i).toScale(places));
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

/**
 * @method 设置数字精度，处理toFixed的精度问题
 * @origin created by sunzeg @17/12/12
 * @param {*} num   输入数字
 * @param {*} scale 精度位数
 * @demo 处理诸如1.335.toFixed(2) == 1.33的问题
 */
Number.prototype.toScale = function(scale = 2){         
    return Math.round(this * Math.pow(10, scale)) / Math.pow(10, scale);     
}  

/*
 * @method 浮点数减法运算
 * @origin created by gaokung @17/11/20
 * @param 
 *     num1 num2  scale //精度 默认3       {num}     数字
 * @return   number 差值
 * @demo     AccSub(20.1,20,3)
 */

 export const AccSub = (num1, num2 ,scale = 3) =>{
    let r1,r2,m,n;
    try{r1=num1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=num2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return ((num1*m-num2*m)/m).toScale(scale);
 }

/**
 * @method 浮点数乘法运算
 * @origin created by sunzeg @17/12/12
 * @param {*} arg 
 * @param {*} scale 
 */
Number.prototype.accMul = function(arg, scale = 2){
    var m = 0, s1 = this.toString(), s2 = arg.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return (Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)).toScale(2);
}

 /*
 * @method 设置数字精度
 * @origin created by gaokung @17/11/20
 * @param 
 *     num   scale //精度 默认3      
 * @return   float 差值
 * @demo     Fixed(20,3) // 20.000
 */

export const toFixFun = (num ,scale = 3) =>{
    num = num + '';
    if(num.length > 0){
        num = Number(num);
        return num.toFixed(scale);
    }else{
        return num;
    }
 }

  /*
 * @method 去掉浮点数后面占位0
 * @origin created by gaokung @17/11/20
 * @param 
 *     num         
 * @return   float 差值
 * @demo     Fixed(20,3) // 20.000
 */

export const toRmZero = (num) =>{
    if(num.indexOf(".") > 0){
        num = num.replace(/0+?$/, ""); //去掉多余的0
        num = num.replace(/[.]$/, ""); //如最后一位是.则去掉
    }
    return num;
 }

/**
 * @method 当前日期加特定天数
 * @origin created by sunzeg @17/11/23
 * @param {*} startDate 开始日期
 * @param {*} day 累加的填数
 * @param {*} symbol 连接符，缺省时用年月日连接
 * @return 相加后的日期，按照固定的格式输出
 * @demo    dateAdd(currDate, 3, '-');
 */
export const dateAdd = (startDate, day = 0, symbol) => {
    startDate = +startDate + day*1000*3600*24;
    startDate = new Date(startDate);
    if(typeof symbol != "undefined"){
        return startDate.getFullYear() + symbol + (startDate.getMonth() + 1) + symbol + startDate.getDate();
    }
    return startDate.getFullYear() + "年" + (startDate.getMonth() + 1) + "月" + startDate.getDate() + "日";
}