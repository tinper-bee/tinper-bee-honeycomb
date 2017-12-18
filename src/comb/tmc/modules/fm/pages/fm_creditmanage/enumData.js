export const agreeStatusAry = [
	{ key: '待提交', value: '0' },
	{ key: '待审批', value: '3' },
	{ key: '未执行', value: '1' },
	{ key: '在执行', value: '5' },
	{ key: '已结束', value: '6' }
]; // 协议状态

export const vbillStatusAry = [
	{ key: '待提交', value: '0' },
	{ key: '待审批', value: '3' },
	{ key: '审批中', value: '2' },
	{ key: '已审批', value: '1' }
]; // 审批状态

export const creditTypeAry = [
	{ key: '票据承兑', value: '1' },
	{ key: '票据贴现', value: '2' },
	{ key: '进口押汇', value: '3' },
	{ key: '保函', value: '4' },
	{ key: '信用证', value: '5' },
	{ key: '流动资金贷款', value: '6' },
	{ key: '项目贷款', value: '7' },
	{ key: '发债', value: '8' },
	{ key: '其他', value: '9' }
]; // 授信种类子表下的类型下拉框和授信明细下的授信种类下拉框

export const agreeTypeAry = [ { key: '集团授信', value: 'group' }, { key: '企业授信', value: 'org' } ]; // 协议类型下拉框
export const controlTypeAry = [
	{ key: '提示', value: 'prompt' },
	{ key: '控制', value: 'control' },
	{ key: '不控制', value: 'uncontrol' }
]; // 卡片和授信明细列表下的控制方式下拉框

export const creditControlTypeAry = [ { key: '总额控制', value: 'total' }, { key: '余额控制', value: 'balance' } ]; // 授信占用方式下拉框

export const periodUnitAry = [
	{ key: '年', value: 'YEAR' },
	{ key: '季度', value: 'QUARTER' },
	{ key: '月', value: 'MONTH' },
	{ key: '日', value: 'DAY' }
]; // 期间单位下拉

export const guaranteeTypeAry = [
	{ key: '信用', value: '1' },
	{ key: '保证', value: '2' },
	{ key: '质押', value: '3' },
	{ key: '抵押', value: '4' },
	{ key: '保证金', value: '5' },
	{ key: '混合', value: '6' }
]; // 担保方式下拉
