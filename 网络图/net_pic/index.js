(function (KDApi, $) {
  function MyComponent(model) {
    this._setModel(model);
  }

  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.netPicAppVue = null;
    },
    init: function (props) {
      console.log("init---", this.model, props);
      // setHtml(this.model, props);
    },
    update: function (props) {
      console.log("-----update", this.model, props);
      console.log(this.model.netPicAppVue);
      if (this.model.netPicAppVue) {
        this.model.netPicAppVue.handleUpdata(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.netPicAppVue = null;
    },
  };
  // ----------------------------------------
  // import { ActivityOnArrowNetwork } from "./bundle.js";
  var ntCachedData = null;
  // 定义标尺绘制相关常量
  const ROLE_TEXT_COLOR = "#808000"; // 标尺内容文字颜色
  const ROLE_TEXT_FONT_SIZE = 12; // 标尺内容文字大小

  // 定义桥接绘制相关常量
  const PIE = 3.14; // π
  const BRIDGE_R = 8; // 半圆桥半径
  const UP_SEMISCIRCLE = [PIE, 0]; // 上半圆桥 开始绘制弧度和结束绘制弧度
  const DOWN_SEMISCIRCLE = [0, PIE]; // 下半圆桥 开始绘制弧度和结束绘制弧度
  const LEFT_SEMISCIRCLE = [PIE / 2, -PIE / 2]; // 左半圆桥 开始绘制弧度和结束绘制弧度
  const RIGHT_SEMISCIRCLE = [-PIE / 2, PIE / 2]; // 右半圆桥 开始绘制弧度和结束绘制弧度

  // 定义任务标签 工期文字相关常量
  const LABEL_FONT_SIZE = 12; // 任务名称文字大小
  const LABEL_FONT_COLOR = "green"; // 任务名称文字颜色
  const DURATION_FONT_SIZE = 12; // 工期文字大小
  const DURATION_FONT_COLOR = "green"; // 工期文字颜色
  const LABEL_OFFSET_HEIGHT = 15; // 标签文字和工期文字在 横线上线的偏移量
  const DURATION_OFFSET_HEIGHT = 25;
  const LABEL_OFFSET_WIDTH = 10; // 标签文字和工期文字在 横线上距离中点的左右偏移量

  // 定义线相关常量
  const LINE_WIDTH = 1;
  const LINE_DEFAULT_COLOR = "blue";
  const LINE_DASHED_COLOR = "#000";
  const LINE_WAVE_COLOR = "#0592f7";
  const LINE_RELATION_DASHED_COLOR = "green";
  const STROKE_RELATION_DASHARRAY = "3,1,3";
  const STROKE_DASHARRAY = "3,3";
  const LINE_OFFSETX_UNIT = 5; // 连线偏移量单位

  // 定义箭头相关常量
  const ARROW_LENGTH = 25; // 箭头箭身长度
  const ARROW_TAIL_OFFSET = 2; // 箭翼距离箭身尾部向后偏移量
  const ARROW_WING_WIDTH = 3; // 箭翼宽度

  // 定义节点相关常量
  const NODE_RADIUS = 20; // 节点圆半径

  // 定义边距相关常量
  const offsetX = 0; //x偏移
  const offsetY = 0; //y偏移
  let xUnit = 150; // 每工期单位长度
  const yUnit = 70; // 每层单位高度
  const marginLeft = 100 + NODE_RADIUS; // 左边距
  let marginTop = 140; // 上边距
  var layoutData = null; // 杨勇算法结果
  var aoanInstance = null; // aoan实例
  // ----------------------------------------
  var setHtml = function (model, props) {
    KDApi.loadFile("./css/element.css", model.schemaId, function () {
      KDApi.loadFile("./css/main.css", model.schemaId, function () {
        KDApi.loadFile("./js/localforage.min.js", model.schemaId, function () {
          KDApi.loadFile("./js/viz.js", model.schemaId, function () {
            KDApi.loadFile("./js/full.render.js", model.schemaId, function () {
              KDApi.loadFile("./js/d3.v5.min.js", model.schemaId, function () {
                KDApi.loadFile("./js/layout.js", model.schemaId, function () {
                  KDApi.loadFile("./js/lodash.js", model.schemaId, function () {
                    KDApi.loadFile(
                      "./js/vue.min.js",
                      model.schemaId,
                      function () {
                        KDApi.loadFile(
                          "./js/element.js",
                          model.schemaId,
                          function () {
                            KDApi.loadFile(
                              "./js/element.js",
                              model.schemaId,
                              function () {
                                KDApi.templateFilePath(
                                  "./html/net_pic.html",
                                  model.schemaId,
                                  {
                                    path:
                                      KDApi.nameSpace(model.schemaId) +
                                      "./img/lock.png",
                                  }
                                ).then(function (result) {
                                  model.dom.innerHTML = "";
                                  model.dom.innerHTML = result;
                                  model.netPicAppVue = new Vue({
                                    delimiters: ["${", "}"],
                                    data: {
                                      loading: true,
                                      projectName: "",
                                      projectId: "",
                                      svgInstance: null,
                                      rootG: null,
                                      aoanOption: {
                                        layoutFactor: 10,
                                      },
                                      dateData: {},
                                      timeScale: [
                                        {
                                          label: "天",
                                          value: "1",
                                        },
                                        {
                                          label: "小时",
                                          value: "2",
                                        },
                                      ],
                                      scale: 1,
                                    },
                                    created() {
                                      this.handleUpdata(model, props);
                                    },
                                    computed: {
                                      getDataOptions() {
                                        let option = [];
                                        for (let key in ganttData) {
                                          console.log(key);
                                          option.push(key);
                                        }
                                        return option;
                                      },
                                      getScaleText() {
                                        let str = "天";
                                        switch (this.scale) {
                                          case 1:
                                            str = "天";
                                            break;
                                          case 2:
                                            str = "小时";
                                            break;
                                          default:
                                            str = "天";
                                        }
                                        return str;
                                      },
                                    },
                                    methods: {
                                      handleUpdata(model, props) {
                                        if (props.data) {
                                          if (
                                            props.data.method &&
                                            props.data.method === "init"
                                          ) {
                                            this.projectId =
                                              props.data.projectId;
                                            this.handleCacheData(
                                              props.data.projectId
                                            );
                                          }
                                        }
                                      },
                                      /**
                                       * @Author: zhang fq
                                       * @Date: 2020-09-01
                                       * @Description: 添加缓存 如果进度计划数据不变 避免重复调用布局算法
                                       */
                                      getCacheData(pId) {
                                        if (pId === "") return null;
                                        let data = localStorage.getItem(
                                          "plan-" + pId
                                        );
                                        if (
                                          data === null ||
                                          data === undefined ||
                                          data === ""
                                        ) {
                                          return null;
                                        } else {
                                          return JSON.parse(data);
                                        }
                                      },
                                      // 更新缓存方法封装
                                      setCacheDate(pId, jsonStr = "") {
                                        if (pId === "") return null;
                                        localStorage.setItem(
                                          "plan-" + pId,
                                          jsonStr
                                        );
                                      },
                                      /**
                                       * @Author: zhang fq
                                       * @Date: 2020-09-01
                                       * @Description: 缓存数据处理逻辑 判断是否有更新
                                       */
                                      handleCacheData(projectId) {
                                        let _this = this;
                                        if (projectId === "") {
                                          this.$message.error(
                                            "获取项目id失败，请刷新页面重试..."
                                          );
                                          return;
                                        }
                                        let times = 5;
                                        let myInterval = setInterval(
                                          async () => {
                                            ntCachedData = _this.getCacheData(
                                              projectId
                                            );
                                            times--;
                                            // 5次后清除轮询
                                            if (
                                              times === 0 ||
                                              ntCachedData !== null
                                            ) {
                                              clearInterval(myInterval);
                                            }
                                            if (
                                              times === 0 &&
                                              ntCachedData === null
                                            ) {
                                              // 提示用户去进度计划获取数据
                                              // _this.loading = false;
                                              _this.$message.warning(
                                                "数据加载失败，请稍后重试！"
                                              );
                                            }
                                            if (ntCachedData !== null) {
                                              _this.projectName =
                                                ntCachedData.projectName;
                                              let taskData = _.cloneDeep(
                                                ntCachedData
                                              );
                                              if (ntCachedData.network) {
                                                _this.processData(taskData);
                                              } else {
                                                // 缓存的进度数据没有更新  直接读缓存内的 布局算法数据
                                                // 避免重复调用布局算法 优化绘图速度
                                                // 判断是否有缓存成功的数据
                                                if (ntCachedData.ntCacheFlag) {
                                                  try {
                                                    let res = await localforage.getItem(
                                                      "plan-nt-" +
                                                        this.projectId
                                                    );
                                                    // 读缓存成功 直接初始化
                                                    _this.init(res);
                                                  } catch (error) {
                                                    console.log(
                                                      "读取缓存数据失败!",
                                                      error
                                                    );
                                                    // 读缓存失败 重新计算布局数据
                                                    _this.processData(taskData);
                                                  }
                                                } else {
                                                  console.log(
                                                    "没有缓存数据，将重新计算布局!"
                                                  );
                                                  // 没有缓存成功的数据 直接新计算布局数据
                                                  _this.processData(taskData);
                                                }
                                              }
                                            }
                                          },
                                          300
                                        );
                                      },
                                      //处理时间标尺单位切换 目前分为 日 和 时
                                      handleScaleClicked() {
                                        this.loading = true;
                                        if (this.scale < 2) {
                                          this.scale++;
                                        } else {
                                          this.scale = 1;
                                        }
                                        this.init(
                                          {
                                            result: layoutData,
                                            aoan: aoanInstance,
                                          },
                                          this.scale
                                        );
                                      },
                                      // 拖拽回调  移动画布
                                      dragmove(d) {
                                        d.x += d3.event.dx;
                                        d.y += d3.event.dy;
                                        d3.select("g").attr(
                                          "transform",
                                          function (d) {
                                            return (
                                              "translate(" +
                                              d.x +
                                              "," +
                                              d.y +
                                              ")"
                                            );
                                          }
                                        );
                                      },
                                      // 缩放回调
                                      zoomed(d) {
                                        let k = d3.event.transform.k.toFixed(1);
                                        this.rootG
                                          .attr("transform", function () {
                                            // 设置缩放时移动为0 0
                                            return (
                                              "translate(" +
                                              0 +
                                              "," +
                                              0 +
                                              ") scale(" +
                                              k +
                                              ")"
                                            );
                                          })
                                          .style("cursor", "pointer");
                                        // 设置移动后的svg top和left 使其重回原点
                                        let wh = getGroupWH("root-group");
                                        if (wh) {
                                          this.svgInstance
                                            .attr(
                                              "width",
                                              wh["width"] * k + 20 + "px"
                                            )
                                            .attr(
                                              "height",
                                              wh["height"] * k + 20 + "px"
                                            );
                                          // this.svgInstance
                                          //   .attr("transform", function () {
                                          //     // return " scale(" + k + ")";
                                          //     return "translate(" + 0 + "," + 0 + ") scale(" + k + ")";
                                          //   })
                                          //   .style("top", function (d) {
                                          //     // 根据画布的缩放倍数 重算画布基于原点的y偏移量
                                          //     if (k < 1) {
                                          //       return -(wh["height"] * (1 - k)) / 2 + "px";
                                          //     } else {
                                          //       return (wh["height"] * (k - 1)) / 2 + "px";
                                          //     }
                                          //   })
                                          //   .style("left", function (d) {
                                          //     // 根据画布的缩放倍数 重算画布基于原点的x偏移量
                                          //     if (k < 1) {
                                          //       return -(wh["width"] * (1 - k)) / 2 + "px";
                                          //     } else {
                                          //       return (wh["width"] * (k - 1)) / 2 + "px";
                                          //     }
                                          //   });
                                        }
                                      },
                                      // 缩放回调
                                      zoomended(d) {
                                        this.rootG
                                          .attr("transform", function () {
                                            return (
                                              "translate(" +
                                              -d3.event.transform.x +
                                              "," +
                                              -d3.event.transform.y +
                                              ") scale(" +
                                              d3.event.transform.k +
                                              ")"
                                            );
                                          })
                                          .style("cursor", "pointer");
                                      },
                                      // 调用 布局算法  获取布局数据
                                      processData(taskData) {
                                        aoanInstance = new ActivityOnArrowNetwork(
                                          taskData,
                                          this.aoanOption
                                        );
                                        aoanInstance.layoutPlan(
                                          (nodeCoordinate, edges, option) => {
                                            layoutData = {
                                              nodeCoordinate,
                                              edges,
                                              option,
                                            };
                                            if (layoutData) {
                                              this.init({
                                                result: layoutData,
                                                aoan: aoanInstance,
                                              });
                                              /**
                                               * @Author: zhang fq
                                               * @Date: 2020-09-01
                                               * @Description:布局计算成功或失败后的 缓存处理逻辑
                                               */
                                              // 布局算法成功后 缓存本次计算的相关数据 避免下次重复计算
                                              localforage
                                                .setItem(
                                                  "plan-nt-" + this.projectId,
                                                  {
                                                    result: layoutData,
                                                    aoan: aoanInstance,
                                                  }
                                                )
                                                .then(() => {
                                                  // 修改缓存标志位为成功
                                                  console.log("数据缓存成功！");
                                                  // 修改进度计划缓存数据是否有更新为 false  如果有更新再由进度计划改为true
                                                  ntCachedData.network = false;
                                                  ntCachedData.ntCacheFlag = true;
                                                  // 更新进度计划缓存数据
                                                  this.setCacheDate(
                                                    this.projectId,
                                                    JSON.stringify(ntCachedData)
                                                  );
                                                })
                                                .catch((err) => {
                                                  console.log(
                                                    "数据缓存失败！",
                                                    err
                                                  );
                                                });
                                            } else {
                                              this.$message.error(
                                                "布局数据获取失败"
                                              );
                                              this.$forceUpdate();
                                            }
                                          }
                                        );
                                      },
                                      init(res, scale = 1) {
                                        // 重绘时 移除上次重绘的画布实例
                                        if (this.svgInstance) {
                                          this.svgInstance.remove();
                                        }

                                        // 获取项目的开始日期 结束日期
                                        const START =
                                          res.result.option["projectStartTime"];
                                        const END =
                                          res.result.option["projectEndTime"];
                                        // 整个画布绘制完毕后 获取画布的实际宽高 赋值给画布容器的宽高
                                        setTimeout(() => {
                                          let wh = getGroupWH("root-group");
                                          if (wh) {
                                            this.svgInstance
                                              .attr(
                                                "width",
                                                wh["width"] + 20 + "px"
                                              )
                                              .attr(
                                                "height",
                                                wh["height"] + 20 + "px"
                                              );
                                          }
                                          this.loading = false;
                                        }, 100);
                                        // 从杨勇算法回调中获取数据
                                        console.log(
                                          "aoan>>>>>>>>>>>>>",
                                          res.aoan
                                        );
                                        let last_node = res.aoan.lastNode;
                                        let node_data = _.cloneDeep(
                                          res.result.nodeCoordinate
                                        ); // 获取节点数据
                                        let linkData = []; // 储存边数据
                                        let allData = _.cloneDeep(
                                          res.result.edges
                                        ); // 获取所有与边相关的数据
                                        console.log(
                                          "allData>>>>>>>>>>>>>>>>>>",
                                          allData
                                        );
                                        let taskInfo = []; // 存储任务信息
                                        let intersection = []; //存储穿线点 即搭桥的点相关信息
                                        // 分拆数据  将需要的数据提取出来
                                        for (let k1 in allData) {
                                          if (allData[k1].option !== null) {
                                            taskInfo.push({
                                              option: allData[k1].option,
                                              link: allData[k1].link,
                                            });
                                          } else {
                                            // 将 虚工作相关的信息提取出来
                                            taskInfo.push({
                                              option: null,
                                              link: allData[k1].link,
                                            });
                                          }
                                          if (allData.hasOwnProperty(k1)) {
                                            for (let key2 in allData[k1]) {
                                              if (key2 === "link") {
                                                linkData.push(allData[k1].link);
                                              }
                                            }
                                          }
                                        }
                                        // 过滤掉 为null的数据 解决报错
                                        linkData = linkData.filter((v) => {
                                          return v !== null;
                                        });

                                        let text_data = []; // 存储label相关的数据
                                        // 处理边相关的 信息
                                        /**
                                         * @Author: zhang fq
                                         * @Date: 2020-08-21
                                         * @Description:修复连接线只有一条且为垂直方向时的 任务名lable显示坐标计算错误bug
                                         * @Date: 2020-09-24
                                         * @Update: 根据布局算法返回的新的数据结构，筛选出挂起工作 并显示其lable标签和工期（30%）
                                         * @Date: 2020-09-27
                                         * @Update: 根据布局算法返回的新的数据结构，标识出搭接工作，挂起工作 并显示其lable标签和工期（80%）
                                         * @Date: 2020-09-29
                                         * @Update: 标识出搭接工作，挂起工作 并显示其lable标签和工期（100%）
                                         */
                                        taskInfo.forEach((v) => {
                                          let text = {
                                            x: 0,
                                            y: 0,
                                            label:
                                              v.option && v.option.text
                                                ? v.option.text
                                                : "",
                                            duration:
                                              v.option === null ||
                                              (v.option.duration === 0 &&
                                                v.option.dummy === true) // 修复 虚工作工期不显示问题
                                                ? 0
                                                : v.option.duration,
                                          };
                                          switch (v.option.taskType) {
                                            case 6:
                                              text.label =
                                                v.option.relationLinkTypeText;
                                              text.duration =
                                                v.option.lag || "";
                                              break;
                                            case 3:
                                              text.label = v.option.typeText;
                                              text.duration =
                                                v.option.hangTime || "";
                                              break;
                                            default:
                                              break;
                                          }
                                          if (v.link) {
                                            if (
                                              v.link.lines &&
                                              v.link.lines.length > 0
                                            ) {
                                              // 修复连接线只有一条且为垂直方向时的 任务名lable显示坐标计算错误bug
                                              if (
                                                v.link.lines.length === 1 &&
                                                v.link.lines[0].direction === 2
                                              ) {
                                                text.x =
                                                  v.link.lines[0].start.x;
                                                text.y =
                                                  (v.link.lines[0].end.y -
                                                    v.link.lines[0].start.y) /
                                                    2 +
                                                  v.link.lines[0].start.y;
                                                text.ifRotate = true;
                                              } else {
                                                for (
                                                  let i = 0;
                                                  i < v.link.lines.length;
                                                  i++
                                                ) {
                                                  if (
                                                    v.link.lines[i]
                                                      .direction === 1
                                                  ) {
                                                    //  优化  直接取线的起点 加上任务的工期除以2
                                                    text.x =
                                                      v.link.lines[i].start.x +
                                                      v.link.option.length / 2;
                                                    text.y =
                                                      v.link.lines[i].start.y;
                                                    // 添加标签所在横线的的宽度数据供绘制任务名标签时
                                                    // 判断是否能需要截取为多行垂直显示
                                                    text.width =
                                                      Number(
                                                        v.link.option.length
                                                      ) *
                                                        xUnit -
                                                      NODE_RADIUS * 2;
                                                    if (scale === 2) {
                                                      text.width =
                                                        Number(
                                                          v.link.option.length
                                                        ) *
                                                          xUnit *
                                                          24 -
                                                        NODE_RADIUS * 2;
                                                    }
                                                    break;
                                                  }
                                                }
                                              }

                                              text_data.push(text);
                                            }
                                          }
                                        });
                                        // 创建一个拖拽对象
                                        let drag = d3
                                          .drag()
                                          .on("drag", this.dragmove)
                                          .on("start", () => {
                                            this.svgInstance.style(
                                              "cursor",
                                              "pointer"
                                            );
                                          })
                                          .on("end", () => {
                                            this.svgInstance.style(
                                              "cursor",
                                              "default"
                                            );
                                          });

                                        // 创建缩放对象
                                        let zoom = d3
                                          .zoom()
                                          .scaleExtent([0.5, 2])
                                          .on("zoom", this.zoomed);
                                        // .on("end", zoomended);

                                        // 创建svg画布对象 并挂载拖拽和缩放方法
                                        // if (this.svgInstance) {
                                        //   // 防止 杨勇的回调函数走两次 初始化2个svg实例
                                        //   let el = document.getElementById("svgContainer");
                                        //   var childs = el.childNodes;
                                        //   for (var i = childs.length - 1; i >= 0; i--) {
                                        //     el.removeChild(childs[i]);
                                        //   }
                                        //   // d3.select(this.svgInstance).remove();
                                        // }
                                        this.svgInstance = d3
                                          .select("#svgContainer")
                                          .append("svg")
                                          .attr("id", "svgBox")
                                          .style("position", "absolute")
                                          .style("top", "0px")
                                          .style("left", "0px")
                                          .attr("width", "100%")
                                          .attr("height", "100%")
                                          // .call(drag)  //去掉此处drag  不然有bug
                                          .call(zoom); //拖拽画布功能

                                        // 创建根组
                                        this.rootG = this.svgInstance
                                          .append("g")
                                          .attr("id", "root-group");

                                        // 绘制标尺
                                        const role_height = 40;
                                        const role_title_width = marginLeft - 5;
                                        let roleGroup = this.rootG
                                          .append("g")
                                          .attr("css", "role-group");
                                        let role_offset = 5;
                                        let role_dy = 30;
                                        let roleHeader = [
                                          {
                                            text: "年 - 月",
                                          },
                                          {
                                            text: "日",
                                          },
                                        ];
                                        // 添加标尺绘制小时 处理切换到小时标尺时 的标尺头 以及 单位长度和画布距离顶部偏移量
                                        if (scale === 2) {
                                          // 添加小时标尺行
                                          roleHeader.push({
                                            text: "时",
                                          });
                                          // 将绘图层整体下移
                                          marginTop = 180;
                                          xUnit = 25;
                                        } else {
                                          xUnit = 150;
                                          marginTop = 140;
                                        }
                                        roleHeader.forEach((v, k) => {
                                          let roleCell = roleGroup
                                            .append("g")
                                            .attr("css", "role-cell");
                                          roleCell
                                            .append("rect")
                                            .attr("x", function (d) {
                                              return role_offset;
                                            })
                                            .attr("y", function (d) {
                                              return (
                                                role_offset + role_height * k
                                              );
                                            })
                                            .attr("width", role_title_width)
                                            .attr("height", role_height)
                                            .attr("fill", "none")
                                            .attr("stroke", "#000")
                                            .attr("stroke-width", ".2px");
                                          roleCell
                                            .append("text")
                                            .text(v.text)
                                            .attr("class", "role-text")
                                            .attr("text-anchor", "middle") // 水平居中
                                            .attr("x", role_title_width / 2)
                                            .attr("y", function (d) {
                                              return role_height * k;
                                            })
                                            .attr("fill", ROLE_TEXT_COLOR)
                                            .style("font-weight", "800")
                                            .attr("dy", role_dy);
                                        });

                                        // console.log("START>>>>>>>>>>>>>>>>>>", START);
                                        // console.log("END>>>>>>>>>>>>>>>>>>", END);
                                        // 计算绘制标尺所需年月 日期数据
                                        this.dateData = getdiffdate(
                                          START.split(" ")[0],
                                          END.split(" ")[0]
                                        );
                                        console.log(
                                          "dateData>>>>>>>>>>>>>>>>>>",
                                          this.dateData
                                        );
                                        // 绘制标尺
                                        drawRole(
                                          roleGroup,
                                          this.dateData,
                                          marginLeft,
                                          xUnit,
                                          role_offset,
                                          role_height,
                                          role_dy,
                                          scale
                                        );
                                        /**
                                         * @Author: zhang fq
                                         * @Date: 2020-08-05
                                         * @Description: 重写穿点桥坐标算法和绘图方法 以及给穿点偏移量算法
                                         * 穿点偏移量要根据被穿线的方向来计算  被穿线为垂直方向  直接取被穿线的xOffset
                                         * 被穿线为水平 要循环找到穿点所在的那条垂直线 取这条线的xOffset
                                         * @Date: 2020-08-21
                                         * @Udate：修复直线和波浪线相交点上有交叉点时穿线桥绘制遗漏的bug
                                         */
                                        let xPoints = [];
                                        linkData.forEach((link, k) => {
                                          if (link.lines) {
                                            if (
                                              link.intersections &&
                                              link.intersections.length > 0
                                            ) {
                                              link.intersections.forEach(
                                                (li) => {
                                                  link.lines.forEach((ll) => {
                                                    // 判断方向 绘制过桥半圆
                                                    let direction = "";
                                                    switch (li.direction) {
                                                      case 1:
                                                      case 2:
                                                        direction = "top";
                                                        break;
                                                      case 3:
                                                      case 4:
                                                        direction = "right";
                                                        break;
                                                      default:
                                                        direction = "right";
                                                    }
                                                    let x = 0;
                                                    let y = 0;
                                                    // 找到穿点所在的线段  分情况
                                                    // 水平线只判断 start.x<location.x<end.x
                                                    // 垂直线只判断 start.y<location.y<end.y
                                                    if (
                                                      li.line.direction === 1
                                                    ) {
                                                      // 被穿线如果是水平的 那么穿线就是垂直的 只有垂直方向会有偏移量
                                                      // 所以穿点坐标只考虑 x加上穿线（垂直线）的x偏移量
                                                      if (
                                                        ll.start.y <=
                                                          li.location.y &&
                                                        li.location.y <=
                                                          ll.end.y
                                                      ) {
                                                        x =
                                                          (offsetX + xUnit) *
                                                            li.location.x +
                                                          ll.start.xOffset *
                                                            LINE_OFFSETX_UNIT +
                                                          marginLeft;
                                                        // 换算 切换到小时后 过桥半圆的坐标
                                                        if (scale === 2) {
                                                          let locationx = conversionCoordinates(
                                                            li.location.x
                                                          );
                                                          x =
                                                            (offsetX + xUnit) *
                                                              locationx.int *
                                                              24 +
                                                            (offsetX + xUnit) *
                                                              locationx.double +
                                                            ll.start.xOffset *
                                                              LINE_OFFSETX_UNIT +
                                                            marginLeft;
                                                        }
                                                        li.location.xOffset =
                                                          ll.start.xOffset; //将坐标的偏移量挂载到穿点坐标的xOffset属性上
                                                        y =
                                                          (offsetY + yUnit) *
                                                            li.location.y +
                                                          li.line.start
                                                            .yOffset *
                                                            LINE_OFFSETX_UNIT +
                                                          marginTop;
                                                      }
                                                    } else if (
                                                      li.line.direction === 2
                                                    ) {
                                                      // 被穿线如果是垂直   x 直接加上被穿线的x偏移量
                                                      if (
                                                        ll.start.x <=
                                                          li.location.x &&
                                                        li.location.x <=
                                                          ll.end.x
                                                      ) {
                                                        x =
                                                          (offsetX + xUnit) *
                                                            li.location.x +
                                                          li.line.start
                                                            .xOffset *
                                                            LINE_OFFSETX_UNIT +
                                                          marginLeft;
                                                        if (scale === 2) {
                                                          let locationx = conversionCoordinates(
                                                            li.location.x
                                                          );
                                                          x =
                                                            (offsetX + xUnit) *
                                                              locationx.int *
                                                              24 +
                                                            (offsetX + xUnit) *
                                                              locationx.double +
                                                            li.line.start
                                                              .xOffset *
                                                              LINE_OFFSETX_UNIT +
                                                            marginLeft;
                                                        }
                                                        li.location.xOffset =
                                                          li.line.start.xOffset; //将坐标的偏移量挂载到穿点坐标的xOffset属性上
                                                        y =
                                                          (offsetY + yUnit) *
                                                            li.location.y +
                                                          ll.start.yOffset *
                                                            LINE_OFFSETX_UNIT +
                                                          marginTop;
                                                      }
                                                    }

                                                    if (x === 0 && y === 0)
                                                      return; //x=0 y=0 即没有找到穿点所在线段 不用绘制 修复部分半圆桥会绘制的原点的bug
                                                    this.rootG
                                                      .append("path")
                                                      .attr("d", function () {
                                                        return drawBridgeArc(
                                                          x,
                                                          y,
                                                          BRIDGE_R,
                                                          direction
                                                        );
                                                      })
                                                      .attr("stroke", function (
                                                        d
                                                      ) {
                                                        if (li.critical)
                                                          return "red";
                                                        if (li.line.shape === 3)
                                                          return LINE_WAVE_COLOR;
                                                        return li.dummy
                                                          ? LINE_DASHED_COLOR
                                                          : LINE_DEFAULT_COLOR;
                                                      })
                                                      .attr(
                                                        "stroke-dasharray",
                                                        function (d) {
                                                          return li.dummy
                                                            ? STROKE_DASHARRAY
                                                            : "0,0";
                                                        }
                                                      )
                                                      .attr("fill", "none");
                                                  });
                                                  xPoints.push(li);
                                                  // 修复穿线桥绘制遗漏bug 将穿点信息里 被穿线相同的点整合到一起
                                                  // 穿点归并算法 将穿点所在被穿线相同的点归并到一起
                                                  let flag = intersection.find(
                                                    (ai) => {
                                                      return (
                                                        ai.line.start.x ===
                                                          li.line.start.x &&
                                                        ai.line.start.y ===
                                                          li.line.start.y &&
                                                        ai.line.end.x ===
                                                          li.line.end.x &&
                                                        ai.line.end.y ===
                                                          li.line.end.y
                                                      );
                                                    }
                                                  );
                                                  if (flag) {
                                                    flag.xPoints.push(
                                                      li.location
                                                    );
                                                    // delete flag.location;
                                                  } else {
                                                    li.xPoints = [li.location];
                                                    // delete li.location;
                                                    intersection.push(li);
                                                  }
                                                }
                                              );
                                            }
                                          }
                                        });
                                        console.log(
                                          "intersection>>>>",
                                          intersection
                                        );
                                        console.log("xPoints>>>>", xPoints);

                                        /**
                                         * @Author: zhang fq
                                         * @Date: 2020-07-16
                                         * @Description:优化边组的绘制 处理穿点数据 通过判断被穿线的方向 线型 是否关键路径 等相关参数
                                         *  将被穿线截成两段 将搭接桥插入其中 判断是否有箭头 将箭头放置在对应的截取的线段的对应的一边
                                         * @Date: 2020-08-05
                                         * @Udate：根据计算了偏移量的线段和穿点坐标，重写截断插入搭接桥后的线段的起止点坐标算法
                                         * @Date: 2020-08-17
                                         * @Udate：优化有穿线点的线段截断算法 补充多个穿线点多次截断拼接 30%
                                         * @Date: 2020-08-18
                                         * @Udate：优化有穿线点的线段截断算法 补充多个穿线点多次截断拼接 100%
                                         * @Date: 2020-08-20
                                         * @Udate：修复波浪线上有交叉点时 线段截取算法有误的bug
                                         */
                                        linkData.forEach((link) => {
                                          if (link.lines) {
                                            let finalLines = []; //  存放本次循环连接上处理完成后的最终线段数组
                                            link.lines.forEach(
                                              (line, index) => {
                                                let flag = intersection.find(
                                                  (item) => {
                                                    return (
                                                      line.start.x ===
                                                        item.line.start.x &&
                                                      line.start.y ===
                                                        item.line.start.y &&
                                                      line.end.x ===
                                                        item.line.end.x &&
                                                      line.end.y ===
                                                        item.line.end.y
                                                    );
                                                  }
                                                );
                                                if (flag) {
                                                  // 如果本次循环的线段上有交叉点 进行处理
                                                  // 处理当前lines里的找到的这条被穿线 将其截断为n+1条 n为交叉点数目
                                                  let newLines = []; // 存储被穿线被截断n此后最终的所有线段
                                                  // 循环处理该被穿线上的每一个交叉点 截取
                                                  flag.xPoints.forEach(
                                                    (xpoint, xindex) => {
                                                      // 如果是第一次截取 直接截取
                                                      if (xindex === 0) {
                                                        newLines.push(
                                                          ...lineSplit(
                                                            line,
                                                            xpoint,
                                                            scale
                                                          )
                                                        ); // 将第一次截断的线段存入到线段数组中
                                                      } else {
                                                        // let lindex=0
                                                        // 如果不是第一次截取  要先判断当前交叉点在已经被截断的哪一段上 继续截取
                                                        for (
                                                          let i = 0;
                                                          i < newLines.length;
                                                          i++
                                                        ) {
                                                          // 找到当前循环到的交叉点所在的被截断后的那条线段  继续截
                                                          if (
                                                            onTheLine(
                                                              newLines[i].start,
                                                              newLines[i].end,
                                                              xpoint
                                                            )
                                                          ) {
                                                            // 删除原来的线段 插入截取后的线段
                                                            newLines.splice(
                                                              i,
                                                              1,
                                                              ...lineSplit(
                                                                newLines[i],
                                                                xpoint,
                                                                scale
                                                              )
                                                            );
                                                            break; // 找到后处理完就跳出循环
                                                          }
                                                        }
                                                      }
                                                    }
                                                  );
                                                  finalLines.push(...newLines); // 将该条被穿线上的所有交叉点截断处理完后的线段存入最终线段数组
                                                } else {
                                                  // 如果本次循环的线段上没有交叉点 直接存入最终数组
                                                  finalLines.push(line);
                                                }
                                              }
                                            );
                                            link.lines = finalLines;
                                          }
                                        });
                                        //循环处理完的linkData（边）数据 绘制边 挂载到根组
                                        /**
                                         * @Author: zhang fq
                                         * @Date: 2020-09-25
                                         * @Description: 添加挂起工作，搭接工作等类型的判断  暂定画虚线
                                         */
                                        linkData.forEach((v) => {
                                          if (v.lines) {
                                            v.lines.forEach((vl, k) => {
                                              switch (vl.shape) {
                                                case 1:
                                                  // 画实线
                                                  drawDefaultLine(
                                                    v,
                                                    vl,
                                                    this.rootG,
                                                    LINE_DEFAULT_COLOR,
                                                    LINE_WIDTH,
                                                    offsetX,
                                                    offsetY,
                                                    xUnit,
                                                    yUnit,
                                                    marginLeft,
                                                    marginTop,
                                                    scale
                                                  );
                                                  break;
                                                case 2:
                                                  // 画虚线
                                                  drawDashedLine(
                                                    v,
                                                    vl,
                                                    this.rootG,
                                                    LINE_DASHED_COLOR,
                                                    STROKE_DASHARRAY,
                                                    LINE_WIDTH,
                                                    offsetX,
                                                    offsetY,
                                                    xUnit,
                                                    yUnit,
                                                    marginLeft,
                                                    marginTop,
                                                    scale
                                                  );
                                                  break;
                                                case 3:
                                                  // 画波浪线
                                                  drawWaveLine(
                                                    v,
                                                    vl,
                                                    this.rootG,
                                                    LINE_WAVE_COLOR,
                                                    LINE_WIDTH,
                                                    offsetX,
                                                    offsetY,
                                                    xUnit,
                                                    yUnit,
                                                    marginLeft,
                                                    marginTop,
                                                    scale
                                                  );
                                                  break;
                                                case 4: //挂起
                                                case 5: //避免重复
                                                case 6: //延时
                                                  // 画虚线
                                                  drawDashedLine(
                                                    v,
                                                    vl,
                                                    this.rootG,
                                                    LINE_DASHED_COLOR,
                                                    STROKE_DASHARRAY,
                                                    LINE_WIDTH,
                                                    offsetX,
                                                    offsetY,
                                                    xUnit,
                                                    yUnit,
                                                    marginLeft,
                                                    marginTop,
                                                    scale
                                                  );
                                                  break;
                                                case 7: //搭接
                                                  // 画虚线
                                                  drawDashedLine(
                                                    v,
                                                    vl,
                                                    this.rootG,
                                                    LINE_RELATION_DASHED_COLOR,
                                                    STROKE_RELATION_DASHARRAY,
                                                    LINE_WIDTH,
                                                    offsetX,
                                                    offsetY,
                                                    xUnit,
                                                    yUnit,
                                                    marginLeft,
                                                    marginTop,
                                                    scale
                                                  );
                                                  break;
                                                default:
                                                  drawDefaultLine(
                                                    v,
                                                    vl,
                                                    this.rootG,
                                                    LINE_DEFAULT_COLOR,
                                                    LINE_WIDTH,
                                                    offsetX,
                                                    offsetY,
                                                    xUnit,
                                                    yUnit,
                                                    marginLeft,
                                                    marginTop,
                                                    scale
                                                  );
                                              }
                                            });
                                          }
                                        });
                                        // 调用节点绘制方法 绘制节点
                                        drawNode(
                                          node_data,
                                          last_node,
                                          this.rootG,
                                          NODE_RADIUS,
                                          offsetX,
                                          offsetY,
                                          xUnit,
                                          yUnit,
                                          marginLeft,
                                          marginTop,
                                          scale
                                        );
                                        // 调用绘制任务标签方法  绘制任务标签和工期
                                        drawText(
                                          text_data,
                                          this.rootG,
                                          LABEL_OFFSET_HEIGHT,
                                          LABEL_FONT_SIZE,
                                          LABEL_FONT_COLOR,
                                          DURATION_OFFSET_HEIGHT,
                                          DURATION_FONT_SIZE,
                                          DURATION_FONT_COLOR,
                                          offsetX,
                                          offsetY,
                                          xUnit,
                                          yUnit,
                                          marginLeft,
                                          marginTop,
                                          scale
                                        );
                                        // let aoan = new ActivityOnArrowNetwork(ganttData[option], this.aoanOption);
                                        // aoan.layoutPlan((nodeCoordinate, edges, option) => {

                                        // });
                                      },
                                    },
                                  }).$mount($("#netPicApp", model.dom).get(0));
                                });
                              }
                            );
                          }
                        );
                      }
                    );
                  });
                });
              });
            });
          });
        });
      });
    });
  };
  // ----------------------------------------------------------------------------------
  // 封装绘制实线方法
  function drawDefaultLine(
    obj,
    item,
    rootGroup,
    lineDefaultColor,
    lineWidth,
    offsetX,
    offsetY,
    xUnit,
    yUnit,
    marginLeft,
    marginTop,
    scale = 1
  ) {
    // console.log("------------画实线", obj, item);
    let dataline = [
      {
        x1:
          (offsetX + xUnit) * item.start.x +
          item.start.xOffset * LINE_OFFSETX_UNIT +
          marginLeft,
        y1: (offsetY + yUnit) * item.start.y + marginTop,
        x2:
          (offsetX + xUnit) * item.end.x +
          item.end.xOffset * LINE_OFFSETX_UNIT +
          marginLeft,
        y2: (offsetY + yUnit) * item.end.y + marginTop,
      },
    ];
    if (scale === 2) {
      let startx = conversionCoordinates(item.start.x);
      let endx = conversionCoordinates(item.end.x);
      dataline[0].x1 =
        (offsetX + xUnit) * startx.int * 24 +
        (offsetX + xUnit) * startx.double +
        item.start.xOffset * LINE_OFFSETX_UNIT +
        marginLeft;
      dataline[0].x2 =
        (offsetX + xUnit) * endx.int * 24 +
        (offsetX + xUnit) * endx.double +
        item.end.xOffset * LINE_OFFSETX_UNIT +
        marginLeft;
    }
    let lineGroup = rootGroup.append("g").attr("class", "line-group");
    lineGroup
      .append("line")
      .data(dataline)
      .attr("x1", function (d) {
        return d.x1;
      })
      .attr("y1", function (d) {
        return d.y1;
      })
      .attr("x2", function (d) {
        return d.x2;
      })
      .attr("y2", function (d) {
        return d.y2;
      })
      .attr("stroke", function (d) {
        // 关键路径 标红
        return item.critical ? "red" : lineDefaultColor;
      })
      .attr("stroke-width", lineWidth);
    // 调用画箭头函数  绘制箭头
    drawArrow(dataline, lineGroup, item);
  }
  // ----------------------------------------------------------------------------------------------
  // 封装绘制虚线方法
  function drawDashedLine(
    obj,
    item,
    rootGroup,
    lineDashedColor,
    storkeDasharray,
    lineWidth,
    offsetX,
    offsetY,
    xUnit,
    yUnit,
    marginLeft,
    marginTop,
    scale = 1
  ) {
    // console.log("------------话虚线");
    let dataline = [
      {
        x1:
          (offsetX + xUnit) * item.start.x +
          item.start.xOffset * LINE_OFFSETX_UNIT +
          marginLeft,
        y1: (offsetY + yUnit) * item.start.y + marginTop,
        x2:
          (offsetX + xUnit) * item.end.x +
          item.end.xOffset * LINE_OFFSETX_UNIT +
          marginLeft,
        y2: (offsetY + yUnit) * item.end.y + marginTop,
      },
    ];
    if (scale === 2) {
      let startx = conversionCoordinates(item.start.x);
      let endx = conversionCoordinates(item.end.x);
      dataline[0].x1 =
        (offsetX + xUnit) * startx.int * 24 +
        (offsetX + xUnit) * startx.double +
        item.start.xOffset * LINE_OFFSETX_UNIT +
        marginLeft;
      dataline[0].x2 =
        (offsetX + xUnit) * endx.int * 24 +
        (offsetX + xUnit) * endx.double +
        item.end.xOffset * LINE_OFFSETX_UNIT +
        marginLeft;
    }
    let lineGroup = rootGroup.append("g").attr("class", "line-group");
    lineGroup
      .append("line")
      .data(dataline)
      .attr("x1", function (d) {
        return d.x1;
      })
      .attr("y1", function (d) {
        return d.y1;
      })
      .attr("x2", function (d) {
        return d.x2;
      })
      .attr("y2", function (d) {
        return d.y2;
      })
      .attr("stroke", function (d) {
        // 关键路径 标红
        return item.critical ? "red" : lineDashedColor;
      })
      .attr("stroke-dasharray", storkeDasharray)
      .attr("stroke-width", lineWidth);
    // 调用画箭头函数  绘制箭头
    drawArrow(dataline, lineGroup, item);
  }
  // ----------------------------------------------------------------------------------------------
  // 封装绘制波浪线方法 优化波浪线起始末尾连接点
  function drawWaveLine(
    obj,
    item,
    roogGroup,
    lineWaveColor,
    lineWidth,
    offsetX,
    offsetY,
    xUnit,
    yUnit,
    marginLeft,
    marginTop,
    scale = 1
  ) {
    let dataline = [
      {
        x1:
          (offsetX + xUnit) * item.start.x +
          item.start.xOffset * LINE_OFFSETX_UNIT +
          marginLeft,
        y1: (offsetY + yUnit) * item.start.y + marginTop,
        x2:
          (offsetX + xUnit) * item.end.x +
          item.end.xOffset * LINE_OFFSETX_UNIT +
          marginLeft,
        y2: (offsetY + yUnit) * item.end.y + marginTop,
      },
    ];
    if (scale === 2) {
      let startx = conversionCoordinates(item.start.x);
      let endx = conversionCoordinates(item.end.x);
      dataline[0].x1 =
        (offsetX + xUnit) * startx.int * 24 +
        (offsetX + xUnit) * startx.double +
        item.start.xOffset * LINE_OFFSETX_UNIT +
        marginLeft;
      dataline[0].x2 =
        (offsetX + xUnit) * endx.int * 24 +
        (offsetX + xUnit) * endx.double +
        item.end.xOffset * LINE_OFFSETX_UNIT +
        marginLeft;
    }
    // 优化波浪线上有剪头时的算法  修复波浪线结尾对不上箭头的bug
    if (item.arrow === 4) {
      // 向右时 end.x减去节点圆圈半径和箭头箭身宽度四分之一
      dataline[0].x2 = dataline[0].x2 - NODE_RADIUS - ARROW_LENGTH / 4;
    }
    if (item.arrow === 3) {
      // 向左时 start.x加上节点圆圈半径和箭头箭身宽度四分之一
      dataline[0].x1 = dataline[0].x1 + ARROW_LENGTH + NODE_RADIUS / 4;
    }
    let pointStart = { x: dataline[0].x1, y: dataline[0].y1 };
    let pointEnd = { x: dataline[0].x2, y: dataline[0].y2 };
    let points = [];
    points.push(pointStart); // 连接波浪线的起点
    // 计算波浪正反摆动幅度
    // 横向 y坐标 上下摆动
    let waveTimes = (dataline[0].x2 - dataline[0].x1) / 6; //计算要折的次数
    for (let i = 0; i <= waveTimes; i++) {
      if (i === 0) continue;
      if (i % 2 === 1) {
        points.push({
          x: dataline[0].x1 + 6 * i,
          y: dataline[0].y1 - 3,
        });
      } else {
        points.push({
          x: dataline[0].x1 + 6 * i,
          y: dataline[0].y1 + 3,
        });
      }
    }
    points.push(pointEnd); // 连接波浪线的末尾
    let linePath = d3
      .line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });
    // 绘制波浪线
    let lineGroup = roogGroup.append("g").attr("class", "line-group");
    lineGroup
      .append("path")
      .attr("d", linePath(points)) //使用了线段生成器
      .attr("stroke", lineWaveColor) //线的颜色
      .attr("stroke-width", lineWidth)
      .attr("fill", "none");
    // 调用画箭头函数  绘制箭头
    drawArrow(dataline, lineGroup, item);
  }
  // ----------------------------------------------------------------------------------------------
  // 绘制箭头调用函数
  function drawArrow(dataline, lineGroup, item) {
    let point = {
      x: 0,
      y: 0,
    };
    let lines = [];
    //  处理箭头数据 根据箭头箭头指向 计算从该条边的哪个点画箭头
    switch (item.arrow) {
      case 0: // 无箭头
        break;
      case 1: // 向上
        point.x = dataline[0].x1;
        point.y = dataline[0].y1;
        lines = handleArrowData(point, item.arrow);
        break;
      case 2: // 向下
        point.x = dataline[0].x2;
        point.y = dataline[0].y2;
        lines = handleArrowData(point, item.arrow);
        break;
      case 3: // 向左
        point.x = dataline[0].x1;
        // 优化波浪线上有剪头时的算法  修复波浪线结尾对不上箭头的bug
        if (item.shape === 3) {
          point.x = dataline[0].x1 - NODE_RADIUS - ARROW_LENGTH / 4;
        }
        point.y = dataline[0].y1;
        lines = handleArrowData(point, item.arrow);
        break;
      case 4: // 向右
        point.x = dataline[0].x2;
        // 优化波浪线上有剪头时的算法  修复波浪线结尾对不上箭头的bug
        if (item.shape === 3) {
          point.x = dataline[0].x2 + NODE_RADIUS + ARROW_LENGTH / 4;
        }
        point.y = dataline[0].y2;
        lines = handleArrowData(point, item.arrow);
        break;
      default:
        break;
    }
    // 定义线段对象
    let linePath = d3
      .line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });
    // 将箭头挂载到 线段组
    /**
     * @Author: zhang fq
     * @Date: 2020-07-15
     * @Description: 优化箭头和线的颜色对应
     */
    lineGroup
      .append("path")
      .attr("d", linePath(lines)) //使用了线段生成器
      .attr("stroke", function (d) {
        if (item.critical) return "red";
        switch (item.shape) {
          case 1:
            return LINE_DEFAULT_COLOR;
          case 2:
            return LINE_DASHED_COLOR;
          case 3:
            return LINE_WAVE_COLOR;
          default:
            return LINE_DEFAULT_COLOR;
        }
      }) //线的颜色
      .attr("stroke-width", "1px")
      .attr("fill", function (d) {
        if (item.critical) return "red";
        switch (item.shape) {
          case 1:
            return LINE_DEFAULT_COLOR;
          case 2:
            return LINE_DASHED_COLOR;
          case 3:
            return LINE_WAVE_COLOR;
          default:
            return LINE_DEFAULT_COLOR;
        }
      });
  }
  // ----------------------------------------------------------------------------------------------
  // 处理箭头数据  判断箭头指向  判断是否关键路径上的箭头 计算坐标 计算绘制路径
  function handleArrowData(point, direction) {
    let line = [];
    let startx = 0;
    let starty = 0;
    let endx = 0;
    let endy = 0;
    let topx = 0;
    let topy = 0;
    let bottomx = 0;
    let bottomy = 0;
    // 根据不同的箭头朝向  计算出path路径点坐标
    switch (direction) {
      case 1: // 计算向上箭头的 path点坐标
        startx = point.x;
        starty = point.y + ARROW_LENGTH;
        endx = point.x;
        endy = point.y + NODE_RADIUS;
        topx = startx - ARROW_WING_WIDTH;
        topy = starty + ARROW_TAIL_OFFSET;
        bottomx = startx + ARROW_WING_WIDTH;
        bottomy = starty + ARROW_TAIL_OFFSET;
        break;
      case 2: // 计算向下箭头的 path点坐标
        startx = point.x;
        starty = point.y - ARROW_LENGTH;
        endx = point.x;
        endy = point.y - NODE_RADIUS;
        topx = startx - ARROW_WING_WIDTH;
        topy = starty - ARROW_TAIL_OFFSET;
        bottomx = startx + ARROW_WING_WIDTH;
        bottomy = starty - ARROW_TAIL_OFFSET;
        break;
      case 3: // 计算向左箭头的 path点坐标
        startx = point.x + NODE_RADIUS;
        starty = point.y;
        endx = point.x + ARROW_LENGTH;
        endy = point.y;
        topx = endx + ARROW_TAIL_OFFSET;
        topy = starty - ARROW_WING_WIDTH;
        bottomx = endx + ARROW_TAIL_OFFSET;
        bottomy = starty + ARROW_WING_WIDTH;
        break;
      case 4: // 计算向右箭头的 path点坐标
        startx = point.x - ARROW_LENGTH;
        starty = point.y;
        endx = point.x - NODE_RADIUS;
        endy = point.y;
        topx = startx - ARROW_TAIL_OFFSET;
        topy = starty - ARROW_WING_WIDTH;
        bottomx = startx - ARROW_TAIL_OFFSET;
        bottomy = starty + ARROW_WING_WIDTH;
        break;
      default:
        break;
    }
    // 填充path坐标
    line.push({ x: startx, y: starty });
    line.push({ x: topx, y: topy });
    line.push({ x: endx, y: endy });
    line.push({ x: bottomx, y: bottomy });
    line.push({ x: startx, y: starty });

    return line;
  }
  // ----------------------------------------------------------------------------------------------
  // 封装绘制节点方法
  function drawNode(
    nodes,
    lastNode,
    rootGroup,
    nodeRaduis,
    offsetX,
    offsetY,
    xUnit,
    yUnit,
    marginLeft,
    marginTop,
    scale = 1
  ) {
    if (nodes) {
      for (let key in nodes) {
        // console.log(key);
        let item = nodes[key];
        // 根组 添加 node组
        let nodegroup = rootGroup.append("g").attr("class", "node-group");
        // node组添加圆
        nodegroup
          .append("circle")
          .style("stroke", function (d) {
            return item.critical ? "red" : "blue";
          })
          .style("fill", "#fff")
          .attr("r", nodeRaduis)
          .attr("cx", function (d, i) {
            if (scale === 2) {
              let x = conversionCoordinates(item.x);
              return (
                (offsetX + xUnit) * x.int * 24 +
                (offsetX + xUnit) * x.double +
                marginLeft
              );
            } else {
              return (offsetX + xUnit) * item.x + marginLeft;
            }
          })
          .attr("cy", function (d, i) {
            return (offsetY + yUnit) * item.y + marginTop;
          });
        //   node组添加圆内文字
        nodegroup
          .append("text")
          .text(function (d) {
            return key === "LAST" ? lastNode : key;
          })
          .attr("class", "node-text")
          .style("fill", function (d) {
            // return item.critical ? "red" : "#333";
            return "#333";
          })
          .attr("text-anchor", "middle") // 水平居中
          .attr("x", function (d, i) {
            if (scale === 2) {
              let x = conversionCoordinates(item.x);
              return (
                (offsetX + xUnit) * x.int * 24 +
                (offsetX + xUnit) * x.double +
                marginLeft
              );
            } else {
              return (offsetX + xUnit) * item.x + marginLeft;
            }
          })
          .attr("y", function (d, i) {
            return (offsetY + yUnit) * item.y + marginTop;
          })
          .attr("transform", function () {
            return "translate(0 ,6)"; // 垂直居中
          });
        if (key == lastNode) {
          // 绘制结束标识
          let last = nodes[key];
          let x = (offsetX + xUnit) * last.x + marginLeft + nodeRaduis;
          // 添加切换到小时后  结束标识坐标重算
          if (scale === 2) {
            let p = conversionCoordinates(last.x);
            x =
              (offsetX + xUnit) * p.int * 24 +
              (offsetX + xUnit) * p.double +
              marginLeft +
              nodeRaduis;
          }
          let y = (offsetY + yUnit) * last.y + marginTop;
          let linePath = d3
            .line()
            .x(function (d) {
              return d.x;
            })
            .y(function (d) {
              return d.y;
            });
          // 绘制结束旗帜
          let flagGroup = rootGroup.append("g").attr("class", "flag-group");
          flagGroup
            .append("path")
            .attr("d", linePath(drawEndFlag(x, y, NODE_RADIUS))) //使用了线段生成器
            .attr("stroke", "#333") //线的颜色
            .attr("stroke-width", "1px")
            .attr("fill", "red");
        }
      }
    }
  }
  // ----------------------------------------------------------------------------------------------
  // 封装标尺绘制方法
  function drawRole(
    roleGroup,
    dateData,
    marginLeft,
    xUnit,
    role_offset,
    role_height,
    role_dy,
    scale = 1
  ) {
    let days = [];
    let monthData = [];
    for (let key in dateData) {
      days = days.concat(dateData[key]);
      monthData.push({
        text: key,
        days: dateData[key],
      });
    }
    // console.log("monthData>>>>>>>>>>>>>>>>>>", monthData);
    monthData.forEach((v, k) => {
      /**
       * @Author: zhang fq
       * @Date: 2020-07-13
       * @Description: 根据年月数据 绘制年月标尺表格及label
       */
      let yearGroup = roleGroup.append("g").attr("css", "year-group");
      yearGroup
        .append("rect")
        .attr("x", function (d) {
          // 计算当前月方框的绘制起始位置 x
          if (k === 0) {
            // 当前月为要绘制的第一个月时  直接取0
            return marginLeft;
          } else {
            // 如果当前月不是要绘制的第一个月 要获取以前每个月的宽度（即以前每个月的天数乘以单位长度）
            let d = 0;
            for (let i = 0; i < k; i++) {
              d += monthData[i].days.length;
            }
            if (scale === 2) {
              return marginLeft + d * xUnit * 24;
            } else {
              return marginLeft + d * xUnit;
            }
          }
        })
        .attr("y", function (d) {
          return role_offset;
        })
        .attr("width", function (d) {
          if (scale === 2) {
            return v.days.length * xUnit * 24;
          } else {
            //每个月方框宽度 直接取当前月的每一天乘以单位长
            return v.days.length * xUnit;
          }
        })
        .attr("height", role_height)
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", ".2px");
      yearGroup
        .append("text")
        .text(v.text)
        .attr("class", "year-text")
        .attr("text-anchor", "middle") // 水平居中
        .attr("x", function (d) {
          // return marginLeft + (v.days.length * xUnit) / 2;
          if (k === 0) {
            // text位置 当年月取第一个时 直接取当前月的每一天乘以单位长度除以2
            if (scale === 2) {
              return marginLeft + (v.days.length * xUnit * 24) / 2;
            } else {
              return marginLeft + (v.days.length * xUnit) / 2;
            }
          } else {
            // text位置 当年月不是第一个时 取前面几个月的长度的总和加上当前月的天乘以单位长度除以2
            let d = 0;
            for (let i = 0; i < k; i++) {
              d += monthData[i].days.length;
            }
            if (scale === 2) {
              return (
                marginLeft + d * xUnit * 24 + (v.days.length * xUnit * 24) / 2
              );
            } else {
              return marginLeft + d * xUnit + (v.days.length * xUnit) / 2;
            }
          }
        })
        .attr("y", function (d) {
          return 0;
        })
        .attr("fill", ROLE_TEXT_COLOR)
        .style("font-weight", "800")
        .attr("dy", role_dy);
    });
    //绘制日期
    days.forEach((v, k) => {
      let dayGroup = roleGroup.append("g").attr("css", "day-group");
      dayGroup
        .append("rect")
        .attr("x", function (d) {
          if (scale === 2) {
            return marginLeft + k * xUnit * 24;
          } else {
            return marginLeft + k * xUnit;
          }
        })
        .attr("y", function (d) {
          return role_offset + role_height;
        })
        .attr("width", function (d, i) {
          if (scale === 2) {
            return xUnit * 24;
          } else {
            return xUnit;
          }
        })
        .attr("height", role_height)
        .attr("fill", "none")
        .attr("stroke", "#333")
        .attr("stroke-width", ".2");
      dayGroup
        .append("text")
        .text(v)
        .attr("class", "year-text")
        .attr("text-anchor", "middle") // 水平居中
        .attr("x", function (d) {
          if (scale === 2) {
            return marginLeft + k * xUnit * 24 + (xUnit * 24) / 2;
          } else {
            return marginLeft + k * xUnit;
          }
        })
        .attr("y", role_height)
        .attr("fill", ROLE_TEXT_COLOR)
        .style("font-weight", "800")
        .attr("dy", role_dy)
        .attr("dx", xUnit / 2);
      // 如果切换到小时 在循环绘制天时 添加绘制小时标尺方法
      if (scale === 2) {
        for (let i = 0; i < 24; i++) {
          let hourGroup = roleGroup.append("g").attr("css", "hour-group");
          hourGroup
            .append("rect")
            .attr("x", function (d) {
              return marginLeft + k * xUnit * 24 + i * xUnit;
            })
            .attr("y", function (d) {
              return role_offset + role_height * 2;
            })
            .attr("width", xUnit)
            .attr("height", role_height)
            .attr("fill", "none")
            .attr("stroke", "#333")
            .attr("stroke-width", ".2");
          hourGroup
            .append("text")
            .text(i)
            .attr("class", "year-text")
            .attr("text-anchor", "middle") // 水平居中
            .attr("x", function (d) {
              return marginLeft + k * xUnit * 24 + i * xUnit;
            })
            .attr("y", role_height * 2)
            .attr("fill", ROLE_TEXT_COLOR)
            .style("font-weight", "800")
            .attr("dy", role_dy)
            .attr("dx", xUnit / 2);
        }
      }
    });
  }
  // ----------------------------------------------------------------------------------------------
  // 循环标签数据 创建标签节点 挂载到根组
  function drawText(
    textData,
    rootGroup,
    labelOffsetHeight,
    labelFontSize,
    labelFontColor,
    durationOffsetHeight,
    durationFontSize,
    durationFontColor,
    offsetX,
    offsetY,
    xUnit,
    yUnit,
    marginLeft,
    marginTop,
    scale = 1
  ) {
    textData.forEach((v) => {
      let textgroup = rootGroup.append("g").attr("class", "text-group");
      // 绘制label任务名
      let posX = offsetX + xUnit * v.x + marginLeft;
      let posY = (offsetY + yUnit) * v.y + marginTop;
      if (scale === 2) {
        let x = conversionCoordinates(v.x);
        posX = offsetX + xUnit * x.int * 24 + xUnit * x.double + marginLeft;
      }
      // 调用任务名标签 根据任务长度自动截取算法 添加任务名标签
      appendMultiText(
        textgroup,
        v.label,
        posX,
        posY,
        v.width,
        labelOffsetHeight,
        labelFontColor,
        labelFontSize,
        14
      );
      // 绘制工期
      textgroup
        .append("text")
        .text(function (d) {
          return v.duration === 0 ? "" : v.duration;
        })
        .attr("class", "duration-text")
        .attr("text-anchor", "middle") // 水平居中
        .attr("x", function (d, i) {
          if (scale === 2) {
            let x = conversionCoordinates(v.x);
            return offsetX + xUnit * x.int * 24 + xUnit * x.double + marginLeft;
          } else {
            return (
              // (offsetX + xUnit) * (v.x1 + (v.x2 - v.x1) / 2) + marginLeft
              offsetX + xUnit * v.x + marginLeft
            );
          }
        })
        .attr("font-size", durationFontSize)
        .attr("fill", durationFontColor)
        .attr("y", function (d, i) {
          return (offsetY + yUnit) * v.y + marginTop;
        })
        .attr("dy", durationOffsetHeight);
      // if (v.ifRotate) {
      //   // g.attr("transform-origin", "50% 50%");
      //   textgroup
      //     // .attr("transform-origin", "50% 50%")

      //     .attr("transform", function (d, i) {
      //       return "translate(" + d.x + "," + d.y + ")rotate(90)";
      //     });
      // }
    });
  }
  // 根据终点坐标和节点圆半径 计算绘制终点旗帜路径点
  function drawEndFlag(x, y, r) {
    let points = [];
    points.push({
      x: x,
      y: y,
    });
    points.push({
      x: x + r,
      y: y - r * 2,
    });
    points.push({
      x: x,
      y: y - r * 2,
    });
    points.push({
      x: x - r / 2,
      y: y - r,
    });
    points.push({
      x: x + r / 2,
      y: y - r,
    });
    return points;
  }
  // ----------------------------------------------------------------------------------------------
  // 封装绘制上、下、左、右四种类型的半圆桥的方法
  function drawBridgeArc(x, y, bridgeRadius, bridgeDirection) {
    let angle = RIGHT_SEMISCIRCLE;
    switch (bridgeDirection) {
      case "top":
        angle = UP_SEMISCIRCLE;
        break;
      case "bottom":
        angle = DOWN_SEMISCIRCLE;
        break;
      case "left":
        angle = LEFT_SEMISCIRCLE;
        break;
      case "right":
        angle = RIGHT_SEMISCIRCLE;
        break;
      default:
        break;
    }
    var path = d3.path();
    // 使用path对象的arc方法构造一个半弧形path数据集 dataset
    path.arc(x, y, bridgeRadius, angle[0], angle[1]);
    return path;
  }
  // ----------------------------------------------------------------------------------------------
  // 封装获取两个日期之间 的年月 以及当前月从开始日期包含的日期数据
  // ----------------------------------------------------------------------------------------------
  function getdiffdate(stime, etime) {
    //初始化日期列表，数组
    var diffTime = {};
    var diffdate = new Array();
    var i = 0;
    //开始日期小于等于结束日期,并循环
    while (stime <= etime) {
      let temp = stime.split("-");
      diffdate[i] = temp[temp.length - 1];
      if (diffTime[temp[0] + "-" + temp[1]]) {
        diffTime[temp[0] + "-" + temp[1]].push(diffdate[i]);
      } else {
        diffTime[temp[0] + "-" + temp[1]] = [];
        diffTime[temp[0] + "-" + temp[1]].push(diffdate[i]);
      }

      //获取开始日期时间戳
      var stime_ts = new Date(stime).getTime();
      // console.log("当前日期：" + stime + "当前时间戳：" + stime_ts);

      //增加一天时间戳后的日期
      var next_date = stime_ts + 24 * 60 * 60 * 1000;

      //拼接年月日，这里的月份会返回（0-11），所以要+1
      var next_dates_y = new Date(next_date).getFullYear() + "-";
      var next_dates_m =
        new Date(next_date).getMonth() + 1 < 10
          ? "0" + (new Date(next_date).getMonth() + 1) + "-"
          : new Date(next_date).getMonth() + 1 + "-";
      var next_dates_d =
        new Date(next_date).getDate() < 10
          ? "0" + new Date(next_date).getDate()
          : new Date(next_date).getDate();

      stime = next_dates_y + next_dates_m + next_dates_d;

      //增加数组key
      i++;
    }
    // console.log(diffdate);
    return diffTime;
  }
  // ----------------------------------------------------------------------------------------------
  // 封装获取所有绘制内容的根组的宽高方法
  function getGroupWH(domId) {
    let el = document.getElementById(domId).getBBox();
    let wh = {
      width: "100%",
      height: "100%",
    };
    if (el) {
      wh.width = el.width;
      wh.height = el.height;
      return wh;
    } else {
      null;
    }
  }
  // ----------------------------------------------------------------------------------------------
  // 封装 判断交叉点所在线段方法
  function onTheLine(
    start = { x: 0, y: 0 },
    end = { x: 0, y: 0 },
    point = { x: 0, y: 0 }
  ) {
    if (
      point.x >= start.x &&
      point.x <= end.x &&
      point.y >= start.y &&
      point.y <= end.y
    ) {
      return true;
    } else {
      return false;
    }
  }
  // -----------------------------------------------------------------------------------------------
  /**
   * @Author: zhang fq
   * @Date: 2020-08-18
   * @Description: 重写被穿线根据交叉点数据以及坐标截断算法 修复被穿线上有多个穿点截取搭桥有遗漏的bug
   * @Date: 2020-08-27
   * @Update: 修改线段按交叉点截断重算截断后的线段的起止坐标算法 添加切换到小时后的坐标计算
   */
  function lineSplit(line, point, scale) {
    // 将穿线数据中的线截断
    let line1 = _.cloneDeep(line);
    let line2 = _.cloneDeep(line);
    // 线的方向 永远都是从上向下 从左向右
    // 根据line的arrow方向 判断箭头应该放在截断的两根线的哪一根 并且判断是放在起点还是终点
    if (line.arrow === 1 || line.arrow === 3) {
      // 向上 或者向左  箭头都在截断的第一条线上  line2的arrow为0
      line2.arrow = 0;
    } else if (line.arrow === 2 || line.arrow === 4) {
      // 向下 或者向右  箭头都在截断的第二条线上  line1的arrow为0
      line1.arrow = 0;
    }
    // 根据方向 重算截断的两根线的起始位置
    switch (line.direction) {
      case 1: // 水平方向
        line1.end.xOffset = 0; // 很关键! 将第一条线段的终点的x偏移量xOffset置0
        line1.end.x =
          point.x +
          (point.xOffset * LINE_OFFSETX_UNIT) / xUnit -
          BRIDGE_R / xUnit;
        if (scale === 2) {
          line1.end.x =
            point.x +
            (point.xOffset * LINE_OFFSETX_UNIT) / (xUnit * 24) -
            BRIDGE_R / (xUnit * 24);
        }
        line2.start.xOffset = 0; // 很关键! 将第二条线段的起点的x偏移量xOffset置0
        line2.start.x =
          point.x +
          (point.xOffset * LINE_OFFSETX_UNIT) / xUnit +
          BRIDGE_R / xUnit;
        if (scale === 2) {
          line2.start.x =
            point.x +
            (point.xOffset * LINE_OFFSETX_UNIT) / (xUnit * 24) +
            BRIDGE_R / (xUnit * 24);
        }
        break;
      case 2: // 垂直方向
        line1.end.y = point.y - BRIDGE_R / yUnit;
        line2.start.y = point.y + BRIDGE_R / yUnit;
        break;
    }
    return [line1, line2];
  }
  // -----------------------------------------------------------------------------------------------
  // 计算切换到小时后处理天坐标和小时坐标的算法
  function conversionCoordinates(number) {
    if (typeof number === "number") {
      let arr = number.toString().split(".");
      return {
        int: Number(arr[0]),
        double: arr[1] === undefined ? 0 : Number("0." + arr[1]) * 24,
      };
    } else if (typeof number === "string") {
      let reg = /^\d+(\.\d+)?$/;
      if (reg.test(number)) {
        let arr = number.split(".");
        return {
          int: Number(arr[0]),
          double: arr[1] === undefined ? 0 : Number("0." + arr[1]) * 24,
        };
      } else {
        console.log("坐标值类型错误");
      }
    }
  }
  // -------------------------------------------------------------------------------------------------
  // 超长文字标签根据宽度自动截取为多行显示算法
  function appendMultiText(
    container,
    str,
    posX,
    posY,
    width,
    labelOffsetHeight,
    labelFontColor,
    labelFontSize,
    fontfamily
  ) {
    if (arguments.length < 6) {
      labelFontSize = 14;
    }
    if (arguments.length < 7) {
      fontfamily = "simsun, arial";
    } //获取分割后的字符串
    var strs = splitByLine(str, width, labelFontSize);
    var mulText = container
      .append("text")
      .attr("x", posX)
      .attr("y", posY)
      .attr("text-anchor", "middle") // 水平居中
      // .attr("dy", -labelOffsetHeight)
      .attr("fill", labelFontColor)
      .style("font-size", labelFontSize)
      .style("font-family", fontfamily);
    mulText
      .selectAll("tspan")
      .data(strs)
      .enter()
      .append("tspan")
      .attr("x", mulText.attr("x"))
      .attr("dy", -labelOffsetHeight)
      .text(function (d) {
        return d;
      });
    return mulText;
    function splitByLine(str, max, fontsize) {
      var curLen = 0;
      var result = [];
      var start = 0,
        end = 0;
      for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        var pixelLen = code > 255 ? fontsize : fontsize / 2;
        curLen += pixelLen;
        if (curLen > max) {
          end = i;
          result.push(str.substring(start, end));
          start = i;
          curLen = pixelLen;
        }
        if (i === str.length - 1) {
          end = i;
          result.push(str.substring(start, end + 1));
        }
      }
      return result.reverse();
    }
  }

  // ----------------------------------------------------------------------------------
  // 注册自定义控件
  KDApi.register("net_pic", MyComponent);
})(window.KDApi, jQuery);
