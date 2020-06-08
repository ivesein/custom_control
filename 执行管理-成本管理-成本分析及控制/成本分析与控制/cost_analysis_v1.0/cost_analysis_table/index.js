;(function(KDApi, $) {
	function MyComponent(model) {
		this._setModel(model)
	}
	// 顶层变量声明
	var tempTableData = null
	MyComponent.prototype = {
		// 内部函数不推荐修改
		_setModel: function(model) {
			this.model = model // 内部变量挂载
		},
		init: function(props) {
			console.log("init---", this.model, props)
			setHtml(this.model, props)
		},
		update: function(props) {
			// var tData = JSON.parse(props.data)
			console.log("-----update", this.model, props)
			// firstInit(props, this.model)
			setHtml(this.model, props)
		},
		destoryed: function() {
			console.log("-----destoryed", this.model)
		}
	}
	/**
	 *@description 第一次打开页面加载相关依赖前端文件
	 *
	 * @param {*} model 金蝶内建对象model
	 */
	var setHtml = function(model, props) {
		KDApi.loadFile("./css/element.css", model.schemaId, function() {
			KDApi.loadFile("./css/main.css", model.schemaId, function() {
				KDApi.loadFile("./js/vue.min.js", model.schemaId, function() {
					KDApi.loadFile("./js/vue.js", model.schemaId, function() {
						KDApi.loadFile(
							"./js/element.js",
							model.schemaId,
							function() {
								KDApi.templateFilePath(
									"./html/plan.html",
									model.schemaId,
									{
										path:
											KDApi.nameSpace(model.schemaId) +
											"./img/lock.png"
									}
								).then(function(result) {
									model.dom.innerHTML = result
									// model.invoke("initData", '') //初始化
									console.log(props.data)
									if (props.data) {
										tempTableData = props.data
									}
									var costAnalysisTableApp = new Vue({
										delimiters: ["${", "}"],
										data: {
											tableData: null,
											allChecked: false
										},
										created() {
											this.tableData = tempTableData
											console.log(
												"this.tableData>>>",
												this.tableData
											)
										},
										methods: {
											nameDbclick(row) {
												console.log(row)
												model.invoke(
													"taskNameClicked",
													row
												)
											},
											factCostDbclick(row) {
												console.log(row)
												model.invoke(
													"factCostClicked",
													row
												)
											},
											cellStyle({
												row,
												column,
												rowIndex,
												columnIndex
											}) {
												return "padding-left: 0px!important;padding-right: 0px!important;"
											}
										}
									}).$mount("#costAnalysisTableApp")
								})
							}
						)
					})
				})
			})
		})
	}
	// 注册自定义控件
	KDApi.register("cost_analysis_table", MyComponent)
})(window.KDApi, jQuery)
