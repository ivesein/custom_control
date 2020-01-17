new Vue({
	delimiters: ["${", "}"],
	data: {
		tableData: [],
		option: {
			// title: {
			// 	text: "项目质量控制节点累计完成对比图",
			// 	textStyle: {
			// 		fontSize: 26,
			// 		fontWeight: "bolder"
			// 	}
			// },
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "cross",
					crossStyle: {
						color: "#999"
					}
				},
				formatter(params) {
					console.log(params)
					let plan = [] // 存储本月计划和累计计划
					let fact = [] // 存储本月实际和累计实际
					let date = params[0].axisValue.split("/")
					// 处理日期为中文
					let dateStr = date[0] + "年" + date[1] + "月"
					// 将显示按实际和累计分类
					params.forEach(function(v) {
						switch (v.seriesName) {
							case "plan_completed":
								plan.push(v)
								break
							case "fact_completed":
								fact.push(v)
								break
							case "plan_cumulative":
								plan.push(v)
								break
							case "fact_cumulative":
								fact.push(v)
								break
						}
					})
					// 拼接计划组dom结构
					let planStrPre = ""
					let Strfix = "</div></div>"
					if (plan.length > 0) {
						planStrPre =
							'<div class="tooltip-item tooltip-plan"><div class="color-icon-plan"></div><div class="text-box">'
						plan.forEach(function(pv) {
							let str =
								pv.seriesName === "plan_completed"
									? "本月计划完成质量控制节点:" +
									  pv.data +
									  "个"
									: "累计计划完成质量控制节点:" +
									  pv.data +
									  "个"
							planStrPre += "<span>" + str + "</span>"
						})
						planStrPre += Strfix
					}
					// 拼接实际组dom结构
					let factStrPre = ""
					if (fact.length > 0) {
						factStrPre =
							'<div class="tooltip-item tooltip-fact"><div class="color-icon-fact"></div><div class="text-box">'
						fact.forEach(function(fv) {
							let str =
								fv.seriesName === "plan_completed"
									? "本月实际完成质量控制节点:" +
									  fv.data +
									  "个"
									: "累计实际完成质量控制节点:" +
									  fv.data +
									  "个"
							factStrPre += "<span>" + str + "</span>"
						})
						factStrPre += Strfix
					}
					// 返回最终结构
					return `
						${dateStr}</br >
						${planStrPre}${factStrPre}
					`
				}
			},
			legend: {
				left: "400",
				// 格式化legend显示文本
				formatter: function(name) {
					console.log(name)
					switch (name) {
						case "plan_completed":
							return "本月计划完成"
						case "fact_completed":
							return "本月实际完成"
						case "plan_cumulative":
							return "累计计划完成"
						case "fact_cumulative":
							return "累计实际完成"
					}
				},
				data: [
					{
						name: "plan_completed",
						textStyle: {
							fontSize: 20,
							color: "#3BA1FF"
						}
					},
					{
						name: "fact_completed",
						textStyle: {
							fontSize: 20,
							color: "#FF2727"
						}
					},
					{
						name: "plan_cumulative",
						textStyle: {
							fontSize: 20,
							color: "#3BA1FF"
						}
					},
					{
						name: "fact_cumulative",
						textStyle: {
							fontSize: 20,
							color: "#FF2727"
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
					"2005/01",
					"2005/02",
					"2005/03",
					"2005/04",
					"2005/05",
					"2005/06",
					"2005/07",
					"2005/08",
					"2005/09",
					"2005/10",
					"2005/11",
					"2005/12"
				],
				axisPointer: {
					type: "shadow"
				}
			},
			yAxis: {
				type: "value",
				name: "数量(个)",
				nameLocation: "end",
				nameTextStyle: {
					fontSize: 18,
					padding: [0, 90, 0, 0]
				}
			},
			series: [
				{
					name: "plan_completed", // 本月计划完成
					type: "bar",
					barMaxWidth: 20,
					data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110],
					color: "#3BA1FF"
				},
				{
					name: "fact_completed", //  本月实际完成
					type: "bar",
					barMaxWidth: 20,
					data: [0, 14, 25, 33, 44, 55, 66, 75, 83, 92, 105, 117],
					color: "#FF2727"
				},
				{
					name: "plan_cumulative", // 累计计划完成
					type: "line",
					data: [
						0,
						20,
						40,
						60,
						80,
						100,
						120,
						140,
						160,
						180,
						200,
						220
					],
					color: "#3BA1FF"
				},
				{
					name: "fact_cumulative", //  累计实际完成
					type: "line",
					data: [
						0,
						22,
						44,
						65,
						87,
						108,
						122,
						145,
						167,
						188,
						202,
						225
					],
					color: "#FF2727"
				}
			]
		}
	},
	created() {},
	mounted() {
		var myChart = echarts.init(
			document.getElementById("qualityAnalysisChart")
		)
		myChart.setOption(this.option)
	},
	methods: {}
}).$mount("#qualityOverviewChartApp")
