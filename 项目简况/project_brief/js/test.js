new Vue({
  delimiters: ["${", "}"],
  data: {
    tableData: [
      {
        project_phase: "陕西省交建云数据科技有限公司",
        highway_type: "国道",
        highway_grade: "一级公路",
        mileage_scale: "100km",
        OD_points: "墨脱",
        planning_version: "十三五",
      },
      {
        project_phase: "陕西省交建云数据科技有限公司",
        highway_type: "国道",
        highway_grade: "一级公路",
        mileage_scale: "100km",
        OD_points: "墨脱",
        planning_version: "十三五",
      },
      {
        project_phase: "陕西省交建云数据科技有限公司",
        highway_type: "国道",
        highway_grade: "一级公路",
        mileage_scale: "100km",
        OD_points: "墨脱",
        planning_version: "十三五",
      },
      {
        project_phase: "陕西省交建云数据科技有限公司",
        highway_type: "国道",
        highway_grade: "一级公路",
        mileage_scale: "100km",
        OD_points: "墨脱",
        planning_version: "十三五",
      },
      {
        project_phase: "陕西省交建云数据科技有限公司",
        highway_type: "国道",
        highway_grade: "一级公路",
        mileage_scale: "100km",
        OD_points: "墨脱",
        planning_version: "十三五",
      },
      {
        project_phase: "陕西省交建云交建云交建云数据科技有限公司",
        highway_type: "国道",
        highway_grade: "一级公路",
        mileage_scale: "100km",
        OD_points: "墨脱墨脱墨脱",
        planning_version: "十三五",
      },
      {
        project_phase: "陕西省交建云数据科技有限公司",
        highway_type: "国道",
        highway_grade: "一级公路",
        mileage_scale: "100km",
        OD_points: "墨脱",
        planning_version: "十三五",
      },
      {
        project_phase: "陕西省交建云数据科技有限公司",
        highway_type: "国道",
        highway_grade: "一级公路",
        mileage_scale: "100km",
        OD_points: "墨脱",
        planning_version: "十三五",
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
      }
    },
    nextBtn() {
      if (this.currentPage < this.totalPage) {
        this.currentPage++;
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "warning-row";
      }
    },
  },
}).$mount("#projectBriefApp");
