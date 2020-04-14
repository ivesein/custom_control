new Vue({
    delimiters: ["${", "}"],
    data: {
        tableData:[
            {
                report_date:"2020-04-10",   //汇报日期
                task_start_time:"2020-04-01",   //任务时间开始时间
                report_type:"填报方式",   //填报方式
                this_report_start_time:"2020-04-10 18:00:00",   //本次填报开始时间
                this_report_end_time:"2020-04-10 18:10:00",    //本次填报结束时间
                this_report_completes_workdays_quantities:"8/10",   //本次填报完成工时/本次填报完成工程量
                remaining_workdays_quantities:"40/90",    //"剩余工时/剩余工程量
                accumulated_completed_workdays_quantities:"52/140",   //累计完成工时/累计完成工程量
                task_execution_status:"进行中",   //任务执行状态
                delay_reason:"疫情影响"    //延期原因
            },
            {
                report_date:"2020-04-11",   //汇报日期
                task_start_time:"2020-04-01",   //任务时间开始时间
                report_type:"填报方式",   //填报方式
                this_report_start_time:"2020-04-10 18:00:00",   //本次填报开始时间
                this_report_end_time:"2020-04-10 18:10:00",    //本次填报结束时间
                this_report_completes_workdays_quantities:"8/10",   //本次填报完成工时/本次填报完成工程量
                remaining_workdays_quantities:"32/80",    //"剩余工时/剩余工程量
                accumulated_completed_workdays_quantities:"60/150",   //累计完成工时/累计完成工程量
                task_execution_status:"进行中",   //任务执行状态
                delay_reason:"疫情影响"    //延期原因
            },
            {
                report_date:"2020-04-12",   //汇报日期
                task_start_time:"2020-04-01",   //任务时间开始时间
                report_type:"填报方式",   //填报方式
                this_report_start_time:"2020-04-10 18:00:00",   //本次填报开始时间
                this_report_end_time:"2020-04-10 18:10:00",    //本次填报结束时间
                this_report_completes_workdays_quantities:"8/10",   //本次填报完成工时/本次填报完成工程量
                remaining_workdays_quantities:"24/70",    //"剩余工时/剩余工程量
                accumulated_completed_workdays_quantities:"68/160",   //累计完成工时/累计完成工程量
                task_execution_status:"进行中",   //任务执行状态
                delay_reason:"疫情影响"    //延期原因
            }
        ]
    },
    created() {},
    mounted() {},
    methods: {
            handleUpdate(){
                
            },
            cellStyle({ row, column, rowIndex, columnIndex }) {
                    if (columnIndex === 0) {
                    // console.log(column)
                    return "padding: 0px!important;"
                    }
            
            }
        }
  }).$mount("#reportDLApp")