new Vue({
  delimiters: ["${", "}"],
  data: {
    activeName: 'first',
    addNewTaskSelectionOptions: [{
      value: '1',
      label: '新增工作包'
    }, {
      value: '2',
      label: '新增摘要任务'
    }, {
      value: '3',
      label: '新增专业审核'
    }],
    addNewTaskValue: '', //新增下拉框所选值
    tableData: [],
    multipleSelection: [],
    allChecked: false,
    allItems: null,
    isIndeterminate: false,
    tableHeight: 800
  },
  created() {
    var tData = [{
      id: "1", // 任务id
      wbs_code:"1",
      text: "测试任务", // 任务名称
      parent: "0", // 父任务id
      duration: 10, // 工期
      task_type: "", // 任务类型2  一般任务  复核任务  专业审核等
      type: "project", // 任务类型1  摘要任务  子任务  里程碑
      describe: "任务说明1", // 任务说明
      open: true, // 是否展开
      isMilestone: false, // 是否是里程碑
      start_date: "2020-02-03 00:00:00",
      effect: "", //功效
      duration_plan: "", //工程量
      major: {
        text: "专业1", //专业名称
        id: "", //专业id
      },
      my_unit: { //工程量单位和功效单位 目前为同一个
        text: "km", // 单位名称
        id: "", //单位id
      },
      task_before: [], //紧前任务
      first_duration: "", //首次复核持续时间
      modify_duration: "", //修改持续时间
      mod_con_duration: "", //确认修改持续时间
      confirm_duration: "", //复核确认持续时间
      owner_role: "", //承担人角色
      owner_roleid: "", //承担人角色id
      audit_task_id: "2,5", //审核的任务id
      delegate: "0", //是否委外
      contract_thing: "合同测试", //合同事项
      delegate_reason: "测试委派", //委外原因
      delegate_role_id: 757802139937423360,
      delegate_role_name: "专业组长", //委外负责人角色
      delegate_person_id: 754911742466739200, //委外负责人id
      delegate_person_name: "田重辉", //委外负责人名称
      assn_pro_num: "300", //工程量/单位
      assn_pro_unit:"m³", //单位
      assn_merits_price: 50, //绩效奖金(元/单位工程量)
      assn_merits_total: 15000, //绩效奖金小计
      fmachine_name: ["挖掘机"], //机械名称
      fmachine_type: ["WJ-50"], //型号
      machine_id: [""], //机械id
      fmachine_used: ["4"], //机械耗用量
      fmachine_price: ["200"], //机械单价
      fmachine_unit: ["台"], //机械单位
      fmachine_subtotal: ["800"], //机械小计
      fmachine_all: "800", //机械合计
      fmaterial_name: ["", "材料", "", "材料"], //材料名称
      material_id: ["", "2", "", "2"], //材料id
      fmaterial_used: ["", "2", "", "2"], //材料耗用量
      fmaterial_price: ["", "2", "", "2"], //材料单价
      fmaterial_unit: ["", "2", "", "2"], //材料单位
      fmaterial_subtotal: ["1", "2", "1", "2"], //材料小计
      fmaterial_all: "2", //材料合计
      fmanual_name: ["人工", "人工1"], //人工名称
      person_id: ["12", "11"], //人工id
      fmanual_workload: ["1", "2"], //人工负载
      fmanual_price: ["1", "2"], //人工单价
      fmanual_unit: ["1", "2"], //人工单位
      fmanual_subtotal: ["1", "2"], //人工小计
      fmanual_all: "2", //人工合计
      ffee_subtotal: "2",
      ffee_all: "1",
    },
    {
      id: "2", // 任务id
      wbs_code:"1.1",
      text: "测试任务2", // 任务名称
      parent: "0", // 父任务id
      duration: 3, // 工期
      task_type: "3", // 任务类型2  一般任务  复核任务  专业审核等
      type: "milestone", // 任务类型1  摘要任务  子任务  里程碑
      describe: "任务说明2", // 任务说明
      open: true, // 是否展开
      isMilestone: false, // 是否是里程碑
      start_date: "2020-02-03 00:00:00",
      effect: "", //功效
      duration_plan: "", //工程量
      major: {
        text: "专业2", //专业名称
        id: "", //专业id
      },
      my_unit: { //工程量单位和功效单位 目前为同一个
        text: "km", // 单位名称
        id: "", //单位id
      },
      task_before: [], //紧前任务
      first_duration: "", //首次复核持续时间
      modify_duration: "", //修改持续时间
      mod_con_duration: "", //确认修改持续时间
      confirm_duration: "", //复核确认持续时间
      owner_role: "", //承担人角色
      owner_roleid: "", //承担人角色id
      audit_task_id: "2,5", //审核的任务id
      delegate: "0", //是否委外
      contract_thing: "合同测试", //合同事项
      delegate_reason: "测试委派", //委外原因
      delegate_role_id: 757802139937423360,
      delegate_role_name: "专业组长", //委外负责人角色
      delegate_person_id: 754911742466739200, //委外负责人id
      delegate_person_name: "田重辉", //委外负责人名称
      assn_pro_num: "", //工程量/单位
      assn_merits_price: 0, //绩效奖金(元/单位工程量)
      assn_merits_total: 0, //绩效奖金小计
      fmachine_name: [""], //机械名称
      machine_id: [""], //机械id
      fmachine_used: [""], //机械耗用量
      fmachine_price: [""], //机械单价
      fmachine_unit: [""], //机械单位
      fmachine_subtotal: [""], //机械小计
      fmachine_all: "1.2", //机械合计
      fmaterial_name: ["", "材料", "", "材料"], //材料名称
      material_id: ["", "2", "", "2"], //材料id
      fmaterial_used: ["", "2", "", "2"], //材料耗用量
      fmaterial_price: ["", "2", "", "2"], //材料单价
      fmaterial_unit: ["", "2", "", "2"], //材料单位
      fmaterial_subtotal: ["1", "2", "1", "2"], //材料小计
      fmaterial_all: "2", //材料合计
      fmanual_name: ["人工", "人工1"], //人工名称
      person_id: ["12", "11"], //人工id
      fmanual_workload: ["1", "2"], //人工负载
      fmanual_price: ["1", "2"], //人工单价
      fmanual_unit: ["1", "2"], //人工单位
      fmanual_subtotal: ["1", "2"], //人工小计
      fmanual_all: "2", //人工合计
      ffee_subtotal: "2",
      ffee_all: "1",
    }
    ]
    // 假数据模拟
    this.tableData = tData
  },
  mounted() {
    // this.$nextTick(function() {
    //   this.tableHeight = window.innerHeight - this.$refs.qualityPlanTable.$el.offsetTop - 10

    //   // 监听窗口大小变化
    //   let self = this;
    //   window.onresize = function() {
    //     self.tableHeight = window.innerHeight - self.$refs.qualityPlanTable.$el.offsetTop - 10
    //   }
    // })
  },
  methods: {
    handleTabClick(tab, event) {
      console.log(tab, event);
    },
    // 处理复核任务 整改-修改 承担人和承担人名称
    // setAuditTaskUndertaker(originData) {
    //   if (originData.length === 0) return
    //   originData.forEach(function(fuck) {
    //     if (fuck.task_type === "3") {
    //       originData.forEach(function(shit) {
    //         if (fuck.parent === shit.parent && shit.task_type !== "3") {
    //           fuck.the_owner = shit.owner
    //           fuck.the_owner_role = shit.owner_role
    //         }
    //       })
    //     }
    //   })
    //   return originData
    // },
    // addSortNum(data) {
    //   if (data.length <= 1) {
    //     return data
    //   } else {
    //     // data.forEach(function(fuck) {
    //     //   fuck.sortNum = fuck.wbs.split(".").join("")
    //     //   for (let i = fuck.sortNum.length; i < 4; i++) {
    //     //     fuck.sortNum += "0"
    //     //   }
    //     // })
    //     data.sort(this.compare('position'))
    //     return data
    //   }
    // },
    // compare(prop) {
    //   return function(obj1, obj2) {
    //     var val1 = obj1[prop];
    //     var val2 = obj2[prop];
    //     if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
    //       val1 = Number(val1);
    //       val2 = Number(val2);
    //     }
    //     if (val1 < val2) {
    //       return -1;
    //     } else if (val1 > val2) {
    //       return 1;
    //     } else {
    //       return 0;
    //     }
    //   }
    // },
    // SetRole() {
    //   let ids = this.getSelectedId()
    //   console.log(
    //     "SetRole>>>",
    //     ids
    //   )
    //   let sendData = {
    //     data: ids
    //   }
    //   if (ids.length > 0) {} else {
    //     alert("未勾选任务")
    //   }
    // },
    // SetStaff() {},
    handleCheckAllChange(val) {
      this.traversalNode(this.tableData[0], this.allChecked)
    },
    // itemChange(row) {
    //   let check = row.checked
    //   let temp = this.traversalNode(row, check)
    //   let tempTableData = _.cloneDeep(this.tableData[0])
    //   let flatData = this.traversalNode(tempTableData)
    //     // 获取该节点所在所有父节点
    //   let parentIds = this.findParentIds(flatData, row.parent)
    //   console.log("temp>>>", temp)
    //   if (check) {
    //     // 如果点击是置true 递归查找所有父节点下的子节点
    //     // 如果子节点都为true 置该父节点为ture
    //     // 如果子节点有一个为false  置该父节点以及该父节点的所有父节点为false
    //     let res = this.helloKids(flatData, parentIds)[0]
    //     this.tableData = [res]
    //   } else {
    //     // 如果点击是置false 直接将该节点的所有父节点置为false
    //     this.findYouAndSetFalse(this.tableData[0], parentIds)
    //     this.allChecked = false
    //   }
    // },
    // saveData() {
    //   console.log("saveData>>>")
    // },
    // setDesignOwner() {
    //   let ids = this.getSelectedId()
    //   console.log(
    //     "setDesignOwner>>>",
    //     ids
    //   )
    //   let sendData = {
    //     data: ids
    //   }
    //   if (ids.length > 0) {} else {
    //     alert("未勾选任务")
    //   }
    // },

    // setReviewOwner() {
    //   let ids = this.getSelectedId()
    //   console.log(
    //     "setReviewOwner>>>",
    //     ids
    //   )
    //   let sendData = {
    //     data: ids
    //   }
    //   if (ids.length > 0) {} else {
    //     alert("未勾选任务")
    //   }
    // },
    // setAuditOwner() {
    //   let ids = this.getSelectedId()
    //   console.log(
    //     "setAuditOwner>>>",
    //     ids
    //   )
    //   let sendData = {
    //     data: ids
    //   }
    //   if (ids.length > 0) {} else {
    //     alert("未勾选任务")
    //   }
    // },
    // SetDurationTime() {
    //   let ids = this.getSelectedId()
    //   console.log(
    //     "SetDurationTime>>>",
    //     ids
    //   )
    //   let sendData = {
    //     data: ids
    //   }
    //   if (ids.length == 0) {
    //     alert("未勾选任务111")
    //   } else if (ids.length > 1) {
    //     alert("设置任务持续时间不能多选")
    //   } else {

    //   }
    // },
    // refreshData() {
    //   console.log("refreshData")
    // },
    // // 获取选择的任务的task_id
    // getSelectedId() {
    //   let idArr = []
    //   let tempArr = this.traversalNode(
    //     this.tableData[0]
    //   )
    //   tempArr.forEach(function(v) {
    //     if (v.checked && v.type == "task" && v.task_type !== "4") {
    //       idArr.push({
    //         project_id: v.project_id,
    //         plan_id: v.plan_id,
    //         task_id: v.task_id,
    //         task_name: v.task_name,
    //         task_type: v.task_type,
    //         duration: v.duration
    //       })
    //     }
    //   })
    //   return idArr
    // },
    cellStyle({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 0) {
        // console.log(column)
        return "padding: 0px!important;"
      }

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
          children.forEach(function(v) {
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
      children.forEach(function(v) {
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
          arr.forEach(function(v) {
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
      return flatdata
    }
  }
}).$mount("#wbsPlanningApp")