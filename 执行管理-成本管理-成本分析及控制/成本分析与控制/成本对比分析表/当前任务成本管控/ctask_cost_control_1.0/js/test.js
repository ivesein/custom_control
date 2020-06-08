new Vue({
  delimiters: ["${", "}"],
  data: {
    ifTableOneShow:true,
    ifTableTwoShow:true,
    tableData1:[
      {
        plan_total_quantities:"5km",   //计划总工程量
        plan_total_duration:"5",   //计划总工期
        resource_info_data:[
          {
            resource_name:"XXX设计员",   //资源名称
            resource_model:"-",  //资源型号
            resource_plan_total_consumption:"10",   //资源计划总消耗量
            resource_consumption_unit:"工日",   //消耗量单位
            resource_plan_price:"300",   //资源计划单价
            resource_price_unit:"元/工日",   //单价单位
            plan_unit_consumption:"2"  //计划单位工程量资源消耗量
          },
          {
            resource_name:"XXX材料",   //资源名称
            resource_model:"#10",  //资源型号
            resource_plan_total_consumption:"30",   //资源计划总消耗量
            resource_consumption_unit:"吨",   //消耗量单位
            resource_plan_price:"500",   //资源计划单价
            resource_price_unit:"元/吨",   //单价单位
            plan_unit_consumption:"6"  //计划单位工程量资源消耗量
          }
        ]
      }

    ],
    tableData2:[
      {
        report_date:"2020/10/01", //上报日期
        report_completed_quantities:"20", //本次汇报完成工程量
        actual_cumulative_completed_quantities:"60", //实际累计完成工程量
        this_report_cq_duration:'5', //本次汇报完成工程量使用工期
        actual_cumulative_duration:"20",  //实际累计使用工期
        resource_info_data:[ //资源汇报
          {
            resource_name:"汽车钻",  //资源名称
            resource_model:"qcz-01", //资源型号
            resource_consumption:"1",   //资源消耗量
            resource_actual_unit_consumption:"2",  //本次实际单位工程量资源耗用量
            resource_actual_cumulative_consumption:"4",  //实际累计耗用量
            resource_actual_price:"1000",   //实际单价

          }
        ],
        predicted_value:"20",  //单价影响后单位工程资源耗用量预测值
        suggestions_comparative_treatment:"15", //根据基准值与实际单位工程量资源消耗量对比处理建议
        rectification_measures:"请输入纠偏措施",
      },
      {
        report_date:"2020/10/01", //上报日期
        report_completed_quantities:"20", //本次汇报完成工程量
        actual_cumulative_completed_quantities:"60", //实际累计完成工程量
        this_report_cq_duration:'5', //本次汇报完成工程量使用工期
        actual_cumulative_duration:"20",  //实际累计使用工期
        resource_info_data:[ //资源汇报
          {
            resource_name:"汽车钻",  //资源名称
            resource_model:"qcz-01", //资源型号
            resource_consumption:"1",   //资源消耗量
            resource_actual_unit_consumption:"2",  //本次实际单位工程量资源耗用量
            resource_actual_cumulative_consumption:"4",  //实际累计耗用量
            resource_actual_price:"1000",   //实际单价

          }
        ],
        predicted_value:"20",  //单价影响后单位工程资源耗用量预测值
        suggestions_comparative_treatment:"15", //根据基准值与实际单位工程量资源消耗量对比处理建议
        rectification_measures:"请输入纠偏措施",
      },
      {
        report_date:"2020/10/01", //上报日期
        report_completed_quantities:"20", //本次汇报完成工程量
        actual_cumulative_completed_quantities:"60", //实际累计完成工程量
        this_report_cq_duration:'5', //本次汇报完成工程量使用工期
        actual_cumulative_duration:"20",  //实际累计使用工期
        resource_info_data:[ //资源汇报
          {
            resource_name:"汽车钻",  //资源名称
            resource_model:"qcz-01", //资源型号
            resource_consumption:"1",   //资源消耗量
            resource_actual_unit_consumption:"2",  //本次实际单位工程量资源耗用量
            resource_actual_cumulative_consumption:"4",  //实际累计耗用量
            resource_actual_price:"1000",   //实际单价

          }
        ],
        predicted_value:"20",  //单价影响后单位工程资源耗用量预测值
        suggestions_comparative_treatment:"15", //根据基准值与实际单位工程量资源消耗量对比处理建议
        rectification_measures:"",
      }
    ],
    currentType:"1"
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
    syncToCM(){
      // 判断当前页面状态 已完成不许要同步
      if(this.currentType==="1"){
        this.$message.warning("已完成页面的数据不需要同步!")
      }else{
        if(this.tableData2.length===0){
          this.$message.warning("没有可用于同步的数据!")
        }else{
          // 判断是否每条资源汇报都填写了纠偏措施
          let flag=this.tableData2.every(v=>{
            return v.rectification_measures!==""
          })
          if(flag){
            console.log(this.tableData2)
            // model.invoke("syncToCostMaintenance",this.tableData2)
          }else{
            this.$message.error("请确保每一条任务资源汇报详情都输入了纠偏措施!")
          }
        }
      }
    },
    iconArrowClick1(){
      this.ifTableOneShow=!this.ifTableOneShow
    },
    iconArrowClick2(){
      this.ifTableTwoShow=!this.ifTableTwoShow
    },
  }
}).$mount("#ctaskCostControlApp")