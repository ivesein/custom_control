;(function(KDApi, $) {

  function MyComponent(model) {
    this._setModel(model)
  }

  MyComponent.prototype = {
      // 内部函数不推荐修改
      _setModel: function(model) {
        this.model = model // 内部变量挂载
        this.model.showSysMsgCenterVue = null
      },
      init: function(props) {
        console.log("init---", this.model, props)
        setHtml(this.model, props)
      },
      update: function(props) {
        console.log("-----update", this.model, props)
        console.log(this.model.showSysMsgCenterVue)
        if (this.model.showSysMsgCenterVue) {
          this.model.showSysMsgCenterVue.handleUpdata(this.model, props)
        }else{
          setHtml(this.model, props)
        }
      },
      destoryed: function() {
        console.log("-----destoryed", this.model)
        this.model.showSysMsgCenterVue = null
      }
    }
  var setHtml = function(model, props) {
      KDApi.loadFile("./css/main.css", model.schemaId, function() {
        KDApi.loadFile("./js/vue.min.js", model.schemaId, function() {
          KDApi.loadFile("./js/vue.js", model.schemaId, function() {
                  KDApi.templateFilePath(
                    "./html/show_sys_msg_center.html",
                    model.schemaId, {
                      path: KDApi.nameSpace(
                        model.schemaId
                      ) + "./img/lock.png"
                    }
                  ).then(function(result) {
                    model.dom.innerHTML = ""
                    model.dom.innerHTML = result
                    model.showSysMsgCenterVue = new Vue({
                      delimiters: ["${", "}"],
                      data: {
                        myreg:/^[1][3,4,5,7,8][0-9]{9}$/,
				                mailreg : /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/,
				                localurl : "http://192.168.2.32:8080",
				                serverurl : "http://192.168.20.22",
				                apptoken : null,
				                access_token : null,
                        type : null,
                        accountId:"782515930994313216",
                        redirectUrl:""
                      },
                      created() {
                        if(props.data){
                          this.getTokens(props.data.userName)
                        }
                      },
                      mounted() {
                        var userName="15529270813"
                        this.type="Mobile"
                        this.getTokens(userName)
                      },
                      methods: {
                        handleUpdata(model,props){
                          if(props.data){
                            let userName=props.data.userName
                            this.getTokens(userName)
                          }
                        },
                        getTokens(username){
                          var _this=this
                          if(username){
                            // if(this.myreg.test(username)){
                            //   this.type = "Mobile";
                            // }else if(this.mailreg.test(username)){
                            //   this.type = "Email";
                            // }else {
                            //   this.type = "UserName";
                            // }
                            this.type="Mobile"
                            $.ajax({
                              url:_this.serverurl+"/ierp/api/getAppToken.do",
                              type:"post",
                              data:'{"appId": "login","appSecuret": "zda123","tenantCode": "ierp","accountId": "'+_this.accountId+'","language": "zh_CN"}',
                              dataType:"json",
                              contentType: 'application/json',
                              success:function(result){
                                if("success"==result.state){
                                  _this.apptoken = result.data.app_token;
                                  $.ajax({
                                     url: _this.serverurl+"/ierp/api/login.do",
                                     type:"post",
                                     data:'{"user":"'+username+'","apptoken":"'+_this.apptoken+'","tenantid":"ierp","accountId":"'+_this.accountId+'","usertype":"'+_this.type+'"}',
                                     dataType:"json",
                                     contentType: 'application/json',
                                     success:function(result){
                                      if("success"==result.state){
                                        _this.access_token = result.data.access_token;
                                        _this.redirectUrl=_this.serverurl+ "/ierp/accessTokenLogin.do?access_token="+_this.access_token+"&redirect="+_this.serverurl+"/ierp/index.html?formId=wf_msg_center#/dform?formId=wf_msg_center"  
                                        // var url = _this.serverurl+ "/ierp/accessTokenLogin.do?access_token="+_this.access_token+"&redirect="+_this.serverurl+"/ierp/index.html?formId=wf_msg_center#/dform?formId=wf_msg_center"  
                                        // //window.open(url);
                                        // window.location.href = url;
                                      }else{
                                        alert(result.errorMsg);
                                      }
                                    }
                                  })
                                }else{
                                    alert(result.errorMsg);
                                }
                              }
                            })
                          }else{
                            return
                          }
                        }
                      }
                    }).$mount($("#showSysMsgCenterApp", model.dom).get(0))
                  })
                }
              )
            })
          })
  }
  // 注册自定义控件
  KDApi.register("show_sys_msg_center", MyComponent)
})(window.KDApi, jQuery)