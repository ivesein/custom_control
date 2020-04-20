new Vue({
  delimiters: ["${", "}"],
  data: {
    ifSelectBoxShow:false,
    proTableData:[
      {
        wbs:"G",
        task_name:"工作5",
        owner:"张三",
        is_certical_task:true,
        task_status:"1",  //1 未开始  2 进行中  3 已完成
        handle_status:"0"  // 0 待处理  1 已处理
      },
      {
        wbs:"H",
        task_name:"工作6",
        owner:"李四",
        is_certical_task:true,
        task_status:"2",
        handle_status:"0"
      },
      {
        wbs:"L",
        task_name:"工作7",
        owner:"王五",
        is_certical_task:false,
        task_status:"3",
        handle_status:"1"   
      },
      {
        wbs:"I",
        task_name:"工作8",
        owner:"马六",
        is_certical_task:true,
        task_status:"3",
        handle_status:"1"   
      }
    ],
    beforeTaskInfo:{
      open:true,
      title:"紧前任务对当前任务影响情况",
      data:[
        {before_task_name:"工作4",handling_measures:"成本压缩100元"},
        {before_task_name:"工作4",handling_measures:"成本压缩100元"},
        {before_task_name:"工作4",handling_measures:"成本压缩100元"},
        {before_task_name:"工作4",handling_measures:"成本压缩100元"},
        {before_task_name:"工作4",handling_measures:"成本压缩100元"},
        {before_task_name:"工作4",handling_measures:"成本压缩100元"},
        {before_task_name:"工作4",handling_measures:"成本压缩100元"},
        {before_task_name:"工作4",handling_measures:"成本压缩100元"},
        {before_task_name:"工作4",handling_measures:"成本压缩100元"},
        {before_task_name:"工作4",handling_measures:"成本压缩100元"},
        {before_task_name:"工作4",handling_measures:"成本压缩100元"},
      ]
    },
    currentTaskInfo:{
      title:"当前任务情况",
      task_status:"1",
      open:true,
      data:[
        {
          plan_duration:"10", //计划工期
          plan_quantities:"150", //计划工程量
          base_cost:"10000",  //基准费用
          Adjusted_plan_cost:"9000", //调整后计划费用
          // duration_after_adjustment:"12", //调整后工期
          actual_duration:"15",  //实际工期
          actual_quantities:"170",  //实际工程量
          actual_total_cost:"11000",  //实际总费用
          // deviation_reason:""  //偏差原因
          // free_time:0,  //自由时差
          // free_time_exceed:0, //超出自由时差
          // free_time_analysis_conclusion:"自由时差分析结论", //自由时差分析结论 
          // total_time:0, //总时差
          // plan_cost:250,
          // cost_after_adjustment:150,
          // actual_cost:100
          // total_time_exceed:0, //超出总时差
          // total_time_analysis_conclusion:"总时差分析结论", //总时差分析结论 
        }
      ]
    },
    earnedValueAnalysisSuggestions:{
      title:"当前任务挣值数据分析",
      open:true,
      data:[
        {
          bcws:"150",
          bcwp:"150",
          acwp:"105",
          sv:"-20",
          spi:"0.87",
          cv:"-20",
          cpi:"0.87",
          deviation_type:"",
          deviation_reason:""
        }
      ],
    },
    followTaskProcessing:{
      title:"后续任务处理",
      open:true,
      data:[
        {
          follow_task_name:"工作5",
          handling_measures:"工期压缩2天"
        }
      ]
    },
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
    currentTask:null
  },
  created() {
   
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
      this.currentTask=row
    }
  }
}).$mount("#costPretaskInfoApp")