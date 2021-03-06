(function (KDApi, $) {
  function MyComponent(model) {
    this._setModel(model);
  }

  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.costCAVue = null;
    },
    init: function (props) {
      console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      console.log("-----update", this.model, props);
      console.log(this.model.costCAVue);
      if (this.model.costCAVue) {
        this.model.costCAVue.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.costCAVue = null;
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
                "./html/cost_contrast_analysis.html",
                model.schemaId,
                {
                  path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
                }
              ).then(function (result) {
                model.dom.innerHTML = "";
                model.dom.innerHTML = result;

                model.costCAVue = new Vue({
                  delimiters: ["${", "}"],
                  data: {
                    ifSelectBoxShow: false,
                    proTableData: [],
                    beforeTaskInfo: {
                      open: true,
                      title: "紧前任务对当前任务影响情况",
                      data: [],
                    },
                    currentTaskInfo: {
                      title: "当前任务情况",
                      open: true,
                      data: [],
                    },
                    earnedValueAnalysisSuggestions: {
                      title: "挣值分析及建议",
                      open: true,
                      data: [],
                    },
                    followTaskProcessing: {
                      title: "后续任务处理",
                      open: true,
                      data: [],
                    },
                    tableWidth: "100%",
                    messageBoxShow: true,
                    currentTask: null,
                    filterCondition: {
                      conditionOne: 1, //显示选项  1 全部  2 仅显示差异
                      conditionTwo: 1, //时间范围  1 全部  2 范围  时间为timeRange值 ["2020-03-01","2020-03-15"]
                    },
                    ifFollowTaskShow: false, //是否显示后续任务处理表
                    taskReportDetailData: [],
                    currentClickedTask: null,
                    followTaskListTableData: [],
                    multipleSelection: [],
                    followTaskListShow: false,
                  },
                  created() {
                    this.handleUpdata(model, props);
                  },
                  mounted() {
                    let self = this;
                    this.$nextTick(function () {
                      self.tableWidth =
                        self.$refs.projectTable.$el.clientWidth + "px";
                      console.log(self.tableWidth);
                      // 监听窗口大小变化
                      window.onresize = function () {
                        self.tableWidth =
                          self.$refs.projectTable.$el.clientWidth - 1 + "px";
                      };
                    });
                  },
                  methods: {
                    handleUpdata(model, props) {
                      if (props.data !== undefined) {
                        switch (props.data.method) {
                          case "getFilterData":
                          case "init":
                            //初始化获取左侧任务列表数据 判断是否为空 为空显示提示弹框
                            this.proTableData = props.data.data;
                            if (this.proTableData.length === 0) {
                              this.messageBoxShow = true;
                            } else {
                              this.proTableData.forEach((v, k) => {
                                v.index = k;
                                v.feched = false;
                              });
                              this.messageBoxShow = false;
                              // 将右侧各个表格数据置空
                              this.beforeTaskInfo.data = [];
                              this.currentTaskInfo.data = [];
                              this.earnedValueAnalysisSuggestions.data = [];
                              this.followTaskProcessing.data = [];
                            }
                            break;
                          case "syncToCostMaintenance":
                            this.syncCostMaintenance();
                            break;
                          case "filterBtnClicked":
                            this.showSelectBox();
                            break;
                          case "getClickedTaskDetailData":
                            //获取当前点击的任务的右侧相关详细信息
                            this.beforeTaskInfo.data =
                              props.data.data.beforeTaskInfo; //前置任务信息
                            this.currentTaskInfo.data =
                              props.data.data.currentTaskInfo; //当前任务信息
                            this.earnedValueAnalysisSuggestions.data =
                              props.data.data.earnedValueAnalysisSuggestions; //挣值分析数据
                            if (this.currentClickedTask.task_status === "200") {
                              this.ifFollowTaskShow = true;
                              if (this.currentClickedTask.feched === false) {
                                // 如果该任务没有点击获取过数据  将获取的后续任务挂载到该任务上
                                this.followTaskProcessing.data =
                                  props.data.data.followTaskInfo;
                                this.followTaskProcessing.data.forEach((v) => {
                                  v.erasable = false; // 默认获取的后续任务添加不可删除标识
                                });
                                this.followTaskProcessing.data.push({
                                  task_name: "",
                                  handling_measures: "请输入处理措施",
                                });
                                this.proTableData[
                                  this.currentClickedTask.index
                                ].follow_task = _.cloneDeep(
                                  this.followTaskProcessing.data
                                );
                              }
                            } else {
                              this.ifFollowTaskShow = false;
                            }
                            break;
                          case "pickFollowTasks":
                            // 获取后续任务列表数据
                            this.followTaskListTableData = props.data.data;
                            this.followTaskListShow = true;
                            break;
                          default:
                            this.$message.error("数据获取失败，请稍后重试..");
                        }
                      }
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-27
                     * @Description: 处理后续任务同步到成本维护功能
                     * 重写判断是否选择了后续任务且所有已选后续任务都有默认的或输入的决策措施
                     * @Date:2020-07-30
                     * @Update:依产品需求 添加删除逻辑后 修改同步到成本维护接口的数据处理逻辑以及数据结构
                     */
                    syncCostMaintenance() {
                      // 同步到进度维护差异化数据处理
                      // 标记选取了后续任务的任务，并判断这些后续任务的决策措施是否都已输入
                      let sendData = {
                        projectId: this.currentClickedTask.projectid || "",
                        data: [],
                      };
                      let taskId = [];
                      this.proTableData.forEach((v) => {
                        if (
                          v.task_status === "200" &&
                          v.follow_task.length > 1
                        ) {
                          let temp = [];
                          for (let i = 0; i < v.follow_task.length - 1; i++) {
                            temp.push(v.follow_task[i]);
                          }
                          let flag = temp.every((j) => {
                            return j.handling_measures !== undefined;
                          });
                          if (flag) {
                            // finalData.push(...temp);
                            sendData.data.push({
                              id: v.id,
                              followTaskInfo: temp,
                            });
                          } else {
                            taskId.push(v.task_name);
                          }
                        }
                      });
                      if (taskId.length === 0) {
                        model.invoke("syncToCostMaintenance", sendData);
                      } else {
                        //将所有选取的但没有输入处理措施的后续任务名拼接 提示用户哪些任务没有输入决策措施
                        let str = "";
                        taskId.forEach((v) => {
                          str += v + ",";
                        });
                        str = str.slice(0, str.length - 1);
                        this.$message.error(
                          "任务:" + str + "的后续任务决策措施未输入！"
                        );
                      }
                    },
                    //跳转到任务挣值分析图
                    goEarnedValueAnalysisChart() {
                      if (this.currentClickedTask.id) {
                        model.invoke(
                          "goEarnedValueAnalysisChart",
                          this.currentTaskClick.id
                        );
                      } else {
                        this.$message.error("请先选择任务");
                      }
                    },
                    //显示筛选框
                    showSelectBox() {
                      this.ifSelectBoxShow = !this.ifSelectBoxShow;
                    },
                    conditionOneChange(val) {
                      console.log(this.filterCondition);
                      model.invoke("getFilterData", this.filterCondition);
                    },
                    conditionTwoChange(val) {
                      console.log(this.filterCondition);
                      model.invoke("getFilterData", this.filterCondition);
                    },
                    cellStyle({ row, column, rowIndex, columnIndex }) {
                      if (columnIndex === 0) {
                        // console.log(column)
                        return "padding: 0px!important;";
                      }
                    },
                    iconArrowClick1(data) {
                      data.open = !data.open;
                    },
                    iconArrowClick2(data) {
                      data.open = !data.open;
                    },
                    iconArrowClick3(data) {
                      data.open = !data.open;
                    },
                    iconArrowClick4(data) {
                      data.open = !data.open;
                    },
                    messageConfirm() {
                      this.messageBoxShow = false;
                    },
                    // 给左侧任务添加行索引
                    tableRowClassName({ row, rowIndex }) {
                      row.index = rowIndex;
                      row.follow_task = [];
                    },
                    // 重置右侧表格数据
                    resetData() {
                      this.beforeTaskInfo.data = [];
                      this.currentTaskInfo.data = [];
                      this.earnedValueAnalysisSuggestions.data = [];
                      // this.followTaskProcessing.data=[]
                    },
                    //获取当前点击的任务
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-27
                     * @Description: 重写成本对比分析 左侧任务列表双击相关的处理逻辑  处理已完成任务的后续任务
                     */
                    currentTaskClick(row) {
                      // 优化 避免重复点击调接口
                      if (
                        this.currentClickedTask &&
                        this.currentClickedTask.id === row.id
                      )
                        return;
                      this.resetData();

                      if (row.task_status === "200") {
                        this.ifFollowTaskShow = true;
                        // 判断是否是第一次点击 若不是 将当前后续任务数据挂载到上次点击任务上
                        if (this.currentClickedTask !== null) {
                          this.proTableData[
                            this.currentClickedTask.index
                          ].follow_task = _.cloneDeep(
                            this.followTaskProcessing.data
                          );
                        }
                        // 如果该条任务以获取过数据  直接取出该后续任务数据显示
                        if (row.feched) {
                          this.followTaskProcessing.data = _.cloneDeep(
                            row.follow_task
                          );
                        }
                      } else {
                        this.ifFollowTaskShow = false;
                      }
                      this.currentClickedTask = _.cloneDeep(row);
                      // TODO 调用接口发送 taks_id到后台 获取该任务的其他信息
                      model.invoke("getClickedTaskDetailData", row);
                    },
                    goSelectFollowTask() {
                      console.log("打开选择后续任务弹窗");
                      model.invoke("pickFollowTasks", this.currentClickedTask);
                    },
                    // 监听决策输入 ，如有输入或修改 同步到左侧当前点击的任务数据
                    hmChange() {
                      this.proTableData[
                        this.currentClickedTask.index
                      ].follow_task = _.cloneDeep(
                        this.followTaskProcessing.data
                      );
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-27
                     * @Description: 成本对比分析 监听已选后续任务的删除
                     */
                    handleFollowTaskDel(row, index) {
                      // 从后续任务表格数据中一处当前删除行
                      this.followTaskProcessing.data.splice(index, 1);
                      // 将移除后的后续任务数据挂载到当前点击的任务上
                      this.proTableData[
                        this.currentClickedTask.index
                      ].follow_task = _.cloneDeep(
                        this.followTaskProcessing.data
                      );
                    },
                    // 依产品要求 去除当前任务情况表的偏差原因字段
                    // 监听当前任务情况偏差原因输入 ，如有输入或修改 发送到后台
                    // drChange(val) {
                    //   model.invoke("currentTaskInfoDeviationReason", {
                    //     id: this.currentClickedTask.id,
                    //     deviation_reason: val,
                    //   });
                    // },
                    // 监听挣值分析偏差原因输入 ，如有输入或修改 发送到后台
                    evasChange(val) {
                      console.log(val);
                      model.invoke("earnedAnalysisDeviationReason", {
                        id: this.currentClickedTask.id,
                        deviation_reason: val,
                      });
                    },
                    followTaskcancel() {
                      this.multipleSelection = [];
                      this.$refs.followTaskListTable.clearSelection();
                      this.followTaskListShow = false;
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-27
                     * @Description: 成本对比分析  重写选取后续任务逻辑
                     * 将所选的后续任务追加到后续任务列表 过滤掉重复选择的任务
                     * @Date：2020-07-30
                     * @Update：依产品需求 已选择后续任务做了措施调整并同步后 下次默认显示并且不可删除
                     * @Date：2020-08-30
                     * @Update：修复测试组提出的成本分析控制后续任务选择后列表为空的bug
                     */
                    followTaskConfirm() {
                      let arr = _.cloneDeep(this.multipleSelection);
                      this.multipleSelection = [];
                      this.$refs.followTaskListTable.clearSelection();
                      arr.forEach((v) => {
                        v.handling_measures = 0;
                        v.erasable = true; // 添加是否可删除标识
                      });
                      // 从原数组弹出最后一行点击按钮行
                      let last = this.followTaskProcessing.data.pop();
                      // 对返回的 用户选择的所有后续任务进行过滤， 去掉列表里已有的
                      arr.forEach((v) => {
                        let flag = this.followTaskProcessing.data.some((s) => {
                          return v.task_id === s.task_id;
                        });
                        if (!flag) {
                          this.followTaskProcessing.data.push(v);
                        }
                      });
                      // 最后一行点击按钮行添加到后续任务数据末尾
                      this.followTaskProcessing.data.push(last);
                      // 将 当前后续任务 挂载到当前点击的任务的后续任务字段
                      this.proTableData[
                        this.currentClickedTask.index
                      ].follow_task = _.cloneDeep(
                        this.followTaskProcessing.data
                      );
                      this.followTaskListShow = false;
                    },
                    // 后续任务多选功能 获取选择的任务
                    handleSelectionChange(val) {
                      this.multipleSelection = val;
                      console.log(this.multipleSelection);
                    },
                  },
                }).$mount($("#costCAApp", model.dom).get(0));
              });
            });
          });
        });
      });
    });
  };

  // 注册自定义控件
  KDApi.register("cost_ca", MyComponent);
})(window.KDApi, jQuery);
