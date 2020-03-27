
new Vue({
	delimiters: ["${", "}"],
	data: {
		plan_money : 0,
		fact_money : 0,
		tableData: [],
		option: {
			// title: {
			// 	text: "项目累计金额对比图"
			// },
			tooltip: {
				trigger: "axis",
				formatter(params) {
					let date = params[0].axisValue.split("/")
					let dateStr =
						date[0] + "年" + date[1] + "月" + date[2] + "日"
					if (params.length > 1) {
						return `
						${dateStr}</br >
						<span style="display:inline-block;width:10px;height:10px;background:#578bac;border-radius:100%;margin-right:5px"></span>计划累计金额: ${
							params[0].data
						}万</br >
						<span style="display:inline-block;width:10px;height:10px;background:#d70304;border-radius:100%;margin-right:5px"></span>实际累计金额: ${
							params[1] ? params[1].data : ""
						}万
					`
					} else {
						return `
						${dateStr}</br >
						<span style="display:inline-block;width:10px;height:10px;background:#578bac;border-radius:100%;margin-right:5px"></span>${
							params[0].seriesName === "fact"
								? "实际累计金额"
								: "计划累计金额"
						}: ${params[0].data}万</br >
					`
					}
				}
			},
			legend: {
				left: "400",
				data: [
					{
						name: "plan",
						textStyle: {
							fontSize: 20,
							color: "#578bac"
						}
					},
					{
						name: "fact",
						textStyle: {
							fontSize: 20,
							color: "#d70304"
						}
					}
				]
			},
			grid: {
				left: "3%",
				right: "5%",
				bottom: "5%",
				containLabel: true
			},
			// toolbox: {
			// 	feature: {
			// 		saveAsImage: {}
			// 	}
			// },
			xAxis: {
				type: "category",
				boundaryGap: false,
				step: "1",
				data: [
					"2005/05/01",
					"2005/05/02",
					"2005/05/03",
					"2005/05/04",
					"2005/05/05",
					"2005/05/06",
					"2005/05/07",
					"2005/05/08",
					"2005/05/09",
					"2005/05/10",
					"2005/05/11",
					"2005/05/12",
					"2005/05/13",
					"2005/05/14"
				]
			},
			yAxis: {
				type: "value",
				name: "累计金额（万元）",
				nameLocation: "middle",
				nameTextStyle: {
					fontSize: 18,
					padding: [0, 0, 30, 0]
				}
			},
			series: [
				{
					name: "plan",
					type: "line",
					stack: "总量",
					data: [0, 132, 101, 134, 90, 230, 210],
					color: "#578bac"
				},
				{
					name: "fact",
					type: "line",
					stack: "总量",
					data: [0, 182, 191, 234, 290, 330, 310],
					color: "#d70304"
				}
			]
		}
	},
	created() {},
	mounted() {
		var myChart = echarts.init(document.getElementById("costAnalysisCharts"))
		myChart.setOption(this.option)
	},
	methods: {
		refreshData() {
			console.log("refreshData")
			model.invoke("refreshData", "refreshData")
		},
		cellStyle({ row, column, rowIndex, columnIndex }) {
			return "padding-left: 0px!important;padding-right: 0px!important;"
		}
	}
}).$mount("#costAnalysisChartApp")
