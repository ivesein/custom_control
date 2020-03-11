/*
 * @Description:
 * @Version:
 * @Company: ZD
 * @Author: Ivesein Zhang
 * @Date: 2019-09-09 11:07:21
 * @LastEditors: Ivesein Zhang
 * @LastEditTime: 2019-09-16 15:20:17
 */

(function (KDApi, $) {

	function MyComponent(model) {
		this._setModel(model)
	}

	MyComponent.prototype = {
		_setModel: function (model) {
			this.model = model
		},
		init: function (props) {
			setHtml(this.model, props)
			//console.log("-----init", this.model, props)
		},
		update: function (props) {
			//console.log("-----update", this.model, props)
			if (props.data != undefined) {
				if (props.data.method == "Ganttsave") {

					submitGanttData(1);
				} else if (props.data.method == "GanttinitData") {

					console.log("gantt-------------------", JSON.stringify(props.data.data))
					setGanttData(props.data.data)
				} else if (props.data.method == "ganttSaveSuccess") {
					//保存之后 修改界面
					editingMethodsGantt();
				} else if (props.data.method == "ganttRefresh") {
					//刷新
					setGanttData(props.data.data)
				} else if (props.data.method == "isExit") {
					//退出
					submitGanttData(2);
				} else if (props.data.method == "ganttSwitch") {
					//切换页签
					submitGanttData(3);
				}


			}
		},
		destoryed: function () {
			setClearGantt();
			console.log("-----destoryed", this.model)
		}
	}

	var setHtml = function (model, props) {
		// KDApi.loadFile('./js/jquery.min.js',model.schemaId,null)
		KDApi.loadFile("./css/dhtmlxgantt.css?v=6.2.4", model.schemaId, function () {
			KDApi.loadFile("./css/customstyle.css", model.schemaId, function () {
				KDApi.loadFile("./css/dialog.css", model.schemaId, function () {
					KDApi.loadFile("./css/iconfont.css", model.schemaId, function () {
						KDApi.loadFile("./css/gantt-abstracu.css", model.schemaId, function () {
							KDApi.loadFile("./css/select2.min.css", model.schemaId, function () {
								KDApi.loadFile("./js/dhtmlxgantt.js", model.schemaId, function () {
									KDApi.loadFile("./js/locale_cn.js", model.schemaId, function () {
										KDApi.loadFile("./js/event.js", model.schemaId, function () {
											KDApi.loadFile("./js/dhtmlxgantt_critical_path.js", model.schemaId, function () {
												KDApi.loadFile("./js/md5.min.js", model.schemaId, function () {
													KDApi.loadFile("./js/select2.min.js", model.schemaId, function () {
														KDApi.loadFile("./js/dhtmlxgantt_auto_scheduling.js", model.schemaId, function () {
															KDApi.loadFile("./js/dhtmlxgantt_multiselect.js", model.schemaId, function () {
																KDApi.loadFile("./js/dhtmlxgantt_undo.js", model.schemaId, function () {
																	KDApi.loadFile("./js/dhtmlxgantt_marker.js", model.schemaId, function () {
																		KDApi.loadFile("./js/testdata_with_planned_date.js", model.schemaId, function () {
																			KDApi.loadFile("./js/newData.js", model.schemaId, function () {
																				KDApi.templateFilePath(
																					"./html/gantt.html",
																					model.schemaId, {
																						path: KDApi.nameSpace(model.schemaId) +
																							"./img/lock.png"
																					}
																				).then(function (result) {



																					model.dom.innerHTML = result;
																					var mygantt = Gantt.getGanttInstance();
																					setModelGantt(model, mygantt);
																					getInitDataGannt();

																					model.invoke("GanttinitData", "");




																					// -----------------------
																				})
																			})
																		})
																	})
																})
															})
														})
													})
												})
											})
										})
									})
								})
							})
						})
					})
				})
			})
		})
	}
	KDApi.register("resourceCalendarGantt", MyComponent)
})(window.KDApi, jQuery)