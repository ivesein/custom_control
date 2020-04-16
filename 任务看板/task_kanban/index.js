var taskKanbanVue = null;
(function (KDApi, $) {
  function MyComponent(model) {
    this._setModel(model);
  }
  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
    },
    init: function (props) {
      console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      // var tData = JSON.parse(props.data)
      console.log("-----update", this.model, props);
      // firstInit(props, this.model)
      // setHtml(this.model, props)
      if (taskKanbanVue && props.data) {
        taskKanbanVue.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      taskKanbanVue = null;
    },
  };
  /**
   *@description 第一次打开页面加载相关依赖前端文件
   *
   * @param {*} model 金蝶内建对象model
   */
  var setHtml = function (model, props) {
    KDApi.loadFile("./js/lodash.js", model.schemaId, function () {
      KDApi.loadFile("./css/element.css", model.schemaId, function () {
        KDApi.loadFile("./css/main.css", model.schemaId, function () {
          KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
            KDApi.loadFile("./js/element.js", model.schemaId, function () {
              KDApi.templateFilePath(
                "./html/task_kanban.html",
                model.schemaId,
                {
                  path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
                }
              ).then(function (result) {
                model.dom.innerHTML = result;
                // model.invoke("initData", '') //初始化
                console.log(props.data);
                // if (props.data === undefined || props.data === null) {
                // 	return
                // }
                taskKanbanVue = new Vue({
                  delimiters: ["${", "}"],
                  data: {
                    activeName: "first",
                    showPannal: true,
                    tabData: [
                      {
                        id: 1,
                        text: "设计校审任务",
                        focus: true,
                      },
                      {
                        id: 2,
                        text: "提资任务",
                        focus: false,
                      },
                    ],
                    // 提资任务概览数据
                    summarDataTZ: [],
                    // 提资任务数据
                    tzTaskInfos: [],
                    //当前类型的提资任务数据列表数据
                    currentTzTaskData: [],
                    allDatas: null,
                    currentType: "",
                    summarData: [],
                    responsibleTaskInfos: [],
                    participtionTaskInfos: [],
                    professionalAuditTaskInfos: [],
                  },
                  created() {
                    this.handleUpdata(model, props);
                  },
                  methods: {
                    handleCurrentTypeToDisplay(currentType, allData) {
                      // console.log("currentType>>>", currentType)
                      // console.log("allData>>>", allData)
                      switch (currentType) {
                        case "总任务":
                          this.responsibleTaskInfos =
                            allData.all.responsibleTaskInfos;
                          this.participtionTaskInfos =
                            allData.all.participtionTaskInfos;
                          this.professionalAuditTaskInfos =
                            allData.all.professionalAuditTaskInfos;
                          break;
                        case "待完成任务":
                          this.responsibleTaskInfos =
                            allData.beCompleted.responsibleTaskInfos;
                          this.participtionTaskInfos =
                            allData.beCompleted.participtionTaskInfos;
                          this.professionalAuditTaskInfos =
                            allData.beCompleted.professionalAuditTaskInfos;
                          break;
                        case "已完成任务":
                          this.responsibleTaskInfos =
                            allData.completed.responsibleTaskInfos;
                          this.participtionTaskInfos =
                            allData.completed.participtionTaskInfos;
                          this.professionalAuditTaskInfos =
                            allData.completed.professionalAuditTaskInfos;
                          break;
                        case "已过期任务":
                          this.responsibleTaskInfos =
                            allData.overTime.responsibleTaskInfos;
                          this.participtionTaskInfos =
                            allData.overTime.participtionTaskInfos;
                          this.professionalAuditTaskInfos =
                            allData.overTime.professionalAuditTaskInfos;
                          break;
                        default:
                          this.responsibleTaskInfos =
                            allData.all.responsibleTaskInfos;
                          this.participtionTaskInfos =
                            allData.all.participtionTaskInfos;
                          this.professionalAuditTaskInfos =
                            allData.all.professionalAuditTaskInfos;
                      }
                    },
                    handleUpdata(model, props) {
                      // 处理设计校审任务面板初始化数据显示
                      if (props.data) {
                        this.allDatas = props.data;
                        this.summarData = this.allDatas.summarData;
                        for (let i = 0; i < this.summarData.length; i++) {
                          if (this.summarData[i].focus) {
                            this.currentType = this.summarData[i].title;
                            break;
                          }
                        }
                        this.handleCurrentTypeToDisplay(
                          this.currentType,
                          this.allDatas
                        );
                        // 处理提资面板初始化数据显示
                        this.tzTaskInfos = props.data.tzTaskData;
                        this.summarDataTZ = props.data.summarDataTZ;
                        let type = "";
                        for (let i = 0; i < this.summarDataTZ.length; i++) {
                          if (this.summarDataTZ[i].focus) {
                            type = this.summarDataTZ[i].title;
                            break;
                          }
                        }
                        this.handleCurrentTypeTzTaskDisplay(type);
                      }
                    },
                    handleSummaryItemClicked(item) {
                      this.summarData.forEach(function (fuck) {
                        fuck.focus = false;
                      });
                      item.focus = true;
                      this.currentType = item.title;
                      this.handleCurrentTypeToDisplay(
                        this.currentType,
                        this.allDatas
                      );
                    },
                    // clickNameOpenTaskDetail
                    handleTaskNameClicked(item) {
                      console.log(item);
                      let sendData = {
                        data: item,
                      };
                      model.invoke("clickNameOpenTaskDetail", sendData);
                    },
                    designClickAccept(item) {
                      // console.log(item)
                      this.$confirm("确认接受该任务?", "接受", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                      }).then(() => {
                        let sendData = {
                          type: this.currentType,
                          data: item,
                        };
                        model.invoke("designCliickAcceptTaskButton", sendData);
                      });
                    },
                    auditUrge(item) {
                      this.$confirm("确定催办该任务?", "催办", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                      }).then(() => {
                        let sendData = {
                          type: this.currentType,
                          data: item,
                        };
                        model.invoke("auditClickUrgeTaskButton", sendData);
                      });
                    },
                    reviewUrge(item) {
                      this.$confirm("确定催办该任务?", "催办", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                      }).then(() => {
                        let sendData = {
                          type: this.currentType,
                          data: item,
                        };
                        model.invoke("reviewClickUrgeTaskButton", sendData);
                      });
                    },
                    iconArrowClick(item) {
                      item.open = !item.open;
                    },
                    auditClickAccept(row) {
                      this.$confirm("确定接受该任务?", "接受", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                      }).then(() => {
                        let sendData = {
                          type: this.currentType,
                          data: row,
                        };
                        model.invoke("auditCliickAcceptTaskButton", sendData);
                      });
                    },
                    reviewClickAccept(item) {
                      this.$confirm("确定接受该任务?", "接受", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                      }).then(() => {
                        let sendData = {
                          type: this.currentType,
                          data: item,
                        };
                        model.invoke("reviewCliickAcceptTaskButton", sendData);
                      });
                    },
                    // 以下为 提资任务面板相关数据处理方法封装以及点击交互方法
                    // 处理标签按钮点击 加载焦点样式 展示相应面版
                    handleTabClick(item) {
                      console.log(item);
                      this.tabData.forEach(function (fk) {
                        fk.focus = false;
                      });
                      item.focus = true;
                      this.showPannal = item.id === 1 ? true : false;
                    },
                    // 处理提资面板 概览数据 按钮 显示相应状态的任务
                    handleSummaryTZItemClicked(item) {
                      this.summarDataTZ.forEach(function (fk) {
                        fk.focus = false;
                      });
                      item.focus = true;
                      this.handleCurrentTypeTzTaskDisplay(item.title);
                    },
                    // 根据当前所点任务类型 过滤要显示的数据
                    handleCurrentTypeTzTaskDisplay(type) {
                      var _this = this;
                      this.currentTzTaskData = [];
                      switch (type) {
                        case "总任务":
                          _this.currentTzTaskData = _.cloneDeep(
                            _this.tzTaskInfos
                          );
                          break;
                        case "待完成任务":
                          _this.tzTaskInfos.forEach(function (v) {
                            if (v.task_status === "2") {
                              _this.currentTzTaskData.push(v);
                            }
                          });
                          break;
                        case "已完成任务":
                          _this.tzTaskInfos.forEach(function (v) {
                            if (v.task_status === "3") {
                              _this.currentTzTaskData.push(v);
                            }
                          });
                          break;
                        default:
                          _this.currentTzTaskData = _.deepClone(
                            _this.tzTaskInfos
                          );
                      }
                    },
                    // 提资任务名点击接口数据交互
                    handleTZTaskNameClicked(item) {
                      console.log(item);
                      model.invoke("taskNameClicked", item.taskid);
                    },
                    // 提资任务接受按钮点击接口数据交互
                    tzClickAccept(item) {
					  console.log(item);
					  this.$confirm("确认接受该任务?", "接受", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                      }).then(() => {
						model.invoke("taskAccept", item.taskid);
                      });
                    },
                  },
                }).$mount("#taskKanbanApp");
              });
            });
          });
        });
      });
    });
  };
  // 注册自定义控件
  KDApi.register("task_kanban_v2.0", MyComponent);
})(window.KDApi, jQuery);
