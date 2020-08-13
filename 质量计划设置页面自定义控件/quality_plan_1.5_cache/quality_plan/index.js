// var qualityPlanVue = null

(function (KDApi, $) {
  // 顶层变量声明
  var qpCachedData = {};
  var qpOriginData = [];
  var qpChangedIds = [];
  var qpPermission = null;
  function MyComponent(model) {
    this._setModel(model);
  }

  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.qualityPlanVue = null;
    },
    init: function (props) {
      // console.log("init---", this.model, props);
      // setHtml(this.model, props)
    },
    update: function (props) {
      // console.log("-----update", this.model, props);
      if (this.model.qualityPlanVue) {
        this.model.qualityPlanVue.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      // console.log("-----destoryed", this.model);
      this.model.qualityPlanVue = null;
    },
  };
  /**
   *@description 第一次打开页面加载相关依赖前端文件
   *
   * @param {*} model 金蝶内建对象model
   */
  var setHtml = function (model, props) {
    KDApi.loadFile("./css/table.css", model.schemaId, function () {
      KDApi.loadFile("./css/main.css", model.schemaId, function () {
        KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
          KDApi.loadFile("./js/table.js", model.schemaId, function () {
            KDApi.loadFile("./js/lodash.js", model.schemaId, function () {
              // KDApi.loadFile("./js/element.js", model.schemaId, function () {
              KDApi.templateFilePath(
                "./html/quality_plan.html",
                model.schemaId,
                {
                  path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
                }
              ).then(function (result) {
                model.dom.innerHTML = "";
                model.dom.innerHTML = result;
                model.qualityPlanVue = new Vue({
                  delimiters: ["${", "}"],
                  data: {
                    tableData: [],
                    allChecked: false,
                    currentSelectedIds: [],
                    tableHeight: 720,
                    funcPerm: [],
                    fieldPerm: [],
                    loading: true,
                    loading_text: "数据加载中...",
                    loading_icon: "el-icon-loading",
                    project_id: "",
                    pageStatus: false, //是否提交
                    top: 0,
                    currentRow: null, // 当前点击选取的行数据
                    taskChangedIndex: [], // 记录修改过的任务在缓存数据中的索引
                  },
                  created() {
                    this.handleUpdata(model, props);
                  },
                  mounted() {
                    let self = this;
                    // 固定表格表头 设置表格高度自适应填满剩余高度
                    this.$nextTick(function () {
                      let heightArr = [];
                      let iframeArr = $("iframe");
                      for (let i = 0; i < iframeArr.length; i++) {
                        heightArr.push(iframeArr[i].clientHeight);
                      }
                      let height = Math.max(...heightArr);
                      // let height=$("#iframeap").height()<=0?720:$("#iframeap").height()
                      if (self.$refs.thequalityPlanTable.$el !== undefined) {
                        self.tableHeight =
                          height -
                          self.$refs.thequalityPlanTable.$el.offsetTop -
                          80;
                      } else {
                        // 处理偶发性初始化加载不出来的bug
                        setHtml(model, props);
                      }
                      // 监听窗口大小变化
                      window.onresize = function () {
                        self.tableHeight =
                          height -
                          self.$refs.qualityPlanTable.$el.offsetTop -
                          80;
                      };
                    });
                  },
                  /**
                   * @author: zhang fq
                   * @date: 2020-05-21
                   * @description: 获取权限数据 为按钮和字段设置权限
                   * @date: 2020-06-06
                   * @update: 处理根据提交后页面状态 动态计算按钮是否显示的方法在金蝶不管用的问题
                   */
                  computed: {
                    getBtnShow(btnId, pageStatus) {
                      var _this = this;
                      return function (btnId, pageStatus) {
                        //判断页面是否为提交状态 提交状态所有按钮不可点击
                        if (pageStatus === "true" || pageStatus === true) {
                          return true;
                        } else {
                          let arr = _this.funcPerm.filter((v) => {
                            return v.elementid === btnId;
                          });
                          return arr.length > 0 ? false : true;
                        }
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
                      console.log(row);
                      this.currentRow = row;
                    },
                    tableRowClassName({ row, rowIndex }) {
                      if (row.delegate === "1") {
                        return "delegate-row";
                      }
                      return "";
                    },
                    getCacheData(pId) {
                      if (pId === "") return null;
                      let data = localStorage.getItem("plan-" + pId);
                      if (data === null || data === undefined || data === "") {
                        return null;
                      } else {
                        return JSON.parse(data);
                      }
                    },
                    setCacheData(pId, data) {
                      if (pId === "") {
                        this.$message.error(
                          "获取项目id失败，请刷新页面重试..."
                        );
                      } else {
                        localStorage.setItem(
                          "plan-" + pId,
                          JSON.stringify(data)
                        );
                      }
                    },
                    handleUpdata(model, props) {
                      if (props.data) {
                        if (props.data.method) {
                          switch (props.data.method) {
                            case "yourTurn":
                              // 处理页签点击到当前页面
                              this.yourTurn();
                              break;
                            case "setQualityPlanRole":
                              this.updateSetRole(
                                qpOriginData,
                                this.currentSelectedIds,
                                props.data
                              );
                              break;
                            case "setQualityPlanDuration":
                              this.updateSetDuration(
                                qpOriginData,
                                this.currentSelectedIds,
                                props.data
                              );
                              break;
                            case "updataData":
                              this.updataData(
                                qpOriginData,
                                this.currentSelectedIds,
                                props.data.data
                              );
                              break;
                            case "init":
                              this.project_id = props.data.projectId;
                              break;
                            case "saveSuccess":
                              this.yourTurn();
                              break;
                            case "ifSubmit":
                              this.pageStatus = props.data.pageStatus;
                              this.yourTurn();
                              break;
                            default:
                              break;
                          }
                        }
                      }
                    },
                    /**
                     * @author: zhang fq
                     * @date: 2020-05-26
                     * @description: 处理后台通知 标签页点击到当前页面时的逻辑
                     * @date: 2020-05-27
                     * @update: 修改测试出的问题 重写页签切换 缓存读取逻辑 优化轮询
                     * @date: 2020-08-13
                     * @update: 根据讨论的方案修改切换到当前页前的缓存数据读取逻辑 添加是否有更新判断 避免重复读取
                     */
                    yourTurn() {
                      let _this = this;
                      // this.loading = true;
                      // this.loading_text = "数据加载中...";
                      // this.loading_icon = "el-icon-loading";
                      // this.tableData = [];
                      if (this.project_id === "") {
                        this.$message.error(
                          "获取项目id失败，请刷新页面重试..."
                        );
                        return;
                      }
                      qpCachedData = null;
                      let times = 5;
                      let myInterval = setInterval(() => {
                        qpCachedData = _this.getCacheData(this.project_id);
                        times--;
                        // 5次后清除轮询
                        if (times === 0 || qpCachedData !== null) {
                          clearInterval(myInterval);
                        }
                        if (times === 0 && qpCachedData === null) {
                          // 提示用户去进度计划获取数据
                          // _this.loading = false;
                          _this.$message.warning(
                            "获取数据失败，请点击进度计划重新获取！"
                          );
                        }
                        if (qpCachedData !== null) {
                          // 读取缓存中的 数据修改标志位 判断是否有数据更新
                          // 有则读缓存 处理树形数据 修改标志位保存
                          if (qpCachedData.readCache.zl === true) {
                            // _this.loading = false;
                            qpOriginData = _.cloneDeep(qpCachedData.data);
                            qpOriginData = setAuditTaskUndertaker(qpOriginData);
                            if (
                              qpCachedData.permission &&
                              qpCachedData.permission.quality_plan
                            ) {
                              qpPermission = _.cloneDeep(
                                qpCachedData.permission.quality_plan
                              );
                              _this.funcPerm =
                                qpPermission.cstlRoleFuncPerm || [];
                              _this.fieldPerm =
                                qpPermission.cstlRoleFieldPerm || [];
                            }
                            _this.pageStatus = qpCachedData.pageStatus;
                            _this.$refs.qualityPlanTable.reloadData(
                              formatToTreeData({
                                arrayList: qpOriginData,
                                idStr: "id",
                              })
                            );
                            // 设置标志位  更新缓存  下次切刀当前页读取缓存时判断是否需要重新加载数据
                            _this.setReadCache(
                              false,
                              qpCachedData.readCache,
                              "zl"
                            );
                            _this.setCacheData(_this.project_id, qpCachedData);
                          } else {
                            console.log("数据没有更新，无需读取");
                          }
                        }
                      }, 300);
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-08-13
                     * @Description: 修改是否读取缓存标志位  同步修改其它页面的标志位
                     * 如果自己页面有修改  bool传true  将自己的标致置false 其它标致都置true
                     * 如果自己页面没有修改 bool传false 将自己的标致置false 其它标致不变
                     */
                    setReadCache(bool, readCache, cKey = "zl") {
                      if (bool) {
                        for (let key in readCache) {
                          if (key !== cKey) {
                            readCache[key] = true;
                          }
                        }
                        readCache[cKey] = false;
                      } else {
                        readCache[cKey] = false;
                      }
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-06-19
                     * @Description: 配合严孝翔修改质量计划设置角色新增角色接口数据处理
                     */
                    updateSetRole(originData, selectedIds, changeData) {
                      if (
                        changeData.data === null &&
                        changeData.setRole === null &&
                        changeData.setPerson === null
                      ) {
                        return;
                      }
                      this.allChecked = false;
                      // 处理setRole
                      if (changeData.setRole) {
                        originData.forEach((ov) => {
                          if (changeData.setRole.qp_task_id === ov.id) {
                            ov.qp_owner_roleid =
                              changeData.setRole.qp_owner_roleid;
                            ov.qp_owner_role = changeData.setRole.qp_owner_role;
                          }
                        });
                      }
                      // 处理setPerson
                      if (changeData.setPerson) {
                        changeData.setPerson.forEach((cv) => {
                          originData.forEach((ov) => {
                            if (cv.qp_owner_roleid === ov.qp_owner_roleid) {
                              ov.qp_owner_role = cv.qp_owner_role;
                              ov.skill = cv.skill;
                              ov.skill_id = cv.skill_id;
                              ov.qp_owner = cv.qp_owner;
                              ov.qp_owner_id = cv.qp_owner_id;
                            }
                          });
                        });
                      }
                      // 处理data
                      if (changeData.data) {
                        selectedIds.forEach(function (sv) {
                          // qpChangedIds.push(sv) //将编辑过得id保存
                          //将源数据中对应的任务字段更新
                          originData.forEach(function (ov) {
                            if (sv === ov.id) {
                              changeData.data.forEach(function (cv) {
                                //如果是设置人员角色按钮接口返回的数据
                                if (cv.id) {
                                  // 判断owner_id里是否有当前人员的id
                                  let owner_index = null;
                                  for (let i = 0; i < ov.owner_id.length; i++) {
                                    if (ov.owner_id[i] === ov.qp_owner_id) {
                                      owner_index = i;
                                      break;
                                    }
                                  }
                                  // 有则替换 无则push
                                  if (owner_index !== null) {
                                    ov.owner_id[owner_index] = cv.qp_owner_id;
                                  } else {
                                    ov.owner_id.push(cv.qp_owner_id);
                                  }
                                }
                                if (ov.task_type === cv.task_type) {
                                  for (var key in cv) {
                                    ov[key] = cv[key];
                                  }
                                }
                              });
                            }
                          });
                        });
                      }
                      originData = setAuditTaskUndertaker(originData);
                      // 处理页面数据更新
                      this.$refs.qualityPlanTable.reloadData(
                        formatToTreeData({
                          arrayList: originData,
                          idStr: "id",
                        })
                      );
                      // 更新缓存
                      qpCachedData.data = _.cloneDeep(originData);
                      // 数据有修改 更新是否读取缓存标志位 通知其它页签重新读取缓存
                      this.setReadCache(true, qpCachedData.readCache, "zl");
                      this.setCacheData(this.project_id, qpCachedData);
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-06-19
                     * @Description: 配合严孝翔修改质量计划设置设置持续时间接口数据处理
                     * @Date: 2020-08-13
                     * @Update: 优化设置持续时间成功后数据返回处理 减少循环
                     * 直接用索引index找到原数据进行更新
                     */
                    updateSetDuration(originData, changeData) {
                      for (let key in changeData.data[0]) {
                        originData[this.currentRow.indexR][key] =
                          changeData.data[0][key];
                        // 更新当前选中行的数据 数据回填
                        this.currentRow[key] = changeData.data[0][key];
                      }
                      originData = setAuditTaskUndertaker(originData);
                      // 处理页面数据更新
                      // this.$refs.qualityPlanTable.reloadData(
                      //   formatToTreeData({
                      //     arrayList: originData,
                      //     idStr: "id",
                      //   })
                      // );
                      // 更新缓存
                      qpCachedData.data = _.cloneDeep(originData);
                      // 数据有修改 更新是否读取缓存标志位 通知其它页签重新读取缓存
                      this.setReadCache(true, qpCachedData.readCache, "zl");
                      this.setCacheData(this.project_id, qpCachedData);
                    },
                    // updataData(originData, selectedIds, changeData) {
                    //   this.allChecked = false;
                    //   // console.log("selectedIds>>>", selectedIds);
                    //   selectedIds.forEach(function (sv) {
                    //     // qpChangedIds.push(sv) //将编辑过得id保存
                    //     //将源数据中对应的任务字段更新
                    //     originData.forEach(function (ov) {
                    //       if (sv === ov.id) {
                    //         changeData.forEach(function (cv) {
                    //           //如果是设置人员角色按钮接口返回的数据
                    //           if (cv.id) {
                    //             // 判断owner_id里是否有当前人员的id
                    //             let owner_index = null;
                    //             for (let i = 0; i < ov.owner_id.length; i++) {
                    //               if (ov.owner_id[i] === ov.qp_owner_id) {
                    //                 owner_index = i;
                    //                 break;
                    //               }
                    //             }
                    //             // 有则替换 无则push
                    //             if (owner_index !== null) {
                    //               ov.owner_id[owner_index] = cv.qp_owner_id;
                    //             } else {
                    //               ov.owner_id.push(cv.qp_owner_id);
                    //             }
                    //           }
                    //           if (ov.task_type === cv.task_type) {
                    //             for (var key in cv) {
                    //               ov[key] = cv[key];
                    //             }
                    //           }
                    //         });
                    //       }
                    //     });
                    //   });
                    //   originData = setAuditTaskUndertaker(originData);
                    //   // 处理页面数据更新
                    //   this.tableData = formatToTreeData({
                    //     arrayList: originData,
                    //     idStr: "id",
                    //   });
                    //   // 更新缓存
                    //   qpCachedData.data = _.cloneDeep(originData);
                    //   this.setCacheData(this.project_id, qpCachedData);
                    // },
                    // handleCheckAllChange(val) {
                    //   this.traversalNode(this.tableData[0], this.allChecked);
                    // },
                    // itemChange(row) {
                    //   let check = row.checked;
                    //   let temp = this.traversalNode(row, check);
                    //   let tempTableData = _.cloneDeep(this.tableData[0]);
                    //   let flatData = this.traversalNode(tempTableData);
                    //   // 获取该节点所在所有父节点
                    //   let parentIds = this.findParentIds(flatData, row.parent);
                    //   // console.log("temp>>>", temp)
                    //   if (check) {
                    //     // 如果点击是置true 递归查找所有父节点下的子节点
                    //     // 如果子节点都为true 置该父节点为ture
                    //     // 如果子节点有一个为false  置该父节点以及该父节点的所有父节点为false
                    //     let res = this.helloKids(flatData, parentIds)[0];
                    //     this.tableData = [res];
                    //   } else {
                    //     // 如果点击是置false 直接将该节点的所有父节点置为false
                    //     this.findYouAndSetFalse(this.tableData[0], parentIds);
                    //     this.allChecked = false;
                    //   }
                    // },
                    // // 树形结构数据扁平化处理  如果需要可以设置该节点以及子节点checked
                    // traversalNode(node, bool) {
                    //   let nodes = [];
                    //   if (node) {
                    //     if (bool !== undefined) node.checked = bool;
                    //     let stack = [];
                    //     stack.push(node);
                    //     while (stack.length != 0) {
                    //       let item = stack.shift();
                    //       nodes.push(item);
                    //       let children = item.children ? item.children : [];
                    //       children.forEach(function (v) {
                    //         if (bool !== undefined) v.checked = bool;
                    //         stack.push(v);
                    //       });
                    //     }
                    //   }
                    //   return nodes;
                    // },
                    // // 递归找到所有父节点设为false
                    // findYouAndSetFalse(node, pids) {
                    //   var that = this;
                    //   if (pids.includes(node.id)) {
                    //     node.checked = false;
                    //   }
                    //   let children = node.children ? node.children : [];
                    //   children.forEach(function (v) {
                    //     that.findYouAndSetFalse(v, pids);
                    //   });
                    // },
                    // // 在扁平化的树结构数据中递归找到所点击任务的所有父节点task_id
                    // findParentIds(arr, pid) {
                    //   let pids = [];
                    //   let currentpid = pid;
                    //   // console.log(Array.isArray(arr))
                    //   if (Array.isArray(arr) && arr.length > 0) {
                    //     while (currentpid != 0) {
                    //       arr.forEach(function (v) {
                    //         if (v.id == currentpid) {
                    //           pids.push(v.id);
                    //           currentpid = v.parent;
                    //         }
                    //       });
                    //     }
                    //   }
                    //   return pids;
                    // },
                    // // flatdata 为表格绑定的整个数据的扁平化数据  pids为包含所点击节点的所有父节点数组
                    // // 在整个扁平化数据中循环查找每个父节点下的子节点 判断
                    // // 若果有一个子节点为false 置所有父节点为false
                    // // 如果循环到当前父节点下的所有子节点都为true  置该父节点为true 继续找该父节点的父节点 重复该步骤
                    // helloKids(flatdata, pids) {
                    //   let _that = this;
                    //   let arr = [];
                    //   // 如果pids为空 表示点击的节点为根节点没有父节点 直接置为true
                    //   if (pids.length == 0) {
                    //     this.allChecked = true;
                    //     return flatdata;
                    //   }
                    //   for (let i = 0, len = pids.length; i < len; i++) {
                    //     for (let j = 0, jlen = flatdata.length; j < jlen; j++) {
                    //       if (pids[i] == flatdata[j].id) {
                    //         let bool = flatdata[j].checked;
                    //         let children = flatdata[j].children
                    //           ? flatdata[j].children
                    //           : [];
                    //         for (
                    //           let k = 0, klen = children.length;
                    //           k < klen;
                    //           k++
                    //         ) {
                    //           if (!children[k].checked) {
                    //             bool = false;
                    //             _that.allChecked = false;
                    //             break;
                    //           } else {
                    //             bool = true;
                    //           }
                    //         }
                    //         flatdata[j].checked = bool;
                    //         if (bool) {
                    //           _that.allChecked = true;
                    //         }
                    //       }
                    //     }
                    //   }
                    //   // console.log("arr>>>", arr)
                    //   return flatdata;
                    // },
                    // // 获取选择的任务的task_id
                    // getSelectedId() {
                    //   var that = this;
                    //   this.currentSelectedIds = [];
                    //   let resData = {
                    //     selected: [],
                    //     idArr: [],
                    //   };
                    //   // let idArr = []
                    //   let tempArr = this.traversalNode(this.tableData[0]);
                    //   tempArr.forEach(function (v) {
                    //     if (v.checked && v.type !== "project") {
                    //       resData.selected.push(v);
                    //       if (v.type == "task" && v.task_type !== "4") {
                    //         that.currentSelectedIds.push(v.id);
                    //         resData.idArr.push(v);
                    //         // resData.idArr.push({
                    //         //   project_id: v.project_id,
                    //         //   plan_id: v.plan_id,skill
                    //         //   id: v.id,
                    //         //   text: v.text,
                    //         //   task_type: v.task_type,
                    //         //   duration: v.duration,
                    //         //   task_assign_id:v.task_assign_id,
                    //         //   skill:v.skill,
                    //         //   skill_id:v.skill_id
                    //         // })
                    //       }
                    //     }
                    //     // if (v.checked && v.type == "task" && v.task_type !== "4") {
                    //     //   that.currentSelectedIds.push(v.id)
                    //     //   idArr.push({
                    //     //     project_id: v.project_id,
                    //     //     plan_id: v.plan_id,
                    //     //     id: v.id,
                    //     //     text: v.text,
                    //     //     task_type: v.task_type,
                    //     //     duration: v.duration
                    //     //   })
                    //     // }
                    //   });
                    //   return resData;
                    // },
                    cellStyle({ row, column, rowIndex, columnIndex }) {
                      return "padding: 0px;line-height:40px;height: 40px";
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-27
                     * Description: bug转需求 设置角色判断 已委外的任务无法设置角色
                     * Date：2020-08-13
                     * Update：优化表格数据处理 修改选取任务进行设置角色和设置持续时间的处理，
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
                          model.invoke("setQualityPlanRole", this.currentRow);
                        } else {
                          this.$message.error("该类型的任务无法设置角色");
                          return;
                        }
                      } else {
                        this.$message.error("摘要任务无法设置角色");
                        return;
                      }
                    },
                    /**
                     * Author: zhang fq
                     * Date: 2020-05-28
                     * Description: bug转需求 设置持续时间判断 已委外的任务无法设置持续时间
                     */
                    SetDurationTime() {
                      if (this.currentRow === null) {
                        this.$message.warning("请单击选择一条任务进行设置");
                        return;
                      }
                      if (this.currentRow.type !== "project") {
                        if (this.currentRow.delegate === 1) {
                          this.$message.error("已委外的任务无法设置持续时间");
                          return;
                        }
                        if (
                          this.currentRow.type == "task" &&
                          this.currentRow.task_type === "3"
                        ) {
                          // TODO:处理交互
                          model.invoke("SetDurationTime", this.currentRow);
                        } else {
                          this.$message.error("该类型的任务无法设置持续时间");
                          return;
                        }
                      } else {
                        this.$message.error("摘要任务无法设置持续时间");
                        return;
                      }
                    },
                  },
                }).$mount($("#qualityPlanApp", model.dom).get(0));
              });
              // });
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
    let templist = _.cloneDeep(arrayList);
    let listObj = {}; // 用来储存{key: obj}格式的对象
    let treeList = []; // 用来储存最终树形结构数据的数组
    // 将数据变换成{key: obj}格式，方便下面处理数据
    for (let i = 0; i < templist.length; i++) {
      templist[i].indexR = i;
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
  // // 添加排序字段
  // function addSortNum(data) {
  //   if (data.length <= 1) {
  //     return data
  //   } else {
  //     // data.forEach(function(fuck) {
  //     //   fuck.sortNum = fuck.wbs.split(".").join("")
  //     //   for (let i = fuck.sortNum.length; i < 4; i++) {
  //     //     fuck.sortNum += "0"
  //     //   }
  //     // })
  //     data.sort(compare('position'))
  //     return data
  //   }
  // }
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
    return result;
  }
  // 处理复核任务 整改-修改 承担人和承担人名称
  function setAuditTaskUndertaker(qpOriginData) {
    if (qpOriginData && qpOriginData.length !== 0) {
      qpOriginData.forEach(function (fuck) {
        if (fuck.task_type === "3") {
          qpOriginData.forEach(function (shit) {
            if (fuck.parent === shit.parent && shit.task_type !== "3") {
              fuck.the_owner = shit.qp_owner;
              fuck.the_isreply = shit.isreply;
              fuck.the_owner_role = shit.qp_owner_role;
              fuck.the_skill = shit.skill;
            }
          });
        }
      });
      return qpOriginData;
    } else {
      return [];
    }
  }
  // 注册自定义控件
  KDApi.register("quality_plan", MyComponent);
})(window.KDApi, jQuery);
