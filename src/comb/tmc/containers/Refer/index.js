import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Icon, FormControl, InputGroup, Row, Col, Con } from 'tinper-bee';
import axios from 'axios';
import './index.less';
import Qs from 'qs';
import 'bee-loading/build/Loading.css';
import Loading from 'bee-loading';
import Collapse from 'bee-collapse';
import { toast } from '../../utils/utils.js';

class Refer extends Component {
	static defaultProps = {
		value: {},
		isMultiSelectedEnabled: false, //是否多选
		refName: 'name', //参照名称
		refCode: 'code', //参照编码
		pk_val: '', //参照过滤pk
		condition: null, //模糊搜索{name:'111',code:'111'}
		isReturnCode: false, //是否返回编码
		refModelUrl: '', //参照请求地址
		multiLevelMenu: [
			{
				name: ['名称'],
				code: ['refname']
			}
		], //多级菜单
		isTreeCanSelect: false, //多级菜单的树是否可选
		hotDataSize: 20,
		ctx: '/uitemplate_web', //请求上下文
		showLabel: false, //是否显示label
		pageSize: 20, //分页请求数据时每页条数
		disabled: false, //是否禁用
		referClassName: '', //参照最外层classname
		className: '', //参照input的classname
		style: {}, //参照最外层样式
		clientParam: {}, //自定义条件
		placeholder: '',
		referFilter: {},
		showHistory: true
	};
	constructor(props) {
		super(props);
		let { isMultiSelectedEnabled } = this.props;
		this.state = {
			value: this.props.value,
			cascaderVal: isMultiSelectedEnabled
				? this.props.value.map(e => e.refname).join(',')
				: this.props.value.refname,
			cascader: [],
			currentLevel: 0,
			searchList: { pageInfo: { currPageIndex: 1 }, data: [] },
			historyList: [],
			isShow: false,
			searchShow: false,
			historyShow: false,
			loading: false,
			selectedpks: {}
		};
		this.suffix = String(Math.random()).split('.')[1];
		this.canload = true;
		this.interval = 0;
		this.fixTop = 0;
		this.fixLeft = 0;
		this.fixWidth = 0;
		this.parentid = '';
		this.typeCode = '';
		this.keyWords = '';
		this.detailcategory = '';
	}

	componentDidMount() {
		// this.matchPKRefJSON();
		ReactDOM.unmountComponentAtNode(this.referContainer);
		document.body.appendChild(this.referContainer);
		document.body.addEventListener('click', this.close);
	}

	//计算参照下拉定位
	componentWillUpdate(nextProps, nextState) {
		let { isShow, historyShow, searchShow } = nextState;
		let { multiLevelMenu } = this.props;
		let clientHeight = document.documentElement.clientHeight,
			clientWidth = document.documentElement.clientWidth,
			inputWidth = document.getElementById('refer-input' + this.suffix).offsetWidth,
			inputHeight = document.getElementById('refer-input' + this.suffix).offsetHeight,
			selectWidth = isShow
				? multiLevelMenu.length
					? multiLevelMenu.length * inputWidth + (multiLevelMenu.length - 1) * 4
					: inputWidth
				: inputWidth,
			offsetLeft = document.getElementById('refer-input' + this.suffix).getBoundingClientRect().left +
				(document.documentElement.scrollLeft || document.body.scrollLeft),
			offsetTop =
				document.getElementById('refer-input' + this.suffix).getBoundingClientRect().top +
				(document.documentElement.scrollTop || document.body.scrollTop),
			top = document.getElementById('refer-input' + this.suffix).getBoundingClientRect().top,
			left = document.getElementById('refer-input' + this.suffix).getBoundingClientRect().left,
			fixTop = 0,
			fixLeft = 0;
		this.fixWidth = inputWidth;
		this.selectWidth = selectWidth;
		if (top + inputHeight + 200 > clientHeight) {
			this.fixTop = offsetTop - 200;
		} else {
			this.fixTop = offsetTop + inputHeight;
		}

		if (left + selectWidth > clientWidth) {
			this.fixLeft = left + inputWidth - selectWidth;
		} else {
			this.fixLeft = offsetLeft;
		}
	}
	componentWillReceiveProps(nextProps) {
		if (!this.props.isMultiSelectedEnabled) {
			if (nextProps.value.refpk) {
				this.setState({
					cascaderVal: nextProps.value.refname,
					value: nextProps.value
				});
			} else {
				this.setState({
					cascaderVal: '',
					value: {}
				});
			}
		} else if (this.props.isMultiSelectedEnabled) {
			if (nextProps.value.refpk) {
				this.setState({
					cascaderVal: nextProps.value.map(e => e.refname),
					value: nextProps.value
				});
			} else {
				this.setState({
					cascaderVal: '',
					value: []
				});
			}
		}
	}

	//横向滚动条始终在最右侧
	componentDidUpdate() {
		//设置横向滚动时总是到最右侧
		document.querySelector(`#refer-list${this.suffix}>div`).scrollLeft = 10000;
	}

	componentWillUnmount() {
		if (this.referContainer) {
			document.body.removeChild(this.referContainer);
		}
		document.body.removeEventListener('click', this.close);
	}

	//请求数据
	loadData = async level => {
		await new Promise(resolve => {
			this.setState(
				{
					loading: true
				},
				() => {
					let { cascader, currentLevel, cascaderVal } = this.state;
					let {
						multiLevelMenu,
						ctx,
						refModelUrl,
						refCode,
						refClientPageInfo,
						pageSize,
						clientParam,
						referFilter
					} = this.props;
					let param = {
						refModelUrl: `${refModelUrl}`,
						refCode: refCode,
						'refClientPageInfo.pageSize': pageSize,
						'refClientPageInfo.currPageIndex': cascader[level] ? cascader[level].pageInfo.currPageIndex : 0,
						clientParam: JSON.stringify({
							parentid: this.parentid,
							detailcategory: level + 1,
							maincategory: this.maincategory,
							typeCode: this.typeCode,
							keyWords: this.keyWords || '',
							referFilter,
							...clientParam
						})
					};
					param = Qs.stringify(param);
					//后台请求数据
					axios({
						url: `${ctx}/iref_ctr/commonRefsearch`,
						method: 'post',
						data: param,
						headers: {
							'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
							'X-Requested-With': 'XMLHttpRequest'
						}
					}).then(res => {
						if (!res || !res.data) {
							toast({ color: 'danger', content: '请求失败' });
							return;
						}
						let data;
						data = res.data.data.map((e, i) => {
							e.refpk = e.refpk || e.id
							return e
						});
						cascader[level] = {
							pageInfo: { ...cascader[level].pageInfo, pageCount: res.data.page.pageCount },
							data: cascader[level].data.concat(data)
						};
						this.setState({
							cascader,
							loading: false
						});
						this.canload = true;
						resolve();
					});
				}
			);
		});
	};

	getOptions = async (item, level, e) => {
		let { cascader, currentLevel } = this.state;
		let { multiLevelMenu, hotDataSize, isTreeCanSelect } = this.props;
		cascader[level - 1].selectedData = item.refpk;
		this.clearSearch();
		if (typeof multiLevelMenu === 'object' && multiLevelMenu.length) {
			//点击的是分类
			if (multiLevelMenu.length > level) {
				//如果没到最后一级分类，则查询下级分类
				// cascader.length = level + 1;
				if (isTreeCanSelect) {
					this.select(item, e);
				}
				cascader[level] = {
					data: [],
					pageInfo: {
						currPageIndex: 1,
						pageSize: this.props.pageSize
					}
				};
				this.parentid = item.refpk;
				this.typeCode = item.refcode;
				this.keyWords = item.refname;
				await this.loadData(level);
			} else {
				//否则选中数据
				this.select(item, e);
			}
			this.setState({
				cascader,
				currentLevel: level
			});
		} else {
			//点击的是数据列，选中数据
			this.select(item, e);
		}
	};

	select = (item, e) => {
		e.stopPropagation();
		if (this.props.isMultiSelectedEnabled) {
			// 多选
			let { selectedpks, value } = this.state;
			if (item.refpk) {
				selectedpks[item.refpk] = !selectedpks[item.refpk];
				if (selectedpks[item.refpk]) {
					// 选中
					value.push(item);
				} else {
					// 取消选中
					let i = value.findIndex(e => e.refpk === item.refpk);
					value.splice(i, 1);
				}
				this.props.onChange && this.props.onChange(value);
				this.setState({ selectedpks, value });
			}
		} else {
			// 单选
			let { hotDataSize, isTreeCanSelect, multiLevelMenu } = this.props;
			let { selectedpks, isShow, currentLevel } = this.state;
			this.props.onChange && this.props.onChange(item);
			if (item.refpk) {
				// 存入已选择
				selectedpks = { [item.refpk]: !selectedpks[item.refpk] };
				//存入历史记录localStorage
				let history = localStorage[this.props.refCode + this.props.multiLevelMenu.length]
					? localStorage[this.props.refCode + this.props.multiLevelMenu.length].split('&&&').map(e => JSON.parse(e))
					: [];
				let index = history.findIndex(e => e.refpk === item.refpk);
				if (index === -1) {
					history.unshift(item);
					if (history.length > hotDataSize) {
						history = history.slice(0, hotDataSize);
					}
				} else {
					let t = history.splice(index, 1);
					history.unshift(t[0]);
				}
				localStorage[this.props.refCode + this.props.multiLevelMenu.length] = history.map(e => JSON.stringify(e)).join('&&&');
			}
			if (isShow && isTreeCanSelect && currentLevel < multiLevelMenu.length - 1) {
				this.setState({
					selectedpks
				});
			} else {
				this.setState({
					currentLevel: 0,
					isShow: false,
					searchShow: false,
					historyShow: false,
					cascader: [],
					selectedpks
				});
			}
		}
	};

	search = () => {
		this.interval = new Date().getTime();
		let s = setTimeout(() => {
			if (new Date().getTime() - this.interval >= 500) {
				this.setState(
					{
						loading: true
					},
					() => {
						let { searchList, currentLevel, cascaderVal } = this.state;
						let {
							multiLevelMenu,
							ctx,
							refModelUrl,
							refCode,
							refClientPageInfo,
							pageSize,
							clientParam,
							referFilter
						} = this.props;
						let param = {
							refModelUrl: `${refModelUrl}`,
							refCode: refCode,
							'refClientPageInfo.pageSize': pageSize,
							'refClientPageInfo.currPageIndex': searchList.pageInfo.currPageIndex,
							content: JSON.stringify({
								name: cascaderVal,
								code: cascaderVal
							}),
							clientParam: JSON.stringify({
								keyWords: cascaderVal || clientParam.keyWords || '',
								// typeCode: multiLevelMenu.length ? '1' : '0',
								accounttype: '',
								referFilter,
								detailcategory: multiLevelMenu.length,
								...clientParam
							})
						};
						param = Qs.stringify(param);
						//后台请求数据
						axios({
							url: `${ctx}/iref_ctr/matchBlurRefJSON`,
							method: 'post',
							data: param,
							headers: {
								'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
								'X-Requested-With': 'XMLHttpRequest'
							}
						})
							.then(res => {
								if (!res || !res.data) {
									toast({ color: 'danger', content: '请求失败' });
									return;
								}
								let data = searchList.data.concat(res.data.data.map((e, i) => {
									e.refpk = e.refpk || e.id
									return e
								}));
								this.setState({
									searchList: {
										data,
										pageInfo: { ...searchList.pageInfo, pageCount: res.data.page.pageCount }
									},
									loading: false
								});
								// this.canload = true;
							})
							.catch(err => {
								//alert(err.message);
							});
					}
				);
			}
			clearTimeout(s);
		}, 500);
	};

	getMoreOptions = index => {
		let { cascader, isShow, searchList, searchShow } = this.state;
		//加载下一页
		if (isShow) {
			cascader[index].pageInfo.currPageIndex++;
			console.log('第', index + 1, '级菜单加载下一页，现在第', cascader[index].pageInfo.currPageIndex, '页');
			this.loadData(index);
		} else if (searchShow) {
			searchList.pageInfo.currPageIndex++;
			console.log('搜索结果加载下一页，现在第', searchList.pageInfo.currPageIndex, '页');
			this.search();
		}
	};

	highLight = (val, cascader) => {
		if (!val) {
			cascader[0] = JSON.parse(JSON.stringify(data));
		} else {
			let regExp = new RegExp(val, 'gi');
			cascader[0].map(item => {
				item.refname = item.refname.replace(regExp, `<span style= 'color: red'>${val}</span>`);
			});
		}
		this.setState({
			cascader
		});
	};

	blur = e => {
		e.stopPropagation();
		//如果有搜索结果，失去焦点时取第一条结果，没有结果则置空
		let { searchShow, searchList, historyShow, isShow } = this.state;
		let { isTreeCanSelect } = this.props;
		if (!isTreeCanSelect) {
			if (isShow) {
				this.select(this.props.value, e);
			} else if (searchShow && searchList.data && searchList.data.length) {
				this.select(this.state.searchList.data[0], e);
			} else {
				this.select({}, e);
			}
		}
		console.log('失去焦点时校验数据的准确性');
	};

	focus = e => {
		e.stopPropagation();
		if (this.props.disabled) {
			return false;
		}
		let { refCode } = this.props;
		let historyList = [],
			searchShow,
			historyShow;
		if (!e.target.value) {
			//显示历史记录
			if (localStorage[this.props.refCode + this.props.multiLevelMenu.length]) {
				historyList = localStorage[this.props.refCode + this.props.multiLevelMenu.length].split('&&&').map(e => JSON.parse(e));
			}
			searchShow = false;
			historyShow = true;
		} else {
			this.state.searchList.data = [];
			this.search();
			searchShow = true;
			historyShow = false;
			// this.highLight(e.target.value, cascader);
		}
		this.setState({
			cascaderVal: e.target.value,
			searchShow,
			historyList,
			historyShow,
			isShow: false
		});
	};

	//分页加载
	ulScroll = (level, e) => {
		let { cascader, isShow } = this.state;
		if (!isShow) {
			return;
		}
		if (e.target.scrollTop > e.target.firstChild.clientHeight - e.target.clientHeight - 5) {
			if (cascader[level].pageInfo.currPageIndex < cascader[level].pageInfo.pageCount) {
				this.canload && this.getMoreOptions(level);
				this.canload = false;
			}
		}
	};

	close = e => {
		let { isShow, searchShow, historyShow } = this.state;
		let { isMultiSelectedEnabled } = this.props;
		if (!(isShow || searchShow || historyShow)) {
			return false;
		}
		if (
			!(
				e.target.matches(`#refer${this.suffix} span.icon-canzhao`) ||
				e.target.matches(`#refer${this.suffix} input.refer-input`) ||
				e.target.matches(`#refer-container${this.suffix} p.list-title`) ||
				e.target.matches(`#refer-container${this.suffix} li.refer-li`) ||
				e.target.matches(`#refer-container${this.suffix} div.refer-scroll`)
			)
		) {
			if (!isMultiSelectedEnabled) {
				this.blur(e);
			}
			this.setState({
				isShow: false,
				searchShow: false,
				historyShow: false
			});
		}
	};

	referClick = e => {
		e.stopPropagation();
		if (this.props.disabled) {
			return false;
		}
		let { cascader, currentLevel } = this.state;
		let { multiLevelMenu } = this.props;
		this.clearSearch();
		currentLevel = 0;
		cascader = [
			{
				data: [],
				pageInfo: {
					currPageIndex: 1,
					pageSize: this.props.pageSize
				}
			}
		];
		this.setState(
			{
				cascader,
				currentLevel,
				searchShow: false,
				isShow: true,
				historyShow: false
			},
			() => {
				if (typeof multiLevelMenu === 'object' && multiLevelMenu.length) {
					// 多级菜单型
					this.maincategory = Number(this.props.clientParam.maincategory);
					this.asyncLoad(e);
				} else {
					// 列表型
					this.loadData(0);
				}
			}
		);
	};

	asyncLoad = async function (e) {
		await this.loadData(0);
		let length = this.props.multiLevelMenu.length;
		let { cascader } = this.state;
		for (let i = 1; i < length; i++) {
			cascader[i - 1].data[0] && await this.getOptions(cascader[i - 1].data[0], i, e);
		}
	};
	clearSearch = () => {
		this.parentid = '';
		this.typeCode = '';
		this.keyWords = '';
		this.detailcategory = '';
		this.maincategory = '';
	};

	render() {
		let {
			cascader,
			isShow,
			currentLevel,
			searchList,
			searchShow,
			cascaderVal,
			loading,
			historyShow,
			historyList,
			selectedpks
		} = this.state;
		let { fixTop, fixLeft, fixWidth, suffix } = this;
		let length = Object.keys(cascader).length;
		let {
			value,
			refName,
			refCode,
			disabled,
			refModelUrl,
			isFixed,
			multiLevelMenu,
			showLabel,
			isMultiSelectedEnabled,
			showHistory
		} = this.props;
		// let multiMenuWidth = multiLevelMenu.length ? (currentLevel + 1) * fixWidth + currentLevel * 4 : '100%';
		let multiMenuWidth = multiLevelMenu.length
			? multiLevelMenu.length * fixWidth + (multiLevelMenu.length - 1) * 4
			: fixWidth;
		return (
			<Row
				componentClass="div"
				className={`refer ${this.props.referClassName}`}
				id={'refer' + this.suffix}
				style={this.props.style}
			>
				<Loading container={document.getElementById('refer-list' + suffix)} show={loading} />
				<Loading container={document.getElementById('search-list' + suffix)} show={loading} />
				{showLabel && (
					<Col
						componentClass="span"
						className="ref-name"
						xs={3}
						style={{ position: 'relative', lineHeight: '28px' }}
					>
						{refName}
					</Col>
				)}
				<Col xs={showLabel ? 9 : 12} style={{ position: 'relative', zIndex: 0, padding: 0, lineHeight: 0 }}>
					<FormControl
						id={'refer-input' + this.suffix}
						className={`refer-input ${this.props.className}`}
						disabled={disabled || false}
						onChange={this.focus}
						value={cascaderVal}
						onFocus={this.focus}
						placeholder={this.props.placeholder}
					/>
					<span
						className="iconfont icon-canzhao"
						style={{ color: '#999', cursor: this.props.disabled ? 'not-allowed' : 'pointer' }}
						onClick={e => {
							this.referClick(e);
						}}
					/>
					<div
						id={'refer-container' + this.suffix}
						ref={dom => {
							this.referContainer = dom;
						}}
					>
						<Collapse
							in={isShow}
							style={{
								overflow: 'hidden',
								// width: multiLevelMenu.length ? 'auto' : fixWidth,
								// maxWidth: fixWidth,
								width: this.selectWidth,
								top: fixTop,
								left: fixLeft
							}}
							onEnter={() => {
								document.getElementById('refer' + this.suffix).style.zIndex = 9999999;
							}}
							onEntered={() => {
								document.getElementById('refer-list' + suffix).style.overflow = 'auto';
							}}
							onExit={() => {
								document.getElementById('refer-list' + suffix).style.overflow = 'hidden';
							}}
							onExited={() => {
								if (!(isShow || searchShow || historyShow)) {
									document.getElementById('refer' + this.suffix).style.zIndex = 0;
								}
							}}
						>
							<div id={'refer-list' + suffix} className="refer-cascading-list clearfix">
								<div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
									<div
										style={{
											width: multiMenuWidth,
											height: '100%',
											backgroundColor: '#eee',
											overflowY: 'hidden'
										}}
									>
										{cascader[currentLevel] &&
											cascader.map((list, level) => {
												if (currentLevel >= level) {
													return (
														<div
															className={'scroll-div'}
															key={level}
															style={{
																// width: 100 / (currentLevel + 1) + '%'
																width:
																	(multiMenuWidth - currentLevel * 4) /
																	multiLevelMenu.length
																// width:
																// 	(multiMenuWidth - currentLevel * 4) /
																// 	(currentLevel + 1)
															}}
														>
															<p className="list-title">
																{multiLevelMenu[level].name.join('/')}
															</p>
															<div
																className="refer-scroll"
																onScroll={e => {
																	this.ulScroll(level, e);
																}}
															>
																<ul
																	className="refer-cascading-item"
																	key={level}
																	style={{
																		width: multiLevelMenu.length ? 'auto' : '100%'
																	}}
																>
																	{list.data.map((item, i) => {
																		let label = multiLevelMenu[level].code
																			.map((e, i) => {
																				return item[e];
																			})
																			.join('/');
																		return (
																			<li
																				title={label}
																				className={
																					'clearfix refer-li' +
																					(selectedpks[item.refpk]
																						? ' selected'
																						: '') +
																					(list.selectedData === item.refpk
																						? ' active'
																						: '')
																				}
																				key={i}
																				onClick={this.getOptions.bind(
																					this,
																					item,
																					Number(level) + 1
																				)}
																			>
																				{label}
																				{level < multiLevelMenu.length - 1 && (
																					<Icon
																						type="uf-anglearrowpointingtoright"
																						style={{
																							float: 'right',
																							marginRight: '-21px'
																						}}
																					/>
																				)}
																			</li>
																		);
																	})}
																</ul>
															</div>
														</div>
													);
												} else {
													return null;
												}
											})}
									</div>
								</div>
							</div>
						</Collapse>
						<Collapse
							in={searchShow}
							style={{
								overflow: 'hidden',
								width: fixWidth,
								top: fixTop,
								left: fixLeft
							}}
							onEnter={() => {
								document.getElementById('refer' + this.suffix).style.zIndex = 9999999;
							}}
							onEntered={() => {
								document.getElementById('refer-list' + suffix).style.overflow = 'auto';
							}}
							onExit={() => {
								document.getElementById('refer-list' + suffix).style.overflow = 'hidden';
							}}
							onExited={() => {
								if (!(isShow || searchShow || historyShow)) {
									document.getElementById('refer' + this.suffix).style.zIndex = 0;
								}
							}}
						>
							<div id={'search-list' + suffix} className="refer-cascading-list refer-search">
								<div className="scroll-div">
									<p className="list-title">搜索结果</p>
									<div className="refer-scroll" onScroll={this.ulScroll}>
										<ul className="refer-cascading-item" style={{ width: '100%' }}>
											{searchList.data.map((item, i) => {
												let label = multiLevelMenu[multiLevelMenu.length - 1].code
													.map((e, i) => {
														return item[e];
													})
													.join('/');
												return (
													<li
														className="refer-li"
														key={i}
														onClick={this.select.bind(this, item)}
													>
														{label}
													</li>
												);
											})}
										</ul>
									</div>
								</div>
							</div>
						</Collapse>
						<Collapse
							in={showHistory && historyShow}
							style={{
								overflow: 'hidden',
								width: fixWidth,
								top: fixTop,
								left: fixLeft
							}}
							onEnter={() => {
								document.getElementById('refer' + this.suffix).style.zIndex = 9999999;
							}}
							onEntered={() => {
								document.getElementById('refer-list' + suffix).style.overflow = 'auto';
							}}
							onExit={() => {
								document.getElementById('refer-list' + suffix).style.overflow = 'hidden';
							}}
							onExited={() => {
								if (!(isShow || searchShow || historyShow)) {
									document.getElementById('refer' + this.suffix).style.zIndex = 0;
								}
							}}
						>
							<div id={'history-list' + suffix} className="refer-cascading-list refer-history">
								<div className="scroll-div">
									<p className="list-title">历史记录</p>
									<div className="refer-scroll">
										<ul className="refer-cascading-item" style={{ width: '100%' }}>
											{historyList.map((item, i) => {
												let label = multiLevelMenu[multiLevelMenu.length - 1].code
													.map((e, i) => {
														return item[e];
													})
													.join('/');
												return (
													<li
														className={
															'clearfix refer-li' +
															(selectedpks[item.refpk]
																? ' selected'
																: '')
														}
														key={i}
														onClick={this.select.bind(this, item)}
													>
														{label}
													</li>
												);
											})}
										</ul>
									</div>
								</div>
							</div>
						</Collapse>
					</div>
				</Col>
			</Row>
		);
	}
}

// Canscading.propTypes = {
// 	value: React.PropTypes.string.isRequired,
// 	onChange: React.PropTypes.func.isRequired,
// 	refcode: React.PropTypes.string.isRequired,
// 	refModelUrl: React.PropTypes.string.isRequired
// };

export default Refer;
