new Vue({
  delimiters: ["${", "}"],
  data: {
    tableData: [
      {
        name: "信息发布",
        certificate_hash: "6b4ec688390690a3cba2b85fe49b615b",
        block_height: 77,
        operate_info: "更新模板",
        operate_time: "2020/8/4",
        operater: "向超",
        certificate_url: "cerdentials/85ad5037-5/5568940ad22-6/1154-2",
        time: "2020-08-03",
        starting_point: "西安",
        certificate_name: "西咸高速",
        ending_point: "咸阳",
      },
      {
        name: "项目要求下发",
        certificate_hash: "8xc95c688390690a3cba2b85fe49b615b",
        block_height: 98,
        operate_info: "更新模板",
        operate_time: "2020/8/5",
        operater: "向超",
        certificate_url: "cerdentials/85ad5037-6",
        time: "2020-08-05",
        starting_point: "西安",
        certificate_name: "西咸高速",
        ending_point: "咸阳",
      },
      {
        name: "项目要求下发",
        certificate_hash: "8xc95c688390690a3cba2b85fe49b615b",
        block_height: 98,
        operate_info: "更新模板",
        operate_time: "2020/8/5",
        operater: "向超",
        certificate_url: "cerdentials/85ad5037-6",
        time: "2020-08-05",
        starting_point: "西安",
        certificate_name: "西咸高速",
        ending_point: "咸阳",
      },
    ],
    currentPage: 1,
    totalPage: 1,
    detailInfo: {},
    detailInfoShow: false,
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
  created() {
    // this.totalPage = Math.ceil(this.tableData.length / 2);
  },
  mounted() {},
  methods: {
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
