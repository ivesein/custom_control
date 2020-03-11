/*
@license

dhtmlxGantt v.6.2.4 Standard

This version of dhtmlxGantt is distributed under GPL 2.0 license and can be legally used in GPL projects.

To use dhtmlxGantt in non-GPL projects (and get Pro version of the product), please obtain Commercial/Enterprise or Ultimate license on our site https://dhtmlx.com/docs/products/dhtmlxGantt/#licensing or contact us at sales@dhtmlx.com

(c) XB Software Ltd.

*/
!(function(e, t) {
	if ("object" == typeof exports && "object" == typeof module)
		module.exports = t()
	else if ("function" == typeof define && define.amd) define([], t)
	else {
		var n = t()
		for (var o in n) ("object" == typeof exports ? exports : e)[o] = n[o]
	}
})(window, function() {
	return (function(e) {
		var t = {}
		function n(o) {
			if (t[o]) return t[o].exports
			var r = (t[o] = { i: o, l: !1, exports: {} })
			return e[o].call(r.exports, r, r.exports, n), (r.l = !0), r.exports
		}
		return (
			(n.m = e),
			(n.c = t),
			(n.d = function(e, t, o) {
				n.o(e, t) ||
					Object.defineProperty(e, t, { enumerable: !0, get: o })
			}),
			(n.r = function(e) {
				"undefined" != typeof Symbol &&
					Symbol.toStringTag &&
					Object.defineProperty(e, Symbol.toStringTag, {
						value: "Module"
					}),
					Object.defineProperty(e, "__esModule", { value: !0 })
			}),
			(n.t = function(e, t) {
				if ((1 & t && (e = n(e)), 8 & t)) return e
				if (4 & t && "object" == typeof e && e && e.__esModule) return e
				var o = Object.create(null)
				if (
					(n.r(o),
					Object.defineProperty(o, "default", {
						enumerable: !0,
						value: e
					}),
					2 & t && "string" != typeof e)
				)
					for (var r in e)
						n.d(
							o,
							r,
							function(t) {
								return e[t]
							}.bind(null, r)
						)
				return o
			}),
			(n.n = function(e) {
				var t =
					e && e.__esModule
						? function() {
								return e.default
						  }
						: function() {
								return e
						  }
				return n.d(t, "a", t), t
			}),
			(n.o = function(e, t) {
				return Object.prototype.hasOwnProperty.call(e, t)
			}),
			(n.p = "/codebase/"),
			n((n.s = 203))
		)
	})({
		203: function(e, t) {
			;(gantt.config.day_date = "%M %d日 %D"),
				(gantt.config.default_date = "%Y年 %M %d日"),
				(gantt.config.month_date = "%Y年 %M"),
				(gantt.locale = {
					date: {
						month_full: [
							"一月",
							"二月",
							"三月",
							"四月",
							"五月",
							"六月",
							"七月",
							"八月",
							"九月",
							"十月",
							"十一月",
							"十二月"
						],
						month_short: [
							"1月",
							"2月",
							"3月",
							"4月",
							"5月",
							"6月",
							"7月",
							"8月",
							"9月",
							"10月",
							"11月",
							"12月"
						],
						day_full: [
							"星期日",
							"星期一",
							"星期二",
							"星期三",
							"星期四",
							"星期五",
							"星期六"
						],
						day_short: ["日", "一", "二", "三", "四", "五", "六"]
					},
					labels: {
						new_task: "新任務",
						dhx_cal_today_button: "今天",
						day_tab: "日",
						week_tab: "周",
						month_tab: "月",
						new_event: "新建日程",
						icon_save: "保存",
						icon_cancel: "关闭",
						icon_details: "详细",
						icon_edit: "编辑",
						icon_delete: "删除",
						confirm_closing: "请确认是否撤销修改!",
						confirm_deleting: "确认是否删除任务?",
						section_description: "描述",
						section_time: "时间范围",
						section_type: "类型",
						column_wbs: "工作分解结构",
						column_text: "任务名",
						column_start_date: "开始时间",
						column_duration: "持续时间",
						column_add: "",
						link: "关联",
						confirm_link_deleting: "将被删除",
						link_start: " (开始)",
						link_end: " (结束)",
						type_task: "任务",
						type_project: "项目",
						type_milestone: "里程碑",
						minutes: "分钟",
						hours: "小时",
						days: "天",
						weeks: "周",
						months: "月",
						years: "年",
						message_ok: "OK",
						message_cancel: "关闭",
						section_constraint: "Constraint",
						constraint_type: "Constraint type",
						constraint_date: "Constraint date",
						asap: "As Soon As Possible",
						alap: "As Late As Possible",
						snet: "Start No Earlier Than",
						snlt: "Start No Later Than",
						fnet: "Finish No Earlier Than",
						fnlt: "Finish No Later Than",
						mso: "Must Start On",
						mfo: "Must Finish On",
						resources_filter_placeholder: "type to filter",
						resources_filter_label: "hide empty"
					}
				})
		}
	})
})
//# sourceMappingURL=locale_cn.js.map
