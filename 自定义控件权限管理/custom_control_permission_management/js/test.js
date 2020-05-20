new Vue({
  delimiters: ["${", "}"],
  data: {
    activeName: "first",
    searchText: "", //搜索字段
    defaultTreeData: [
      {
        children: [
          {
            cloud: "0M731/HL/PCC",
            children: [
              {
                app: "0CKY+711JQLA",
                children: [
                  {
                    children: [
                      {
                        cstlid: "quality_plan_v1.3",
                        id: "1-1-1-1",
                        label: "质量计划",
                        assignedfields: [
                          {
                            elementid: "owner_role",
                            elementname: "承担人角色field",
                            isvisible: 1,
                            checked: true,
                            iseditable: 1,
                          },
                        ],
                        assigneddatarules: [],
                        children: [
                          {
                            elementid: "btn1",
                            id: "1-1-1-1-1",
                            label: "设置角色",
                            sourceid: "sxzd_quality_planv3",
                          },
                          {
                            elementid: "btn2",
                            id: "1-1-1-1-2",
                            label: "设置持续时间",
                            source: "sxzd_quality_planv3",
                          },
                          {
                            elementid: "btn3",
                            id: "1-1-1-1-3",
                            label: "刷新",
                            source: "sxzd_quality_planv3",
                          },
                        ],
                      },
                    ],
                    bill: "sxzd_project_plan",
                    id: "1-1-1",
                    label: "项目计划",
                  },
                ],
                id: "1-1",
                label: "计划编制",
              },
              {
                app: "0DNIEZMAPK0I",
                children: [
                  {
                    children: [
                      {
                        cstlid: "resource_allocation_v1.0",
                        id: "1-2-1-1",
                        label: "质量维护",
                        children: [
                          {
                            elementid: "btnx",
                            id: "1-2-1-1-1",
                            label: "资源调配",
                            source: "sxzd_quality_planv3_save",
                          },
                        ],
                      },
                    ],
                    bill: "sxzd_executive_management",
                    id: "1-2-1",
                    label: "计划维护与发布",
                  },
                ],
                id: "1-2",
                label: "执行管理",
              },
            ],
            id: "1",
            label: "项目管理",
          },
          {
            cloud: "0M734GP77GFO",
            children: [
              {
                app: "0OSNPZ+G0FRY",
                children: [
                  {
                    children: [
                      {
                        cstlid: "company_calendar_v1.0",
                        id: "2-1-1-1",
                        label: "企业日历",
                        children: [
                          {
                            elementid: "testbbid",
                            id: "2-1-1-1-1",
                            label: "testbbname",
                            source: "",
                          },
                          {
                            elementid: "testccid",
                            id: "2-1-1-1-2",
                            label: "testccname",
                            source: "",
                          },
                        ],
                      },
                    ],
                    bill: "sxzd_enterprise_calendar",
                    id: "2-1-1",
                    label: "企业日历",
                  },
                  {
                    children: [
                      {
                        cstlid: "resource_calendar_v1.0",
                        id: "2-1-2-1",
                        label: "资源日历",
                        children: [
                          {
                            elementid: "settime",
                            id: "2-1-2-1-1",
                            label: "设置排程方式",
                            source: "",
                          },
                          {
                            elementid: "testaid",
                            id: "2-1-2-1-2",
                            label: "testaname",
                            source: "",
                          },
                        ],
                      },
                    ],
                    bill: "sxzd_resources_calendar",
                    id: "2-1-2",
                    label: "资源日历",
                  },
                ],
                id: "2-1",
                label: "日历管理",
              },
            ],
            id: "2",
            label: "公司管理",
          },
          {
            cloud: "0MKCCCJPD=43",
            children: [
              {
                app: "0MKCQC0MBGV3",
                children: [
                  {
                    children: [
                      {
                        cstlid: "wbs_planning_v1.0",
                        id: "3-1-1-1",
                        label: "模板管理",
                        children: [],
                      },
                    ],
                    bill: "sxzd_wbs_template_manage",
                    id: "3-1-1",
                    label: "公路云WBS模板管理",
                  },
                ],
                id: "3-1",
                label: "模板管理",
              },
            ],
            id: "3",
            label: "模板管理",
          },
        ],
        id: "0",
        label: "功能权限",
      },
    ],
    // [
    //   //默认树数据结构
    //   {
    //     id: "0",
    //     label: "功能权限",
    //     children: [
    //       {
    //         id: "1",
    //         label: "测试云",
    //         children: [],
    //       },
    //       {
    //         id: "2",
    //         label: "员工服务云",
    //         children: [
    //           {
    //             id: "2-1",
    //             label: "费用查询",
    //           },
    //           {
    //             id: "2-2",
    //             label: "人人差旅",
    //           },
    //         ],
    //       },
    //       {
    //         id: "3",
    //         label: "财务云",
    //         children: [
    //           {
    //             id: "3-1",
    //             label: "应付",
    //           },
    //           {
    //             id: "3-2",
    //             label: "应收",
    //           },
    //         ],
    //       },
    //       {
    //         id: "4",
    //         label: "系统云",
    //         children: [
    //           {
    //             id: "4-1",
    //             label: "企业管理",
    //           },
    //           {
    //             id: "4-2",
    //             label: "基础资料",
    //           },
    //         ],
    //       },
    //       {
    //         id: "5",
    //         label: "公司管理",
    //         children: [
    //           {
    //             id: "5-1",
    //             label: "经营管理（建筑业）",
    //           },
    //           {
    //             id: "5-2",
    //             label: "人力管理",
    //           },
    //           {
    //             id: "5-3",
    //             label: "采购管理",
    //           },
    //           {
    //             id: "5-4",
    //             label: "库存管理",
    //           },
    //         ],
    //       },
    //       {
    //         id: "6",
    //         label: "公路云",
    //         children: [
    //           {
    //             id: "6-1",
    //             label: "公路云（建筑业）",
    //             children: [
    //               {
    //                 id: "6-1-1",
    //                 label: "手机注册",
    //               },
    //               {
    //                 id: "6-1-2",
    //                 label: "密码找回",
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //       {
    //         id: "7",
    //         label: "项目管理",
    //         children: [
    //           {
    //             id: "7-1",
    //             label: "项目基础设置",
    //           },
    //           {
    //             id: "7-2",
    //             label: "计划编制",
    //           },
    //           {
    //             id: "7-3",
    //             label: "合同计划",
    //           },
    //           {
    //             id: "7-4",
    //             label: "执行管理",
    //             children: [
    //               {
    //                 id: "7-4-1",
    //                 label: "进度管理（自定义）",
    //               },
    //               {
    //                 id: "7-4-2",
    //                 label: "质量管理（自定义）",
    //               },
    //               {
    //                 id: "7-4-3",
    //                 label: "成本管理（自定义）",
    //                 biz_id: "",
    //                 children: [
    //                   {
    //                     id: "7-4-3-1",
    //                     label: "成本分析与控制",
    //                     children: [
    //                       {
    //                         id: "7-4-3-1-1",
    //                         label: "成本对比分析表",
    //                         children: [
    //                           {
    //                             id: "7-4-3-1-1-1",
    //                             label: "首页（自定义）",
    //                           },
    //                           {
    //                             id: "7-4-3-1-1-2",
    //                             label: "当前任务成本管控（自定义）",
    //                           },
    //                           {
    //                             id: "7-4-3-1-1-3",
    //                             label: "紧前任务成本管控（自定义）",
    //                           },
    //                         ],
    //                       },
    //                     ],
    //                   },
    //                   {
    //                     id: "7-4-3-2",
    //                     label: "成本总览（自定义）",
    //                   },
    //                 ],
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ],
    assignedData: [
      {
        children: [
          {
            cloud: "0M731/HL/PCC",
            children: [
              {
                app: "0CKY+711JQLA",
                children: [
                  {
                    children: [
                      {
                        cstlid: "quality_plan_v1.3",
                        id: "1-1-1-1",
                        label: "质量计划",
                        assignedfields: [
                          {
                            elementid: "owner_role",
                            elementname: "承担人角色field",
                            isvisible: 1,
                            checked: true,
                            iseditable: 1,
                          },
                        ],
                        assigneddatarules: [],
                        children: [
                          {
                            elementid: "btn1",
                            isvisible: "1",
                            id: "1-1-1-1-1",
                            label: "设置角色",
                            source: "sxzd_quality_planv3",
                            iseditable: "0",
                            elementtype: "cstl_button",
                          },
                          {
                            elementid: "btn3",
                            isvisible: "0",
                            id: "1-1-1-1-3",
                            label: "刷新",
                            source: "sxzd_quality_planv3",
                            iseditable: "1",
                            elementtype: "cstl_button",
                          },
                        ],
                      },
                    ],
                    bill: "sxzd_project_plan",
                    id: "1-1-1",
                    label: "项目计划",
                  },
                ],
                id: "1-1",
                label: "计划编制",
              },
              {
                app: "0DNIEZMAPK0I",
                children: [
                  {
                    children: [
                      {
                        cstlid: "resource_allocation_v1.0",
                        id: "1-2-1-1",
                        label: "质量维护",
                        assignedfields: [],
                        assigneddatarules: [],
                        children: [
                          {
                            elementid: "btnx",
                            isvisible: "1",
                            id: "1-2-1-1-1",
                            label: "资源调配",
                            source: "sxzd_quality_planv3_save",
                            iseditable: "1",
                            elementtype: "cstl_button",
                          },
                        ],
                      },
                    ],
                    bill: "sxzd_executive_management",
                    id: "1-2-1",
                    label: "计划维护与发布",
                  },
                ],
                id: "1-2",
                label: "执行管理",
              },
            ],
            id: "1",
            label: "项目管理",
          },
          {
            cloud: "0M734GP77GFO",
            children: [
              {
                app: "0OSNPZ+G0FRY",
                children: [
                  {
                    children: [
                      {
                        cstlid: "company_calendar_v1.0",
                        id: "2-1-1-1",
                        label: "企业日历",
                        assignedfields: [],
                        assigneddatarules: [],
                        children: [
                          {
                            elementid: "testbbid",
                            isvisible: "1",
                            id: "2-1-1-1-1",
                            label: "testbbname",
                            source: "",
                            iseditable: "1",
                            elementtype: "cstl_button",
                          },
                          {
                            elementid: "testccid",
                            isvisible: "0",
                            id: "2-1-1-1-2",
                            label: "testccname",
                            source: "",
                            iseditable: "0",
                            elementtype: "cstl_button",
                          },
                        ],
                      },
                    ],
                    bill: "sxzd_enterprise_calendar",
                    id: "2-1-1",
                    label: "企业日历",
                  },
                ],
                id: "2-1",
                label: "日历管理",
              },
            ],
            id: "2",
            label: "公司管理",
          },
          {
            cloud: "0MKCCCJPD=43",
            children: [
              {
                app: "0MKCQC0MBGV3",
                children: [
                  {
                    children: [
                      {
                        cstlid: "wbs_planning_v1.0",
                        id: "3-1-1-1",
                        label: "模板管理",
                        assignedfields: [],
                        assigneddatarules: [],
                        children: [
                          {
                            elementid: "duration",
                            isvisible: "1",
                            id: "3-1-1-1-1",
                            iseditable: "0",
                          },
                          {
                            elementid: "owner",
                            isvisible: "0",
                            id: "3-1-1-1-2",
                            iseditable: "0",
                          },
                        ],
                      },
                    ],
                    bill: "sxzd_wbs_template_manage",
                    id: "3-1-1",
                    label: "公路云WBS模板管理",
                  },
                ],
                id: "3-1",
                label: "模板管理",
              },
            ],
            id: "3",
            label: "模板管理",
          },
        ],
        id: "0",
        label: "已分配",
      },
    ],
    // [
    //   //已分配树 数据结构
    //   {
    //     id: "0",
    //     label: "已分配",
    //     children: [
    //       {
    //         id: "4",
    //         label: "系统云",
    //         children: [
    //           {
    //             id: "4-1",
    //             label: "企业管理",
    //           },
    //           {
    //             id: "4-2",
    //             label: "基础资料",
    //           },
    //         ],
    //       },
    //       // {
    //       //   id: "5",
    //       //   label: "公司管理",
    //       //   children: [
    //       //     {
    //       //       id: "5-1",
    //       //       label: "经营管理（建筑业）",
    //       //     },
    //       //     {
    //       //       id: "5-2",
    //       //       label: "人力管理",
    //       //     },
    //       //     {
    //       //       id: "5-3",
    //       //       label: "采购管理",
    //       //     },
    //       //     {
    //       //       id: "5-4",
    //       //       label: "库存管理",
    //       //     },
    //       //   ],
    //       // },
    //       // {
    //       //   id: "6",
    //       //   label: "公路云",
    //       //   children: [
    //       //     {
    //       //       id: "6-1",
    //       //       label: "公路云（建筑业）",
    //       //       children: [
    //       //         {
    //       //           id: "6-1-1",
    //       //           label: "手机注册",
    //       //         },
    //       //       ],
    //       //     },
    //       //   ],
    //       // },
    //     ],
    //   },
    // ],
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
        elementname: "创建人",
        elementid: "creater",
        isvisible: 1,
        iseditable: 1,
        checked: false,
      },
      {
        elementname: "创建时间",
        elementid: "creater_time",
        isvisible: 1,
        iseditable: 1,
        checked: false,
      },
      {
        elementname: "创建组织",
        elementid: "creater_org",
        isvisible: 1,
        iseditable: 1,
        checked: false,
      },
      {
        elementname: "修改时间",
        elementid: "modify_time",
        isvisible: 1,
        iseditable: 1,
        checked: false,
      },
      {
        elementname: "修改人",
        elementid: "modify_owner",
        isvisible: 1,
        iseditable: 1,
        checked: false,
      },
      {
        elementname: "禁用时间",
        elementid: "disabled_time",
        isvisible: 1, //是否可查看
        iseditable: 1, //是否可编辑
        checked: false,
      },
    ],
    fieldCheckedList: [], //已选择的字段列表
    selectedFieldDataMaptoTreeItem: [], //树节点和已选字段映射
    dataRuleList: [], //数据规则
    assArr: [],
    fieldTreeData: [],
    fieldListAllChecked: false, //已选字段列表全选
  },
  created() {
    this.handleAssignedData(this.assignedData);
  },
  mounted() {
    // this.defaultExpandedArr=this.getDefaultExpandedKeys(this.data[0].children)
  },
  methods: {
    /**
     * Author: zhang fq
     * Date: 2020-05-18
     * Description: 字段权限-- 是否可查看 是否可编辑 滑块处理
     * Date: 2020-05-20
     * Update: 增加滑块值变更时自动同步到差异化数据映射集
     */
    isvisibleChange(val, item) {
      item.isvisible = val ? 1 : 0;
      let dataTemp = _.cloneDeep(this.currendFieldTreeNodeClicked);
      dataTemp.assignedfields = _.cloneDeep(this.fieldListData);
      this.updateSelectedFieldDataMaptoTreeItem(dataTemp);
    },
    iseditableChange(val, item) {
      item.iseditable = val ? 1 : 0;
      let dataTemp = _.cloneDeep(this.currendFieldTreeNodeClicked);
      dataTemp.assignedfields = _.cloneDeep(this.fieldListData);
      this.updateSelectedFieldDataMaptoTreeItem(dataTemp);
    },
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
    handleTabClick(val) {
      console.log(val);
    },
    /**
     * Author: zhang fq
     * Date: 2020-05-18
     * Description: 获取右侧树的所有已分配节点id
     * 用于添加时判断是否已有改节点 避免重复插入
     */

    getTreeRightNodes(node) {
      if (node.id !== "0") {
        this.assArr.push(node.id);
      }
      let children = node.children ? node.children : [];
      children.forEach((v) => {
        this.getTreeRightNodes(v);
      });
      // if (node.children && node.children.length > 0) {
      //   node.children.forEach((v) => {
      //     this.getFinalChildNodes(v);
      //   });
      // } else {
      //   if (node.id !== "0") {
      //     this.assArr.push(node.id);
      //   }
      // }
    },
    /**
     * Author: zhang fq
     * Date: 2020-05-16
     * Description: 权限分配标签页 添加按钮
     * 完成 左侧勾选层层抽取父子结构重组树结构插入右侧树算法
     */
    add() {
      this.assArr = [];
      // 获取勾选的所有节点的id
      let checked = this.$refs.treeLeft.getCheckedKeys();
      console.log("checked>>", checked);
      //判断是否有勾选
      if (checked.length === 0) {
        return;
      }
      //如果有勾选
      // 将右侧已分配的所有最终子节点取出  合并到左侧已勾选  避免重复插入  再清空右树
      this.getTreeRightNodes(this.assignedData[0]);
      console.log(this.assArr);
      // this.$set(this.assignedData[0].children, []);
      // this.assignedData[0].children = [];
      // 从勾选节点中获取被包含的子节点的下标
      let filterArr = _.cloneDeep(checked);
      // filterArr.push(...this.assArr);
      // filterArr.sort();
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
        // 根据当前父节点获取所有上层节点
        let arrParent = v.split("-"); //["7-4-3-1-1-1"]=>["7", "4", "3", "1", "1", "1"]
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
      arr.forEach((v) => {
        // 先判断右侧树是否已有该父节点  没有再插
        if (!this.assArr.includes(v)) {
          if (v.length === 1) {
            let node = _.cloneDeep(this.$refs.treeLeft.getNode(v).data);
            delete node.children;
            console.log(node);
            this.$refs.treeRight.append(node, "0");
          } else {
            let parentKey = v.slice(0, v.length - 2);
            console.log("parentKey>>>", parentKey);
            let cNode = _.cloneDeep(this.$refs.treeLeft.getNode(v).data);
            delete cNode.children;
            this.$refs.treeRight.append(cNode, parentKey);
          }
        }
      });
      // 循环 过滤后的最终子节点  将该节点插入到右侧对应的父节点下
      filterArr.forEach((v) => {
        // 判断右侧树是否包含该节点 包含先删再插
        if (this.assArr.includes(v)) {
          this.$refs.treeRight.remove(v);
        }
        //如果当前循环的最终子节点id只有以为("7") 则说明该节点为根节点 将该节点及其子节点一起插入右侧树
        if (v.length === 1) {
          let node = _.cloneDeep(this.$refs.treeLeft.getNode(v).data);
          this.$refs.treeRight.append(node, "0");
        } else {
          //如果该节点key长度不为1 则找到该节点的父节点id 插入到右侧
          let parentKey = v.slice(0, v.length - 2);
          let cNode = _.cloneDeep(this.$refs.treeLeft.getNode(v).data);
          this.$refs.treeRight.append(cNode, parentKey);
        }
      });
      this.handleAssignedData(this.assignedData);
    },
    /**
     * Author: zhang fq
     * Date: 2020-05-18
     * Description: 将权限分配页面已分配的数据处理过滤为字段权限和数据规则标签页树结构数据
     */
    handleAssignedData(node) {
      this.fieldTreeData = _.cloneDeep(node);
      //TODO
      this.filterChildrenFields(this.fieldTreeData[0]);
    },
    //过滤掉自定义控件的按钮 形成新的树型数据 同步到 字段权限和数据规则页面
    filterChildrenFields(node = {}, field = "cstlid") {
      let children = node.children ? node.children : [];
      children.forEach((v) => {
        if (v[field]) {
          v.children = [];
        }
        this.filterChildrenFields(v);
      });
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
        if (v.id !== "0") {
          this.$refs.treeRight.remove(v);
        }
      });
      this.$nextTick(() => {
        //取消勾选状态的方法需要配合setCheckedKeys使用。直接改变数组数据无法取消勾选状态
        this.$refs.treeRight.setCheckedKeys([], true);
      });
      // console.log("this.assignedData", this.assignedData);
      this.handleAssignedData(this.assignedData);
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
    deleteSelectedField() {
      //TODO 删除当前点击的节点的已选字段功能
      let arr = this.fieldListData.filter((v) => {
        return v.dele_checked === false;
      });
      if (arr === []) return;
      this.fieldListData = arr;
      let dataTemp = _.cloneDeep(this.currendFieldTreeNodeClicked);
      dataTemp.assignedfields = arr;
      this.updateSelectedFieldDataMaptoTreeItem(dataTemp);
    },
    /**
     * Author: zhang fq
     * Date: 2020-05-15
     * Description: 字段权限 获取当前点击的字段树节点
     * Date: 2020-05-20
     * Updata: 点击业务对象节点树时 或取该节点已分配字段（先取映射集，没有再取节点上挂载的）
     */
    fieldTreeNodeClick(data, node, tree) {
      this.fieldListAllChecked = false;

      if (
        data.assignedfields === null ||
        data.assignedfields === undefined ||
        data.assignedfields === ""
      ) {
        data.assignedfields = [];
      }
      this.currendFieldTreeNodeClicked = data;
      // 从存储的映射数据中拿到当前节点的已选字段集
      let dataTemp = this.selectedFieldDataMaptoTreeItem.filter((v) => {
        return v.id === data.id;
      });
      this.fieldListData =
        dataTemp.length === 0
          ? _.cloneDeep(data.assignedfields)
          : dataTemp[0].assignedfields;
      this.fieldListData.forEach((v) => {
        v.dele_checked = false;
      });
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
        let selectedFields = _.cloneDeep(this.fieldCheckedList);
        selectedFields.forEach((v) => {
          v.dele_checked = false;
        });
        this.fieldListData = selectedFields;
        // this.fieldListData = _.cloneDeep(this.fieldCheckedList);
        // 将已选择字段和当前选择的业务对象 terrItem映射并存储 用于切换直接显示 避免多次从后台获取
        let dataTemp = _.cloneDeep(this.currendFieldTreeNodeClicked);
        dataTemp.assignedfields = selectedFields;
        this.updateSelectedFieldDataMaptoTreeItem(dataTemp);
      }
    },
    updateSelectedFieldDataMaptoTreeItem(data) {
      //判断映射数组里是否有该数据  有则替换 无则push
      let flag = true;
      this.selectedFieldDataMaptoTreeItem.forEach((v) => {
        if (v.id === data.id) {
          flag = false;
          v.assignedfields = data.assignedfields;
        }
      });
      if (flag) {
        this.selectedFieldDataMaptoTreeItem.push(data);
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
    saveData() {
      let param = {
        permissionOne: this.assignedData,
      };
      console.log(param);
    },
    handlefieldListAllCheckedChange(val) {
      this.fieldListData.forEach((v) => {
        v.dele_checked = val;
      });
    },
    handlefieldListItemCheckChange(val, item, index) {
      console.log(item, index);
      this.$set(this.fieldListData, index, item);
      // item.dele_checked = val;
      if (val === false) {
        this.fieldListAllChecked = false;
      }
    },
  },
}).$mount("#ccPermissionManagementApp");
