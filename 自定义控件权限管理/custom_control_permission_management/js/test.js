new Vue({
  delimiters: ["${", "}"],
  data: {
    activeName: "first",
    searchText: "",
    data: [
      {
        id: "0",
        label: "功能权限",
        children: [
          {
            id:"1",
            label:"测试云",
            children:[]
          },
          {
            id: "2",
            label: "员工服务云",
            children: [
              {
                id: "2-1",
                label: "费用查询",
              },
              {
                id: "2-2",
                label: "人人差旅",
              },
            ],
          },
          {
            id: "3",
            label: "财务云",
            children: [
              {
                id: "3-1",
                label: "应付",
              },
              {
                id: "3-2",
                label: "应收",
              },
            ],
          },
          {
            id: "4",
            label: "系统云",
            children: [
              {
                id: "4-1",
                label: "企业管理",
              },
              {
                id: "4-2",
                label: "基础资料",
              },
            ],
          },
          {
            id: "5",
            label: "公司管理",
            children: [
              {
                id: "5-1",
                label: "经营管理（建筑业）",
              },
              {
                id: "5-2",
                label: "人力管理",
              },
              {
                id: "5-3",
                label: "采购管理",
              },
              {
                id: "5-4",
                label: "库存管理",
              },
            ],
          },
          {
            id: "6",
            label: "公路云",
            children: [
              {
                id: "6-1",
                label: "公路云（建筑业）",
                children: [
                  {
                    id: "6-1-1",
                    label: "手机注册",
                  },
                ],
              },
            ],
          },
          {
            id: "7",
            label: "项目管理",
            children: [
              {
                id: "7-1",
                label: "项目基础设置",
              },
              {
                id: "7-2",
                label: "计划编制",
              },
              {
                id: "7-3",
                label: "合同计划",
              },
              {
                id: "7-4",
                label: "执行管理",
                children: [
                  {
                    id: "7-4-1",
                    label: "进度管理（自定义）",
                  },
                  {
                    id: "7-4-2",
                    label: "质量管理（自定义）",
                  },
                  {
                    id: "7-4-3",
                    label: "成本管理（自定义）",
                    children: [
                      {
                        id: "7-4-3-1",
                        label: "成本分析与控制",
                        children: [
                          {
                            id: "7-4-3-1-1",
                            label: "成本对比分析表",
                            children: [
                              {
                                id: "7-4-3-1-1-1",
                                label: "首页（自定义）",
                              },
                              {
                                id: "7-4-3-1-1-2",
                                label: "当前任务成本管控（自定义）",
                              },
                              {
                                id: "7-4-3-1-1-3",
                                label: "紧前任务成本管控（自定义）",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        id: "7-4-3-2",
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
    assignedData:[
      {
        id: "0",
        label: "已分配",
        children:[
          {
            id: "4",
            label: "系统云",
            children: [
              {
                id: "4-1",
                label: "企业管理",
              },
              {
                id: "4-2",
                label: "基础资料",
              },
            ],
          },
          {
            id: "5",
            label: "公司管理",
            children: [
              {
                id: "5-1",
                label: "经营管理（建筑业）",
              },
              {
                id: "5-2",
                label: "人力管理",
              },
              {
                id: "5-3",
                label: "采购管理",
              },
              {
                id: "5-4",
                label: "库存管理",
              },
            ],
          },
          {
            id: "6",
            label: "公路云",
            children: [
              {
                id: "6-1",
                label: "公路云（建筑业）",
                children: [
                  {
                    id: "6-1-1",
                    label: "手机注册",
                  },
                ],
              },
            ],
          },
        ]
      }
    ],
    defaultProps: {
      children: "children",
      label: "label",
    },
    defaultExpandedArr:["0"]
  },
  created() {},
  mounted() {
    // this.defaultExpandedArr=this.getDefaultExpandedKeys(this.data[0].children)
  },
  methods: {
    getDefaultExpandedKeys(arr){
      let res=[]
      if(Array.isArray(arr)){
        if(arr.length>0){
          arr.forEach(v=>{
            res.push(v.id)
          })
        }
      }
      return res
    },
    handleClick(val) {
      console.log(val);
    },
    add(){
      // console.log(this.$refs.treeLeft.getCheckedNodes())
      console.log(this.$refs.treeLeft.getCheckedKeys());
      // 获取勾选的所有节点的id
      let checked=this.$refs.treeLeft.getCheckedKeys()
      let filterArr=_.cloneDeep(checked)
      console.log(filterArr)
      // 第一层过滤  从勾选的节点中取出根节点被选中的  直接将根节点连其所有子节点一同插入右侧树
      let rootKeys=checked.filter(v=>{
        let arrTemp=v.split("-")
        if(arrTemp.length===1){
          return v
        }
      })
      // 第二次过滤  去除所有重复包含的子节点 
      while(filterArr.length>0){
        let target=filterArr.shift()
        checked.forEach((v,k)=>{
          if(v.indexOf(target)==0){
            checked.splice(k,1)
          }
        })
      }
      // 获取过滤后的剩余key对应的节点 插入到右侧树数据中
      checked.forEach(v=>{
        let node=this.$refs.treeLeft.getNode(v)
        this.assignedData[0].children.push(node)
      })
      // console.log(checked)
      // console.log(rootKeys)
    },
    remove(){

    }
  },
}).$mount("#ccPermissionManagementApp");
