(function (KDApi, $) {
  var displayWhichOne = "chartOne";
  function MyComponent(model) {
    this._setModel(model);
  }
  MyComponent.prototype = {
    // 内部函数不推荐修改
    _setModel: function (model) {
      this.model = model; // 内部变量挂载
      this.model.resourceLoadTableApp = null;
    },
    init: function (props) {
      console.log("init---", this.model, props);
      setHtml(this.model, props);
    },
    update: function (props) {
      // var tData = JSON.parse(props.data)
      console.log("-----update", this.model, props);
      // firstInit(props, this.model)
      if (this.model.resourceLoadTableApp) {
        this.model.resourceLoadTableApp.handleUpdate(this.model, props);
      } else {
        setHtml(this.model, props);
      }
    },
    destoryed: function () {
      console.log("-----destoryed", this.model);
      this.model.resourceLoadTableApp = null;
    },
  };
  /**
   *@description 第一次打开页面加载相关依赖前端文件
   *
   * @param {*} model 金蝶内建对象model
   */
  var setHtml = function (model, props) {
    // KDApi.loadFile("./css/element.css", model.schemaId, function () {
    KDApi.loadFile("./css/main.css", model.schemaId, function () {
      KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
        KDApi.templateFilePath(
          "./html/resource_load_table.html",
          model.schemaId,
          {
            path: KDApi.nameSpace(model.schemaId) + "./img/lock.png",
          }
        ).then(function (result) {
          model.dom.innerHTML = result;
          // model.invoke("initData", '') //初始化
          console.log(props.data);
          model.resourceLoadTableApp = new Vue({
            delimiters: ["${", "}"],
            data: {
              dates: [],
              resourceData: [],
              unit: "",
            },
            created() {
              this.handleUpdate(model, props);
            },
            methods: {
              handleUpdate(model, props) {
                if (props.data) {
                  this.dates = props.data.dates || [];
                  this.resourceData = this.handleDataNull(
                    this.dates,
                    props.data.resourceData
                  );
                  switch (props.data.workTimeUnit) {
                    case "h":
                      this.unit = "工时";
                      break;
                    case "d":
                      this.unit = "个工作日";
                      break;
                    default:
                      this.unit = "";
                  }
                }
              },
              /**
               * @Author: zhang fq
               * @Date: 2020-06-22
               * @Description: 处理资源负载表格控件 后台返回数据不全或为空值时 页面表格显示有问题的bug
               */
              handleDataNull(dates, target) {
                if (dates.length > 0) {
                  let tempVal = new Array(dates.length).fill("");
                  if (target && target.length > 0) {
                    target.forEach((a) => {
                      if (
                        a.projectAllocation.value === undefined ||
                        a.projectAllocation.value === "" ||
                        a.projectAllocation.value.length === 0 ||
                        a.projectAllocation.value === null
                      ) {
                        a.projectAllocation.value = tempVal;
                      }
                      if (
                        a.resourceCapacity.value === undefined ||
                        a.resourceCapacity.value === "" ||
                        a.resourceCapacity.value.length === 0 ||
                        a.resourceCapacity.value === null
                      ) {
                        a.resourceCapacity.value = tempVal;
                      }
                      if (
                        a.resourceInfo.value === undefined ||
                        a.resourceInfo.value === "" ||
                        a.resourceInfo.value.length === 0 ||
                        a.resourceInfo.value === null
                      ) {
                        a.resourceInfo.value = tempVal;
                      }
                      if (
                        a.resourceUsability.value === undefined ||
                        a.resourceUsability.value === "" ||
                        a.resourceUsability.value.length === 0 ||
                        a.resourceUsability.value === null
                      ) {
                        a.resourceUsability.value = tempVal;
                      }
                    });
                  }
                  return target;
                } else {
                  return [];
                }
              },
              arrowClick(item) {
                item.open = !item.open;
              },
              scrollLeft(e) {
                // console.log(e.target.scrollTop)
                this.$refs.rightInfoBox.scrollTop = e.target.scrollTop;
              },
              scrollRight(e) {
                // console.log(e.target.scrollTop)
                this.$refs.leftInfoBox.scrollTop = e.target.scrollTop;
              },
            },
          }).$mount($("#resourceLoadTableApp", model.dom).get(0));
        });
      });
    });
  };
  // 注册自定义控件
  KDApi.register("resource_load_table", MyComponent);
})(window.KDApi, jQuery);
