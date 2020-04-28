// var qualityPlanVue = null

;
(function(KDApi, $) {
  // 顶层变量声明
  var theData = []
  var originData = []
  var changedIds = []

  function MyComponent(model) {
    this._setModel(model)
  }

  MyComponent.prototype = {
      // 内部函数不推荐修改
      _setModel: function(model) {
        this.model = model // 内部变量挂载
        this.model.resourceAllocationVue = null
      },
      init: function(props) {
        console.log("init---", this.model, props)
        setHtml(this.model, props)
      },
      update: function(props) {
        console.log("-----update", this.model, props)
        if (props.data && props.data.isInit) {
          theData = []
          originData = []
          changedIds = []
          this.model.resourceAllocationVue = null
          setHtml(this.model, props)
        }
        console.log(this.model.resourceAllocationVue)
        if (this.model.resourceAllocationVue) {
          this.model.resourceAllocationVue.handleUpdata(this.model, props)
        }
      },
      destoryed: function() {
        console.log("-----destoryed", this.model)
        this.model.resourceAllocationVue = null
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
                    "./html/resource_allocation.html",
                    model.schemaId, {
                      path: KDApi.nameSpace(
                        model.schemaId
                      ) + "./img/lock.png"
                    }
                  ).then(function(result) {
                    model.dom.innerHTML = ""
                    model.dom.innerHTML = result
                    if (props.data) {
                      if (props.data.isInit) {
                        // 如果是页面初始化  存储源数据
                        originData = props.data.data.sort(compare('position'))

                        // 将源数据处理为页面展示数据
                        originData = setAuditTaskUndertaker(originData)
                          // console.log("处理后的originData>>>", originData)
                        theData = formatToTreeData({ arrayList: originData, idStr: "task_id" })
                      }
                    }
                    model.resourceAllocationVue = new Vue({
                      delimiters: ["${", "}"],
                      data: {
                        tableData: theData,
                        allChecked: false,
                        currentSelectedIds: [],
                        tableHeight: 720
                      },
                      created() {},
                      mounted() {
                        // 固定表格表头 设置表格高度自适应填满剩余高度
                        let self = this;
                        this.$nextTick(function() {
                          let height=$("#iframeap").height()
                          self.tableHeight = height - self.$refs.resourceAllocationTable.$el.offsetTop - 80

                          // 监听窗口大小变化
                          window.onresize = function() {
                            self.tableHeight = height - self.$refs.resourceAllocationTable.$el.offsetTop - 80
                          }
                        })
                      },
                      methods: {
                        handleUpdata(model, props) {
                          if (props.data) {
                            // 如果是通知自定义控件执行保存
                            if (props.data.isSave === true) {
                              this.saveData()
                            } else if(props.data.isPush===true){
                              this.pushData()
                            }else if (props.data.isRefresh === true) {
                              this.refreshData()
                            } else if (props.data.method === "isExit") {
                              this.isExit()
                            } else if (props.data.method === "isSubmit") {
                              this.isSubmit()
                            } else {
                              // 更新数据
                              this.updataData(originData, this.currentSelectedIds, props.data.data)
                            }
                          }
                        },
                        updataData(originData, selectedIds, changeData) {
                          this.allChecked = false
                          console.log("selectedIds>>>", selectedIds)
                          selectedIds.forEach(function(sv) {
                            // changedIds.push(sv) //将编辑过得id保存
                            //将源数据中对应的任务字段更新
                            originData.forEach(function(ov) {
                              if (sv === ov.task_id) {
                                changeData.forEach(function(cv) {
                                  // if (ov.task_type === cv.task_type) {
                                  //   for (var key in cv) {
                                  //     ov[key] = cv[key]
                                  //   }
                                  // }
                                  for (var key in cv) {
                                    ov[key] = cv[key]
                                  }
                                })
                              }
                            })
                          })
                          originData = setAuditTaskUndertaker(originData)
                            // 处理页面数据更新
                          this.tableData = formatToTreeData({ arrayList: originData, idStr: "task_id" })
                          console.log("this.tableData>>>", this.tableData)
                        },
                        isExit() {
                          if (changedIds.length === 0) {
                            model.invoke(
                              "isQualityPlanExit", { data: true }
                            )
                          } else {
                            model.invoke(
                              "isQualityPlanExit", { data: false }
                            )
                          }
                        },
                        isSubmit() {
                          if (changedIds.length === 0) return
                          let saveData = handleDataAtSave(
                            originData,
                            changedIds
                          )
                          let sendData = {
                            data: saveData
                          }
                          model.invoke(
                            "submitQualityPlan",
                            sendData
                          )
                          changedIds = []
                        },
                        pushData(){
                          // if (changedIds.length === 0) return
                          let saveData = handleDataAtSave(
                            originData,
                            changedIds
                          )
                          let sendData = {
                            data: saveData
                          }
                          model.invoke(
                            "pushQualityData",
                            sendData
                          )
                          changedIds = []
                        },
                        handleCheckAllChange(val) {
                          this.traversalNode(
                            this.tableData[0],
                            this.allChecked
                          )
                        },
                        itemChange(row) {
                          let check = row.checked
                          let temp = this.traversalNode(row, check)
                          let tempTableData = _.cloneDeep(this.tableData[0])
                          let flatData = this.traversalNode(tempTableData)
                            // 获取该节点所在所有父节点
                          let parentIds = this.findParentIds(flatData, row.parent)
                            // console.log("temp>>>", temp)
                          if (check) {
                            // 如果点击是置true 递归查找所有父节点下的子节点
                            // 如果子节点都为true 置该父节点为ture
                            // 如果子节点有一个为false  置该父节点以及该父节点的所有父节点为false
                            let res = this.helloKids(flatData, parentIds)[0]
                            this.tableData = [res]
                          } else {
                            // 如果点击是置false 直接将该节点的所有父节点置为false
                            this.findYouAndSetFalse(this.tableData[0], parentIds)
                            this.allChecked = false
                          }
                        },
                        // 树形结构数据扁平化处理  如果需要可以设置该节点以及子节点checked
                        traversalNode(node, bool) {
                          let nodes = []
                          if (node) {
                            if (bool !== undefined) node.checked = bool
                            let stack = []
                            stack.push(node)
                            while (stack.length != 0) {
                              let item = stack.shift()
                              nodes.push(item)
                              let children = item.children ? item.children : []
                              children.forEach(function(v) {
                                if (bool !== undefined) v.checked = bool
                                stack.push(v)
                              })
                            }
                          }
                          return nodes
                        },
                        // 递归找到所有父节点设为false
                        findYouAndSetFalse(node, pids) {
                          var that = this
                          if (pids.includes(node.task_id)) {
                            node.checked = false
                          }
                          let children = node.children ? node.children : []
                          children.forEach(function(v) {
                            that.findYouAndSetFalse(v, pids)
                          })
                        },
                        // 在扁平化的树结构数据中递归找到所点击任务的所有父节点task_id
                        findParentIds(arr, pid) {
                          let pids = []
                          let currentpid = pid
                            // console.log(Array.isArray(arr))
                          if (Array.isArray(arr) && arr.length > 0) {
                            while (currentpid != 0) {
                              arr.forEach(function(v) {
                                if (v.task_id == currentpid) {
                                  pids.push(v.task_id)
                                  currentpid = v.parent
                                }
                              })
                            }
                          }
                          return pids
                        },
                        // flatdata 为表格绑定的整个数据的扁平化数据  pids为包含所点击节点的所有父节点数组
                        // 在整个扁平化数据中循环查找每个父节点下的子节点 判断  
                        // 若果有一个子节点为false 置所有父节点为false 
                        // 如果循环到当前父节点下的所有子节点都为true  置该父节点为true 继续找该父节点的父节点 重复该步骤
                        helloKids(flatdata, pids) {
                          let _that = this
                          let arr = []
                            // 如果pids为空 表示点击的节点为根节点没有父节点 直接置为true
                          if (pids.length == 0) {
                            this.allChecked = true
                            return flatdata
                          }
                          for (let i = 0, len = pids.length; i < len; i++) {
                            for (let j = 0, jlen = flatdata.length; j < jlen; j++) {
                              if (pids[i] == flatdata[j].task_id) {
                                let bool = flatdata[j].checked
                                let children = flatdata[j].children ? flatdata[j].children : []
                                for (let k = 0, klen = children.length; k < klen; k++) {
                                  if (!children[k].checked) {
                                    bool = false;
                                    _that.allChecked = false
                                    break;
                                  } else {
                                    bool = true
                                  }
                                }
                                flatdata[j].checked = bool
                                if (bool) {
                                  _that.allChecked = true
                                }
                              }
                            }

                          }
                          // console.log("arr>>>", arr)
                          return flatdata
                        },
                        // 获取选择的任务的task_id
                        getSelectedId() {
                          var that = this
                          this.currentSelectedIds = []
                          // let idArr = []
                          let resData={
                            selected:[],
                            idArr:[]
                          }
                          let tempArr = this.traversalNode(
                            this.tableData[0]
                          )
                          tempArr.forEach(function(v) {
                            if(v.checked){
                              resData.selected.push(v)
                              if(v.type=="task" && v.task_type !== "4"){
                                that.currentSelectedIds.push(v.task_id)
                                resData.idArr.push(v)
                              }
                            }
                            // if (v.checked && v.type == "task" && v.task_type !== "4") {
                            //   that.currentSelectedIds.push(v.task_id)
                            //   idArr.push({
                            //     project_id: v.project_id,
                            //     plan_id: v.plan_id,
                            //     task_id: v.task_id,
                            //     task_name: v.task_name,
                            //     task_type: v.task_type,
                            //     duration: v.duration,
                            //     owner: v.owner,
                            //     owner_role: v.owner_role,
                            //     task_assign_id:v.task_assign_id,
                            //     task_status:v.task_status
                            //   })
                            // }
                          })
                          return resData
                        },
                        resourceAllocationGetSelectedId() {
                          var that = this
                          this.currentSelectedIds = []
                          let tempArr = this.traversalNode(
                            this.tableData[0]
                          )
                          // let idArr = []
                          let resData={
                            selected:[],
                            idArr:[]
                          }

                          // 原逻辑
                          // let idArr = {
                          //   type_one: [], // type=="task"  task_type===1
                          //   type_two: [], // type=="task"   task_type===2
                          //   type_three: [] // type=="task"  
                          // }
                          tempArr.forEach(function(v) {
                            if(v.checked){
                              resData.selected.push(v)
                              if(v.type==="task"){
                                that.currentSelectedIds.push(v.task_id)
                                resData.idArr.push(v)
                              }
                            }
                            // if(v.checked && v.type==="task"){
                            //   that.currentSelectedIds.push(v.task_id)
                            //   idArr.push({
                            //     task_id: v.task_id,
                            //     task_name: v.task_name,
                            //     plan_starttime: v.plan_starttime,
                            //     plan_endtime: v.plan_endtime,
                            //     owner: v.owner,
                            //     owner_id: v.owner_id,
                            //     owner_role:v.owner_role,
                            //     owner_role_id:v.owner_role_id,
                            //     task_type: v.task_type,
                            //     duration: v.duration,
                            //     parent: v.parent,
                            //     task_assign_id:v.task_assign_id,
                            //     task_status:v.task_status
                            //   })
                            // }
                            // 原逻辑
                            // if (v.checked && v.task_type !== "") {
                            //   if (v.task_type === "4") {
                            //     idArr.type_one.push({
                            //       task_id: v.task_id,
                            //       task_name: v.task_name,
                            //       plan_starttime: v.plan_starttime,
                            //       plan_endtime: v.plan_endtime,
                            //       owner: v.owner,
                            //       owner_id: v.owner_id,
                            //       task_type: v.task_type,
                            //       duration: v.duration,
                            //       parent: v.parent
                            //     })
                            //   } else if (v.task_type === "2") {
                            //     that.currentSelectedIds.push(v.task_id)
                            //     idArr.type_two.push({
                            //       task_id: v.task_id,
                            //       task_name: v.task_name,
                            //       plan_starttime: v.plan_starttime,
                            //       plan_endtime: v.plan_endtime,
                            //       owner: v.owner,
                            //       owner_id: v.owner_id,
                            //       task_type: v.task_type,
                            //       duration: v.duration,
                            //       parent: v.parent
                            //     })
                            //   } else {
                            //     that.currentSelectedIds.push(v.task_id)
                            //     idArr.type_three.push({
                            //       task_id: v.task_id,
                            //       task_name: v.task_name,
                            //       plan_starttime: v.plan_starttime,
                            //       plan_endtime: v.plan_endtime,
                            //       owner: v.owner,
                            //       owner_id: v.owner_id,
                            //       task_type: v.task_type,
                            //       duration: v.duration,
                            //       parent: v.parent
                            //     })
                            //   }
                            // }
                          })
                          return resData
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
                        saveData() {
                          console.log("quality-plan-saveData")
                          let saveData = handleDataAtSave(
                            originData,
                            changedIds
                          )
                          console.log(
                            "saveData>>>", saveData
                          )
                          let sendData = {
                            data: saveData
                          }
                          model.invoke(
                            "saveQualityPlanData",
                            sendData
                          )
                          changedIds = [] // 保存后 将记录变化任务id的数组置空 防止每次保存都会有上次的记录
                        },
                        SetRole() {
                          var _this = this
                          let ids = this.getSelectedId()
                          let sendData = {
                            data: ids.idArr
                          }
                          if(ids.selected.length===0){
                            this.$message.error("未勾选任务")
                            return
                          }else if(0<ids.selected.length<=2){
                            if(ids.idArr.length===0){
                              this.$message.error("您勾选任务无法设置角色")
                              return
                            }else if(ids.idArr.length===1){
                              if(ids.idArr[0].subArray[0].owner_role===""||ids.idArr[0].subArray[0].owner_role===null||ids.idArr[0].subArray[0].owner_role===undefined){
                                changedIds = changedIds.concat(this.currentSelectedIds)
                                model.invoke(
                                  "setQualityPlanRole",
                                  sendData
                                )
                              }else{
                                this.$message.error("只有新增的任务可以设置角色")
                                return
                              }
                            }else{
                              this.$message.error("设置任务角色不能多选")
                              return
                            }
                          }else{
                            this.$message.error("设置任务角色不能多选")
                            return
                          }
                         
                          // if(ids.idArr.length===0){
                          //   this.$message.error("您勾选任务无法设置角色")
                          //   return
                          // }else if(ids.idArr.length>1){
                          //   this.$message.error("设置任务角色不能多选")
                          //   return
                          // }else{
                          //   if(ids.idArr[0].subArray[0].owner_role===""||ids.idArr[0].subArray[0].owner_role===null||ids.idArr[0].subArray[0].owner_role===undefined){
                          //     changedIds = changedIds.concat(this.currentSelectedIds)
                          //     model.invoke(
                          //       "setQualityPlanRole",
                          //       sendData
                          //     )
                          //   }else{
                          //     this.$message.error("只有新增的任务可以设置角色")
                          //     return
                          //   }
                          // }
                          // if (ids.length > 0) {
                          //   let flag = ids.every(function(v) {
                          //     return v.owner_role === "" || v.owner_role === null || v.owner_role === undefined
                          //   })
                          //   if (flag) {
                          //     changedIds = changedIds.concat(this.currentSelectedIds)
                          //     model.invoke(
                          //       "setQualityPlanRole",
                          //       sendData
                          //     )
                          //   } else {
                          //     this.$message.error("只有新增的任务可以设置角色")
                          //   }
                          // } else {
                          //   this.$message.error("未勾选任务")
                          // }
                        },
                        getTask(tasks, selectedIds) {
                          let task = []
                          if (selectedIds.length > 0) {
                            selectedIds.forEach(function(sv) {
                              tasks.forEach(function(tv) {
                                if (sv === tv.task_id) task.push(tv)
                              })
                            })
                          }
                          return task
                        },
                        SetStaff() {
                          let ids = this.getSelectedId()
                          let sendData = {
                            data: ids
                          }
                          if (ids.length > 0) {
                            let flag = ids.every(function(v) {
                              return v.owner === "" || v.owner === null || v.owner === undefined
                            })
                            if (flag) {
                              changedIds = changedIds.concat(this.currentSelectedIds)
                              model.invoke(
                                "setQualityPlanStaff",
                                sendData
                              )
                            } else {
                              this.$message.error("只有新增的任务可以设置人员")
                            }

                          } else {
                            this.$message.error("未勾选任务")

                          }
                        },

                        SetDurationTime() {
                          let ids = this.getSelectedId()
                          let sendData = {
                            data: ids.idArr
                          }
                          if(ids.selected.length===0){
                            this.$message.error("未勾选任务")
                            return
                          }else if(0<ids.selected.length<=2){
                            if(ids.idArr.length===0){
                              this.$message.error("您勾选任务无法设置任务持续时间")
                              return
                            }else if(ids.idArr.length===1){
                              /**
                               * @author: zhang fq
                               * @date: 2020-03-19
                               * @description: 修改资源调配 设置持续时间 所勾选任务的筛选判断逻辑
                               */
                              if(ids.idArr[0].task_type !== "3"){
                                this.$message.error("只有复核任务可以设置任务持续时间")
                                return
                              }
                              if (ids.idArr[0].subArray[0].first_duration === "" && ids.idArr[0].subArray[0].mod_con_duration === "" && ids.idArr[0].subArray[0].confirm_duration === "" && ids.idArr[0].subArray[0].modify_duration === "") {
                                changedIds = changedIds.concat(this.currentSelectedIds)
                                model.invoke(
                                  "SetDurationTime",
                                  sendData
                                )
                              } else {
                                this.$message.error("只有新增的复核任务可以设置任务持续时间")
                                return
                              }
                            }else{
                              this.$message.error("设置任务持续时间不能多选")
                              return
                            }
                          }else{
                            this.$message.error("设置任务持续时间不能多选")
                            return
                          }
                          // if(ids.selected.length===2){
                          //   if(ids.idArr.length===1){
                          //     this.$message.error("设置任务持续时间不能多选")
                          //     return
                          //   }
                          // }
                          // if(ids.idArr.length===0){
                          //   this.$message.error("您勾选任务无法设置任务持续时间")
                          //   return
                          // }else if(ids.idArr.length>1){
                          //   this.$message.error("设置任务持续时间不能多选")
                          //   return
                          // }else{
                          //   if (ids.idArr[0].duration === "" || ids.idArr[0].duration === null || ids.idArr[0].duration === undefined) {
                          //     changedIds = changedIds.concat(this.currentSelectedIds)
                          //     model.invoke(
                          //       "SetDurationTime",
                          //       sendData
                          //     )
                          //   } else {
                          //     this.$message.error("只有新增的复核任务可以设置任务持续时间")
                          //     return
                          //   }
                          // }
                          // if (ids.length == 0) {
                          //   this.$message.error("未勾选任务")
                          // } else if (ids.length > 1) {
                          //   this.$message.error("设置任务持续时间不能多选")
                          // } else if (ids[0].task_type !== "3") {
                          //   this.$message.error("只有复核任务可以设置任务持续时间")
                          // } else {
                          //   if (ids[0].duration === "" || ids[0].duration === null || ids[0].duration === undefined) {
                          //     changedIds = changedIds.concat(this.currentSelectedIds)
                          //     model.invoke(
                          //       "SetDurationTime",
                          //       sendData
                          //     )
                          //   } else {
                          //     this.$message.error("只有新增的复核任务可以设置任务持续时间")

                          //   }
                          // }
                        },
                        refreshData() {
                          // console.log("refreshData")
                          model.invoke(
                            "refreshQualityPlanData", {}
                          )
                        },
                        applicationHresources() {
                          // 申请人工资源
                          // applyStaffResource
                        },
                        goAllocation() {
                          // 资源调配
                          var _this = this
                          let ids =this.resourceAllocationGetSelectedId()
                          let sendData = {
                            data: ids.idArr
                          }
                          if (ids.selected.length===0){
                            this.$message.error("未勾选任务")
                            return
                          }else if(0<ids.selected.length<=2){
                            if(ids.idArr.length===0){
                              this.$message.error("您勾选任务无法进行资源调配")
                              return
                            }else if(ids.idArr.length===1){
                              if (ids.idArr[0].subArray[0].owner_id === "" || ids.idArr[0].subArray[0].owner_id === null || ids.idArr[0].subArray[0].owner_id === undefined) {
                                this.$message.error("新增的任务不能进行资源调配")
                              } else {
                                changedIds = changedIds.concat(this.currentSelectedIds)
                                model.invoke(
                                  "resourceAllocation",
                                  sendData
                                )
                              }
                            }else{
                              this.$message.error("资源调配不能多选")
                              return
                            }
                          }else{
                            this.$message.error("资源调配不能多选")
                            return
                          }
                          // if(ids.idArr.length===0){
                          //   this.$message.error("您勾选任务无法进行资源调配")
                          //   return
                          // }else if(ids.idArr.length>1){
                          //   this.$message.error("资源调配不能多选")
                          //   return
                          // }else{
                          //   if (ids.idArr[0].subArray[0].owner_id === "" || ids.idArr[0].subArray[0].owner_id === null || ids.idArr[0].subArray[0].owner_id === undefined) {
                          //     this.$message.error("新增的任务不能进行资源调配")
                          //   } else {
                          //     changedIds = changedIds.concat(this.currentSelectedIds)
                          //     model.invoke(
                          //       "resourceAllocation",
                          //       sendData
                          //     )
                          //   }
                          // }

                          // if (ids.length == 0) {
                          //   this.$message.error("未勾选任务")
                          // } else if (ids.length > 1) {
                          //   this.$message.error("资源调配不能多选")
                          // } else{
                          //   if (ids[0].owner_id === "" || ids[0].owner_id === null || ids[0].owner_id === undefined) {
                          //     this.$message.error("新增的任务不能进行资源调配")
                          //   } else {
                          //     changedIds = changedIds.concat(this.currentSelectedIds)
                          //     model.invoke(
                          //       "resourceAllocation",
                          //       sendData
                          //     )
                          //   }
                          // }
                          //******************************************* */
                          // let ids = this.resourceAllocationGetSelectedId()
                          //   // let sendData = {
                          //   //   data: ids
                          //   // }
                          // /**
                          //  * @author zhang fq
                          //  * @date  2020-02-17
                          //  * @description  计量管理-资源调配  修改需求只能单选
                          //  */
                          // if (ids.type_one.length === 0 && ids.type_two.length === 0 && ids.type_three.length === 0) {
                          //   this.$message.error("未勾选任务")
                          //   return
                          // }
                          // if (ids.type_two.length === 1) {
                          //   if (ids.type_one.length !== 0 || ids.type_three.length !== 0) {
                          //     this.$message.error("专业审核任务不能和其它类型任务一起选择")
                          //     return
                          //   } else {
                          //     // 如果只选择了一种 并且只选择了一个专业审核任务
                          //     let sendData = {
                          //       data: ids.type_two
                          //     }
                          //     model.invoke(
                          //       "resourceAllocation",
                          //       sendData
                          //     )
                          //     changedIds = changedIds.concat(this.currentSelectedIds)
                          //   }
                          // } else if (ids.type_two.length > 1) {
                          //   this.$message.error("专业审核任务不能多选")
                          //   return
                          // } else {
                          //   // 进入到没有专业审核的情况
                          //   if (ids.type_one.length === 0) {
                          //     if (ids.type_three.length > 2) {
                          //       this.$message.error("不能选择不同摘要任务下的设计任务和复核任务")
                          //       return
                          //     } else if (ids.type_three.length === 2) {
                          //       if (ids.type_three[0].parent !== ids.type_three[1].parent) {
                          //         this.$message.error("不能选择不同摘要任务下的设计任务或复核任务")
                          //         return
                          //       }
                          //     } else if (0 < ids.type_three.length < 2) {
                          //       let sendData = {
                          //         data: ids.type_three
                          //       }
                          //       model.invoke(
                          //         "resourceAllocation",
                          //         sendData
                          //       )
                          //       changedIds = changedIds.concat(this.currentSelectedIds)
                          //     } else {
                          //       this.$message.error("未勾选任务")
                          //       return
                          //     }
                          //   } else if (ids.type_one.length > 1) {
                          //     this.$message.error("不能选择不同摘要任务下的设计任务或复核任务")
                          //     return
                          //   } else {
                          //     let sendData = {
                          //       data: ids.type_three
                          //     }
                          //     model.invoke(
                          //       "resourceAllocation",
                          //       sendData
                          //     )
                          //     changedIds = changedIds.concat(this.currentSelectedIds)
                          //   }
                          // }
                        }
                      }
                    }).$mount($("#resourceAllocationApp", model.dom).get(0))
                  })
                }
              )
            })
          })
        })
      })
    })
  }

  // 将源数据格式化为表格树形结构数据
  function formatToTreeData({ arrayList, pidStr = 'parent', idStr = 'id', childrenStr = 'children' }) {
    if(arrayList===[]||arrayList===undefined||arrayList===null) return
    let templist = _.cloneDeep(arrayList)
    let listObj = {}; // 用来储存{key: obj}格式的对象
    let treeList = []; // 用来储存最终树形结构数据的数组
    // 将数据变换成{key: obj}格式，方便下面处理数据
    for (let i = 0; i < templist.length; i++) {
      templist[i].checked = false
      listObj[templist[i][idStr]] = templist[i]
    }
    // 根据pid来将数据进行格式化
    for (let j = 0; j < templist.length; j++) {
      // 判断父级是否存在
      let haveParent = listObj[templist[j][pidStr]]
      if (haveParent) {
        // 如果没有父级children字段，就创建一个children字段
        !haveParent[childrenStr] && (haveParent[childrenStr] = [])
          // 在父级里插入子项
        haveParent[childrenStr].push(templist[j])
      } else {
        // 如果没有父级直接插入到最外层
        treeList.push(templist[j])
      }
    }
    return treeList
  }
  // // 添加排序字段
  // function addSortNum(data) {
  //   if (data.length <= 1) {
  //     return data
  //   } else {
  //     // data.forEach(function(fuck) {
  //     //   fuck.sortNum = fuck.wbs.split(".").join("")
  //     //   for (let i = fuck.sortNum.length; i < 4; i++) {
  //     //     fuck.sortNum += "0"
  //     //   }
  //     // })
  //     data.sort(compare('position'))
  //     return data
  //   }
  // }
  // 排序
  function compare(prop) {
    return function(obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  // 处理修改后的数据 将修改后的数据映射到 源数据中
  // function originDataChanged(originData, changeData) {
  // 	// console.log("originData>>>", originData)
  // 	// console.log("changeData>>>", changeData)
  // 	changeData.forEach(function (cv) {
  // 		changedIds.push(cv.task_id)
  // 	})
  // 	//... 处理方法
  // 	originData.forEach(function (ov) {
  // 		changeData.forEach(function (cv) {
  // 			if (ov.task_id == cv.task_id) {
  // 				// console.log("ov>>>", ov)
  // 				// console.log("cv>>>", cv)
  // 				for (var key in cv) {
  // 					ov[key] = cv[key]
  // 				}
  // 			}
  // 		})
  // 	})
  // 	return originData
  // }
  // 处理要保存的数据
  function handleDataAtSave(data, ids) {
    // console.log("进参 data>>>", data)
    // console.log("进参 ids>>>", ids)
    var idArr = _.uniq(ids)
      // console.log("去重后的 idArr>>>", idArr)
    var result = []
    idArr.forEach(function(iv) {
        data.forEach(function(dv) {
          if (iv == dv.task_id) {
            result.push(dv)
          }
        })
      })
      // console.log("有改变的 result>>>", result)
    return result
  }
  // 处理复核任务 整改-修改 承担人和承担人名称
  function setAuditTaskUndertaker(originData) {
    if (originData.length === 0) return
    originData.forEach(function(fuck) {
      if (fuck.task_type === "3") {
        originData.forEach(function(shit) {
          if (fuck.parent === shit.parent && shit.task_type !== "3") {
            fuck.subArray[0].the_isreply=shit.subArray[0].isreply
            fuck.subArray[0].the_owner = shit.subArray[0].owner
            fuck.subArray[0].the_owner_role = shit.subArray[0].owner_role
            fuck.subArray[0].the_skill=shit.subArray[0].skill
          }
        })
      }
    })
    return originData
  }
  // 注册自定义控件
  KDApi.register("resource_allocation_v1.0", MyComponent)
})(window.KDApi, jQuery)