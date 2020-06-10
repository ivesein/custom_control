// var qualityPlanVue = null

(function (KDApi, $) {
  // 顶层变量声明
  var raCachedData = {};
  // var theData = []
  var raOriginData = [];
  var raChangedIds = [];
  var raPermission = null;
  function MyComponent(model) {
    this._setModel(model);
  }

  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.resourceAllocationVue = null;
    },
    init: function (props) {
      console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      console.log("-----update", this.model, props);
      // if (props.data && props.data.isInit) {
      //   theData = []
      //   raOriginData = []
      //   raChangedIds = []
      //   this.model.resourceAllocationVue = null
      //   setHtml(this.model, props)
      // }
      console.log(this.model.resourceAllocationVue);
      if (this.model.resourceAllocationVue) {
        this.model.resourceAllocationVue.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.resourceAllocationVue = null;
    },
  };
  /**
   *@description 第一次打开页面加载相关依赖前端文件
   *
   * @param {*} model 金蝶内建对象model
   */
  var setHtml = function (model, props) {
    KDApi.loadFile("./css/element.css", model.schemaId, function () {
      KDApi.loadFile("./css/main.css", model.schemaId, function () {
        KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
          KDApi.loadFile("./js/lodash.js", model.schemaId, function () {
            KDApi.loadFile("./js/element.js", model.schemaId, function () {
              KDApi.templateFilePath(
                "./html/resource_allocation.html",
                model.schemaId,
                {
                  path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
                }
              ).then(function (result) {
                model.dom.innerHTML = "";
                model.dom.innerHTML = result;
                model.resourceAllocationVue = new Vue({
                  delimiters: ["${", "}"],
                  data: {
                    tableData: [],
                    allChecked: false,
                    currentSelectedIds: [],
                    tableHeight: 720,
                    project_id: "",
                    funcPerm: [],
                    fieldPerm: [],
                  },
                  created() {
                    this.handleUpdata(model, props);
                  },
                  mounted() {
                    // 固定表格表头 设置表格高度自适应填满剩余高度
                    let _this = this;
                    this.$nextTick(function () {
                      let heightArr = [];
                      let iframeArr = $("iframe");
                      for (let i = 0; i < iframeArr.length; i++) {
                        heightArr.push(iframeArr[i].clientHeight);
                      }
                      let height = Math.max(...heightArr);
                      // let height=$("#iframeap").height()<=0?720:$("#iframeap").height()
                      if (
                        _this.$refs.resourceAllocationTable.$el !== undefined
                      ) {
                        _this.tableHeight =
                          height -
                          _this.$refs.resourceAllocationTable.$el.offsetTop -
                          80;
                      } else {
                        // 处理偶发性初始化加载不出来的bug
                        setHtml(model, props);
                      }

                      // 监听窗口大小变化
                      window.onresize = function () {
                        _this.tableHeight =
                          height -
                          _this.$refs.resourceAllocationTable.$el.offsetTop -
                          80;
                      };
                    });
                  },
                  computed: {
                    /**
                     * Author: zhang fq
                     * Date: 2020-06-10
                     * Description: 质量维护 添加权限功能
                     * 根据后台返回数据处理页面按钮能否点击以及字段是否显示
                     */
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
                     * @author: zhang fq
                     * @date: 2020-06-10
                     * @description: 根据项目id读取相应项目的缓存数据
                     */
                    getCacheData(pId) {
                      if (pId === "") return null;
                      let data = localStorage.getItem("release-" + pId);
                      if (data === null || data === undefined || data === "") {
                        return null;
                      } else {
                        return JSON.parse(data);
                      }
                    },
                    /**
                     * @author: zhang fq
                     * @date: 2020-06-10
                     * @description: 根据项目id更新相应项目的缓存数据
                     */
                    setCacheData(pId, data) {
                      if (pId === "") {
                        this.$message.error(
                          "获取项目id失败，请刷新页面重试..."
                        );
                      } else {
                        localStorage.setItem(
                          "release-" + pId,
                          JSON.stringify(data)
                        );
                      }
                    },
                    /**
                     * @author: zhang fq
                     * @date: 2020-06-04
                     * @description: 处理维护标签页切换后台通知 标签页点击到当前页面时的逻辑
                     */
                    yourTurn() {
                      let _this = this;
                      if (this.project_id === "") {
                        this.$message.error(
                          "获取项目id失败，请刷新页面重试..."
                        );
                        return;
                      }
                      raCachedData = null;
                      let times = 5;
                      let myInterval = setInterval(() => {
                        raCachedData = _this.getCacheData(this.project_id);
                        times--;
                        // 5次后清除轮询
                        if (times === 0 || raCachedData !== null) {
                          clearInterval(myInterval);
                        }
                        if (times === 0 && raCachedData === null) {
                          // 提示用户去进度计划获取数据
                          // _this.loading = false;
                          _this.$message.warning(
                            "获取数据失败，请点击进度计划重新获取！"
                          );
                        }
                        if (raCachedData !== null) {
                          // _this.loading = false;
                          /**
                           * Author: zhang fq
                           * Date: 2020-06-10
                           * Description: 添加切换标签读取缓存权限数据 并处理
                           */

                          raOriginData = _.cloneDeep(raCachedData.data);
                          raOriginData = setAuditTaskUndertaker(raOriginData);
                          if (
                            raCachedData.permission &&
                            raCachedData.permission.resource_allocation
                          ) {
                            raPermission = _.cloneDeep(
                              raCachedData.permission.resource_allocation
                            );
                            _this.funcPerm =
                              raPermission.cstlRoleFuncPerm || [];
                            _this.fieldPerm =
                              raPermission.cstlRoleFieldPerm || [];
                          }
                          _this.tableData = formatToTreeData({
                            arrayList: raOriginData,
                            idStr: "id",
                          });
                        }
                      }, 300);
                    },
                    /**
                     * @author: zhang fq
                     * @date: 2020-06-04
                     * @description: 初始化、页签切换以及各按钮交互接口的数据交互和对应
                     */
                    handleUpdata(model, props) {
                      if (props.data) {
                        // 如果是通知自定义控件执行保存
                        if (props.data.method) {
                          switch (props.data.method) {
                            case "yourTurn":
                              // 处理页签点击到当前页面
                              this.yourTurn();
                              break;
                            case "updateData":
                              this.updataData(
                                raOriginData,
                                this.currentSelectedIds,
                                props.data.data
                              );
                              break;
                            case "init":
                              this.project_id = props.data.projectId;
                              break;
                            default:
                              this.$message.error("网络繁忙，请稍后再试...");
                          }
                        }
                      }
                    },
                    /**
                     * @author: zhang fq
                     * @date: 2020-06-04
                     * @description: 处理按钮点击前后台交互后数据处理以及缓存数据更新
                     * @date: 2020-06-09
                     * @update: 根据质量维护设置的数据 更新进度所属字段owner_id和owner_time的值  方便进度维护计算资源时间
                     */
                    updataData(originData, selectedIds, changeData) {
                      this.allChecked = false;
                      console.log("selectedIds>>>", selectedIds);
                      selectedIds.forEach(function (sv) {
                        // raChangedIds.push(sv) //将编辑过得id保存
                        //将源数据中对应的任务字段更新
                        originData.forEach(function (ov) {
                          if (sv === ov.id) {
                            // 先从源数据中该条任务的owner_id中找到当前的subArray里的owner_id删除掉
                            // 也就是删除掉当前的任务的内部资源id后 把新返回的资源id处理进去
                            ov.subArray.forEach((osub) => {
                              ov.owner_id = ov.owner_id.filter((v) => {
                                return v !== osub.owner_id;
                              });
                            });
                            changeData.forEach(function (cv) {
                              // 根据质量维护设置人员、持续时间、或资源调配接口返回数据
                              // 修改进度计划 owner_id和owner_time字段值
                              cv.subArray.forEach((sub) => {
                                //处理owner_time
                                let obj = {};
                                // 判断 如果有该owner_id为键的值  则直接push进去
                                // 没有则新建值为空数组的该键 把数据push进去
                                if (obj[sub.owner_id] !== undefined) {
                                  obj[sub.owner_id].push({
                                    startTime: sub.res_plan_starttime,
                                    endTime: sub.res_plan_endtime,
                                    assignId: sub.task_assign_id,
                                  });
                                } else {
                                  obj[sub.owner_id] = [];
                                  obj[sub.owner_id].push({
                                    startTime: sub.res_plan_starttime,
                                    endTime: sub.res_plan_endtime,
                                    assignId: sub.task_assign_id,
                                  });
                                }
                                // 更新进度的owner_time字段  有则替换 没则增加
                                for (let key in obj) {
                                  // 将新的资源id push到进度所需的owner_id资源id字段中
                                  ov.owner_id.push(key);
                                  ov.owner_time[key] = obj[key];
                                }
                              });
                              //更新源数据和缓存数据
                              for (var key in cv) {
                                ov[key] = cv[key];
                              }
                            });
                          }
                        });
                      });
                      // 更新缓存
                      raCachedData.data = _.cloneDeep(originData);
                      this.setCacheData(this.project_id, raCachedData);
                      originData = setAuditTaskUndertaker(originData);
                      // 处理页面数据更新
                      this.tableData = formatToTreeData({
                        arrayList: originData,
                        idStr: "id",
                      });
                      // console.log("this.tableData>>>", this.tableData)
                    },
                    pushData() {
                      // if (raChangedIds.length === 0) return
                      let saveData = handleDataAtSave(
                        raOriginData,
                        raChangedIds
                      );
                      let sendData = {
                        data: saveData,
                      };
                      model.invoke("pushQualityData", sendData);
                      raChangedIds = [];
                    },
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
                      // console.log("temp>>>", temp)
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
                    // 在扁平化的树结构数据中递归找到所点击任务的所有父节点id
                    findParentIds(arr, pid) {
                      let pids = [];
                      let currentpid = pid;
                      // console.log(Array.isArray(arr))
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
                            let children = flatdata[j].children
                              ? flatdata[j].children
                              : [];
                            for (
                              let k = 0, klen = children.length;
                              k < klen;
                              k++
                            ) {
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
                      // console.log("arr>>>", arr)
                      return flatdata;
                    },
                    // 获取选择的任务的id
                    getSelectedId() {
                      var that = this;
                      this.currentSelectedIds = [];
                      // let idArr = []
                      let resData = {
                        selected: [],
                        idArr: [],
                      };
                      let tempArr = this.traversalNode(this.tableData[0]);
                      tempArr.forEach(function (v) {
                        if (v.checked) {
                          resData.selected.push(v);
                          if (v.type == "task" && v.task_type !== "4") {
                            that.currentSelectedIds.push(v.id);
                            resData.idArr.push(v);
                          }
                        }
                      });
                      return resData;
                    },
                    resourceAllocationGetSelectedId() {
                      var that = this;
                      this.currentSelectedIds = [];
                      let tempArr = this.traversalNode(this.tableData[0]);
                      let resData = {
                        selected: [],
                        idArr: [],
                      };
                      tempArr.forEach(function (v) {
                        if (v.checked) {
                          resData.selected.push(v);
                          if (v.type === "task") {
                            that.currentSelectedIds.push(v.id);
                            resData.idArr.push(v);
                          }
                        }
                      });
                      return resData;
                    },
                    cellStyle({ row, column, rowIndex, columnIndex }) {
                      return "padding: 0px;line-height:40px;height: 40px";
                    },
                    SetRole() {
                      var _this = this;
                      let ids = this.getSelectedId();
                      let sendData = {
                        data: ids.idArr,
                      };
                      if (ids.selected.length === 0) {
                        this.$message.error("未勾选任务");
                        return;
                      } else if (0 < ids.selected.length <= 2) {
                        if (ids.idArr.length === 0) {
                          this.$message.error("您勾选任务无法设置角色");
                          return;
                        } else if (ids.idArr.length === 1) {
                          if (ids.idArr[0].delegate === "1") {
                            this.$message.error("已委外的任务无法设置角色");
                          } else {
                            if (
                              ids.idArr[0].isPubTask ||
                              ids.idArr[0].isBaseTask
                            ) {
                              this.$message.error("只有新增的任务可以设置角色");
                              return;
                            } else {
                              raChangedIds = raChangedIds.concat(
                                this.currentSelectedIds
                              );
                              model.invoke("setQualityPlanRole", sendData);
                            }
                          }
                        } else {
                          this.$message.error("设置任务角色不能多选");
                          return;
                        }
                      } else {
                        this.$message.error("设置任务角色不能多选");
                        return;
                      }
                    },
                    getTask(tasks, selectedIds) {
                      let task = [];
                      if (selectedIds.length > 0) {
                        selectedIds.forEach(function (sv) {
                          tasks.forEach(function (tv) {
                            if (sv === tv.id) task.push(tv);
                          });
                        });
                      }
                      return task;
                    },
                    SetDurationTime() {
                      let ids = this.getSelectedId();
                      let sendData = {
                        data: ids.idArr,
                      };
                      if (ids.selected.length === 0) {
                        this.$message.error("未勾选任务");
                        return;
                      } else if (0 < ids.selected.length <= 2) {
                        if (ids.idArr.length === 0) {
                          this.$message.error("您勾选任务无法设置任务持续时间");
                          return;
                        } else if (ids.idArr.length === 1) {
                          if (ids.idArr[0].task_type !== "3") {
                            this.$message.error(
                              "只有复核任务可以设置任务持续时间"
                            );
                            return;
                          }
                          /**
                           * @author: zhang fq
                           * @date: 2020-06-08
                           * @description: 修改资源调配 设置持续时间 修改判断新增任务的逻辑
                           */
                          if (ids.idArr[0].delegate === "1") {
                            this.$message.error("已委外的任务无法设置持续时间");
                          } else {
                            if (
                              ids.idArr[0].isPubTask ||
                              ids.idArr[0].isBaseTask
                            ) {
                              this.$message.error(
                                "只有新增的复核任务可以设置任务持续时间"
                              );
                              return;
                            } else {
                              raChangedIds = raChangedIds.concat(
                                this.currentSelectedIds
                              );
                              model.invoke("SetDurationTime", sendData);
                            }
                          }
                        } else {
                          this.$message.error("设置任务持续时间不能多选");
                          return;
                        }
                      } else {
                        this.$message.error("设置任务持续时间不能多选");
                        return;
                      }
                    },
                    /**
                     * @author: zhang fq
                     * @date: 2020-06-08
                     * @description: 修改资源调配 筛选符合条件的任务
                     */
                    goAllocation() {
                      // 资源调配
                      var _this = this;
                      let ids = this.resourceAllocationGetSelectedId();
                      let sendData = {
                        data: ids.idArr,
                      };
                      if (ids.selected.length === 0) {
                        this.$message.error("未勾选任务");
                        return;
                      } else if (0 < ids.selected.length <= 2) {
                        if (ids.idArr.length === 0) {
                          this.$message.error("您勾选任务无法进行资源调配");
                          return;
                        } else if (ids.idArr.length === 1) {
                          if (ids.idArr[0].delegate === "1") {
                            this.$message.error("已委外的任务无法进行资源调配");
                          } else {
                            if (
                              ids.idArr[0].isPubTask ||
                              ids.idArr[0].isBaseTask
                            ) {
                              raChangedIds = raChangedIds.concat(
                                this.currentSelectedIds
                              );
                              model.invoke("resourceAllocation", sendData);
                            } else {
                              this.$message.error("新增的任务不能进行资源调配");
                              return;
                            }
                          }
                        } else {
                          this.$message.error("资源调配不能多选");
                          return;
                        }
                      } else {
                        this.$message.error("资源调配不能多选");
                        return;
                      }
                    },
                    tableRowClassName({ row, rowIndex }) {
                      if (row.delegate === "1") {
                        return "delegate-row";
                      }
                      return "";
                    },
                  },
                }).$mount($("#resourceAllocationApp", model.dom).get(0));
              });
            });
          });
        });
      });
    });
  };

  // 将源数据格式化为表格树形结构数据
  function formatToTreeData({
    arrayList,
    pidStr = "parent",
    idStr = "id",
    childrenStr = "children",
  }) {
    if (arrayList === [] || arrayList === undefined || arrayList === null)
      return;
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
        // 如果没有父级children字段，就创建一个children字段
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
  // 排序
  function compare(prop) {
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
  }
  // 处理要保存的数据
  function handleDataAtSave(data, ids) {
    // console.log("进参 data>>>", data)
    // console.log("进参 ids>>>", ids)
    var idArr = _.uniq(ids);
    // console.log("去重后的 idArr>>>", idArr)
    var result = [];
    idArr.forEach(function (iv) {
      data.forEach(function (dv) {
        if (iv == dv.id) {
          result.push(dv);
        }
      });
    });
    // console.log("有改变的 result>>>", result)
    return result;
  }
  // 处理复核任务 整改-修改 承担人和承担人名称
  function setAuditTaskUndertaker(originData) {
    if (originData.length === 0) return;
    originData.forEach(function (fuck) {
      if (fuck.task_type === "3") {
        originData.forEach(function (shit) {
          if (fuck.parent === shit.parent && shit.task_type !== "3") {
            fuck.subArray[0].the_isreply = shit.subArray[0].isreply;
            fuck.subArray[0].the_owner = shit.subArray[0].owner;
            fuck.subArray[0].the_owner_role = shit.subArray[0].owner_role;
            fuck.subArray[0].the_skill = shit.subArray[0].skill;
          }
        });
      }
    });
    return originData;
  }
  // 注册自定义控件
  KDApi.register("resource_allocation", MyComponent);
})(window.KDApi, jQuery);
