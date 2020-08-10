new Vue({
  delimiters: ["${", "}"],
  data: {
    tableData: [],
    originData: {
      "132265655465461": {
        id: 1,
        project_id: "",
        task_id: "",
        person_id: "",
        plan_effect: "55.7", //计划工效
        report_date: "2020/02/04", //上报日期
        resource_adjustment: [
          {
            resource_id: "1", //资源id  唯一
            resource_type: "机械", //资源类别
            resource_name: "汽车钻", //资源名称
            resource_model: "A12", //资源型号
            resource_unit: "台班", //资源单位
            resource_consumption: "1", //资源消耗量
            resource_price: "1000", //资源单价
          },
          {
            resource_id: "2", //资源id  唯一
            resource_type: "人工", //资源类别
            resource_name: "测绘员", //资源名称
            resource_model: "-", //资源型号
            resource_unit: "工日", //资源单位
            resource_consumption: "2", //资源消耗量
            resource_price: "350", //资源单价
          },
        ],
        actual_cost_days: "1", //实际花费工日
        report_quantities: "50", //上报工程量
        actual_effect: "50", //实际功效
        remaining_period: "7", //剩余工期
        remaining_quantities: "340", //剩余工程量
        judge_conditions: "1<55.7/50<1.5", //判断条件(计划功效/实际功效)
        measures_suggestions: "建议加班", //措施建议
        decision_making_operation: "3", //决策操作  "":未处理  "0":不处理  "1":通知加班  "2":增加资源  "3":减少资源
        is_deal_with: true,
        measures_decision: "决策信息", //措施决策
      },
      "123165461563122": {
        id: 2,
        project_id: "",
        task_id: "",
        person_id: "",
        is_deal_with: false,
        plan_effect: "65.5", //计划工效
        report_date: "2020/02/06", //上报日期
        resource_adjustment: [
          {
            resource_id: "3", //资源id  唯一
            resource_type: "机械", //资源类别
            resource_name: "汽车钻", //资源名称
            resource_model: "A12", //资源型号
            resource_unit: "台班", //资源单位
            resource_consumption: "1", //资源消耗量
            resource_price: "1000", //资源单价
          },
          {
            resource_id: "4", //资源id  唯一
            resource_type: "人工", //资源类别
            resource_name: "测绘员", //资源名称
            resource_model: "-", //资源型号
            resource_unit: "工日", //资源单位
            resource_consumption: "2", //资源消耗量
            resource_price: "350", //资源单价
          },
        ],
        actual_cost_days: "1", //实际花费工日
        report_quantities: "50", //上报工程量
        actual_effect: "50", //实际功效
        remaining_period: "7", //剩余工期
        remaining_quantities: "340", //剩余工程量
        judge_conditions: "1<55.7/50<1.5", //判断条件(计划功效/实际功效)
        measures_suggestions: "建议加班", //措施建议
        decision_making_operation: "", //决策操作  "":未处理  "0":不处理  "1":通知加班  "2":增加资源  "3":减少资源
        measures_decision: "", //措施决策
      },
      "845562113166546": {
        id: 3,
        project_id: "",
        task_id: "",
        person_id: "",
        is_deal_with: true,
        plan_effect: "65.5", //计划工效
        report_date: "2020/02/06", //上报日期
        resource_adjustment: [
          {
            resource_id: "5", //资源id  唯一

            resource_type: "机械", //资源类别
            resource_name: "汽车钻", //资源名称
            resource_model: "A12", //资源型号
            resource_unit: "台班", //资源单位
            resource_consumption: "1", //资源消耗量
            resource_price: "1000", //资源单价
          },
          {
            resource_id: "6", //资源id  唯一

            resource_type: "人工", //资源类别
            resource_name: "测绘员", //资源名称
            resource_model: "-", //资源型号
            resource_unit: "工日", //资源单位
            resource_consumption: "2", //资源消耗量
            resource_price: "350", //资源单价
          },
        ],
        actual_cost_days: "1", //实际花费工日
        report_quantities: "50", //上报工程量
        actual_effect: "50", //实际功效
        remaining_period: "7", //剩余工期
        remaining_quantities: "340", //剩余工程量
        judge_conditions: "1<55.7/50<1.5", //判断条件(计划功效/实际功效)
        measures_suggestions: "建议加班", //措施建议
        decision_making_operation: "2", //决策操作  "":未处理  "0":不处理  "1":通知加班  "2":增加资源  "3":减少资源
        measures_decision: "", //措施决策
      },
    },
    decision_making_options: [
      {
        measures: "不处理",
        value: "0",
      },
      {
        measures: "通知加班",
        value: "1",
      },
      {
        measures: "增加资源",
        value: "2",
      },
      {
        measures: "减少资源",
        value: "3",
      },
    ],
    sendData: [],
    changedIndex: [],
  },
  created() {
    let index = 0;
    this.tableData = [];
    for (let key in this.originData) {
      this.originData[key].report_time = key;
      this.originData[key].theIndex = index;
      index++;
      this.tableData.push(this.originData[key]);
    }
  },
  mounted() {
    this.handleUpdate();
    console.log(this.tableData);
  },
  methods: {
    handleUpdate() {
      // 处理禁用状态  添加字段判断
      // this.tableData.forEach((v, k) => {
      //   v.disabled = v.decision_making_operation;
      //   v.index = k;
      // });
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // console.log(column)
        return "padding: 0px!important;";
      }
    },
    // tongbu(){
    //     // 判断是否每条都做了选择操作和措施输入
    //     let flag=this.tableData.every(v => {
    //         return v.decision_making_operation!==''&&v.measures_decision!==''
    //       });
    //       if(flag){
    //         //取出差异化的数据
    //         this.changedIndex.forEach(v=>{
    //           this.sendData.push(this.tableData[v])
    //         })
    //         // 发送差异化数据
    //         this.$message.info("发送数据成功")
    //         console.table(this.sendData)
    //       }else{
    //         this.$message.error("请确保每一条都选择了决策操作并输入措了施决策！")
    //       }
    // },
    // 当下拉选项变更时记录变更的索引值 用于差异化数据处理
    selectChange(row) {
      if (!this.changedIndex.includes(row.index)) {
        this.changedIndex.push(row.index);
      }
    },
    // 当输入框的值变更时记录变更的索引值 用于差异化数据处理
    inputChange(row) {
      console.log(row);
      if (!this.changedIndex.includes(row.index)) {
        this.changedIndex.push(row.index);
      }
    },
  },
}).$mount("#resourcesRMApp");
