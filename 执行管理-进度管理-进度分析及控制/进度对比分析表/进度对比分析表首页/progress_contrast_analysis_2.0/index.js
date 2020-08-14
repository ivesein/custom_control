(function (KDApi, $) {
  function MyComponent(model) {
    this._setModel(model);
  }

  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.progressCAVue = null;
    },
    init: function (props) {
      console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      console.log("-----update", this.model, props);
      if (this.model.progressCAVue) {
        this.model.progressCAVue.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.progressCAVue = null;
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
                "./html/progress_contrast_analysis.html",
                model.schemaId,
                {
                  path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
                }
              ).then(function (result) {
                model.dom.innerHTML = "";
                model.dom.innerHTML = result;

                model.progressCAVue = new Vue({
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
                    followTaskProcessing: {
                      title: "后续任务处理",
                      open: true,
                    },
                    tableWidth: "100%",
                    messageBoxShow: false,
                    messageData: [],
                    taskReportDetailShow: false,
                    currentDate: "",
                    filterCondition: {
                      conditionOne: 1, //显示选项  1 全部  2 仅显示差异
                      conditionTwo: 1, //时间范围  1 全部  2 范围  时间为timeRange值 ["2020-03-01","2020-03-15"]
                      conditionThree: 1, //任务状态 1 全部  2 未开始  3 进行中  4 已完成
                      timeRange: [], //时间范围 为2时 日期范围所选值 数组["2020-03-01","2020-03-15"]
                    },
                    taskReportDetailData: [],
                    currentRow: null,
                  },
                  created() {
                    this.getCurrentDate();
                    this.handleUpdata(model, props);
                  },
                  mounted() {
                    let self = this;
                    this.$nextTick(function () {
                      // this.tableHeight = window.innerHeight - this.$refs.qualityPlanTable.$el.offsetTop - 10
                      self.tableWidth =
                        self.$refs.projectTable.$el.clientWidth + "px";
                      console.log(self.tableWidth);
                      // 监听窗口大小变化
                      window.onresize = function () {
                        self.tableWidth =
                          self.$refs.projectTable.$el.clientWidth + "px";
                      };
                    });
                  },
                  /**
                   * Author: zhang fq
                   * Date: 2020-06-02
                   * Description: 过滤进度分析控制-初始化数据-提示信息 不显示task_status为""
                   * Date: 2020-08-11
                   * Update: 修复bug1216 执行管理-进度管理-进度分析控制：第一次进入页面，
                   * 选中第一条设计任务时，后续任务栏没有带出，等切换至其他任务后，
                   * 在切换到该任务时，才能显示该任务的后续任务
                   */
                  computed: {
                    filterMessageData() {
                      return this.messageData.filter((v) => {
                        return v.task_status === "1" || v.task_status === "2";
                      });
                    },
                    ifFollowShow() {
                      if (this.currentRow !== null) {
                        return this.currentRow.task_status === "200"
                          ? true
                          : false;
                      } else {
                        return false;
                      }
                    },
                  },
                  methods: {
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-28
                     * @Description: 处理异常状态任务过滤  解决后台返回数据包含其他状态任务问题
                     * @Update：将同步到进度维护、任务汇报详情、筛选按钮放到后台，添加这3个按钮的接口交互
                     * @Date：2020-08-14
                     * @Update：修复筛选框显示的情况下点击刷新后台传参后筛选框不隐藏的问题
                     */
                    // 根据接口方法名 处理后台返回参数
                    handleUpdata(model, props) {
                      if (
                        props.data !== undefined &&
                        props.data !== null &&
                        props.data !== ""
                      ) {
                        switch (props.data.method) {
                          case "getFilterData":
                          case "init":
                            this.ifSelectBoxShow = false;
                            let mDate = props.data.data;
                            if (mDate && mDate.length > 0) {
                              this.messageData = mDate.filter((v) => {
                                return (
                                  v.task_status === "1" || v.task_status === "2"
                                );
                              });
                            }
                            if (this.messageData.length > 0) {
                              this.messageBoxShow = true;
                            } else {
                              // 没有状态符合条件的任务 不显示messageBox 直接获取taskList数据
                              this.messageBoxShow = false;
                              model.invoke("getTaskListData", "");
                            }
                            break;
                          case "getTaskListData":
                            if (props.data.data.length > 0) {
                              this.proTableData = this.handleProTableData(
                                props.data.data
                              );
                              this.currentRow = this.proTableData[0];
                              // 默认高亮左侧任务列表第一条
                              if (this.$refs.projectTable) {
                                this.$refs.projectTable.setCurrentRow(
                                  this.currentRow
                                );
                              }
                            } else {
                              this.proTableData = [];
                              this.currentRow = null;
                            }
                            break;
                          case "pickFollowTasks":
                            if (props.data.data) {
                              let dataTemp = _.cloneDeep(props.data.data);
                              // 从原数组弹出最后一行点击按钮行
                              let last = this.currentRow.followTaskInfo.pop();
                              // 对返回的 用户选择的所有后续任务进行过滤， 去掉列表里已有的
                              dataTemp.forEach((v) => {
                                v.delFlag = true; // 为选择的后续任务添加可删除标致
                                // 若选择的后续任务 已存在 将该任务过滤掉
                                let flag = this.currentRow.followTaskInfo.some(
                                  (s) => {
                                    return v.id === s.id;
                                  }
                                );
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
                            }
                            break;
                          case "getReportDetailData":
                            this.taskReportDetailData = props.data.data;
                            break;
                          case "syncToProgress":
                            this.goProgress();
                            break;
                          case "goTaskReportDetail":
                            this.goTaskReportDetail();
                            break;
                          case "filterBtnClicked":
                            this.showSelectBox();
                            break;
                          case "goBeforeTaskDetail":
                            this.goBeforeTaskDetail();
                            break;
                          case "goCurrentTaskControl":
                            this.goCurrentTaskControl();
                            break;
                          default:
                            this.$message.error("数据获取失败，请稍后重试..");
                        }
                      }
                    },
                    handleProTableData(data) {
                      let dataTemp = _.cloneDeep(data);
                      dataTemp.forEach((v, k) => {
                        v.index = k;
                        if (v.task_status === "200") {
                          v.followTaskInfo.forEach((vf) => {
                            vf.delFlag = false;
                          });
                          v.followTaskInfo.push({
                            task_name: "",
                            handling_measures: "请输入处理措施",
                          });
                        }
                      });
                      return dataTemp;
                    },
                    getCurrentDate() {
                      let cDate = new Date();
                      this.currentDate =
                        cDate.getFullYear() +
                        "年" +
                        Number(cDate.getMonth() + 1) +
                        "月" +
                        cDate.getDate() +
                        "日";
                    },
                    refreshData() {},
                    goExit() {},
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-08-05
                     * @Description: 进度对比分析 跳转前置任务信息页面
                     */
                    goBeforeTaskDetail() {
                      if (this.currentRow !== null) {
                        model.invoke("goBeforeTaskDetail", this.currentRow);
                      } else {
                        this.$message.error("请先选择任务");
                      }
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-08-05
                     * @Description: 进度对比分析 跳转到当前任务信息页面
                     */
                    goCurrentTaskControl() {
                      if (this.currentRow !== null) {
                        model.invoke("goCurrentTaskControl", this.currentRow);
                      } else {
                        this.$message.error("请先选择任务");
                      }
                    },
                    //调接口 打开任务汇报详情表格弹出
                    goTaskReportDetail() {
                      if (this.currentRow !== null) {
                        model.invoke("getReportDetailData", this.currentRow);
                        this.taskReportDetailShow = true;
                      } else {
                        this.$message.error("请先选择任务");
                      }
                    },
                    //处理后续任务同步到进度维护功能 判断是否选择了后续任务且所有已选后续任务都输入了决策措施
                    goProgress() {
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
                        model.invoke("syncToScheduleMaintenance", finalData);
                      } else {
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
                    showSelectBox() {
                      this.ifSelectBoxShow = !this.ifSelectBoxShow;
                    },
                    cellStyle({ row, column, rowIndex, columnIndex }) {
                      if (columnIndex === 0) {
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
                      model.invoke("getTaskListData", "");
                      this.messageBoxShow = false;
                    },
                    // 三个筛选条件各自改变时 判断时间范围是否为2 且所选日期范围不为空 组合筛选条件发送到后台
                    conditionOneChange(val) {
                      if (this.filterCondition.conditionTwo === 2) {
                        if (this.filterCondition.timeRange.length === 0) {
                          this.$message.error("请选择日期范围");
                        } else {
                          // TODO 发送filterCondition
                          model.invoke("getFilterData", this.filterCondition);
                        }
                      } else {
                        // TODO 发送filterCondition
                        model.invoke("getFilterData", this.filterCondition);
                      }
                    },
                    conditionTwoChange(val) {
                      console.log(val);
                      if (val === 2) {
                        this.$refs.timeRangePicker.focus();
                      } else {
                        // TODO 发送filterCondition
                        model.invoke("getFilterData", this.filterCondition);
                      }
                    },
                    conditionThreeChange(val) {
                      if (this.filterCondition.conditionTwo === 2) {
                        if (this.filterCondition.timeRange.length === 0) {
                          this.$message.error("请选择日期范围");
                        } else {
                          // TODO 发送filterCondition
                          model.invoke("getFilterData", this.filterCondition);
                        }
                      } else {
                        // TODO 发送filterCondition
                        model.invoke("getFilterData", this.filterCondition);
                      }
                    },
                    timeRangeChange(value) {
                      console.log(value);
                      console.log(this.filterCondition);
                    },
                    timeRangeBlur(val) {
                      console.log(val);
                      if (this.filterCondition.conditionTwo === 2) {
                        if (val.value.length === 0) {
                          this.$message.error("请选择日期范围");
                        } else {
                          // TODO 发送filterCondition
                          model.invoke("getFilterData", this.filterCondition);
                          console.log(
                            "发送filterCondition",
                            this.filterCondition
                          );
                        }
                      }
                    },
                    rowClick(row) {
                      // 避免重复点击，优化不必要的操作
                      if (this.currentRow && this.currentRow.id === row.id) {
                        return;
                      }
                      this.currentRow = _.cloneDeep(row);
                    },
                    goSelectFollowTask() {
                      console.log("打开选择后续任务弹窗");
                      model.invoke("pickFollowTasks", this.currentRow);
                    },
                    closeTaskReportDetail() {
                      this.taskReportDetailShow = false;
                    },
                    goTaskReportListDetail() {
                      console.log("跳转到任务列表详情");
                      model.invoke(
                        "goTaskReportDetailListPage",
                        this.currentRow.id
                      );
                    },
                    // 监听决策输入 ，如有输入或修改 同步到左侧当前点击的任务数据
                    hmChange() {
                      this.proTableData[
                        this.currentRow.index
                      ].followTaskInfo = _.cloneDeep(
                        this.currentRow.followTaskInfo
                      );
                    },
                    //  添加后续任务删除功能
                    handleFollowTaskDel(row, index) {
                      // 从后续任务表格数据中一处当前删除行
                      this.currentRow.followTaskInfo.splice(index, 1);
                      // 将移除后的后续任务数据挂载到当前点击的任务上
                      this.proTableData[
                        this.currentRow.index
                      ].followTaskInfo = _.cloneDeep(
                        this.currentRow.followTaskInfo
                      );
                    },
                  },
                }).$mount($("#progressCAApp", model.dom).get(0));
              });
            });
          });
        });
      });
    });
  };

  // 注册自定义控件
  KDApi.register("progress_ca", MyComponent);
})(window.KDApi, jQuery);
