new Vue({
  delimiters: ["${", "}"],
  data: {
    levelOneWidth:"200px",
    appWidth:'100%',

    treeData:{
      name:"西藏墨脱项目",
      open:true,
      children:[
        {
          id:"2",
          major:"项目经理",
          type:"1",
          person:"孙航天",
          open:true,
          children:[]
        },
        {
          id:"3",
          major:"",
          person:"",
          type:"2",
          open:true,
          children:[
            {
              id:"3.1",
              major:"工程测绘",
              open:true,
              children:[]
            },
            {
              id:"3.2",
              major:"工程地质勘探",
              open:true,
              children:[
                {
                  major:"测绘1"
                },
                {
                  major:"测绘2"
                }
              ]
            },
            // {
            //   id:"3.3",
            //   label:"路线",
            //   stuff_name:["勘探员1","勘探员2","勘探员3"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.4",
            //   label:"路基路面",
            //   stuff_name:["勘探员1","勘探员2"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.5",
            //   label:"桥涵",
            //   stuff_name:["勘探员1"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.6",
            //   label:"隧道",
            //   stuff_name:["勘探员1","勘探员2"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.7",
            //   label:"造假",
            //   stuff_name:["造价员1"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.8",
            //   label:"总体",
            //   stuff_name:["勘探员1","勘探员2"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },{
            //   id:"3.9",
            //   label:"其他",
            //   stuff_name:["勘探员1","勘探员2","勘探员3"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.9",
            //   label:"其他",
            //   stuff_name:["勘探员1","勘探员2","勘探员3"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.9",
            //   label:"其他",
            //   stuff_name:["勘探员1","勘探员2","勘探员3"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.9",
            //   label:"其他",
            //   stuff_name:["勘探员1","勘探员2","勘探员3"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.9",
            //   label:"其他",
            //   stuff_name:["勘探员1","勘探员2","勘探员3"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.9",
            //   label:"其他",
            //   stuff_name:["勘探员1","勘探员2","勘探员3"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.9",
            //   label:"其他",
            //   stuff_name:["勘探员1","勘探员2","勘探员3"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.9",
            //   label:"其他",
            //   stuff_name:["勘探员1","勘探员2","勘探员3"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.9",
            //   label:"其他",
            //   stuff_name:["勘探员1","勘探员2","勘探员3"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // },
            // {
            //   id:"3.9",
            //   label:"其他",
            //   stuff_name:["勘探员1","勘探员2","勘探员3"],
            //   type:"3",
            //   open:true,
            //   children:[]
            // }
          ]
        },
        {
          id:"4",
          major:"技术负责人",
          person:"韩亮亮",
          type:"1",
          open:true,
          children:[]
        },
       
      ]
    }
  },
  created() {
    
  },
  mounted() {
    this.draw()
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
      console.log(data.id)
      // data.children.push(...ApiData)
    },
    draw(){
      let lenOne=this.treeData.children.length
      // this.levelOneWidth=(lenOne-1)*50+lenOne*120-1+'px'
      this.levelOneWidth=(lenOne-1)*120+(lenOne-1)*50*2+1+'px'
      console.log(this.levelOneWidth)
      this.treeData.children.forEach(v => {
        let len=v.children.length
        let theWidth=(len-1)*120+(len-1)*25*2+1
        v.levelTwoWidth=theWidth+'px'
        v.offsetLeft=-theWidth/2+50+len+'px'
        console.log(v.offsetLeft)
      });
      // 设置页面最大宽度
      let temp=[]
      this.$refs.levelTwo.forEach(v=>{
        temp.push(v.clientWidth)
      })
      let tempWidth=Math.max(...temp)
      console.log(document.body.clientWidth)
      let windowWidth=document.body.clientWidth
      this.appWidth=tempWidth>windowWidth?tempWidth+'px':windowWidth+'px'
    }
  }
}).$mount("#treeOrgStructureApp")