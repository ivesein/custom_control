var taskKanbanVue = null;
(function (KDApi, $) {
  function MyComponent(model) {
    this._setModel(model);
  }
  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.taskKanbanVue = null;
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
      if (this.model.taskKanbanVue && props.data) {
        this.model.taskKanbanVue.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.taskKanbanVue = null;
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
                model.taskKanbanVue = new Vue({
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
                    toBeComplected:
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAADnElEQVRIS7WWXWwUVRTH/+duu1sSFNHuR/kwgh8lMZC4ggTF0CfA6MwdS0YT4wMKT77xAKJPfeLrRV54kwQTYwKTtDszJgJPQAkIjSSQkKgpwSjS2W5lNfaB2e7OMXd3pg7sUlq6vW937j3nd++Zc+75Ex4zGKCSrr/NwLsAvQXgJQBLQ7MygFEAlwj8fdpxhgngmVzSoxZ5YECUrl3byaAvQsjjzqbWRwl8MJ3Pn6CBgaCVQUugp2mrBCVOMnjDbCgP7yHQSMC1D3Oue7t57aEvY4bRJwK2AHRHSwyUCfiOCWeCWu16edEiL+P7KWJeXhXiZWJsY+Aj+j/UynSCwDsyjnMhjnjghsX3jK0Q7AJIhpvuA3SAUp1fZSxrcqbbjpvmYvan9gD8JYCucG8FBD1r22ci22lgSdd7A9AIgKfCxd8AllnHuTGXsHpSriWGA+CF0G5SgNenHecXNa8D2TQTJX/qcuyf3enoSGx6bnDwzlxg0d6/+vtXVKu1ywBWNCA0kk51biLLqtWB47r+KYOOR2FkQl/Otq88CSyy8aTcSIxzUXiZaXfOLRwnVWfjuvw1Sn1mHMq5tiqFeY+ilIfA+Dx0NJpx7FeopL2/JaBAnURVbDmZSq561rL+mTcNwD3TXFLxK7ej7BUs+qio64cB2tcA0DdZp7CzHbDIR1HKY2B81pjzEQUcBmhzg4f+rG0PtRPoSamFWavcDlNRlx6ArJpVCc8vt+0/2gn8U8qVHYzfQ59FBfSjQp9IJVOvWlYlDvSk3E1MW2dzCCY+m7Ptr+N7b5pmstuvKIYalQeAAvx02nH+XWjgdEhFQvSmh4ZUibRttAhpLGnAO7KOM9g2GoBWSXMEwN4wS09kbfuTdgKbyiJe+GDc6+xKrl7Qwl/Ip83T5EEi7A8jNprJv9Zbf7w9zdhFxFE63w8EbekpFK7OJ7RjhvGGCPh80+Ndf3BMM1H0Kz8SsD6EtLU9MeOnbFdy43R7UpAJTVtTI6Ea8OIQ2rYGnOBgQ7fr/tx4PWNjXDPeYeJCXGIw42gqQYeXFgp/zxTismE84wfYR+A9cYlBTEbGLfwQ2TapthB6KnbTetuqiygWpwOeutGzbNmYcjB2926PoM51RMH2FiJqkpg+iMOabhidQoW3CvEtEV5/ksRR/6wDwcdRGOM+ZiOElQp7cZbgWwQ+MGchHHceKvDNTKSB8WYIj0v9WyBcImY3nc9ffJTijnz+B+dRqkNbeDgFAAAAAElFTkSuQmCC",
                    inProgress:
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAADwklEQVRIS62WXWwUVRTH/2fu7BYT/GgiGAMaUWsJBl8ACYihT35EUMLuXY3xAZUn33iQlt0lmdjdacuLvvgmCSbGyE6LBDDCm1qDH40Pkkj8KNEoCZAYFmMf2p25c8ydzizT7ezO1ux92z0fv7nnnnPvn5CymEFetfA0gBeI+CkAjwLoD8PqAGYZuAimc2apNk0E7pSS2hnZsgyVuXwA4CMhJO3btH0WoDHhbjpBluUnBSQCeVRuUAZOAtjWDSXBZ0b4eJmOOr+32pYB3dH8EBnkALg35lwH+GOwcUGY/CPmcR13LPRBZdYpXwyA/GcBejVWah36NzPlMuXaV3HoEqA7ln+GfDoLIBs6zRPINlx+lyxnrtNu2ZKr/QwdYnARwKrQt8GgFzOl2oUotgnkUTmoDMwAuDM0/qHgv9RXmrq0krIuvCM3C4EzAB4K4+aEj6101PlF/w6AXJNC/YZvYmd2VZhqBw2fupoEU7Yc0f+LojOeZOeJ/euVJ3S+9aF9RgxgBxUcFQC9auENgI9HZfTJH8oWp75rtzOvKs9pm1ly9rTzadi57QYbXzTLSzhoFp3jpOdM2fLXqPWZMZ4pO3oU2q5ugDrYrebHCTQcJpoVRecxcm25mxj6S/SqC4ENNOL80wsgj8u7lYIejeCiYMIQuZXCBBEfDgDMH5rlyQNpTdLtDsPjeh/gtxbT0zHyqnIawK5FIPabZefTngIrhb0g1l2r17QGXgdwX9B1LB6k8id/9RLIlVceUKT+DHPe0MCFaNCFiz6ynEZPgZbMqgw0Q6/GUqC5cBcNn/k3FWjLG2CsbeO3xyw5n0U2TgDeLikZg1Q8qUek41J2vuwDawymn1odDYHzNOJEJURSSW83DXHOLE6eSgOuxO61No1blccIeDtMcsIsOa+vJGGar1ctLB2LlsG/KQQeThv8NEjz/JIG//9cbd0C3YocI0Jw0Ws1INzHBxcvb1u+CcYHoWHeZ+zOlp3vu02c5NeoyCcNwpfLLm/tHD5P3wLYGgZ3fJ7SPqT1eSLgB2MA25vPUwC1cxsVG/oBXh0m7N0DTP42Kk79rPMukRheNf88QKfjEoMZ75meO0HW6VuddsbWvnu8TPYwgQ/FJQbA+8zS5OdR7DIRFUJrsZ1q30URRTgvDLqE/v5rQYJ6/X7l8xNgPJcgouYALsRhy3bYbGc7t9Fn4yMGtqSdV5I9ODPyX4vKGPfpRghrFfZIl+ArANkrFsLx5FqBe+blXYC/l4h2hvC41L/CzBcB46zpbfq6neKOcv4HagK2XKPQC3gAAAAASUVORK5CYII=",
                    complected:
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAETklEQVRIS7VWbWxTZRR+zr11WxOmCCNDBRQBZyQaE0EyaXvXH37FTI2EaQSSCWa2BRP5gSBx9O1GxiAmkkg/WMRAYoxuCRoxUTSxtHcBkRAjZsaPEYgSnVqtxiX7oPcec2/vrbdb130A748mve95znM+33MIkxxmUCS92QvSHgNoNYiWgvlGE0aUBXM/gJNg6aOwL6oSgcuppIkuBQsJvQPNYHoFwNLJDLPu+0G8B575hwUJvRSmJGF7asviHGnvEbByikRFYgyccbH8dKty4MJY/DhCoQYawNQDoMYWZiBLhHcIdFxH7muakx1wZ6srhy67biGXaxmDH2bGswTkQ50/GbC0RijRtJO0iDCcCj1ExMcAVFhCwwTuYE16Xfhjg+W8FcnQLJL1rQzaCaDKkh0l8ONhX+K4jS0QtvcG6zQdZwBUW5cXATwhfPFz0wlrW2rL3TppHwK4zcINyhJWtHri35t1Zvx0d6+V++bXnPo/Z3wJ2nX1wv/GpemQ2bIi+eICyJdPAbTA+GbkdPlApr6pqUczCYUa2AimQ3YYJZIadnmjp2dCZmPa1M2rdNZP2OElpufDSuwQmX2mBn8olD5Rp/DGjFa44iNSwU4QtluK+sPe+B3Ulg4qOmBYYriedY9oi3c82PXPFbMB6Pys5YahSvmCXb0S0EAiHdgL0MsWwRHhizfPlKw99cKyVuXgj068SAWiIArlv/E+EumgCsBjVhDxU2Fv4v3pEopkcxVc7tfAaBS++K1OfEQNNTKzUbVGiaok1NAAmGuN/y6mRa8qsZ+dgLDasogkaVisTvxeyhCznTS8y4SFxNgolHheuXV2p0ILc8Q/5QnpN8PDkUKjz81UiuU9o7awabnsPs1AtSxJjbs80b5i6wMbmCkGwlcundaNNdaQFX1rK/BnjcFhnNEiQrc0cv12z1v/FuXg5KY5yFUcZeBeMDVFlNinxqsCmQ8A2ABCB3K1EeEXuVIRGE/oCClIqhPeqNEiRScPmnsQoPVEvJshPQPm2WBeJ5TE5+VyXiqkhaIB0xqhxI5OpCCSDm5joBPARchcP1FeyxdNOrgPwLa8EB8WvsRz5SyOnAj5mXPfCH9XppxcoQ7GtoWz8QH8VTWi3X5NG/+aPm1qaA+Yd1je9sNbW2c+3pFUaBMTv2ldDAOsCF/iy6mEbCIZkQ7cD1Bq3ONtAIzx9G3tvC9AvMLK5VUdTwDO3jWQWVUYT2aDJlvuhCwbA3iWZfVVG8DQtJXC3/Wd+dgUlXBv8FHW8YFzxQDRfuQq9gr//r/LhVgkX5oNecQYAluLVgwJT4Y98Y9t7LglKpIn7XZ4ao4tY4kC+BOGfu5mN341FPwyhJsI0j0APVJiiRokCU1OsnEeFnonH963Adw3w8I5C01bb4fRqWPSRZiZdhKwZCrEDJwn4o5pL8JO5eYGnv7DA9IbATwAoiVjVv3z1qp/DL55vRNt3LbO/wAk8+W4CSAk4QAAAABJRU5ErkJggg==",
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
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-06-12
                     * @Description: 修改任务看板接口数据返回处理方法
                     */
                    handleUpdata(model, props) {
                      // 判断是初始化哪个标签页的数据
                      if (props.data) {
                        this.allDatas = props.data;
                        // 处理设计校审任务面板初始化数据显示
                        if (props.data.summarData) {
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
                        }
                        // 处理提资面板初始化数据显示
                        if (props.data.tzTaskData) {
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
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-06-12
                     * @Description: 配合卢峰修改任务看板-设计校审任务标签页
                     * 我负责的任务 催办和接受按钮显示逻辑以及按钮点击事件方法
                     */
                    designUrge(item) {
                      this.$confirm("确定催办该任务?", "催办", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                      }).then(() => {
                        let sendData = {
                          type: this.currentType,
                          data: item,
                        };
                        model.invoke("designClickUrgeTaskButton", sendData);
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
                      let data = {
                        taskid: item.taskid,
                        projectid: item.projectid,
                      };
                      model.invoke("taskNameClicked", data);
                    },
                    // 提资任务接受按钮点击接口数据交互
                    tzClickAccept(item) {
                      console.log(item);
                      this.$confirm("确认接受该任务?", "接受", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                      }).then(() => {
                        let data = {
                          taskid: item.taskid,
                          projectid: item.projectid,
                        };
                        model.invoke("taskAccept", data);
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
  KDApi.register("task_kanban", MyComponent);
})(window.KDApi, jQuery);
