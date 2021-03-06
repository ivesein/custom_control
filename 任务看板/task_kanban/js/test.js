new Vue({
  delimiters: ["${", "}"],
  data: {
    activeName: 'first',
    showPannal:true,
    tabData:[
      {
        id:1,
        text:"设计校审任务",
        focus:true
      },
      {
        id:2,
        text:"提资任务",
        focus:false
      }
    ],
    // 提资任务概览数据
    summarDataTZ:[
      {
        title: "总任务",
        focus: true,
        number: 4
      },
      {
        title: "待完成任务",
        focus: false,
        number: 1
      },
      {
        title: "已完成任务",
        focus: false,
        number: 1
      }
    ],
    // 提资任务数据  
    tzTaskInfos:[
      {
        task_status: "0",
        task_name: "平纵数据自检修改完成提资",
        project_name: "陕西汉中项目",
        taskid:"1",
        projectid:"123"
      },
      {
        task_status: "1",   //显示
        task_name: "p3挖土提资",
        project_name: "陕西汉中项目",
        taskid:"2",
        projectid:"123"
      },
      {
        task_status: "2",
        task_name: "p4挖土提资",
        project_name: "陕西汉中项目",
        taskid:"3",
        projectid:"123"
      },
      {
        task_status: "3",
        task_name: "p4挖土提资",
        project_name: "陕西汉中项目",
        taskid:"4",
        projectid:"123"
      }
    ],
    //当前类型的提资任务数据列表数据
    currentTzTaskData:[],
    summarData: [{
        title: "总任务",
        focus: true,
        number: 9
      },
      {
        title: "待完成任务",
        focus: false,
        number: 5
      },
      {
        title: "已完成任务",
        focus: false,
        number: 3
      },
      {
        title: "已过期任务",
        focus: false,
        number: 1
      }
    ],
    responsibleTaskInfos: [
      {
        task_status: "toBeComplected",
        task_name: "平纵数据自检修改完成",
        project_name: "陕西汉中项目",
        check_status:"check_in",
        beforeTaskStatus:true

      },
      {
        task_status: "complected",
        task_name: "p3挖土",
        project_name: "陕西汉中项目",
        check_status:"check_in",
        beforeTaskStatus:true
      },
      {
        task_status: "inProgress",
        task_name: "p4挖土",
        project_name: "陕西汉中项目",
        check_status:"check_in"
      },
      {
        task_status: "toBeComplected",
        task_name: "平纵数据自检修改完成",
        project_name: "陕西汉中项目",
        check_status:"check_out"
      },
      {
        task_status: "complected",
        task_name: "p3挖土",
        project_name: "陕西汉中项目"
      },
      {
        task_status: "inProgress",
        task_name: "p4挖土",
        project_name: "陕西汉中项目"
      },
      {
        task_status: "toBeComplected",
        task_name: "平纵数据自检修改完成",
        project_name: "陕西汉中项目"
      },
      {
        task_status: "complected",
        task_name: "p3挖土",
        project_name: "陕西汉中项目"
      },
      {
        task_status: "inProgress",
        task_name: "p4挖土",
        project_name: "陕西汉中项目"
      },
      {
        task_status: "toBeComplected",
        task_name: "平纵数据自检修改完成",
        project_name: "陕西汉中项目"
      },
      {
        task_status: "complected",
        task_name: "p3挖土",
        project_name: "陕西汉中项目"
      },
      {
        task_status: "inProgress",
        task_name: "p4挖土",
        project_name: "陕西汉中项目"
      }
    ],
    participtionTaskInfos: [{
        task_status: "toBeComplected",
        task_name: "平纵数据自检修改完成",
        project_name: "陕西汉中项目",
        taskScheduleStatus: true,
        check_status:"check_in"
      },
      {
        task_status: "complected",
        task_name: "p3挖土",
        project_name: "陕西汉中项目",
        taskScheduleStatus: true,
        check_status:"check_in"
      },
      {
        task_status: "inProgress",
        task_name: "p4挖土",
        project_name: "陕西汉中项目",
        taskScheduleStatus: false,
        check_status:"check_in"
      }
    ],
    professionalAuditTaskInfos: [{
        task_status: "toBeComplected",
        task_name: "专业审核任务1",
        project_name: "陕西汉中项目",
        open: false,
        auditTask: [{
            wbs: "0101", //任务代码
            task_name: "被审核任务1",
            design_owner: "设计人1",
            review_owner: "复核人1",
            task_status: "toBeComplected",
            taskScheduleStatus: false,
            check_status:"check_in"
          },
          {
            wbs: "0102", //任务代码
            task_name: "被审核任务1",
            design_owner: "设计人1",
            review_owner: "复核人1",
            task_status: "inProgress",
            taskScheduleStatus: false,
            check_status:"check_in"
          },
          {
            wbs: "0103", //任务代码
            task_name: "被审核任务1",
            design_owner: "设计人1",
            review_owner: "复核人1",
            task_status: "complected",
            taskScheduleStatus: false,
            check_status:"check_in"
          }
        ]
      },
      {
        task_status: "toBeComplected",
        task_name: "专业审核任务2",
        project_name: "陕西汉中项目",
        open: false,
        auditTask: [{
            wbs: "0201", //任务代码
            task_name: "被审核任务2",
            design_owner: "设计人2",
            review_owner: "复核人2",
            task_status: "toBeComplected",
            taskScheduleStatus: true,
            check_status:"check_in"
          },
          {
            wbs: "0202", //任务代码
            task_name: "被审核任务2",
            design_owner: "设计人2",
            review_owner: "复核人2",
            task_status: "inProgress",
            taskScheduleStatus: true
          },
          {
            wbs: "0203", //任务代码
            task_name: "被审核任务2",
            design_owner: "设计人2",
            review_owner: "复核人2",
            task_status: "complected",
            taskScheduleStatus: true
          }
        ]
      },
    ]
  },
  created() {},
  mounted() {

  },
  methods: {
    // 处理标签按钮点击 加载焦点样式 展示相应面版
    handleTabClick(item) {
      console.log(item);
      this.tabData.forEach(function(fk) {
        fk.focus = false
      })
      item.focus = true
      this.showPannal=item.id===1?true:false
    },
    // 处理提资面板 概览数据 按钮 显示相应状态的任务
    handleSummaryTZItemClicked(item){
      this.summarDataTZ.forEach(function(fk) {
        fk.focus = false
      })
      item.focus = true
      this.handleCurrentTypeTaskDisplay(item.title)
    },
    handleCurrentTypeTaskDisplay(type){
      var _this=this
      this.currentTzTaskData=[]
      switch(type){
        case "总任务":
          _this.currentTzTaskData=_.cloneDeep(_this.tzTaskInfos)
          break;
        case "待完成任务":
          _this.tzTaskInfos.forEach(function(v){
            if(v.task_status==='2'){
              _this.currentTzTaskData.push(v)
            }
          })
          break;
        case "已完成任务":
          _this.tzTaskInfos.forEach(function(v){
            if(v.task_status==='3'){
              _this.currentTzTaskData.push(v)
            }
          })
          break;
        default:
          _this.currentTzTaskData=_.deepClone(_this.tzTaskInfos)
      }
    },
    handleSummaryItemClicked(item) {
      this.summarData.forEach(function(fk) {
        fk.focus = false
      })
      item.focus = true
      let sendData = {
        data: {
          time: item.title,
        }
      }
      console.log("发送参数", sendData)
      console.log("item>>>", item)
      // console.log("info>>>", info)
    },
    handleTaskNameClicked(item) {
      console.log(item)
    },
    handleTZTaskNameClicked(item){
      console.log(item)
      model.invoke("taskNameClick",item.taskid)
    },
    tzClickAccept(item){
      console.log(item)
      model.invoke("taskAccept",item.taskid)
    },
    designClickAccept(item) {
      this.$confirm('确认接受指定的任务?', '接受', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      console.log(item)
    },
    auditUrge(item) {
      this.$confirm('确认催办指定的任务?', '催办', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      console.log(item)
    },
    reviewUrge(item) {
      this.$confirm('确认催办指定的任务?', '催办', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      console.log(item)
    },
    iconArrowClick(item) {
      item.open = !item.open
    },
    auditClickAccept(row) {
      console.log(row)
    },
    reviewClickAccept(item) {
      this.$confirm('确认接受指定的任务?', '接受', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      console.log(row)
    }
  }
}).$mount("#taskKanbanApp")