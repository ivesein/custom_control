/**
 * @Author: zhang fq
 * @Date: 2020-09-10
 * @Description: 区块链信息控件封装
 */
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
                    userId: "",
                  },
                  mounted() {
                    this.handleUpdata(model, props);
                  },
                  computed: {
                    sliceTableData() {
                      return this.tableData.slice(
                        (this.currentPage - 1) * this.numPerPage,
                        this.currentPage * this.numPerPage
                      );
                    },
                    transform(key) {
                      return function (key) {
                        switch (key) {
                          case "operate_info":
                            return "操作事项";
                          case "operate_time":
                            return "操作时间";
                          case "operater":
                            return "操作人员";
                          case "certificate_url":
                            return "存证地址";
                          case "time":
                            return "时间";
                          case "starting_point":
                            return "起点";
                          case "certificate_name":
                            return "名称";
                          case "ending_point":
                            return "终点";
                        }
                      };
                    },
                  },
                  methods: {
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
                          this.userId = props.data.data || ""; // 页面初始化 获取后台返回的当前用户id
                          if (this.userId) {
                            this.getBcInfoList(this.userId); // 调用获取区块链存证信息列表方法
                          } else {
                            console.log("获取当前用户id失败！");
                          }
                          // this.totalPage = Math.ceil(
                          //   this.tableData.length / this.numPerPage
                          // );
                        }
                      }
                    },
                    /**
                     * @Author: zhang fq
                     * @Date: 2020-09-10
                     * @Description: 区块链控件封装，封装获取区块链存证信息列表接口交互方法
                     */
                    getBcInfoList(userid) {
                      let param = {
                        id: userid,
                        type: "",
                      };
                      $.ajax({
                        type: "POST",
                        url: baseUrl + "api/bsn/list",
                        data: param,
                        dataType: "json",
                        success: (res) => {
                          this.tableData = res.data;
                        },
                        error: (err) => {
                          console.log(error);
                        },
                      });
                    },
                    checkDetails(row) {
                      console.log(row);
                      this.detailInfoShow = true;
                      this.detailInfo.operate_info = row.operate_info;
                      this.detailInfo.operate_time = row.operate_info;
                      this.detailInfo.certificate_url = row.certificate_url;
                      this.detailInfo.operater = row.operater;
                      this.detailInfo.time = row.time;
                      this.detailInfo.starting_point = row.starting_point;
                      this.detailInfo.certificate_name = row.certificate_name;
                      this.detailInfo.ending_point = row.ending_point;
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
