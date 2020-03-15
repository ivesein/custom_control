new Vue({
  delimiters: ["${", "}"],
  data: {
    levelOneWidth:"200px",
    treeData:{
      id:"1",
      project_name:"西藏墨脱项目",
      label:"西藏墨脱项目",
      open:true,
      type:'0',
      children:[
        {
          id:"2",
          label:"项目经理",
          type:"1",
          stuff_name:["孙航天"],
          open:true,
          children:[]
        },
        {
          id:"3",
          label:"",
          stuff_name:[],
          type:"2",
          open:true,
          children:[
            {
              id:"3.1",
              label:"工程测绘",
              stuff_name:["测绘员1"],
              type:"3",
              open:true,
              children:[]
            },
            {
              id:"3.2",
              label:"工程地质勘探",
              stuff_name:["勘探员1","勘探员2","勘探员3"],
              type:"3",
              open:true,
              children:[]
            },
            {
              id:"3.3",
              label:"路线",
              stuff_name:["勘探员1","勘探员2","勘探员3"],
              type:"3",
              open:true,
              children:[]
            },
            {
              id:"3.4",
              label:"路基路面",
              stuff_name:["勘探员1","勘探员2"],
              type:"3",
              open:true,
              children:[]
            },
            {
              id:"3.5",
              label:"桥涵",
              stuff_name:["勘探员1"],
              type:"3",
              open:true,
              children:[]
            },
            {
              id:"3.6",
              label:"隧道",
              stuff_name:["勘探员1","勘探员2"],
              type:"3",
              open:true,
              children:[]
            },
            {
              id:"3.7",
              label:"造假",
              stuff_name:["造价员1"],
              type:"3",
              open:true,
              children:[]
            },
            {
              id:"3.8",
              label:"总体",
              stuff_name:["勘探员1","勘探员2"],
              type:"3",
              open:true,
              children:[]
            },{
              id:"3.9",
              label:"其他",
              stuff_name:["勘探员1","勘探员2","勘探员3"],
              type:"3",
              open:true,
              children:[]
            }
          ]
        },
        {
          id:"4",
          label:"技术负责人",
          stuff_name:["韩亮亮"],
          type:"1",
          open:true,
          children:[]
        }
      ]
    }
  },
  created() {
    let lenOne=this.treeData.children.length
    // this.levelOneWidth=(lenOne-1)*50+lenOne*120-1+'px'
    this.levelOneWidth=(lenOne-1)*120+(lenOne-1)*50*2+'px'
    console.log(this.levelOneWidth)
    this.treeData.children.forEach(v => {
      let len=v.children.length
      let theWidth=(len-1)*120+(len-1)*25*2+(len-1)*2
      v.levelTwoWidth=theWidth+'px'
      v.offsetLeft=-theWidth/2+50+len+'px'
      console.log(v.offsetLeft)
    });
  },
  mounted() {
  },
  methods: {
    errorHandler(){
      return true
    },
    rootClick(data){
      data.open=!data.open
    },
    majorClick(data){
      data.open=!data.open
      // data.children.push(...ApiData)
    }
  }
}).$mount("#treeOrgStructureApp")