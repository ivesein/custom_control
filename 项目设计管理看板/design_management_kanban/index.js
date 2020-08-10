(function (KDApi, $) {
  function MyComponent(model) {
    this._setModel(model);
  }

  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.designManagementApp = null;
    },
    init: function (props) {
      console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      console.log("-----update", this.model, props);
      if (this.model.designManagementApp) {
        this.model.designManagementApp.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.designManagementApp = null;
    },
  };
  var setHtml = function (model, props) {
    KDApi.loadFile("./css/element.css", model.schemaId, function () {
      KDApi.loadFile("./css/main.css", model.schemaId, function () {
        KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
          KDApi.loadFile("./js/lodash.js", model.schemaId, function () {
            KDApi.loadFile("./js/element.js", model.schemaId, function () {
              KDApi.templateFilePath(
                "./html/check_records.html",
                model.schemaId,
                {
                  path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
                }
              ).then(function (result) {
                model.dom.innerHTML = "";
                model.dom.innerHTML = result;
                model.designManagementApp = new Vue({
                  delimiters: ["${", "}"],
                  data: {
                    tableData: [],
                    currentPage: 1,
                    totalPage: 1,
                    projectName: "",
                  },
                  created() {
                    this.handleUpdata(model, props);
                  },
                  computed: {
                    sliceTableData() {
                      return this.tableData.slice(
                        (this.currentPage - 1) * 6,
                        this.currentPage * 6
                      );
                    },
                  },
                  methods: {
                    handleUpdata(model, props) {
                      if (
                        props.data !== undefined &&
                        props.data !== null &&
                        props.data !== ""
                      ) {
                        if (props.data.method === "init") {
                          this.projectName = props.data.data.projectName;
                          this.tableData = props.data.data.tableData || [];
                          this.totalPage = Math.ceil(this.tableData.length / 6);
                        }
                      }
                      // TODO 处理数据更新  复制已阅读 和未阅读
                    },
                    prevBtn() {
                      if (this.currentPage > 1) {
                        this.currentPage--;
                      } else {
                        return;
                      }
                    },
                    nextBtn() {
                      if (this.currentPage < this.totalPage) {
                        this.currentPage++;
                      } else {
                        return;
                      }
                    },
                    tableRowClassName({ row, rowIndex }) {
                      if (rowIndex % 2 === 1) {
                        return "warning-row";
                      }
                    },
                  },
                }).$mount($("#designManagementApp", model.dom).get(0));
              });
            });
          });
        });
      });
    });
  };
  // 注册自定义控件
  KDApi.register("design_management_kanban", MyComponent);
})(window.KDApi, jQuery);
