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
                    ifFollowTaskShow: false, //是否显示后续任务处理表
                    taskReportDetailData: [],
                    currentClickedTask: {
                      index: 0,
                    },
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
                   */

                  computed: {
                    filterMessageData() {
                      return this.messageData.filter((v) => {
                        return v.task_status === "1" || v.task_status === "2";
                      });
                    },
                  },
                  methods: {
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-28
                     * @Description: 处理异常状态任务过滤  解决后台返回数据包含其他状态任务问题
                     * @Update：将同步到进度维护、任务汇报详情、筛选按钮放到后台，添加这3个按钮的接口交互
                     */
                    // 根据接口方法名 处理后台返回参数
                    handleUpdata(model, props) {
                      if (
                        props.data !== undefined &&
                        props.data !== null &&
                        props.data !== ""
                      ) {
                        switch (props.data.method) {
                          case "init":
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
                            this.proTableData = props.data.data;
                            break;
                          case "getFilterData":
                            this.proTableData = props.data.data;
                            break;
                          case "getClickedTaskDetailData":
                            // 获取紧前任务表格数据
                            this.beforeTaskInfo.data =
                              props.data.data.beforeTaskInfo;
                            // 获取当前任务表格数据
                            this.currentTaskInfo.data =
                              props.data.data.currentTaskInfo;
                            /**
                             * @Author: zhang fq
                             * @Date: 2020-07-28
                             * @Description: 修改获取后续任务表格数据的默认紧前任务数据的处理逻辑
                             * 对默认获取的直接紧后做标价 无法被删除
                             */
                            //
                            if (this.currentClickedTask.task_status === "200") {
                              if (props.data.data.followTaskInfo) {
                                this.followTaskProcessing.data = [];
                                let dataTemp = _.cloneDeep(
                                  props.data.data.followTaskInfo
                                );
                                dataTemp.forEach((v) => {
                                  v.delFlag = false; //给默认获取的紧前任务添加不可删除标致
                                  this.followTaskProcessing.data.push(v);
                                });
                              }
                              this.followTaskProcessing.data.push({
                                task_name: "",
                                handling_measures: "请输入处理措施",
                              });
                              // 将 当前后续任务 挂载到当前点击的任务的后续任务字段
                              this.proTableData[
                                this.currentClickedTask.index
                              ].follow_task = this.followTaskProcessing.data;
                            }
                            break;
                          case "pickFollowTasks":
                            /**
                             * @Author: zhang fq
                             * @Date: 2020-07-28
                             * @Description: 修改获取后续任务表格数据的默认紧前任务数据的处理逻辑
                             * 修改每次选择后续任务后全部替换当前的后续任务改为 追加到当前的后续任务中
                             * 如果有重复的 去重，对默认获取的直接紧后做判断 无法被删除
                             */
                            if (props.data.data) {
                              let dataTemp = _.cloneDeep(props.data.data);
                              // 从原数组弹出最后一行点击按钮行
                              let last = this.followTaskProcessing.data.pop();
                              // 对返回的 用户选择的所有后续任务进行过滤， 去掉列表里已有的
                              dataTemp.forEach((v) => {
                                v.delFlag = true; // 为选择的后续任务添加可删除标致
                                v.handling_measures = 0;
                                // 若选择的后续任务 已存在 将该任务过滤掉
                                let flag = this.followTaskProcessing.data.some(
                                  (s) => {
                                    return v.id === s.id;
                                  }
                                );
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
                          default:
                            this.$message.error("数据获取失败，请稍后重试..");
                        }
                      }
                    },
                    // 重置右侧表格数据
                    resetData() {
                      this.beforeTaskInfo.data = [];
                      this.currentTaskInfo.data = [];
                      // this.followTaskProcessing.data=[]
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
                    goBeforeTaskDetail() {},
                    goCurrentTaskControl() {},
                    //调接口 打开任务汇报详情表格弹出
                    goTaskReportDetail() {
                      if (this.currentClickedTask.id) {
                        // TODO 发送当前任务id到后台获取任务汇报详情数据并展示
                        model.invoke(
                          "getReportDetailData",
                          this.currentClickedTask.id
                        );
                        this.taskReportDetailShow = true;
                      } else {
                        this.$message.error("请先选择任务");
                      }
                    },
                    //处理后续任务同步到进度维护功能 判断是否选择了后续任务且所有已选后续任务都输入了决策措施
                    goProgress() {
                      // let tempData=[]
                      // if(this.followTaskProcessing.data.length>1){
                      //   for(let i=0;i<this.followTaskProcessing.data.length-1;i++){
                      //     tempData.push(this.followTaskProcessing.data[i])
                      //   }
                      //   let flag=tempData.every(v=>{
                      //     return v.handling_measures!==""
                      //   })
                      //   if(flag){
                      //     model.invoke("getReportDetailData",this.followTaskProcessing.data)
                      //   }else{
                      //     this.$message.error("所有已选后续任务决策措施不能为空")
                      //   }
                      // }
                      // 同步到进度维护差异化数据处理
                      // 标记选取了后续任务的任务，并判断这些后续任务的决策措施是否都已输入
                      let finalData = [];
                      let taskId = [];
                      this.proTableData.forEach((v) => {
                        if (v.task_status === "3" && v.follow_task.length > 1) {
                          let temp = [];
                          for (let i = 0; i < v.follow_task.length - 1; i++) {
                            temp.push(v.follow_task[i]);
                          }
                          let flag = temp.every((j) => {
                            return j.handling_measures !== "";
                          });
                          if (flag) {
                            finalData.push(...temp);
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
                    // 给左侧任务添加行索引
                    tableRowClassName({ row, rowIndex }) {
                      row.index = rowIndex;
                      row.follow_task = [];
                    },
                    rowClick(row) {
                      this.$refs.projectTable.setCurrentRow(this.currentRow);
                    },
                    //获取当前点击的任务
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-07-22
                     * @Description: 根据需求修改 当前任务点击逻辑
                     */
                    rowDblclick(row) {
                      if (this.currentRow && this.currentRow.id == row.id) {
                        return;
                      }
                      this.currentRow = row;
                      this.$refs.projectTable.setCurrentRow(this.currentRow);
                      this.resetData();
                      // this.proTableData[
                      //   this.currentClickedTask.index
                      // ].follow_task = this.followTaskProcessing.data;
                      if (row.task_status === "200") {
                        this.ifFollowTaskShow = true;
                        // if (row.follow_task.length === 0) {
                        //   row.follow_task.push({
                        //     follow_task_name: "",
                        //     handling_measures: "请输入处理措施",
                        //   });
                        // }
                        // this.followTaskProcessing.data = row.follow_task;
                      } else {
                        this.ifFollowTaskShow = false;
                      }
                      this.currentClickedTask = row;
                      // TODO 发送当前点击的任务id到后台 获取相关数据
                      model.invoke("getClickedTaskDetailData", row.id);
                    },
                    goSelectFollowTask() {
                      console.log("打开选择后续任务弹窗");
                      model.invoke("pickFollowTasks", this.currentClickedTask);
                    },
                    closeTaskReportDetail() {
                      this.taskReportDetailShow = false;
                    },
                    goTaskReportListDetail() {
                      console.log("跳转到任务列表详情");
                      model.invoke(
                        "goTaskReportDetailListPage",
                        this.currentClickedTask.id
                      );
                    },
                    // 监听决策输入 ，如有输入或修改 同步到左侧当前点击的任务数据
                    hmChange() {
                      this.proTableData[
                        this.currentClickedTask.index
                      ].follow_task = this.followTaskProcessing.data;
                    },
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
