new Vue({
  delimiters: ["${", "}"],
  data: {
    ifSelectBoxShow: false,
    proTableData: [
      {
        task_name: "P4挖土设计",
        tasktype: "1",
        end_time: "2019-10-10 00:00:00",
        wbs: "1.1.1",
        task_id: "74624160865714179",
        task_schedule_status: "000",
        is_certical_task: true,
        duration: "5",
        plan_starttime: "",
        start_time: "2019-10-03 00:00:00",
        plan_endtime: "2019-10-20 00:00:00",
        quality_action: "",
        quality_handle_status: "0",
        quality_reason: "",
        owner: "张三",
      },
      {
        task_name: "P4挖土复核",
        tasktype: "3",
        end_time: "2019-10-10 00:00:00",
        wbs: "1.1.2",
        task_id: "74624160865714180",
        is_certical_task: false,
        task_schedule_status: "200",
        duration: "5",
        plan_starttime: "",
        start_time: "2019-10-03 00:00:00",
        plan_endtime: "2019-10-02 00:00:00",
        quality_action: "",
        quality_handle_status: "1",
        quality_reason: "",
        owner: "李四",
      },
      {
        task_name: "P5挖土复核",
        tasktype: "3",
        end_time: "2019-10-10 00:00:00",
        wbs: "1.1.2",
        task_id: "74624160865714181",
        is_certical_task: false,
        task_schedule_status: "200",
        duration: "5",
        plan_starttime: "",
        start_time: "2019-10-03 00:00:00",
        plan_endtime: "2019-10-02 00:00:00",
        quality_action: "",
        quality_handle_status: "1",
        quality_reason: "",
        owner: "李四",
      },
      {
        task_name: "P5挖土复核",
        tasktype: "3",
        end_time: "2019-10-10 00:00:00",
        wbs: "1.1.2",
        task_id: "74624160865714182",
        is_certical_task: false,
        task_schedule_status: "200",
        duration: "5",
        plan_starttime: "",
        start_time: "2019-10-03 00:00:00",
        plan_endtime: "2019-10-02 00:00:00",
        quality_action: "",
        quality_handle_status: "1",
        quality_reason: "",
        owner: "李四",
      },
    ],
    currentTaskDetailData: [],
    tableWidth: "100%",
    messageBoxShow: false,
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
    currentTask: [],
    diffData: [], //差异化数据
  },
  created() {},
  mounted() {
    // let self = this;
    // this.$nextTick(function() {
    //   // this.tableHeight = window.innerHeight - this.$refs.qualityPlanTable.$el.offsetTop - 10
    //   self.tableWidth=self.$refs.projectTable.$el.clientWidth+'px'
    //   console.log(self.tableWidth)
    //   // 监听窗口大小变化
    //   window.onresize = function() {
    //     self.tableWidth=self.$refs.projectTable.$el.clientWidth+'px'
    //   }
    // })
  },
  methods: {
    refreshData() {
      console.log(this.diffData);
    },
    // goExit(){},
    // goBeforeTaskDetail(){},
    // goCurrentTaskControl(){},
    // goTaskRTeportDetail(){},
    // goProgress(){},
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
    currentTaskClick(row) {
      console.log(row);
      row.DValue = this.getDaysBetween(row.end_time, row.plan_endtime);
      this.currentTask = [];
      this.currentTask.push(row);
    },
    // 计算两个日期的差值
    getDaysBetween(dateString1, dateString2) {
      var startDate = Date.parse(dateString1);
      var endDate = Date.parse(dateString2);
      var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
      if (Number.isNaN(days)) {
        days = "";
      }
      return days;
    },
    reasonChange(val) {
      console.log("reasonChange>>>", val);
      this.setDiffData();
    },
    actionChange(val) {
      console.log("actionChange>>>", val);
      this.setDiffData();
    },
    // 存储差异化值 判断如果已存了该条任务差异化数据  则替换  没有则增加
    setDiffData() {
      let index = null;
      this.diffData.forEach((v, k) => {
        if (v.task_id === this.currentTask[0].task_id) {
          index = k;
        }
      });
      if (index !== null) {
        this.diffData[index] = this.currentTask[0];
      } else {
        this.diffData.push(this.currentTask[0]);
      }
    },
  },
}).$mount("#qualityACApp");
