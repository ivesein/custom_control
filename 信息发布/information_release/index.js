/**
  *@author  zhang fuqiang
  *@date  2020-02-07  
  *@description  头像墙自定义控件js
 */
;(function(KDApi, $) {

  function MyComponent(model) {
    this._setModel(model)
  }

  MyComponent.prototype = {
      // 内部函数不推荐修改
      _setModel: function(model) {
        this.model = model // 内部变量挂载
        this.model.informationReleaseVue = null
      },
      init: function(props) {
        console.log("init---", this.model, props)
        setHtml(this.model, props)
      },
      update: function(props) {
        console.log("-----update", this.model, props)
        console.log(this.model.informationReleaseVue)
        if (this.model.informationReleaseVue) {
          this.model.informationReleaseVue.handleUpdata(this.model, props)
        }else{
          setHtml(this.model, props)
        }
      },
      destoryed: function() {
        console.log("-----destoryed", this.model)
        this.model.informationReleaseVue = null
      }
    }
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
                    "./html/information_release.html",
                    model.schemaId, {
                      path: KDApi.nameSpace(
                        model.schemaId
                      ) + "./img/lock.png"
                    }
                  ).then(function(result) {
                    model.dom.innerHTML = ""
                    model.dom.innerHTML = result
                    var imgUrls=[
                      "http://jd15.max.svipss.top/ierp/private/subscribe_pic1.png?v=1.0",
                      "http://jd15.max.svipss.top/ierp/private/subscribe_pic2.png?v=1.0",
                      "http://jd15.max.svipss.top/ierp/private/wuxiankeneng.png?v=1.0",
                      "http://jd15.max.svipss.top/ierp/private/kingdee_dasha.png?v=1.0",
                      "http://jd15.max.svipss.top/ierp/private/player.png?v=1.0",
                    ]
                    model.informationReleaseVue = new Vue({
                      delimiters: ["${", "}"],
                      data: {
                        animate:false,
                        intNum: undefined,
                        infos:[],
                        needScroll:false,
                        defaultImg:"http://jd15.max.svipss.top/ierp/private/subscribe_pic1.png?v=1.0"
                      },
                      created() {
                        this.handleUpdata(model,props)
                      },
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
                        handleUpdata(model,props) {
                          if(props.data!==undefined)
                          this.infos=props.data.infos
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
                    }).$mount($("#informationReleaseApp", model.dom).get(0))
                  })
                }
              )
            })
          })
        })
      })
    })
  }
  // 注册自定义控件
  KDApi.register("information_release", MyComponent)
})(window.KDApi, jQuery)