// var qualityPlanVue = null

;
(function(KDApi, $) {
  function MyComponent(model) {
    this._setModel(model)
  }

  MyComponent.prototype = {
      // 内部函数不推荐修改
      _setModel: function(model) {
        this.model = model // 内部变量挂载
        this.model.wbsPlanningVue = null
      },
      init: function(props) {
        console.log("init---", this.model, props)
        setHtml(this.model, props)
      },
      update: function(props) {
        console.log("-----update", this.model, props)
        if (props.data && props.data.isInit) {
          this.model.wbsPlanningVue = null
          setHtml(this.model, props)
        }
        console.log(this.model.wbsPlanningVue)
        if (this.model.wbsPlanningVue) {
          this.model.wbsPlanningVue.handleUpdata(this.model, props)
        }
      },
      destoryed: function() {
        console.log("-----destoryed", this.model)
        this.model.wbsPlanningVue = null
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
          KDApi.loadFile("./js/vue.js", model.schemaId, function() {
            KDApi.loadFile("./js/lodash.js", model.schemaId, function() {
              KDApi.loadFile(
                "./js/element.js",
                model.schemaId,
                function() {
                  KDApi.templateFilePath(
                    "./html/wbs_planning.html",
                    model.schemaId, {
                      path: KDApi.nameSpace(
                        model.schemaId
                      ) + "./img/lock.png"
                    }
                  ).then(function(result) {
                    model.dom.innerHTML = ""
                    model.dom.innerHTML = result
                    let resData=props.data
                    model.wbsPlanningVue = new Vue({
                      delimiters: ["${", "}"],
                      data: {
                        activeName: 'first',
                        addNewTaskSelectionOptions: [{
                          value: '1',
                          label: '新增工作包'
                        }, {
                          value: '2',
                          label: '新增摘要任务'
                        }, {
                          value: '3',
                          label: '新增专业审核'
                        }],
                        addNewTaskValue: '', //新增下拉框所选值
                        tableData: [],
                        scheduleData:[],//进度表格数据
                        contractData:[],//委外合同表格数据
                        qualityData:[], //质量表格数据
                        costData:[], //成本表格数据
                        multipleSelection: [],
                        allChecked: false,
                        allItems: null,
                        isIndeterminate: false,
                        tableHeight: 800
                      },
                      created() {
                        if(resData!==undefined){
                          this.scheduleData=resData.data.scheduleData
                          this.qualityData=resData.data.qualityData
                          this.contractData=resData.data.contractData
                          this.costData=resData.data.costData
                        }
                        
                      },
                      mounted() {
                        // 固定表格表头 设置表格高度自适应填满剩余高度
                        this.$nextTick(function() {
                          this.tableHeight = window.innerHeight - this.$refs.qualityPlanTable.$el.offsetTop - 60

                          // 监听窗口大小变化
                          let self = this;
                          window.onresize = function() {
                            self.tableHeight = window.innerHeight - self.$refs.qualityPlanTable.$el.offsetTop - 60
                          }
                        })
                      },
                      methods: {
                        handleUpdata(model, props) {
                          if (props.data) {
                              this.updataData(props.data.data)
                          }
                        },
                        updataData(data) {
                          this.scheduleData=data.scheduleData||[]
                          this.qualityData=data.qualityData||[]
                          this.contractData=data.contractData||[]
                          this.costData=data.costData||[]
                        },
                        handleTabClick(tab, event) {
                          console.log(tab, event);
                        },
                        cellStyle({
                          row,
                          column,
                          rowIndex,
                          columnIndex
                        }) {
                          if (columnIndex === 0) {
                            // console.log(column)
                            return "padding: 0px!important;"
                          }
                        },
                      }
                    }).$mount($("#wbsPlanningApp", model.dom).get(0))
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
  KDApi.register("wbs_planning_v1.0", MyComponent)
})(window.KDApi, jQuery)