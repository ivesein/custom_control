new Vue({
	delimiters: ["${", "}"],
	data: {
		tableData: [],
		allChecked: false,
		selectOptions: [{
			value: 'start',
			label: '开始日期'
		},
		{
			value: 'end',
			label: '结束日期'
		}
		],
		selectValue: '开始日期',
		pickedDateRange: []
	},
	created() {
		var tData = [
			{
				task_id: 1, //任务id
				wbs: "1", //任务代码
				task_name: "西藏墨脱项目", //任务名称
				task_type: "",  //任务类型
				task_start_time: "",  //开始时间
				task_end_time: "",  //结束时间
				duration: "",  //工期
				design_owner: "", //设计承担人
				design_participant: "", //设计参与人
				review_owner: "",  //复核承担人
				audit_owner: "",  //一审承担人
				parent: 0, //父节点任务id
				type: "project",  //该条任务所属类型  project  task  milestone
				if_bill_checked: "否"
			},
			{
				task_id: 2, //任务id
				wbs: "1.1", //任务代码
				task_name: "内页设计工作", //任务名称
				task_type: "",  //任务类型
				task_start_time: "",  //开始时间
				task_end_time: "",  //结束时间
				duration: "",  //工期
				design_owner: "", //设计承担人
				design_participant: "", //设计参与人
				review_owner: "",  //复核承担人
				audit_owner: "",  //一审承担人
				parent: 1, //父节点任务id
				type: "task",  //该条任务所属类型  project  task  milestone
				if_bill_checked: "否"
			},
			{
				task_id: 3, //任务id
				wbs: "1.2", //任务代码
				task_name: "基础数据处理", //任务名称
				task_type: "",  //任务类型
				task_start_time: "",  //开始时间
				task_end_time: "",  //结束时间
				duration: "",  //工期
				design_owner: "", //设计承担人
				design_participant: "", //设计参与人
				review_owner: "",  //复核承担人
				audit_owner: "",  //一审承担人
				parent: 1, //父节点任务id
				type: "project",  //该条任务所属类型  project  task  milestone
				if_bill_checked: "是"
			},
			{
				task_id: 4, //任务id
				wbs: "1.2.1", //任务代码
				task_name: "平纵数据自检修改完成", //任务名称
				task_type: "专业审核",  //任务类型
				task_start_time: "",  //开始时间
				task_end_time: "",  //结束时间
				duration: "",  //工期
				design_owner: "", //设计承担人
				design_participant: "", //设计参与人
				review_owner: "",  //复核承担人
				audit_owner: "",  //一审承担人
				parent: 3, //父节点任务id
				type: "task",  //该条任务所属类型  project  task  milestone
				if_bill_checked: "否",
				audit_tasks: [
					{
						task_id: 5,
						isAssignment: true
					},
					{
						task_id: 6,
						isAssignment: false
					},
					{
						task_id: 7,
						isAssignment: false
					}
				]
			},
			{
				task_id: 5, //任务id
				wbs: "1.2.2", //任务代码
				task_name: "路基", //任务名称
				task_type: "一般任务",  //任务类型
				task_start_time: "",  //开始时间
				task_end_time: "",  //结束时间
				duration: "",  //工期
				design_owner: "", //设计承担人
				design_participant: "", //设计参与人
				review_owner: "",  //复核承担人
				audit_owner: "",  //一审承担人
				parent: 3, //父节点任务id
				type: "task",  //该条任务所属类型  project  task  milestone
				if_bill_checked: "否"
			},
			{
				task_id: 6, //任务id
				wbs: "1.2.3", //任务代码
				task_name: "桥梁", //任务名称
				task_type: "",  //任务类型
				task_start_time: "",  //开始时间
				task_end_time: "",  //结束时间
				duration: "",  //工期
				design_owner: "", //设计承担人
				design_participant: "", //设计参与人
				review_owner: "",  //复核承担人
				audit_owner: "",  //一审承担人
				parent: 3, //父节点任务id
				type: "task",  //该条任务所属类型  project  task  milestone
				if_bill_checked: "否"
			},
			{
				task_id: 7, //任务id
				wbs: "1.2.4", //任务代码
				task_name: "涵洞", //任务名称
				task_type: "专业审核",  //任务类型
				task_start_time: "",  //开始时间
				task_end_time: "",  //结束时间
				duration: "",  //工期
				design_owner: "", //设计承担人
				design_participant: "", //设计参与人
				review_owner: "",  //复核承担人
				audit_owner: "",  //一审承担人
				parent: 3, //父节点任务id
				type: "task", //该条任务所属类型  project  task  milestone
				if_bill_checked: "是"
			},
			{
				task_id: 8, //任务id
				wbs: "1.2.5", //任务代码
				task_name: "平纵数据他检修改完成", //任务名称
				task_type: "一般任务",  //任务类型
				task_start_time: "",  //开始时间
				task_end_time: "",  //结束时间
				duration: "",  //工期
				design_owner: "", //设计承担人
				design_participant: "", //设计参与人
				review_owner: "",  //复核承担人
				audit_owner: "",  //一审承担人
				parent: 3, //父节点任务id
				type: "task",  //该条任务所属类型  project  task  milestone
				if_bill_checked: "是"
			}
		]
		this.tableData = this.formatToTreeData({ arrayList: tData, idStr: "task_id" })
		this.tableData.forEach((v, k) => {
			this.traversalNodeSetRootIndex(v, k)
		})

		console.log("this.tableData>>>", this.tableData)
	},
	methods: {
		goSelect() {
			console.log("selectValue>>>", this.selectValue)
			console.log("pickedDateRange>>>", this.pickedDateRange)
		},
		taskNameClick(row) {
			let sendData = {
				data: [row.task_id]
			}
			console.log(sendData)
		},
		goAssignment() {
			let sData = this.getSelectedId()
			// let sendData = {
			// 	data: ids
			// }
			if (sData.selectedIds.length > 0) {
				console.log("sendData>>>", sData)
				if (sData.unallocated.length > 0) {
					let msg = ""
					sData.unallocated.forEach(function (fuck) {
						fuck.noAssignmentTasks.forEach(function (shit) {
							msg += shit + "、"
						})
					})
					msg = msg.slice(0, msg.length - 1)
					this.$confirm('一般任务<span style="color:red">' + msg + '</span>未被分配，请先分配一般任务！', '提示', {
						dangerouslyUseHTMLString: true,
						confirmButtonText: '确定',
						showCancelButton: false,
						// cancelButtonText: '取消',
						type: 'warning'
					})
				} else {
					let sendData = {
						data: sData.selectedIds
					}
					console.log(sendData)
				}
			} else {
				alert("未勾选任务")
			}
		},
		traversalNodeSetRootIndex(node, index) {
			if (node) {
				node.rootIndex = index
				let stack = []
				stack.push(node)
				while (stack.length != 0) {
					let item = stack.shift()
					let children = item.children ? item.children : []
					children.forEach(function (v) {
						v.rootIndex = index
						stack.push(v)
					})
				}
			}
		},
		handleCheckAllChange(val) {
			this.traversalNode(this.tableData[0], this.allChecked)
		},
		itemChange(row) {
			let check = row.checked
			let temp = this.traversalNode(row, check)
			let rootIndex = row.rootIndex
			let tempTableData = _.cloneDeep(this.tableData[rootIndex])
			let flatData = this.traversalNode(tempTableData)
			// 获取该节点所在所有父节点
			let parentIds = this.findParentIds(flatData, row.parent)
			console.log("temp>>>", temp)
			if (check) {
				// 如果点击是置true 递归查找所有父节点下的子节点
				// 如果子节点都为true 置该父节点为ture
				// 如果子节点有一个为false  置该父节点以及该父节点的所有父节点为false
				let res = this.helloKids(flatData, parentIds)[0]
				this.$set(this.tableData, rootIndex, res)
				// this.tableData[rootIndex] = res
				let flag = true
				for (let i = 0; i < this.tableData.length; i++) {
					if (this.tableData[i].checked) {
						flag = true
					} else {
						flat = false
						return
					}
				}
				this.allChecked = flag
			} else {
				// 如果点击是置false 直接将该节点的所有父节点置为false
				this.findYouAndSetFalse(this.tableData[rootIndex], parentIds)
				this.allChecked = false
			}
		},
		saveData() {
			console.log("saveData>>>")
		},
		// 将源数据格式化为表格树形结构数据
		formatToTreeData({ arrayList, pidStr = 'parent', idStr = 'id', childrenStr = 'children' }) {
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
					// 如果没有父级children字段，就创建一个children字段
					!haveParent[childrenStr] && (haveParent[childrenStr] = [])
					// 在父级里插入子项
					haveParent[childrenStr].push(templist[j])
				} else {
					// 如果没有父级直接插入到最外层
					treeList.push(templist[j])
				}
			}
			return treeList
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
		getSelectedId() {
			let idArr = []
			let auditTask = [] //勾选的专业审核任务
			let tempArr = this.traversalNode(
				this.tableData[0]
			)
			tempArr.forEach(function (v) {
				if (v.checked) {
					idArr.push(v.task_id)
					if (v.task_type === "专业审核") {
						v.audit_tasks.forEach(function (shit) {
							if (!shit.isAssignment) {
								auditTask.push({
									task_id: v.task_id,
									noAssignmentTasks: [shit.task_id]
								})
							}
						})
					}
				}
			})
			let resData = {
				selectedIds: idArr,
				unallocated: auditTask
			}
			return resData
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
			// if (pids.length == 0) {
			// 	this.allChecked = true
			// 	return flatdata
			// }
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
		}
	}
}).$mount("#assignmentTaskApp")
