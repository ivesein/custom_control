new Vue({
  delimiters: ["${", "}"],
  data: {
    tableData: [],
    currentPage: 1,
    totalPage: 1,
    detailInfo: {},
    detailInfoShow: false,
    allInfoShow: false,
    // baseUrl: "http://192.168.111.12:8100/api/bsn",
    baseUrl: "http://192.168.1.252:8100/api/bsn",
    showKeys: [],
    currentContext: { data: {} },
  },
  computed: {
    // sliceTableData() {
    //   return this.tableData.slice(
    //     (this.currentPage - 1) * 2,
    //     this.currentPage * 2
    //   );
    // },
    transform(key) {
      return function (key) {
        return true;
        // switch (key) {
        //   case "operate_info":
        //     return "操作事项";
        //   case "operate_time":
        //     return "操作时间";
        //   case "operater":
        //     return "操作人员";
        //   case "certificate_url":
        //     return "存证地址";
        //   case "time":
        //     return "时间";
        //   case "starting_point":
        //     return "起点";
        //   case "certificate_name":
        //     return "名称";
        //   case "ending_point":
        //     return "终点";
        // }
      };
    },
  },
  created() {
    // this.totalPage = Math.ceil(this.tableData.length / 2);
  },
  mounted() {
    this.getBsnList("15529270813");
  },
  methods: {
    /**
     * @Author: zhang fq
     * @Date: 2020-09-18
     * @Description: 根据设计方和业主方 封装不同的下载附件方法  设计方使用的oss  业主方使用的金蝶自带
     */
    uploadFileZip(src) {
      window.open(src, "_blank");
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
    /**
     * @Author: zhang fq
     * @Date: 2020-09-17
     * @Description: 查看详情按钮  处理当前点击的列表行信息 截取部分字段用于正数字段信息展示
     */
    checkDetails(row) {
      console.log(row);
      this.currentContext = row.context;
      let keys = Object.keys(this.currentContext.data);
      this.showKeys = keys.length > 8 ? keys.slice(0, 7) : keys;
      this.detailInfoShow = true;
    },
    /**
     * @Author: zhang fq
     * @Date: 2020-09-17
     * @Description: 点击详情页面查看更多按钮 打开所有信息展示面板 以及相关数据处理方法
     */
    checkAllInfo() {
      this.allInfoShow = true;
    },
    /**
     * @Author: zhang fq
     * @Date: 2020-09-15
     * @Description: 根据接口文档封装区块链存证信息列表获取接口方法
     */
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
          /**
           * @Author: zhang fq
           * @Date: 2020-09-17
           * @Description: 解构处理接口返回数据并重新拼装为表格展示数据格式
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
        },
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      }
    },
    closeDetailInfo() {
      this.detailInfoShow = false;
    },
  },
}).$mount("#bcCertificateApp");
