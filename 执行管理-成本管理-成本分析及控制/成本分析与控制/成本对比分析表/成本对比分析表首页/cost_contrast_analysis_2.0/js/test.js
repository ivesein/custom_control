new Vue({
  delimiters: ["${", "}"],
  data: {
    ifSelectBoxShow: false,
    followTaskListShow: false,
    proTableData: [
      {
        wbs: "G",
        id: "1",
        task_name: "工作5",
        owner: "张三",
        is_certical_task: true,
        task_status: "100", //1 未开始  2 进行中  3 已完成
        handle_status: "0", // 0 待处理  1 已处理
        beforeTaskInfo: [
          {
            before_task_name: "工作4",
            handling_measures: "100",
          },
        ],
        currentTaskInfo: [
          {
            plan_duration: "10", //计划工期
            plan_quantities: "150", //计划工程量
            plan_cost: "10000", //计划总费用
            Adjusted_cost: "9000", //调整后总费用
            actual_duration: "15", //实际工期
            actual_quantities: "170", //实际工程量
            actual_cost: "11000", //实际总费用
            deviation_reason: "", //偏差原因
          },
        ],
        earnedValue: [
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
            before_task_name: "工作5",
            handling_measures: "200",
          },
        ],
        currentTaskInfo: [
          {
            plan_duration: "10", //计划工期
            plan_quantities: "150", //计划工程量
            plan_cost: "10000", //计划总费用
            Adjusted_cost: "9000", //调整后总费用
            actual_duration: "15", //实际工期
            actual_quantities: "170", //实际工程量
            actual_cost: "11000", //实际总费用
            deviation_reason: "", //偏差原因
          },
        ],
        earnedValue: [
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
      {
        wbs: "L",
        id: "3",
        task_name: "工作7",
        owner: "王五",
        is_certical_task: false,
        task_status: "200",
        handle_status: "1",
        beforeTaskInfo: [
          {
            before_task_name: "工作6",
            handling_measures: "200",
          },
        ],
        currentTaskInfo: [
          {
            plan_duration: "10", //计划工期
            plan_quantities: "150", //计划工程量
            plan_cost: "10000", //计划总费用
            Adjusted_cost: "9000", //调整后总费用
            actual_duration: "15", //实际工期
            actual_quantities: "170", //实际工程量
            actual_cost: "11000", //实际总费用
            deviation_reason: "", //偏差原因
          },
        ],
        earnedValue: [
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
            before_task_name: "工作7",
            handling_measures: "300",
          },
        ],
        currentTaskInfo: [
          {
            plan_duration: "10", //计划工期
            plan_quantities: "150", //计划工程量
            plan_cost: "10000", //计划总费用
            Adjusted_cost: "9000", //调整后总费用
            actual_duration: "15", //实际工期
            actual_quantities: "170", //实际工程量
            actual_cost: "11000", //实际总费用
            deviation_reason: "", //偏差原因
          },
        ],
        earnedValue: [
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
    ],
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
      // conditionThree:1, //任务状态 1 全部  2 未开始  3 进行中  4 已完成
      // timeRange:[]  //时间范围 为2时 日期范围所选值 数组["2020-03-01","2020-03-15"]
    },
    ifFollowTaskShow: false,
    currentRow: null,
    followTaskListTableData: [
      {
        wbs: "1.1.1",
        id: "1.1.1",
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
      {
        wbs: "1.1.2",
        id: "1.1.2",
        task_name: "后续任务2",
        day: "4",
        plan_starttime: "2020-04-25",
        plan_endtime: "2020-04-29",
        artificialAggregate: "10",
        materialCombined: "20",
        internalManualSummation: "30",
        externalManualSummation: "40",
        combined: "100",
      },
      {
        wbs: "1.1.3",
        id: "1.1.3",
        task_name: "后续任务3",
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
  created() {
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
  },
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
      console.log(this.currentRow);

      console.log(row, index);
      this.currentRow.followTaskInfo.splice(index, 1);
      this.proTableData[this.currentRow.index].followTaskInfo = _.cloneDeep(
        this.currentRow.followTaskInfo
      );
    },
    hmChange(val) {
      console.log(val);
      this.proTableData[this.currentRow.index].followTaskInfo = _.cloneDeep(
        this.currentRow.followTaskInfo
      );
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
    /**
     * @Author: zhang fq
     * @Date: 2020-07-29
     * @Description: 重写成本对比分析 左侧任务列表任务点击处理逻辑
     * 将双击改为单击 移除接口交互 前端处理初始化获取的数据用来显示右侧相关详细信息
     */
    currentTaskClick(row) {
      if (this.currentRow && this.currentRow.id === row.id) return;
      this.currentRow = _.cloneDeep(row);
      if (row.task_status === "200") {
        this.ifFollowTaskShow = true;
      } else {
        this.ifFollowTaskShow = false;
      }
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
      this.$refs.followTaskListTable.clearSelection();
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
      this.proTableData[this.currentRow.index].followTaskInfo = _.cloneDeep(
        this.currentRow.followTaskInfo
      );
      this.followTaskListShow = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
  },
}).$mount("#costCAApp");
