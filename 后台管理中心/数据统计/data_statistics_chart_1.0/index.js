
;(function(KDApi, $) {
	function MyComponent(model) {
		this._setModel(model)
	}
	MyComponent.prototype = {
		// 内部函数不推荐修改
		_setModel: function(model) {
			this.model = model // 内部变量挂载
			this.model.dataStatisticsChartApp=null
		},
		init: function(props) {
			console.log("init---", this.model, props)
			setHtml(this.model, props)
		},
		update: function(props) {
			console.log("-----update", this.model, props)
			if(this.model.dataStatisticsChartApp){
				this.model.dataStatisticsChartApp.handleUpdata(this.model, props);
			}else{
				setHtml(this.model, props)
			}
		},
		destoryed: function() {
			console.log("-----destoryed", this.model)
			this.model.dataStatisticsChartApp=null
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
					KDApi.loadFile("./js/echarts.min.js", model.schemaId, function() {
						KDApi.loadFile(
							"./js/macarons.js",
							model.schemaId,
							function() {
								KDApi.loadFile(
									"./js/element.js",
									model.schemaId,
									function() {
										KDApi.templateFilePath(
											"./html/data_statistics_chart.html",
											model.schemaId,
											{
												path:
													KDApi.nameSpace(
														model.schemaId
													) + "./img/lock.png"
											}
										).then(function(result) {
											model.dom.innerHTML = result
											model.dataStatisticsChartApp = new Vue({
												delimiters: ["${", "}"],
												data: {
													summaryData:[
														{
															title:"客户总数",
															value:"0"
														},
														{
															title:"收款额",
															value:"0"
														},
														{
															title:"下发服务统计",
															value:"0"
														},
														{
															title:"客户反馈统计",
															data:""
														}
													],
													optionOne : {
														color: ['#2B82E4'],
														tooltip: {
															trigger: 'item',
															formatter: '{a} <br/>{b} : {c} ({d}%)'
														},
														series: [
															{
																name: '客户来源',
																type: 'pie',
																radius: '60%',
																center: ['50%', '50%'],
																data: [],
																emphasis: {
																	itemStyle: {
																		shadowBlur: 10,
																		shadowOffsetX: 0,
																		shadowColor: 'rgba(0, 0, 0, 0.5)'
																	}
																}
															}
														]
													},
													optionTwo : {
														xAxis: {
															type: 'category',
															data: []
														},
														yAxis: {
															type: 'value'
														},
														series: [{
															data: [],
															type: 'line',
															symbol:'circle',
															symbolSize:8,
															itemStyle : {
																normal : {
																	color:'#2B82E4',
																	borderColor:"#2B82E4",
																}
															},
															markPoint: {		
																symbol: 'rect' ,
																data: [],
																label:{
																	color:"#2B82E4",
																	fontSize:"18"
																},
																itemStyle:{
																	color:'rgba(0,0,0, 0)'
																},
																symbolOffset:["0%","-50%"]
															},
														}]
													},
													optionThree : {
														color: ['#2B82E4'],
														grid: {
															left: '3%',
															right: '4%',
															bottom: '3%',
															containLabel: true
														},
														xAxis: [
															{
																type: 'category',
																data: [],
																axisTick: {
																	alignWithLabel: true
																}
															}
														],
														yAxis: [
															{
																type: 'value'
															}
														],
														series: [
															{
																name: '下发服务统计',
																type: 'bar',
																barWidth: '30%',
																data: [],
																markPoint: {		
																	symbol: 'rect' ,
																	data: [],
																	label:{
																		color:"#2B82E4",
																		fontSize:"16"
																	},
																	itemStyle:{
																		color:'rgba(0,0,0, 0)'
																	},
																	symbolOffset:["10%","-30%"]
																},
															},
															
														]
													},
													optionFour : {
														tooltip: {
															  trigger: 'item',
															  formatter: '{a} <br/>{b} : {c} %'
															},
														series: [
														  {
															name: '仪表盘白',
															type: 'gauge',
															pointer:{show:false},
															startAngle: 220,
															endAngle: -40,
															data: [],
															radius: '70%',
															center: ['50%', '50%'],
															splitNumber: 8,
															axisLine: {            // 坐标轴线
																lineStyle: {       // 属性lineStyle控制线条样式
																	width: 10,
																	color: [[1, '#fff']]
																}
															},
															axisTick:{
																show:false
															},
															splitLine:{
																show:false
															},
															axisLabel: {
																color: '#e05667',
																formatter: function (value, index) {
																	console.log(value)
																	console.log(index)
																	if(value===12.5){
																		return "优"
																	}
																	if(value===37.5){
																		return "良"
																	}
																	if(value===62.5){
																		return "中"
																	}
																	if(value===87.5){
																		return "差"
																	}
																}
															},
															detail: {
															  formatter:function(val){
																return 100-val+"%"
															},
															  fontSize: 24,
															  offsetCenter: [0, '85%']
															},
															title: {
															  fontSize: 12,
															  color: '#999',
															  offsetCenter: [0, '55%']
															},
															pointer: {
																width: 0            // 指针大小
															}
														  },
														  {
															name: '仪表盘蓝',
															type: 'gauge',
															title : {
																// 其余属性默认使用全局文本样式，详见TEXTSTYLE
																fontWeight: 'bolder',
																fontSize: 30,
																fontStyle: 'italic',
																 offsetCenter: [0, '33%'],
															},
															pointer:{
																show:true
															},
															data: [],
															radius: '70%',
															// center: ['50%', '50%'],
															startAngle: 220,
															endAngle: -40,
															splitNumber: 4,
															axisLine: {            // 坐标轴线
																lineStyle: {       // 属性lineStyle控制线条样式
																	width: 10,
																	color: [[0.25, '#62c87f'], [0.5, '#2B82E4'], [0.75, '#E6A23C'],[1, '#f15755']]
																}
															},
															axisTick: {            // 坐标轴小标记
																length: 13,        // 属性length控制线长
																lineStyle: {       // 属性lineStyle控制线条样式
																	color: 'auto'
																}
															},
															splitLine: {           // 分隔线
																length: 18,        // 属性length控制线长
																lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
																	color: 'auto'
																}
															},
															axisLabel: {
																color: '#666',
																formatter: function (value, index) {
																	console.log(value)
																}
															},
															detail: {
															  formatter:function(val){
																return 100-val+"%"
															},
															  fontSize: 24,
															  offsetCenter: [0, '85%']
															},
															title: {
															  fontSize: 12,
															  color: '#999',
															  offsetCenter: [0, '65%']
															},
															pointer: {
																width:2            // 指针大小
															}
														  },
														]
													},
													optionFive : {
														radar: {
															radius:" 65%" ,
															// axisLabel:{
															// 	show:false
															// },
															// axisLine: {            // 坐标轴线
															// 	show: false        // 默认显示，属性show控制显示与否
															// },
															// axisTick:{
															// 	show:false
															// },
															// splitLine:{
															// 	show:false
															// },
															// splitArea:{
															// 	show:false
															// },
															name: {
																textStyle: {
																	color: '#999',
																	backgroundColor: 'rgba(0,0,0,0)',
																	borderRadius: 3,
																	padding: [3, 5]
																}
															},
															indicator: []
														},
														series: [{
															name: '',
															type: 'radar',
															// areaStyle: {normal: {}},
															// label:{
															// 	color:"#2B82E4",
															// 	fontSize:"18"
															// },
															// itemStyle:{
															// 	color:'#2B82E4'
															// },
															data: []
														}]
													}
												},
												created() {
													this.handleUpdata(model,props)
												},
												mounted() {
													this.drawCharts()
												},
												methods: {
													handleUpdata(model,props){
														if(props.data!==undefined){
															//处理概览数据
															this.summaryData[0].value=props.data.cus.cusCount
															this.summaryData[1].value=props.data.incomeCountMap.incomeSum
															this.summaryData[2].value=props.data.service.serviceSum

															this.summaryData[0].resTitle=this.summaryData[0].title+"："+this.summaryData[0].value
															this.summaryData[1].resTitle=this.summaryData[1].title+"："+this.summaryData[1].value+"万"
															this.summaryData[2].resTitle=this.summaryData[2].title+"："+this.summaryData[2].value+"次"
															this.summaryData[3].resTitle=this.summaryData[3].title
															//处理饼图数据
															let pieData=[]
															props.data.cus.cusInfo.forEach(v=>{
																pieData.push({
																	value:Number(v.count),
																	name:v.address
																})
															})
															this.optionOne.series[0].data=pieData
															//处理折线图数据
															let lineXData=[]	//处理x轴日期
															let lineData=[]	//处理y轴数据
															let lineMarkData=[]	//处理标记显示
															props.data.incomeCountMap.data.forEach((v,k)=>{
																lineXData.push(v.month)
																lineData.push(v.value)
																lineMarkData.push({
																	value:v.value+"万",
																	xAxis:k,
																	yAxis:v.value
																})
															})
															this.optionTwo.xAxis.data=lineXData
															this.optionTwo.series[0].data=lineData
															this.optionTwo.series[0].markPoint.data=lineMarkData

															//处理柱状图
															let	barXData=[]	//处理x轴日期
															let barData=[]	//处理y轴数据
															let barMarkData=[]	//处理标记显示
															props.data.service.serviceInfo.forEach((v,k)=>{
																barXData.push(v.name)
																barData.push(v.count)
																barMarkData.push({
																	value:v.name+":"+v.count,
																	xAxis:k,
																	yAxis:v.count
																})
															})
															this.optionThree.xAxis[0].data=barXData
															this.optionThree.series[0].data=barData
															this.optionThree.series[0].markPoint.data=barMarkData

															//处理仪表图
															this.optionFour.series[0].data.push({
																value:100-Number(props.data.satisfaction),
																name:""
															})
															this.optionFour.series[1].data.push({
																value:100-Number(props.data.satisfaction),
																name:"满意率"
															})

															//处理雷达图
															let indicatorData=[]
															let radarData=[]
															props.data.evaluatLevelMap.data.forEach(v=>{
																indicatorData.push({
																	name:v.name,
																	max:props.data.evaluatLevelMap.evaluatSum
																})
																radarData.push(v.value)
															})
															this.optionFive.radar.indicator=indicatorData
															this.optionFive.series[0].data.push({
																value: radarData,
																name: '',
																lineStyle:{
																	color:"#62c87f"
																},
																symbol:'circle',
																symbolSize:6,
																itemStyle:{
																	color:'#62c87f'
																}
															})
														}
													},
													drawCharts(){
														var myChartOne = echarts.init(document.getElementById("chart0"),"macarons")
														myChartOne.setOption(this.optionOne)
														var myChartTwo = echarts.init(document.getElementById("chart1"))
														myChartTwo.setOption(this.optionTwo)
														var myChartThree = echarts.init(document.getElementById("chart2"))
														myChartThree.setOption(this.optionThree)
														var myChartFour = echarts.init(document.getElementById("chart3"))
														myChartFour.setOption(this.optionFour)
														var myChartFive = echarts.init(document.getElementById("chart4"))
														myChartFive.setOption(this.optionFive)
													}
												}
											}).$mount($("#dataStatisticsChartApp", model.dom).get(0))
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
	KDApi.register("data_statistics_v1.0", MyComponent)
})(window.KDApi, jQuery)
