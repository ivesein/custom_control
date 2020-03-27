;(function(KDApi, $) {
  // let firstInitProInfo=true
  // let midIndex=0
  // let originTreeData={}
  // let currentClickedIndex=null
  function MyComponent(model) {
    this._setModel(model)
  }

  MyComponent.prototype = {
      // 内部函数不推荐修改
      _setModel: function(model) {
        this.model = model // 内部变量挂载
        this.model.treeOrgStructureApp = null
      },
      init: function(props) {
        console.log("init---", this.model, props)
        setHtml(this.model, props)
      },
      update: function(props) {
        console.log("-----update", this.model, props)
        console.log(this.model.treeOrgStructureApp)
        if (this.model.treeOrgStructureApp) {
          this.model.treeOrgStructureApp.handleUpdata(this.model, props)
        }else{
          setHtml(this.model, props)
        }
      },
      destoryed: function() {
        console.log("-----destoryed", this.model)
        this.model.treeOrgStructureApp = null
      }
    }
  var setHtml = function(model, props) {
    KDApi.loadFile("./css/element.css", model.schemaId, function() {
      KDApi.loadFile("./css/main.css", model.schemaId, function() {
        KDApi.loadFile("./js/vue.min.js", model.schemaId, function() {
          KDApi.loadFile("./js/vue.js", model.schemaId, function() {
            KDApi.loadFile("./js/lodash.js", model.schemaId, function() {
              KDApi.loadFile(
                "./js/element.js",
                model.schemaId,
                function() {
                  KDApi.templateFilePath(
                    "./html/tree_org_structure.html",
                    model.schemaId, {
                      path: KDApi.nameSpace(
                        model.schemaId
                      ) + "./img/lock.png"
                    }
                  ).then(function(result) {
                    model.dom.innerHTML = ""
                    model.dom.innerHTML = result
                    model.treeOrgStructureApp = new Vue({
                      delimiters: ["${", "}"],
                      data: {
                        levelOneWidth:"200px",
                        appWidth:'100%',
                        treeData:{
                          name:"项目名称",
                          children:[
                            {
                              id: "2",
                              major: "项目经理",
                              person: "",
                              open: true,
                              children: []
                            },
                            {
                              id: "3",
                              major: "技术负责人",
                              person: "",
                              open: true,
                              children: []
                            }
                          ],
                          open:true
                        },
                        midIndex:null,
                        currentClickedIndex:null
                      },
                      created() {
                          model.invoke("initProMajor", "")
                      },
                      mounted(){
                        if (props.data!==undefined) {
                          this.handleUpdata(model, props)
                        }
                        this.draw()
                      },
                      methods: {
                        handleUpdata(model, props){
                          // TODO 处理数据更新  
                          if(props.data!==undefined){
                            let pData=props.data
                            if(pData.method==="initProMajor"){
                              let temp={
                                name:'',
                                children:[],
                                open:true
                              }
                              temp.name=pData.name
                              this.midIndex=Math.floor(pData.first.length / 2)
                              pData.first.splice(this.midIndex, 0, {
                                major: "",
                                person: "",
                                children: pData.firstNode
                              })
                              temp.children=pData.first
                              this.treeData=Object.assign({},temp)
                              this.$nextTick(()=>{
                                this.draw()
                              })
                            }else if(pData.method==="getRolePerson"){
                              if(this.treeData&&this.treeData.children){
                                let tempData=_.cloneDeep(this.treeData)
                                tempData.children[this.midIndex].children[this.currentClickedIndex].children=pData.firstNode
                                tempData.children[this.midIndex].children[this.currentClickedIndex].open=this.currentOpen
                                this.treeData=Object.assign({},tempData)
                                // this.$forceUpdate()

                              }
                            }
                          }else{
                            console.log("后台返回为空")
                          }
                        },
                        rootClick(data){
                          data.open=!data.open
                        },
                        majorClick(data,index){
                          this.currentOpen=!data.open
                          this.currentClickedIndex = index
                          model.invoke("getRolePerson", data.id)
                        },
                        draw(){
                          if(this.treeData!=={}||this.treeData!==undefined||this.treeData!==null){
                            if(this.treeData.children){
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
                              this.$forceUpdate()
                            }
                          }else{
                            console.log("treeData为空",this.treeData)
                          } 
                          
                        }
                      }
                    }).$mount($("#treeOrgStructureApp", model.dom).get(0))
                  })
                }
              )
            })
          })
        })
      })
    })
  }
  // 注册自定义控件
  KDApi.register("tree_org_structure_v1.1", MyComponent)
})(window.KDApi, jQuery)