new Vue({
	delimiters: ["${", "}"],
	data: {
		tableData: [],
		multipleSelection: [],
		here: "hahaha",
		allChecked: false,
		allItems: null,
		isIndeterminate: false
	},
	created() {
		var tData = [
			{
				task_id: 1, //序号
				wbs: "00", //任务代码
				task_name: "任务1", //任务名称
				design_owner: "", //设计承担人
				task_status: "已完成",
				plan_duration: "5",
				fact_duration: "6",
				plan_quantities: "20",
				fact_quantities: "24",
				plan_cost: "7500",
				fact_cost: "9400",
				plan_unitprice: "375",
				fact_unitprice: "391.67",
				task_bcwp: "9000",
				task_bcws: "7500",
				task_acwp: "9400",
				task_cv: "-400",
				task_sv: "1500",
				task_cpi: "0.96",
				task_spi: "1.2",
				deviation_type: "",
				deviation_reason: "",
				deviation_measure: ""
			},
			{
				task_id: 2,
				wbs: "01",
				task_name: "任务2",
				design_owner: "",
				task_status: "进行中",
				plan_duration: 6,
				fact_duration: "进行中",
				plan_quantities: "60",
				fact_quantities: "进行中",
				plan_cost: "60000",
				fact_cost: "进行中",
				plan_unitprice: "1000",
				fact_unitprice: "进行中",
				task_bcwp: "",
				task_bcws: "",
				task_acwp: "",
				task_cv: "",
				task_sv: "",
				task_cpi: "",
				task_spi: "",
				deviation_type: "",
				deviation_reason: "",
				deviation_measure: ""
			}
		]
		this.tableData = tData
	},
	methods: {
		nameDbclick(row) {
			console.log(row)
		},
		factCostDbclick(row) {
			console.log(row)
		},
		// cellDblclick(row, column, cell, event) {
		// 	console.log(row)
		// 	console.log(column)
		// 	console.log(cell)
		// },
		cellStyle({ row, column, rowIndex, columnIndex }) {
			return "padding-left: 0px!important;padding-right: 0px!important;"
		}
	}
}).$mount("#costAnalysisTableApp")
