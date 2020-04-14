;(function(KDApi, $) {

  function MyComponent(model) {
    this._setModel(model)
  }

  MyComponent.prototype = {
      // 内部函数不推荐修改
      _setModel: function(model) {
        this.model = model // 内部变量挂载
        this.model.reportDLVue = null
      },
      init: function(props) {
        console.log("init---", this.model, props)
        setHtml(this.model, props)
      },
      update: function(props) {
        console.log("-----update", this.model, props)
        if (this.model.reportDLVue) {
          this.model.reportDLVue.handleUpdata(this.model, props)
        }else{
          setHtml(this.model, props)
        }
      },
      destoryed: function() {
        console.log("-----destoryed", this.model)
        this.model.reportDLVue = null
      }
    }
    /**
     *@description 第一次打开页面加载相关依赖前端文件
     *
     * @param {*} model 金蝶内建对象model
     */
  var setHtml = function(model, props) {
    KDApi.loadFile("./css/element.css", model.schemaId, function() {
      KDApi.loadFile("./css/main.css", model.schemaId, function() {
        KDApi.loadFile("./js/vue.min.js", model.schemaId, function() {
            KDApi.loadFile("./js/lodash.js", model.schemaId, function() {
              KDApi.loadFile(
                "./js/element.js",
                model.schemaId,
                function() {
                  KDApi.templateFilePath(
                    "./html/report_detail_list.html",
                    model.schemaId, {
                      path: KDApi.nameSpace(
                        model.schemaId
                      ) + "./img/lock.png"
                    }
                  ).then(function(result) {
                    model.dom.innerHTML = ""
                    model.dom.innerHTML = result

                    model.reportDLVue = new Vue({
                      delimiters: ["${", "}"],
                      data: {
                        tableData:[],
                      },
                      created() {
                        this.handleUpdata(model,props)
                      },
                      mounted() {
                        
                      },
                      methods: {
                        handleUpdata(model, props) {
                          if (props.data!==undefined) {
                            this.tableData=props.data.data
                          }
                        },
                        cellStyle({ row, column, rowIndex, columnIndex }) {
                          if (columnIndex === 0) {
                            // console.log(column)
                            return "padding: 0px!important;"
                          }
                        },
                      }
                    }).$mount($("#reportDLApp", model.dom).get(0))
                  })
                }
              )
            })
        })
      })
    })
  }

  // 注册自定义控件
  KDApi.register("report_detail_list_v1.0", MyComponent)
})(window.KDApi, jQuery)