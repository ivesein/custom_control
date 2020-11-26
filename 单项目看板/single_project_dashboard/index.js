(function (KDApi, $) {
  var resourceLoadChartOption1 = {
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
        "2020/1/3",
      ],
      axisPointer: {
        type: "shadow",
      },
    },
    yAxis: {
      type: "value",
      name: "h",
      // min: -50,
      // max: 20,
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

        data: [24, 24, 24, 0, 0, 24, 24, 24, 24, 24, 0, 0, 24, 24, 24, 24],
        color: "#7CB5EC",
      },
      {
        name: "xiaohei",
        type: "bar",
        barMaxWidth: 150,
        data: [8, 8, 0, 0, 8, -8, -8, -8, -8, 0, 0, -8, -8, -8, -8, -8],
        color: "#7CB5EC",
      },
      {
        name: "xiaohong",
        type: "bar",
        barMaxWidth: 150,
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
        barMaxWidth: 150,
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
  };
  function MyComponent(model) {
    this._setModel(model);
  }
  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.spdbVueApp = null;
    },
    init: function (props) {
      // console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      // var tData = JSON.parse(props.data)
      // console.log("-----update", this.model, props);
      if (this.model.spdbVueApp) {
        this.model.spdbVueApp.handleUpdate(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      // console.log("-----destoryed", this.model);
      this.model.spdbVueApp = null;
    },
  };
  /**
   *@description 第一次打开页面加载相关依赖前端文件
   *
   * @param {*} model 金蝶内建对象model
   */
  var setHtml = function (model, props) {
    KDApi.loadFile("./css/element.css", model.schemaId, function () {
      KDApi.loadFile("./css/main.css", model.schemaId, function () {
        KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
          KDApi.loadFile("./js/echarts.min.js", model.schemaId, function () {
            KDApi.loadFile("./js/element.js", model.schemaId, function () {
              KDApi.templateFilePath(
                "./html/single_project_dashboard.html",
                model.schemaId,
                {
                  path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
                }
              ).then(function (result) {
                model.dom.innerHTML = result;
                // model.invoke("initData", '') //初始化
                // console.log(props.data);

                model.spdbVueApp = new Vue({
                  delimiters: ["${", "}"],
                  data: {
                    option2: null,
                  },
                  mounted() {
                    this.handleUpdate(model, props);
                  },
                  methods: {
                    handleUpdate(model, props) {
                      if (props.data) {
                        var myChart2 = echarts.init(
                          document.getElementById("remainingAvailabilityCharts")
                        );
                        myChart2.setOption(this.option1);
                      }
                    },
                  },
                }).$mount($("#spdbApp", model.dom).get(0));
              });
            });
          });
        });
      });
    });
  };
  // 注册自定义控件
  KDApi.register("single_project_dashboard", MyComponent);
})(window.KDApi, jQuery);
