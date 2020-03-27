new Vue({
  delimiters: ["${", "}"],
  data: {
    ifSelectBoxShow:false
  },
  created() {
   
  },
  mounted() {
    // this.$nextTick(function() {
    //   this.tableHeight = window.innerHeight - this.$refs.qualityPlanTable.$el.offsetTop - 10

    //   // 监听窗口大小变化
    //   let self = this;
    //   window.onresize = function() {
    //     self.tableHeight = window.innerHeight - self.$refs.qualityPlanTable.$el.offsetTop - 10
    //   }
    // })
  },
  methods: {
    refreshData(){},
    goExit(){},
    goBeforeTaskDetail(){},
    goCurrentTaskControl(){},
    goTaskRTeportDetail(){},
    goProgress(){},
    showSelectBox(){
      this.ifSelectBoxShow=!this.ifSelectBoxShow
    }
  }
}).$mount("#progressCAApp")