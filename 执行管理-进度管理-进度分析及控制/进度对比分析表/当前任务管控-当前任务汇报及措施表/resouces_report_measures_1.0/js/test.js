new Vue({
  delimiters: ["${", "}"],
  data: {
    tableData:[
      {
        plan_effect:"55.7", //计划工效
        report_date:"2020/10/01", //上报日期
        resource_adjustment:[ //资源汇报
          {
            resource_type:'机械',  //资源类别
            resource_name:"汽车钻",  //资源名称
            resource_model:"qcz-01", //资源型号
            resource_unit:"台班",   //资源单位
            resource_consumption:"1",   //资源消耗量
            resource_price:"1000"   //资源单价
          },
          {
            resource_type:'人工',  //资源类别
            resource_name:"测绘员",  //资源名称
            resource_model:"-", //资源型号
            resource_unit:"工日",   //资源单位
            resource_consumption:"2",   //资源消耗量
            resource_price:"350"   //资源单价
          }
        ],
        actual_cost_days:1,   //实际花费工日
        report_quantities:50,  //上报工程量
        actual_effect:50,  //实际工效
        remaining_period:7,  //剩余工期
        remaining_quantities:340,  //剩余工程量
        judge_conditions:"", //判断条件
        suggest_measures:"",  //建议措施
        decision_making_operation:"1",  //决策操作
        measures_decision:"",  //措施决策
        status:true  //状态
      },
      {
        plan_effect:"55.7", //计划工效
        report_date:"2020/10/03", //上报日期
        resource_adjustment:[ //资源汇报
          {
            resource_type:'机械',  //资源类别
            resource_name:"汽车钻",  //资源名称
            resource_model:"qcz-01", //资源型号
            resource_unit:"台班",   //资源单位
            resource_consumption:"1",   //资源消耗量
            resource_price:"1000"   //资源单价
          },
          {
            resource_type:'人工',  //资源类别
            resource_name:"测绘员",  //资源名称
            resource_model:"-", //资源型号
            resource_unit:"工日",   //资源单位
            resource_consumption:"2",   //资源消耗量
            resource_price:"350"   //资源单价
          }
        ],
        actual_cost_days:2,   //实际花费工日
        report_quantities:110,  //上报工程量
        actual_effect:55,  //实际工效
        remaining_period:5,  //剩余工期
        remaining_quantities:230,  //剩余工程量
        judge_conditions:"1<55.7/55<1.5", //判断条件
        suggest_measures:"建议延长工作时长",  //建议措施
        decision_making_operation:"",  //决策操作  
        measures_decision:"",  //措施决策
        status:true  //状态
      }
    ],
    decision_making_options:[
      {
        measures:'通知加班',
        value:'1'
      },
      {
        measures:'增加资源',
        value:'2'
      },
      {
        measures:'减少资源',
        value:'3'
      },
      {
        measures:'不处理',
        value:'4'
      }
    ]
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
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // console.log(column)
        return "padding: 0px!important;"
      }

    },
  }
}).$mount("#resoucesRMApp")