// 通过阅读rpd 定制的数据结构
// 进度计划页面所需数据
var prd_data1={
    id:"",      // 任务id
    text:"",  // 任务名称
    parent:"0",     // 父任务id
    duration:0,   // 工期
    task_type:"",  // 任务类型2  一般任务  复核任务  专业审核等
    type:"project",   // 任务类型1  摘要任务  子任务  里程碑
    describe:"", // 任务说明
    open:true, // 是否展开
    isMilestone:false,  // 是否是里程碑
    start_date:"2020-02-03 00:00:00",
    effect:"", //功效
    duration_plan:"", //工程量
    major:{
        text:"", //专业名称
        id:"", //专业id
    },
    my_unit:{   //工程量单位和功效单位 目前为同一个
        text:"", // 单位名称
        id:"",  //单位id
    },
    task_before:[],//紧前任务
}
// 委外计划页面所需数据
var prd_data2={
    id: "0219b531-fb46-4023-93fc-6daf0ea6974d",//id
    parent: "0",//父id（成本计划中对应字段是parent_id）
    text: "设计施工方式",//wbs任务名称（成本计划中对应字段是task_name）
    delegate: "0",//是否委外
    duration: "10",//工期（成本计划中字段是duration）
    contract_thing: "合同测试",//合同事项
    delegate_reason: "测试委派",//委外原因
    start_date: "2019-10-03 00:00:00",//开始时间（成本计划中字段是start_date）
    endTime: "2019-10-17 00:00:00",//结束时间（成本计划中字段是end_date）
    delegate_role_id: 757802139937423360,
    delegate_role_name: "专业组长",//委外负责人角色
    delegate_person_id: 754911742466739200,//委外负责人id
    delegate_person_name: "田重辉",//委外负责人名称
}

// 质量计划页面所需数据
var prd_data3={
    task_id: "1",   //任务id
    task_name: "项目准备阶段工作",   //任务名称  
    wbs: "1",  //wbs编码
    first_duration: "",  //首次复核持续时间
    modify_duration: "", //修改持续时间
    mod_con_duration: "", //确认修改持续时间
    confirm_duration: "", //复核确认持续时间
    owner_role: "",  //承担人角色
    owner_roleid: "",  //承担人角色id
    duration: "",  //工期
    plan_starttime: "",  //开始时间
    plan_endtime: "",  //结束时间
    qualityplan_version: "",
    parent: "0",  //父任务id
    type: "project", //任务类型2
    task_type: "",  //任务类型1
    audit_task_id: "2,5" //审核的任务id
}

// 成本计划页面所需数据
var rd_data4={
    project_id: "11",//项目id
    task_id: "12",//任务id
    type: "project",//任务类型2
    task_type: "",//任务类型1
    work_amount_unit:"",//工程量/单位
    performance_bonus:0,//绩效奖金(元/单位工程量)
    performance_bonus_subtotal:0, //绩效奖金小计
    fmachine_name: [""],//机械名称
    machine_id: [""],//机械id
    fmachine_used: [""],//机械耗用量
    fmachine_price: [""],//机械单价
    fmachine_unit: [""],//机械单位
    fmachine_subtotal: [""],//机械小计
    fmachine_all: "1.2",//机械合计
    fmaterial_name: ["", "材料", "", "材料"],//材料名称
    material_id: ["", "2", "", "2"],//材料id
    fmaterial_used: ["", "2", "", "2"],//材料耗用量
    fmaterial_price: ["", "2", "", "2"],//材料单价
    fmaterial_unit: ["", "2", "", "2"],//材料单位
    fmaterial_subtotal: ["1", "2", "1", "2"],//材料小计
    fmaterial_all: "2",//材料合计
    fmanual_name: ["人工", "人工1"],//人工名称
    person_id: ["12", "11"],//人工id
    fmanual_workload: ["1", "2"],//人工负载
    fmanual_price: ["1", "2"],//人工单价
    fmanual_unit: ["1", "2"],//人工单位
    fmanual_subtotal: ["1", "2"],//人工小计
    fmanual_all: "2",//人工合计
    ffee_subtotal: "2",
    ffee_all: "1",
}
 /**
  * @author  zhang fq
  * @date  2020-03-03
  * @description  完整结构化数据模拟
  */
// 完整结构化数据  模拟
var final_data={
    id:"",      // 任务id
    text:"",  // 任务名称
    parent:"0",     // 父任务id
    duration:0,   // 工期
    task_type:"3",  // 任务类型2  一般任务  复核任务  专业审核等
    type:"project",   // 任务类型1  摘要任务  子任务  里程碑
    describe:"", // 任务说明
    open:true, // 是否展开
    isMilestone:false,  // 是否是里程碑
    start_date:"2020-02-03 00:00:00",
    effect:"", //功效
    duration_plan:"", //工程量
    major:{
        text:"", //专业名称
        id:"", //专业id
    },
    my_unit:{   //工程量单位和功效单位 目前为同一个
        text:"", // 单位名称
        id:"",  //单位id
    },
    task_before:[],//紧前任务
    first_duration: "",  //首次复核持续时间
    modify_duration: "", //修改持续时间
    mod_con_duration: "", //确认修改持续时间
    confirm_duration: "", //复核确认持续时间
    owner_role: "",  //承担人角色
    owner_roleid: "",  //承担人角色id
    audit_task_id: "2,5", //审核的任务id
    delegate: "0",//是否委外
    contract_thing: "合同测试",//合同事项
    delegate_reason: "测试委派",//委外原因
    delegate_role_id: 757802139937423360,
    delegate_role_name: "专业组长",//委外负责人角色
    delegate_person_id: 754911742466739200,//委外负责人id
    delegate_person_name: "田重辉",//委外负责人名称
    assn_pro_num:"",//工程量/单位
    assn_merits_price:0,//绩效奖金(元/单位工程量)
    assn_merits_total:0, //绩效奖金小计
    fmachine_name: [""],//机械名称
    machine_id: [""],//机械id
    fmachine_used: [""],//机械耗用量
    fmachine_price: [""],//机械单价
    fmachine_unit: [""],//机械单位
    fmachine_subtotal: [""],//机械小计
    fmachine_all: "1.2",//机械合计
    fmaterial_name: ["", "材料", "", "材料"],//材料名称
    material_id: ["", "2", "", "2"],//材料id
    fmaterial_used: ["", "2", "", "2"],//材料耗用量
    fmaterial_price: ["", "2", "", "2"],//材料单价
    fmaterial_unit: ["", "2", "", "2"],//材料单位
    fmaterial_subtotal: ["1", "2", "1", "2"],//材料小计
    fmaterial_all: "2",//材料合计
    fmanual_name: ["人工", "人工1"],//人工名称
    person_id: ["12", "11"],//人工id
    fmanual_workload: ["1", "2"],//人工负载
    fmanual_price: ["1", "2"],//人工单价
    fmanual_unit: ["1", "2"],//人工单位
    fmanual_subtotal: ["1", "2"],//人工小计
    fmanual_all: "2",//人工合计
    ffee_subtotal: "2",
    ffee_all: "1",
}