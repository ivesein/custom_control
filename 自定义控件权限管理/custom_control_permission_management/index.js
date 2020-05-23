(function (KDApi, $) {
  function MyComponent(model) {
    this._setModel(model);
  }
  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.ccpermissionControlVue = null;
    },
    init: function (props) {
      console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      // var tData = JSON.parse(props.data)
      console.log("-----update", this.model, props);
      // firstInit(props, this.model)
      // setHtml(this.model, props)
      if (this.model.ccpermissionControlVue && props.data) {
        this.model.ccpermissionControlVue.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.ccpermissionControlVue = null;
    },
  };
  /**
   *@description 第一次打开页面加载相关依赖前端文件
   *
   * @param {*} model 金蝶内建对象model
   */
  var setHtml = function (model, props) {
    KDApi.loadFile("./js/lodash.js", model.schemaId, function () {
      KDApi.loadFile("./css/element.css", model.schemaId, function () {
        KDApi.loadFile("./css/main.css", model.schemaId, function () {
          KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
            KDApi.loadFile("./js/element.js", model.schemaId, function () {
              KDApi.templateFilePath(
                "./html/custom_control_permission_management.html",
                model.schemaId, {
                  path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
                }
              ).then(function (result) {
                model.dom.innerHTML = result;
                model.ccpermissionControlVue = new Vue({
                  delimiters: ["${", "}"],
                  data: {
                    activeName: "first",
                    searchText: "", //搜索字段
                    defaultTreeData: [],
                    assignedData: [],
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
                    alternative_fields: [],
                    fieldCheckedList: [], //已选择的字段列表
                    selectedFieldDataMaptoTreeItem: [], //树节点和已选字段映射
                    initData: null,
                    assArr: [],
                    fieldListAllChecked: false, //已选字段列表全选
                    dataRuleDataMaptoTreeItem: [], // 树节点和已添加数据规则映射
                    dataRuleList: [], //当前点击的数据规则标签页树item已添加的数据规则
                    treeItemDRDefaultData: null,
                    cClickedDRTreeNode: [], // 当前点击的数据规则标签页树item
                    currentOrgItem:null,  //当前拉起组织架构的数据规则item
                    DataRuleLogic:[
                      {
                        label: "或者",
                        value: "or",
                      },
                      {
                        label: "并且",
                        value: "and",
                      }
                    ],
                  },
                  created() {
                    this.handleUpdata(model, props);
                  },
                  computed: {
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-22
                     * Description: 根据当前循环出的已分配数据规则item
                     * 从接口获取的备选数据集中筛选出当前item的条件列表数据
                     */
                    getItemCompareType(item) {
                      return (item) => {
                        let compareType = _.cloneDeep(this.treeItemDRDefaultData);
                        if(compareType){
                          let arr = compareType.filter((v) => {
                            return v.elementid === item.elementid;
                          });
                          if (arr.length > 0) {
                            return arr[0].compareType;
                          } else {
                            return [];
                          }
                        }else{
                          return []
                        }
                      };
                    },
                  },
                  methods: {
                    handleTabClick(val) {
                      console.log(val);
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-18
                     * Description: 后台各接口返回数据对应处理方法
                     * Date: 2020-05-19
                     * Update: 更新接口处理函数 添加获取已分配字段接口处理方法
                     */
                    handleUpdata(model, props) {
                      // 处理后台返回来的数据
                      if (props.data) {
                        if (props.data.method) {
                          switch (props.data.method) {
                            case "init":
                              this.pageInit(props.data);
                              break;
                            case "save":
                              this.saveData();
                              break;
                            case "getFieldsData":
                              this.getFieldsData(props.data);
                              break;
                            case "getDataRule":
                              this.getDataRule(props.data);
                              break;
                            case "getDataRuleDefaultData":
                              this.getDataRuleDefaultData(props.data);
                              break;
                            case "getPerson":
                              this.getPerson(props.data);
                              break;
                            default:
                              this.$message.error("网络错误，请稍后重试...");
                          }
                        }
                      }
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-19
                     * Description: 页面初始化数据处理
                     */
                    handleAssignedData(node) {
                      this.fieldTreeData = _.cloneDeep(node);
                      //TODO
                      this.filterChildrenFields(this.fieldTreeData[0]);
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-19
                     * Description: 过滤掉自定义控件的按钮 形成新的树型数据 同步到 字段权限和数据规则页面
                     */
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
                     * Date: 2020-05-18
                     * Description: 页面初始化数据处理
                     */
                    pageInit(data) {
                      this.initData = data;
                      this.defaultTreeData = data.initBasicPermLeftTreeinfo || [{
                        id: "0",
                        label: "功能权限",
                      }, ];
                      this.assignedData = data.initAssignedPermLeftTreeinfo || [{
                        id: "0",
                        label: "已分配",
                      }, ];
                      this.handleAssignedData(this.assignedData);
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-19
                     * Description: 获取字段列表接口数据处理
                     * Date: 2020-05-20
                     * Update: 修复已选列表没有清空会重复插入的bug 以及 全选按钮一直勾选的bug
                     */
                    getFieldsData(data) {
                      this.alternative_fields = data.data || [];
                      this.fieldCheckedList = [];
                      this.fieldSelectCheckAll = false;
                      // 循环对比设置 已勾选
                      this.alternative_fields.forEach((afv, afk) => {
                        this.fieldListData.forEach((fv) => {
                          if (afv.elementid === fv.elementid) {
                            afv.checked = true;
                            // 注意 添加所勾选项在备选列表数据里的索引 用与从右侧点击删除时同步删除
                            let dataTemp = _.cloneDeep(fv);
                            dataTemp.index = afk;
                            this.fieldCheckedList.push(dataTemp);
                          }
                        });
                      });
                      if (this.alternative_fields.length > 0) {
                        this.fieldSelectCheckAll = this.alternative_fields.every(
                          (v) => {
                            return v.checked;
                          }
                        );
                      }
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-18
                     * Description: 字段权限-- 是否可查看 是否可编辑 滑块处理
                     */

                    isvisibleChange(val, item) {
                      item.isvisible = val ? 1 : 0;
                      let dataTemp = _.cloneDeep(
                        this.currendFieldTreeNodeClicked
                      );
                      dataTemp.assignedfields = _.cloneDeep(this.fieldListData);
                      this.updateSelectedFieldDataMaptoTreeItem(dataTemp);
                    },
                    iseditableChange(val, item) {
                      item.iseditable = val ? 1 : 0;
                      let dataTemp = _.cloneDeep(
                        this.currendFieldTreeNodeClicked
                      );
                      dataTemp.assignedfields = _.cloneDeep(this.fieldListData);
                      this.updateSelectedFieldDataMaptoTreeItem(dataTemp);
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
                            let node = _.cloneDeep(
                              this.$refs.treeLeft.getNode(v).data
                            );
                            delete node.children;
                            console.log(node);
                            this.$refs.treeRight.append(node, "0");
                          } else {
                            let parentKey = v.slice(0, v.length - 2);
                            console.log("parentKey>>>", parentKey);
                            let cNode = _.cloneDeep(
                              this.$refs.treeLeft.getNode(v).data
                            );
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
                          let node = _.cloneDeep(
                            this.$refs.treeLeft.getNode(v).data
                          );
                          this.$refs.treeRight.append(node, "0");
                        } else {
                          //如果该节点key长度不为1 则找到该节点的父节点id 插入到右侧
                          let parentKey = v.slice(0, v.length - 2);
                          let cNode = _.cloneDeep(
                            this.$refs.treeLeft.getNode(v).data
                          );
                          this.$refs.treeRight.append(cNode, parentKey);
                        }
                      });
                      this.handleAssignedData(this.assignedData);
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-13
                     * Description: 权限分配标签页 右侧树结构 选中移除方法
                     * Date: 2020-05-20
                     * Update: 修复已分配全选移除时 会连已分配根节点一起移除从而导致无法再插入的bug
                     */
                    // 移除按钮功能
                    remove() {
                      // 获取选中的要删除的节点id
                      let removeNode = this.$refs.treeRight.getCheckedKeys();
                      console.log(removeNode);
                      // 根据选中的节点id 循环删除每一个选中的节点
                      removeNode.forEach((v) => {
                        if (v !== "0") {
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
                        model.invoke(
                          "getFieldsData",
                          this.currendFieldTreeNodeClicked
                        );
                      }
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-19
                     * Description: 删除勾选的当前点击的节点的已选字段功能
                     */
                    deleteSelectedField() {
                      //TODO 删除当前点击的节点的已选字段功能
                      let arr = this.fieldListData.filter((v) => {
                        return v.dele_checked === false;
                      });
                      if (arr === []) return;
                      this.fieldListData = arr;
                      // 同步映射集数据
                      let data = _.cloneDeep(this.currendFieldTreeNodeClicked);
                      data.assignedfields = arr;
                      this.updateSelectedFieldDataMaptoTreeItem(data);
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-19
                     * Description: 获取当前点击的业务对象的已分配字段接口数据处理
                     */
                    getNodeAssignedFieldsData(data) {
                      if (data.data) {
                        this.fieldListData = data.data || [];
                        this.fieldListData.forEach((v) => {
                          v.dele_checked = false;
                        });
                        //判断映射数组里是否有该数据  有则替换 无则push
                        this.updateSelectedFieldDataMaptoTreeItem(
                          _.cloneDeep(this.fieldListData)
                        );
                      }
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-19
                     * Description: 更新保存时要发送的数据映射集
                     */
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
                     * Description: 字段权限 获取当前点击的字段树节点
                     * Data: 2020-05-19
                     * Update: 通知后台发送该业务对象节点已选的字段
                     * Data: 2020-05-20
                     * Update: 取消这层接口交互 点击业务对象节点树时获取该节点已分配字段（先取映射集，没有再取节点上挂载的）
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
                      let dataTemp = this.selectedFieldDataMaptoTreeItem.filter(
                        (v) => {
                          return v.id === data.id;
                        }
                      );
                      this.fieldListData =
                        dataTemp.length === 0 ?
                        _.cloneDeep(data.assignedfields) :
                        dataTemp[0].assignedfields;
                      this.fieldListData.forEach((v) => {
                        v.dele_checked = false;
                      });
                      // //判断点击的当前节点是否为业务对象节点;
                      // if (data === null) return;
                      // if (data.children && data.children.length > 0) {
                      //   this.fieldListData = [];
                      // } else {
                      //   this.currendFieldTreeNodeClicked = data;
                      //   // 先判断是否已获取过该节点已选字段并存入映射集中
                      //   let dataTemp = this.selectedFieldDataMaptoTreeItem.filter(
                      //     (v) => {
                      //       return v.id === data.id;
                      //     }
                      //   );
                      //   // 从映射数据中匹配 匹配到赋值  匹配不到 调接口
                      //   if (dataTemp.length === 0) {
                      //     // TODO 将节点id发送到后台 获取该业务对象节点已选的字段
                      //     model.invoke(
                      //       "getNodeAssignedFieldsData",
                      //       this.currendFieldTreeNodeClicked
                      //     );
                      //   } else {
                      //     this.fieldListData = dataTemp[0].assignedfields;
                      //   }
                      // }
                    },
                    // 字段选择弹出框 取消按钮功能
                    cancel() {
                      this.ifFieldSelectShow = false;
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-15
                     * Description: 字段选择弹出框 确认按钮功能
                     * Date: 2020-05-19
                     * Update: 根据新的交互逻辑修改 字段选择弹出框确定按钮功能
                     * Date: 2020-05-20
                     * Update: 修改确认时 更新差异化数据映射集
                     */
                    confirm() {
                      if (this.fieldCheckedList.length === 0) {
                        this.$message.error("没有选中行");
                      } else {
                        //将已选择字段集赋值给显示列表
                        let selectedFields = _.cloneDeep(this.fieldCheckedList);
                        selectedFields.forEach((v) => {
                          v.dele_checked = false;
                        });
                        this.fieldListData = selectedFields;
                        let data = _.cloneDeep(
                          this.currendFieldTreeNodeClicked
                        );
                        data.assignedfields = selectedFields;
                        // 更新差异化数据映射集
                        this.updateSelectedFieldDataMaptoTreeItem(data);
                        this.ifFieldSelectShow = false;
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
                     * Date: 2020-05-21
                     * Update: 修复选择字段弹出框 备选列表勾选多次右侧已选显示错误的bug
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
                          if (
                            item.elementid ===
                            this.fieldCheckedList[i].elementid
                          ) {
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
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-23
                     * Description: 完成保存方法 差异化数据封装
                     */
                    saveData() {
                      let param = {
                        functionPermission: this.assignedData,
                        fieldsPermission: this.selectedFieldDataMaptoTreeItem,
                        dataRule: this.dataRuleDataMaptoTreeItem,
                      };
                      console.log(param);
                      model.invoke("save", param);
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-19
                     * Description: 处理字段列表的全选
                     */
                    handlefieldListAllCheckedChange(val) {
                      this.fieldListData.forEach((v) => {
                        v.dele_checked = val;
                      });
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-19
                     * Description: 处理字段列表项的单选
                     */
                    handlefieldListItemCheckChange(val, item, index) {
                      console.log(item, index);
                      // this.$set(this.fieldListData[index], "dele_checked", val);
                      this.$set(this.fieldListData, index, item);
                      if (val === false) {
                        this.fieldListAllChecked = false;
                      }
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-22
                     * Description: 处理数据规则标签页树item点击事件
                     * Date: 2020-05-23
                     * Updata: 修改数据规则树业务对象节点点击事件 添加获取该节点备选数据集交互
                     */
                    dataRuleTreeNodeClick(data, node, tree) {
                      if (
                        data.assigneddatarules === null ||
                        data.assigneddatarules === undefined ||
                        data.assigneddatarules === ""
                      ) {
                        data.assigneddatarules = [];
                      }
                      this.cClickedDRTreeNode = data;
                      // 发送当前自定义控件业务对象节点到后台获取该节点备选数据集
                      if(data.cstlid){
                        model.invoke("getDataRuleDefaultData",data)
                      }
                      // 从存储的映射数据中拿到当前节点已添加的数据规则
                      let dataTemp = this.dataRuleDataMaptoTreeItem.filter((v) => {
                        return v.id === data.id;
                      });
                      this.dataRuleList =
                        dataTemp.length === 0 ?
                        _.cloneDeep(data.assigneddatarules) :
                        dataTemp[0].assigneddatarules;
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-23
                     * Description: 处理获取业务对象节点备选数据集接口数据返回
                     */
                    getDataRuleDefaultData(data){
                      this.treeItemDRDefaultData=data.fieldName||null
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-22
                     * Description: 当前点击的业务对象数据规则列表item删除功能
                     */
                    deleteDataRuleItem(item, index) {
                      this.dataRuleList.splice(index, 1);
                      // TODO 更新数据规则差异化数据映射集
                      let dataTemp = _.cloneDeep(this.cClickedDRTreeNode)
                      dataTemp.assigneddatarules = _.cloneDeep(this.dataRuleList)
                      this.updateDataRuleDataMaptoTreeItem(dataTemp)
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-22
                     * Description: 当前点击的业务对象数据规则列表item添加功能
                     * Date: 2020-05-23
                     * Update: 添加从接口获取备选数据失败处理
                     */
                    addDataRuleTocCTreeNode() {
                      if (this.cClickedDRTreeNode.cstlid) {
                        if(this.treeItemDRDefaultData!==null&&this.treeItemDRDefaultData!==[]){
                          this.dataRuleList.push({
                            elementid: this.treeItemDRDefaultData[0].elementid || "",
                            elementname:this.treeItemDRDefaultData[0].elementname||"",
                            source:this.treeItemDRDefaultData[0].source||"",
                            compareType: this.treeItemDRDefaultData[0].compareType[0].value || "",
                            value: "",
                            logic: "and",
                            valueType: this.treeItemDRDefaultData[0].fieldtype || "text",
                          });
                          // TODO 更新数据规则差异化数据映射集
                          let dataTemp = _.cloneDeep(this.cClickedDRTreeNode)
                          dataTemp.assigneddatarules = _.cloneDeep(this.dataRuleList)
                          this.updateDataRuleDataMaptoTreeItem(dataTemp)
                        }else{
                          this.$message.error("获取数据失败，请稍后重试")
                        }
                      }
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-22
                     * Description: 处理当前点击的业务对象数据规则列表item
                     * 字段名称选择改变时 从备选数据集获取当前字段名映射的值类型并赋给当前item
                     * Date: 2020-05-23
                     * Updata: 在修改的数据中添加后台需要的字段 同步到差异化数据集
                     */
                    handleDRFieldNameChange(val, item, index) {
                      console.log(val);
                      console.log(index);
                      for (let i = 0; i < this.treeItemDRDefaultData.length; i++) {
                        if (val === this.treeItemDRDefaultData[i].elementid) {
                          item.valueType = this.treeItemDRDefaultData[i].fieldtype;
                          item.elementname=this.treeItemDRDefaultData[i].elementname
                          item.source=this.treeItemDRDefaultData[i].source
                          break;
                        }
                      }
                      // TODO 更新数据规则差异化数据映射集
                      let dataTemp = _.cloneDeep(this.cClickedDRTreeNode)
                      dataTemp.assigneddatarules = _.cloneDeep(this.dataRuleList)
                      this.updateDataRuleDataMaptoTreeItem(dataTemp)
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-23
                     * Description: 处理各下拉框和输入框值改变时 同步到差异化数据集以及更改页面显示
                     */
                    handleDRCompareTypeChange(val, item, index) {
                      // TODO 更新数据规则差异化数据映射集
                      let dataTemp = _.cloneDeep(this.cClickedDRTreeNode)
                      dataTemp.assigneddatarules = _.cloneDeep(this.dataRuleList)
                      this.updateDataRuleDataMaptoTreeItem(dataTemp)
                    },
                    handleDRLogicChange(val, item, index) {
                      // TODO 更新数据规则差异化数据映射集
                      let dataTemp = _.cloneDeep(this.cClickedDRTreeNode)
                      dataTemp.assigneddatarules = _.cloneDeep(this.dataRuleList)
                      this.updateDataRuleDataMaptoTreeItem(dataTemp)
                    },
                    handleDRValueChange(val, item, index) {
                      // TODO 更新数据规则差异化数据映射集
                      let dataTemp = _.cloneDeep(this.cClickedDRTreeNode)
                      dataTemp.assigneddatarules = _.cloneDeep(this.dataRuleList)
                      this.updateDataRuleDataMaptoTreeItem(dataTemp)
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-23
                     * Description: 调起组织架构选择人员
                     */
                    dataRuleToOrg(item,index) {
                      this.currentOrgItem=item
                      //TODO 通知后台 调起组织架构 选择人员
                      let dataTemp=_.cloneDeep(this.cClickedDRTreeNode)
                      let param={
                        id:dataTemp.id,
                        cstlid: dataTemp.cstlid,
                        itemIndex:index
                      }
                      model.invoke("getPerson",param)
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-23
                     * Description: 处理调起组织架构选择人员后返回数据
                     */
                    getPerson(data){
                      let dataTemp=data.data||[]
                      // 更新差异化数据映射集
                      this.dataRuleDataMaptoTreeItem.forEach(v=>{
                        if(v.id===dataTemp.id){
                          v.assigneddatarules[dataTemp.itemIndex].value=dataTemp.person
                        }
                      })
                      //回填值 更新页面显示
                      this.currentOrgItem.value=dataTemp.person
                    },
                    // 更新数据规则映射集
                    updateDataRuleDataMaptoTreeItem(data) {
                      //判断映射数组里是否有该数据  有则替换 无则push
                      let flag = true;
                      this.dataRuleDataMaptoTreeItem.forEach((v) => {
                        if (v.id === data.id) {
                          flag = false;
                          v.assigneddatarules = data.assigneddatarules;
                        }
                      });
                      if (flag) {
                        this.dataRuleDataMaptoTreeItem.push(data);
                      }
                    },
                  },
                }).$mount($("#ccPermissionManagementApp", model.dom).get(0));
              });
            });
          });
        });
      });
    });
  };
  // 注册自定义控件
  KDApi.register("ccPermissionManagement", MyComponent);
})(window.KDApi, jQuery);