/**
 * 数据合法性校验
 */
const defnum = 0;
let _rate = 0;

// 控制输入整数
/**
     * value: e.target.value
     * max: 最大值
     * min: 最小值
     */
export const inputNumberProcess = (value, max, min) => {
	var rate = parseInt(value);
	if (isNaN(rate)) {
        // _rate = defnum;
		rate = defnum;
		// this.setState({ info: '只能输入数字!' });
		setTimeout(
			function() {
				// this.setState({ info: '' });
			}.bind(this),
			1000
		);
	} else if (rate > max ? max : Math.max() - 1 || rate < min ? min : 0) {
		rate = _rate;
		// this.setState({ info: '利率精度不能大于8或小于0!' });
		setTimeout(
			function() {
				// this.setState({ info: '' });
			}.bind(this),
			1000
		);
	} else {
		_rate = rate;
	}
	return rate;
};
/**
 * 控制金额、利率等精度
 * @param {*当前字段值} rate 
 * @param {*精度} precision 
 */
export const rateInputCtr = (rate, precision) => {
	let strmny = rate;
	var digit = parseInt(precision);
	// 包含小数点
	if (strmny.indexOf('.') != -1) {
		// 按小数点分割
		var strPart = strmny.split('.');
		// 整数部分
		var intPart = strPart[0];
		var intReg = /^[1-9]\d*|0$/;
		if (!(intReg.test(intPart) && intPart.length <= 3)) {
			return false;
		}
		// 小数部分
		var potPart = strPart[1];
		var potReg = new RegExp('^\\d{0,' + digit + '}$');
		if (!(potReg.test(potPart) && potPart.length <= digit)) {
			return false;
		}
	} else {
		var reg = /^[1-9]\d*|0$/;
		// 整数位满后只能输入小数
		// strmny=parseInt(strmny);
		if (!reg.test(strmny)) {
			return false;
		}
	}
	return true;
};
