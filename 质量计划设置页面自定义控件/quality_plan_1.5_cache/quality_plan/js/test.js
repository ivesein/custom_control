import { datajson } from "./data.js";
let myData = formatToTreeData({
  arrayList: datajson,
  idStr: "id",
});
// let myData1 = _.cloneDeep(myData[0]);
// Object.preventExtensions(myData1);
// // debugger;
// let arr = [];
// arr.push(myData1);
// Object.preventExtensions(arr);
// myData2[0].sdfsdfsc = "222222333333";
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
    pageStatus: false,
    top: 0,
    // tableData: myData,
    currentRow: null,
    taskChangedIndex: [], // 记录修改过的任务在缓存数据中的索引
  },
  created() {},
  mounted() {
    let self = this;
    // 固定表格表头 设置表格高度自适应填满剩余高度
    this.$nextTick(function () {
      self.tableHeight =
        window.innerHeight - self.$refs.qualityPlanTable.$el.offsetTop - 60;
      // 监听窗口大小变化
      window.onresize = function () {
        self.tableHeight =
          window.innerHeight - self.$refs.qualityPlanTable.$el.offsetTop - 60;
      };
    });
    // // 设置表格数据
    let data = this.setAuditTaskUndertaker(myData);
    this.$refs.qualityPlanTable.reloadData(data);
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
    rowClick(row) {
      this.currentRow = row;
      console.log(row);
    },
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
    /**
     * @Author: zhang fq
     * @Date: 2020-08-07
     * @Description: 重写质量计划 设置角色交互数据处理逻辑
     * 大量缩减交互处理代码，同步修改页面显示和缓存数据，提高性能
     */
    SetRole() {
      if (this.currentRow === null) {
        this.$message.warning("请单击选择一条任务进行设置");
        return;
      }
      if (this.currentRow.type !== "project") {
        if (this.currentRow.delegate === 1) {
          this.$message.error("已委外的任务无法设置角色");
          return;
        }
        if (
          this.currentRow.type == "task" &&
          this.currentRow.task_type !== "4"
        ) {
          // TODO:处理交互
          let index = Math.floor(Math.random() * 10 + 1);
          let role = [
            "设计专员1",
            "设计专员2",
            "设计专员3",
            "设计专员4",
            "设计专员5",
            "设计专员6",
            "设计专员7",
            "设计专员8",
            "设计专员9",
            "设计专员10",
          ];
          let name = [
            "张三",
            "李四",
            "王五",
            "马六",
            "黄岐",
            "杜甫",
            "李白",
            "王维",
            "王勃",
            "孙思邈",
          ];
          // 根据开始设定的源索引 在缓存的源数据里直接找到该条 更新
          datajson[this.currentRow.indexR].qp_owner_role = role[index];
          datajson[this.currentRow.indexR].qp_owner = name[index];
          datajson[this.currentRow.indexR].qp_owner_id = "11111111";
          // 同步更新页面显示
          this.currentRow.qp_owner_role = role[index];
          this.currentRow.qp_owner = name[index];
          this.currentRow.qp_owner_id = "11111111";
          // 将修改了数据的该条任务 记录起来
          this.taskChangedIndex.push(this.currentRow.indexR);
        } else {
          this.$message.error("该类型的任务无法设置角色");
          return;
        }
      } else {
        this.$message.error("摘要任务无法设置角色");
        return;
      }
    },
    saveData() {
      console.log("saveData>>>");
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
    // 将源数据格式化为表格树形结构数据
    /**
     * @Author: zhang fq
     * @Date: 2020-08-07
     * @Description: 优化将模板数据（一维数组）处理为树形结构数据的算法，
     * 添加源索引，后期前后台交互可直接根据索引更新，优化处理速度
     */
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
// 深度冻结
function deepFreeze(obj) {
  // 先冻结第一层
  Object.freeze(obj);

  for (let key in obj) {
    let prop = obj[key];
    //  三种情况不进行递归冻结 1.不是对象 2.该对象已经被冻结 3.是原型上的属性
    if (
      !(typeof prop === "object") ||
      Object.isFrozen(prop) ||
      !obj.hasOwnProperty(key)
    ) {
      continue;
    } else {
      deepFreeze(prop);
    }
  }
}
function formatToTreeData({
  arrayList,
  pidStr = "parent",
  idStr = "id",
  childrenStr = "children",
}) {
  let treeList = []; // 用来储存最终树形结构数据的数组
  if (!Array.isArray(arrayList)) {
    return treeList;
  }
  let templist = _.cloneDeep(arrayList);
  let listObj = {}; // 用来储存{key: obj}格式的对象
  // 将数据变换成{key: obj}格式，方便下面处理数据
  for (let i = 0; i < templist.length; i++) {
    templist[i].indexR = i; // 标记源索引
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
}
