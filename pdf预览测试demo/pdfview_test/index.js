/**
 *@author  zhang fuqiang
 *@date  2020-10-12
 *@description  远程pdf文件预览自定义控件测试demo 
 配合史雄遥实现预览其后台转换后的pdf文件 以及交互
 */
(function (KDApi, $) {
  function MyComponent(model) {
    this._setModel(model);
  }

  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.pdfViewVue = null;
    },
    init: function (props) {
      console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      console.log("-----update", this.model, props);
      console.log(this.model.pdfViewVue);
      if (this.model.pdfViewVue) {
        this.model.pdfViewVue.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.pdfViewVue = null;
    },
  };
  var setHtml = function (model, props) {
    KDApi.loadFile("./css/element.css", model.schemaId, function () {
      KDApi.loadFile("./css/main.css", model.schemaId, function () {
        KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
          KDApi.loadFile("./js/vue.js", model.schemaId, function () {
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
                  model.checkRecordsVue = new Vue({
                    delimiters: ["${", "}"],
                    data: {
                      baseUrl: "",
                      pdfUrl: "",
                    },
                    created() {
                      if (props.data !== undefined) {
                      }
                    },
                    methods: {
                      handleUpdata(model, props) {
                        // TODO 处理数据更新  复制已阅读 和未阅读
                        if (props.data !== undefined) {
                          this.baseUrl = props.data.baseUrl;
                          this.pdfUrl = props.data.pdfUrl;
                          window.open(
                            encodeURIComponent(
                              this.baseUrl +
                                "/pdf/web/viewer.html?file=" +
                                this.pdfUrl
                            ),
                            "PDF",
                            "width:50%;height:50%;top:100;left:100;"
                          );
                        }
                      },
                    },
                  }).$mount($("#checkRecordsApp", model.dom).get(0));
                });
              });
            });
          });
        });
      });
    });
  };
  // 注册自定义控件
  KDApi.register("pdfview_test", MyComponent);
})(window.KDApi, jQuery);
