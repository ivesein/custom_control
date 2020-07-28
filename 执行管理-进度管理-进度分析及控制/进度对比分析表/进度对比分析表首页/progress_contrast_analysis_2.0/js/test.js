new Vue({
  delimiters: ["${", "}"],
  data: {
    ifSelectBoxShow: false,
    // 任务表数据结构
    proTableData: [
      {
        wbs: "G", //wbs任务代码
        id: "1",
        task_name: "工作5", //wbs任务名称
        owner: "张三", //承担人
        is_certical_task: true, //是否关键任务
        task_status: "000", //任务状态  1 未开始  2 进行中  3 已完成
        handle_status: "0", //处理状态  0 待处理  1 已处理
        beforeTaskInfo: [
          {
            before_task_name: "工作5", //前置任务名称
            handling_measures: "成本压缩200元", //当前任务处理措施
          },
        ],
        currentTaskInfo: [
          {
            task_id: "1", //任务id
            task_name: "p4挖土", //任务名称
            task_status: "1", //任务状态
            plan_duration: "10", //计划工期
            plan_quantities: "150", //计划工程量
            duration_after_adjustment: "12", //调整后工期
            actual_duration: "15", //实际工期
            actual_quantities: "170", //实际工程量
            free_time: 0, //自由时差
            free_time_exceed: 0, //超出自由时差
            free_time_analysis_conclusion: "自由时差分析结论", //自由时差分析结论
            total_time: 0, //总时差
            total_time_exceed: 0, //超出总时差
            total_time_analysis_conclusion: "总时差分析结论", //总时差分析结论
          },
        ],
        followTaskInfo: [
          {
            task_name: "后续任务1",
            id: "220",
            handling_measures: 2,
            plan_duration: 10,
          },
          {
            task_name: "后续任务2",
            id: "221",
            handling_measures: 3,
            plan_duration: 20,
          },
        ],
      },
      {
        wbs: "H",
        id: "2",
        task_name: "工作6",
        owner: "李四",
        is_certical_task: true,
        task_status: "200",
        handle_status: "0",
        beforeTaskInfo: [
          {
            before_task_name: "工作6", //前置任务名称
            handling_measures: "成本压缩300元", //当前任务处理措施
          },
        ],
        currentTaskInfo: [
          {
            task_id: "1", //任务id
            task_name: "p4挖土", //任务名称
            task_status: "1", //任务状态
            plan_duration: "10", //计划工期
            plan_quantities: "150", //计划工程量
            duration_after_adjustment: "12", //调整后工期
            actual_duration: "15", //实际工期
            actual_quantities: "170", //实际工程量
            free_time: 0, //自由时差
            free_time_exceed: 0, //超出自由时差
            free_time_analysis_conclusion: "自由时差分析结论", //自由时差分析结论
            total_time: 0, //总时差
            total_time_exceed: 0, //超出总时差
            total_time_analysis_conclusion: "总时差分析结论", //总时差分析结论
          },
        ],
        followTaskInfo: [
          {
            task_name: "后续任务1",
            id: "220",
            handling_measures: 2,
            plan_duration: 10,
          },
          {
            task_name: "后续任务2",
            id: "221",
            handling_measures: 3,
            plan_duration: 20,
          },
        ],
      },
      {
        wbs: "L",
        id: "3",
        task_name: "工作7",
        owner: "王五",
        is_certical_task: false,
        task_status: "100",
        handle_status: "1",
        beforeTaskInfo: [
          {
            before_task_name: "工作7", //前置任务名称
            handling_measures: "成本压缩400元", //当前任务处理措施
          },
        ],
        currentTaskInfo: [
          {
            task_id: "3", //任务id
            task_name: "工作7", //任务名称
            task_status: "100", //任务状态
            plan_duration: 10, //计划工期
            plan_quantities: "150", //计划工程量
            duration_after_adjustment: "12", //调整后工期
            actual_duration: "15", //实际工期
            actual_quantities: "170", //实际工程量
            free_time: 0, //自由时差
            free_time_exceed: 0, //超出自由时差
            free_time_analysis_conclusion: "自由时差分析结论", //自由时差分析结论
            total_time: 0, //总时差
            total_time_exceed: 0, //超出总时差
            total_time_analysis_conclusion: "总时差分析结论", //总时差分析结论
          },
        ],
        followTaskInfo: [
          {
            task_name: "后续任务1",
            id: "220",
            handling_measures: 2,
            plan_duration: 10,
          },
          {
            task_name: "后续任务2",
            id: "221",
            handling_measures: 3,
            plan_duration: 20,
          },
        ],
      },
      {
        wbs: "I",
        id: "4",
        task_name: "工作8",
        owner: "马六",
        is_certical_task: true,
        task_status: "100",
        handle_status: "1",
        beforeTaskInfo: [
          {
            before_task_name: "工作4", //前置任务名称
            handling_measures: "成本压缩100元", //当前任务处理措施
          },
        ],
        currentTaskInfo: [
          {
            task_id: "4", //任务id
            task_name: "工作8", //任务名称
            task_status: "100", //任务状态
            plan_duration: "10", //计划工期
            plan_quantities: "150", //计划工程量
            duration_after_adjustment: "12", //调整后工期
            actual_duration: "15", //实际工期
            actual_quantities: "170", //实际工程量
            free_time: 0, //自由时差
            free_time_exceed: 0, //超出自由时差
            free_time_analysis_conclusion: "自由时差分析结论", //自由时差分析结论
            total_time: 0, //总时差
            total_time_exceed: 0, //超出总时差
            total_time_analysis_conclusion: "总时差分析结论", //总时差分析结论
          },
        ],
        followTaskInfo: [
          {
            task_name: "后续任务1",
            id: "220",
            handling_measures: 2,
            plan_duration: 10,
          },
          {
            task_name: "后续任务2",
            id: "221",
            handling_measures: 3,
            plan_duration: 20,
          },
        ],
      },
    ],
    //紧前任务对当前任务影响情况表数据结构
    beforeTaskInfo: {
      open: true,
      title: "紧前任务对当前任务影响情况",
    },
    //当前任务情况表数据结构
    currentTaskInfo: {
      title: "当前任务情况",
      task_status: "1",
      open: true,
    },
    earnedValueAnalysisSuggestions: {
      title: "挣值分析及建议",
      open: true,
    },
    //后续任务处理情况表数据结构
    followTaskProcessing: {
      title: "后续任务处理",
      open: true,
    },
    tableWidth: "100%",
    messageBoxShow: true,
    messageData: [
      {
        task_name: "p4挖土",
        task_status: "", //1 已完成  2 已滞后
      },
      {
        task_name: "p5挖土",
        task_status: "2", //1 已完成  2 已滞后
      },
      {
        task_name: "p6挖土",
        task_status: "2", //1 已完成  2 已滞后
      },
    ],
    taskReportDetailShow: false,
    taskReportDetailData: [],
    currentDate: "",
    filterCondition: {
      conditionOne: 1, //显示选项  1 全部  2 仅显示差异
      conditionTwo: 1, //时间范围  1 全部  2 范围  时间为timeRange值 ["2020-03-01","2020-03-15"]
      conditionThree: 1, //任务状态 1 全部  2 未开始  3 进行中  4 已完成
      timeRange: [], //时间范围 为2时 日期范围所选值 数组["2020-03-01","2020-03-15"]
    },
    ifFollowTaskShow: false, //是否显示后续任务处理表
    taskReportDetailData: [
      {
        plan_duration: "20", //计划工期
        actual_duration: "25", //实际工期
        duration_completion_rate: "90%", //工期完成率
        plan_quantities: "40", //计划工程量
        actual_quantities: "35", //实际工程量
        quantities_completion_rate: "76%", //工程量完成率
        remaining_duration: "5", //剩余工期
      },
    ],
    currentClickedTask: null,
    currentRow: null,
  },
  created() {
    // 右侧各表格默认显示左侧第一条任务的相关数据
    this.currentRow = this.proTableData[0];
    this.getCurrentDate();
  },
  computed: {
    filterMessageData() {
      return this.messageData.filter((v) => {
        return v.task_status !== "";
      });
    },
  },
  mounted() {
    let self = this;
    this.$nextTick(function () {
      // this.tableHeight = window.innerHeight - this.$refs.qualityPlanTable.$el.offsetTop - 10
      self.tableWidth = self.$refs.projectTable.$el.clientWidth + "px";
      console.log(self.tableWidth);
      // 监听窗口大小变化
      window.onresize = function () {
        self.tableWidth = self.$refs.projectTable.$el.clientWidth + "px";
      };
    });
    // 默认高亮左侧任务列表第一条
    this.$refs.projectTable.setCurrentRow(this.currentRow);
  },
  methods: {
    handleFollowTaskDel(row, index) {
      console.log(row, index);
    },
    hmChange(val) {
      console.log(val);
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
    goTaskReportDetail() {
      if (this.currentClickedTask !== null) {
        // TODO 发送当前任务id到后台获取任务汇报详情数据并展示
        this.taskReportDetailShow = true;
      } else {
        this.$message.error("请先选择任务");
      }
    },
    goProgress() {},
    showSelectBox() {
      this.ifSelectBoxShow = !this.ifSelectBoxShow;
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
    // 三个筛选条件各自改变时 判断时间范围是否为2 且所选日期范围不为空 组合筛选条件发送到后台
    conditionOneChange(val) {
      if (this.filterCondition.conditionTwo === 2) {
        if (this.filterCondition.timeRange.length === 0) {
          alert("请选择日期范围");
        } else {
          // TODO 发送filterCondition
          console.log("发送filterCondition", this.filterCondition);
        }
      } else {
        // TODO 发送filterCondition
        console.log("发送filterCondition", this.filterCondition);
      }
    },
    conditionTwoChange(val) {
      console.log(val);
      if (val === 2) {
        this.$refs.timeRangePicker.focus();
      } else {
        // TODO 发送filterCondition
        console.log("发送filterCondition", this.filterCondition);
      }
    },
    conditionThreeChange(val) {
      if (this.filterCondition.conditionTwo === 2) {
        if (this.filterCondition.timeRange.length === 0) {
          alert("请选择日期范围");
        } else {
          // TODO 发送filterCondition
          console.log("发送filterCondition", this.filterCondition);
        }
      } else {
        // TODO 发送filterCondition
        console.log("发送filterCondition", this.filterCondition);
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
          alert("请选择日期范围");
        } else {
          // TODO 发送filterCondition
          // alert("发送filterCondition")
          console.log("发送filterCondition", this.filterCondition);
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      row.follow_task = [];
    },
    /**
     * @Author: zhang fq
     * @Date: 2020-07-28
     * @Description: 重构进度对比分析
     * 优化左侧任务点击处理逻辑  因为去除了多次交互 去掉双击处理逻辑
     */
    rowClick(row) {
      // 避免重复点击，优化
      if (this.currentRow && this.currentRow.id === row.id) return;
      console.log(row);
      this.currentRow = row;
      if (row.task_status === "200") {
        this.ifFollowTaskShow = true;
      } else {
        this.ifFollowTaskShow = false;
      }
    },
    //获取当前点击的任务
    // rowDblclick(row) {
    //   // 判断是否重复点击
    //   if (this.currentRow && this.currentRow.id === row.id) return;
    //   console.log(row);
    //   this.currentRow = row;
    //   this.$refs.projectTable.setCurrentRow(this.currentRow);
    //   if (row.task_status === "200") {
    //     this.ifFollowTaskShow = true;

    //   } else {
    //     this.ifFollowTaskShow = false;
    //   }
    // },
    goSelectFollowTask() {},
    closeTaskReportDetail() {
      this.taskReportDetailShow = false;
    },
    goTaskReportListDetail() {
      console.log("跳转到任务列表详情");
    },
  },
}).$mount("#progressCAApp");
