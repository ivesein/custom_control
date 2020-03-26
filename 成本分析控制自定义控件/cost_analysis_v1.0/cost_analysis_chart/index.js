var chartOption = {
	// title: {
	// 	text: "项目累计金额对比图"
	// },
	tooltip: {
		trigger: "axis",
		formatter(params) {
			let date = params[0].axisValue.split("/")
			let dateStr = date[0] + "年" + date[1] + "月" + date[2] + "日"
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
			data: [0, 10, 20, 30, 40, 50, 60],
			color: "#578bac"
		},
		{
			name: "fact",
			type: "line",
			stack: "总量",
			data: [0, 15, 25, 35, 45, 55, 65],
			color: "#d70304"
		}
	]
}
var plan_money = 0,
	fact_money = 0
;(function(KDApi, $) {
	function MyComponent(model) {
		this._setModel(model)
	}
	MyComponent.prototype = {
		// 内部函数不推荐修改
		_setModel: function(model) {
			this.model = model // 内部变量挂载
		},
		init: function(props) {
			console.log("init---", this.model, props)
			setHtml(this.model, props)
		},
		update: function(props) {
			// var tData = JSON.parse(props.data)
			console.log("-----update", this.model, props)
			// firstInit(props, this.model)
			setHtml(this.model, props)
		},
		destoryed: function() {
			console.log("-----destoryed", this.model)
		}
	}
	/**
	 *@description 第一次打开页面加载相关依赖前端文件
	 *
	 * @param {*} model 金蝶内建对象model
	 */
	var setHtml = function(model, props) {
		KDApi.loadFile("./css/element.css", model.schemaId, function() {
			KDApi.loadFile("./css/main.css", model.schemaId, function() {
				KDApi.loadFile("./js/vue.min.js", model.schemaId, function() {
					KDApi.loadFile("./js/vue.js", model.schemaId, function() {
						KDApi.loadFile(
							"./js/echarts.min.js",
							model.schemaId,
							function() {
								KDApi.loadFile(
									"./js/element.js",
									model.schemaId,
									function() {
										KDApi.templateFilePath(
											"./html/plan.html",
											model.schemaId,
											{
												path:
													KDApi.nameSpace(
														model.schemaId
													) + "./img/lock.png"
											}
										).then(function(result) {
											model.dom.innerHTML = result
											// model.invoke("initData", '') //初始化
											console.log(props.data)
											if (props.data) {
												chartOption.xAxis.data =
													props.data.date
												chartOption.series[0].data =
													props.data.plan
												chartOption.series[1].data =
													props.data.fact
												plan_money =
													props.data.plan_money
												fact_money =
													props.data.fact_money
											}
											var costAnalysisChartApp = new Vue({
												delimiters: ["${", "}"],
												data: {
													option: null,
													plan_money: 0,
													fact_money: 0
												},
												mounted() {
													this.plan_money = plan_money
													this.fact_money = fact_money
													this.option = chartOption
													var myChart = echarts.init(
														document.getElementById(
															"costAnalysisCharts"
														)
													)
													myChart.setOption(
														this.option
													)
												},
												methods: {}
											}).$mount("#costAnalysisChartApp")
										})
									}
								)
							}
						)
					})
				})
			})
		})
	}
	// 注册自定义控件
	KDApi.register("cost_analysis_chart", MyComponent)
})(window.KDApi, jQuery)
