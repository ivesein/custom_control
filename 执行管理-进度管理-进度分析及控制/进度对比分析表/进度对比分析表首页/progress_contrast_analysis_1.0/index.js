;(function(KDApi, $) {

  function MyComponent(model) {
    this._setModel(model)
  }

  MyComponent.prototype = {
      // 内部函数不推荐修改
      _setModel: function(model) {
        this.model = model // 内部变量挂载
        this.model.progressCAVue = null
      },
      init: function(props) {
        console.log("init---", this.model, props)
        setHtml(this.model, props)
      },
      update: function(props) {
        console.log("-----update", this.model, props)
        if (props.data && props.data.isInit) {
          this.model.progressCAVue = null
          setHtml(this.model, props)
        }
        console.log(this.model.progressCAVue)
        if (this.model.progressCAVue) {
          this.model.progressCAVue.handleUpdata(this.model, props)
        }
      },
      destoryed: function() {
        console.log("-----destoryed", this.model)
        this.model.progressCAVue = null
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
                    "./html/progress_contrast_analysis.html",
                    model.schemaId, {
                      path: KDApi.nameSpace(
                        model.schemaId
                      ) + "./img/lock.png"
                    }
                  ).then(function(result) {
                    model.dom.innerHTML = ""
                    model.dom.innerHTML = result

                    model.processCAVue = new Vue({
                      delimiters: ["${", "}"],
                      data: {
                        ifSelectBoxShow:false,
                        proTableData:[
                          {
                            wbs:"G",
                            task_name:"工作5",
                            owner:"张三",
                            is_certical_task:true,
                            task_status:"1",  //1 未开始  2 进行中  3 已完成
                            handle_status:"0"  // 0 待处理  1 已处理
                          },
                          {
                            wbs:"H",
                            task_name:"工作6",
                            owner:"李四",
                            is_certical_task:true,
                            task_status:"2",
                            handle_status:"0"
                          },
                          {
                            wbs:"L",
                            task_name:"工作7",
                            owner:"王五",
                            is_certical_task:false,
                            task_status:"3",
                            handle_status:"1"   
                          },
                          {
                            wbs:"I",
                            task_name:"工作8",
                            owner:"马六",
                            is_certical_task:true,
                            task_status:"3",
                            handle_status:"1"   
                          }
                        ],
                        beforeTaskInfo:{
                          open:true,
                          title:"紧前任务对当前任务影响情况",
                          data:[
                            {before_task_name:"工作4",handling_measures:"成本压缩100元"}
                          ]
                        },
                        currentTaskInfo:{
                          title:"当前任务情况",
                          task_status:"1",
                          open:true,
                          data:[
                            {
                              plan_duration:"10", //计划工期
                              plan_quantities:"150", //计划工程量
                              duration_after_adjustment:"12", //调整后工期
                              actual_duration:"15",  //实际工期
                              actual_quantities:"170",  //实际工程量
                              free_time:0,  //自由时差
                              free_time_exceed:0, //超出自由时差
                              free_time_analysis_conclusion:"自由时差分析结论", //自由时差分析结论 
                              total_time:0, //总时差
                              // plan_cost:250,
                              // cost_after_adjustment:150,
                              // actual_cost:100
                              total_time_exceed:0, //超出总时差
                              total_time_analysis_conclusion:"总时差分析结论", //总时差分析结论 
                            }
                          ]
                        },
                        earnedValueAnalysisSuggestions:{
                          title:"挣值分析及建议",
                          open:true,
                          data:[],
                        },
                        followTaskProcessing:{
                          title:"后续任务处理",
                          open:true,
                          data:[
                            {
                              follow_task_name:"",
                              handling_measures:"请输入处理措施"
                            }
                          ]
                        },
                        tableWidth:'100%',
                        messageBoxShow:true,
                        messageData:[
                          {
                            task_name:"p4挖土",
                            task_status:'1'  //1 已完成  2 已滞后
                          },
                          {
                            task_name:"p5挖土",
                            task_status:'2'  //1 已完成  2 已滞后
                          },
                          {
                            task_name:"p6挖土",
                            task_status:'2'  //1 已完成  2 已滞后
                          },
                          
                        ]
                      },
                      created() {},
                      mounted() {
                        let self = this;
                        this.$nextTick(function() {
                          // this.tableHeight = window.innerHeight - this.$refs.qualityPlanTable.$el.offsetTop - 10
                          self.tableWidth=self.$refs.projectTable.$el.clientWidth+'px'
                          console.log(self.tableWidth)
                          // 监听窗口大小变化
                          window.onresize = function() {
                            self.tableWidth=self.$refs.projectTable.$el.clientWidth+'px'
                          }
                        })
                      },
                      methods: {
                        handleUpdata(model, props) {
                          if (props.data) {
                          
                          }
                        },
                        refreshData(){},
                        goExit(){},
                        goBeforeTaskDetail(){},
                        goCurrentTaskControl(){},
                        goTaskRTeportDetail(){},
                        goProgress(){},
                        showSelectBox(){
                          this.ifSelectBoxShow=!this.ifSelectBoxShow
                        },
                        cellStyle({ row, column, rowIndex, columnIndex }) {
                          if (columnIndex === 0) {
                            // console.log(column)
                            return "padding: 0px!important;"
                          }

                        },
                        iconArrowClick1(data){
                          data.open=!data.open
                        },
                        iconArrowClick2(data){
                          data.open=!data.open
                        },
                        iconArrowClick3(data){
                          data.open=!data.open
                        },
                        iconArrowClick4(data){
                          data.open=!data.open
                        },
                        messageConfirm(){
                          this.messageBoxShow=false
                        }
                      }
                    }).$mount($("#progressCAVue", model.dom).get(0))
                  })
                }
              )
            })
        })
      })
    })
  }

  // 注册自定义控件
  KDApi.register("progress_ca_v1.0", MyComponent)
})(window.KDApi, jQuery)