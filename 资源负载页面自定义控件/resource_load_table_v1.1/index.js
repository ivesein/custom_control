
; (function (KDApi, $) {
	var displayWhichOne = "chartOne"
	function MyComponent(model) {
		this._setModel(model)
	}
	MyComponent.prototype = {
		// 内部函数不推荐修改
		_setModel: function (model) {
			this.model = model // 内部变量挂载
		},
		init: function (props) {
			console.log("init---", this.model, props)
			setHtml(this.model, props)
		},
		update: function (props) {
			// var tData = JSON.parse(props.data)
			console.log("-----update", this.model, props)
			// firstInit(props, this.model)
			setHtml(this.model, props)
		},
		destoryed: function () {
			console.log("-----destoryed", this.model)
		}
	}
	/**
	 *@description 第一次打开页面加载相关依赖前端文件
	 *
	 * @param {*} model 金蝶内建对象model
	 */
	var setHtml = function (model, props) {
		// KDApi.loadFile("./css/element.css", model.schemaId, function () {
		KDApi.loadFile("./css/main.css", model.schemaId, function () {
			KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
				KDApi.loadFile("./js/vue.js", model.schemaId, function () {
					// KDApi.loadFile(
					// 	"./js/echarts.min.js",
					// 	model.schemaId,
					// 	function () {
					// KDApi.loadFile(
					// 	"./js/element.js",
					// 	model.schemaId,
					// 	function () {
					KDApi.templateFilePath(
						"./html/resource_load_table.html",
						model.schemaId,
						{
							path:
								KDApi.nameSpace(
									model.schemaId
								) + "./img/lock.png"
						}
					).then(function (result) {
						model.dom.innerHTML = result
						// model.invoke("initData", '') //初始化
						console.log(props.data)
						var resourceLoadChartsApp = new Vue(
							{
								delimiters: ["${", "}"],
								data: {
									dates: [],
									resourceData: [],
									unit:""
								},
								/**
								 * @author  zhang fq
								 * @date    2020-02-11
								 * @description  根据后台返回的工时单位为数据添加相应单位
								 */
								mounted() {
									if (props.data) {
										this.dates = props.data.dates
										this.resourceData = props.data.resourceData
										switch(props.data.workTimeUnit){
											case "h":
												this.unit="工时";
												break;
											case "d":
												this.unit="个工作日";
												break;
											default:
												this.unit=""
										}
									}
								},
								methods: {
									arrowClick(item) {
										item.open = !item.open
									},
									scrollLeft(e) {
										// console.log(e.target.scrollTop)
										this.$refs.rightInfoBox.scrollTop = e.target.scrollTop
									},
									scrollRight(e) {
										// console.log(e.target.scrollTop)
										this.$refs.leftInfoBox.scrollTop = e.target.scrollTop
									}
								}
							}
						).$mount("#resourceLoadTableApp")
					})
				}
				)
			}
			)
		})
		// })
		// })
		// })
	}
	// 注册自定义控件
	KDApi.register("resource_load_table", MyComponent)
})(window.KDApi, jQuery)
