new Vue({
	delimiters: ["${", "}"],
	data: {
		dates: [
			"2019/12/19",
			"2019/12/20",
			"2019/12/21",
			"2019/12/22",
			"2019/12/23",
			"2019/12/24",
			"2019/12/25",
			"2019/12/26",
			"2019/12/27",
		],
		resourceData: [
			{
				open: false,
				resource_info: {
					label: "xiaohei",
					value: ["", "", "", "", "", "", "", "", ""]
				},
				resource_usability: {
					label: "可用性",
					value: ["8", "8", "", "", "8", "-24", "-24", "-24", "-24"]
				},
				resource_capacity: {
					label: "容量",
					value: ["8", "8", "", "", "8", "8", "8", "8", "8"]
				},
				project_allocation: {
					open: true,
					label: "项目分配",
					value: ["", "", "", "", "", "32", "32", "32", "32"],
					projects_info: [
						{
							label: "中达公路基建项目",
							value: ["", "", "", "", "", "16", "16", "16", "16"]
						},
						{
							label: "中达公路基建项目-1",
							value: ["", "", "", "", "", "16", "16", "16", "16"]
						}
					]
				}
			},
			{
				open: true,
				resource_info: {
					label: "xiaohong",
					value: ["", "", "", "", "", "", "", "", ""]
				},
				resource_usability: {
					label: "可用性",
					value: ["8", "8", "", "", "8", "-8", "-8", "-8", "-8"]
				},
				resource_capacity: {
					label: "容量",
					value: ["8", "8", "", "", "8", "8", "8", "8", "8"]
				},
				project_allocation: {
					open: true,
					label: "项目分配",
					value: ["", "", "", "", "", "16", "16", "16", "16"],
					projects_info: [
						{
							label: "中达公路基建项目",
							value: ["", "", "", "", "", "8", "8", "8", "8"]
						},
						{
							label: "中达公路基建项目-1",
							value: ["", "", "", "", "", "8", "8", "8", "8"]
						}
					]
				}
			},
			{
				open: true,
				resource_info: {
					label: "xiaolan",
					value: ["", "", "", "", "", "", "", "", ""]
				},
				resource_usability: {
					label: "可用性",
					value: ["-40", "-40", "", "", "-40", "-40", "-40", "-40", "-40"]
				},
				resource_capacity: {
					label: "容量",
					value: ["8", "8", "", "", "8", "8", "8", "8", "8"]
				},
				project_allocation: {
					open: true,
					label: "项目分配",
					value: ["48", "48", "", "", "48", "48", "48", "48", "48"],
					projects_info: [
						{
							label: "中达公路基建项目",
							value: ["24", "24", "", "", "24", "24", "24", "24", "24"]
						},
						{
							label: "中达公路基建项目-1",
							value: ["24", "24", "", "", "24", "24", "24", "24", "24",]
						}
					]
				}
			}
		]
	},
	created() { },
	mounted() {
		if (props.data) {
			this.dates = props.data.dates
			this.resourceData = props.data.resourceData
		}
	},
	methods: {
		arrowClick(item) {
			item.open = !item.open
		},
		scrollLeft(e) {
			// console.log(e.target.scrollTop)
			this.$refs.rightInfoBox.scrollTop = e.target.scrollTop
		},
		scrollRight(e) {
			// console.log(e.target.scrollTop)
			this.$refs.leftInfoBox.scrollTop = e.target.scrollTop
		}
	}
}).$mount("#resourceLoadTableApp")
