new Vue({
  delimiters: ["${", "}"],
  data: {
    ifSelectBoxShow:false,
    proTableData:[
      {
        "task_name": "P4挖土设计",
        "tasktype": "1",
        "end_time": "2019-10-10 00:00:00",
        "wbs": "1.1.1",
        "task_id": "74624160865714179",
        "task_schedule_status": "000",
        "is_certical_task":true,
        "duration": "5",
        "plan_starttime": "",
        "start_time": "2019-10-03 00:00:00",
        "plan_endtime": "",
        "quality_action": "",
        "quality_handle_status": "",
        "quality_reason": "",
        "owner":"张三"
      }, {
        "task_name": "P4挖土复核",
        "tasktype": "3",
        "end_time": "2019-10-10 00:00:00",
        "wbs": "1.1.2",
        "task_id": "74624160865714180",
        "is_certical_task":false,
        "task_schedule_status": "000",
        "duration": "5",
        "plan_starttime": "",
        "start_time": "2019-10-03 00:00:00",
        "plan_endtime": "",
        "quality_action": "",
        "quality_handle_status": "",
        "quality_reason": "",
        "owner":"李四"
      }
    ],
    currentTaskDetailData:[
      
    ],
    tableWidth:'100%',
    messageBoxShow:false,
    messageData:[
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
    currentTask:[]
  },
  created() {
   
  },
  mounted() {
    this.$nextTick(function() {
      // this.tableHeight = window.innerHeight - this.$refs.qualityPlanTable.$el.offsetTop - 10
      this.tableWidth=this.$refs.projectTable.$el.clientWidth+'px'
      console.log(this.tableWidth)
      // 监听窗口大小变化
      let self = this;
      window.onresize = function() {
        self.tableWidth=self.$refs.projectTable.$el.clientWidth+'px'
      }
    })
  },
  methods: {
    // refreshData(){},
    // goExit(){},
    // goBeforeTaskDetail(){},
    // goCurrentTaskControl(){},
    // goTaskRTeportDetail(){},
    // goProgress(){},
    showSelectBox(){
      this.ifSelectBoxShow=!this.ifSelectBoxShow
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // console.log(column)
        return "padding: 0px!important;"
      }

    },
    iconArrowClick1(data){
      data.open=!data.open
    },
    iconArrowClick2(data){
      data.open=!data.open
    },
    iconArrowClick3(data){
      data.open=!data.open
    },
    iconArrowClick4(data){
      data.open=!data.open
    },
    messageConfirm(){
      this.messageBoxShow=false
    },
    currentTaskClick(row){
      console.log(row)
      this.currentTask=[]
      this.currentTask.push(row)
    },
  }
}).$mount("#qualityACApp")