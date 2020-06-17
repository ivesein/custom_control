new Vue({
  delimiters: ["${", "}"],
  data: {
    ifChartShow: true,
    zIndex: -100,
    tableData: [],
    option: {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999",
          },
        },
      },
      legend: {
        // right: "20",
        left: "80",
        top: "0",
        // orient: "vertical",
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
              color: "#7CB5EC",
            },
          },
          {
            name: "xiaohong",
            textStyle: {
              fontSize: 20,
              color: "#434348",
            },
          },
          {
            name: "xiaolan",
            textStyle: {
              fontSize: 20,
              color: "#90ED7D",
            },
          },
        ],
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: true,
        step: "1",
        axisLabel: {
          rotate: 40,
        },
        axisLine: {
          onZero: false, // 设置x轴刻度是否在0位置
        },
        data: [
          "2019/12/19",
          "2019/12/20",
          "2019/12/21",
          // "2019/12/22",
          // "2019/12/23",
          // "2019/12/24",
          // "2019/12/25",
          // "2019/12/26",
          // "2019/12/27",
          // "2019/12/28",
          // "2019/12/29",
          // "2019/12/30",
          // "2019/12/31",
          // "2020/1/1",
          // "2020/1/2",
          // "2020/1/3"
        ],
        axisPointer: {
          type: "shadow",
        },
      },
      yAxis: {
        type: "value",
        name: "h",
        min: -50,
        max: 20,
        nameLocation: "mid",
        nameRotate: 0,
        nameTextStyle: {
          fontSize: 18,
          padding: [0, 80, 0, 0],
        },
      },
      series: [
        {
          name: "容量", //  累计实际完成
          type: "line",
          step: "middle",
          label: {
            normal: {
              show: true,
              position: "top",
            },
          },

          data: [8, 8, 0, 0, 8, -8, -8, -8, -8, 0, 0, -8, -8, -8, -8, -8],
          color: "#7CB5EC",
        },
        {
          name: "xiaohei",
          type: "bar",
          barMaxWidth: 200,
          data: [8, 8, 0, 0, 8, -8, -8, -8, -8, 0, 0, -8, -8, -8, -8, -8],
          color: "#7CB5EC",
        },
        {
          name: "xiaohong",
          type: "bar",
          barMaxWidth: 200,
          data: [
            8,
            8,
            0,
            0,
            8,
            -24,
            -24,
            -24,
            -24,
            0,
            0,
            -24,
            -24,
            -24,
            -24,
            -24,
          ],
          color: "#434348",
        },
        {
          name: "xiaolan",
          type: "bar",
          barMaxWidth: 200,
          data: [
            -40,
            -40,
            0,
            0,
            -40,
            -40,
            -40,
            -40,
            -40,
            0,
            0,
            -40,
            -40,
            -40,
            -40,
            -40,
          ],
          color: "#90ED7D",
        },
      ],
    },
    option2: {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999",
          },
        },
        backgroundColor: "rgba(255,255,255,.9)",
        borderColor: "#333",
        borderWidth: "1",
        formatter(params) {
          console.log(params);
          let date = params[0].name;
          let domStr = "";
          domStr =
            '<div class="tooltip-content"><p style="color:#333">' +
            date +
            "</p>";
          for (x in params) {
            // console.log(x)
            // return params[x].value +"h"
            domStr += `<div class="tooltip-item-box"><p style="color:${
              params[x].color
            }">${
              params[x].seriesName
            }:</p><p style="color:#333;font-weight:600;">${params[
              x
            ].value.toFixed(1)}&nbsp;h</p></div>`;
          }
          // sufFix='</div>'
          domStr += "</div>";
          console.log(domStr);
          return domStr;
        },
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
              color: "#7CB5EC",
            },
          },
          {
            name: "xiaohei",
            textStyle: {
              fontSize: 20,
              color: "#3a3735",
            },
          },
          {
            name: "xiaohong",
            textStyle: {
              fontSize: 20,
              color: "#7cc45c",
            },
          },
          {
            name: "xiaolan",
            textStyle: {
              fontSize: 20,
              color: "#d58744",
            },
          },
        ],
      },
      grid: {
        left: "3%",
        // right: "20%",
        right: "3%",
        bottom: "5%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: true,
        step: "1",
        axisLabel: {
          rotate: 40,
        },
        axisLine: {
          onZero: false, // 设置x轴刻度是否在0位置
        },
        data: [
          "2019/12/19",
          "2019/12/20",
          "2019/12/21",
          "2019/12/22",
          "2019/12/23",
          // "2019/12/24",
          // "2019/12/25",
          // "2019/12/26",
          // "2019/12/27",
          // "2019/12/28",
          // "2019/12/29",
          // "2019/12/30",
          // "2019/12/31",
          // "2020/1/1",
          // "2020/1/2",
          // "2020/1/3",
        ],
        axisPointer: {
          type: "shadow",
        },
      },
      yAxis: {
        type: "value",
        name: "h",
        min: 0,
        max: 120,
        nameLocation: "mid",
        nameRotate: 0,
        nameTextStyle: {
          fontSize: 18,
          padding: [0, 80, 0, 0],
        },
      },
      series: [
        {
          name: "容量", //  累计实际完成
          type: "line",
          step: "middle",
          label: {
            normal: {
              show: true,
              position: "top",
            },
          },

          data: [
            24.0,
            24.0,
            24,
            0,
            0,
            24,
            24,
            24,
            24,
            24,
            0,
            0,
            24,
            24,
            24,
            24,
          ],
          color: "#7CB5EC",
        },
        {
          name: "xiaolan",
          type: "bar",
          barMaxWidth: 150,
          stack: "利用率",
          data: [48.5, 48.5, 48, 0, 0, 48, 48, 48, 48, 48, 0, 0, 48, 0, 0, 0],
          color: "#d58744",
          label: {
            normal: {
              show: true,
              position: "insideTopRight",
              color: "#fff",
            },
          },
        },
        {
          name: "xiaohong",
          type: "bar",
          barMaxWidth: 150,
          stack: "利用率",
          data: [
            16.3,
            16.3,
            16,
            0,
            0,
            16,
            16,
            16,
            16,
            16,
            0,
            0,
            16,
            16,
            16,
            16,
          ],
          color: "#7cc45c",
          label: {
            normal: {
              show: true,
              position: "insideTopRight",
              color: "#fff",
            },
          },
        },
        {
          name: "xiaohei",
          type: "bar",
          barMaxWidth: 150,
          stack: "利用率",
          data: [
            32.2,
            32.2,
            32,
            0,
            0,
            32,
            32,
            32,
            32,
            32,
            0,
            0,
            32,
            32,
            32,
            32,
          ],
          color: "#3a3735",
          label: {
            normal: {
              show: true,
              position: "insideTopRight",
              color: "#fff",
            },
          },
        },
      ],
    },
  },
  created() {},
  mounted() {
    var myChart = echarts.init(
      document.getElementById("resourceUtilizationCharts")
    );
    myChart.setOption(this.option2);
    var myChart2 = echarts.init(
      document.getElementById("remainingAvailabilityCharts")
    );
    myChart2.setOption(this.option);
  },
  methods: {
    btnClick() {
      this.ifChartShow = !this.ifChartShow;
      this.zIndex = this.ifChartShow ? -100 : 100;
    },
  },
}).$mount("#resourceLoadChartsApp");
