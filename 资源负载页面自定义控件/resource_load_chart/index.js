var resourceLoadChartOption1 = {
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "cross",
			crossStyle: {
				color: "#999"
			}
		},
		backgroundColor:'rgba(255,255,255,.9)',
		borderColor: '#333',
		borderWidth:"1",
	},
	legend: {
		// right: "20",
		// top: "center",
		// orient: "vertical",
		left: "80",
		top: "0",
		// 格式化legend显示文本
		// formatter: function (name) {
		// 	console.log(name)
		// 	switch (name) {
		// 		case "plan_completed":
		// 			return "本月计划完成"
		// 		case "fact_completed":
		// 			return "本月实际完成"
		// 		case "plan_cumulative":
		// 			return "累计计划完成"
		// 		case "fact_cumulative":
		// 			return "累计实际完成"
		// 	}
		// },
		data: [
			{
				name: "xiaohei",
				textStyle: {
					fontSize: 20,
					color: "#7CB5EC"
				}
			},
			{
				name: "xiaohong",
				textStyle: {
					fontSize: 20,
					color: "#434348"
				}
			},
			{
				name: "xiaolan",
				textStyle: {
					fontSize: 20,
					color: "#90ED7D"
				}
			}
		]
	},
	grid: {
		left: "3%",
		right: "3%",
		bottom: "5%",
		containLabel: true
	},
	xAxis: {
		type: "category",
		boundaryGap: true,
		step: "1",
		axisLabel: {
			rotate: 40
		},
		axisLine: {
			onZero: false  // 设置x轴刻度是否在0位置
		},
		data: [
			"2019/12/19",
			"2019/12/20",
			"2019/12/21",
			"2019/12/22",
			"2019/12/23",
			"2019/12/24",
			"2019/12/25",
			"2019/12/26",
			"2019/12/27",
			"2019/12/28",
			"2019/12/29",
			"2019/12/30",
			"2019/12/31",
			"2020/1/1",
			"2020/1/2",
			"2020/1/3"
		],
		axisPointer: {
			type: "shadow"
		}
	},
	yAxis: {
		type: "value",
		name: "h",
		// min: -50,
		// max: 20,
		nameLocation: "mid",
		nameRotate: 90,
		nameTextStyle: {
			fontSize: 18,
			padding: [0, 0, 80, 0]
		},

	},
	series: [
		{
			name: "容量", //  累计实际完成
			type: "line",
			step: 'middle',
			label: {
				normal: {
					show: true,
					position: 'top'
				}
			},

			data: [24, 24, 24, 0, 0, 24, 24, 24, 24, 24, 0, 0, 24, 24, 24, 24],
			color: "#7CB5EC"
		},
		{
			name: "xiaohei",
			type: "bar",
			barMaxWidth: 150,
			data: [8, 8, 0, 0, 8, -8, -8, -8, -8, 0, 0, -8, -8, -8, -8, -8],
			color: "#7CB5EC"
		},
		{
			name: "xiaohong",
			type: "bar",
			barMaxWidth: 150,
			data: [8, 8, 0, 0, 8, -24, -24, -24, -24, 0, 0, -24, -24, -24, -24, -24],
			color: "#434348"
		},
		{
			name: "xiaolan",
			type: "bar",
			barMaxWidth: 150,
			data: [-40, -40, 0, 0, -40, -40, -40, -40, -40, 0, 0, -40, -40, -40, -40, -40],
			color: "#90ED7D"
		}
	]
}
var resourceLoadChartOption2 = {
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "cross",
			crossStyle: {
				color: "#999"
			}
		},
		backgroundColor:'rgba(255,255,255,.9)',
		borderColor: '#333',
		borderWidth:"1",
	},
	legend: {
		// right: "20",
		// top: "center",
		// orient: "vertical",
		left: "80",
		top: "0",
		data: [
			{
				name: "容量",
				textStyle: {
					fontSize: 20,
					color: "#7CB5EC"
				}
			},
			{
				name: "xiaohei",
				textStyle: {
					fontSize: 20,
					color: "#3a3735"
				}
			},
			{
				name: "xiaohong",
				textStyle: {
					fontSize: 20,
					color: "#7cc45c"
				}
			},
			{
				name: "xiaolan",
				textStyle: {
					fontSize: 20,
					color: "#d58744"
				}
			}
		]
	},
	grid: {
		left: "3%",
		right: "3%",
		bottom: "5%",
		containLabel: true
	},
	xAxis: {
		type: "category",
		boundaryGap: true,
		step: "1",
		axisLabel: {
			rotate: 40
		},
		axisLine: {
			onZero: false  // 设置x轴刻度是否在0位置
		},
		data: [
			"2019/12/19",
			"2019/12/20",
			"2019/12/21",
			"2019/12/22",
			"2019/12/23",
			"2019/12/24",
			"2019/12/25",
			"2019/12/26",
			"2019/12/27",
			"2019/12/28",
			"2019/12/29",
			"2019/12/30",
			"2019/12/31",
			"2020/1/1",
			"2020/1/2",
			"2020/1/3"
		],
		axisPointer: {
			type: "shadow"
		}
	},
	yAxis: {
		type: "value",
		name: "h",
		// min: 0,
		// max: 120,
		nameLocation: "mid",
		nameRotate: 90,
		nameTextStyle: {
			fontSize: 18,
			padding: [0, 0, 80, 0]
		},

	},
	series: [
		{
			name: "容量", //  累计实际完成
			type: "line",
			step: 'middle',
			label: {
				normal: {
					show: true,
					position: 'top'
				}
			},

			data: [24, 24, 24, 0, 0, 24, 24, 24, 24, 24, 0, 0, 24, 24, 24, 24],
			color: "#7CB5EC"
		},
		{
			name: "xiaolan",
			type: "bar",
			barMaxWidth: 150,
			stack: '利用率',
			data: [48, 48, 48, 0, 0, 48, 48, 48, 48, 48, 0, 0, 48, 0, 0, 0],
			color: "#d58744"
		},
		{
			name: "xiaohong",
			type: "bar",
			barMaxWidth: 150,
			stack: '利用率',
			data: [16, 16, 16, 0, 0, 16, 16, 16, 16, 16, 0, 0, 16, 16, 16, 16],
			color: "#7cc45c"
		},
		{
			name: "xiaohei",
			type: "bar",
			barMaxWidth: 150,
			stack: '利用率',
			data: [32, 32, 32, 0, 0, 32, 32, 32, 32, 32, 0, 0, 32, 32, 32, 32],
			color: "#3a3735"
		}
	]
}
var option1Colors = ["#7CB5EC","#d58744", "#434348", "#90ED7D"]
var option2Colors = ["#7CB5EC", "#3a3735", "#7cc45c", "#d58744"]
	; (function (KDApi, $) {
		var displayWhichOne = "chartOne"
		function MyComponent(model) {
			this._setModel(model)
		}
		MyComponent.prototype = {
			// 内部函数不推荐修改
			_setModel: function (model) {
				this.model = model // 内部变量挂载
			},
			init: function (props) {
				console.log("init---", this.model, props)
				setHtml(this.model, props)
			},
			update: function (props) {
				// var tData = JSON.parse(props.data)
				console.log("-----update", this.model, props)
				// firstInit(props, this.model)
				setHtml(this.model, props)
			},
			destoryed: function () {
				console.log("-----destoryed", this.model)
			}
		}
		/**
		 *@description 第一次打开页面加载相关依赖前端文件
		 *
		 * @param {*} model 金蝶内建对象model
		 */
		var setHtml = function (model, props) {
			KDApi.loadFile("./css/element.css", model.schemaId, function () {
				KDApi.loadFile("./css/main.css", model.schemaId, function () {
					KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
						KDApi.loadFile("./js/vue.js", model.schemaId, function () {
							KDApi.loadFile(
								"./js/echarts.min.js",
								model.schemaId,
								function () {
									KDApi.loadFile(
										"./js/element.js",
										model.schemaId,
										function () {
											KDApi.templateFilePath(
												"./html/resource_load.html",
												model.schemaId,
												{
													path:
														KDApi.nameSpace(
															model.schemaId
														) + "./img/lock.png"
												}
											).then(function (result) {
												model.dom.innerHTML = result
												// model.invoke("initData", '') //初始化
												console.log(props.data)
												if (props.data) {
													displayWhichOne = props.data.displayWhichOne
													switch (displayWhichOne) {
														case "chartOne":  //chartOne 资源利用率   
															resourceLoadChartOption2.xAxis.data = props.data.xAxisData
															resourceLoadChartOption2.legend.data = []
															resourceLoadChartOption2.series = []
															resourceLoadChartOption2.yAxis.name = props.data.workTimeUnit
															props.data.resourceData.forEach(function (v, k) {
																resourceLoadChartOption2.legend.data.push({
																	name: v.name,
																	textStyle: {
																		fontSize: 20,
																		color: option1Colors[k]
																	}
																})
																if (v.type === "line") {
																	resourceLoadChartOption2.series.push({
																		name: v.name,
																		type: v.type,
																		// barMaxWidth: 14,
																		step: 'middle',
																		label: {
																			normal: {
																				show: true,
																				position: 'top'
																			}
																		},
																		data: v.data,
																		color: option2Colors[k]
																	})
																} else {
																	resourceLoadChartOption2.series.push({
																		name: v.name,
																		type: v.type,
																		barMaxWidth: 150,
																		data: v.data,
																		color: option1Colors[k]
																	})
																}
																// resourceLoadChartOption2.series.push({
																// 	name: v.name,
																// 	type: v.type || 'bar',
																// 	barMaxWidth: 14,
																// 	data: v.data,
																// 	color: option1Colors[k]
																// })
															})
															resourceLoadChartOption2.tooltip.formatter=function(params){
																// console.log(params)
																let date=params[0].name
																let domStr=''
																domStr='<div class="tooltip-content"><p style="color:#333">'+date+'</p>'
																for(x in params){
																// console.log(x)
																	// return params[x].value +"h"
																	domStr+=`<div class="tooltip-item-box"><p style="color:${params[x].color}">${params[x].seriesName}:</p><p style="color:#333;font-weight:600;">${params[x].value.toFixed(1)}&nbsp;${props.data.workTimeUnit}</p></div>`
																}
																// sufFix='</div>'
																domStr+='</div>'
																// console.log(domStr)
																return domStr
															}
														case "chartTwo":  //chartTwo 资源可用
															resourceLoadChartOption1.xAxis.data = props.data.xAxisData
															resourceLoadChartOption1.legend.data = []
															resourceLoadChartOption1.series = []
															resourceLoadChartOption1.yAxis.name = props.data.workTimeUnit
															props.data.resourceData.forEach(function (v, k) {
																resourceLoadChartOption1.legend.data.push({
																	name: v.name,
																	textStyle: {
																		fontSize: 20,
																		color: option2Colors[k]
																	}
																})
																if (v.type === "line") {
																	resourceLoadChartOption1.series.push({
																		name: v.name,
																		type: v.type,
																		// barMaxWidth: 14,
																		step: 'middle',
																		label: {
																			normal: {
																				show: true,
																				position: 'top'
																			}
																		},
																		data: v.data,
																		color: option2Colors[k]
																	})
																} else {
																	resourceLoadChartOption1.series.push({
																		name: v.name,
																		type: v.type,
																		barMaxWidth: 150,
																		stack: '利用率',
																		data: v.data,
																		color: option2Colors[k]
																	})
																}

															})
															resourceLoadChartOption1.tooltip.formatter=function(params){
																// console.log(params)
																let date=params[0].name
																let domStr=''
																domStr='<div class="tooltip-content"><p style="color:#333">'+date+'</p>'
																for(x in params){
																// console.log(x)
																	// return params[x].value +"h"
																	domStr+=`<div class="tooltip-item-box"><p style="color:${params[x].color}">${params[x].seriesName}:</p><p style="color:#333;font-weight:600;">${params[x].value.toFixed(1)}&nbsp;${props.data.workTimeUnit}</p></div>`
																}
																// sufFix='</div>'
																domStr+='</div>'
																// console.log(domStr)
																return domStr
															}
													}
												}
												var resourceLoadChartsApp = new Vue(
													{
														delimiters: ["${", "}"],
														data: {
															ifChartShow: true,
															zIndex: -100,
															option1: null,
															option2: null,
														},
														mounted() {
															this.ifChartShow = displayWhichOne === "chartOne" ? true : false
															this.zIndex = this.ifChartShow ? -100 : 100
															this.option1 = resourceLoadChartOption1
															this.option2 = resourceLoadChartOption2
															var myChart1 = echarts.init(
																document.getElementById(
																	"resourceUtilizationCharts"
																)
															)
															myChart1.setOption(
																this.option2
															)
															var myChart2 = echarts.init(
																document.getElementById(
																	"remainingAvailabilityCharts"
																)
															)
															myChart2.setOption(
																this.option1
															)
														},
														methods: {}
													}
												).$mount("#resourceLoadChartsApp")
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
		KDApi.register("resource_load_chart", MyComponent)
	})(window.KDApi, jQuery)
