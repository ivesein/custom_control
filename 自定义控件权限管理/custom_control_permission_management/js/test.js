new Vue({
  delimiters: ["${", "}"],
  data: {
    activeName: "first",
    searchText: "", //搜索字段
    data: [
      //默认树数据结构
      {
        id: "0",
        label: "功能权限",
        children: [
          {
            id: "1",
            label: "测试云",
            children: [],
          },
          {
            id: "2",
            label: "员工服务云",
            children: [
              {
                id: "2-1",
                label: "费用查询",
              },
              {
                id: "2-2",
                label: "人人差旅",
              },
            ],
          },
          {
            id: "3",
            label: "财务云",
            children: [
              {
                id: "3-1",
                label: "应付",
              },
              {
                id: "3-2",
                label: "应收",
              },
            ],
          },
          {
            id: "4",
            label: "系统云",
            children: [
              {
                id: "4-1",
                label: "企业管理",
              },
              {
                id: "4-2",
                label: "基础资料",
              },
            ],
          },
          {
            id: "5",
            label: "公司管理",
            children: [
              {
                id: "5-1",
                label: "经营管理（建筑业）",
              },
              {
                id: "5-2",
                label: "人力管理",
              },
              {
                id: "5-3",
                label: "采购管理",
              },
              {
                id: "5-4",
                label: "库存管理",
              },
            ],
          },
          {
            id: "6",
            label: "公路云",
            children: [
              {
                id: "6-1",
                label: "公路云（建筑业）",
                children: [
                  {
                    id: "6-1-1",
                    label: "手机注册",
                  },
                  {
                    id: "6-1-2",
                    label: "密码找回",
                  },
                ],
              },
            ],
          },
          {
            id: "7",
            label: "项目管理",
            children: [
              {
                id: "7-1",
                label: "项目基础设置",
              },
              {
                id: "7-2",
                label: "计划编制",
              },
              {
                id: "7-3",
                label: "合同计划",
              },
              {
                id: "7-4",
                label: "执行管理",
                children: [
                  {
                    id: "7-4-1",
                    label: "进度管理（自定义）",
                  },
                  {
                    id: "7-4-2",
                    label: "质量管理（自定义）",
                  },
                  {
                    id: "7-4-3",
                    label: "成本管理（自定义）",
                    biz_id: "",
                    children: [
                      {
                        id: "7-4-3-1",
                        label: "成本分析与控制",
                        children: [
                          {
                            id: "7-4-3-1-1",
                            label: "成本对比分析表",
                            children: [
                              {
                                id: "7-4-3-1-1-1",
                                label: "首页（自定义）",
                              },
                              {
                                id: "7-4-3-1-1-2",
                                label: "当前任务成本管控（自定义）",
                              },
                              {
                                id: "7-4-3-1-1-3",
                                label: "紧前任务成本管控（自定义）",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        id: "7-4-3-2",
                        label: "成本总览（自定义）",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    assignedData: [
      //已分配树 数据结构
      {
        id: "0",
        label: "已分配",
        children: [
          // {
          //   id: "4",
          //   label: "系统云",
          //   children: [
          //     {
          //       id: "4-1",
          //       label: "企业管理",
          //     },
          //     {
          //       id: "4-2",
          //       label: "基础资料",
          //     },
          //   ],
          // },
          {
            id: "5",
            label: "公司管理",
            children: [
              {
                id: "5-1",
                label: "经营管理（建筑业）",
              },
              {
                id: "5-2",
                label: "人力管理",
              },
              {
                id: "5-3",
                label: "采购管理",
              },
              {
                id: "5-4",
                label: "库存管理",
              },
            ],
          },
          {
            id: "6",
            label: "公路云",
            children: [
              {
                id: "6-1",
                label: "公路云（建筑业）",
                children: [
                  {
                    id: "6-1-1",
                    label: "手机注册",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    defaultProps: {
      children: "children",
      label: "label",
    },
    defaultExpandedArr: ["0"], //默认展开节点
    currendFieldTreeNodeClicked: null, //当前点击的字段树的节点对象
    value: true,
    fieldListData: [], //字段权限 树节点映射的字段列表数据显示区域
    ifFieldSelectShow: false, //是否显示选择字段弹出框
    isIndeterminate: false, //是否半选
    fieldSelectCheckAll: false, //全选
    alternative_fields: [
      // 字段选择弹出框 备选字段列表数据
      {
        field_name: "创建人",
        field_code: "creater",
        field_check: true,
        field_edit: true,
        checked: false,
      },
      {
        field_name: "创建时间",
        field_code: "creater_time",
        field_check: true,
        field_edit: true,
        checked: false,
      },
      {
        field_name: "创建组织",
        field_code: "creater_org",
        field_check: true,
        field_edit: true,
        checked: false,
      },
      {
        field_name: "修改时间",
        field_code: "modify_time",
        field_check: true,
        field_edit: true,
        checked: false,
      },
      {
        field_name: "修改人",
        field_code: "modify_owner",
        field_check: true,
        field_edit: true,
        checked: false,
      },
      {
        field_name: "禁用时间",
        field_code: "disabled_time",
        field_check: true,
        field_edit: true,
        checked: false,
      },
    ],
    fieldCheckedList: [], //已选择的字段列表
    selectedFieldDataMaptoTreeItem: [], //树节点和已选字段映射
  },
  created() {},
  mounted() {
    // this.defaultExpandedArr=this.getDefaultExpandedKeys(this.data[0].children)
  },
  methods: {
    getDefaultExpandedKeys(arr) {
      let res = [];
      if (Array.isArray(arr)) {
        if (arr.length > 0) {
          arr.forEach((v) => {
            res.push(v.id);
          });
        }
      }
      return res;
    },
    handleClick(val) {
      console.log(val);
    },
    add() {
      // 获取勾选的所有节点的id
      let checked = this.$refs.treeLeft.getCheckedKeys();
      console.log("checked>>", checked);
      // 从勾选节点中获取被包含的子节点的下标
      let filterArr = _.cloneDeep(checked);
      let tempNode = checked[0];
      let indexSplice = [];
      for (let i = 1; i < checked.length; i++) {
        if (checked[i].indexOf(tempNode) == 0) {
          indexSplice.push(i);
        } else {
          tempNode = checked[i];
        }
      }
      console.log("indexSplice>>", indexSplice);
      // 根据包含子节点下标过滤出父节点id
      indexSplice.forEach((v, k) => {
        if (k === 0) {
          filterArr.splice(v, 1);
        } else {
          filterArr.splice(v - k, 1);
        }
      });
      let resPArr = [];
      let rootCheckedArr = []; //存放 从根节点就全选的节点id
      console.log("filterArr>>", filterArr);
      filterArr.forEach((v) => {
        //获取当前父节点
        let tempRootNode = this.$refs.treeLeft.getNode(v);
        // 根据当前父节点获取所有上层节点
        let arrParent = v.split("-"); //["7-4-3-1-1-1"]=>["7", "4", "3", "1", "1", "1"]
        console.log(tempRootNode);
        console.log(arrParent);
        // 过滤从根节点就全选的节点 直接取出 跳出遍历
        if (arrParent.length === 1) {
          rootCheckedArr.push(v);
        } else {
          // 递归找到该节点的所有父节点
          let len = arrParent.length - 1;
          let pSliceArr = [];
          while (len > 0) {
            pSliceArr.push(arrParent.slice(0, len));
            len -= 1;
          }
          console.log(pSliceArr);
          let pJoin = pSliceArr.map((pv) => {
            return pv.join("-");
          });
          resPArr.push(...pJoin);
          console.log(pJoin);
        }
      });
      console.log("resPArr>>", resPArr);
      // resPArr>>["6-1", "6", "7-4-3-1-1", "7-4-3-1", "7-4-3", "7-4", "7", "7-4-3-1-1", "7-4-3-1", "7-4-3", "7-4", "7", "7-4-3", "7-4", "7"]
      // 数组去重 将有相同父节点的id合并
      let set = new Set(resPArr);
      let arr = Array.from(set);
      arr.sort(); //["6", "6-1", "7", "7-4", "7-4-3", "7-4-3-1", "7-4-3-1-1"]
      console.log(arr);
      // 将arr按同一父节点规律分组  ["6","6-1"],["7", "7-4", "7-4-3", "7-4-3-1", "7-4-3-1-1"]
      // 按规律分组后 开始构造层级关系
      /**
       * {
       *    id:"6",
       *    label: "公路云",
       *    children:[
       *      {
       *        id:"6-1",
       *        label:"公路云（建筑业）"
       *        children:[]
       *       }
       *    ]
       * }
       */
    },
    /**
     * Author: zhang fq
     * Date: 2020-05-13
     * Description: 权限分配标签页 右侧树结构 选中移除方法
     */
    // 移除按钮功能
    remove() {
      // 获取选中的要删除的节点id
      let removeNode = this.$refs.treeRight.getCheckedKeys();
      console.log(removeNode);
      // 根据选中的节点id 循环删除每一个选中的节点
      removeNode.forEach((v) => {
        this.$refs.treeRight.remove(v);
      });
      this.$nextTick(function () {
        //取消勾选状态的方法需要配合setCheckedKeys使用。直接改变数组数据无法取消勾选状态
        this.$refs.treeRight.setCheckedKeys([], true);
      });
      console.log("this.assignedData", this.assignedData);
      if (this.assignedData.length === 0) {
        this.assignedData.push({
          id: "0",
          label: "已分配",
          children: [],
        });
      }
    },
    /**
     * Author: zhang fq
     * Date: 2020-05-13
     * Description: 字段权限标签页 选择字段按钮功能 以及是否点击业务对象节点判断
     */

    // 选择字段按钮功能
    choseField() {
      //判断点击的当前节点是否为业务对象节点;
      if (this.currendFieldTreeNodeClicked === null) return;
      if (
        this.currendFieldTreeNodeClicked.children &&
        this.currendFieldTreeNodeClicked.children.length > 0
      ) {
        this.$message.error("请先选择业务对象节点!");
      } else {
        // TODO 将节点id发送到后台 获取该节点id的所有字段
        this.ifFieldSelectShow = true;
      }
    },
    /**
     * Author: zhang fq
     * Date: 2020-05-15
     * Description: 字段权限 获取当前点击的字段树节点
     */
    fieldTreeNodeClick(data, node, tree) {
      this.currendFieldTreeNodeClicked = data;
      // 从存储的映射数据中拿到当前节点的已选字段集
      if (this.selectedFieldDataMaptoTreeItem.length === 0) {
        this.fieldListData = [];
      } else {
        let dataTemp = this.selectedFieldDataMaptoTreeItem.filter((v) => {
          return v.id === data.id;
        });
        // 从映射数据中取匹配
        this.fieldListData = dataTemp.length === 0 ? [] : dataTemp[0].listData;
      }
    },
    // 字段选择弹出框 取消按钮功能
    cancel() {
      this.ifFieldSelectShow = false;
    },
    /**
     * Author: zhang fq
     * Date: 2020-05-15
     * Description: 字段选择弹出框 确认按钮功能
     */
    confirm() {
      this.ifFieldSelectShow = false;
      if (this.fieldCheckedList.length === 0) {
        this.$message.error("没有选中行");
      } else {
        //将已选择字段集赋值给显示列表
        this.fieldListData = _.cloneDeep(this.fieldCheckedList);
        // 将已选择字段和当前选择的业务对象 terrItem映射并存储 用于切换直接显示 避免多次从后台获取
        this.selectedFieldDataMaptoTreeItem.push({
          id: this.currendFieldTreeNodeClicked.id,
          listData: _.cloneDeep(this.fieldCheckedList),
        });
      }
    },
    /**
     * Author: zhang fq
     * Date: 2020-05-15
     * Description: 字段选择弹出框 全选按钮功能
     */
    handleCheckAllChange(val) {
      if (val === true) {
        // 先将右侧已选清空 再将每一项都push进右侧已选数据 避免重复
        this.fieldCheckedList = [];
        this.fieldCheckedList.length = 0;
        this.alternative_fields.forEach((v, k) => {
          // 将备选字段列表的每一项都勾选
          v.checked = true;
          let tempData = _.cloneDeep(v);
          tempData.index = k;
          this.fieldCheckedList.push(tempData);
        });
      } else {
        this.alternative_fields.forEach((v) => {
          v.checked = false;
        });
        this.fieldCheckedList = [];
        this.fieldCheckedList.length = 0;
      }
    },
    /**
     * Author: zhang fq
     * Date: 2020-05-15
     * Description: 从右侧已选列表 删除某个已选择的字段
     */
    deleteCheckedFieldItem(item, index) {
      // 1.从右侧已选删除该字段
      this.fieldCheckedList.splice(index, 1);
      // 2.将左侧字段列表对应的该字段 checked置为false
      let itemIndex = item.index;
      this.alternative_fields[itemIndex].checked = false;
      this.fieldSelectCheckAll = false;
    },
    /**
     * Author: zhang fq
     * Date: 2020-05-15
     * Description: 右侧已选列表按钮  清空所有已选  左右列表要同步
     */
    fieldCheckedListClearAll() {
      this.fieldCheckedList = [];
      this.fieldCheckedList.length = 0;
      this.alternative_fields.forEach((v) => {
        v.checked = false;
      });
      //将全选按钮置为false
      this.fieldSelectCheckAll = false;
    },
    /**
     * Author: zhang fq
     * Date: 2020-05-15
     * Description: 处理选择字段弹出框 备选字段列表每项的选择按钮
     */
    handleTableListItemCheckChange(item, index) {
      // 完成左列表勾选和右侧已选列表数据同步
      // 如果是勾选 将勾选的item 存入右侧已选列表数据中
      if (item.checked === true) {
        let tempData = _.cloneDeep(item);
        tempData.index = index;
        console.log(tempData);
        this.fieldCheckedList.push(tempData);
        // 如果是一个一个 全都勾选的  将全选按钮置为true
        let flag = this.alternative_fields.every((v) => {
          return v.checked === true;
        });
        this.fieldSelectCheckAll = flag === true ? true : false;
      } else {
        // 如果是取消勾选 从已选数据中删除该条
        if (this.fieldCheckedList.length === 0) return;
        let index = null;
        for (let i = 0; i < this.fieldCheckedList.length; i++) {
          if (item.field_code === this.fieldCheckedList[i].field_code) {
            index = i;
            break;
          }
        }
        if (index !== null) {
          this.fieldCheckedList.splice(index, 1);
        }
        // 将全选按钮置为false
        this.fieldSelectCheckAll = false;
      }
    },
  },
}).$mount("#ccPermissionManagementApp");
