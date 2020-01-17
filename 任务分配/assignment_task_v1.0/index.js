var assignmentTaskVue = null
	; (function (KDApi, $) {
		function MyComponent(model) {
			this._setModel(model)
		}
		// 顶层变量声明
		var theATData = []
		var theAToriginData = []
		var theATchangedIds = []
		MyComponent.prototype = {
			// 内部函数不推荐修改
			_setModel: function (model) {
				this.model = model // 内部变量挂载
			},
			init: function (props) {
				console.log("init---", this.model, props)
				setHtml(this.model, props)
			},
			update: function (props) {
				console.log("-----update", this.model, props)
				if (assignmentTaskVue) {
					assignmentTaskVue.handleUpdata(this.model, props)
				}
			},
			destoryed: function () {
				console.log("-----destoryed", this.model)
				assignmentTaskVue = null;
			}
		}
		/**
		 *@description 第一次打开页面加载相关依赖前端文件
		 *
		 * @param {*} model 金蝶内建对象model
		 */
		var setHtml = function (model, props) {
			KDApi.loadFile("./css/element.css", model.schemaId, function () {
				KDApi.loadFile("./css/main.css", model.schemaId, function () {
					KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
						KDApi.loadFile("./js/vue.js", model.schemaId, function () {
							KDApi.loadFile("./js/lodash.js", model.schemaId, function () {
								KDApi.loadFile(
									"./js/element.js",
									model.schemaId,
									function () {
										KDApi.templateFilePath(
											"./html/assignmenttask.html",
											model.schemaId,
											{
												path:
													KDApi.nameSpace(
														model.schemaId
													) + "./img/lock.png"
											}
										).then(function (result) {
											model.dom.innerHTML = result
											if (props.data) {
												if (props.data) {
													// 如果是页面初始化  存储源数据
													// theAToriginData = props.data.data
													theAToriginData = addSortNum(props.data.data)
													// 将源数据处理为页面展示数据
													theATData = formatToTreeData({ arrayList: theAToriginData, idStr: "task_id" })
												}
											}
											assignmentTaskVue = new Vue({
												delimiters: ["${", "}"],
												data: {
													tableData: theATData,
													allChecked: false,
													currentSelectedIds: []
												},
												created() {
												},
												methods: {
													handleUpdata(model, props) {
														if (props.data) {
															theAToriginData = props.data.data
															// 将源数据处理为页面展示数据
															this.tableData = formatToTreeData({ arrayList: theAToriginData, idStr: "task_id" })
														}
													},
													// updateData(originData, selectedIds, changeData) {
													// 	console.log("selectedIds>>>", selectedIds)
													// 	selectedIds.forEach(function (sv) {
													// 		// changedIds.push(sv) //将编辑过得id保存
													// 		//将源数据中对应的任务字段更新
													// 		originData.forEach(function (ov) {
													// 			if (sv === ov.task_id) {
													// 				for (var key in changeData) {
													// 					ov[key] = changeData[key]
													// 				}
													// 			}
													// 		})

													// 	})
													// 	// 处理页面数据更新
													// 	this.tableData = formatToTreeData({ arrayList: originData, idStr: "task_id" })
													// 	console.log("this.tableData>>>", this.tableData)
													// },
													goAssignment() {
														let ids = this.getSelectedId()
														let sendData = {
															data: ids
														}
														if (ids.length > 0) {
															model.invoke(
																"distributeTaskForPersons",
																sendData
															)
														} else {
															alert("未勾选任务")
														}
													},
													taskNameClick(row) {
														let sendData = {
															data: [row.task_id]
														}
														console.log(sendData)

														model.invoke(
															"clickOpenTaskDetail",
															sendData
														)
													},
													handleCheckAllChange(val) {
														this.traversalNode(
															this.tableData[0],
															this.allChecked
														)
													},
													itemChange(row) {
														let check = row.checked
														let temp = this.traversalNode(row, check)
														let tempTableData = _.cloneDeep(this.tableData[0])
														let flatData = this.traversalNode(tempTableData)
														// 获取该节点所在所有父节点
														let parentIds = this.findParentIds(flatData, row.parent)
														console.log("temp>>>", temp)
														if (check) {
															// 如果点击是置true 递归查找所有父节点下的子节点
															// 如果子节点都为true 置该父节点为ture
															// 如果子节点有一个为false  置该父节点以及该父节点的所有父节点为false
															let res = this.helloKids(flatData, parentIds)[0]
															this.tableData = [res]
														} else {
															// 如果点击是置false 直接将该节点的所有父节点置为false
															this.findYouAndSetFalse(this.tableData[0], parentIds)
															this.allChecked = false
														}
													},
													// 树形结构数据扁平化处理  如果需要可以设置该节点以及子节点checked
													traversalNode(node, bool) {
														let nodes = []
														if (node) {
															if (bool !== undefined) node.checked = bool
															let stack = []
															stack.push(node)
															while (stack.length != 0) {
																let item = stack.shift()
																nodes.push(item)
																let children = item.children ? item.children : []
																children.forEach(function (v) {
																	if (bool !== undefined) v.checked = bool
																	stack.push(v)
																})
															}
														}
														return nodes
													},
													// 递归找到所有父节点设为false
													findYouAndSetFalse(node, pids) {
														var that = this
														if (pids.includes(node.task_id)) {
															node.checked = false
														}
														let children = node.children ? node.children : []
														children.forEach(function (v) {
															that.findYouAndSetFalse(v, pids)
														})
													},
													// 在扁平化的树结构数据中递归找到所点击任务的所有父节点task_id
													findParentIds(arr, pid) {
														let pids = []
														let currentpid = pid
														console.log(Array.isArray(arr))
														if (Array.isArray(arr) && arr.length > 0) {
															while (currentpid != 0) {
																arr.forEach(function (v) {
																	if (v.task_id == currentpid) {
																		pids.push(v.task_id)
																		currentpid = v.parent
																	}
																})
															}
														}
														return pids
													},
													// flatdata 为表格绑定的整个数据的扁平化数据  pids为包含所点击节点的所有父节点数组
													// 在整个扁平化数据中循环查找每个父节点下的子节点 判断  
													// 若果有一个子节点为false 置所有父节点为false 
													// 如果循环到当前父节点下的所有子节点都为true  置该父节点为true 继续找该父节点的父节点 重复该步骤
													helloKids(flatdata, pids) {
														let _that = this
														let arr = []
														// 如果pids为空 表示点击的节点为根节点没有父节点 直接置为true
														if (pids.length == 0) {
															this.allChecked = true
															return flatdata
														}
														for (let i = 0, len = pids.length; i < len; i++) {
															for (let j = 0, jlen = flatdata.length; j < jlen; j++) {
																if (pids[i] == flatdata[j].task_id) {
																	let bool = flatdata[j].checked
																	let children = flatdata[j].children ? flatdata[j].children : []
																	for (let k = 0, klen = children.length; k < klen; k++) {
																		if (!children[k].checked) {
																			bool = false;
																			_that.allChecked = false
																			break;
																		} else {
																			bool = true

																		}
																	}
																	flatdata[j].checked = bool
																	if (bool) {
																		_that.allChecked = true
																	}
																}
															}

														}
														console.log("arr>>>", arr)
														return flatdata
													},
													// 获取选择的任务的task_id
													getSelectedId() {
														let idArr = []
														let tempArr = this.traversalNode(
															this.tableData[0]
														)
														tempArr.forEach(function (v) {
															if (v.checked) {
																idArr.push(v.task_id)
															}
														})
														return idArr
													},
													// saveData() {
													// 	console.log("saveData")
													// 	let saveData = handleATDataAtSave(
													// 		theAToriginData,
													// 		theATchangedIds
													// 	)
													// 	console.log(
													// 		"saveData>>>",
													// 		JSON.stringify(saveData)
													// 	)
													// 	let sendData = {
													// 		data: saveData
													// 	}
													// 	model.invoke(
													// 		"saveQualityPlanData",
													// 		sendData
													// 	)
													// 	theATchangedIds = []  // 保存后 将记录变化任务id的数组置空 防止每次保存都会有上次的记录
													// },
													// refreshData() {
													// 	console.log("refreshData")
													// 	model.invoke(
													// 		"refreshQualityPlanData",
													// 		{}
													// 	)
													// }
												}
											}).$mount("#assignmentTaskApp")
										})
									}
								)
							})
						})
					})
				})
			})
		}

		// 将源数据格式化为表格树形结构数据
		function formatToTreeData({ arrayList, pidStr = 'parent', idStr = 'id', childrenStr = 'children' }) {
			let templist = _.cloneDeep(arrayList)
			let listObj = {}; // 用来储存{key: obj}格式的对象
			let treeList = []; // 用来储存最终树形结构数据的数组
			// 将数据变换成{key: obj}格式，方便下面处理数据
			for (let i = 0; i < templist.length; i++) {
				templist[i].checked = false
				listObj[templist[i][idStr]] = templist[i]
			}
			// 根据pid来将数据进行格式化
			for (let j = 0; j < templist.length; j++) {
				// 判断父级是否存在
				let haveParent = listObj[templist[j][pidStr]]
				if (haveParent) {
					// 如果有没有父级children字段，就创建一个children字段
					!haveParent[childrenStr] && (haveParent[childrenStr] = [])
					// 在父级里插入子项
					haveParent[childrenStr].push(templist[j])
				} else {
					// 如果没有父级直接插入到最外层
					treeList.push(templist[j])
				}
			}
			return treeList
		}
		// 添加排序字段
		function addSortNum(data) {
			if (data.length <= 1) {
				return data
			} else {
				data.forEach(function (fuck) {
					fuck.sortNum = fuck.wbs.split(".").join("")
					for (let i = fuck.sortNum.length; i < 4; i++) {
						fuck.sortNum += "0"
					}
				})
				data.sort(compare('sortNum'))
				return data
			}
		}
		// 排序
		function compare(prop) {
			return function (obj1, obj2) {
				var val1 = obj1[prop];
				var val2 = obj2[prop];
				if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
					val1 = Number(val1);
					val2 = Number(val2);
				}
				if (val1 < val2) {
					return -1;
				} else if (val1 > val2) {
					return 1;
				} else {
					return 0;
				}
			}
		}
		// 处理修改后的数据 将修改后的数据映射到 源数据中
		// function theAToriginDataChanged(theAToriginData, changeData) {
		// 	console.log("theAToriginData>>>", theAToriginData)
		// 	console.log("changeData>>>", changeData)
		// 	changeData.forEach(function (cv) {
		// 		theATchangedIds.push(cv.task_id)
		// 	})
		// 	//... 处理方法
		// 	theAToriginData.forEach(function (ov) {
		// 		changeData.forEach(function (cv) {
		// 			if (ov.task_id == cv.task_id) {
		// 				// console.log("ov>>>", ov)
		// 				// console.log("cv>>>", cv)
		// 				for (var key in cv) {
		// 					ov[key] = cv[key]
		// 				}
		// 			}
		// 		})
		// 	})
		// 	return theAToriginData
		// }
		// function handleATDataAtSave(data, ids) {
		// 	// console.log("进参 data>>>", data)
		// 	// console.log("进参 ids>>>", ids)
		// 	var idArr = _.uniq(ids)
		// 	// console.log("去重后的 idArr>>>", idArr)
		// 	var result = []
		// 	idArr.forEach(function (iv) {
		// 		data.forEach(function (dv) {
		// 			if (iv == dv.task_id) {
		// 				result.push(dv)
		// 			}
		// 		})
		// 	})
		// 	// console.log("有改变的 result>>>", result)
		// 	return result
		// }
		// 注册自定义控件
		KDApi.register("assignment_task_v1.0", MyComponent)
	})(window.KDApi, jQuery)
