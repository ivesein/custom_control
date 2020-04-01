new Vue({
  delimiters: ["${", "}"],
  data: {
    tableData:[
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
}).$mount("#costResoucesRMApp")