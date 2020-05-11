new Vue({
  delimiters: ["${", "}"],
  data: {
    activeName: "first",
    searchText: "",
    data: [
      {
        id: 1,
        label: "功能权限",
        children: [
          {
            id: 2,
            label: "员工服务云",
            children: [
              {
                id: 21,
                label: "费用查询",
              },
              {
                id: 22,
                label: "人人差旅",
              },
            ],
          },
          {
            id: 3,
            label: "财务云",
            children: [
              {
                id: 31,
                label: "应付",
              },
              {
                id: 32,
                label: "应收",
              },
            ],
          },
          {
            id: 4,
            label: "系统云",
            children: [
              {
                id: 41,
                label: "企业管理",
              },
              {
                id: 42,
                label: "基础资料",
              },
            ],
          },
          {
            id: 5,
            label: "公司管理",
            children: [
              {
                id: 51,
                label: "经营管理（建筑业）",
              },
              {
                id: 52,
                label: "人力管理",
              },
              {
                id: 53,
                label: "采购管理",
              },
              {
                id: 54,
                label: "库存管理",
              },
            ],
          },
          {
            id: 6,
            label: "公路云",
            children: [
              {
                id: 61,
                label: "公路云（建筑业）",
                children: [
                  {
                    id: 611,
                    label: "手机注册",
                  },
                ],
              },
            ],
          },
          {
            id: 7,
            label: "项目管理",
            children: [
              {
                id: 71,
                label: "项目基础设置",
              },
              {
                id: 72,
                label: "计划编制",
              },
              {
                id: 73,
                label: "合同计划",
              },
              {
                id: 74,
                label: "执行管理",
                children: [
                  {
                    id: 741,
                    label: "进度管理（自定义）",
                  },
                  {
                    id: 742,
                    label: "质量管理（自定义）",
                  },
                  {
                    id: 743,
                    label: "成本管理（自定义）",
                    children: [
                      {
                        id: 7431,
                        label: "成本分析与控制",
                        children: [
                          {
                            id: 74311,
                            label: "成本对比分析表",
                            children: [
                              {
                                id: 743111,
                                label: "首页（自定义）",
                              },
                              {
                                id: 743112,
                                label: "当前任务成本管控（自定义）",
                              },
                              {
                                id: 743113,
                                label: "紧前任务成本管控（自定义）",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        id: 7432,
                        label: "成本总览（自定义）",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    defaultProps: {
      children: "children",
      label: "label",
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleClick(val) {
      console.log(val);
    },
  },
}).$mount("#ccPermissionManagementApp");
