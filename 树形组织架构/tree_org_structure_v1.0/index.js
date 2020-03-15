;(function(KDApi, $) {

  function MyComponent(model) {
    this._setModel(model)
  }

  MyComponent.prototype = {
      // 内部函数不推荐修改
      _setModel: function(model) {
        this.model = model // 内部变量挂载
        this.model.treeOrgStructureApp = null
      },
      init: function(props) {
        console.log("init---", this.model, props)
        setHtml(this.model, props)
      },
      update: function(props) {
        console.log("-----update", this.model, props)
        console.log(this.model.treeOrgStructureApp)
        if (this.model.treeOrgStructureApp) {
          this.model.treeOrgStructureApp.handleUpdata(this.model, props)
        }else{
          setHtml(this.model, props)
        }
      },
      destoryed: function() {
        console.log("-----destoryed", this.model)
        this.model.treeOrgStructureApp = null
      }
    }
  var setHtml = function(model, props) {
    KDApi.loadFile("./css/element.css", model.schemaId, function() {
      KDApi.loadFile("./css/main.css", model.schemaId, function() {
        KDApi.loadFile("./js/vue.min.js", model.schemaId, function() {
          KDApi.loadFile("./js/vue.js", model.schemaId, function() {
            KDApi.loadFile("./js/lodash.js", model.schemaId, function() {
              KDApi.loadFile(
                "./js/element.js",
                model.schemaId,
                function() {
                  KDApi.templateFilePath(
                    "./html/check_records.html",
                    model.schemaId, {
                      path: KDApi.nameSpace(
                        model.schemaId
                      ) + "./img/lock.png"
                    }
                  ).then(function(result) {
                    model.dom.innerHTML = ""
                    model.dom.innerHTML = result
                    model.checkRecordsVue = new Vue({
                      delimiters: ["${", "}"],
                      data: {
                       
                      },
                      created() {
                        if (props.data!==undefined) {
                          
                        }
                      },
                      methods: {
                        handleUpdata(model, props){
                          // TODO 处理数据更新  
                          if(props.data!==undefined){
                            
                          }
                        }
                      }
                    }).$mount($("#treeOrgStructureApp", model.dom).get(0))
                  })
                }
              )
            })
          })
        })
      })
    })
  }
  // 注册自定义控件
  KDApi.register("check_records_v1.0", MyComponent)
})(window.KDApi, jQuery)