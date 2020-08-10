new Vue({
  delimiters: ["${", "}"],
  data: {
    projectName: "",
    tableData: [
      {
        collaborative_unit: "陕西省西安市交通厅",
        collaborative_type: "主管",
      },
      {
        collaborative_unit: "陕西省西安市交通厅",
        collaborative_type: "主管",
      },
      {
        collaborative_unit: "陕西省西安市交通厅",
        collaborative_type: "主管",
      },
      {
        collaborative_unit: "陕西省西安市交通厅",
        collaborative_type: "主管",
      },
      {
        collaborative_unit: "陕西省西安市交通厅",
        collaborative_type: "主管",
      },
      {
        collaborative_unit: "陕西省西安市交通厅",
        collaborative_type: "主管",
      },
      {
        collaborative_unit: "陕西省西安市交通厅",
        collaborative_type: "主管",
      },
      {
        collaborative_unit: "陕西省西安市交通厅",
        collaborative_type: "主管",
      },
    ],
    currentPage: 1,
    totalPage: 1,
  },
  computed: {
    sliceTableData() {
      return this.tableData.slice(
        (this.currentPage - 1) * 6,
        this.currentPage * 6
      );
    },
  },
  created() {
    this.totalPage = Math.ceil(this.tableData.length / 6);
  },
  mounted() {},
  methods: {
    prevBtn() {
      if (this.currentPage > 1) {
        this.currentPage--;
      } else {
        return;
      }
    },
    nextBtn() {
      if (this.currentPage < this.totalPage) {
        this.currentPage++;
      } else {
        return;
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      }
    },
    errorHandler() {
      return true;
    },
  },
}).$mount("#designManagementApp");
