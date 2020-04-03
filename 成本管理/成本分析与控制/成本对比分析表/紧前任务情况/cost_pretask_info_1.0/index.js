;(function(KDApi, $) {

  function MyComponent(model) {
    this._setModel(model)
  }

  MyComponent.prototype = {
      // 内部函数不推荐修改
      _setModel: function(model) {
        this.model = model // 内部变量挂载
        this.model.costPretaskInfoVue = null
      },
      init: function(props) {
        console.log("init---", this.model, props)
        setHtml(this.model, props)
      },
      update: function(props) {
        console.log("-----update", this.model, props)
        if (props.data && props.data.isInit) {
          this.model.costPretaskInfoVue = null
          setHtml(this.model, props)
        }
        console.log(this.model.costPretaskInfoVue)
        if (this.model.costPretaskInfoVue) {
          this.model.costPretaskInfoVue.handleUpdata(this.model, props)
        }
      },
      destoryed: function() {
        console.log("-----destoryed", this.model)
        this.model.costPretaskInfoVue = null
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
                    "./html/cost_pretask_info.html",
                    model.schemaId, {
                      path: KDApi.nameSpace(
                        model.schemaId
                      ) + "./img/lock.png"
                    }
                  ).then(function(result) {
                    model.dom.innerHTML = ""
                    model.dom.innerHTML = result

                    model.costPretaskInfoVue = new Vue({
                      delimiters: ["${", "}"],
                      data: {

                      },
                      created() {},
                      mounted() {
                        // 固定表格表头 设置表格高度自适应填满剩余高度
                        // this.$nextTick(function() {
                        //   this.tableHeight = window.innerHeight - this.$refs.qualityPlanTable.$el.offsetTop - 60

                        //   // 监听窗口大小变化
                        //   let self = this;
                        //   window.onresize = function() {
                        //     self.tableHeight = window.innerHeight - self.$refs.qualityPlanTable.$el.offsetTop - 60
                        //   }
                        // })
                      },
                      methods: {
                        handleUpdata(model, props) {
                          if (props.data) {
                          
                          }
                        },
                      }
                    }).$mount($("#costPretaskInfoApp", model.dom).get(0))
                  })
                }
              )
            })
        })
      })
    })
  }

  // 注册自定义控件
  KDApi.register("cost_ca_v1.0", MyComponent)
})(window.KDApi, jQuery)