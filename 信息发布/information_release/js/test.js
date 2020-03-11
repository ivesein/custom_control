var imgUrls=[
  // "http://jd15.max.svipss.top/ierp/private/subscribe_pic1.png?v=1.0",
  // "http://jd15.max.svipss.top/ierp/private/subscribe_pic2.png?v=1.0",
  // "http://jd15.max.svipss.top/ierp/private/wuxiankeneng.png?v=1.0",
  // "http://jd15.max.svipss.top/ierp/private/kingdee_dasha.png?v=1.0",
  // "http://jd15.max.svipss.top/ierp/private/player.png?v=1.0",
]
new Vue({
  delimiters: ["${", "}"],
  data: {
    animate:false,
    intNum: undefined,
    infos:[],
    needScroll:false,
    defaultImg:"http://jd15.max.svipss.top/ierp/private/subscribe_pic1.png?v=1.0"
  },
  created() {
    this.getNoticeData();
  },
  /**
   * @author  zhang fq
   * @date   2020-02-20
   * @description   判断是否需要滚动
   */
  mounted() {
    // 判断容器高度是否大于信息内容高度
    if(this.$el.clientHeight>this.$refs.newList.clientHeight){
      // 容器高度 > 信息内容高度 不需要滚动
      this.needScroll=false
    }else{
      // 容器高度 < 信息内容高度 需要滚动
      this.needScroll=true
      this.ScrollUp()
    }
  },
  methods: {
    // 从后台获取所有发布的信息
    getNoticeData() {
      this.infos=[
        {
          img:"./img/1.png",
          text:"公路云涨逾12%，独角兽再发力"
        },
        {
          img:imgUrls[1],
          text:"致敬每一位勇敢拥抱数字化浪潮的人"
        },
        {
          img:imgUrls[2],
          text:"客户至上，用心服务，公路云给您的亲笔信"
        },
        {
          img:imgUrls[3],
          text:"千万财务人共建财务新世界，公路云社区成就头号玩家"
        },
        {
          img:imgUrls[4],
          text:"公路云无限可能企业数字化转型高峰论坛"
        }
      ]
    },
    /**
   * @author  zhang fq
   * @date   2020-02-20
   * @description   图片地址解析错误替换为默认图片
   */
    errorHandler(){
      return true
    },
     /**
   * @author  zhang fq
   * @date   2020-02-20
   * @description   封装向上滚动方法 以及鼠标移上停止 移开恢复方法
   */
    ScrollUp() {
      this.intNum = setInterval(() => {
        this.animate=true;// 向上滚动的时候需要添加css3过渡动画
        setTimeout(()=>{
          this.infos.push(this.infos[0]);// 将数组的第一个元素添加到数组的
          this.infos.shift(); //删除数组的第一个元素
          this.animate=false;
        },2000)
      }, 5000);
    },
    //鼠标移上去停止滚动
    Stop() {
      if(this.needScroll){
        clearInterval(this.intNum);
      }
      
    },
    //鼠标移走恢复滚动
    Up() {
      if(this.needScroll){
        this.ScrollUp();
      }
      
    },
  }
}).$mount("#informationReleaseApp")