/**
  *@author  zhang fuqiang
  *@date  2020-02-07  
  *@description  头像墙自定义控件js
 */
;(function(KDApi, $) {

  function MyComponent(model) {
    this._setModel(model)
  }

  MyComponent.prototype = {
      // 内部函数不推荐修改
      _setModel: function(model) {
        this.model = model // 内部变量挂载
        this.model.checkRecordsVue = null
      },
      init: function(props) {
        console.log("init---", this.model, props)
        setHtml(this.model, props)
      },
      update: function(props) {
        console.log("-----update", this.model, props)
        console.log(this.model.checkRecordsVue)
        if (this.model.checkRecordsVue) {
          this.model.checkRecordsVue.handleUpdata(this.model, props)
        }else{
          setHtml(this.model, props)
        }
      },
      destoryed: function() {
        console.log("-----destoryed", this.model)
        this.model.checkRecordsVue = null
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
                        default_img:"data:image/png;base64,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",
                        readArr:[],
                        unreadArr:[]
                      },
                      created() {
                        if (props.data!==undefined) {
                          this.readArr=props.data.readArr
                          this.unreadArr=props.data.unreadArr
                        }
                      },
                      methods: {
                        handleUpdata(model, props){
                          // TODO 处理数据更新  复制已阅读 和未阅读
                          if(props.data!==undefined){
                            this.readArr=props.data.readArr
                            this.unreadArr=props.data.unreadArr
                          }
                        },
                        // 处理图片连接加载失败  替换为默认图片
                        errorHandler(){
                          return true
                        }
                      }
                    }).$mount($("#checkRecordsApp", model.dom).get(0))
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