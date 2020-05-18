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
                model.schemaId,
                {
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
                    dataRuleList: [], //数据规则
                    initData: null,
                    assArr: [],
                  },
                  created() {
                    this.handleUpdata(model, props);
                  },
                  methods: {
                    handleTabClick(val) {
                      console.log(val);
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-18
                     * Description: 后台各接口返回数据对应处理方法
                     */

                    handleUpdata(model, props) {
                      // 处理后台返回来的数据
                      if (props.data) {
                        if (props.data.method) {
                          switch (props.data.method) {
                            case "init":
                              this.pageInit(props.data.data);
                              break;
                            case "save":
                              this.saveData();
                              break;
                            case "getFields":
                              this.getFieldsData(props.data.data);
                              break;
                            case "getDataRule":
                              this.getDataRule(props.data.data);
                              break;
                            default:
                              this.$message.error("网络错误，请稍后重试...");
                          }
                        }
                      }
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-18
                     * Description: 页面初始化数据处理
                     */
                    pageInit(data) {
                      this.initData = data;
                      this.defaultTreeData = data.initBasicPermLeftTreeinfo || [
                        {
                          id: "0",
                          label: "功能权限",
                        },
                      ];
                      this.assignedData = data.initAssignedPermLeftTreeinfo || [
                        {
                          id: "0",
                          label: "已分配",
                        },
                      ];
                    },
                    // 获取字段列表接口数据处理
                    getFieldsData(data) {
                      this.alternative_fields = data || [];
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-18
                     * Description: 字段权限-- 是否可查看 是否可编辑 滑块处理
                     */

                    isvisibleChange(val, item) {
                      item.isvisible = val ? 1 : 0;
                    },
                    iseditableChange(val, item) {
                      item.iseditable = val ? 1 : 0;
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
                      console.log("this.assignedData", this.assignedData);
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
                     * Date: 2020-05-15
                     * Description: 字段权限 获取当前点击的字段树节点
                     */
                    fieldTreeNodeClick(data, node, tree) {
                      this.currendFieldTreeNodeClicked = data;
                      // 从存储的映射数据中拿到当前节点的已选字段集
                      if (this.selectedFieldDataMaptoTreeItem.length === 0) {
                        this.fieldListData = [];
                      } else {
                        let dataTemp = this.selectedFieldDataMaptoTreeItem.filter(
                          (v) => {
                            return v.id === data.id;
                          }
                        );
                        // 从映射数据中取匹配
                        this.fieldListData =
                          dataTemp.length === 0 ? [] : dataTemp[0].listData;
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
                          if (
                            item.field_code ===
                            this.fieldCheckedList[i].field_code
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

                    saveData() {
                      let param = {
                        functionPermission: this.assignedData,
                        fieldsPermission: this.selectedFieldDataMaptoTreeItem,
                        dataRule: [],
                      };
                      console.log(param);
                      model.invoke("save", param);
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
