import { Component } from 'react';
import { Button, Upload, Col, Modal, Icon } from 'tinper-bee';
import Ajax from '../../utils/ajax';
import { toast } from '../../utils/utils';
import './index.less';

import _DEFIMG from '../../static/images/fileImage/default.png';
import _EXCIMG from '../../static/images/fileImage/excel.png';
import _IMGIMG from '../../static/images/fileImage/image.png';
import _TXTIMG from '../../static/images/fileImage/txt.png';
import _PPTIMG from '../../static/images/fileImage/ppt.png';
import _PDFIMG from '../../static/images/fileImage/pdf.png';

// 文件图标选择
export function typeSwitch(params) {
	// 需要哪些后缀名 在添加
	let reg = new RegExp('^.*?.(jpg|jpeg|bmp|gif|xls|xlsx|doc|docx|txt|ppt|pdf|)$');
	if (reg.test(params)) {
		let typeSrc = _DEFIMG;
		if (params != '' && params) {
			let type = params.replace(/.+\./, '');
			if (type === 'jpg' || type === 'jpeg' || type === 'bmp' || type === 'gif') {
				typeSrc = _IMGIMG;
			} else if (type === 'xls' || type === 'xlsx') {
				typeSrc = _EXCIMG;
			} else if (type === 'doc' || type === 'docx' || type === 'txt') {
				typeSrc = _TXTIMG;
			} else if (type === 'ppt') {
				typeSrc = _PPTIMG;
			} else if (type === 'pdf') {
				typeSrc = _PDFIMG;
			}
		}
		return typeSrc;
	} else {
		return _DEFIMG;
	}
}

export default class TmcUplaoder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showFile: false, // 打开文件列表
			haveFile: false, // 有文件
			group: 'single', // 分组
			billID: 'code', // 单据id
			tipInfo: '', // 文件上传状态反馈
			fileList: [], // 上传文件的队列
			showFileList: [], // 上传成功的文件队列
			fileInfo: {}, // 每个文件信息
			resUrl: '/',
			uploading: false,
			isEdit: true,
			showBtn: true,
			reqData: {}
		};
	}
	// 文件改变 ---- 上传中、完成、失败都会调用这个函数。
	handleChange = (info) => {
		let fileList = info.fileList;
		let fileInfo = info.file;
		let tipInfo = '';
		if (fileInfo.status === 'uploading') {
			tipInfo = 2;
		}
		fileList = fileList.slice(-2);
		fileList = fileList.map((file) => {
			if (file.response) {
				file.url = file.response.url;
			}
			return file;
		});
		this.setState({ fileList });
		fileList = fileList.filter((file) => {
			if (file.response) {
				return file.response.status === 1;
			}
			return true;
		});
		if (fileInfo.status === 'done') {
			if (fileInfo.response) {
				switch (fileInfo.response.status) {
					case -1:
						tipInfo = -1;
						break;
					case 0:
						tipInfo = 0;
						break;
					case 1:
						let { data } = fileInfo.response;
						this.setState({ showFileList: [ ...this.state.showFileList, ...data ] });
						tipInfo = 1;
						break;
					default:
						break;
				}
			}
			// message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === 'error') {
			tipInfo = 0;
		}
		this.setState({ tipInfo, fileInfo });
	};
	// 删除操作
	handleRemove = (fileInfo) => {
		let { id, filename } = fileInfo;
		let { showFileList } = this.state;
		const _this = this;
		Ajax({
			url: 'http://tmc-file.app.yyuap.com/file/delete',
			mode: 'normal',
			method: 'get',
			params: {
				id: id
			},
			success: function(res) {
				let resData = res.data;
				if (resData.status === 1) {
					let msg = resData.message;
					let content = `附件功能：${filename} `;
					showFileList.splice(showFileList.findIndex((item) => item.id === id), 1);
					if (showFileList.length === 0) {
						_this.setState({ haveFile: false });
					}
					_this.setState({ showFileList });
					if (typeof msg === 'string') {
						content += msg;
					}
					toast({ color: 'success', content: content });
				} else {
					let msg = resData.message;
					let content = `附件功能：${filename}`;
					if (typeof msg === 'string') {
						content += msg;
					} else {
						msg.map((item, index) => {
							content += item.DefaultMessage;
						});
					}
					toast({ color: 'danger', content: content });
				}
			}
		});
	};
	// 附件展示列
	showFileUploadList = () => {
		let { showFileList, isEdit } = this.state;
		if (showFileList.length === 0) {
			return null;
		}
		return (
			<div className='tmc_uploader_fileList'>
				{showFileList.map((fileItem, index) => {
					let Tscr = typeSwitch(fileItem.filename);
					return (
						<div className='tmc_uploadr_item_content' title={fileItem.filename}>
							<img
								className='tmc_file_ico'
								src={Tscr}
								onClick={this.handleDownload.bind(this, fileItem.id)}
							/>
							<span className='tmc_file_name'>{fileItem.filename}</span>
							{isEdit ? (
								<i
									onClick={this.handleRemove.bind(this, fileItem)}
									className='uf uf-close tmc_uploader_del display_type'
								/>
							) : null}
						</div>
					);
				})}
			</div>
		);
	};
	// 下载文件
	handleDownload = (id) => {
		Ajax({
			url: 'http://tmc-file.app.yyuap.com/file/download',
			mode: 'normal',
			method: 'get',
			params: {
				id: id
			},
			success: function(res) {
				let resData = res.data;
				if (resData.status === 1) {
				} else {
					let msg = resData.message;
					let content = '附件功能：';
					if (typeof msg === 'string') {
						content += msg;
					} else {
						msg.map((item, index) => {
							content += item.DefaultMessage;
						});
					}
					toast({ color: 'danger', content: content });
				}
			}
		});
	};
	// 上传状态
	fileUploadtype = () => {
		let { tipInfo } = this.state;
		switch (tipInfo) {
			case -1:
				return '上传参数不正确';
				break;
			case 0:
				return '上传失败';
				break;
			case 1:
				return '上传成功';
				break;
			case 2:
				return '正在上传。。。';
				break;
			default:
				break;
		}
	};
	// 附件查询
	fileSearchFun = () => {
		let { billID, group } = this.state;
		const _this = this;
		Ajax({
			url: 'http://tmc-file.app.yyuap.com/file/query',
			mode: 'normal',
			method: 'get',
			params: {
				filepath: billID,
				groupname: group
			},
			success: function(res) {
				let resData = res.data;
				if (resData.status === 1) {
					if (resData.data.length > 0) {
						_this.setState({
							haveFile: true,
							showFileList: resData.data
						});
					}
				} else {
					// let msg = resData.message;
					// let content = '附件功能：';
					// if (typeof msg === 'string') {
					// 	content += msg;
					// } else {
					// 	msg.map((item, index) => {
					// 		content += item.DefaultMessage;
					// 	});
					// }
					// toast({ color: 'danger', content: content });
				}
			}
		});
	};

	componentWillReceiveProps(nextProps) {
		let { billID } = nextProps;
		if (this.state.billID !== billID) {
			this.setState({
				billID: billID
			});
			this.fileSearchFun();
		}
	}

	componentWillMount() {
		let { billID } = this.props;
		// 上传附件组件 更新校验 正式环境需要删除
		if (billID === undefined) {
			alert(
				'上传附件组件已经更新，请及时更新。\n 适配说明请查看： http://git.yonyou.com/nc_platform/tmc_front/tree/master/src/containers/TmcUploader \n 更新之后弹窗自动消失！'
			);
		}
		this.setState({
			billID: billID
		});
		this.fileSearchFun();
	}
	render() {
		const { showFile, haveFile, fileList, billID, group, fileInfo, tipInfo } = this.state;
		const props = {
			action: 'http://tmc-file.app.yyuap.com/file/upload',
			data: {
				filepath: billID,
				groupname: group,
				url: false,
				isencrypt: true,
				thumbnail: '500w',
				isreplace: false,
				permission: 'read'
			},
			onRemove: this.handleRemove,
			onChange: this.handleChange,
			fileList: this.state.fileList,
			showUploadList: false
		};
		return (
			<div className='tmc_uploader_content'>
				<div
					className='tmc_uploader_open'
					onClick={() => {
						this.state.showFile = !showFile;
						this.state.fileInfo = {};
						this.state.tipInfo = '';
						if (this.state.showFile) {
							this.fileSearchFun();
						}
						this.setState({
							fileInfo: {},
							tipInfo: '',
							showFile: this.state.showFile
						});
					}}
				>
					<i className={haveFile ? 'iconfont icon-youfujian' : 'iconfont icon-wufujian'} />
				</div>
				{showFile ? (
					<div className='tmc_uploader_files'>
						<div className='head'>
							<div className='title'>附件</div>
							<Upload {...props}>
								<Button className='btn'>上传附件</Button>
							</Upload>
							<div className='info'>
								{fileInfo.name ? `${fileInfo.name} ` : null}
								<span className={tipInfo === 0 ? 'error-color' : 'success-color'}>
									{this.fileUploadtype()}
								</span>
							</div>
							<i
								className='uf uf-close'
								onClick={() => {
									this.setState({
										fileInfo: {},
										tipInfo: '',
										showFile: false
									});
								}}
							/>
						</div>
						<div className='content'>{this.showFileUploadList()}</div>
					</div>
				) : null}
			</div>
		);
	}
}
