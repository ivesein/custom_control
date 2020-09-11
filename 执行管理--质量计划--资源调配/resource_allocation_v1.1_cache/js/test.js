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
  },
  created() {
    var tData = [
      {
        text: "demo",
        parent: "0",
        wbs: "demo",
        qualityplan_version: "",
        id: "71534000836968448",
        type: "project",
        audit_task_id: "",
        duration: "112",
        project_id: "7d89067b-5a1a-4736-be72-396ee0e5753a",
        position: "1",
        task_type: "",
        plan_starttime: "2020-02-02 10:00:00",
        plan_endtime: "2020-02-05 10:00:00",
        quality_action: "",
        subArray: [
          {
            owner: "",
            plan_starttime: "",
            plan_endtime: "",
            task_status: "",
            confirm_duration: "",
            owner_role: "",
            owner_id: "",
            task_assign_id: "",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
        ],
      },
      {
        text: "设置围堰",
        parent: "71534000836968448",
        wbs: "1",
        qualityplan_version: "",
        id: "71534000841162752",
        type: "project",
        audit_task_id: "",
        duration: "112",
        quality_action: "",
        project_id: "7d89067b-5a1a-4736-be72-396ee0e5753a",
        position: "2",
        task_type: "2",
        plan_starttime: "2020-02-02 10:00:00",
        plan_endtime: "2020-02-05 10:00:00",
        subArray: [
          {
            owner: "李华",
            plan_starttime: "2020-02-02 10:00:00",
            plan_endtime: "2020-02-05 10:00:00",
            task_status: "",
            confirm_duration: "",
            owner_role: "设计员1",
            owner_id: "",
            task_assign_id: "",
            first_duration: "3",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
        ],
      },
      {
        text: "P4挖土",
        parent: "71534000841162752",
        wbs: "1.1",
        qualityplan_version: "",
        id: "71534000845357056",
        type: "project",
        audit_task_id: "",
        duration: "5",
        quality_action: "",
        project_id: "7d89067b-5a1a-4736-be72-396ee0e5753a",
        position: "3",
        task_type: "4",
        plan_starttime: "2020-02-02 10:00:00",
        plan_endtime: "2020-02-05 10:00:00",
        subArray: [
          {
            owner: "",
            plan_starttime: "",
            plan_endtime: "",
            task_status: "",
            confirm_duration: "",
            owner_role: "",
            owner_id: "",
            task_assign_id: "",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
        ],
      },
      {
        text: "P4挖土设计",
        parent: "71534000845357056",
        wbs: "1.1.1",
        qualityplan_version: "",
        id: "71534000849551360",
        type: "task",
        audit_task_id: "",
        duration: "5",
        quality_action: "压缩工期5天",
        project_id: "7d89067b-5a1a-4736-be72-396ee0e5753a",
        position: "4",
        task_type: "1",
        plan_starttime: "2020-02-02 10:00:00",
        plan_endtime: "2020-02-05 10:00:00",
        subArray: [
          {
            owner: "荆晓雯",
            res_plan_starttime: "2020-02-01 10:00:00",
            res_plan_endtime: "2020-02-05 10:00:00",
            task_status: "000",
            confirm_duration: "",
            owner_role: "设计员",
            owner_id: "757077065294955520",
            task_assign_id: "71534385663311872",
            first_duration: "1",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "789577461510730800",
            skill: "技能1",
            isreply: "2",
          },
          {
            owner: "yxx100",
            res_plan_starttime: "2020-02-05 10:00:00",
            res_plan_endtime: "2020-02-11 10:00:00",
            task_status: "",
            confirm_duration: "",
            owner_role: "设计员",
            owner_id: "100",
            task_assign_id: "100",
            first_duration: "2",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "789577461510730800",
            skill: "技能1",
            isreply: "2",
          },
          {
            owner: "yxx101",
            res_plan_starttime: "2020-02-11 10:00:00",
            res_plan_endtime: "2020-02-13 10:00:00",
            task_status: "",
            confirm_duration: "",
            owner_role: "设计员",
            owner_id: "101",
            task_assign_id: "101",
            first_duration: "3",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "789577461510730800",
            skill: "技能1",
            isreply: "2",
          },
        ],
      },
      {
        text: "P4挖土复核",
        parent: "71534000845357056",
        wbs: "1.1.2",
        qualityplan_version: "",
        id: "71534000853745664",
        type: "task",
        audit_task_id: "",
        duration: "5",
        quality_action: "压缩工期5天",
        project_id: "7d89067b-5a1a-4736-be72-396ee0e5753a",
        position: "5",
        task_type: "3",
        plan_starttime: "2020-02-02 10:00:00",
        plan_endtime: "2020-02-05 10:00:00",
        subArray: [
          {
            owner: "卢峰",
            plan_starttime: "2020-02-02 10:00:00",
            plan_endtime: "2020-02-02 10:00:00",
            task_status: "000",
            confirm_duration: "4",
            owner_role: "设计员",
            owner_id: "754806414039319552",
            task_assign_id: "71534385668554752",
            first_duration: "1",
            modify_duration: "1",
            mod_con_duration: "3",
            owner_roleid: "789577461510730800",
            skill: "技能1",
            isreply: "1",
          },
          {
            owner: "yxx102",
            plan_starttime: "2020-02-02 10:00:00",
            plan_endtime: "2020-02-02 10:00:00",
            task_status: "",
            confirm_duration: "",
            owner_role: "设计员",
            owner_id: "102",
            task_assign_id: "102",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "789577461510730800",
            skill: "技能1",
            isreply: "1",
          },
        ],
      },
      {
        text: "2223",
        parent: "71534000841162752",
        wbs: "1.2",
        qualityplan_version: "",
        id: "71723713902411776",
        audit_task_id: "",
        duration: "",
        quality_action: "",
        project_id: "7d89067b-5a1a-4736-be72-396ee0e5753a",
        position: "6",
        plan_starttime: "2020-02-02 10:00:00",
        plan_endtime: "2020-02-05 10:00:00",
        subArray: [
          {
            owner: "",
            plan_starttime: "",
            plan_endtime: "",
            task_status: "",
            confirm_duration: "",
            owner_role: "",
            owner_id: "",
            task_assign_id: "",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
          {
            owner: "",
            plan_starttime: "",
            plan_endtime: "",
            task_status: "",
            confirm_duration: "",
            owner_role: "",
            owner_id: "",
            task_assign_id: "",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
        ],
      },
      {
        text: "2223设计",
        parent: "71723713902411776",
        wbs: "1.2.1",
        qualityplan_version: "",
        id: "71723713902411777",
        audit_task_id: "",
        duration: "",
        quality_action: "压缩工期2天",
        project_id: "7d89067b-5a1a-4736-be72-396ee0e5753a",
        position: "7",
        plan_starttime: "2020-02-02 10:00:00",
        plan_endtime: "2020-02-05 10:00:00",
        subArray: [
          {
            owner: "",
            plan_starttime: "",
            plan_endtime: "",
            task_status: "",
            confirm_duration: "",
            owner_role: "",
            owner_id: "",
            task_assign_id: "",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
          {
            owner: "",
            plan_starttime: "",
            plan_endtime: "",
            task_status: "",
            confirm_duration: "",
            owner_role: "",
            owner_id: "",
            task_assign_id: "",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
        ],
      },
      {
        text: "2223复核",
        parent: "71723713902411776",
        wbs: "1.2.2",
        qualityplan_version: "",
        id: "71723713902411778",
        audit_task_id: "",
        duration: "",
        quality_action: "压缩工期2天",
        project_id: "7d89067b-5a1a-4736-be72-396ee0e5753a",
        position: "8",
        subArray: [
          {
            owner: "",
            plan_starttime: "",
            plan_endtime: "",
            task_status: "",
            confirm_duration: "",
            owner_role: "",
            owner_id: "",
            task_assign_id: "",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
          {
            owner: "",
            plan_starttime: "",
            plan_endtime: "",
            task_status: "",
            confirm_duration: "",
            owner_role: "",
            owner_id: "",
            task_assign_id: "",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
        ],
      },
      {
        text: "1",
        parent: "71534000841162752",
        wbs: "1.3",
        qualityplan_version: "",
        id: "71723713902411779",
        audit_task_id: "",
        duration: "",
        quality_action: "",
        project_id: "7d89067b-5a1a-4736-be72-396ee0e5753a",
        position: "9",
        subArray: [
          {
            owner: "",
            plan_starttime: "",
            plan_endtime: "",
            task_status: "",
            confirm_duration: "",
            owner_role: "",
            owner_id: "",
            task_assign_id: "",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
          {
            owner: "",
            plan_starttime: "",
            plan_endtime: "",
            task_status: "",
            confirm_duration: "",
            owner_role: "",
            owner_id: "",
            task_assign_id: "",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
        ],
      },
      {
        text: "1111",
        parent: "71534000841162752",
        wbs: "1.4",
        qualityplan_version: "",
        id: "71724119627923456",
        audit_task_id: "",
        duration: "",
        project_id: "7d89067b-5a1a-4736-be72-396ee0e5753a",
        position: "10",
        subArray: [
          {
            owner: "",
            plan_starttime: "",
            plan_endtime: "",
            task_status: "",
            confirm_duration: "",
            owner_role: "",
            owner_id: "",
            task_assign_id: "",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
        ],
      },
      {
        text: "1111设计",
        parent: "71724119627923456",
        wbs: "",
        qualityplan_version: "",
        id: "71724119627923457",
        audit_task_id: "",
        duration: "",
        quality_action: "延长工期3天",
        project_id: "7d89067b-5a1a-4736-be72-396ee0e5753a",
        position: "",
        subArray: [
          {
            owner: "",
            plan_starttime: "",
            plan_endtime: "",
            task_status: "",
            confirm_duration: "",
            owner_role: "",
            owner_id: "",
            task_assign_id: "",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
        ],
      },
      {
        text: "1111复核",
        parent: "71724119627923456",
        wbs: "",
        qualityplan_version: "",
        id: "71724119627923458",
        audit_task_id: "",
        duration: "",
        quality_action: "延长工期3天",
        project_id: "7d89067b-5a1a-4736-be72-396ee0e5753a",
        position: "",
        subArray: [
          {
            owner: "",
            plan_starttime: "",
            plan_endtime: "",
            task_status: "",
            confirm_duration: "",
            owner_role: "",
            owner_id: "",
            task_assign_id: "",
            first_duration: "",
            modify_duration: "",
            mod_con_duration: "",
            owner_roleid: "",
            skill: "技能1",
            isreply: "1",
          },
        ],
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
    // let height = $("#resourceAllocationApp", model.dom).get(0).clientHeight;
    // this.$nextTick(function () {
    //   self.tableHeight =
    //     height - self.$refs.resourceAllocationTable.$el.offsetTop - 80;
    //   // 监听窗口大小变化
    //   window.onresize = function () {
    //     self.tableHeight =
    //       height - self.$refs.resourceAllocationTable.$el.offsetTop - 80;
    //   };
    // });
  },
  computed: {
    /**
     * Author: zhang fq
     * Date: 2020-06-10
     * Description: 质量维护 添加权限功能
     * 根据后台返回数据处理页面按钮能否点击以及字段是否显示
     */
    getBtnShow(btnId) {
      // return true;

      var _this = this;
      return function (btnId) {
        return true;

        // let arr = _this.funcPerm.filter((v) => {
        //   return v.elementid === btnId;
        // });
        // return arr.length > 0 ? false : true;
      };
    },
    getFieldShow(fieldId) {
      var _this = this;
      return function (fieldId) {
        return true;

        // let arr = _this.fieldPerm.filter((v) => {
        //   return v.elementid === fieldId;
        // });
        // if (arr.length > 0) {
        //   return arr[0].isvisible === 1 ? true : false;
        // } else {
        //   return true;
        // }
      };
    },
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.delegate === "1") {
        return "delegate-row";
      }
      return "";
    },
    goAllocation() {
      // 资源调配
      var _this = this;
      let ids = this.resourceAllocationGetSelectedId();
      let sendData = {
        data: ids,
      };
      if (ids.length == 0) {
        this.$message.error("未勾选任务");
      } else if (ids.length > 1) {
        this.$message.error("资源调配不能多选");
      } else {
        if (
          ids[0].owner_id === "" ||
          ids[0].owner_id === null ||
          ids[0].owner_id === undefined
        ) {
          this.$message.error("新增的任务不能进行资源调配");
        } else {
          changedIds = changedIds.concat(this.currentSelectedIds);
          model.invoke("resourceAllocation", sendData);
        }
      }
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
    showMeasures(row) {
      // 将要显示处理措施详情的该跳任务发送到后台 通知后台弹出措施列表
      // model.invoke("showQualityMeasures", row);
      console.log(row);
    },
  },
}).$mount("#resourceAllocationApp");
