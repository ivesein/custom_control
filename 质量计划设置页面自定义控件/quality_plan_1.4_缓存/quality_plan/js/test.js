new Vue({
  delimiters: ["${", "}"],
  data: {
    tableData: [],
    multipleSelection: [],
    here: "hahaha",
    allChecked: false,
    allItems: null,
    isIndeterminate: false,
    tableHeight: 800,
    funcPerm: [
      {
        elementid: "set_role",
        cstlid: "quality_plan_v1.3",
      },
      {
        elementid: "refresh_data",
        cstlid: "quality_plan_v1.3",
      },
    ],
    fieldPerm: [
      {
        elementid: "text",
        isvisible: 1,
        iseditable: 0,
      },
      {
        elementid: "wbs",
        isvisible: 1,
        cstlid: "wbs_planning_v1.0",
        iseditable: 0,
      },
      {
        elementid: "duration",
        isvisible: 1,
        iseditable: 0,
      },
      {
        elementid: "start_date",
        isvisible: 1,
        cstlid: "wbs_planning_v1.0",
        iseditable: 0,
      },
      {
        elementid: "end_date",
        isvisible: 1,
        iseditable: 0,
      },
      {
        elementid: "duration_time",
        isvisible: 1,
        cstlid: "wbs_planning_v1.0",
        iseditable: 0,
      },
      {
        elementid: "owner_role",
        isvisible: 1,
        iseditable: 0,
      },
      {
        elementid: "owner",
        isvisible: 1,
        cstlid: "wbs_planning_v1.0",
        iseditable: 0,
      },
      {
        elementid: "skill",
        isvisible: 1,
        iseditable: 0,
      },
    ],
    loading: true,
    loading_text: "数据加载中...",
    loading_icon: "el-icon-loading",
  },
  created() {
    let a = {};
    let b = _.cloneDeep(a.cc);
    console.log(b);
    var tData = [
      {
        id: "1",
        position: "1",
        text: "项目准备阶段工作",
        wbs: "1",
        first_duration: "",
        modify_duration: "",
        mod_con_duration: "",
        confirm_duration: "",
        owner: "",
        owner_id: "",
        owner_role: "",
        owner_roleid: "",
        duration: "",
        start_date: "",
        end_date: "",
        qualityplan_version: "",
        parent: "0",
        type: "project",
        task_type: "",
        audit_task_id: "",
        isreply: "1",
      },
      {
        id: "2",
        position: "2",
        text: " 测设人员名单",
        wbs: "1.1",
        first_duration: "",
        modify_duration: "",
        mod_con_duration: "",
        confirm_duration: "",
        owner: "",
        owner_id: "",
        owner_role: "",
        owner_roleid: "",
        duration: "",
        start_date: "2019-02-06",
        end_date: "2019-02-15",
        qualityplan_version: "",
        parent: "1",
        type: "project",
        task_type: "4",
        audit_task_id: "",
        isreply: "1",
      },
      {
        id: "3",
        position: "3",
        text: "测设人员名单设计",
        wbs: "1.1.1",
        first_duration: "0.1",
        modify_duration: "0.4",
        mod_con_duration: "0.4",
        confirm_duration: "0.1",
        owner: "卢峰",
        owner_id: "754806414039319552",
        owner_role: "设计员",
        owner_roleid: "789577461510730800",
        duration: "",
        start_date: "2019-02-06",
        end_date: "2019-02-08",
        qualityplan_version: "",
        parent: "2",
        skill: "挖土",
        type: "task",
        task_type: "1",
        audit_task_id: "",
        isreply: "2",
      },
      {
        id: "4",
        position: "4",
        text: "测设人员名单复核",
        wbs: "1.1.2",
        first_duration: "0.1",
        modify_duration: "0.4",
        mod_con_duration: "0.4",
        confirm_duration: "0.1",
        owner: "严孝祥",
        owner_id: "1111",
        owner_role: "勘查员",
        skill: "挖土",
        owner_roleid: "789577577239965700",
        duration: "",
        start_date: "2019-02-09",
        end_date: "2019-02-15",
        qualityplan_version: "",
        parent: "2",
        type: "task",
        task_type: "3",
        audit_task_id: "",
        isreply: "2",
      },
      {
        id: "5",
        position: "5",
        text: "勘察设计大纲编制与审批",
        wbs: "1.2",
        first_duration: "",
        modify_duration: "",
        mod_con_duration: "",
        confirm_duration: "",
        owner: "",
        owner_id: "",
        owner_role: "",
        owner_roleid: "",
        duration: "",
        start_date: "2019-02-16",
        end_date: "2019-02-28",
        qualityplan_version: "",
        parent: "1",
        type: "task",
        task_type: "4",
        audit_task_id: "",
        isreply: "2",
      },
      {
        id: "6",
        position: "6",
        text: "勘察设计大纲编制与审批设计",
        wbs: "1.2.1",
        first_duration: "0.1",
        modify_duration: "0.4",
        mod_con_duration: "0.4",
        confirm_duration: "0.1",
        owner: "李洋波",
        owner_id: "2222",
        owner_role: "设计员",
        owner_roleid: "789577461510730800",
        duration: "",
        delegate: "1",
        start_date: "2019-02-16",
        end_date: "2019-02-24",
        qualityplan_version: "",
        parent: "5",
        type: "task",
        task_type: "1",
        audit_task_id: "1",
        isreply: "1",
      },
      {
        id: "8",
        position: "8",
        text: "专业审核",
        wbs: "1.3",
        first_duration: "",
        modify_duration: "",
        mod_con_duration: "",
        confirm_duration: "",
        owner: "李四",
        owner_id: "4444",
        owner_role: "审核组长",
        owner_roleid: "55555",
        duration: "",
        start_date: "2019-03-01",
        end_date: "2019-03-08",
        qualityplan_version: "",
        parent: "1",
        type: "task",
        task_type: "2",
        audit_task_id: "2,5",
        isreply: "2",
      },
      {
        id: "7",
        position: "7",
        text: "勘察设计大纲编制与审批复核",
        wbs: "1.2.2",
        first_duration: "0.1",
        modify_duration: "0.4",
        mod_con_duration: "0.4",
        confirm_duration: "0.1",
        owner: "张三",
        owner_id: "3333",
        owner_role: "勘查员",
        owner_roleid: "789577577239965700",
        duration: "",
        start_date: "2019-02-24",
        end_date: "2019-02-28",
        qualityplan_version: "",
        parent: "5",
        type: "task",
        task_type: "3",
        audit_task_id: "3",
        isreply: "1",
      },
    ];
    var data_ = this.addSortNum(tData).sort(this.compare("sortNum"));
    console.table(data_);
    data_ = this.setAuditTaskUndertaker(data_);
    console.log("data_>>>", data_);

    this.tableData = this.formatToTreeData({
      arrayList: tData,
      idStr: "id",
    });

    console.log("this.tableData>>>", this.tableData);
  },
  mounted() {
    // let self = this;
    // // 固定表格表头 设置表格高度自适应填满剩余高度
    // this.$nextTick(function () {
    //   self.tableHeight =
    //     window.innerHeight - self.$refs.qualityPlanTable.$el.offsetTop - 60;
    //   // 监听窗口大小变化
    //   window.onresize = function () {
    //     self.tableHeight =
    //       window.innerHeight - self.$refs.qualityPlanTable.$el.offsetTop - 60;
    //   };
    // });
  },
  computed: {
    getBtnShow(btnId) {
      var _this = this;
      return function (btnId) {
        let arr = _this.funcPerm.filter((v) => {
          return v.elementid === btnId;
        });
        return arr.length > 0 ? false : true;
      };
    },
    getFieldShow(fieldId) {
      var _this = this;
      return function (fieldId) {
        let arr = _this.fieldPerm.filter((v) => {
          return v.elementid === fieldId;
        });
        if (arr.length > 0) {
          return arr[0].isvisible === 1 ? true : false;
        } else {
          return true;
        }
      };
    },
  },
  methods: {
    /**
     * Author: zhang fq
     * Date: 2020-05-27
     * Description: bug转需求 已委外的任务 置灰
     */

    tableRowClassName({ row, rowIndex }) {
      if (row.delegate === "1") {
        return "delegate-row";
      }
      return "";
    },
    // 处理复核任务 整改-修改 承担人和承担人名称
    setAuditTaskUndertaker(originData) {
      if (originData.length === 0) return;
      originData.forEach(function (fuck) {
        if (fuck.task_type === "3") {
          originData.forEach(function (shit) {
            if (fuck.parent === shit.parent && shit.task_type !== "3") {
              fuck.the_owner = shit.owner;
              fuck.the_owner_role = shit.owner_role;
            }
          });
        }
      });
      return originData;
    },
    addSortNum(data) {
      if (data.length <= 1) {
        return data;
      } else {
        // data.forEach(function(fuck) {
        //   fuck.sortNum = fuck.wbs.split(".").join("")
        //   for (let i = fuck.sortNum.length; i < 4; i++) {
        //     fuck.sortNum += "0"
        //   }
        // })
        data.sort(this.compare("position"));
        return data;
      }
    },
    compare(prop) {
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
      };
    },
    SetRole() {
      alert(1);
      let ids = this.getSelectedId();
      console.log("SetRole>>>", ids);
      let sendData = {
        data: ids,
      };
      if (ids.length > 0) {
      } else {
        alert("未勾选任务");
      }
    },
    SetStaff() {},
    handleCheckAllChange(val) {
      this.traversalNode(this.tableData[0], this.allChecked);
    },
    itemChange(row) {
      let check = row.checked;
      let temp = this.traversalNode(row, check);
      let tempTableData = _.cloneDeep(this.tableData[0]);
      let flatData = this.traversalNode(tempTableData);
      // 获取该节点所在所有父节点
      let parentIds = this.findParentIds(flatData, row.parent);
      console.log("temp>>>", temp);
      if (check) {
        // 如果点击是置true 递归查找所有父节点下的子节点
        // 如果子节点都为true 置该父节点为ture
        // 如果子节点有一个为false  置该父节点以及该父节点的所有父节点为false
        let res = this.helloKids(flatData, parentIds)[0];
        this.tableData = [res];
      } else {
        // 如果点击是置false 直接将该节点的所有父节点置为false
        this.findYouAndSetFalse(this.tableData[0], parentIds);
        this.allChecked = false;
      }
    },
    saveData() {
      console.log("saveData>>>");
    },
    setDesignOwner() {
      let ids = this.getSelectedId();
      console.log("setDesignOwner>>>", ids);
      let sendData = {
        data: ids,
      };
      if (ids.length > 0) {
      } else {
        alert("未勾选任务");
      }
    },

    setReviewOwner() {
      let ids = this.getSelectedId();
      console.log("setReviewOwner>>>", ids);
      let sendData = {
        data: ids,
      };
      if (ids.length > 0) {
      } else {
        alert("未勾选任务");
      }
    },
    setAuditOwner() {
      let ids = this.getSelectedId();
      console.log("setAuditOwner>>>", ids);
      let sendData = {
        data: ids,
      };
      if (ids.length > 0) {
      } else {
        alert("未勾选任务");
      }
    },
    SetDurationTime() {
      let ids = this.getSelectedId();
      console.log("SetDurationTime>>>", ids);
      let sendData = {
        data: ids,
      };
      if (ids.length == 0) {
        alert("未勾选任务111");
      } else if (ids.length > 1) {
        alert("设置任务持续时间不能多选");
      } else {
      }
    },
    refreshData() {
      console.log("refreshData");
    },
    // 获取选择的任务的task_id
    getSelectedId() {
      let idArr = [];
      let tempArr = this.traversalNode(this.tableData[0]);
      tempArr.forEach(function (v) {
        if (v.checked && v.type == "task" && v.task_type !== "4") {
          idArr.push({
            project_id: v.project_id,
            plan_id: v.plan_id,
            id: v.id,
            text: v.text,
            task_type: v.task_type,
            duration: v.duration,
          });
        }
      });
      return idArr;
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return "padding: 0px;line-height:40px;height: 40px";
    },
    // 将源数据格式化为表格树形结构数据
    formatToTreeData({
      arrayList,
      pidStr = "parent",
      idStr = "id",
      childrenStr = "children",
    }) {
      let templist = _.cloneDeep(arrayList);
      let listObj = {}; // 用来储存{key: obj}格式的对象
      let treeList = []; // 用来储存最终树形结构数据的数组
      // 将数据变换成{key: obj}格式，方便下面处理数据
      for (let i = 0; i < templist.length; i++) {
        templist[i].checked = false;
        listObj[templist[i][idStr]] = templist[i];
      }
      // 根据pid来将数据进行格式化
      for (let j = 0; j < templist.length; j++) {
        // 判断父级是否存在
        let haveParent = listObj[templist[j][pidStr]];
        if (haveParent) {
          // 如果有没有父级children字段，就创建一个children字段
          !haveParent[childrenStr] && (haveParent[childrenStr] = []);
          // 在父级里插入子项
          haveParent[childrenStr].push(templist[j]);
        } else {
          // 如果没有父级直接插入到最外层
          treeList.push(templist[j]);
        }
      }
      return treeList;
    },
    // 树形结构数据扁平化处理  如果需要可以设置该节点以及子节点checked
    traversalNode(node, bool) {
      let nodes = [];
      if (node) {
        if (bool !== undefined) node.checked = bool;
        let stack = [];
        stack.push(node);
        while (stack.length != 0) {
          let item = stack.shift();
          nodes.push(item);
          let children = item.children ? item.children : [];
          children.forEach(function (v) {
            if (bool !== undefined) v.checked = bool;
            stack.push(v);
          });
        }
      }
      return nodes;
    },
    // 递归找到所有父节点设为false
    findYouAndSetFalse(node, pids) {
      var that = this;
      if (pids.includes(node.id)) {
        node.checked = false;
      }
      let children = node.children ? node.children : [];
      children.forEach(function (v) {
        that.findYouAndSetFalse(v, pids);
      });
    },
    // 在扁平化的树结构数据中递归找到所点击任务的所有父节点task_id
    findParentIds(arr, pid) {
      let pids = [];
      let currentpid = pid;
      console.log(Array.isArray(arr));
      if (Array.isArray(arr) && arr.length > 0) {
        while (currentpid != 0) {
          arr.forEach(function (v) {
            if (v.id == currentpid) {
              pids.push(v.id);
              currentpid = v.parent;
            }
          });
        }
      }
      return pids;
    },
    // flatdata 为表格绑定的整个数据的扁平化数据  pids为包含所点击节点的所有父节点数组
    // 在整个扁平化数据中循环查找每个父节点下的子节点 判断
    // 若果有一个子节点为false 置所有父节点为false
    // 如果循环到当前父节点下的所有子节点都为true  置该父节点为true 继续找该父节点的父节点 重复该步骤
    helloKids(flatdata, pids) {
      let _that = this;
      let arr = [];
      // 如果pids为空 表示点击的节点为根节点没有父节点 直接置为true
      if (pids.length == 0) {
        this.allChecked = true;
        return flatdata;
      }
      for (let i = 0, len = pids.length; i < len; i++) {
        for (let j = 0, jlen = flatdata.length; j < jlen; j++) {
          if (pids[i] == flatdata[j].id) {
            let bool = flatdata[j].checked;
            let children = flatdata[j].children ? flatdata[j].children : [];
            for (let k = 0, klen = children.length; k < klen; k++) {
              if (!children[k].checked) {
                bool = false;
                _that.allChecked = false;
                break;
              } else {
                bool = true;
              }
            }
            flatdata[j].checked = bool;
            if (bool) {
              _that.allChecked = true;
            }
          }
        }
      }
      console.log("arr>>>", arr);
      return flatdata;
    },
  },
}).$mount("#qualityPlanApp");
