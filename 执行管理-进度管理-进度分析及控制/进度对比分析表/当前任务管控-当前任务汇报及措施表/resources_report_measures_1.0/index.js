;(function(KDApi, $) {

  function MyComponent(model) {
    this._setModel(model)
  }

  MyComponent.prototype = {
      // 内部函数不推荐修改
      _setModel: function(model) {
        this.model = model // 内部变量挂载
        this.model.resourcesRMVue = null
      },
      init: function(props) {
        console.log("init---", this.model, props)
        setHtml(this.model, props)
      },
      update: function(props) {
        console.log("-----update", this.model, props)
        if (this.model.resourcesRMVue) {
          this.model.resourcesRMVue.handleUpdata(this.model, props)
        }else{
          setHtml(this.model, props)
        }
      },
      destoryed: function() {
        console.log("-----destoryed", this.model)
        this.model.resourcesRMVue = null
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
                    "./html/resources_report_measures.html",
                    model.schemaId, {
                      path: KDApi.nameSpace(
                        model.schemaId
                      ) + "./img/lock.png"
                    }
                  ).then(function(result) {
                    model.dom.innerHTML = ""
                    model.dom.innerHTML = result

                    model.resourcesRMVue = new Vue({
                      delimiters: ["${", "}"],
                      data: {
                        tableData:[],
                        sendData:[],  //最终发送的差异化数据
                        changedIndex:[], //记录值变更的资源index 
                        decision_making_options:[
                          {
                              measures:"不处理",
                              value:"0",
                          },
                          {
                              measures:"通知加班",
                              value:"1",
                          },
                          {
                              measures:"增加资源",
                              value:"2",
                          },
                          {
                              measures:"减少资源",
                              value:"3",
                          }
                      ],
                      },
                      created() {
                        this.handleUpdata(model,props)
                      },
                      mounted() {
                        
                      },
                      methods: {
                        handleUpdata(model, props) {
                          if (props.data!==undefined) {
                            if(props.data.method==="init"){
                              // 处理禁用状态  添加字段判断
                              props.data.data.forEach((v,k) => {
                                v.disabled=v.decision_making_operation
                                v.index=k
                              });
                              this.tableData=props.data.data
                            }else if(props.data.method==="syncToScheduleMaintenance"){
                              this.syncToSM()
                            }
                          }
                        },
                        // 同步到进度维护，决策操作和措施决策输入判空  差异化处理 接口调用发送数据
                        syncToSM(){
                          // 判断是否每条都做了选择操作和措施输入
                          let flag=this.tableData.every(v => {
                            return v.decision_making_operation!==''&&v.measures_decision!==''
                          });
                          if(flag){
                            //取出差异化的数据
                            this.changedIndex.forEach(v=>{
                              this.sendData.push(this.tableData[v])
                            })
                            // 发送差异化数据
                            model.invoke("syncToScheduleMaintenance",this.sendData)
                          }else{
                            this.$message.error("请确保每一条都选择了决策操作并输入措了施决策！")
                          }
                        },
                        // 当下拉选项变更时记录变更的索引值 用于差异化数据处理
                        selectChange(row){
                            if(!this.changedIndex.includes(row.index)){
                                this.changedIndex.push(row.index)
                            }
                        },  
                        // 当输入框的值变更时记录变更的索引值 用于差异化数据处理
                        inputChange(row){
                            console.log(row)
                            if(!this.changedIndex.includes(row.index)){
                                this.changedIndex.push(row.index)
                            }
                        },
                        cellStyle({ row, column, rowIndex, columnIndex }) {
                          if (columnIndex === 0) {
                            // console.log(column)
                            return "padding: 0px!important;"
                          }
                        },
                      }
                    }).$mount($("#resourcesRMApp", model.dom).get(0))
                  })
                }
              )
            })
        })
      })
    })
  }

  // 注册自定义控件
  KDApi.register("resources_report_measures_v1.0", MyComponent)
})(window.KDApi, jQuery)