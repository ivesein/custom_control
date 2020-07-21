(function (KDApi, $) {
  function MyComponent(model) {
    this._setModel(model);
  }

  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.ctaskCostControlVue = null;
    },
    init: function (props) {
      console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      console.log("-----update", this.model, props);
      if (this.model.ctaskCostControlVue) {
        this.model.ctaskCostControlVue.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.ctaskCostControlVue = null;
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
                "./html/ctask_cost_control.html",
                model.schemaId,
                {
                  path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
                }
              ).then(function (result) {
                model.dom.innerHTML = "";
                model.dom.innerHTML = result;

                model.ctaskCostControlVue = new Vue({
                  delimiters: ["${", "}"],
                  data: {
                    ifTableOneShow: true,
                    ifTableTwoShow: true,
                    tableData1: [],
                    tableData2: [],
                    currentType: "", //当前页面状态  "0":进行中   "1":已完成
                  },
                  created() {
                    this.handleUpdata(model, props);
                  },
                  mounted() {},
                  methods: {
                    iconArrowClick1() {
                      this.ifTableOneShow = !this.ifTableOneShow;
                    },
                    iconArrowClick2() {
                      this.ifTableTwoShow = !this.ifTableTwoShow;
                    },
                    handleUpdata(model, props) {
                      // 金蝶后台updata方法发送参数 根据接口方法处理相应参数
                      if (props.data !== undefined) {
                        switch (props.data.method) {
                          case "init":
                            this.tableData1 = props.data.data.planResourcesData;
                            this.tableData2 =
                              props.data.data.resourcesReportData;
                            this.currentType = props.data.type;
                            break;
                          case "cTaskCostControlSave":
                            this.saveData();
                            break;
                          case "syncToCostMaintenance":
                            this.syncToCM();
                            break;
                          default:
                            this.$message.error("数据获取失败，请稍后再试...");
                        }
                      }
                    },
                    // 保存按钮数据交互方法封装
                    saveData() {
                      model.invoke("cTaskCostControlSave", this.tableData2);
                    },
                    // 同步到成本维护按钮数据交互方法封装
                    syncToCM() {
                      // 判断当前页面状态 已完成不许要同步
                      if (this.currentType === "1") {
                        this.$message.warning("已完成页面的数据不需要同步!");
                      } else {
                        if (this.tableData2.length === 0) {
                          this.$message.warning("没有可用于同步的数据!");
                        } else {
                          // 判断是否每条资源汇报都填写了纠偏措施
                          let flag = this.tableData2.every((v) => {
                            return v.rectification_measures !== "";
                          });
                          if (flag) {
                            model.invoke(
                              "syncToCostMaintenance",
                              this.tableData2
                            );
                          } else {
                            this.$message.error(
                              "请确保每一条任务资源汇报详情都输入了纠偏措施!"
                            );
                          }
                        }
                      }
                    },
                    cellStyle({ row, column, rowIndex, columnIndex }) {
                      if (columnIndex === 0) {
                        // console.log(column)
                        return "padding: 0px!important;";
                      }
                    },
                  },
                }).$mount($("#ctaskCostControlApp", model.dom).get(0));
              });
            });
          });
        });
      });
    });
  };

  // 注册自定义控件
  KDApi.register("ctask_cost_control", MyComponent);
})(window.KDApi, jQuery);
