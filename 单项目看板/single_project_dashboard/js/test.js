// /*设置根元素<html>字体大小*/
function getRem() {
  var html = document.getElementsByTagName("html")[0]; /*获取标签元素<html>*/
  var oWidth =
    document.body.clientWidth ||
    document.documentElement
      .clientWidth; /*获取设备的宽度  ||后为兼容IE低版本写法*/
  html.style.fontSize =
    oWidth / 9.6 +
    "px"; /*设置根元素<html>字体大小   计算出的值 就相当于1rem;为什么？ 这就是rem单位的规定 1rem就等于根元素<html>字体大小*/
}

// /*6.4: 为设计稿宽度640px; 若是750px的设计稿 只需要将6.4改为7.5即可。
//  * 在手机屏幕宽度与设计稿一致时，即：oWidth = 750px 那么上面的计算 oWidth / 6.4 + "px" 结果就是100px;  html.style.fontSize = 100px
//  *css3中规定 1rem就对应这<html>的font-size的大小，所以100px = 1rem 这样方便大家将px转化为rem 按照这个比例来设置字体大小、元素宽高、内外边距等的单位为rem;
//  *举例：在设计稿中，某一行字体大小为14px,则我们需要在css文件中将对应的字体设置为0.14rem;
//  *      在设计稿中，某一个元素宽高分别为 100px与20px;则我们需要在css中将对应的宽高设置为1rem与0.2rem;
//  */

// /*页面初始化调用getRem()*/
window.onload = function () {
  /*初始化*/
  getRem();
  /*getRem绑定监听*/
};

new Vue({
  delimiters: ["${", "}"],
  data: {
    currentStep: 1,
    stepsInfo: [
      {
        step: 0,
        desc: "项目计划中",
      },
      {
        step: 1,
        desc: "任务发布中",
      },
      {
        step: 2,
        desc: "项目进行中",
      },
      {
        step: 3,
        desc: "项目审核中",
      },
      {
        step: 4,
        desc: "项目结束",
      },
    ],
    planStartDate: "2020-10-10",
    planEndDate: "2021-8-10",
    dayScompleted: "46",
    totalDays: "300",
    tasksScompleted: "30",
    totalTasks: "160",
    earnedValue: 45,
    proTargetInfo: [
      {
        title: "进度目标",
        imgUrl: "../img/1.png",
        subTitle: "",
      },
      {
        title: "质量目标",
        imgUrl: "../img/2.png",
        subTitle: "",
      },
      {
        title: "安全目标",
        imgUrl: "../img/3.png",
        subTitle: "安全第一",
      },
      {
        title: "成本目标",
        imgUrl: "../img/4.png",
        subTitle: "",
      },
      {
        title: "激励政策",
        imgUrl: "../img/5.png",
        subTitle: "赋能行业精英，铸造精品建筑",
      },
    ],
    taskInfo: [
      {
        title: "总任务数",
        number: 11,
      },
      {
        title: "已完成",
        number: 2,
      },
    ],
    taskStatusInfo: [
      {
        title: "进行中",
        number: 2,
        color: "#5582F3",
      },
      {
        title: "未开始",
        number: 2,
        color: "#F8B551",
      },
      {
        title: "已逾期",
        number: 7,
        color: "#EB6100",
      },
    ],
    percentage: 10,
    colors: [
      { color: "#f56c6c", percentage: 20 },
      { color: "#e6a23c", percentage: 40 },
      { color: "#5cb87a", percentage: 60 },
      { color: "#1989fa", percentage: 80 },
      { color: "#6f7ad3", percentage: 100 },
    ],
    taskProgress: 30,
    option: {
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
          areaStyle: {},
        },
      ],
    },
    lineChart: null,
  },
  created: function () {},
  mounted: function () {
    var _this = this;
    this.$nextTick(function () {
      _this.drawProgress(_this.taskProgress);
      _this.drawLineChart();
    });
    window.addEventListener(
      "resize",
      function () {
        getRem();
        _this.drawProgress(_this.taskProgress);
        // _this.drawLineChart();
        var html = document.getElementsByTagName(
          "html"
        )[0]; /*获取标签元素<html>*/
        var oWidth =
          document.body.clientWidth || document.documentElement.clientWidth;
        var ft = Math.round(oWidth / 9.6);
        var lc = document.getElementById("lineChart");
        // if (lc.hasChildNodes()) {
        //   //当table下还存在子节点时 循环继续
        //   lc.removeChild(lc.firstChild);
        // }
        lc.style.height = 1.25 * ft + "px";
        _this.lineChart.resize();
      },
      false
    );
    /*页面初始化调用getRem()*/
    /*初始化*/
    var _this = this;
    // this.getRem();
    // window.onresize = function () {
    //   _this.getRem();
    // };
    /*getRem绑定监听*/
    // window.addEventListener(
    //   "resize",
    //   function () {
    //     _this.getRem();
    //   },
    //   false
    // );
    // var myChart = echarts.init(
    //   document.getElementById("resourceUtilizationCharts")
    // );
    // myChart.setOption(this.option2);
  },
  methods: {
    drawLineChart: function () {
      var html = document.getElementsByTagName(
        "html"
      )[0]; /*获取标签元素<html>*/
      var oWidth =
        document.body.clientWidth || document.documentElement.clientWidth;
      var ft = Math.round(oWidth / 9.6);
      var lc = document.getElementById("lineChart");
      // if (lc.hasChildNodes()) {
      //   //当table下还存在子节点时 循环继续
      //   lc.removeChild(lc.firstChild);
      // }
      lc.style.height = 1.25 * ft + "px";
      this.lineChart = echarts.init(lc);
      this.lineChart.setOption(this.option);
    },
    drawProgress: function (percent) {
      var html = document.getElementsByTagName(
        "html"
      )[0]; /*获取标签元素<html>*/
      var oWidth =
        document.body.clientWidth || document.documentElement.clientWidth;
      var ft = Math.round(oWidth / 9.6);
      console.log(ft);
      var canvas = document.getElementById("progressCanvas");
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!ctx) {
        console.log("该浏览器不支持canvas");
      } else {
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          0.25 * ft,
          0.75 * Math.PI,
          2.25 * Math.PI
        );
        ctx.strokeStyle = "#ecf1fe";
        ctx.lineWidth = "12";
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
          canvas.width / 2,
          canvas.height / 2,
          0.25 * ft,
          0.75 * Math.PI,
          (0.75 + (1.5 * percent) / 100) * Math.PI
        );
        ctx.strokeStyle = "#5582F3";
        ctx.lineWidth = 12;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.beginPath();
        // 绘制完成率
        ctx.font = 0.08 * ft + "px serif";
        ctx.fillStyle = "#B4B4B4";
        var text = ctx.measureText("完成率");
        ctx.fillText(
          "完成率",
          (canvas.width - text.width) / 2,
          canvas.height / 2 - 0.05 * ft
        );
        // 绘制百分比
        ctx.font = 0.12 * ft + "px serif";
        ctx.fillStyle = "#5582F3";
        var value = ctx.measureText(percent);
        console.log(value);
        // var textEn = context.measureText('handsome');
        // ctx.fillText("30", canvas.width/2, canvas.height/2+10)
        ctx.fillText(
          "30",
          (canvas.width - value.width) / 2,
          canvas.height / 2 + 0.08 * ft
        );
        ctx.font = 0.07 * ft + "px serif";
        ctx.fillStyle = "#5582F3";
        ctx.fillText(
          "%",
          canvas.width / 2 + value.width / 2 + 5,
          canvas.height / 2 + 0.08 * ft
        );
        ctx.stroke();
      }
    },
  },
}).$mount("#spdbApp");
