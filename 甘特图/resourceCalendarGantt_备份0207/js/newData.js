var modelGantt = null;


let allSelectRecouse = {}; //保存子资源的数据

let newlinks = [];
let levelHide = {};
let ganttResouceCalendar = {}; //资源的例外
let ganttTaskCalendar = {}; //任务的例外
var mygantt = null;
//资源时间数据
var resourceTimes = {};

//添加父类的时候同时添加子类
var ganttFatherAndChildern = {};

function time(time) {

    var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
    return date.toJSON().substr(0, 11).replace('T', ' ');

}

function setModelGantt(models, mygantt) {
    modelGantt = models;
    this.mygantt = mygantt;
}

function submitGanttData(status) {
    switch (status) {
        case 1:
            $('.ganttSave').trigger("click");
            break;
        case 2:
            $('#ganttSubmitData').trigger("click");
            break
        case 3:
            $("#ganttSwitch").trigger("click");
            break
    }

}

function setClearGantt() {


    mygantt.destructor();

}

function setGanttData(data) {
    if (data.length == 0 || data == undefined) {
        return;
    }
    mygantt.clearAll();
    resourceTimes = {};
    allSelectRecouse = {}
    if (data.SchedulingMode != undefined) {
        let start = data.SchedulingMode.startdate;
        let end = data.SchedulingMode.enddate;
        if (start != undefined && start != "") {
            mygantt.config.project_start = new Date(start)
        }
        if (end != undefined && end != "") {
            mygantt.config.project_end = new Date(end)
        }
    }
    mygantt.$resourcesStore.parse(data.resourceDatas);
    data.resourceDatas.forEach(function(element) {
        if (element["parent"] != 0) {

            allSelectRecouse[element.id] = element
        }
    });

    //获取任务以及资源的例外的数据
    ganttResouceCalendar = getGanttCalendarData(data.ganttResouceCalendar);
    ganttTaskCalendar = getGanttCalendarData(data.ganttTaskCalendar);
    //传递例外数据
    setGanttCalendarData(ganttResouceCalendar, ganttTaskCalendar, data)
        //任务的例外
    setTaskCalendar(ganttTaskCalendar)


    mygantt.parse(JSON.stringify(data), "json");

    //根据专递过来的数据 设置专业和单位的选项值
    $('.item-unit').select2({
        placeholder: '请选择任务单位',
        data: data.ganntUnit
    });

    //gannt-major  gantt-add-task-box-item-select

    $('.gannt-major').select2({
        placeholder: '请选择任务专业',
        data: data.ganttMajor
    });

    $('.gantt-add-task-box-item-select').select2({
        placeholder: '请选择任务专业',
        data: data.ganttMajor
    });


}

function getInitDataGannt() {

    $("#ganttUp").on("click", function() {
        //上移
        let selectid = mygantt.getSelectedId();
        if (selectid == null) {
            showError("请选择需要移动的任务");
            return;
        }
        let moveTask = mygantt.getTask(selectid);

        let wbs = moveTask.$wbs.split(".").length;
        if (wbs === 3 || wbs === 2) {
            let preId = mygantt.getPrevSibling(moveTask.id);
            if (preId == null) {
                showError("不能上移");
                return
            }


            moveTask["$index"] = 3;
            console.log(moveTask["$index"])
            mygantt.moveTask(selectid, 0);

        } else {
            showError("不能移动");
        }
        //  console.log(wbs)
    })
    $("#ganttDown").on("clikc", function() {
        //下移
        let selectid = mygantt.getSelectedId();
        if (selectid == null) {
            showError("请选择需要移动的任务");
            return;
        }
    })


    //     gantt.config.round_dnd_dates = false;

    // gantt.config.duration_unit = 'minute';
    //mygantt.config.duration_unit = "hour";

    //     mygantt.getCalendar("custom1").setWorkTime({date:new Date(2019, 11, 09), hours:false});
    //    //设置整体项目休息时间
    //     mygantt.setWorkTime({date: new Date(2019, 11, 09),hours:false});

    //点击跳转
    $(".newworkPlanning").on("click", function() {


        getGanttResouceData(allSelectRecouse, ganttResouceCalendar, ganttTaskCalendar)
        resourceTimes = {};
    })






    //	自动调度完成后触发
    mygantt.attachEvent("onAfterAutoSchedule", function(taskId, updatedTasks) {
        levelHide = {}; //清空存储的数据
        resourceTimes = {};
    });
    //删除任务后触发
    mygantt.attachEvent("onAfterTaskDelete", function(id, item) {

        levelHide = {}; //清空存储的数据
        resourceTimes = {};
    });

    //添加任务完成 之后设置连线关系
    mygantt.attachEvent("onAfterTaskAdd", function(id, item) {

        let wbs = item.$wbs.split(".").length;

        if (wbs === 3) {
            if (ganttFatherAndChildern["design"] === undefined) {
                ganttFatherAndChildern["link"].forEach(ele => {
                    mygantt.addLink(ele);
                });
                ganttFatherAndChildern = {}
            } else {
                mygantt.addTask(ganttFatherAndChildern["design"], id)
                mygantt.addTask(ganttFatherAndChildern["check"], id)
            }

        } else if (wbs === 4) {
            if (item.task_type === "3") {
                ganttFatherAndChildern["link"].forEach(ele => {
                    mygantt.addLink(ele);
                });
                ganttFatherAndChildern = {}
            }
        }




        levelHide = {};
        if (newlinks.length != 0) {

            setTimeout(function() {
                for (let key in newlinks) {
                    mygantt.addLink(newlinks[key]);
                }
            }, 300)

            newlinks = []

        }



    });
    //用户拖拽完成之后
    mygantt.attachEvent("onAfterTaskMove", function(id, parent, tindex) {

        levelHide = {};
    });










    mygantt.$resourcesStore = mygantt.createDatastore({
        name: mygantt.config.resource_store,
        type: "treeDatastore",
        initItem: function(item) {
            item.parent = item.parent || mygantt.config.root_id;
            item[mygantt.config.resource_property] = item.parent;
            item.open = true;

            return item;
        }
    });





    //参数  
    var md5Start = [];
    var md5Final = [];
    var md5StartId = [];
    var md5FinalId = [];
    //关系
    var startLikes = [];
    var startLikesId = [];
    var finakLikes = [];
    var finakLikesId = [];

    // 添加任务基准
    mygantt.locale.labels.baseline_enable_button = "设置基准"
    mygantt.locale.labels.baseline_disable_button = "移除基准"

    mygantt.config.lightbox.sections = [{
            name: "description",
            height: 70,
            map_to: "text",
            type: "textarea",
            focus: true
        },
        {
            name: "time",
            map_to: "auto",
            type: "duration"
        },
        {
            name: "baseline",
            map_to: {
                start_date: "planned_start",
                end_date: "planned_end"
            },
            button: true,
            type: "duration_optional"
        }
    ]
    mygantt.locale.labels.section_baseline = "计划工期"
        // adding baseline display
    mygantt.addTaskLayer(function draw_planned(task) {
        if (task.planned_start && task.planned_end) {
            var sizes = mygantt.getTaskPosition(
                task,
                task.planned_start,
                task.planned_end
            )
            var el = document.createElement("div")
            el.className = "baseline"
            el.style.left = sizes.left + "px"
            el.style.width = sizes.width + "px"
            el.style.top = sizes.top + mygantt.config.task_height + 13 + "px"
            return el
        }
        return false
    })

    mygantt.templates.task_class = function(start, end, task) {
        if (task.planned_end) {
            var classes = ["has-baseline"]
            if (end.getTime() > task.planned_end.getTime()) {
                classes.push("overdue")
            }
            return classes.join(" ")
        }
    }

    mygantt.attachEvent("onTaskLoading", function(task) {
            task.planned_start = mygantt.date.parseDate(
                task.planned_start,
                "xml_date"
            )
            task.planned_end = mygantt.date.parseDate(
                task.planned_end,
                "xml_date"
            )
            return true
        })
        // 动态计算任务进度
    ;
    (function dynamicProgress() {
        function calculateSummaryProgress(task) {
            if (task.type != mygantt.config.types.project)
                return task.progress
            var totalToDo = 0
            var totalDone = 0
            mygantt.eachTask(function(child) {
                if (child.type != mygantt.config.types.project) {
                    totalToDo += child.duration
                    totalDone += (child.progress || 0) * child.duration
                }
            }, task.id)
            if (!totalToDo) return 0
            else return totalDone / totalToDo
        }

        function refreshSummaryProgress(id, submit) {
            if (!mygantt.isTaskExists(id)) return

            var task = mygantt.getTask(id)
            task.progress = calculateSummaryProgress(task)

            if (!submit) {
                mygantt.refreshTask(id)
            } else {
                mygantt.updateTask(id)
            }

            if (!submit && mygantt.getParent(id) !== mygantt.config.root_id) {
                refreshSummaryProgress(mygantt.getParent(id), submit)
            }
        }

        mygantt.attachEvent("onParse", function() {

            console.log("-----------------")
            md5Start = [];
            md5StartId = [];
            startLikes = [];
            startLikesId = [];
            var json = mygantt.serialize();

            json.data.forEach(function(ele) {

                md5Start.push({

                    id: ele.id,
                    md5: md5(JSON.stringify(ele)),
                    item: ele


                });

                md5StartId.push(ele.id);


            });

            json.links.forEach(function(element) {
                startLikes.push({
                    id: element.id,
                    md5: md5(JSON.stringify(element))
                });
                startLikesId.push(element.id)
            });



            //   //清除后退和前进
            //   mygantt.ext.undo.clearRedoStack();
            //   mygantt.ext.undo.clearUndoStack();
        })

        mygantt.attachEvent("onAfterTaskUpdate", function(id) {
            refreshSummaryProgress(mygantt.getParent(id), true)
        })

        mygantt.attachEvent("onTaskDrag", function(id) {
            refreshSummaryProgress(mygantt.getParent(id), false)
        })
        mygantt.attachEvent("onAfterTaskAdd", function(id) {
            refreshSummaryProgress(mygantt.getParent(id), true)
        });
        (function() {
            var idParentBeforeDeleteTask = 0
            mygantt.attachEvent("onBeforeTaskDelete", function(id) {
                idParentBeforeDeleteTask = mygantt.getParent(id)
            })
            mygantt.attachEvent("onAfterTaskDelete", function() {
                refreshSummaryProgress(idParentBeforeDeleteTask, true)
            })
        })()
    })()

    //关键路径按钮功能
    function updateCriticalPath(toggle) {
        toggle.enabled = !toggle.enabled
        if (toggle.enabled) {
            // toggle.innerHTML = "隐藏关键路径"
            mygantt.config.highlight_critical_path = true
        } else {
            // toggle.innerHTML = "显示关键路径"
            mygantt.config.highlight_critical_path = false
        }
        mygantt.render()
    }


    mygantt.attachEvent("onLinkDblClick", function(id, e) {
        return false;

    })




    // mygantt 配置
    mygantt.config.scale_height = 50
    mygantt.config.link_line_width = 3
    mygantt.config.link_line_height = 3
    mygantt.config.row_height = 42
    mygantt.config.task_height = 20
    mygantt.config.grid_resize = true
        //禁止修改拖拽修改任务的大小
    mygantt.config.drag_resize = false;
    //修改任务的开始时间
    mygantt.config.drag_move = false;
    //禁止拖拽连线
    mygantt.config.drag_links = false
        //实现任务的拖拽
    mygantt.config.order_branch = false;
    mygantt.config.order_branch_free = true;

    //禁止拖拽进度
    mygantt.config.drag_progress = false
    mygantt.config.work_time = true
    mygantt.config.details_on_create = true
    mygantt.config.auto_scheduling_descendant_links = true //允许或禁止创建从父任务（项目）到其子任务的链接
    mygantt.config.auto_types = true; //自动将具有子任务的任务转换为项目，将不具有子任务的项目转换回任务
    // 添加自动规划
    mygantt.config.auto_scheduling = true
    mygantt.config.auto_scheduling_strict = true //启用自动调度模式，在该模式下，任务将始终重新调度到尽可能早的日期
    mygantt.config.auto_scheduling_compatibility = true

    // 从设置的项目开始日期自动计算各任务开始结束日期
    mygantt.config.schedule_from_end = false

    //设置后退的类型

    mygantt.attachEvent("onAfterAutoSchedule", function(taskId, updatedTasks) {
            // any custom logic here
            let json = mygantt.serialize()

            json.data.forEach(function(v) {
                var task = mygantt.getTask(v.id)

                // 最早开始
                task.earliest_time = task.start_date
                    // 最晚开始
                task.latest_start_time = mygantt.calculateEndDate({
                        start_date: task.earliest_time,
                        duration: task.total_slack
                    })
                    // 最早结束
                task.earliest_end_time = task.end_date
                    // 最晚结束
                task.latest_end_time = mygantt.calculateEndDate({
                    start_date: task.earliest_end_time,
                    duration: task.total_slack
                })



            })



        })
        // var start = new Date("2019/9/18")
        // // 添加状态线marker
        // var date_to_str = mygantt.date.date_to_str(mygantt.config.task_date)
        // var today = new Date()
        // mygantt.addMarker({
        //     start_date: today,
        //     css: "today",
        //     text: "今天",
        //     title: "今天: " + date_to_str(today)
        // })
        // mygantt.addMarker({
        //     start_date: start,
        //     css: "status_line",
        //     text: "开始日期",
        //     title: "开始日期: " + date_to_str(start)
        // })
        // var projectEnd = new Date("2019/10/2")
        // mygantt.addMarker({
        //     start_date: projectEnd,
        //     css: "end_date",
        //     text: "结束日期",
        //     title: "结束日期: " + date_to_str(today)
        // })

    // 设置type为project任务条的样式
    // mygantt.config.type_renderers[mygantt.config.types.project] = function (
    //     task
    // ) {
    //     var main_el = document.createElement("div")
    //     main_el.setAttribute(mygantt.config.task_attribute, task.id)
    //     var size = mygantt.getTaskPosition(task)
    //     main_el.innerHTML = [
    //         "<div class='project-left'></div>",
    //         "<div class='project-right'></div>"
    //     ].join("")
    //     main_el.className = "custom-project"

    //     main_el.style.left = size.left + "px"
    //     main_el.style.top = size.top + 7 + "px"
    //     main_el.style.width = size.width + "px"

    //     return main_el
    // }

    // 为type为project的任务条添加样式
    mygantt.templates.grid_row_class = function(start, end, task) {
            if (task.type == mygantt.config.types.project) {
                return "project-line"
            }
        }
        //设置任务的休息的展示
    mygantt.templates.timeline_cell_class = function(task, date) {

        if (!mygantt.isWorkTime({
                date: date,
                task: task
            }))
            return "weekend";
        return "";
    };

    // 这样设置可以在进度条上不展示名称
    // mygantt.templates.task_text = function () {
    //     return ""
    // }


    // 设置grid 按钮 添加 新增 编辑 删除任务功能
    var colHeader =
        '<div class="gantt_grid_head_cell gantt_grid_head_add" ></div>',
        colContent = function(task) {
            return (
                '<i class="fa iconfont icon-bianji fa-pencil  text_dxw"  onclick="clickGridButton(' +
                task.position +
                ", 'edit')\"></i>" +
                '<i class="fa iconfont icon-iconaddsuccess fa-plus" onclick="clickGridButton(' +
                task.position +
                ", 'add')\"></i>" +
                '<i class="fa iconfont icon-shanchu fa-times" onclick="clickGridButton(' +
                task.position +
                ", 'delete')\"></i>"
            )
        }
        //为任务名称添加搜索功能
    var filterValue = ""
    mygantt.$doFilter = function(value) {
        filterValue = value
        mygantt.refreshData()
        mygantt.render();
    }

    mygantt.attachEvent("onBeforeTaskDisplay", function(id, task) {
        if (!filterValue) return true

        var normalizedText = task.text.toLowerCase()
        var normalizedValue = filterValue.toLowerCase()
        return normalizedText.indexOf(normalizedValue) > -1
    })

    mygantt.attachEvent("onGanttRender", function() {
        mygantt.$root.querySelector("[data-text-filter]").value = filterValue
    })


    // var textFilter =
    //     "<div class='searchEl'>任务序列 <input data-text-filter id='search' type='text' placeholder='搜索任务...' oninput='searchNumber()'></div>"

    var textFilter = "<div class='searchEl'>WBS任务名称<input data-text-filter id='search' type='text' placeholder='任务名称...' oninput='mygantt.$doFilter(this.value)'></div>";

    var textSelect = "<div class='gannt-select'> <input type='checkbox' onclick='selectTask()' > </div>";
    mygantt.config.columns = [

            {
                name: "序列",
                label: "序列",
                width: 60,
                align: "center",
                template: function(item) {
                    var data = JSON.stringify(item);
                    item.position = (item.$index + 1) + "";
                    return (item.$index + 1) + "";
                }
            },

            {
                width: 220,
                name: "text",
                label: textFilter,
                tree: true,
                align: "left",

            },
            {
                name: "wbs",
                label: "任务代码",
                min_width: 60,
                width: 60,
                align: "center",
                template: function(item) {
                    var wbs_code = mygantt.getWBSCode(mygantt.getTask(item.id))
                    if (item.$index == 0) {
                        wbs_code = "demo"
                    } else {
                        wbs_code = wbs_code.substring(2)
                    }

                    item.wbs = wbs_code
                    let level = wbs_code.split(".").length;
                    //levelHide
                    if (levelHide[level] == undefined) {
                        let arrId = [];
                        arrId.push(item.id)

                        levelHide[level] = arrId;
                    } else {
                        if (levelHide[level].indexOf(item.id) == -1) {
                            levelHide[level].push(item.id)
                        }
                    }

                    return wbs_code;
                }


            },

            // {
            //     name: "buttons",
            //     label: colHeader,
            //     width: 80,
            //     align: "center",
            //     template: colContent,


            // },


        ]
        //设置前三个固定   后面展示的可以滑动
    var str_time = "<div class='box-time'>" +
        "<div class='time-duration'>工期(天)</div>" +
        "<div class='time-plan-check'>" +
        "<span>设计,勘察,测绘</span>" +
        "<span>复核</span></div></div>";
    var resourceConfig = {

        columns: [

            {
                name: "time",
                label: "工期(天)",
                width: 120,
                align: "center",
                template: function(item) {
                    return item.duration;
                }
            },
            // {
            //     name: "owner",
            //     align: "center",
            //     width: 120,
            //     label: "资源",
            //     template: function (task) {
            //         if (task.type == mygantt.config.types.project) {
            //             return "";
            //         }

            //         var result = [];
            //         var store = mygantt.getDatastore("resource");
            //         var owners = task[mygantt.config.resource_property];

            //         if (!owners || !owners.length) {
            //             return "暂无分配";
            //         }

            //         if (owners.length == 1) {
            //             return store.getItem(owners[0]).text;
            //         }

            //         owners.forEach(function (ownerId) {
            //             var owner = store.getItem(ownerId);

            //             if (!owner)
            //                 return;
            //             result.push(owner.text)

            //         });

            //         return result.join(",");
            //     }
            // },
            {
                name: "start_date",
                label: "开始日期",
                width: 80,
                align: "center",
                resize: true,


            },

            {
                name: "end_date",
                label: "结束日期",
                align: "center",
                width: 80,

                // resize: true
            },
            {
                name: "duration_plan",
                label: "工程量",
                align: "center",
                width: 60,


            },
            {
                name: "my_unit",
                label: "单位",
                align: "center",
                width: 60,
                template: function(item) {
                    if (item.my_unit) {
                        return item.my_unit.text;
                    } else {
                        return "";
                    }

                }


            },
            {
                name: "工效",
                label: "工效",
                align: "center",
                width: 60,
                template: function(item) {
                    var num = item.duration_plan / item.duration;
                    item.effect = num.toFixed(2) + "";
                    if (item.effect == "NaN" || item.effect == "Infinity") {
                        item.effect = "";
                        return ""
                    }
                    return num.toFixed(2) + ""
                }


            },
            {
                name: "里程碑",
                label: "里程碑",
                align: "center",
                width: 60,
                template: function(item) {

                    if ("milestone" == item.$rendered_type) {
                        return "是";
                    } else {
                        return "否";
                    }

                }


            },
            {
                name: "progress",
                label: "进度",
                align: "center",
                width: 60,
                template: function(task) {
                    return Math.round(task.progress * 100) + "%"
                },

            },
            {
                name: "紧前任务",
                label: "紧前任务",
                width: 180,
                align: "center",
                template: function(item) {
                    var json = mygantt.serialize();
                    var link = json.links;
                    var str_before = [];
                    link.forEach(function(element) {

                        if (item.id == element.target) {

                            var index = mygantt.getTask(element.source).$index + 1;
                            let lag = element.lag == "" ? 0 : element.lag;
                            //“0”–“fs完成到开始”，“1”–“ss开始到开始”，“2”–“ff完成到完成”，“3”–“sf开始到完成”
                            let type = element.type + "";
                            switch (type) {
                                case "0":

                                    str_before.push(index + "-FS-" + lag)

                                    break
                                case "1":
                                    str_before.push(index + "-SS-" + lag)

                                    break
                                case "2":
                                    str_before.push(index + "-FF-" + lag)
                                    break
                                case "3":
                                    str_before.push(index + "-SF-" + lag)

                                    break
                            }


                        }
                    });
                    item.task_before = str_before.join(",");
                    return str_before.join(",");
                }
            },

            {
                name: "紧后任务",
                label: "紧后任务",
                width: 180,
                align: "center",
                template: function(item) {
                    var json = mygantt.serialize();
                    var link = json.links;
                    var str_before = [];
                    link.forEach(function(element) {

                        if (item.id == element.source) {
                            var index = mygantt.getTask(element.target).$index + 1;
                            let lag = element.lag == "" ? 0 : element.lag;
                            //“0”–“fs完成到开始”，“1”–“ss开始到开始”，“2”–“ff完成到完成”，“3”–“sf开始到完成”
                            let type = element.type + "";
                            switch (type) {
                                case "0":
                                    str_before.push(index + "-FS-" + lag)
                                    break
                                case "1":
                                    str_before.push(index + "-SS-" + lag)

                                    break
                                case "2":
                                    str_before.push(index + "-FF-" + lag)
                                    break
                                case "3":
                                    str_before.push(index + "-SF-" + lag)

                                    break
                            }

                        }
                    });
                    item.task_after = str_before.join(",");
                    return str_before.join(",");
                }
            },
            {
                name: "搭接",
                label: "搭接工作",
                width: 60,
                align: "center",
                template: function(item) {
                    var json = mygantt.serialize();
                    var link = json.links;
                    var strArr = [];
                    link.forEach(function(element) {
                        if (element.lag != 0) {
                            if (item.id == element.target) {

                                strArr.push(mygantt.getTask(element.source).position)
                            } else if (item.id == element.source) {
                                strArr.push(mygantt.getTask(element.target).position)
                            }
                        }

                    });
                    item.lap_joint_work = strArr.join(",");
                    return strArr.join(",");
                }
            },
            {
                name: "关键路径",
                label: "关键路径",
                width: 60,
                align: "center",
                template: function(item) {
                    if (mygantt.isCriticalTask(mygantt.getTask(item.id))) {
                        item.isCriticalTask = true;
                        return "是"
                    } else {
                        item.isCriticalTask = false;
                        return "否"
                    }
                }
            },
            {
                name: "平行工作",
                label: "平行工作",
                width: 60,
                align: "center",
                template: function(item) {
                    var data = mygantt.serialize().data;

                    var str_time = [];
                    var index = parseInt(item.$index);
                    var before_index = index - 1;
                    var after_index = index + 1;
                    if (data[before_index] != undefined && data[index].start_date == data[before_index].start_date) {
                        str_time.push(before_index + 1)
                    }
                    if (data[after_index] != undefined && data[index].start_date == data[after_index].start_date) {
                        str_time.push(after_index + 1)
                    }
                    item.parallel_work = str_time.join(",");
                    return str_time.join(",")

                }
            },
            {
                name: "earliest_time",
                label: "最早开始时间",
                width: 100,
                align: "center"
            }, {
                name: "latest_start_time",
                label: "最晚开始时间",
                width: 100,
                align: "center"
            }, {
                name: "earliest_end_time",
                label: "最早结束时间",
                width: 100,
                align: "center"
            }, {
                name: "latest_end_time",
                label: "最晚结束时间",
                width: 100,
                align: "center"
            },

            {
                name: "总时差(天)",
                label: "总时差(天)",
                width: 60,
                align: "center",
                template: function(item) {
                    var time = mygantt.getTotalSlack(item);

                    if (time == undefined) {
                        item.total_slack = "0";
                        return "0";
                    } else {
                        item.total_slack = time;
                        return time;
                    }

                }
            }, {
                name: "自由时差",
                label: "自由时差",
                width: 60,
                align: "center",
                template: function(item) {
                    var time = mygantt.getFreeSlack(item);;

                    if (time == undefined) {
                        item.free_float = "0";
                        return "0";
                    } else {
                        item.free_float = time;
                        return time;
                    }

                }
            },
        ]
    };
    // 设置甘特图布局
    mygantt.config.layout = {
        css: "gantt_container",
        rows: [{
                gravity: 15,
                cols: [

                    {
                        width: 340,
                        min_width: 340,
                        rows: [{
                            view: "grid",
                            scrollable: true,
                            scrollY: "scrollVer"
                        }, ]
                    },
                    {
                        resizer: false,
                        width: 1
                    },
                    {
                        width: 300,
                        min_width: 300,
                        rows: [{
                                view: "grid",
                                scrollX: "gridScroll",
                                scrollable: true,
                                bind: "task",
                                scrollY: "scrollVer",
                                config: resourceConfig,

                            },
                            {
                                view: "scrollbar",
                                id: "gridScroll",
                                group: "horizontal"
                            }
                        ]
                    },
                    {
                        resizer: false,
                        width: 1
                    },
                    {
                        rows: [{
                                view: "timeline",
                                scrollX: "scrollHor",
                                scrollY: "scrollVer"
                            },
                            {
                                view: "scrollbar",
                                id: "scrollHor",
                                group: "horizontal"
                            }
                        ]
                    },
                    {
                        view: "scrollbar",
                        id: "scrollVer"
                    }

                ]
            }



        ]


    }

    //格式化日期
    mygantt.config.xml_date = "%Y-%m-%d %H:%i:%s"

    // 放大缩小时间尺度
    var zoomConfig = {
        levels: [{
                name: "day",
                scale_height: 50,
                min_column_width: 80,
                scales: [{
                    unit: "day",
                    step: 1,
                    format: "%d %M"
                }]
            },
            {
                name: "week",
                scale_height: 50,
                min_column_width: 50,
                scales: [{
                        unit: "week",
                        step: 1,
                        format: function(date) {
                            var dateToStr = mygantt.date.date_to_str("%d %M")
                            var endDate = mygantt.date.add(date, -6, "day")
                            var weekNum = mygantt.date.date_to_str("%W")(date)
                            return (
                                "#" +
                                weekNum +
                                ", " +
                                dateToStr(date) +
                                " - " +
                                dateToStr(endDate)
                            )
                        }
                    },
                    {
                        unit: "day",
                        step: 1,
                        format: "%j %D"
                    }
                ]
            },
            {
                name: "month",
                scale_height: 50,
                min_column_width: 120,
                scales: [{
                        unit: "month",
                        format: "%F, %Y"
                    },
                    {
                        unit: "week",
                        format: "Week #%W"
                    }
                ]
            },
            {
                name: "quarter",
                height: 50,
                min_column_width: 90,
                scales: [{
                        unit: "month",
                        step: 1,
                        format: "%M"
                    },
                    {
                        unit: "quarter",
                        step: 1,
                        format: function(date) {
                            var dateToStr = mygantt.date.date_to_str("%M")
                            var endDate = mygantt.date.add(
                                mygantt.date.add(date, 3, "month"), -1,
                                "day"
                            )
                            return (
                                dateToStr(date) + " - " + dateToStr(endDate)
                            )
                        }
                    }
                ]
            },
            {
                name: "year",
                scale_height: 50,
                min_column_width: 30,
                scales: [{
                    unit: "year",
                    step: 1,
                    format: "%Y"
                }]
            }
        ]
    }



    mygantt.ext.zoom.init(zoomConfig)
    mygantt.ext.zoom.setLevel("day")
        //	$('#gantt_here').get(0)

    //初始化甘特图
    //  mygantt.init($('#gantt_here', modelGantt.dom).get(0));

    mygantt.init($('#gantt_here').get(0));



    //任务条右侧显示任务名称
    mygantt.templates.rightside_text = function(start, end, task) {
        // 如果逾期 显示逾期日期
        if (task.planned_end) {
            if (end.getTime() > task.planned_end.getTime()) {
                var overdue = Math.ceil(
                    Math.abs(
                        (end.getTime() - task.planned_end.getTime()) /
                        (24 * 60 * 60 * 1000)
                    )
                )
                var text = "<b style='color:red'>逾期: " + overdue + " 天</b>"
                    //return task.text + " " + text
                return text
            }
        }
        return ""
    }


    // 给选择的任务添加样式
    mygantt.templates.task_class = mygantt.templates.grid_row_class = mygantt.templates.task_row_class = function(
        start,
        end,
        task
    ) {
        if (mygantt.isSelectedTask(task.id)) return "gantt_selected"
    };
    (function() {
            function shiftTask(task_id, direction) {
                var task = mygantt.getTask(task_id)
                task.start_date = mygantt.date.add(
                    task.start_date,
                    direction,
                    "day"
                )
                task.end_date = mygantt.calculateEndDate(
                    task.start_date,
                    task.duration
                )
                mygantt.updateTask(task.id)
            }

            var actions = {
                indent: function indent(task_id) {
                    var prev_id = mygantt.getPrevSibling(task_id)
                    while (mygantt.isSelectedTask(prev_id)) {
                        var prev = mygantt.getPrevSibling(prev_id)
                        if (!prev) break
                        prev_id = prev
                    }
                    if (prev_id) {
                        var new_parent = mygantt.getTask(prev_id)
                        mygantt.moveTask(
                            task_id,
                            mygantt.getChildren(new_parent.id).length,
                            new_parent.id
                        )
                        new_parent.type = mygantt.config.types.project
                        new_parent.$open = true
                        mygantt.updateTask(task_id)
                        mygantt.updateTask(new_parent.id)
                        return task_id
                    }
                    return null
                },
                outdent: function outdent(
                    task_id,
                    initialIndexes,
                    initialSiblings
                ) {
                    var cur_task = mygantt.getTask(task_id)
                    var old_parent = cur_task.parent
                    if (
                        mygantt.isTaskExists(old_parent) &&
                        old_parent != mygantt.config.root_id
                    ) {
                        var index = mygantt.getTaskIndex(old_parent) + 1
                        var prevSibling = initialSiblings[task_id].first

                        if (mygantt.isSelectedTask(prevSibling)) {
                            index +=
                                initialIndexes[task_id] -
                                initialIndexes[prevSibling]
                        }
                        mygantt.moveTask(
                            task_id,
                            index,
                            mygantt.getParent(cur_task.parent)
                        )
                        if (!mygantt.hasChild(old_parent))
                            mygantt.getTask(old_parent).type =
                            mygantt.config.types.task
                        mygantt.updateTask(task_id)
                        mygantt.updateTask(old_parent)
                        return task_id
                    }
                    return null
                },
                del: function(task_id) {
                    if (mygantt.isTaskExists(task_id)) mygantt.deleteTask(task_id)
                    return task_id
                },
                moveForward: function(task_id) {
                    shiftTask(task_id, 1)
                },
                moveBackward: function(task_id) {
                    shiftTask(task_id, -1)
                }
            }
            var cascadeAction = {
                indent: true,
                outdent: true,
                del: true
            }

            mygantt.performAction = function(actionName) {
                var action = actions[actionName]
                if (!action) return

                // updates multiple tasks/links at once
                mygantt.batchUpdate(function() {
                    // need to preserve order of items on indent/outdent,
                    // remember order before changing anything:
                    var indexes = {}
                    var siblings = {}
                    mygantt.eachSelectedTask(function(task_id) {
                        indexes[task_id] = mygantt.getTaskIndex(task_id)
                        siblings[task_id] = {
                            first: null
                        }

                        var currentId = task_id
                        while (
                            mygantt.isTaskExists(
                                mygantt.getPrevSibling(currentId)
                            ) &&
                            mygantt.isSelectedTask(
                                mygantt.getPrevSibling(currentId)
                            )
                        ) {
                            currentId = mygantt.getPrevSibling(currentId)
                        }
                        siblings[task_id].first = currentId
                    })

                    var updated = {}
                    mygantt.eachSelectedTask(function(task_id) {
                        if (cascadeAction[actionName]) {
                            if (!updated[mygantt.getParent(task_id)]) {
                                var updated_id = action(
                                    task_id,
                                    indexes,
                                    siblings
                                )

                                updated[updated_id] = true
                            } else {
                                updated[task_id] = true
                            }
                        } else {
                            action(task_id, indexes)
                        }
                    })
                })
            }



        }

    )()
    var btnFunc = function(name) {
        mygantt.performAction(name)
    }
    mygantt.attachEvent("onTaskDblClick", function(id, e) {
        //any custom logic here
        $('.gantt_container  .gantt-task-compile').trigger("click");
        //  dialogEdit(id, false);

        return false;
    });


    //获取弹框内容的js
    var div = document.querySelectorAll("#tab div");
    var box = document.querySelectorAll(".message");


    //tab标签切换
    for (let i = 0; i < div.length; i++) {
        div[i].onclick = function() {

            for (let k = 0; k < box.length; k++) {
                div[k].classList.remove("active");
                box[k].style.display = "none";
            }
            this.classList.add("active");
            box[i].style.display = "block";
        }
    }

    // switch开关
    $("#switchAnim").on("change", function() {
        if ($('.switch-anim').prop('checked')) {
            console.log("选中");
        } else {
            console.log("没选中");
        }
    })

    var resign_task = document.getElementById("resign_task");
    //点击select的option 获取value值
    $('.gantt_container #choose').change(function() {
        var index = $(this).children('option:selected').val();
        if (index == 2) {
            resign_task.style.display = "block";
            $(".select1-name").select2({
                placeholder: '请选择名称',
                data: childOneArr
            });
            $(".select1-name").val(['']).trigger('change');
        } else {
            resign_task.style.display = "none";

        }
    })

    $("#task_one").on("click", function() {
        addrow1();
    })

    // 增行
    function addrow1() {
        var i = $("#table1 tbody tr").length;
        var tr = `<tr>
                    <td class="td">${i + 1}</td>
					
					<td>
						<select name="" class="select1-name" style="width: 100%;height: 100%;">
                                   
						</select></td>
                </tr>`;

        $("#table1 tbody").append(tr);
        var tr = $("#table1 tbody tr");
        for (var i = 0; i < tr.length; i++) {
            bgcChange(tr[i]);
        }
        $("tr .select1-name").eq(i - 1).select2({
            placeholder: '请选择名称',
            data: childOneArr
        });
        $("tr .select1-name").eq(i - 1).val(['']).trigger('change');

    }
    $("#task_two").on("click", function() {
        addrow2();
    })

    // 增行
    function addrow2() {
        var i = $("#table2 tbody tr").length;
        var tr = `<tr>
                            <td class="td">${i + 1}</td>
                            <td>
                                <input class="table2-name" type="text" placeholder="请输入名称">
                            </td>
                            <td>
                                <input class="table2-describe" type="text" placeholder="请输入描述" style="width: 100%;
                                    height: 100%;">
                            </td>
                        </tr>`;

        $("#table2 tbody").append(tr);
        var tr = $("#table2 tbody tr");
        for (var i = 0; i < tr.length; i++) {
            bgcChange(tr[i]);
        }
    }
    $("#task_delete_check").on("click", function() {
        delrow("table1");
    })
    $("#task_delete_detail").on("click", function() {
        delrow("table2");
    })
    $("#task_delete_before").on("click", function() {
            if (beforeTask) {
                delrow("table3");
            }

        })
        //删行
    function delrow(id) {
        var len = $("tbody tr").length;
        if (len > 1) {

            $("tbody .move").remove();

        }

        numCheck(id);
    }
    $(".uprow").on("click", function() {

            uprow($(this).attr("index"));
        })
        //上移
    function uprow(id) {

        if ($('.move').prev().html() == null) {
            // 判断前一个tr是否为空
            return;
        } else {
            $('.move').insertBefore($('.move').prev());
        }
        numCheck(id);
    }
    $(".downrow").on("click", function() {

            downrow($(this).attr("index"));
        })
        //下移
    function downrow(id) {
        if ($('.move').next().html() == null) {
            // 判断后一个tr是否为空
            return;
        } else {
            $('.move').insertAfter($('.move').next());
        }
        numCheck(id);
    }
    //前面的序号1,2,3...... 
    function numCheck(id) {
        var i = 1;
        var str = "#" + id + " .td"

        $(str).each(function() {
            $(this).html(i++);
        })

    }
    $("#task_three").on("click", function() {
        if (beforeTask) {
            addrow3();
        }


    })

    // 增行
    function addrow3() {
        var i = $("#table3 tbody tr").length;
        var tr = `<tr>
							<td class="td">${i + 1}</td>
							<td class="td-source"></td>
							<td>
								<select class="table3-name" name=""  style="width: 100%;height: 100%;">
									
									
								</select>
							
								</td>
                            <td>
                                <select class="table3-type" name="" style="width: 100%;height: 100%; padding: 5px 0px;">
									<option value="请选择类型">请选择类型</option>
									<option >FS</option>
									<option >FF</option>
									<option >SF</option>
									<option >SS</option>
                                </select>
                            </td>
                            <td>
                                <input type="number" placeholder="请输入间隔时间" style="width: 100%;
                                height: 100%;">
							</td>
							<td class="before_task_id"></td>
                        </tr>`;

        $("#table3 tbody").append(tr);
        var tr = $("#table3 tbody tr");
        for (var i = 0; i < tr.length; i++) {
            bgcChange(tr[i]);
        }
        $("#table3 tbody tr").eq(i - 1).find("select").eq(0).select2({
            placeholder: '请选择',
            data: allData.name
        });

        $("#table3 tbody tr").eq(i - 1).find("select").eq(0).select2("val", " ");



        $(".table3-name").change(function() {

            var index = $(this).find("option:checked")[0].index;
            if (index != 0) {

                var td = $(this).parent().prev().text(allData.name[index - 1].id);
            }


        })

    }
    // 鼠标移动改变背景,可以通过给每行绑定鼠标移上事件和鼠标移除事件来改变所在行背景色。
    function bgcChange(obj) {
        obj.onmouseover = function() {
            obj.style.backgroundColor = "#f2f2f2";
        }
        obj.onmouseout = function() {
            obj.style.backgroundColor = "#fff";
        }
    }

    window.onload = function() {
        var tr = document.getElementsByTagName("tr");
        for (var i = 0; i < tr.length; i++) {
            bgcChange(tr[i]);
        }

        $('tbody').on('click', 'tr', function() {
            $('tr').removeClass();
            $(this).addClass('move')
        })
    }



    $(".close").on("click", function() {
        $(".box-container").hide();
        clearInputData();
    })
    $(".cancle").on("click", function() {

            $(".box-container").hide();
            clearInputData();
        })
        //清空输入的数据
    function clearInputData() {
        $(".gantt_select .selct_data").html("")
        $(".gantt_select_data").html("")




        //清空输入的数据
        $(".message input").val("")
            //设置切换
        for (let i = 0; i < 1; i++) {
            for (let k = 0; k < box.length; k++) {
                div[k].classList.remove("active");
                box[k].style.display = "none";
            }
            div[i].classList.add("active");
            box[i].style.display = "block";
        }
        //

        $("#table1 tbody").html(`<tr>
											<td class="td">1</td>
											
											<td>
												<select name="" class="select1-name" style="width: 100%;height: 100%;">
													
												</select></td>
										</tr>`)
        $("#table2 tbody").html(`	<tr>
									<td class="td">1</td>
									<td>
										<input type="text" placeholder="请输入名称">
									</td>
									<td>
										<input type="text" placeholder="请输入描述" style="width: 100%;
													height: 100%;">
									</td>
								</tr>`)
        $("#table3 tbody").html(`	<tr>
									<td class="td">1</td>
									<td class="td-source"></td>
									<td><select class="table3-name" name="" id="" style="width: 100%;height: 100%;">
											
										</select>
									
										</td>
									<td>
										<select class="table3-type" name="" id="" style="width: 100%;height: 100%;padding: 5px 0px;">
											<option value="请选择类型">请选择类型</option>
											<option>FS</option>
											<option>FF</option>
											<option>SF</option>
											<option>SS</option>

										</select>
									</td>
									<td>
										<input type="number" placeholder="请输入间隔时间" style="width: 100%;
												height: 100%;">
									</td>
									<td class="before_task_id"></td>
								</tr>`)
        $(".save").off("click");

    }

    var beforeTask = true; //编辑任务的近前任务可以增加  删除   
    var childOneArr = [];
    var beforeThreeTask = [];
    var allData = {};
    var oldBefore = []; //设置原有紧前关系

    //编辑数据  flag  flase  表示编辑
    function dialogEdit(id, flag, index) {

        // if (!flag) {
        //     //progect  类型的任务不能编辑
        //     var task = mygantt.getTask(id);
        //     if (task.type == "project") {
        //         return
        //     }
        // }
        var task = mygantt.getTask(id);
        if ("milestone" !== task.$rendered_type) {
            //需要设置专业
            $('.gantt_container .gannt-major').val([task.major.id]).trigger('change');
            //编辑的时候不能修改专业
            $('.gantt_container .gannt-major').prop("disabled", true);
        }



        //设置资源
        selectResource = selectRecouseDilog(task)
        for (let key in allSelectRecouse) {
            let v = allSelectRecouse[key];
            let eleDiv = document.createElement("div");
            let eleInput = document.createElement("input");
            let eleSapn = document.createElement("span");
            $(eleDiv).attr("class", "selct_data_line");
            $(eleInput).attr("type", "checkbox");
            $(eleInput).attr("value", v.text);
            $(eleInput).attr("id", v.id);
            $(eleSapn).text(v.text);
            if (selectResource[v.id] != undefined || selectResource[v.id] != null) {
                $(eleInput).attr("checked", true);
            }
            $(eleDiv).append(eleInput);
            $(eleDiv).append(eleSapn);

            $(".selct_data").append(eleDiv)
        }

        $(".selct_data").hide();
        $(".save").off("click");
        $(".box-container").show();
        $(".save").on("click", function() {
            saveGanntTask(id, flag, index);
        })
        allData = getTaskNameId();
        $('.table3-name').select2({
            placeholder: '请选择',
            data: allData.name
        });



        $(".table3-name").select2("val", " ");

        if (flag) {
            $("#choose").removeAttr("disabled")
            $(".add_task span").eq(0).text("添加任务")
            childOneArr = getChildren(task);
            $(".select1-name").select2({
                placeholder: '请选择名称',
                data: childOneArr
            });

            return
        } else {
            $(".add_task span").eq(0).text("编辑任务")
        }
        let datetime = chineseMarkingTime(new Date(task.start_date));

        $(".item_start_time").val(datetime)

        $(".item-name").val(task.text);
        $(".item-duration").val(task.duration)
        $('.gantt_container .table3-name').prop("disabled", false);
        $('.gantt_container .table3-type').prop("disabled", false);
        $('.gantt_container .number').prop("disabled", false);
        switch (task.task_type) {
            case "1":
                //表示设计任务
                $(".item-name").attr("disabled", true)
                $(".item-plan").attr("disabled", true)
                beforeTask = true;

                break
            case "3":
                $(".item-name").attr("disabled", true)
                $(".item-plan").attr("disabled", true)
                beforeTask = false;
                $('.gantt_container .table3-name').prop("disabled", true);
                $('.gantt_container .table3-type').prop("disabled", true);
                $('.gantt_container .number').prop("disabled", true);

                //表示复核任务
                break
            case "2":
                //表示审核任务
            case "4":
                //表示摘要任务
                $(".item-name").attr("disabled", false)
                $(".item-plan").attr("disabled", false)
                beforeTask = true;
                break
        }



        if (task.task_type == "2" && task.type !== "milestone") {
            //审核任务

            resign_task.style.display = "flex";
            $("#choose").val("2")


            //添加审核任务的数据

            childOneArr = getChildren(task);

            $(".select1-name").select2({
                placeholder: '请选择名称',
                data: childOneArr
            });

            $(".select1-name").val(['']).trigger('change');
            //    $("tr .select1-name").eq(i - 1).val(['']).trigger('change');

            if (task.review_task != undefined && task.review_task.length != 0) {

                for (var i = 0; i < task.review_task.length; i++) {


                    $('.select1-name').eq(i).val([task.review_task[i].id]).trigger('change');
                    addrow1();


                }
            }
        } else {
            $("#choose").val(task.task_type)

            resign_task.style.display = "none";

        }

        //如果是编辑  任务类型不能改变

        $("#choose").attr("disabled", true)




        $(".item-plan").val(task.duration_plan);


        if ("milestone" == task.$rendered_type) {

            $(".isEditeMilestone").hide()
            $(".switch-anim").prop("checked", true)
        } else {
            $('.item-unit').val([task.my_unit.id]).trigger('change');
            //设置专业审核
            $(".gannt-major").val([task.major.id]).trigger('change');
            $(".switch-anim").prop("checked", false)
            $(".isEditeMilestone").show()
        }
        $(".switch-anim").attr("disabled", true)
            //设置任务明细数据
        if (task.describe != undefined && task.describe.length != 0) {
            for (let i = 0; i < task.describe.length; i++) {

                let input = $("#table2 tbody tr").eq(i).find("input");

                $(input[0]).val(task.describe[i].name);
                $(input[1]).val(task.describe[i].explain);
                addrow2();
            }
        }
        //获取紧前任务
        let allbefore = getBeforeTask(id);

        beforeThreeTask = allbefore["beforeArr"];
        oldBefore = allbefore["oldBefore"]



        for (let i = 0; i < beforeThreeTask.length; i++) {

            $("#table3 tbody tr").eq(i).find("input").val(beforeThreeTask[i].lag)
            let select = $("#table3 tbody tr").eq(i).find("select");
            $(select[0]).val([beforeThreeTask[i].id]).trigger('change');

            $(select[1]).val(beforeThreeTask[i].type);
            $("#table3 tbody tr .before_task_id").eq(i).text(beforeThreeTask[i].taskid)
            if (task.task_type !== "3") {
                addrow3();
            }


        }



    }
    //新增
    $(".ganttNewAddTask").on("click", function() {
        //新增任务
        ganttNewTaskSelect();
    })




    //插入
    $("#insertion").on("click", function() {
            let selectid = mygantt.getSelectedId();
            if (selectid == null) {
                showError("请选择插入的位置")
                return;
            }
            let selectTask = mygantt.getTask(selectid);


            let parentid = selectTask.parent;

            let childrenId = mygantt.getChildren(parentid)
            for (let i = 0; i < childrenId.length; i++) {
                if (childrenId[i] == selectid) {
                    position = i
                }
            }
            ++position
            console.log(position)

            let rank = selectTask.$wbs.split(".").length;

            if (rank === 1 || rank === 4) {
                showError("不能插入任务")
                return;
            }
            $(".gantt_container #add-task-parentid").text(parentid)

            $(".gantt_container #add-task-parentid").attr("index", 1)
            $(".gantt_container #add-task-parentid").attr("position", position)

            switch (rank) {
                case 2:
                    $(".gantt_container .container-add-task").toggle()
                    $(".gannt-add-task-name").text("新增任务")
                    $(".gantt_container #add-task-start-time").prop("disabled", false);
                    $(".gantt_container #add-task-end-status").prop("disabled", false);
                    $('.gantt_container .gantt-add-task-box-item-select').prop("disabled", false);
                    //  $(".gantt_container #gantt-add-task-box-items").show();
                    $(".gantt_container #add-task-status").text("工作包")

                    break;
                case 3:
                    ganttAbstractTask(parentid, position)
                    break


            }


        })
        //数据保存
        //flag  true 表示创建    false  表示修改
    function saveGanntTask(id, flag, index) {

        let reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/


        var newData = {};
        var start_time = $(".item_start_time").val();
        if (start_time == "") {
            showError("请输入任务开始时间")
            return
        }
        let taskStartTime = new Date(start_time);

        newData["start_date"] = new Date(taskStartTime.getFullYear(), taskStartTime.getMonth(), taskStartTime.getDate());
        var name = $(".item-name").val();
        if (name == "") {
            showError("请输入任务名称")
            return
        }
        newData["text"] = name;
        if ($("#switchAnim").prop("checked")) {
            newData["type"] = "milestone";

        } else {
            newData["type"] = "task";
            var item_plan = $(".item-plan").val();

            if (!reg.exec(item_plan)) {
                showError("请输入正确的工程量")
                return
            }


            newData["duration_plan"] = item_plan;
            let item_id = $(".item-unit").val();
            let item_name = $(".item-unit").find("option:selected").text();
            if (item_id == "") {
                showError("请输入工程量单位")
                return
            }

            newData["my_unit"] = {
                "text": item_name,
                "id": item_id
            };
            let item_magorId = $(".gannt-major").val();
            let item_magorName = $(".gannt-major").find("option:selected").text();
            if (item_magorId == "") {
                showError("请输入专业")
                return
            }

            newData["major"] = {
                "text": item_magorName,
                "id": item_magorId
            };


        }







        let item_duration = $(".item-duration").val();

        if (!reg.exec(item_duration)) {
            showError("请输入正确的工期")
            return
        }


        newData["duration"] = item_duration;
        let task_type = $("#choose").val();


        newData["task_type"] = task_type;
        if (2 == task_type) {

            //专业审核

            let review_task = [];
            for (let i = 0; i < $("#table1 tbody tr").length; i++) {

                let ids = $("#table1 tbody tr").eq(i).find("select").val();
                let names = $("#table1 tbody tr").eq(i).find("select").find("option:selected").text();

                if (names != null && names != "" && names != "请选择名称") {
                    review_task.push({
                        text: names,
                        id: ids
                    })
                }


            }
            newData["review_task"] = review_task;
        } else {
            //一般任务


            newData["review_task"] = [];
        }



        //获取项目明细的值
        var describe = [];
        for (let i = 0; i < $("#table2 tbody tr").length; i++) {
            let inp = $("#table2 tbody tr").eq(i).find("input");
            let names = $(inp[0]).val();
            let explains = $(inp[1]).val();

            if (names != "" && explains != "") {

                describe.push({
                    name: names,
                    explain: explains
                })

            }
        }


        newData["describe"] = describe;

        mygantt.ext.undo.saveState(id, "task");

        if (flag && id == 0) {
            newData["id"] = allData.maxId + 1;
            newlinks = getNewLikes(newData["id"]);


            mygantt.addTask(newData, null, 1);



            $(".box-container").hide();
            clearInputData();
            return
        }
        var task = mygantt.getTask(id);


        if (flag) {

            newData["id"] = allData.maxId + 1;

            //添加

            newlinks = getNewLikes(newData["id"]);
            if (index == undefined || index == null) {
                mygantt.addTask(newData, id);
            } else {

                mygantt.addTask(newData, id, index);

            }

        } else {
            //如果是摘要任务 并且不是里程碑  如果名称或者工程量修改  需要修改它子任务的名称 和工程量
            if (task["task_type"] === "4" && task["type"] !== "milestone") {
                //如果名称  或者
                if (task["text"] !== newData["text"] || task["duration_plan"] !== newData["duration_plan"]) {

                    //根据父id  获取所有的子任务
                    let delete_id = mygantt.getChildren(id);
                    delete_id.forEach(v => {
                        let childrenTask = mygantt.getTask(v)
                        if (childrenTask["task_type"] === "1") {
                            childrenTask["text"] = newData["text"] + "设计"
                        } else {
                            childrenTask["text"] = newData["text"] + "复核"
                        }
                        childrenTask["duration_plan"] = newData["duration_plan"];
                        mygantt.updateTask(v);

                    });

                }

            }
            //判断修改的任务是不是 专业审核任务 
            if (task["task_type"] === "2") {
                task["review_task"].forEach(element => {
                    if (JSON.stringify(newData["review_task"]).indexOf(element.id) == -1) {
                        //表示这个审核任务删除了 
                        let checkTask = mygantt.getTask(element.id);
                        checkTask["check_id"] = "";
                        mygantt.updateTask(element.id);
                    }
                });

                newData["review_task"].forEach(element => {
                    if (JSON.stringify(task["review_task"]).indexOf(element.id) == -1) {
                        //表示添加了新的审核任务 
                        let checkTask = mygantt.getTask(element.id);
                        checkTask["check_id"] = task["id"];
                        mygantt.updateTask(element.id);
                        console.log(element.text)
                    }
                });
            }

            //修改
            for (var p in newData) {
                if (task[p] != newData[p]) {


                    task[p] = newData[p];

                }

            }


            let taskEnd = mygantt.calculateEndDate(new Date(start_time), task.duration)

            task.end_date = new Date(taskEnd.getFullYear(), taskEnd.getMonth(), taskEnd.getDate())
            mygantt.updateTask(id);
            var links = getNewLikes(id);
            //获取删除的  新增的  改变的  
            let addlinks = [];
            let deleteLikes = [];
            let updateLikes = [];

            for (let i in oldBefore) {
                if (links[i] != undefined) {
                    for (let key in oldBefore[i]) {
                        if (oldBefore[i][key] != links[i][key]) {
                            updateLikes.push(links[i])
                        }
                    }
                } else {
                    //删除
                    deleteLikes.push(oldBefore[i]["id"])
                }


            }

            for (let key in links) {
                if (oldBefore[key] == undefined) {
                    //表示没有这个数据  新增的
                    addlinks.push(links[key])
                }
            }

            //修改链接的关系

            addlinks.forEach(function(v) {
                mygantt.addLink(v);

            });

            deleteLikes.forEach(function(v) {
                mygantt.deleteLink(v);
            });

            updateLikes.forEach(function(v) {
                for (let key in v) {
                    mygantt.getLink(v.id)[key] = v[key]
                }
                mygantt.updateLink(v.id);

            });
            mygantt.render()
        }
        $(".box-container").hide();
        clearInputData();
        resourceTimes = {};
    }


    //获取任务类型是task的任务  wbs  是4级的
    function getChildren(task) {
        var json = mygantt.serialize().data
        var childArr = [];
        if (task.major && task.major["id"]) {
            json.forEach(function(element) {
                if (element.task_type == "4") {
                    if (element.major && element.major["id"] && task.major["id"] == element.major["id"]) {
                        if (element.check_id == "" || task.id == element.check_id) {
                            var child = {
                                text: element.text,
                                id: element.id
                            }
                            childArr.push(child);
                        }


                    }

                }


            });
        }




        return childArr;
    }

    //获取紧前任务
    function getBeforeTask(id) {
        let json = mygantt.serialize();
        let jsonBefore = {};
        let beforeArr = [];
        //获取自己原有的紧前关系
        let oldbefore = {};
        //获取自己原有的紧前任务
        json.links.forEach(function(element) {
            if (id == element.target) {

                let before = {};

                oldbefore[element.id] = element;

                before["lag"] = element.lag;

                //“0”–“fs完成到开始”，“1”–“ss开始到开始”，“2”–“ff完成到完成”，“3”–“sf开始到完成”
                let type = element.type + ""
                switch (type) {
                    case "0":
                        before["type"] = "FS";
                        break;
                    case "1":
                        before["type"] = "SS";
                        break
                    case "2":
                        before["type"] = "FF";
                        break
                    case "3":
                        before["type"] = "SF";
                        break

                }
                before["name"] = mygantt.getTask(element.source).text;
                before["id"] = element.source;
                before["taskid"] = element.id;
                beforeArr.push(before)

            }
        });
        jsonBefore["beforeArr"] = beforeArr;
        jsonBefore["oldBefore"] = oldbefore;
        return jsonBefore;

    }
    //获取任务所有的名称和id 链接关系
    function getTaskNameId() {
        var allData = {
            name: [],
            linkId: 0,
            maxId: 0
        }
        var json = mygantt.serialize();
        json.data.forEach(function(element) {
            allData.name.push({
                text: element.text,
                id: element.id
            });
            if (allData.maxId < element.id) {
                allData.maxId = element.id;
            }
        });

        json.links.forEach(function(element) {
            if (allData.linkId < element.id) {
                allData.linkId = element.id;
            }
        });


        return allData;

    }

    function showError(message) {
        alert(message);
    }

    //获取任务链关系
    function getNewLikes(id) {
        //近前任务
        var newLinks = {};


        for (let i = 0; i < $("#table3 tbody tr").length; i++) {

            let tr = $("#table3 tbody tr").eq(i);
            let select = tr.find("select");
            let taskid = $("#table3 tbody tr .before_task_id").eq(i).text();
            let inp = tr.find("input");
            let name = $(select[0]).val();
            let type = $(select[1]).val();
            let lag = inp.val();
            if (name != null && type != "请选择类型") {
                let task = {};
                switch (type) {
                    case "FS":
                        task["type"] = 0;
                        break;
                    case "SS":
                        task["type"] = 1;
                        break
                    case "FF":
                        task["type"] = 2;
                        break
                    case "SF":
                        task["type"] = 3;
                        break

                }

                task["source"] = name;
                task["lag"] = lag;
                task["target"] = id;
                if (taskid != "") {
                    task["id"] = taskid;
                } else {
                    task["id"] = (parseInt(allData.linkId) + 1 + i);
                }

                newLinks[task["id"]] = task

            }

        }
        return newLinks;
    }
    $("#ganttSwitch").on("click", function() {
        var json = mygantt.serialize();


        var changeJson = differentiationData(json)
        let flag = false;
        for (let key in changeJson) {
            if (changeJson[key].length != 0) {
                flag = true;
            }
        }
        if (flag) {
            modelGantt.invoke("ganttSwitch", JSON.stringify(changeJson));

        }

    })


    $("#ganttSubmitData").on("click", function() {
        var json = mygantt.serialize();


        var changeJson = differentiationData(json)
        let flag = false;
        for (let key in changeJson) {
            if (changeJson[key].length != 0) {
                flag = true;
            }
        }

        modelGantt.invoke("isExit", flag);

    })
    $(".ganttSave").on("click", function() {


            var json = mygantt.serialize();
            console.log(JSON.stringify(json))

            var changeJson = differentiationData(json)
            let flag = false;
            for (let key in changeJson) {
                if (changeJson[key].length != 0) {
                    flag = true;
                }
            }
            if (flag) {
                modelGantt.invoke("Ganttsave", JSON.stringify(changeJson));

            } else {
                showError("暂无数据改变")
            }




        })
        //获取差异化的数据
    function differentiationData(json) {
        let changeJson = {};
        var changeData = [];
        var deleteid = [];
        var addData = [];
        md5Final = [];
        md5FinalId = [];
        var changeLikes = [];
        var deleteLikesId = [];
        var addLikes = [];

        json.data.forEach(function(v) {

            md5Final.push({

                id: v.id,
                md5: md5(JSON.stringify(v)),
                item: v

            });
            md5FinalId.push(v.id);

        });

        json.links.forEach(function(v) {
            finakLikes.push({
                id: v.id,
                md5: md5(JSON.stringify(v)),
                item: v
            })
            finakLikesId.push(v.id)

        })


        //获取删除的数据id  
        md5StartId.forEach(function(ele) {
            if (md5FinalId.indexOf(ele) == -1) {
                deleteid.push(ele)
            }

        });

        startLikesId.forEach(function(ele) {
            if (finakLikesId.indexOf(ele) == -1) {
                deleteLikesId.push(ele)
            }
        })



        //获取修改的数据  和新增的数据
        md5Final.forEach(function(ele) {
            var flag = false;
            md5Start.forEach(function(element) {
                if (ele.id == element.id) {
                    flag = true;
                    if (ele.md5 != element.md5) {
                        let status = false;
                        for (let key in ele.item) {
                            if (ele.item[key] != element.item[key]) {
                                status = true;
                            }

                        }

                        if (status) {
                            changeData.push(ele.item)
                        }

                    }

                    return
                }

            });

            if (!flag) {
                addData.push(ele.item)
            }

        });


        finakLikes.forEach(function(ele) {

            var flag = false;
            startLikes.forEach(function(element) {
                if (ele.id == element.id) {
                    flag = true;
                    if (ele.md5 != element.md5) {
                        changeLikes.push(ele.item)
                    }

                    return
                }

            });

            if (!flag) {
                addLikes.push(ele.item)
            }

        })
        changeJson["changeData"] = changeData,
            changeJson["deleteid"] = deleteid;
        changeJson["addData"] = addData;
        changeJson["addLikes"] = addLikes;
        changeJson["changeLikes"] = changeLikes;
        changeJson["deleteLikesId"] = deleteLikesId;



        return changeJson;
    }



    var data_method = {
        edit: function(id) {

            dialogEdit(id, false);
        },
        add: function(id) {
            dialogEdit(id, true);
        },
        setData: function(ganttFatherAndChilderns) {

            ganttFatherAndChildern = ganttFatherAndChilderns
            console.log("ooo")
        }

    }
    setDataMethod(data_method, mygantt);



    let selectResource = {};
    $(" .gantt_select").on("click", function(event) {
        if ($(event.target).hasClass("gantt_select")) {
            $(".selct_data").fadeToggle()
        }


    })
    $(".selct_data").on("click", ".selct_data_line input", function() {
        if ($(this).prop("checked")) {
            selectResource[$(this).attr("id")] = $(this).attr("value")
        } else {
            delete selectResource[$(this).attr("id")];

        }
        let strData = [];
        for (let key in selectResource) {
            strData.push(selectResource[key])
        }
        $(".gantt_select_data").text(strData.join(","))


    })
    $(".gantt_select_data").on("click", function() {
        if ($(event.target).hasClass("gantt_select_data")) {
            $(".selct_data").fadeToggle()
        }
    })

    function selectRecouseDilog(task) {
        var result = {};
        if (task.type == mygantt.config.types.project) {
            return result;
        }


        var store = mygantt.getDatastore("resource");
        var owners = task[mygantt.config.resource_property];

        if (!owners || !owners.length) {
            return result;
        }
        let strData = [];

        owners.forEach(function(ownerId) {
            var owner = store.getItem(ownerId);

            if (!owner)
                return;
            result[ownerId] = owner.text;

        });

        for (let key in result) {
            strData.push(result[key])
        }
        $(".gantt_select_data").text(strData.join(","))
        return result;
    }
    //点击隐藏 
    $(".rankHide").on("click", function() {

            mygantt.close("23738b34-7b9c-4fa4-a59c-3369de67002c");
        })
        //编辑点击
    $(".ganntCompile").on("click", function() {
        md5Start = [];
        md5StartId = [];
        startLikes = [];
        startLikesId = [];

        var json = mygantt.serialize();

        json.data.forEach(function(ele) {

            md5Start.push({

                id: ele.id,
                md5: md5(JSON.stringify(ele))


            });

            md5StartId.push(ele.id);


        });

        json.links.forEach(function(element) {
            startLikes.push({
                id: element.id,
                md5: md5(JSON.stringify(element))
            });
            startLikesId.push(element.id)
        });



        editingMethods()
    })




}


var selectid = 0

function searchNumber() {

    mygantt.unselectTask(selectid);
    selectid = mygantt.serialize().data[$("#search").val() - 1].id;

    mygantt.selectTask(mygantt.serialize().data[$("#search").val() - 1].id)
    mygantt.scrollTo(0, ($("#search").val() - 1) * 42);



}
//保存之后需要的操作
function editingMethodsGantt() {
    $(".buttonToggle").toggle();
    $(".ganntCompile").toggle();


}