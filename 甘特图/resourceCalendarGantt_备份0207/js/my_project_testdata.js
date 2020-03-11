/*
 * @Description:
 * @Version:
 * @Company: ZD
 * @Author: Ivesein Zhang
 * @Date: 2019-09-20 14:15:32
 * @LastEditors: zfq
 * @LastEditTime: 2019-09-24 14:33:51
 */
var projects_with_milestones = {
	data: [
		{
			id: 1,
			text: "甘特图开发",
			type: gantt.config.types.project,
			progress: 0.6,
			open: true
		},
		{
			id: 2,
			text: "甘特图插件开发",
			start_date: "2019-09-18",
			type: gantt.config.types.project,
			parent: "1",
			progress: 0.5,
			open: true
		},
		{
			id: 3,
			text: "增删改按钮功能",
			start_date: "2019-09-18",
			duration: "2",
			parent: "2",
			progress: 0.2,
			open: true
		},
		{
			id: 4,
			text: "导入数据按钮功能",
			start_date: "2019-09-18",
			duration: "2",
			parent: "2",
			progress: 0.1,
			open: true
		},
		{
			id: 5,
			text: "导出数据按钮功能",
			start_date: "2019-09-18",
			duration: "2",
			parent: "2",
			progress: 0.1,
			open: true
		},
		{
			id: 6,
			text: "按任务名称搜索功能",
			start_date: "2019-09-18",
			duration: "2",
			parent: "2",
			progress: 0.2,
			open: true
		},
		{
			id: 7,
			text: "前进后退按钮功能",
			start_date: "2019-09-20",
			duration: "2",
			parent: "2",
			progress: 0.1,
			open: true
		},
		{
			id: 8,
			text: "时间尺度缩放按钮功能",
			start_date: "2019-09-20",
			duration: "2",
			parent: "2",
			progress: 0.1,
			open: true
		},
		{
			id: 9,
			text: "关键路径按钮功能",
			start_date: "2019-09-20",
			duration: "2",
			parent: "2",
			progress: 0.1,
			open: true
		},
		{
			id: 10,
			text: "自定义编辑框内容",
			start_date: "2019-09-20",
			duration: "5",
			parent: "2",
			progress: 0.1,
			open: true
		},
		{
			id: 11,
			text: "修改甘特图任务条渲染样式",
			start_date: "2019-09-23",
			duration: "2",
			parent: "2",
			progress: 0.1,
			open: true
		},
		{
			id: 12,
			text: "保存数据按钮功能",
			start_date: "2019-09-23",
			duration: "2",
			parent: "2",
			progress: 0.1,
			open: true
		},
		{
			id: 13,
			text: "自定义grid内容",
			start_date: "2019-09-23",
			duration: "2",
			parent: "2",
			progress: 0.1,
			open: true
		},
		{
			id: 14,
			text: "封装金蝶云自定义控件",
			type: gantt.config.types.project,
			parent: "1",
			progress: 0.2,
			open: true
		},
		{
			id: 15,
			text: "将开发和的插件封装金蝶云自定义控件",
			start_date: "2019-09-25",
			duration: "3",
			parent: "14",
			progress: 0.1,
			open: true
		},
		{
			id: 16,
			text: "自定义控件完成里程碑",
			start_date: "2019-09-28",
			type: gantt.config.types.milestone,
			parent: "14",
			progress: 0,
			open: true
		},
		{
			id: 17,
			text: "插件完成里程碑",
			start_date: "2019-09-25",
			type: gantt.config.types.milestone,
			parent: "2",
			progress: 0,
			open: true
		}
	],
	links: [
		{ id: "0", source: "3", target: "7", type: "0" }, //“0”–“fs完成到开始”，“1”–“ss开始到开始”，“2”–“ff完成到完成”，“3”–“sf开始到完成”
		{ id: "1", source: "4", target: "8", type: "0" },
		{ id: "2", source: "5", target: "9", type: "0" },
		{ id: "3", source: "6", target: "10", type: "0" },
		{ id: "4", source: "7", target: "11", type: "0" },
		{ id: "5", source: "8", target: "12", type: "0" },
		{ id: "6", source: "9", target: "13", type: "0" },
		{ id: "7", source: "10", target: "17", type: "0" },
		{ id: "8", source: "11", target: "17", type: "0" },
		{ id: "9", source: "12", target: "17", type: "0" },
		{ id: "10", source: "13", target: "17", type: "0" },
		{ id: "11", source: "17", target: "15", type: "0" },
		{ id: "12", source: "15", target: "16", type: "0" }
	]
}
