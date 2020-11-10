new Vue({
  delimiters: ["${", "}"],
  data: {
    unit: "",
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
    workTimeUnit: "h",
    resourceData: [
      {
        open: false,
        resourceInfo: {
          label: "xiaohei",
          value: ["", "", "", "", "", "", "", "", ""],
        },
        resourceUsability: {
          label: "可用性",
          value: ["8", "8", "", "", "8", "-24", "-24", "-24", "-24"],
        },
        resourceCapacity: {
          label: "容量",
          value: ["8", "8", "", "", "8", "8", "8", "8", "8"],
        },
        projectAllocation: {
          open: true,
          label: "项目分配",
          value: ["", "", "", "", "", "32", "32", "32", "32"],
          projectInfo: [
            {
              label: "中达公路基建项目",
              value: ["", "", "", "", "", "16", "16", "16", "16"],
            },
            {
              label: "中达公路基建项目-1",
              value: ["", "", "", "", "", "16", "16", "16", "16"],
            },
          ],
        },
      },
      {
        open: true,
        resourceInfo: {
          label: "xiaohong",
          value: ["", "", "", "", "", "", "", "", ""],
        },
        resourceUsability: {
          label: "可用性",
          value: ["8", "8", "", "", "8", "-8", "-8", "-8", "-8"],
        },
        resourceAapacity: {
          label: "容量",
          value: ["8", "8", "", "", "8", "8", "8", "8", "8"],
        },
        projectAllocation: {
          open: true,
          label: "项目分配",
          value: ["", "", "", "", "", "16", "16", "16", "16"],
          projectInfo: [
            {
              label: "中达公路基建项目",
              value: ["", "", "", "", "", "8", "8", "8", "8"],
            },
            {
              label: "中达公路基建项目-1",
              value: ["", "", "", "", "", "8", "8", "8", "8"],
            },
          ],
        },
      },
      {
        open: true,
        resourceInfo: {
          label: "xiaolan",
          value: ["", "", "", "", "", "", "", "", ""],
        },
        resourceUsability: {
          label: "可用性",
          value: ["-40", "-40", "", "", "-40", "-40", "-40", "-40", "-40"],
        },
        resourceCapacity: {
          label: "容量",
          value: ["8", "8", "", "", "8", "8", "8", "8", "8"],
        },
        projectAllocation: {
          open: true,
          label: "项目分配",
          value: ["48", "48", "", "", "48", "48", "48", "48", "48"],
          projectInfo: [
            {
              label: "中达公路基建项目",
              value: ["24", "24", "", "", "24", "24", "24", "24", "24"],
            },
            {
              label: "中达公路基建项目-1",
              value: ["24", "24", "", "", "24", "24", "24", "24", "24"],
            },
          ],
        },
      },
    ],
  },
  created() {
    switch (this.workTimeUnit) {
      case "h":
        this.unit = "工时";
        break;
      case "d":
        this.unit = "个工作日";
        break;
      default:
        this.unit = "";
    }
  },
  mounted() {
    // if (props.data) {
    // 	this.dates = props.data.dates
    // 	this.resourceData = props.data.resourceData
    // 	switch(props.data.workTimeUnit){
    // 		case "h":
    // 			this.unit="工时";
    // 			break;
    // 		case "d":
    // 			this.unit="个工作日";
    // 			break;
    // 		default:
    // 			this.unit=""
    // 	}
    // }
  },
  methods: {
    arrowClick(item) {
      item.open = !item.open;
    },
    scrollLeft(e) {
      // console.log(e.target.scrollTop)
      this.$refs.rightInfoBox.scrollTop = e.target.scrollTop;
    },
    scrollRight(e) {
      // console.log(e.target.scrollTop)
      this.$refs.leftInfoBox.scrollTop = e.target.scrollTop;
    },
  },
}).$mount("#resourceLoadTableApp");
