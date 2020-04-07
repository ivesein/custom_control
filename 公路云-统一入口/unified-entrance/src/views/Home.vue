<template>
    <div class='home-page'>
      <div class="header">
        <div class="header-left">
          <span class="header-title">公路云</span>
        </div>
        <div class="header-right">
          <img :src="phoneSrc" alt="">
          <span>400-000-6666</span>
        </div>
      </div>
      <div class="content">
        <div class="content-left">
          <span>公路云</span>
          <span>智慧交通工程管理的专业平台</span>
        </div>
        <div class="content-right">
           <div class="item-wrap">
             <div class="earth-warp">
               <img class="earth-img" :src="earthImg" alt="  ">
               <span class="sub-title">九方协同</span>
               <img class="logo-img" :src="logo" alt="">
               <span class="text-info">工程全生命周期管理系统</span>
             </div>
             <div class="btn-item" v-for="(item,index) in btnItems" :key="index" :style="{'left':item.left,'top':item.top,'background':item.bgColor}">
               {{item.title}}
             </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
          phoneSrc:require('assets/phone.png'),
          logo:require('assets/logo.png'),
          earthImg:require('assets/earth.jpg'),
          btnItems:[
            {
              title:"数据使用方",
              left:'',
              right:'',
              bgColor:''
            },
            {
              title:"业主",
              left:'',
              right:'',
              bgColor:''
            },
            {
              title:"咨询",
              left:'',
              right:'',
              bgColor:''
            },
            {
              title:"招标代理",
              left:'',
              right:'',
              bgColor:''
            },
            {
              title:"设计",
              left:'',
              right:'',
              bgColor:''
            },
            {
              title:"施工",
              left:'',
              right:'',
              bgColor:''
            },
            {
              title:"供应商",
              left:'',
              right:'',
              bgColor:''
            },
            {
              title:"监理",
              left:'',
              right:'',
              bgColor:''
            },
            {
              title:"运维",
              left:'',
              right:'',
              bgColor:''
            }
          ]
        };
    },
    created() {

    },
    mounted() {
      this.calcPosition()
    },
    methods: {
      //计算环形9个按钮防止位置
      calcPosition(){
        let x=260,y=260,r=220
        let temp=[]
        for(let times=0; times<9; times++) {
          var hudu = (2*Math.PI / 360) * 40 * times;
          var X = x + Math.sin(hudu) * r;
          var Y = y - Math.cos(hudu) * r
          temp.push([X,Y])
        }
        this.btnItems.forEach((v,k)=>{
          v.top=temp[k][1]+'px'
          v.left=temp[k][0]+'px'
          v.bgColor=this.getRandomColor()
        })
        console.log(temp)
      },
      //随机生成色值
      getRandomColor(){
          var colorValue = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
          var s = "#";
          for (var i=0;i<6;i++) {
              s+=colorValue[Math.floor(Math.random()*16)];
          }
          return s;
      }
    }
};
</script>

<style scoped lang="scss">
  .home-page{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    width:100%;
    height:100%;

    .header{
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #5582f4;

      .header-left{
        margin-left: 40px;
        font-size: 24px;
        color: #fff;
        font-weight: 700;
      }

      .header-right{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-right: 40px;
        font-size: 20px;
        color: #fff;
        
        img{
          width: 24px;
          height: 24px;
          margin-right: 20px;
        }
      }
    }

    .content{
      display: flex;
      flex: 1;
      justify-content: flex-start;
      align-items: stretch;

      .content-left{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;

        span{
          font-size: 26px;
          color: #5582f4;
          font-weight: 700;
          margin-bottom: 30px;
        }
      }
      .content-right{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 700px;

        .item-wrap{
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 600px;
          height: 600px;

          .earth-warp{
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 300px;
            height: 300px;
            border-radius: 100%;
            border: 3px solid #999;

            .earth-img{
              width: 280px;
              height: 280px;
              position: absolute;
              left: 10px;
              top:10px;
              border-radius: 100%;
              z-index: -1;
            }

            .sub-title{
              font-size: 28px;
              color: #fff;
              font-weight: 700;
            }

            .logo-img{
              width:150px;
              margin: 20px 0;
            }

            .text-info{
              font-size: 16px;
              color: #fff;
              font-weight: 700;
            }
          }

          .btn-item{
            width: 80px;
            height: 80px;
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 100%;
            color: #fff;
            font-size: 16px;
            background: #ccc;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
          }
        }
      }
    }
  }
  
</style>
