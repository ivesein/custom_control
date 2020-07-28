new Vue({
  delimiters: ["${", "}"],
  data: {
    ifSelectBoxShow: false,
    followTaskListShow: false,
    proTableData: [
      {
        wbs: "G",
        task_name: "工作5",
        owner: "张三",
        is_certical_task: true,
        task_status: "100", //1 未开始  2 进行中  3 已完成
        handle_status: "0", // 0 待处理  1 已处理
      },
      {
        wbs: "H",
        task_name: "工作6",
        owner: "李四",
        is_certical_task: true,
        task_status: "200",
        handle_status: "0",
      },
      {
        wbs: "L",
        task_name: "工作7",
        owner: "王五",
        is_certical_task: false,
        task_status: "000",
        handle_status: "1",
      },
      {
        wbs: "I",
        task_name: "工作8",
        owner: "马六",
        is_certical_task: true,
        task_status: "100",
        handle_status: "1",
      },
    ],
    beforeTaskInfo: {
      open: true,
      title: "紧前任务对当前任务影响情况",
      data: [{ before_task_name: "工作4", handling_measures: "成本压缩100元" }],
    },
    currentTaskInfo: {
      title: "当前任务情况",
      task_status: "1",
      open: true,
      data: [
        {
          plan_duration: "10", //计划工期
          plan_quantities: "150", //计划工程量
          plan_cost: "10000", //计划总费用
          Adjusted_cost: "9000", //调整后总费用
          // duration_after_adjustment:"12", //调整后工期
          actual_duration: "15", //实际工期
          actual_quantities: "170", //实际工程量
          actual_cost: "11000", //实际总费用
          deviation_reason: "", //偏差原因
          // free_time:0,  //自由时差
          // free_time_exceed:0, //超出自由时差
          // free_time_analysis_conclusion:"自由时差分析结论", //自由时差分析结论
          // total_time:0, //总时差
          // plan_cost:250,
          // cost_after_adjustment:150,
          // actual_cost:100
          // total_time_exceed:0, //超出总时差
          // total_time_analysis_conclusion:"总时差分析结论", //总时差分析结论
        },
      ],
    },
    earnedValueAnalysisSuggestions: {
      title: "挣值分析及建议",
      open: true,
      data: [
        {
          bcws: "150", //BCWS(已完成工作预算)
          bcwp: "150", //BCWP(计划工作预算)
          acwp: "105", //ACWP(已完成实际费用)
          sv: "-20", //SV(进度偏差)
          spi: "0.87", //SPI(进度偏差)
          cv: "-20", //CV(成本偏差)
          cpi: "0.87", //CPI(成本绩效指数)
          deviation_type: "", //偏差类型
          deviation_reason: "", //偏差原因
        },
      ],
    },
    followTaskProcessing: {
      title: "后续任务处理",
      open: true,
      data: [
        {
          task_name: "123",
          handling_measures: 0,
        },
        {
          task_name: "321",
          handling_measures: 0,
        },
        {
          task_name: "1234",
          handling_measures: 0,
        },
        // {
        //   task_name: "123",
        //   handling_measures: "请输入处理措施",
        // },
        // {
        //   task_name: "321",
        //   handling_measures: "请输入处理措施",
        // },
        // {
        //   task_name: "1234",
        //   handling_measures: "请输入处理措施",
        // },
        // {
        //   task_name: "",
        //   handling_measures: "请输入处理措施",
        // },
      ],
    },
    tableWidth: "100%",
    messageBoxShow: true,
    messageData: [
      // {
      //   task_name:"p4挖土",
      //   task_status:'1'  //1 已完成  2 已滞后
      // },
      // {
      //   task_name:"p5挖土",
      //   task_status:'2'  //1 已完成  2 已滞后
      // },
      // {
      //   task_name:"p6挖土",
      //   task_status:'2'  //1 已完成  2 已滞后
      // },
    ],
    currentTask: null,
    filterCondition: {
      conditionOne: 1, //显示选项  1 全部  2 仅显示差异
      conditionTwo: 1, //时间范围  1 全部  2 范围  时间为timeRange值 ["2020-03-01","2020-03-15"]
      // conditionThree:1, //任务状态 1 全部  2 未开始  3 进行中  4 已完成
      // timeRange:[]  //时间范围 为2时 日期范围所选值 数组["2020-03-01","2020-03-15"]
    },
    ifFollowTaskShow: false,
    currentClickedTask: {
      index: 0,
    },
    followTaskListTableData: [
      {
        wbs: "1.1.1",
        id: "1",
        task_name: "后续任务1",
        day: "4",
        plan_starttime: "2020-04-25",
        plan_endtime: "2020-04-29",
        artificialAggregate: "10",
        materialCombined: "20",
        internalManualSummation: "30",
        externalManualSummation: "40",
        combined: "100",
      },
    ],
    multipleSelection: [],
  },
  created() {},
  mounted() {
    // this.$nextTick(function() {
    //   // this.tableHeight = window.innerHeight - this.$refs.qualityPlanTable.$el.offsetTop - 10
    //   this.tableWidth=this.$refs.projectTable.$el.clientWidth+'px'
    //   console.log(this.tableWidth)
    //   // 监听窗口大小变化
    //   let self = this;
    //   window.onresize = function() {
    //     self.tableWidth=self.$refs.projectTable.$el.clientWidth+'px'
    //   }
    // })
  },
  methods: {
    handleFollowTaskDel(row, index) {
      console.log(row, index);
      this.followTaskProcessing.data.splice(index, 1);
      console.log(this.followTaskProcessing.data);
    },
    hmChange(val) {
      console.log(val);

      this.proTableData[
        this.currentClickedTask.index
      ].follow_task = this.followTaskProcessing.data;
    },
    // refreshData(){},
    // goExit(){},
    // goBeforeTaskDetail(){},
    // goCurrentTaskControl(){},
    // goTaskReportDetail(){},
    // goProgress(){},
    //同步到成本维护
    syncCostMaintenance() {
      console.log(this.currentClickedTask);
    },
    //跳转到任务挣值分析图
    goEarnedValueAnalysisChart() {},
    //显示筛选框
    showSelectBox() {
      this.ifSelectBoxShow = !this.ifSelectBoxShow;
    },
    conditionOneChange(val) {
      console.log(this.filterCondition);
    },
    conditionTwoChange(val) {
      console.log(this.filterCondition);
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
    // 重置右侧表格数据
    resetData() {
      this.beforeTaskInfo.data = [];
      this.currentTaskInfo.data = [];
      this.earnedValueAnalysisSuggestions.data = [];
      // this.followTaskProcessing.data=[]
    },
    currentTaskClick(row) {
      this.resetData();
      this.proTableData[
        this.currentClickedTask.index
      ].follow_task = this.followTaskProcessing.data;
      if (row.task_status === "200") {
        this.ifFollowTaskShow = true;
        if (row.follow_task.length === 0) {
          row.follow_task.push({
            follow_task_name: "",
            handling_measures: "请输入后续措施",
          });
        }
        // this.followTaskProcessing.data = row.follow_task;
      } else {
        this.ifFollowTaskShow = false;
      }
      this.currentClickedTask = row;
      // TODO 调用接口发送 taks_id到后台 获取该任务的其他信息
    },
    // 给左侧任务添加行索引
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      row.follow_task = [];
    },
    goSelectFollowTask() {
      console.log("打开选择后续任务弹窗");
      // model.invoke("pickFollowTasks",this.currentClickedTask.id)
      this.followTaskListShow = true;
    },
    drChange(val) {
      console.log(val);
      // model.invode("currentTaskInfoDeviationReason",{id:this.currentClickedTask.id,deviation_reason:val})
    },
    evasChange(val) {
      console.log(val);
    },
    followTaskcancel() {
      this.multipleSelection = [];
      this.followTaskListShow = false;
    },
    followTaskConfirm() {
      let arr = _.cloneDeep(this.multipleSelection);
      this.multipleSelection = [];
      this.$refs.followTaskListTable.clearSelection();
      arr.forEach((v) => {
        v.handling_measures = 0;
      });
      // 从原数组弹出最后一行点击按钮行
      let last = this.followTaskProcessing.data.pop();
      // 对返回的 用户选择的所有后续任务进行过滤， 去掉列表里已有的
      arr.forEach((v) => {
        let flag = this.followTaskProcessing.data.some((s) => {
          return v.id === s.id;
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
      ].follow_task = _.cloneDeep(this.followTaskProcessing.data);
      this.followTaskListShow = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
  },
}).$mount("#costCAApp");
