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
        certificate_url: "cerdentials/85ad5037-5",
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
    ],
    currentPage: 1,
    totalPage: 1,
  },
  computed: {
    // sliceTableData() {
    //   return this.tableData.slice(
    //     (this.currentPage - 1) * 2,
    //     this.currentPage * 2
    //   );
    // },
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
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      }
    },
  },
}).$mount("#bcCertificateApp");
