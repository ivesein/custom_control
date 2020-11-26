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
  window.addEventListener("resize", getRem, false);
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
  },
  created: function () {},
  mounted: function () {
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
    // getRem() {
    //   /*6.4: 为设计稿宽度640px; 若是750px的设计稿 只需要将6.4改为7.5即可。
    //    * 在手机屏幕宽度与设计稿一致时，即：oWidth = 750px 那么上面的计算 oWidth / 6.4 + "px" 结果就是100px;  html.style.fontSize = 100px
    //    *css3中规定 1rem就对应这<html>的font-size的大小，所以100px = 1rem 这样方便大家将px转化为rem 按照这个比例来设置字体大小、元素宽高、内外边距等的单位为rem;
    //    *举例：在设计稿中，某一行字体大小为14px,则我们需要在css文件中将对应的字体设置为0.14rem;
    //    *      在设计稿中，某一个元素宽高分别为 100px与20px;则我们需要在css中将对应的宽高设置为1rem与0.2rem;
    //    */
    //   var html = document.getElementsByTagName(
    //     "html"
    //   )[0]; /*获取标签元素<html>*/
    //   var oWidth =
    //     document.body.clientWidth ||
    //     document.documentElement
    //       .clientWidth; /*获取设备的宽度  ||后为兼容IE低版本写法*/
    //   html.style.fontSize =
    //     oWidth / 9.6 +
    //     "px"; /*设置根元素<html>字体大小   计算出的值 就相当于1rem;为什么？ 这就是rem单位的规定 1rem就等于根元素<html>字体大小*/
    // },
  },
}).$mount("#spdbApp");
