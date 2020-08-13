(function (KDApi, $) {
  function MyComponent(model) {
    this._setModel(model);
  }

  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.projectBriefApp = null;
    },
    init: function (props) {
      console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      console.log("-----update", this.model, props);
      if (this.model.projectBriefApp) {
        this.model.projectBriefApp.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.projectBriefApp = null;
    },
  };
  var setHtml = function (model, props) {
    KDApi.loadFile("./css/element.css", model.schemaId, function () {
      KDApi.loadFile("./css/main.css", model.schemaId, function () {
        KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
          KDApi.loadFile("./js/lodash.js", model.schemaId, function () {
            KDApi.loadFile("./js/element.js", model.schemaId, function () {
              KDApi.templateFilePath(
                "./html/project_brief.html",
                model.schemaId,
                {
                  path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
                }
              ).then(function (result) {
                model.dom.innerHTML = "";
                model.dom.innerHTML = result;
                model.projectBriefApp = new Vue({
                  delimiters: ["${", "}"],
                  data: {
                    tableData: [],
                    currentPage: 1,
                    totalPage: 1,
                    numPerPage: 2,
                  },
                  created() {
                    this.handleUpdata(model, props);
                  },
                  computed: {
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-08-10
                     * @Description: 处理数据  前端进行分页 写分页处理逻辑
                     */
                    sliceTableData() {
                      return this.tableData.slice(
                        (this.currentPage - 1) * this.numPerPage,
                        this.currentPage * this.numPerPage
                      );
                    },
                  },
                  methods: {
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-08-10
                     * @Description: 项目简况 接口数据交互及处理
                     */
                    handleUpdata(model, props) {
                      if (
                        props.data !== undefined &&
                        props.data !== null &&
                        props.data !== ""
                      ) {
                        if (props.data.method === "init") {
                          this.tableData = props.data.data || [];
                          this.totalPage = Math.ceil(
                            this.tableData.length / this.numPerPage
                          );
                        }
                      }
                      // TODO 处理数据更新  复制已阅读 和未阅读
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-08-10
                     * @Description: 上一页按钮处理方法
                     */
                    prevBtn() {
                      if (this.currentPage > 1) {
                        this.currentPage--;
                      }
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-08-10
                     * @Description: 下一页按钮处理方法
                     */
                    nextBtn() {
                      if (this.currentPage < this.totalPage) {
                        this.currentPage++;
                      }
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-08-10
                     * @Description: 表格按设计图添加斑马纹
                     */
                    tableRowClassName({ row, rowIndex }) {
                      if (rowIndex % 2 === 1) {
                        return "warning-row";
                      }
                    },
                  },
                }).$mount($("#projectBriefApp", model.dom).get(0));
              });
            });
          });
        });
      });
    });
  };
  // 注册自定义控件
  KDApi.register("project_brief", MyComponent);
})(window.KDApi, jQuery);
