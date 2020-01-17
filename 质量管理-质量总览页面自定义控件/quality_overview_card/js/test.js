new Vue({
	delimiters: ["${", "}"],
	data: {
		cardData: null
	},
	created() {
		var cardData = [
			{
				title: "质量控制节点总数",
				completed: 31,
				overtime: 3,
				plan: 32,
				deviation: 1,
				color: "#76b5f5"
			},
			{
				title: "设计(勘察、测绘)",
				completed: 31,
				overtime: 3,
				plan: 32,
				deviation: 1,
				color: "#76b5f5"
			},
			{
				title: "复核",
				completed: 31,
				overtime: 3,
				plan: 32,
				deviation: 1,
				color: "#b2de84"
			},
			{
				title: "一审",
				completed: 31,
				overtime: 3,
				plan: 32,
				deviation: 1,
				color: "#2fc8ca"
			},
			{
				title: "二审",
				completed: 31,
				overtime: 3,
				plan: 32,
				deviation: 1,
				color: "#ff9a00"
			}
		]
		this.cardData = cardData
	},
	methods: {}
}).$mount("#app")
