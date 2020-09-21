(function (KDApi, $) {
  function MyComponent(model) {
    this._setModel(model);
  }
  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.bcCertificateApp = null;
    },
    init: function (props) {
      console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      console.log("-----update", this.model, props);
      if (this.model.bcCertificateApp) {
        this.model.bcCertificateApp.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.bcCertificateApp = null;
    },
  };
  var setHtml = function (model, props) {
    KDApi.loadFile("./css/element.css", model.schemaId, function () {
      KDApi.loadFile("./css/main.css", model.schemaId, function () {
        KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
          KDApi.loadFile("./js/lodash.js", model.schemaId, function () {
            KDApi.loadFile("./js/element.js", model.schemaId, function () {
              KDApi.templateFilePath(
                "./html/blockchain_certificate.html",
                model.schemaId,
                {
                  path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
                }
              ).then(function (result) {
                model.dom.innerHTML = "";
                model.dom.innerHTML = result;
                model.bcCertificateApp = new Vue({
                  delimiters: ["${", "}"],
                  data: {
                    tableData: [],
                    currentPage: 1,
                    totalPage: 1,
                    detailInfo: {},
                    detailInfoShow: false,
                    allInfoShow: false,
                    baseUrl: "http://192.168.111.12:8100/api/bsn",
                    // baseUrl: "http://192.168.1.252:8100/api/bsn",
                    showKeys: [],
                    currentContext: { data: {} },
                    loading: true,
                  },
                  mounted() {
                    this.handleUpdata(model, props);
                  },
                  computed: {
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-09-21
                     * @Description: 封装 区块链type类型实时转换方法
                     */
                    convertType(type) {
                      return function (type) {
                        switch (+type) {
                          case 1:
                            return "信息发布";
                          case 2:
                            return "项目要求下发";
                          case 3:
                            return "项目过程检查";
                          case 4:
                            return "项目过程检查申请";
                          case 5:
                            return "项目过程文件提交";
                          case 6:
                            return "项目交付管理";
                          default:
                            return "";
                        }
                      };
                    },
                    // sliceTableData() {
                    //   return this.tableData.slice(
                    //     (this.currentPage - 1) * this.numPerPage,
                    //     this.currentPage * this.numPerPage
                    //   );
                    // },
                    // transform(key) {
                    //   return function (key) {
                    //     switch (key) {
                    //       case "operate_info":
                    //         return "操作事项";
                    //       case "operate_time":
                    //         return "操作时间";
                    //       case "operater":
                    //         return "操作人员";
                    //       case "certificate_url":
                    //         return "存证地址";
                    //       case "time":
                    //         return "时间";
                    //       case "starting_point":
                    //         return "起点";
                    //       case "certificate_name":
                    //         return "名称";
                    //       case "ending_point":
                    //         return "终点";
                    //     }
                    //   };
                    // },
                  },
                  methods: {
                    uploadFileZip(row) {
                      if (row.ifoss === true) {
                        const iframe = document.createElement("iframe");
                        iframe.style.display = "none"; // 防止影响页面
                        iframe.style.height = 0; // 防止影响页面
                        iframe.src = row.downloadUrl;
                        document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
                        // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
                        setTimeout(() => {
                          iframe.remove();
                        }, 60 * 1000);
                      } else {
                        window.open(row.downloadUrl, "_blank");
                      }
                      // const iframe = document.createElement("iframe");
                      // iframe.style.display = "none"; // 防止影响页面
                      // iframe.style.height = 0; // 防止影响页面
                      // iframe.src = src;
                      // document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
                      // // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
                      // setTimeout(() => {
                      //   iframe.remove();
                      // }, 60 * 1000);
                      // var form = $("<form>");
                      // form.attr("style", "display:none");
                      // form.attr("target", "_blank");
                      // form.attr("method", "get");
                      // form.attr("action", src);
                      // $("body").append(form);
                      // form.submit();
                      // setTimeout(() => {
                      //   form.remove();
                      // }, 1000 * 60);
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-09-10
                     * @Description: 区块链控件封装，处理前后台数据交互方法
                     */
                    handleUpdata(model, props) {
                      if (
                        props.data !== undefined &&
                        props.data !== null &&
                        props.data !== ""
                      ) {
                        if (props.data.method === "init") {
                          this.userId = props.data.userId || ""; // 页面初始化 获取后台返回的当前用户id
                          if (this.userId) {
                            this.getBsnList(this.userId); // 调用获取区块链存证信息列表方法
                          } else {
                            console.log("获取当前用户id失败！");
                          }
                        }
                      }
                    },
                    getBsnList(id) {
                      let _this = this;
                      let param = {
                        userId: id,
                      };
                      $.ajax({
                        type: "GET",
                        url: this.baseUrl + "/selectAll",
                        data: param,
                        // dataType: "json",
                        success: (res) => {
                          console.log(res);
                          this.loading = false;
                          /**
                           * @Author: zhang fq
                           * @Date: 2020-09-17
                           * @Description: 解构处理接口返回数据并重新拼装为表格展示数据格式
                           * @Date: 2020-09-21
                           * @Update: 添加接口数据获取过程中的加载动画
                           */
                          // 从列表接口获取的信息 结构出对应的key-value
                          if (res.code === "0") {
                            let data = res.data;
                            // let context = data.queryInfo.slice(1, data.queryInfo.length - 1);
                            let queryInfo = JSON.parse(data.queryInfo);
                            console.log(queryInfo);
                            let userids = queryInfo[0];
                            let projectids = queryInfo[1];
                            let tos = queryInfo[2];
                            let types = queryInfo[3];
                            let context = queryInfo[4];
                            _this.tableData = [];
                            let len = userids.length;
                            // 将结构出的数据重新拼装成表格列表数据用于展示
                            for (let i = 0; i < len; i++) {
                              _this.tableData.push({
                                user_id: userids[i],
                                project_id: projectids[i],
                                to: tos[i],
                                type: types[i],
                                context: JSON.parse(context[i]),
                              });
                            }
                            this.currentContext = this.tableData[0];
                          }
                          // this.tableData = res.data;
                        },
                        error: (err) => {
                          console.log(err);
                          this.loading = false;
                          this.$message.error("网络错误，请稍后重试！");
                        },
                      });
                    },
                    checkAllInfo() {
                      this.allInfoShow = true;
                    },
                    checkDetails(row) {
                      console.log(row);
                      this.currentContext = row.context;
                      let keys = Object.keys(this.currentContext.data);
                      this.showKeys = keys.length > 8 ? keys.slice(0, 7) : keys;
                      this.detailInfoShow = true;
                    },
                    prevBtn() {
                      if (this.currentPage > 1) {
                        this.currentPage--;
                      }
                    },
                    nextBtn() {
                      if (this.currentPage < this.totalPage) {
                        this.currentPage++;
                      }
                    },
                    closeDetailInfo() {
                      this.detailInfoShow = false;
                    },
                  },
                }).$mount($("#bcCertificateApp", model.dom).get(0));
              });
            });
          });
        });
      });
    });
  };
  // 注册自定义控件
  KDApi.register("blockchain_certificate", MyComponent);
})(window.KDApi, jQuery);
