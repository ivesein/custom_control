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
        if (this.model.progressCAVue) {
          this.model.progressCAVue.handleUpdata(this.model, props)
        }else{
          setHtml(this.model, props)
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

                    model.progressCAVue = new Vue({
                      delimiters: ["${", "}"],
                      data: {
                        ifSelectBoxShow:false,
                        proTableData:[
                          // {
                          //   wbs:"G",
                          //   task_name:"工作5",
                          //   owner:"张三",
                          //   is_certical_task:true,
                          //   task_status:"1",  //1 未开始  2 进行中  3 已完成
                          //   handle_status:"0"  // 0 待处理  1 已处理
                          // },
                          // {
                          //   wbs:"H",
                          //   task_name:"工作6",
                          //   owner:"李四",
                          //   is_certical_task:true,
                          //   task_status:"2",
                          //   handle_status:"0"
                          // },
                          // {
                          //   wbs:"L",
                          //   task_name:"工作7",
                          //   owner:"王五",
                          //   is_certical_task:false,
                          //   task_status:"3",
                          //   handle_status:"1"   
                          // },
                          // {
                          //   wbs:"I",
                          //   task_name:"工作8",
                          //   owner:"马六",
                          //   is_certical_task:true,
                          //   task_status:"3",
                          //   handle_status:"1"   
                          // }
                        ],
                        beforeTaskInfo:{
                          open:true,
                          title:"紧前任务对当前任务影响情况",
                          data:[]
                        },
                        currentTaskInfo:{
                          title:"当前任务情况",
                          open:true,
                          data:[]
                        },
                        earnedValueAnalysisSuggestions:{
                          title:"挣值分析及建议",
                          open:true,
                          data:[],
                        },
                        followTaskProcessing:{
                          title:"后续任务处理",
                          open:true,
                          data:[]
                        },
                        tableWidth:'100%',
                        messageBoxShow:true,
                        messageData:[],
                        taskReportDetailShow:false,
                        currentDate:"",
                        filterCondition:{
                          conditionOne:1,  //显示选项  1 全部  2 仅显示差异
                          conditionTwo:1,  //时间范围  1 全部  2 范围  时间为timeRange值 ["2020-03-01","2020-03-15"]
                          conditionThree:1, //任务状态 1 全部  2 未开始  3 进行中  4 已完成
                          timeRange:[]  //时间范围 为2时 日期范围所选值 数组["2020-03-01","2020-03-15"]
                        },
                        ifFollowTaskShow:false,  //是否显示后续任务处理表
                        taskReportDetailData:[],
                        currentClickedTask:{
                          index:0
                        }
                      },
                      created() {
                        this.getCurrentDate()
                        this.handleUpdata(model,props)
                      },
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
                        // 根据接口方法名 处理后台返回参数
                        handleUpdata(model,props){
                          if(props.data!==undefined){
                            switch(props.data.method){
                              case "init":
                                this.messageData=props.data.data
                                break;
                              case "getTaskListData":
                                this.proTableData=props.data.data
                                break;
                              case "getFilterData":
                                this.proTableData=props.data.data
                                break;
                              case "getClickedTaskDetailData":
                                this.beforeTaskInfo.data=props.data.data.beforeTaskInfo
                                this.currentTaskInfo.data=props.data.data.currentTaskInfo
                                break;
                              case "pickFollowTasks":
                                props.data.data.forEach(v=>{
                                  v.handling_measures=""
                                })
                                // this.followTaskProcessing.data=props.data.data.push({
                                //   follow_task_name:"",
                                //   handling_measures:"请输入处理措施"
                                // })
                                props.data.data.push({
                                  follow_task_name:"",
                                  handling_measures:"请输入处理措施"
                                })
                                this.proTableData[this.currentClickedTask.index].follow_task=props.data.data
                                this.followTaskProcessing.data=props.data.data
                                break;
                              case "getReportDetailData":
                                this.taskReportDetailData=props.data.data
                                break;
                              default:
                                this.$message.error("数据获取失败，请稍后重试..")
                            }
                          }
                        },
                        // 重置右侧表格数据
                        resetData(){
                          this.beforeTaskInfo.data=[]
                          this.currentTaskInfo.data=[]
                          // this.followTaskProcessing.data=[]
                        },
                        getCurrentDate(){
                          let cDate=new Date()
                          this.currentDate=cDate.getFullYear()+'年'+Number(cDate.getMonth()+1)+'月'+cDate.getDate()+'日'
                        },
                        refreshData(){},
                        goExit(){},
                        goBeforeTaskDetail(){},
                        goCurrentTaskControl(){},
                        //调接口 打开任务汇报详情表格弹出
                        goTaskReportDetail(){
                          if(this.currentClickedTask.id){
                            // TODO 发送当前任务id到后台获取任务汇报详情数据并展示
                            model.invoke("getReportDetailData",this.currentClickedTask.id)
                            this.taskReportDetailShow=true
                          }else{
                            this.$message.error("请先选择任务")
                          }
                        },
                        //处理后续任务同步到进度维护功能 判断是否选择了后续任务且所有已选后续任务都输入了决策措施
                        goProgress(){
                          // let tempData=[]
                          // if(this.followTaskProcessing.data.length>1){
                          //   for(let i=0;i<this.followTaskProcessing.data.length-1;i++){
                          //     tempData.push(this.followTaskProcessing.data[i])
                          //   }
                          //   let flag=tempData.every(v=>{
                          //     return v.handling_measures!==""
                          //   })
                          //   if(flag){
                          //     model.invoke("getReportDetailData",this.followTaskProcessing.data)
                          //   }else{
                          //     this.$message.error("所有已选后续任务决策措施不能为空")
                          //   }
                          // }
                          // 同步到进度维护差异化数据处理  
                          // 标记选取了后续任务的任务，并判断这些后续任务的决策措施是否都已输入
                          let finalData=[]
                          let taskId=[]
                          this.proTableData.forEach(v=>{
                            if(v.task_status==='3'&& v.follow_task.length>1){
                              let temp=[]
                              for(let i=0;i<v.follow_task.length-1;i++){
                                temp.push(v.follow_task[i])
                              }
                              let flag=temp.every(j=>{
                                return j.handling_measures!==""
                              })
                              if(flag){
                                finalData.push(...temp)
                              }else{
                                taskId.push(v.task_name)
                              }
                            }
                          })
                          if(taskId.length===0){
                            model.invoke("getReportDetailData",finalData)
                          }else{
                            let str=""
                            taskId.forEach(v=>{
                              str+=v+","
                            })
                            str = str.slice(0, str.length - 1);
                            this.$message.error("任务:"+str+"的后续任务决策措施未输入！")
                          }
                        },
                        showSelectBox(){
                          this.ifSelectBoxShow=!this.ifSelectBoxShow
                        },
                        cellStyle({ row, column, rowIndex, columnIndex }) {
                          if (columnIndex === 0) {
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
                          model.invoke("getTaskListData","")
                          this.messageBoxShow=false
                        },
                        // 三个筛选条件各自改变时 判断时间范围是否为2 且所选日期范围不为空 组合筛选条件发送到后台
                        conditionOneChange(val){
                          if(this.filterCondition.conditionTwo===2){
                            if(this.filterCondition.timeRange.length===0){
                              this.$message.error("请选择日期范围")
                            }else{
                              // TODO 发送filterCondition
                              model.invoke("getFilterData",this.filterCondition)
                            }
                          }else{
                            // TODO 发送filterCondition
                            model.invoke("getFilterData",this.filterCondition)
                          }
                        },
                        conditionTwoChange(val){
                          console.log(val)
                          if(val===2){
                            this.$refs.timeRangePicker.focus()
                          }else{
                            // TODO 发送filterCondition
                            model.invoke("getFilterData",this.filterCondition)
                          }
                        },
                        conditionThreeChange(val){
                          if(this.filterCondition.conditionTwo===2){
                            if(this.filterCondition.timeRange.length===0){
                              this.$message.error("请选择日期范围")
                            }else{
                              // TODO 发送filterCondition
                              model.invoke("getFilterData",this.filterCondition)
                            }
                          }else{
                            // TODO 发送filterCondition
                            model.invoke("getFilterData",this.filterCondition)
                          }
                        },
                        timeRangeChange(value){
                          console.log(value)
                          console.log(this.filterCondition)
                        },
                        timeRangeBlur(val){
                          console.log(val)
                          if(this.filterCondition.conditionTwo===2){
                            if(val.value.length===0){
                              this.$message.error("请选择日期范围")
                            }else{
                              // TODO 发送filterCondition
                              model.invoke("getFilterData",this.filterCondition)
                              console.log("发送filterCondition",this.filterCondition)
                            }
                          }
                        },
                        // 给左侧任务添加行索引
                        tableRowClassName({row, rowIndex}){
                          row.index = rowIndex;
                          row.follow_task=[]
                        },
                        //获取当前点击的任务
                        rowDblclick(row){
                          this.resetData()
                          this.proTableData[this.currentClickedTask.index].follow_task=this.followTaskProcessing.data
                          if(row.task_status==="3"){
                            this.ifFollowTaskShow=true
                            if(row.follow_task.length===0){
                              row.follow_task.push({
                                follow_task_name:"",
                                handling_measures:"请输入处理措施"  
                              })
                            }
                            this.followTaskProcessing.data=row.follow_task
                          }else{
                            this.ifFollowTaskShow=false
                          }
                          this.currentClickedTask =row
                          // TODO 发送当前点击的任务id到后台 获取相关数据
                          model.invoke(
                            "getClickedTaskDetailData", row.id
                          )
                        },
                        goSelectFollowTask(){
                          console.log("打开选择后续任务弹窗")
                          model.invoke("pickFollowTasks",this.currentClickedTask.id)
                        },
                        closeTaskReportDetail(){
                          this.taskReportDetailShow=false
                        },
                        goTaskReportListDetail(){
                          console.log("跳转到任务列表详情")
                          model.invoke("goTaskReportDetailListPage",this.currentClickedTask.id)
                        },
                        // 监听决策输入 ，如有输入或修改 同步到左侧当前点击的任务数据
                        hmChange(){
                          this.proTableData[this.currentClickedTask.index].follow_task=this.followTaskProcessing.data
                        }
                      }
                    }).$mount($("#progressCAApp", model.dom).get(0))
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