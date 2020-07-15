new Vue({
  delimiters: ["${", "}"],
  data: {
    activeName: "first",
    addNewTaskSelectionOptions: [
      {
        value: "1",
        label: "新增工作包",
      },
      {
        value: "2",
        label: "新增摘要任务",
      },
      {
        value: "3",
        label: "新增专业审核",
      },
    ],
    addNewTaskValue: "", //新增下拉框所选值
    tableData: [],
    scheduleData: [], //进度表格数据
    contractData: [], //委外合同表格数据
    qualityData: [], //质量表格数据
    costData: [], //成本表格数据
    datumFileData: [], // 提资表格数据
    multipleSelection: [],
    allChecked: false,
    allItems: null,
    isIndeterminate: false,
    tableHeight: 800,
  },
  created() {
    var tData = [
      {
        id: "1", // 任务id
        wbs_code: "1",
        text: "测试任务", // 任务名称
        parent: "0", // 父任务id
        duration: 10, // 工期
        task_type: "", // 任务类型2  一般任务  复核任务  专业审核等
        type: "project", // 任务类型1  摘要任务  子任务  里程碑
        describe: "任务说明1", // 任务说明
        open: true, // 是否展开
        isMilestone: false, // 是否是里程碑
        start_date: "2020-02-03 00:00:00",
        effect: "", //功效
        duration_plan: "", //工程量
        major: {
          text: "专业1", //专业名称
          id: "", //专业id
        },
        my_unit: {
          //工程量单位和功效单位 目前为同一个
          text: "km", // 单位名称
          id: "", //单位id
        },
        task_before: [], //紧前任务
        first_duration: "", //首次复核持续时间
        modify_duration: "", //修改持续时间
        mod_con_duration: "", //确认修改持续时间
        confirm_duration: "", //复核确认持续时间
        owner_role: "", //承担人角色
        owner_roleid: "", //承担人角色id
        audit_task_id: "2,5", //审核的任务id
        delegate: "0", //是否委外
        contract_thing: "合同测试", //合同事项
        delegate_reason: "测试委派", //委外原因
        delegate_role_id: 757802139937423360,
        delegate_role_name: "专业组长", //委外负责人角色
        delegate_person_id: 754911742466739200, //委外负责人id
        delegate_person_name: "田重辉", //委外负责人名称
        assn_pro_num: "300", //工程量/单位
        assn_pro_unit: "m³", //单位
        assn_merits_price: 50, //绩效奖金(元/单位工程量)
        assn_merits_total: 15000, //绩效奖金小计
        fmachine_name: ["挖掘机"], //机械名称
        fmachine_type: ["WJ-50"], //型号
        machine_id: [""], //机械id
        fmachine_used: ["4"], //机械耗用量
        fmachine_price: ["200"], //机械单价
        fmachine_unit: ["台"], //机械单位
        fmachine_subtotal: ["800"], //机械小计
        fmachine_all: "800", //机械合计
        fmaterial_name: ["", "材料", "", "材料"], //材料名称
        material_id: ["", "2", "", "2"], //材料id
        fmaterial_used: ["", "2", "", "2"], //材料耗用量
        fmaterial_price: ["", "2", "", "2"], //材料单价
        fmaterial_unit: ["", "2", "", "2"], //材料单位
        fmaterial_subtotal: ["1", "2", "1", "2"], //材料小计
        fmaterial_all: "2", //材料合计
        fmanual_name: ["人工", "人工1"], //人工名称
        person_id: ["12", "11"], //人工id
        fmanual_workload: ["1", "2"], //人工负载
        fmanual_price: ["1", "2"], //人工单价
        fmanual_unit: ["1", "2"], //人工单位
        fmanual_subtotal: ["1", "2"], //人工小计
        fmanual_all: "2", //人工合计
        ffee_subtotal: "2",
        ffee_all: "1",
      },
      {
        id: "2", // 任务id
        wbs_code: "1.1",
        text: "测试任务2", // 任务名称
        parent: "0", // 父任务id
        duration: 3, // 工期
        task_type: "3", // 任务类型2  一般任务  复核任务  专业审核等
        type: "milestone", // 任务类型1  摘要任务  子任务  里程碑
        describe: "任务说明2", // 任务说明
        open: true, // 是否展开
        isMilestone: false, // 是否是里程碑
        start_date: "2020-02-03 00:00:00",
        effect: "", //功效
        duration_plan: "", //工程量
        major: {
          text: "专业2", //专业名称
          id: "", //专业id
        },
        my_unit: {
          //工程量单位和功效单位 目前为同一个
          text: "km", // 单位名称
          id: "", //单位id
        },
        task_before: [], //紧前任务
        first_duration: "", //首次复核持续时间
        modify_duration: "", //修改持续时间
        mod_con_duration: "", //确认修改持续时间
        confirm_duration: "", //复核确认持续时间
        owner_role: "", //承担人角色
        owner_roleid: "", //承担人角色id
        audit_task_id: "2,5", //审核的任务id
        delegate: "0", //是否委外
        contract_thing: "合同测试", //合同事项
        delegate_reason: "测试委派", //委外原因
        delegate_role_id: 757802139937423360,
        delegate_role_name: "专业组长", //委外负责人角色
        delegate_person_id: 754911742466739200, //委外负责人id
        delegate_person_name: "田重辉", //委外负责人名称
        assn_pro_num: "", //工程量/单位
        assn_merits_price: 0, //绩效奖金(元/单位工程量)
        assn_merits_total: 0, //绩效奖金小计
        fmachine_name: [""], //机械名称
        machine_id: [""], //机械id
        fmachine_used: [""], //机械耗用量
        fmachine_price: [""], //机械单价
        fmachine_unit: [""], //机械单位
        fmachine_subtotal: [""], //机械小计
        fmachine_all: "1.2", //机械合计
        fmaterial_name: ["", "材料", "", "材料"], //材料名称
        material_id: ["", "2", "", "2"], //材料id
        fmaterial_used: ["", "2", "", "2"], //材料耗用量
        fmaterial_price: ["", "2", "", "2"], //材料单价
        fmaterial_unit: ["", "2", "", "2"], //材料单位
        fmaterial_subtotal: ["1", "2", "1", "2"], //材料小计
        fmaterial_all: "2", //材料合计
        fmanual_name: ["人工", "人工1"], //人工名称
        person_id: ["12", "11"], //人工id
        fmanual_workload: ["1", "2"], //人工负载
        fmanual_price: ["1", "2"], //人工单价
        fmanual_unit: ["1", "2"], //人工单位
        fmanual_subtotal: ["1", "2"], //人工小计
        fmanual_all: "2", //人工合计
        ffee_subtotal: "2",
        ffee_all: "1",
      },
    ];
    // 假数据模拟
    this.tableData = tData;
    var apiData = {
      qualityData: [
        {
          task_name: "demo",
          owner: "",
          parent: "",
          confirm_duration: "",
          owner_id: "",
          task_assign_id: "",
          first_duration: "",
          wbs: "0",
          qualityplan_version: "",
          task_id: "23738b34-7b9c-4fa4-a59c-3369de670022",
          type: "project",
          owner_roleid: "",
          audit_task_id: "",
          duration: "11",
          plan_starttime: "2019-10-03 00:00:00",
          plan_endtime: "2019-10-17 18:30:02",
          owner_role: "",
          modify_duration: "",
          position: "1",
          mod_con_duration: "",
          task_type: "",
          skill: "",
          skill_id: "",
        },
        {
          task_name: "设置围堰",
          owner: "",
          parent: "23738b34-7b9c-4fa4-a59c-3369de670022",
          confirm_duration: "",
          owner_id: "",
          task_assign_id: "",
          first_duration: "",
          wbs: "1",
          qualityplan_version: "",
          task_id: "23738b34-7b9c-4fa4-a59c-3369de670021",
          type: "project",
          owner_roleid: "",
          audit_task_id: "",
          duration: "11",
          plan_starttime: "2019-10-03 00:00:00",
          plan_endtime: "2019-10-17 18:30:02",
          owner_role: "",
          modify_duration: "",
          position: "2",
          mod_con_duration: "",
          task_type: "2",
          skill: "测试",
          skill_id: "",
        },
        {
          task_name: "P4挖土",
          owner: "",
          parent: "23738b34-7b9c-4fa4-a59c-3369de670021",
          confirm_duration: "",
          owner_id: "",
          task_assign_id: "",
          first_duration: "4",
          wbs: "1.1",
          qualityplan_version: "",
          task_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c",
          type: "task",
          owner_roleid: "",
          audit_task_id: "",
          duration: "5",
          plan_starttime: "2019-10-03 00:00:00",
          plan_endtime: "2019-10-10 00:00:00",
          owner_role: "",
          modify_duration: "",
          position: "3",
          mod_con_duration: "",
          task_type: "4",
          skill: "挖土",
          skill_id: "",
        },
        {
          task_name: "P4挖土设计",
          owner: "YAN001",
          parent: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c",
          confirm_duration: "",
          owner_id: "001",
          task_assign_id: "",
          first_duration: "",
          wbs: "1.1.1",
          qualityplan_version: "",
          task_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c1",
          type: "task",
          owner_roleid: "001",
          audit_task_id: "",
          duration: "5",
          plan_starttime: "2019-10-03 00:00:00",
          plan_endtime: "2019-10-10 00:00:00",
          owner_role: "角色001",
          modify_duration: "",
          position: "4",
          mod_con_duration: "",
          task_type: "1",
          skill: "挖土设计",
          skill_id: "",
        },
        {
          task_name: "P4挖土复核",
          owner: "YAN002",
          parent: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c",
          confirm_duration: "",
          owner_id: "002",
          task_assign_id: "",
          first_duration: "",
          wbs: "1.1.2",
          qualityplan_version: "",
          task_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c2",
          type: "task",
          owner_roleid: "002",
          audit_task_id: "",
          duration: "5",
          plan_starttime: "2019-10-03 00:00:00",
          plan_endtime: "2019-10-10 00:00:00",
          owner_role: "角色002",
          modify_duration: "",
          position: "5",
          mod_con_duration: "",
          task_type: "3",
          skill: "挖土复核",
          skill_id: "",
        },
      ],
      scheduleData: [
        {
          task_name: "demo",
          end_date: "2019-10-17 18:30:02",
          parent: "",
          task_before: "",
          my_unit: {
            text: "",
            id: "",
          },
          isMilestone: "",
          wbs: "0",
          task_id: "23738b34-7b9c-4fa4-a59c-3369de670022",
          type: "project",
          duration: "11",
          duration_plan: "11",
          major: {
            text: "",
            id: "",
          },
          effect: "0.73",
          position: "1",
          describe: [],
          task_type: "",
          open: "true",
          start_date: "2019-10-03 00:00:00",
        },
        {
          task_name: "设置围堰",
          end_date: "2019-10-17 18:30:02",
          parent: "23738b34-7b9c-4fa4-a59c-3369de670022",
          task_before: "1",
          my_unit: {
            text: "",
            id: "",
          },
          isMilestone: "",
          wbs: "1",
          task_id: "23738b34-7b9c-4fa4-a59c-3369de670021",
          type: "project",
          duration: "11",
          duration_plan: "11",
          major: {
            text: "",
            id: "",
          },
          effect: "0.73",
          position: "2",
          describe: [],
          task_type: "",
          open: "true",
          start_date: "2019-10-03 00:00:00",
        },
        {
          task_name: "P4挖土",
          end_date: "2019-10-10 00:00:00",
          parent: "23738b34-7b9c-4fa4-a59c-3369de670021",
          task_before: "",
          my_unit: {
            text: "米",
            id: 1,
          },
          isMilestone: "",
          wbs: "1.1",
          task_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c",
          type: "task",
          duration: "5",
          duration_plan: "5",
          major: {
            text: "",
            id: "",
          },
          effect: "2.00",
          position: "3",
          describe: [],
          task_type: "4",
          open: "true",
          start_date: "2019-10-03 00:00:00",
        },
        {
          task_name: "P4挖土设计",
          end_date: "2019-10-10 00:00:00",
          parent: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c",
          task_before: "",
          my_unit: {
            text: "米",
            id: 1,
          },
          isMilestone: "",
          wbs: "1.1.1",
          task_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c1",
          type: "task",
          duration: "5",
          duration_plan: "5",
          major: {
            text: "",
            id: "",
          },
          effect: "2.00",
          position: "4",
          describe: [],
          task_type: "1",
          open: "true",
          start_date: "2019-10-03 00:00:00",
        },
        {
          task_name: "P4挖土复核",
          end_date: "2019-10-10 00:00:00",
          parent: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c",
          task_before: "",
          my_unit: {
            text: "米",
            id: 1,
          },
          isMilestone: "",
          wbs: "1.1.2",
          task_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c2",
          type: "task",
          duration: "5",
          duration_plan: "5",
          major: {
            text: "",
            id: "",
          },
          effect: "2.00",
          position: "5",
          describe: [],
          task_type: "3",
          open: "true",
          start_date: "2019-10-03 00:00:00",
        },
      ],
      contractData: [
        {
          task_name: "demo",
          parent: "",
          contract_thing: "",
          delegate_role_name: "",
          delegate_reason: "",
          wbs: "0",
          task_id: "23738b34-7b9c-4fa4-a59c-3369de670022",
          delegate_person_name: "",
          duration: "11",
          delegate: "",
          delegate_person_id: "",
          position: "1",
          end_date: "2019-10-17 18:30:02",
          delegate_role_id: "",
          start_date: "2019-10-03 00:00:00",
        },
        {
          task_name: "设置围堰",
          parent: "23738b34-7b9c-4fa4-a59c-3369de670022",
          contract_thing: "",
          delegate_role_name: "",
          delegate_reason: "",
          wbs: "1",
          task_id: "23738b34-7b9c-4fa4-a59c-3369de670021",
          delegate_person_name: "",
          duration: "11",
          delegate: "",
          delegate_person_id: "",
          position: "2",
          end_date: "2019-10-17 18:30:02",
          delegate_role_id: "",
          start_date: "2019-10-03 00:00:00",
        },
        {
          task_name: "P4挖土",
          parent: "23738b34-7b9c-4fa4-a59c-3369de670021",
          contract_thing: "",
          delegate_role_name: "项目经理",
          delegate_reason: "",
          wbs: "1.1",
          task_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c",
          delegate_person_name: "tom",
          duration: "5",
          delegate: "1",
          delegate_person_id: "",
          position: "3",
          end_date: "2019-10-10 00:00:00",
          delegate_role_id: "",
          start_date: "2019-10-03 00:00:00",
        },
        {
          task_name: "P4挖土设计",
          parent: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c",
          contract_thing: "委外设计1",
          delegate_role_name: "",
          delegate_reason: "",
          wbs: "1.1.1",
          task_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c1",
          delegate_person_name: "",
          duration: "5",
          delegate: false,
          delegate_person_id: "",
          position: "4",
          end_date: "2019-10-10 00:00:00",
          delegate_role_id: "",
          start_date: "2019-10-03 00:00:00",
        },
        {
          task_name: "P4挖土复核",
          parent: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c",
          contract_thing: "委外复核1",
          delegate_role_name: "",
          delegate_reason: "",
          wbs: "1.1.2",
          task_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c2",
          delegate_person_name: "",
          duration: "5",
          delegate: false,
          delegate_person_id: "",
          position: "5",
          end_date: "2019-10-10 00:00:00",
          delegate_role_id: "",
          start_date: "2019-10-03 00:00:00",
        },
      ],
      costData: [
        {
          task_name: "demo",
          end_date: "2019-10-17 18:30:02",
          ffee_subtotal: "",
          fmachine_price: [],
          wbs: "0",
          task_id: "23738b34-7b9c-4fa4-a59c-3369de670022",
          ffee_all: "",
          work_amount_unit: "Km",
          performance_bonus: "1.2",
          performance_bonus_subtotal: "200",
          fmaterial_number: [],
          fmachine_all: "",
          fmaterial_used: [],
          duration: "11",
          fmanual_workload: [],
          project_id: "999999",
          fmaterial_unit: [],
          id: "23738b34-7b9c-4fa4-a59c-3369de670022",
          fmachine_used: [],
          person_id: [],
          start_date: "2019-10-03 00:00:00",
          fmaterial_name: [],
          fmaterial_subtotal: [],
          fmachine_number: [],
          fmachine_unit: [],
          task_merits_price: "1",
          task_merits_used: "8",
          machine_id: [],
          fmanual_role: [],
          fmachine_name: [],
          fmaterial_all: "",
          fmanual_unit: [],
          plan_time: "",
          fmanual_price: [],
          parent_id: "0",
          fmaterial_price: [],
          material_id: [],
          position: "1",
          fmanual_subtotal: [],
          task_type: "",
          fmachine_subtotal: [],
          fmanual_name: [],
          task_merits_id: "1",
          task_merits_subtotal: 8.0,
          fmanual_all: "",
          check_time: "",
        },
        {
          task_name: "设置围堰",
          end_date: "2019-10-17 18:30:02",
          fmachine_price: [],
          wbs: "1",
          task_id: "23738b34-7b9c-4fa4-a59c-3369de670021",
          ffee_all: "",
          work_amount_unit: "Km",
          performance_bonus: "1.2",
          performance_bonus_subtotal: "200",
          fmaterial_number: [],
          fmachine_all: "",
          fmaterial_used: [],
          duration: "11",
          fmanual_workload: [],
          project_id: "999999",
          fmaterial_unit: [],
          id: "23738b34-7b9c-4fa4-a59c-3369de670021",
          fmachine_used: [],
          person_id: [],
          start_date: "2019-10-03 00:00:00",
          fmaterial_name: [],
          fmaterial_subtotal: [],
          fmachine_number: [],
          fmachine_unit: [],
          task_merits_price: "1",
          task_merits_used: "8",
          machine_id: [],
          fmanual_role: [],
          fmachine_name: [],
          fmaterial_all: "",
          fmanual_unit: [],
          plan_time: "",
          fmanual_price: [],
          parent_id: "23738b34-7b9c-4fa4-a59c-3369de670022",
          fmaterial_price: [],
          material_id: [],
          position: "2",
          fmanual_subtotal: [],
          task_type: "",
          fmachine_subtotal: [],
          fmanual_name: [],
          task_merits_id: "1",
          task_merits_subtotal: 8.0,
          fmanual_all: "",
          check_time: "",
        },
        {
          task_name: "P4挖土",
          end_date: "2019-10-10 00:00:00",
          fmachine_price: ["100", "200", "300"],
          wbs: "1.1",
          task_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c",
          ffee_all: "",
          work_amount_unit: "Km",
          performance_bonus: "1.2",
          performance_bonus_subtotal: "200",
          fmaterial_number: ["型号1", "型号2", "型号3", "型号4"],
          fmachine_all: "",
          fmaterial_used: ["20", "10", "5", "30"],
          duration: "5",
          fmanual_workload: ["10", "20"],
          project_id: "999999",
          fmaterial_unit: ["米", "吨", "方", "个"],
          id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c",
          fmachine_used: ["10", "12", "20"],
          person_id: [],
          start_date: "2019-10-03 00:00:00",
          fmaterial_name: ["钢筋", "水泥", "混凝土", "柱子"],
          fmaterial_subtotal: ["1000", "2000", "2500", "3000"],
          fmachine_number: ["WJ-001", "WJ-002", "WJ-003"],
          fmachine_unit: ["台", "台", "台"],
          task_merits_price: "1",
          task_merits_used: "10",
          machine_id: [],
          fmanual_role: ["挖土员", "挖土员"],
          fmachine_name: ["挖掘机1", "挖掘机2", "挖掘机3"],
          fmaterial_all: "",
          fmanual_unit: ["人", "人"],
          plan_time: "",
          fmanual_price: ["100", "200"],
          parent_id: "23738b34-7b9c-4fa4-a59c-3369de670021",
          fmaterial_price: ["100", "200", "300", "400"],
          material_id: [],
          position: "3",
          fmanual_subtotal: ["1000", "2000"],
          task_type: "4",
          fmachine_subtotal: ["1000", "2000", "3000"],
          fmanual_name: ["张三", "李四"],
          task_merits_id: "1",
          task_merits_subtotal: 10.0,
          fmanual_all: "",
          check_time: "",
        },
        {
          task_name: "P4挖土设计",
          end_date: "2019-10-10 00:00:00",
          fmachine_price: ["200", "200", "200"],
          wbs: "1.1.1",
          task_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c1",
          ffee_all: "",
          work_amount_unit: "Km",
          performance_bonus: "1.2",
          performance_bonus_subtotal: "200",
          fmaterial_number: [],
          fmachine_all: "",
          fmaterial_used: [],
          duration: "5",
          fmanual_workload: [],
          project_id: "999999",
          fmaterial_unit: [],
          id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c1",
          fmachine_used: ["5", "10", "15"],
          person_id: [],
          start_date: "2019-10-03 00:00:00",
          fmaterial_name: [],
          fmaterial_subtotal: [],
          fmachine_number: [],
          fmachine_unit: [],
          task_merits_price: "1",
          task_merits_used: "10",
          machine_id: [],
          fmanual_role: [],
          fmachine_name: [],
          fmaterial_all: "",
          fmanual_unit: [],
          plan_time: "",
          fmanual_price: [],
          parent_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c",
          fmaterial_price: [],
          material_id: [],
          position: "4",
          fmanual_subtotal: [],
          task_type: "1",
          fmachine_subtotal: ["1000", "2000", "3000"],
          fmanual_name: [],
          task_merits_id: "1",
          task_merits_subtotal: 10.0,
          fmanual_all: "",
          check_time: "",
        },
        {
          task_name: "P4挖土复核",
          end_date: "2019-10-10 00:00:00",
          fmachine_price: [],
          wbs: "1.1.2",
          task_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c2",
          ffee_all: "",
          work_amount_unit: "Km",
          performance_bonus: "1.2",
          performance_bonus_subtotal: "200",
          fmaterial_number: [],
          fmachine_all: "",
          fmaterial_used: [],
          duration: "5",
          fmanual_workload: [],
          project_id: "999999",
          fmaterial_unit: [],
          id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c2",
          fmachine_used: [],
          person_id: [],
          start_date: "2019-10-03 00:00:00",
          fmaterial_name: [],
          fmaterial_subtotal: [],
          fmachine_number: [],
          fmachine_unit: [],
          task_merits_price: "1",
          task_merits_used: "10",
          machine_id: [],
          fmanual_role: [],
          fmachine_name: [],
          fmaterial_all: "",
          fmanual_unit: [],
          plan_time: "",
          fmanual_price: [],
          parent_id: "239 924b8fe9-f24e-4919-a65c-af9c9f38f49c",
          fmaterial_price: [],
          material_id: [],
          position: "5",
          fmanual_subtotal: [],
          task_type: "3",
          fmachine_subtotal: [],
          fmanual_name: [],
          task_merits_id: "1",
          task_merits_subtotal: 10.0,
          fmanual_all: "",
          check_time: "",
        },
      ],
      datumFileData: [
        {
          task_name: "demo",
          parent: "",
          wbs: "0",
          qualityplan_version: "",
          task_id: "23738b34-7b9c-4fa4-a59c-3369de670022",
          start_date: "2019-10-03 00:00:00",
          end_date: "2019-10-03 00:00:00",
          type: "project",
          duration: "11",
          position: "1",
          raiseArray: [
            {
              receivewbs: "1", //接收任务代码 array
              receivename: "设计", //接收任务名称 array
              receivedata: "123",
            },
            {
              receivewbs: "1.1", //接收任务代码 array
              receivename: "设计2", //接收任务名称 array
              receivedata: "345",
            },
          ],
          task_type: "",
        },
        {
          task_name: "设置围堰",
          parent: "23738b34-7b9c-4fa4-a59c-3369de670022",
          confirm_duration: "",
          wbs: "1",
          qualityplan_version: "",
          start_date: "2019-10-03 00:00:00",
          end_date: "2019-10-03 00:00:00",
          task_id: "23738b34-7b9c-4fa4-a59c-3369de670021",
          type: "project",
          duration: "11",
          position: "2",
          raiseArray: [
            {
              receivewbs: "1", //接收任务代码 array
              receivename: "设计", //接收任务名称 array
              receivedata: "123",
            },
            {
              receivewbs: "1.1", //接收任务代码 array
              receivename: "设计2", //接收任务名称 array
              receivedata: "345",
            },
          ],
          task_type: "2",
        },
        {
          task_name: "P4挖土",
          parent: "23738b34-7b9c-4fa4-a59c-3369de670022",
          confirm_duration: "",
          wbs: "1.1",
          qualityplan_version: "",
          start_date: "2019-10-03 00:00:00",
          end_date: "2019-10-03 00:00:00",
          task_id: "23738b34-7b9c-4fa4-a59c-3369de670021",
          type: "project",
          duration: "11",
          position: "2",
          raiseArray: [
            {
              receivewbs: "1", //接收任务代码 array
              receivename: "设计", //接收任务名称 array
              receivedata: "123",
            },
            {
              receivewbs: "1.1", //接收任务代码 array
              receivename: "设计2", //接收任务名称 array
              receivedata: "345",
            },
            {
              receivewbs: "1.1.1", //接收任务代码 array
              receivename: "设计3", //接收任务名称 array
              receivedata: "678",
            },
            // {
            //   receivewbs: "1.1.1", //接收任务代码 array
            //   receivename: "设计3", //接收任务名称 array
            //   receivedata: "678",
            // },
          ],
          task_type: "2",
        },
        {
          task_name: "P4挖土设计",
          parent: "23738b34-7b9c-4fa4-a59c-3369de670022",
          confirm_duration: "",
          wbs: "1.1.1",
          qualityplan_version: "",
          start_date: "2019-10-03 00:00:00",
          end_date: "2019-10-03 00:00:00",
          task_id: "23738b34-7b9c-4fa4-a59c-3369de670021",
          type: "project",
          duration: "11",
          position: "2",
          raiseArray: [
            {
              receivewbs: "1", //接收任务代码 array
              receivename: "设计", //接收任务名称 array
              receivedata: "123",
            },
            {
              receivewbs: "1.1", //接收任务代码 array
              receivename: "设计2", //接收任务名称 array
              receivedata: "345",
            },
          ],
          //接收资料 array
          task_type: "2",
        },
        {
          task_name: "P4挖土复核",
          parent: "23738b34-7b9c-4fa4-a59c-3369de670022",
          confirm_duration: "",
          wbs: "1.1.2",
          qualityplan_version: "",
          start_date: "2019-10-03 00:00:00",
          end_date: "2019-10-03 00:00:00",
          task_id: "23738b34-7b9c-4fa4-a59c-3369de670021",
          type: "project",
          duration: "11",
          position: "2",
          raiseArray: [
            {
              receivewbs: "1", //接收任务代码 array
              receivename: "设计", //接收任务名称 array
              receivedata: "123",
            },
            {
              receivewbs: "1.1", //接收任务代码 array
              receivename: "设计2", //接收任务名称 array
              receivedata: "345",
            },
          ],
          task_type: "2",
        },
      ],
    };
    if (apiData.qualityData && apiData.qualityData.length > 0) {
      apiData.qualityData.forEach(function (fuck) {
        if (fuck.task_type === "3") {
          apiData.qualityData.forEach(function (shit) {
            if (fuck.parent === shit.parent && shit.task_type !== "3") {
              fuck.the_owner_role = shit.owner_role;
              fuck.the_skill = shit.skill;
            }
          });
        }
      });
    }
    this.scheduleData = apiData.scheduleData;
    this.qualityData = apiData.qualityData;
    this.contractData = apiData.contractData;
    this.costData = apiData.costData;
    this.datumFileData = apiData.datumFileData;
  },
  mounted() {
    this.$nextTick(function () {
      // this.tableHeight = window.innerHeight - this.$refs.wbsPlanningApp.$el.offsetTop - 10
      this.tableHeight = window.innerHeight - this.$el.offsetTop - 75;

      // 监听窗口大小变化
      let self = this;
      window.onresize = function () {
        // self.tableHeight = window.innerHeight - self.$refs.wbsPlanningApp.$el.offsetTop - 10
        self.tableHeight = window.innerHeight - self.$el.offsetTop - 75;
      };
    });
  },
  methods: {
    handleTabClick(tab, event) {
      console.log(tab, event);
    },
    // 处理复核任务 整改-修改 承担人和承担人名称
    // setAuditTaskUndertaker(originData) {
    //   if (originData.length === 0) return
    //   originData.forEach(function(fuck) {
    //     if (fuck.task_type === "3") {
    //       originData.forEach(function(shit) {
    //         if (fuck.parent === shit.parent && shit.task_type !== "3") {
    //           fuck.the_owner = shit.owner
    //           fuck.the_owner_role = shit.owner_role
    //         }
    //       })
    //     }
    //   })
    //   return originData
    // },
    // addSortNum(data) {
    //   if (data.length <= 1) {
    //     return data
    //   } else {
    //     // data.forEach(function(fuck) {
    //     //   fuck.sortNum = fuck.wbs.split(".").join("")
    //     //   for (let i = fuck.sortNum.length; i < 4; i++) {
    //     //     fuck.sortNum += "0"
    //     //   }
    //     // })
    //     data.sort(this.compare('position'))
    //     return data
    //   }
    // },
    // compare(prop) {
    //   return function(obj1, obj2) {
    //     var val1 = obj1[prop];
    //     var val2 = obj2[prop];
    //     if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
    //       val1 = Number(val1);
    //       val2 = Number(val2);
    //     }
    //     if (val1 < val2) {
    //       return -1;
    //     } else if (val1 > val2) {
    //       return 1;
    //     } else {
    //       return 0;
    //     }
    //   }
    // },
    // SetRole() {
    //   let ids = this.getSelectedId()
    //   console.log(
    //     "SetRole>>>",
    //     ids
    //   )
    //   let sendData = {
    //     data: ids
    //   }
    //   if (ids.length > 0) {} else {
    //     alert("未勾选任务")
    //   }
    // },
    // SetStaff() {},
    handleCheckAllChange(val) {
      this.traversalNode(this.tableData[0], this.allChecked);
    },
    // itemChange(row) {
    //   let check = row.checked
    //   let temp = this.traversalNode(row, check)
    //   let tempTableData = _.cloneDeep(this.tableData[0])
    //   let flatData = this.traversalNode(tempTableData)
    //     // 获取该节点所在所有父节点
    //   let parentIds = this.findParentIds(flatData, row.parent)
    //   console.log("temp>>>", temp)
    //   if (check) {
    //     // 如果点击是置true 递归查找所有父节点下的子节点
    //     // 如果子节点都为true 置该父节点为ture
    //     // 如果子节点有一个为false  置该父节点以及该父节点的所有父节点为false
    //     let res = this.helloKids(flatData, parentIds)[0]
    //     this.tableData = [res]
    //   } else {
    //     // 如果点击是置false 直接将该节点的所有父节点置为false
    //     this.findYouAndSetFalse(this.tableData[0], parentIds)
    //     this.allChecked = false
    //   }
    // },
    // saveData() {
    //   console.log("saveData>>>")
    // },
    // setDesignOwner() {
    //   let ids = this.getSelectedId()
    //   console.log(
    //     "setDesignOwner>>>",
    //     ids
    //   )
    //   let sendData = {
    //     data: ids
    //   }
    //   if (ids.length > 0) {} else {
    //     alert("未勾选任务")
    //   }
    // },

    // setReviewOwner() {
    //   let ids = this.getSelectedId()
    //   console.log(
    //     "setReviewOwner>>>",
    //     ids
    //   )
    //   let sendData = {
    //     data: ids
    //   }
    //   if (ids.length > 0) {} else {
    //     alert("未勾选任务")
    //   }
    // },
    // setAuditOwner() {
    //   let ids = this.getSelectedId()
    //   console.log(
    //     "setAuditOwner>>>",
    //     ids
    //   )
    //   let sendData = {
    //     data: ids
    //   }
    //   if (ids.length > 0) {} else {
    //     alert("未勾选任务")
    //   }
    // },
    // SetDurationTime() {
    //   let ids = this.getSelectedId()
    //   console.log(
    //     "SetDurationTime>>>",
    //     ids
    //   )
    //   let sendData = {
    //     data: ids
    //   }
    //   if (ids.length == 0) {
    //     alert("未勾选任务111")
    //   } else if (ids.length > 1) {
    //     alert("设置任务持续时间不能多选")
    //   } else {

    //   }
    // },
    // refreshData() {
    //   console.log("refreshData")
    // },
    // // 获取选择的任务的task_id
    // getSelectedId() {
    //   let idArr = []
    //   let tempArr = this.traversalNode(
    //     this.tableData[0]
    //   )
    //   tempArr.forEach(function(v) {
    //     if (v.checked && v.type == "task" && v.task_type !== "4") {
    //       idArr.push({
    //         project_id: v.project_id,
    //         plan_id: v.plan_id,
    //         task_id: v.task_id,
    //         task_name: v.task_name,
    //         task_type: v.task_type,
    //         duration: v.duration
    //       })
    //     }
    //   })
    //   return idArr
    // },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // console.log(column)
        return "padding: 0px!important;";
      }
    },
    // 将源数据格式化为表格树形结构数据
    formatToTreeData({
      arrayList,
      pidStr = "parent",
      idStr = "id",
      childrenStr = "children",
    }) {
      let templist = _.cloneDeep(arrayList);
      let listObj = {}; // 用来储存{key: obj}格式的对象
      let treeList = []; // 用来储存最终树形结构数据的数组
      // 将数据变换成{key: obj}格式，方便下面处理数据
      for (let i = 0; i < templist.length; i++) {
        templist[i].checked = false;
        listObj[templist[i][idStr]] = templist[i];
      }
      // 根据pid来将数据进行格式化
      for (let j = 0; j < templist.length; j++) {
        // 判断父级是否存在
        let haveParent = listObj[templist[j][pidStr]];
        if (haveParent) {
          // 如果有没有父级children字段，就创建一个children字段
          !haveParent[childrenStr] && (haveParent[childrenStr] = []);
          // 在父级里插入子项
          haveParent[childrenStr].push(templist[j]);
        } else {
          // 如果没有父级直接插入到最外层
          treeList.push(templist[j]);
        }
      }
      return treeList;
    },
    // 树形结构数据扁平化处理  如果需要可以设置该节点以及子节点checked
    traversalNode(node, bool) {
      let nodes = [];
      if (node) {
        if (bool !== undefined) node.checked = bool;
        let stack = [];
        stack.push(node);
        while (stack.length != 0) {
          let item = stack.shift();
          nodes.push(item);
          let children = item.children ? item.children : [];
          children.forEach(function (v) {
            if (bool !== undefined) v.checked = bool;
            stack.push(v);
          });
        }
      }
      return nodes;
    },
    // 递归找到所有父节点设为false
    findYouAndSetFalse(node, pids) {
      var that = this;
      if (pids.includes(node.task_id)) {
        node.checked = false;
      }
      let children = node.children ? node.children : [];
      children.forEach(function (v) {
        that.findYouAndSetFalse(v, pids);
      });
    },
    // 在扁平化的树结构数据中递归找到所点击任务的所有父节点task_id
    findParentIds(arr, pid) {
      let pids = [];
      let currentpid = pid;
      console.log(Array.isArray(arr));
      if (Array.isArray(arr) && arr.length > 0) {
        while (currentpid != 0) {
          arr.forEach(function (v) {
            if (v.task_id == currentpid) {
              pids.push(v.task_id);
              currentpid = v.parent;
            }
          });
        }
      }
      return pids;
    },
    // flatdata 为表格绑定的整个数据的扁平化数据  pids为包含所点击节点的所有父节点数组
    // 在整个扁平化数据中循环查找每个父节点下的子节点 判断
    // 若果有一个子节点为false 置所有父节点为false
    // 如果循环到当前父节点下的所有子节点都为true  置该父节点为true 继续找该父节点的父节点 重复该步骤
    helloKids(flatdata, pids) {
      let _that = this;
      let arr = [];
      // 如果pids为空 表示点击的节点为根节点没有父节点 直接置为true
      if (pids.length == 0) {
        this.allChecked = true;
        return flatdata;
      }
      for (let i = 0, len = pids.length; i < len; i++) {
        for (let j = 0, jlen = flatdata.length; j < jlen; j++) {
          if (pids[i] == flatdata[j].task_id) {
            let bool = flatdata[j].checked;
            let children = flatdata[j].children ? flatdata[j].children : [];
            for (let k = 0, klen = children.length; k < klen; k++) {
              if (!children[k].checked) {
                bool = false;
                _that.allChecked = false;
                break;
              } else {
                bool = true;
              }
            }
            flatdata[j].checked = bool;
            if (bool) {
              _that.allChecked = true;
            }
          }
        }
      }
      return flatdata;
    },
  },
}).$mount("#wbsPlanningApp");
