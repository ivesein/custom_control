let cData = [
	{
		title: "质量控制节点总数",
		completed: 0,
		overtime: 0,
		plan: 0,
		deviation: 0
	},
	{
		title: "设计(勘察、测绘)",
		completed: 0,
		overtime: 0,
		plan: 0,
		deviation: 0
	},
	{
		title: "复核",
		completed: 0,
		overtime: 0,
		plan: 0,
		deviation: 0
	},
	{
		title: "一审",
		completed: 0,
		overtime: 0,
		plan: 0,
		deviation: 0
	},
	{
		title: "二审",
		completed: 0,
		overtime: 0,
		plan: 0,
		deviation: 0
	}
]
let titleBgColors = ["#76b5f5", "#76b5f5", "#b2de84", "#2fc8ca", "#ff9a00"]
	; (function (KDApi, $) {
		function MyComponent(model) {
			this._setModel(model)
		}
		// 顶层变量声明
		var tData = null
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
			KDApi.loadFile("./css/element.css", model.schemaId, function () {
				KDApi.loadFile("./css/main.css", model.schemaId, function () {
					KDApi.loadFile("./js/vue.min.js", model.schemaId, function () {
						KDApi.loadFile("./js/vue.js", model.schemaId, function () {
							KDApi.loadFile(
								"./js/element.js",
								model.schemaId,
								function () {
									KDApi.templateFilePath(
										"./html/plan.html",
										model.schemaId,
										{
											path:
												KDApi.nameSpace(model.schemaId) +
												"./img/lock.png"
										}
									).then(function (result) {
										model.dom.innerHTML = result
										// model.invoke("initData", '') //初始化
										console.log("props.data>>>", props.data)
										if (props.data) {
											cData = props.data.data
										}
										var qualityOverviewCardApp = new Vue({
											delimiters: ["${", "}"],
											data: {
												cardData: null
											},
											mounted() {
												this.cardData = addTitleColor(
													cData,
													titleBgColors
												)
											},
											methods: {}
										}).$mount("#qualityOverviewCardApp")
									})
								}
							)
						})
					})
				})
			})
		}
		function addTitleColor(data, colors) {
			console.log(data)
			console.log(colors)
			if (data && data.length) {
				data.forEach(function (v, k) {
					v.color = colors[k]
				})
				return data
			}
		}
		// 注册自定义控件
		KDApi.register("quality_overview_card", MyComponent)
	})(window.KDApi, jQuery)
