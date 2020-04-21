
let dataArr=[]
for(let i=1;i<32;i++){
	dataArr.push([new Date("2020-03-"+i+" 00:00:00").valueOf(),i])
}
console.log(dataArr)
// this.option2.series.data=data
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
		optionOne : {
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
					radius: '55%',
					center: ['50%', '40%'],
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
				markPoint: {
										
					symbol: 'pin' ,
					data: [
						{value: "65万", xAxis: 0, yAxis: 65},
						{value: "8万", xAxis: 1, yAxis: 8},
						{value: "34万", xAxis: 2, yAxis: 34},
						{value: "164万", xAxis: 3, yAxis: 164},
						{value: "3万", xAxis: 4, yAxis: 3},
						{value: "87.65万", xAxis: 5, yAxis: 87.65}
					]
				},
			}]
		},
		amountInfoData:[
			{
			title:"实际累计金额",
			money:600,
			earliest_accumulative_amount:17900,  //最早开始计划累计金额
			latest_accumulative_amount:17900,	//最晚开始计划累计金额
			earliest_deviation:0,  //最早偏差
			latest_deviation:0	//最晚偏差
			},
			{
			title:"人工实际累计金额(包含绩效奖金)",
			money:600,
			earliest_accumulative_amount:600,  //最早开始计划累计金额
			latest_accumulative_amount:600,	//最晚开始计划累计金额
			earliest_deviation:0,  //最早偏差
			latest_deviation:0	//最晚偏差
			},
			{
			title:"机械实际累计金额",
			money:0,
			earliest_accumulative_amount:0,  //最早开始计划累计金额
			latest_accumulative_amount:0,	//最晚开始计划累计金额
			earliest_deviation:0,  //最早偏差
			latest_deviation:0	//最晚偏差
			},
			{
			title:"材料实际累计金额",
			money:0,
			earliest_accumulative_amount:0,  //最早开始计划累计金额
			latest_accumulative_amount:0,	//最晚开始计划累计金额
			earliest_deviation:0,  //最早偏差
			latest_deviation:0	//最晚偏差
			}
		]
	},
	created() {
		// let data=[]
		// for(let i=1;i<32;i++){
		// 	data.push([new Date("2020-03-"+i+" 00:00:00").valueOf(),1])
		// }
		// console.log(data)
		// this.option2.series.data=data
	},
	mounted() {
		var myChartOne = echarts.init(document.getElementById("chart1"))
		myChartOne.setOption(this.optionOne)
		var myChartTow = echarts.init(document.getElementById("chart2"))
		myChartTow.setOption(this.optionTwo)
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
}).$mount("#dataStatisticsChartApp")
