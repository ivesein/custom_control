(function (KDApi, $) {
  function MyComponent(model) {
    this._setModel(model);
  }

  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.qualityACApp = null;
    },
    init: function (props) {
      console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      console.log("-----update", this.model, props);
      // if (props.data && props.data.isInit) {
      //   this.model.qualityACVue = null
      //   setHtml(this.model, props)
      // }
      // console.log(this.model.qualityACVue)
      if (this.model.qualityACVue) {
        this.model.qualityACVue.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.qualityACVue = null;
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
          KDApi.loadFile("./js/lodash.js", model.schemaId, function () {
            KDApi.loadFile("./js/element.js", model.schemaId, function () {
              KDApi.templateFilePath(
                "./html/quality_analysis_control.html",
                model.schemaId,
                {
                  path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
                }
              ).then(function (result) {
                model.dom.innerHTML = "";
                model.dom.innerHTML = result;

                model.qualityACVue = new Vue({
                  delimiters: ["${", "}"],
                  data: {
                    proTableData: [],
                    tableWidth: "100%",
                    currentTask: [],
                    diffData: [], //差异化数据
                  },
                  created() {
                    this.handleUpdata(model, props);
                  },
                  mounted() {
                    let self = this;
                    this.$nextTick(function () {
                      // this.tableHeight = window.innerHeight - this.$refs.qualityPlanTable.$el.offsetTop - 10
                      self.tableWidth =
                        self.$refs.projectTable.$el.clientWidth + "px";
                      console.log(self.tableWidth);
                      // 监听窗口大小变化

                      window.onresize = function () {
                        self.tableWidth =
                          self.$refs.projectTable.$el.clientWidth + "px";
                      };
                    });
                  },
                  methods: {
                    handleUpdata(model, props) {
                      if (props.data !== undefined) {
                        if (props.data.method === "initqualityAnalysisData") {
                          // 获取左侧表格任务列表数据
                          this.proTableData = props.data.data;
                        } else if (props.data.method === "getSyschronizeData") {
                          // 发送差异化数据到后台
                          model.invoke("getSyschronizeData", this.diffData);
                        }
                      }
                    },
                    cellStyle({ row, column, rowIndex, columnIndex }) {
                      if (columnIndex === 0) {
                        // console.log(column)
                        return "padding: 0px!important;";
                      }
                    },
                    currentTaskClick(row) {
                      console.log(row);
                      row.DValue = this.getDaysBetween(
                        row.plan_endtime,
                        row.end_time
                      );
                      this.currentTask = [];
                      this.currentTask.push(row);
                    },
                    // 计算两个日期的偏差值差值
                    getDaysBetween(dateString1, dateString2) {
                      var startDate = Date.parse(dateString1);
                      var endDate = Date.parse(dateString2);
                      var days = (endDate - startDate) / (60 * 60 * 1000);
                      if (Number.isNaN(days)) {
                        return "";
                      } else {
                        return days.toFixed(2);
                      }
                    },
                    reasonChange(val) {
                      this.setDiffData();
                    },
                    actionChange(val) {
                      this.setDiffData();
                    },
                    // 存储差异化值 判断如果已存了该条任务差异化数据  则替换  没有则增加
                    setDiffData() {
                      let index = null;
                      this.diffData.forEach((v, k) => {
                        if (v.task_id === this.currentTask[0].task_id) {
                          index = k;
                        }
                      });
                      if (index !== null) {
                        this.diffData[index] = this.currentTask[0];
                      } else {
                        this.diffData.push(this.currentTask[0]);
                      }
                    },
                  },
                }).$mount($("#qualityACApp", model.dom).get(0));
              });
            });
          });
        });
      });
    });
  };

  // 注册自定义控件
  KDApi.register("quality_ac_v1.0", MyComponent);
})(window.KDApi, jQuery);
