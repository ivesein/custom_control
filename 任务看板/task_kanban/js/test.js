new Vue({
	delimiters: ["${", "}"],
	data: {
		// bgColors: ['#909399', '#E6A23C', '#67C23A', '#F56C6C'],
		summarData: [
			{
				title: "总任务",
				focus: true,
				number: 9
			},
			{
				title: "待完成任务",
				focus: false,
				number: 5
			},
			{
				title: "已完成任务",
				focus: false,
				number: 3
			},
			{
				title: "已过期任务",
				focus: false,
				number: 1
			}
		],
		responsibleTaskInfos: [
			{
				task_status: "toBeComplected",
				task_name: "平纵数据自检修改完成",
				project_name: "陕西汉中项目"
			},
			{
				task_status: "complected",
				task_name: "p3挖土",
				project_name: "陕西汉中项目"
			},
			{
				task_status: "inProgress",
				task_name: "p4挖土",
				project_name: "陕西汉中项目"
			},
			{
				task_status: "toBeComplected",
				task_name: "平纵数据自检修改完成",
				project_name: "陕西汉中项目"
			},
			{
				task_status: "complected",
				task_name: "p3挖土",
				project_name: "陕西汉中项目"
			},
			{
				task_status: "inProgress",
				task_name: "p4挖土",
				project_name: "陕西汉中项目"
			},
			{
				task_status: "toBeComplected",
				task_name: "平纵数据自检修改完成",
				project_name: "陕西汉中项目"
			},
			{
				task_status: "complected",
				task_name: "p3挖土",
				project_name: "陕西汉中项目"
			},
			{
				task_status: "inProgress",
				task_name: "p4挖土",
				project_name: "陕西汉中项目"
			},
			{
				task_status: "toBeComplected",
				task_name: "平纵数据自检修改完成",
				project_name: "陕西汉中项目"
			},
			{
				task_status: "complected",
				task_name: "p3挖土",
				project_name: "陕西汉中项目"
			},
			{
				task_status: "inProgress",
				task_name: "p4挖土",
				project_name: "陕西汉中项目"
			}
		],
		participtionTaskInfos: [
			{
				task_status: "toBeComplected",
				task_name: "平纵数据自检修改完成",
				project_name: "陕西汉中项目",
				taskScheduleStatus: false
			},
			{
				task_status: "complected",
				task_name: "p3挖土",
				project_name: "陕西汉中项目",
				taskScheduleStatus: true
			},
			{
				task_status: "inProgress",
				task_name: "p4挖土",
				project_name: "陕西汉中项目",
				taskScheduleStatus: false
			}
		],
		professionalAuditTaskInfos: [
			{
				task_status: "toBeComplected",
				task_name: "专业审核任务1",
				project_name: "陕西汉中项目",
				open: true,
				auditTask: [
					{
						wbs: "0101", //任务代码
						task_name: "被审核任务1",
						design_owner: "设计人1",
						review_owner: "复核人1",
						task_status: "toBeComplected",
						taskScheduleStatus: false
					},
					{
						wbs: "0102", //任务代码
						task_name: "被审核任务1",
						design_owner: "设计人1",
						review_owner: "复核人1",
						task_status: "inProgress",
						taskScheduleStatus: false
					},
					{
						wbs: "0103", //任务代码
						task_name: "被审核任务1",
						design_owner: "设计人1",
						review_owner: "复核人1",
						task_status: "complected",
						taskScheduleStatus: false
					}
				]
			},
			{
				task_status: "toBeComplected",
				task_name: "专业审核任务2",
				project_name: "陕西汉中项目",
				open: true,
				auditTask: [
					{
						wbs: "0201", //任务代码
						task_name: "被审核任务2",
						design_owner: "设计人2",
						review_owner: "复核人2",
						task_status: "toBeComplected",
						taskScheduleStatus: true
					},
					{
						wbs: "0202", //任务代码
						task_name: "被审核任务2",
						design_owner: "设计人2",
						review_owner: "复核人2",
						task_status: "inProgress",
						taskScheduleStatus: true
					},
					{
						wbs: "0203", //任务代码
						task_name: "被审核任务2",
						design_owner: "设计人2",
						review_owner: "复核人2",
						task_status: "complected",
						taskScheduleStatus: true
					}
				]
			},
		]
	},
	created() { },
	mounted() {

	},
	methods: {
		handleUpdata(model, props) {
		},
		handleSummaryItemClicked(item) {
			this.summarData.forEach(function (fuck) {
				fuck.focus = false
			})
			item.focus = true
			let sendData = {
				data: {
					time: item.title,
				}
			}
			console.log("发送参数", sendData)
			console.log("item>>>", item)
			console.log("info>>>", info)
		},
		handleTaskNameClicked(item) {
			console.log(item)
		},
		designClickAccept(item) {
			this.$confirm('确认接受指定的任务?', '接受', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info'
			}).then(() => {
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
			console.log(item)
		},
		auditUrge(item) {
			this.$confirm('确认催办指定的任务?', '催办', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
			console.log(item)
		},
		reviewUrge(item) {
			this.$confirm('确认催办指定的任务?', '催办', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
			console.log(item)
		},
		iconArrowClick(item) {
			item.open = !item.open
		},
		auditClickAccept(row) {
			console.log(row)
		},
		reviewClickAccept(item) {
			this.$confirm('确认接受指定的任务?', '接受', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
			console.log(row)
		}
	}
}).$mount("#taskKanbanApp")
