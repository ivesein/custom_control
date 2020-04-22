

new Vue({
	delimiters: ["${", "}"],
	data: {
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
				boundaryGap: ['40%', '40%'],
				step: "1",
				axisTick: {
					alignWithLabel: true,
					show:true,
					inside:true
				},
				axisLabel:{
					rotate:45,
					verticalAlign:"top"
				},
				data: [
					"2020/03/01",
					"2020/03/02",
					"2020/03/03",
					"2020/03/04",
					"2020/03/05",
					"2020/03/06",
					"2020/03/07",
					"2020/03/08",
					"2020/03/09",
					"2020/03/10",
					"2020/03/11",
					"2020/03/12",
					"2020/03/13",
					"2020/03/14"
				]
			},
			yAxis: {
				type: "value",
				name: "累计金额（万元）",
				// nameLocation: "middle",
				nameTextStyle: {
					fontSize: 14,
					// padding: [0, 0, 30, 0]
				}
			},
			series: [
				{
					name: "最早开始计划累计金额",
					type: "line",
					// stack: "总量",
					data: [1, 2, 3, 4, 5, 6, 7,9,11,10,13,14,16,15],
					color: "#9e480e"
				},
				{
					name: "实际累计金额",
					type: "line",
					// stack: "总量",
					data: [1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14],
					color: "#70ad47"
				},
				{
					name: "最晚开始计划累计金额",
					type: "line",
					// stack: "总量",
					data: [1, 2, 3, 4, 5, 6, 7,6,7,9,10,9,12,11],
					color: "#a6a6a6"
				},
				{
					name: '计划金额',
					type: 'bar',
					barWidth: '20%',
					barMaxWidth: 200,
					data: [1, 1, 1, 1, 1, 1, 1, 1,1, 1, 1, 1,1, 1],
					color:"#ffc000"
				},
				{
					name: '累计金额',
					type: 'bar',
					barWidth: '20%',

					barMaxWidth: 200,
					data: [2,3,4,5,6,7,8,9,10,11,12,13,14,15],
					color:"#ed7d31"

				},
				
			]
		},
		summaryData:[
			{
				title:"客户总数",
				value:"108"
			},
			{
				title:"收款额",
				value:"224.5"
			},
			{
				title:"下发服务统计",
				value:"564"
			},
			{
				title:"客户反馈统计",
				data:""
			}
		],
		optionOne : {
			color: ['#2B82E4'],
			// title: {
			// 	text: '',
			// 	subtext: '',
			// 	left: 'center'
			// },
			// tooltip: {
			// 	trigger: 'item',
			// 	formatter: '{a} <br/>{b} : {c} ({d}%)'
			// },
			// legend: {
			// 	orient: 'vertical',
			// 	left: 'left',
			// 	data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
			// },
			series: [
				{
					name: '访问来源',
					type: 'pie',
					radius: '60%',
					center: ['50%', '50%'],
					data: [
						{value: 5, name: '海外'},
						{value: 32, name: '西北区'},
						{value: 24, name: '西南区'},
						{value: 23, name: '华北区'},
						{value: 16, name: '华南区'},
						{value: 6, name: '东北区'}	
					],
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
				data: ['1月', '2月', '3月', '4月', '5月', '6月']
			},
			yAxis: {
				type: 'value'
			},
			series: [{
				data: [65, 8, 34,164, 3, 87.65],
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
					data: [
						{value: "65万", xAxis: 0, yAxis: 65,},
						{value: "8万", xAxis: 1, yAxis: 8},
						{value: "34万", xAxis: 2, yAxis: 34},
						{value: "164万", xAxis: 3, yAxis: 164},
						{value: "3万", xAxis: 4, yAxis: 3},
						{value: "87.65万", xAxis: 5, yAxis: 87.65}
					],
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
			// tooltip: {
			// 	trigger: 'axis',
			// 	axisPointer: {            // 坐标轴指示器，坐标轴触发有效
			// 		type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			// 	}
			// },
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [
				{
					type: 'category',
					data: ['人力资源', '经营管理', '行政管理', '项目管理', '考勤管理', '财务管理'],
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
					data: [89, 45, 82, 153, 35, 126],
					markPoint: {		
						symbol: 'rect' ,
						data: [
							{value: "人力资源:89", xAxis: 0, yAxis: 89,},
							{value: "经营管理:45", xAxis: 1, yAxis: 45},
							{value: "行政管理:82", xAxis: 2, yAxis: 82},
							{value: "项目管理:153", xAxis: 3, yAxis: 153},
							{value: "考勤管理:35", xAxis: 4, yAxis: 35},
							{value: "财务管理:126", xAxis: 5, yAxis:126}
						],
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
				data: [{value: '29', name: ''}],
				radius: '70%',
				center: ['50%', '50%'],
				// min: 0,
				// max: 100,
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
				// axisTick: {            // 坐标轴小标记
				// 	length: 13,        // 属性length控制线长
				// 	lineStyle: {       // 属性lineStyle控制线条样式
				// 		color: 'auto'
				// 	}
				// },
				splitLine:{
					show:false
				},
				// splitLine: {           // 分隔线
				// 	length: 18,        // 属性length控制线长
				// 	lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
				// 		color: 'auto'
				// 	}
				// },
				// axisLabel:{
				// 	show:false
				// },
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
						// // 格式化成月/日，只在第一个刻度显示年份
						// var date = new Date(value);
						// var texts = [(date.getMonth() + 1), date.getDate()];
						// if (index === 0) {
						// 	texts.unshift(date.getYear());
						// }
						// return texts.join('/');
					}
				},
				detail: {
				  formatter:'{value}%',
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
				data: [{value: '29', name: '满意率'}],
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
				  formatter:'{value}%',
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
			// title: {
			// 	text: '基础雷达图'
			// },
			// tooltip: {},
			// legend: {
			// 	data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
			// },
			radar: {
				// shape: 'circle',
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
				indicator: [
					{ name: '热衷', max: 100},
					{ name: '满意', max: 100},
					{ name: '较满意', max: 100},
					{ name: '一般', max: 100},
					{ name: '较差', max: 100},
				]
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
				data: [
					{
						value: [80, 40, 60, 55, 72],
						name: '预算分配（Allocated Budget）',
						lineStyle:{
							color:"#2B82E4"
						},
						symbol:'circle',
						symbolSize:6,
						itemStyle:{
							color:'#2B82E4'
						}
					},
					{
						value: [20, 70, 30, 75, 92],
						name: '预算分配（Allocated Budget）',
						lineStyle:{
							color:"#E6A23C"
						},
						symbol:'circle',
						symbolSize:6,
						itemStyle:{
							color:'#E6A23C'
						}
					},
					{
						value: [44, 32, 88, 45, 72],
						name: '预算分配（Allocated Budget）',
						lineStyle:{
							color:"#62c87f"
						},
						symbol:'circle',
						symbolSize:6,
						itemStyle:{
							color:'#62c87f'
						}
					}
				]
			}]
		}
	},
	created() {
		this.summaryData[0].resTitle=this.summaryData[0].title+"："+this.summaryData[0].value
		this.summaryData[1].resTitle=this.summaryData[1].title+"："+this.summaryData[1].value+"万"
		this.summaryData[2].resTitle=this.summaryData[2].title+"："+this.summaryData[2].value+"次"
		this.summaryData[3].resTitle=this.summaryData[3].title

		// let data=[]
		// for(let i=1;i<32;i++){
		// 	data.push([new Date("2020-03-"+i+" 00:00:00").valueOf(),1])
		// }
		// console.log(data)
		// this.option2.series.data=data
	},
	mounted() {
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
	},
	methods: {
		cellStyle({ row, column, rowIndex, columnIndex }) {
			return "padding-left: 0px!important;padding-right: 0px!important;"
		}
	}
}).$mount("#dataStatisticsChartApp")
