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
    ],
    toBeComplected:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAADnElEQVRIS7WWXWwUVRTH/+duu1sSFNHuR/kwgh8lMZC4ggTF0CfA6MwdS0YT4wMKT77xAKJPfeLrRV54kwQTYwKTtDszJgJPQAkIjSSQkKgpwSjS2W5lNfaB2e7OMXd3pg7sUlq6vW937j3nd++Zc+75Ex4zGKCSrr/NwLsAvQXgJQBLQ7MygFEAlwj8fdpxhgngmVzSoxZ5YECUrl3byaAvQsjjzqbWRwl8MJ3Pn6CBgaCVQUugp2mrBCVOMnjDbCgP7yHQSMC1D3Oue7t57aEvY4bRJwK2AHRHSwyUCfiOCWeCWu16edEiL+P7KWJeXhXiZWJsY+Aj+j/UynSCwDsyjnMhjnjghsX3jK0Q7AJIhpvuA3SAUp1fZSxrcqbbjpvmYvan9gD8JYCucG8FBD1r22ci22lgSdd7A9AIgKfCxd8AllnHuTGXsHpSriWGA+CF0G5SgNenHecXNa8D2TQTJX/qcuyf3enoSGx6bnDwzlxg0d6/+vtXVKu1ywBWNCA0kk51biLLqtWB47r+KYOOR2FkQl/Otq88CSyy8aTcSIxzUXiZaXfOLRwnVWfjuvw1Sn1mHMq5tiqFeY+ilIfA+Dx0NJpx7FeopL2/JaBAnURVbDmZSq561rL+mTcNwD3TXFLxK7ej7BUs+qio64cB2tcA0DdZp7CzHbDIR1HKY2B81pjzEQUcBmhzg4f+rG0PtRPoSamFWavcDlNRlx6ArJpVCc8vt+0/2gn8U8qVHYzfQ59FBfSjQp9IJVOvWlYlDvSk3E1MW2dzCCY+m7Ptr+N7b5pmstuvKIYalQeAAvx02nH+XWjgdEhFQvSmh4ZUibRttAhpLGnAO7KOM9g2GoBWSXMEwN4wS09kbfuTdgKbyiJe+GDc6+xKrl7Qwl/Ip83T5EEi7A8jNprJv9Zbf7w9zdhFxFE63w8EbekpFK7OJ7RjhvGGCPh80+Ndf3BMM1H0Kz8SsD6EtLU9MeOnbFdy43R7UpAJTVtTI6Ea8OIQ2rYGnOBgQ7fr/tx4PWNjXDPeYeJCXGIw42gqQYeXFgp/zxTismE84wfYR+A9cYlBTEbGLfwQ2TapthB6KnbTetuqiygWpwOeutGzbNmYcjB2926PoM51RMH2FiJqkpg+iMOabhidQoW3CvEtEV5/ksRR/6wDwcdRGOM+ZiOElQp7cZbgWwQ+MGchHHceKvDNTKSB8WYIj0v9WyBcImY3nc9ffJTijnz+B+dRqkNbeDgFAAAAAElFTkSuQmCC",
    inProgress:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAADwklEQVRIS62WXWwUVRTH/2fu7BYT/GgiGAMaUWsJBl8ACYihT35EUMLuXY3xAZUn33iQlt0lmdjdacuLvvgmCSbGyE6LBDDCm1qDH40Pkkj8KNEoCZAYFmMf2p25c8ydzizT7ezO1ux92z0fv7nnnnPvn5CymEFetfA0gBeI+CkAjwLoD8PqAGYZuAimc2apNk0E7pSS2hnZsgyVuXwA4CMhJO3btH0WoDHhbjpBluUnBSQCeVRuUAZOAtjWDSXBZ0b4eJmOOr+32pYB3dH8EBnkALg35lwH+GOwcUGY/CPmcR13LPRBZdYpXwyA/GcBejVWah36NzPlMuXaV3HoEqA7ln+GfDoLIBs6zRPINlx+lyxnrtNu2ZKr/QwdYnARwKrQt8GgFzOl2oUotgnkUTmoDMwAuDM0/qHgv9RXmrq0krIuvCM3C4EzAB4K4+aEj6101PlF/w6AXJNC/YZvYmd2VZhqBw2fupoEU7Yc0f+LojOeZOeJ/euVJ3S+9aF9RgxgBxUcFQC9auENgI9HZfTJH8oWp75rtzOvKs9pm1ly9rTzadi57QYbXzTLSzhoFp3jpOdM2fLXqPWZMZ4pO3oU2q5ugDrYrebHCTQcJpoVRecxcm25mxj6S/SqC4ENNOL80wsgj8u7lYIejeCiYMIQuZXCBBEfDgDMH5rlyQNpTdLtDsPjeh/gtxbT0zHyqnIawK5FIPabZefTngIrhb0g1l2r17QGXgdwX9B1LB6k8id/9RLIlVceUKT+DHPe0MCFaNCFiz6ynEZPgZbMqgw0Q6/GUqC5cBcNn/k3FWjLG2CsbeO3xyw5n0U2TgDeLikZg1Q8qUek41J2vuwDawymn1odDYHzNOJEJURSSW83DXHOLE6eSgOuxO61No1blccIeDtMcsIsOa+vJGGar1ctLB2LlsG/KQQeThv8NEjz/JIG//9cbd0C3YocI0Jw0Ws1INzHBxcvb1u+CcYHoWHeZ+zOlp3vu02c5NeoyCcNwpfLLm/tHD5P3wLYGgZ3fJ7SPqT1eSLgB2MA25vPUwC1cxsVG/oBXh0m7N0DTP42Kk79rPMukRheNf88QKfjEoMZ75meO0HW6VuddsbWvnu8TPYwgQ/FJQbA+8zS5OdR7DIRFUJrsZ1q30URRTgvDLqE/v5rQYJ6/X7l8xNgPJcgouYALsRhy3bYbGc7t9Fn4yMGtqSdV5I9ODPyX4vKGPfpRghrFfZIl+ArANkrFsLx5FqBe+blXYC/l4h2hvC41L/CzBcB46zpbfq6neKOcv4HagK2XKPQC3gAAAAASUVORK5CYII=",
    complected:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAETklEQVRIS7VWbWxTZRR+zr11WxOmCCNDBRQBZyQaE0EyaXvXH37FTI2EaQSSCWa2BRP5gSBx9O1GxiAmkkg/WMRAYoxuCRoxUTSxtHcBkRAjZsaPEYgSnVqtxiX7oPcec2/vrbdb130A748mve95znM+33MIkxxmUCS92QvSHgNoNYiWgvlGE0aUBXM/gJNg6aOwL6oSgcuppIkuBQsJvQPNYHoFwNLJDLPu+0G8B575hwUJvRSmJGF7asviHGnvEbByikRFYgyccbH8dKty4MJY/DhCoQYawNQDoMYWZiBLhHcIdFxH7muakx1wZ6srhy67biGXaxmDH2bGswTkQ50/GbC0RijRtJO0iDCcCj1ExMcAVFhCwwTuYE16Xfhjg+W8FcnQLJL1rQzaCaDKkh0l8ONhX+K4jS0QtvcG6zQdZwBUW5cXATwhfPFz0wlrW2rL3TppHwK4zcINyhJWtHri35t1Zvx0d6+V++bXnPo/Z3wJ2nX1wv/GpemQ2bIi+eICyJdPAbTA+GbkdPlApr6pqUczCYUa2AimQ3YYJZIadnmjp2dCZmPa1M2rdNZP2OElpufDSuwQmX2mBn8olD5Rp/DGjFa44iNSwU4QtluK+sPe+B3Ulg4qOmBYYriedY9oi3c82PXPFbMB6Pys5YahSvmCXb0S0EAiHdgL0MsWwRHhizfPlKw99cKyVuXgj068SAWiIArlv/E+EumgCsBjVhDxU2Fv4v3pEopkcxVc7tfAaBS++K1OfEQNNTKzUbVGiaok1NAAmGuN/y6mRa8qsZ+dgLDasogkaVisTvxeyhCznTS8y4SFxNgolHheuXV2p0ILc8Q/5QnpN8PDkUKjz81UiuU9o7awabnsPs1AtSxJjbs80b5i6wMbmCkGwlcundaNNdaQFX1rK/BnjcFhnNEiQrc0cv12z1v/FuXg5KY5yFUcZeBeMDVFlNinxqsCmQ8A2ABCB3K1EeEXuVIRGE/oCClIqhPeqNEiRScPmnsQoPVEvJshPQPm2WBeJ5TE5+VyXiqkhaIB0xqhxI5OpCCSDm5joBPARchcP1FeyxdNOrgPwLa8EB8WvsRz5SyOnAj5mXPfCH9XppxcoQ7GtoWz8QH8VTWi3X5NG/+aPm1qaA+Yd1je9sNbW2c+3pFUaBMTv2ldDAOsCF/iy6mEbCIZkQ7cD1Bq3ONtAIzx9G3tvC9AvMLK5VUdTwDO3jWQWVUYT2aDJlvuhCwbA3iWZfVVG8DQtJXC3/Wd+dgUlXBv8FHW8YFzxQDRfuQq9gr//r/LhVgkX5oNecQYAluLVgwJT4Y98Y9t7LglKpIn7XZ4ao4tY4kC+BOGfu5mN341FPwyhJsI0j0APVJiiRokCU1OsnEeFnonH963Adw3w8I5C01bb4fRqWPSRZiZdhKwZCrEDJwn4o5pL8JO5eYGnv7DA9IbATwAoiVjVv3z1qp/DL55vRNt3LbO/wAk8+W4CSAk4QAAAABJRU5ErkJggg==",
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