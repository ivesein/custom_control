(function (KDApi, $) {
  function MyComponent(model) {
    this._setModel(model);
  }

  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.costPretaskInfoVue = null;
    },
    init: function (props) {
      console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      console.log("-----update", this.model, props);
      if (this.model.costPretaskInfoVue) {
        this.model.costPretaskInfoVue.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.costPretaskInfoVue = null;
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
                "./html/cost_pretask_info.html",
                model.schemaId,
                {
                  path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
                }
              ).then(function (result) {
                model.dom.innerHTML = "";
                model.dom.innerHTML = result;

                model.costPretaskInfoVue = new Vue({
                  delimiters: ["${", "}"],
                  data: {
                    ifSelectBoxShow: false,
                    proTableData: [],
                    beforeTaskInfo: {
                      open: true,
                      title: "紧前任务对当前任务影响情况",
                      data: [],
                    },
                    currentTaskInfo: {
                      title: "当前任务情况",
                      task_status: "1",
                      open: true,
                      data: [],
                    },
                    earnedValueAnalysisSuggestions: {
                      title: "当前任务挣值数据分析",
                      open: true,
                      data: [],
                    },
                    followTaskProcessing: {
                      title: "后续任务处理",
                      open: true,
                      data: [],
                    },
                    tableWidth: "100%",
                    messageBoxShow: false,
                    messageData: [],
                    currentTask: null,
                  },
                  created() {
                    this.handleUpdata(model, props);
                  },
                  mounted() {
                    let self = this;
                    this.$nextTick(function () {
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
                        if (props.data.method === "init") {
                          this.proTableData = props.data.data || [];
                        } else if (
                          props.data.method === "getClickedTaskDetailData"
                        ) {
                          this.beforeTaskInfo.data =
                            props.data.data.beforeTaskInfo || [];
                          this.currentTaskInfo.data =
                            props.data.data.currentTaskInfo || [];
                          this.earnedValueAnalysisSuggestions.data =
                            props.data.data.earnedValueAnalysisSuggestions ||
                            [];
                          this.followTaskProcessing.data =
                            props.data.data.followTaskProcessing || [];
                        } else {
                          this.$message.warning("获取数据失败，请稍后再试...");
                        }
                      }
                    },
                    cellStyle({ row, column, rowIndex, columnIndex }) {
                      if (columnIndex === 0) {
                        // console.log(column)
                        return "padding: 0px!important;";
                      }
                    },
                    iconArrowClick1(data) {
                      data.open = !data.open;
                    },
                    iconArrowClick2(data) {
                      data.open = !data.open;
                    },
                    iconArrowClick3(data) {
                      data.open = !data.open;
                    },
                    iconArrowClick4(data) {
                      data.open = !data.open;
                    },
                    messageConfirm() {
                      this.messageBoxShow = false;
                    },
                    resetData() {
                      this.beforeTaskInfo.data = [];
                      this.currentTaskInfo.data = [];
                      this.earnedValueAnalysisSuggestions.data = [];
                      this.followTaskProcessing.data = [];
                    },
                    currentTaskClick(row) {
                      this.resetData();
                      this.currentTask = row;
                      model.invoke("getClickedTaskDetailData", row.id);
                    },
                  },
                }).$mount($("#costPretaskInfoApp", model.dom).get(0));
              });
            });
          });
        });
      });
    });
  };

  // 注册自定义控件
  KDApi.register("cost_pretask_info", MyComponent);
})(window.KDApi, jQuery);
