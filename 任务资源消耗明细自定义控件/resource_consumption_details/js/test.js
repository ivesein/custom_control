new Vue({
	delimiters: ["${", "}"],
	data: {
		tableData: [],
		quantities: {
			plan: 20,
			fact: 24
		},
		duration: {
			plan: 5,
			fact: 4
		},
		currentInputVal: ''
	},
	created() {
		var tData = [
			{
				resource_id: 1, //序号
				quantities_plan: 20,
				quantities_fact: 24,
				duration_plan: 5,
				duration_fact: 6,
				resource_name: "xx钻机", //资源名称
				total_consumption_unit: "台班", //总消耗 单位
				total_consumption_plan: 100, //总消耗 计划
				total_consumption_fact: 50, //总消耗 实际
				cost_plan: 35000,  //费用 计划
				cost_fact: 32800,  //费用 实际
				cost_deviation: 2200, //费用偏差
				per_unit_cost_plan: 5, //单位工程资源消耗量 计划
				per_unit_cost_fact: 2.08, //单位工程资源消耗量 实际
				per_unit_cost_deviation: 2.92, //单位工程资源消耗量 偏差
				price_unit: "元/台班", //单价单位
				plan_unitprice: 350, //计划单价
				fact_unitprice: 650, //实际单价
				price_uplift: 85.7, //单价涨幅
				recommended_value: 2.69, //建议值（单价影响后）
				benchmark_value: null, //基准值（项目决策）
				benchmark_consumption_deviation: -58.4, //基准消耗偏差指数
				deviation_type: "", //偏差类型
				deviation_reason: "", //偏差原因
				deviation_measure: "", //纠偏措施
				benchmark_input: ""
			},
			{
				resource_id: 2, //序号
				quantities_plan: 20,
				quantities_fact: 24,
				duration_plan: 5,
				duration_fact: 6,
				resource_name: "xx材料", //资源名称
				total_consumption_unit: "m³", //总消耗 单位
				total_consumption_plan: 5, //总消耗 计划
				total_consumption_fact: 5, //总消耗 实际
				cost_plan: 500,  //费用 计划
				cost_fact: 1200,  //费用 实际
				cost_deviation: 700, //费用偏差
				per_unit_cost_plan: 0.25, //单位工程资源消耗量 计划
				per_unit_cost_fact: 0.2, //单位工程资源消耗量 实际
				per_unit_cost_deviation: 0.05, //单位工程资源消耗量 偏差
				price_unit: "元/m³", //单价单位
				plan_unitprice: 100, //计划单价
				fact_unitprice: 120, //实际单价
				price_uplift: 20, //单价涨幅
				recommended_value: 0.21, //建议值（单价影响后）
				benchmark_value: 0.25, //基准值（项目决策）
				benchmark_consumption_deviation: -25, //基准消耗偏差指数
				deviation_type: "", //偏差类型
				deviation_reason: "", //偏差原因
				deviation_measure: "", //纠偏措施
				benchmark_input: ""
			},
			{
				resource_id: 3, //序号
				quantities_plan: 20,
				quantities_fact: 24,
				duration_plan: 5,
				duration_fact: 6,
				resource_name: "xx设计院", //资源名称
				total_consumption_unit: "工日", //总消耗 单位
				total_consumption_plan: 10, //总消耗 计划
				total_consumption_fact: 18, //总消耗 实际
				cost_plan: 3000,  //费用 计划
				cost_fact: 5100,  //费用 实际
				cost_deviation: 1400, //费用偏差
				per_unit_cost_plan: 0.5, //单位工程资源消耗量 计划
				per_unit_cost_fact: 0.75, //单位工程资源消耗量 实际
				per_unit_cost_deviation: 0.25, //单位工程资源消耗量 偏差
				price_unit: "元/工日", //单价单位
				plan_unitprice: 300, //计划单价
				fact_unitprice: 300, //实际单价
				price_uplift: 0, //单价涨幅
				recommended_value: 0.5, //建议值（单价影响后）
				benchmark_value: null, //基准值（项目决策）
				benchmark_consumption_deviation: 50, //基准消耗偏差指数
				deviation_type: "", //偏差类型
				deviation_reason: "", //偏差原因
				deviation_measure: "", //纠偏措施
				benchmark_input: ""
			},
		]
		this.tableData = tData
	},
	methods: {
		limitInputPointNumber(val) {
			console.log(val)
			if (val === 0 || val === '0' || val === '') {
				return false
			} else {
				// let value = null
				// value = String(val).replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
				// value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
				// value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
				// value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
				// return Number(value)
				let reg2 = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;  //小数
				if (reg2.test(val)) {
					return true
				} else {
					alert("请输入正确的数值")
					return false
				}
			}
		},
		setBenchmark(row) {
			console.log("row", Number(row.benchmark_input).toFixed(2))
			let res = this.limitInputPointNumber(row.benchmark_input)
			if (res) {
				let str = Number(row.benchmark_input).toFixed(2) + ""
				let str2 = this.kickZero(str)
				console.log("最终str>>>", str2)
				row.benchmark_value = str2
			} else {
				row.benchmark_input = ""
			}
		},
		// 去掉小数点末尾的0 和 小数点后为0 的小数部分
		kickZero(str) {
			if (str === "" || str === null || str === undefined) {
				return 0
			} else {
				let strArr = str.split("")
				while (strArr[strArr.length - 1] === "0") {
					strArr.pop()
				}
				if (strArr[strArr.length - 1] === ".") strArr.pop()
				return strArr.join("")

			}
		},
		cellStyle({ row, column, rowIndex, columnIndex }) {
			return "padding-left: 0px!important;padding-right: 0px!important;"
		},
		// 合并列单元格
		objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			// 前四列 所有行都合并  
			if (columnIndex < 4) {
				if (rowIndex === 0) {
					return {
						rowspan: this.tableData.length,
						colspan: 1
					};
				} else {
					return {
						rowspan: 0,
						colspan: 0
					};
				}
			}
		}
	}
}).$mount("#costAnalysisTableApp")
