new Vue({
  delimiters: ["${", "}"],
  data: {
    activeName: "first",
    searchText: "",
    data: [
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
    defaultExpandedArr: ["0"],
    currendFieldTreeNodeClicked: null, //当前点击的字段树的节点对象
    value:true,
    fieldListData:[
      {
        field_name:"创建人",
        can_check:true,
        can_edit:true
      },
      {
        field_name:"创建时间",
        can_check:true,
        can_edit:true
      },
      {
        field_name:"创建组织",
        can_check:true,
        can_edit:true
      },
      {
        field_name:"修改时间",
        can_check:true,
        can_edit:true
      },{
        field_name:"修改人",
        can_check:true,
        can_edit:true
      },
      {
        field_name:"禁用时间",
        can_check:true,
        can_edit:true
      }
    ],
    ifFieldSelectShow:false,
    isIndeterminate:false,
    fieldSelectCheckAll:false,
    alternative_fields:[
      {
        field_name:"创建人",
        field_code:"creater",
        checked:false
      },
      {
        field_name:"创建时间",
        field_code:"creater_time",
        checked:false
      },
      {
        field_name:"创建组织",
        field_code:"creater_org",
        checked:false
      },
      {
        field_name:"修改时间",
        field_code:"modify_time",
        checked:false
      },{
        field_name:"修改人",
        field_code:"modify_owner",
        checked:false
      },
      {
        field_name:"禁用时间",
        field_code:"disabled_time",
        checked:false
      }
    ]
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
      // 数组去重
      let set = new Set(resPArr);
      let arr = Array.from(set);
      arr.sort();
      console.log(arr);
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
      this.ifFieldSelectShow=true

      // 判断点击的当前节点是否为业务对象节点
      // if (
      //   this.currendFieldTreeNodeClicked.children &&
      //   this.currendFieldTreeNodeClicked.children.length > 0
      // ) {
      //   this.$message.error("请先选择业务对象节点!");
      // } else {
      //   // TODO 将节点id发送到后台 获取该节点id的所有字段
      //   this.ifFieldSelectShow=true
      // }
    },
    // 获取当前点击的字段树节点
    fieldTreeNodeClick(data, node, tree) {
      this.currendFieldTreeNodeClicked = data;
    },
    //
    cancel(){
      this.ifFieldSelectShow=false
    },
    confirm(){
      this.ifFieldSelectShow=false
    },
    handleCheckAllChange(){
      
    }
  },
}).$mount("#ccPermissionManagementApp");
