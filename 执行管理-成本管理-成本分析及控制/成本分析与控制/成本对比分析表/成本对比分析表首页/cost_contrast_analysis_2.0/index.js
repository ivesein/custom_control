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
                      title: "前置任务对当前任务影响情况",
                    },
                    currentTaskInfo: {
                      title: "当前任务情况",
                      open: true,
                    },
                    earnedValueAnalysisSuggestions: {
                      title: "挣值分析及建议",
                      open: true,
                    },
                    followTaskProcessing: {
                      title: "后续任务处理",
                      open: true,
                    },
                    tableWidth: "100%",
                    messageBoxShow: true,
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
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-29
                     * @Description: 重构成本对比分析接口数据交互 减少不必要的交互 90%数据处理放在前端
                     */
                    handleUpdata(model, props) {
                      if (props.data !== undefined) {
                        switch (props.data.method) {
                          case "getFilterData":
                          case "init":
                            //初始化获取左侧任务列表数据 判断是否为空 为空显示提示弹框
                            if (props.data.data) {
                              this.proTableData = props.data.data;
                              if (this.proTableData.length === 0) {
                                this.messageBoxShow = true;
                              } else {
                                this.messageBoxShow = false;
                                this.proTableData.forEach((v, k) => {
                                  if (v.task_status === "200") {
                                    v.index = k;
                                    v.followTaskInfo = [
                                      {
                                        task_name: "",
                                        handling_measures: "请输入处理措施",
                                      },
                                    ];
                                  }
                                });
                                this.currentRow = this.proTableData[0];
                                // 默认高亮左侧任务列表第一条
                                this.$refs.projectTable.setCurrentRow(
                                  this.currentRow
                                );
                              }
                            }
                            break;
                          case "syncToCostMaintenance":
                            this.syncToCostMaintenance();
                            break;
                          case "filterBtnClicked":
                            this.showSelectBox();
                            break;
                          case "pickFollowTasks":
                            // 获取后续任务列表数据
                            this.followTaskListTableData =
                              props.data.data || [];
                            this.followTaskListShow = true;
                            break;
                          default:
                            this.$message.error("数据获取失败，请稍后重试..");
                        }
                      }
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-29
                     * @Description: 重写成本对比分析 同步到成本维护方法 做必填项校验以及发送数据差异化处理
                     * 标记选取了后续任务的任务，并判断这些后续任务的决策措施是否都已输入
                     * 将选取了后续任务并都输入了决策措施的的以完成任务以及其后续任务发送到后台
                     */
                    syncCostMaintenance() {
                      // 同步到进度维护差异化数据处理
                      // 标记选取了后续任务的任务，并判断这些后续任务的决策措施是否都已输入
                      let finalData = [];
                      let taskId = [];
                      this.proTableData.forEach((v) => {
                        if (
                          v.task_status === "200" &&
                          v.followTaskInfo.length > 1
                        ) {
                          let temp = [];
                          for (
                            let i = 0;
                            i < v.followTaskInfo.length - 1;
                            i++
                          ) {
                            temp.push(v.followTaskInfo[i]);
                          }
                          let flag = temp.every((j) => {
                            return j.handling_measures !== undefined;
                          });
                          if (flag) {
                            finalData.push(v);
                          } else {
                            taskId.push(v.task_name);
                          }
                        }
                      });
                      if (taskId.length === 0) {
                        if (finalData.length > 0) {
                          model.invoke("syncToCostMaintenance", sendData);
                        } else {
                          this.$message.warning("没有需要同步的数据");
                        }
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
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-29
                     * @Description: 重写成本对比分析 左侧任务列表任务点击处理逻辑
                     * 将双击改为单击 移除接口交互 前端处理初始化获取的数据用来显示右侧相关详细信息
                     */
                    currentTaskClick(row) {
                      // 优化 避免重复点击调接口
                      if (this.currentRow && this.currentRow.id === row.id)
                        return;
                      this.currentRow = _.cloneDeep(row);
                      if (row.task_status === "200") {
                        this.ifFollowTaskShow = true;
                      } else {
                        this.ifFollowTaskShow = false;
                      }
                    },
                    goSelectFollowTask() {
                      console.log("打开选择后续任务弹窗");
                      model.invoke("pickFollowTasks", this.currentRow);
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-29
                     * @Description: 重写成本对比分析 监听决策输入 ，如有输入或修改 同步到左侧当前点击的任务数据
                     */
                    hmChange() {
                      this.proTableData[
                        this.currentRow.index
                      ].followTaskInfo = _.cloneDeep(
                        this.currentRow.followTaskInfo
                      );
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-29
                     * @Description: 成本对比分析 重写监听已选后续任务的删除
                     */
                    handleFollowTaskDel(row, index) {
                      this.currentRow.followTaskInfo.splice(index, 1);
                      this.proTableData[
                        this.currentRow.index
                      ].followTaskInfo = _.cloneDeep(
                        this.currentRow.followTaskInfo
                      );
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-29
                     * @Description: 成本对比分析 监听当前任务情况偏差原因输入 ，如有输入或修改 发送到后台
                     */
                    drChange(val) {
                      model.invode("currentTaskInfoDeviationReason", {
                        id: this.currentRow.id,
                        deviation_reason: val,
                      });
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-29
                     * @Description: 成本对比分析 监听挣值分析偏差原因输入 ，如有输入或修改 发送到后台
                     */
                    evasChange(val) {
                      console.log(val);
                      model.invode("earnedAnalysisDeviationReason", {
                        id: this.currentRow.id,
                        deviation_reason: val,
                      });
                    },
                    followTaskcancel() {
                      this.$refs.followTaskListTable.clearSelection();
                      this.followTaskListShow = false;
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-29
                     * @Description: 成本对比分析  重写选取后续任务逻辑
                     * 将所选的后续任务追加到后续任务列表 过滤掉重复选择的任务
                     */
                    followTaskConfirm() {
                      let arr = _.cloneDeep(this.multipleSelection);
                      this.multipleSelection = [];
                      this.$refs.followTaskListTable.clearSelection();
                      arr.forEach((v) => {
                        v.handling_measures = 0;
                      });
                      // 从原数组弹出最后一行点击按钮行
                      let last = this.currentRow.followTaskInfo.pop();
                      // 对返回的 用户选择的所有后续任务进行过滤， 去掉列表里已有的
                      arr.forEach((v) => {
                        let flag = this.currentRow.followTaskInfo.some((s) => {
                          return v.id === s.id;
                        });
                        if (!flag) {
                          this.currentRow.followTaskInfo.push(v);
                        }
                      });
                      // 最后一行点击按钮行添加到后续任务数据末尾
                      this.currentRow.followTaskInfo.push(last);
                      // 将 当前后续任务 挂载到当前点击的任务的后续任务字段
                      this.proTableData[
                        this.currentRow.index
                      ].followTaskInfo = _.cloneDeep(
                        this.currentRow.followTaskInfo
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
