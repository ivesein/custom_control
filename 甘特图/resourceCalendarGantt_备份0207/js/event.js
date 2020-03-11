function btnFunc(name) {
    mygantt.performAction(name)
}
//缩放按钮功能
function zoomIn() {
    mygantt.ext.zoom.zoomIn()
}

function zoomOut() {
    mygantt.ext.zoom.zoomOut()
}
//后退
function retreat() {

    mygantt.ext.undo.undo()
}
//前进
function advance() {
    mygantt.ext.undo.redo();



}

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

//设置删除任务的id


function clickGridButton(position, action) {
    var json = mygantt.serialize();
    id = json["data"][position - 1]["id"]
    switch (action) {
        case "edit":

            data_method.edit(id)

            break
        case "add":
            data_method.add(id);

            break
        case "delete":
            gantt_delete_task(id)
                //  

            break
    }
}
var gantt_delete_id = [];
//删除任务
function gantt_delete_task(id) {
    let selectTask = mygantt.getTask(id);
    let rank = selectTask.$wbs.split(".").length;

    if (rank === 1) {
        ganttShowMessaeg("不能删除主任务")
        return;
    }
    if (rank === 4) {
        ganttShowMessaeg("不能单独删除设计任务或者复核任务")
        return;
    }

    let delete_id = getDeleteTaskMessage(id);

    let delete_name = [];
    delete_id.forEach(function(v) {
        //判断任务是不是审核任务或者摘要任务  

        let deleteTask = mygantt.getTask(v);
        delete_name.push(deleteTask.text)

    });
    if (delete_name.length == 0) {
        $(".delete-task-name-explain").text("请确认是否删除该任务")
    } else {
        let name = delete_name.join(", ");
        $(".delete-task-name-explain").html("请确认是否删除该任务及其子任务,子任务名称: " + name + "。")

    }
    delete_id.push(id);

    gantt_delete_id = [].concat(delete_id);

    $(".container_delete").toggle();


}

//获取对象在数组的位置
function getObjectArrayPosition(arr, ids) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == ids) {
            return i;
        }
    }
    return "null";
}

//获取删除任务的id  和名称
function getDeleteTaskMessage(id) {
    let deleteId = []
    let delete_id = mygantt.getChildren(id);
    if (delete_id != 0) {
        delete_id.forEach(item => {
            deleteId.push(item);
            deleteId = deleteId.concat(getDeleteTaskMessage(item));
        });

    }


    return deleteId

}






function setGanttCalendarData(ganttResouceCalendar, ganttTaskCalendar, data) {
    this.ganttResouceCalendars = ganttResouceCalendar;
    this.ganttTaskCalendars = ganttTaskCalendar;
    this.myganttData = data;
    //设置摘要任务的点击事件
    setAbstractClick()
}


var data_method = null;
var ganttResouceCalendars = {};
var ganttTaskCalendars = {};
var mygantt = null;
var myganttData = {};

function setDataMethod(data_method, mygantt) {
    this.data_method = data_method;
    this.mygantt = mygantt;

    //点击删除弹框设置
    $(".gantt_container .gantt-task-delete").on("click", function() {

        let selectid = mygantt.getSelectedId();
        if (selectid == null) {
            ganttShowMessaeg("请选择删除的任务");
            return;
        }

        gantt_delete_task(selectid)


    })

    //点击编辑任务
    $(".gantt_container  .gantt-task-compile").on("click", function() {
        $(".gannt-add-task-name").text("编辑任务")
        let selectid = mygantt.getSelectedId();
        if (selectid == null) {
            ganttShowMessaeg("请选择需要编辑的任务");
            return;
        }

        let selectTask = mygantt.getTask(selectid);
        let rank = selectTask.$wbs.split(".").length;
        $(".gantt_container #add-task-parentid").text(selectid)

        $(".gantt_container #add-task-parentid").attr("index", 2)
        $(".gantt_container #add-task-name").val(selectTask.text);
        $(".gantt_container #add-task-start-time").val(chineseMarkingTime(selectTask.start_date));
        $(".gantt_container #add-task-end-status").val(chineseMarkingTime(selectTask.end_date));
        // //需要设置专业
        // $('.gantt_container .gantt-add-task-box-item-select').val([selectTask.major.id]).trigger('change');
        // //编辑的时候不能修改专业
        // $('.gantt_container .gantt-add-task-box-item-select').prop("disabled", true);
        //需要判断是不是有子任务  如果有子任务  不能编辑实际  否则可以
        let childernId = mygantt.getChildren(selectid);
        if (childernId != null && childernId.length != 0) {
            $(".gantt_container #add-task-start-time").prop("disabled", true);
            $(".gantt_container #add-task-end-status").prop("disabled", true);
        } else {
            $(".gantt_container #add-task-start-time").prop("disabled", false);
            $(".gantt_container #add-task-end-status").prop("disabled", false);
        }

        switch (rank) {
            case 1:
                break;
            case 2:
                $(".gantt_container .container-add-task").toggle()
                $(".gantt_container #add-task-status").text("工作包")
                break
            case 3:
                data_method.edit(selectid)
                break
            case 4:
                data_method.edit(selectid)
                break



        }


    })


    //页面加载完成之后 设置删除弹框的点击事件
    $(".gantt_container .delte-box-btn-cancel").on("click", function() {
        $(".container_delete").toggle();
    })


    $(".gantt_container .delete-hide").on("click", function() {
        $(".container_delete").toggle();

    })

    $(".gantt_container .delte-box-btn-ok").on("click", function() {

            gantt_delete_id.forEach((item) => {


                let deleteTask = mygantt.getTask(item);

                if (deleteTask["task_type"] != undefined || deleteTask["task_type"] != null) {

                    if (deleteTask["task_type"] == "4" && deleteTask["check_id"] != "") {
                        //摘要任务
                        let checkTask = mygantt.getTask(deleteTask["check_id"]);
                        if (checkTask != null && checkTask != undefined) {
                            let index = getObjectArrayPosition(checkTask["review_task"], deleteTask["id"])
                            if (index != "null") {
                                checkTask["review_task"].splice(index, 1);
                                mygantt.updateTask(deleteTask["check_id"])
                            }
                        }
                    } else if (deleteTask["task_type"] == "2") {
                        //专业审核任务
                        deleteTask["review_task"].forEach(item => {
                            let checkTask = mygantt.getTask(item.id);
                            if (checkTask != null && checkTask != undefined) {
                                checkTask["check_id"] = "";
                                mygantt.updateTask(checkTask["id"])
                            }


                        });


                    }


                }
            });





            mygantt.deleteTask(gantt_delete_id[gantt_delete_id.length - 1]);
            $(".container_delete").toggle()

        })
        //如果点击其他 就要隐藏  新增任务选项
    $(".gantt_container").on("click", function(event) {
        if ("ganttNewAddTask" != $(event.target).attr("class")) {
            $(".gantt_container .ganttNewAddTaskOption").hide();
        }

    })

    //设置新增选项的点击事件
    $(".gantt_container  .ganttNewAddTaskOption").on("click", "div", function() {
        $(".gantt_container .ganttNewAddTaskOption").toggle();
        let taskName = $(this).text();
        let id = $(this).attr("id");
        // $(".gantt_container  .ganttNewAddTask").text(taskName)
        $(".gantt_container #add-task-status").text(taskName)
        $(".gantt_container #add-task-parentid").text(id)
        $(".gantt_container #add-task-parentid").attr("index", 0)
        if (taskName == "任务") {
            ganttAbstractTask(id)
        } else {
            $(".gannt-add-task-name").text("新增任务")
            $(".gantt_container #add-task-start-time").prop("disabled", false);
            $(".gantt_container #add-task-end-status").prop("disabled", false);
            //$('.gantt_container .gantt-add-task-box-item-select').prop("disabled", false);
            $(".gantt_container .container-add-task").toggle()
        }


        //


    })

    //设置新增的删除  和确认事件
    $(".gantt_container .gannt-add-hide").on("click", function() {
        $(".gantt_container #add-task-name").val("")
        $(".gantt_container #add-task-start-time").val("");
        $(".gantt_container #add-task-end-status").val("");

        $(".gantt_container .container-add-task").toggle()
    })

    $(".container-add-task-bottom-cancel").on("click", function() {
        $(".gantt_container #add-task-name").val("")
        $(".gantt_container #add-task-start-time").val("");
        $(".gantt_container #add-task-end-status").val("");

        $(".gantt_container .container-add-task").toggle()

    })

    //设置新增确认事件
    $(".container-add-task-bottom-ok").on("click", function() {

        let parentId = $(".gantt_container #add-task-parentid").text();

        let index = $(".gantt_container #add-task-parentid").attr("index");
        let addName = $(".gantt_container #add-task-name").val();
        let addStart = $(".gantt_container #add-task-start-time").val();
        let addEnd = $(".gantt_container #add-task-end-status").val();
        // let addStatus = $(".gantt_container .gantt-add-task-box-item-select").val();
        if (addName == "") {
            ganttShowMessaeg("请输入任务名称");
            return
        }
        if (addStart == "") {
            ganttShowMessaeg("请输入任务开始时间");
            return
        }
        if (addEnd == "") {
            ganttShowMessaeg("请输入任务结束时间");
            return
        }
        let newData = {};



        // let majorId = $(".gantt-add-task-box-item-select").val();

        // if (majorId == null) {
        //   ganttShowMessaeg("请选择专业");
        //   return
        // }
        // let majorName = $(".gannt-major").find("option:selected").text();

        newData["major"] = {
            // "text": majorName,
            // "id": majorId
        };


        //2把字符串格式转换为日期类
        let startTime = new Date(Date.parse(addStart));
        let endTime = new Date(Date.parse(addEnd));
        if (startTime >= endTime) {
            ganttShowMessaeg("项目开始时间不能大于或者等于结束时间");
            return
        }
        // if (addStatus == "") {
        //   ganttShowMessaeg("请输入任务专业");
        //   return
        // }

        newData["task_type"] = true;
        newData["text"] = addName;

        newData["start_date"] = addStart;
        newData["end_date"] = addEnd;
        if (index == 1) {
            //表示插入
            let position = $(".gantt_container #add-task-parentid").attr("position") //表示插入的位置
            newData["my_unit"] = {}
            mygantt.addTask(newData, parentId, position);
        } else if (index == 2) {
            //表示编辑
            var task = mygantt.getTask(parentId);

            //  if (newData["text"] != task.text) {
            task["text"] = newData["text"]
            task["start_date"] = startTime;
            task["end_date"] = endTime;
            mygantt.updateTask(parentId);
            //}


        } else {
            //新增任务
            newData["my_unit"] = {}
            mygantt.addTask(newData, parentId);
        }

        $(".gantt_container #add-task-name").val("")
        $(".gantt_container #add-task-start-time").val("");
        $(".gantt_container #add-task-end-status").val("");
        $(".gantt_container .container-add-task").toggle()

    })



}


//设置新增的任务选择
function ganttNewTaskSelect() {
    let selectid = mygantt.getSelectedId();
    if (selectid == null) {
        ganttShowMessaeg("请选择需要新增的位置")
        return;
    }
    let task = mygantt.getTask(selectid);
    let rank = task.$wbs.split(".").length;

    if (rank == 4 || rank == 1) {
        ganttShowMessaeg("不能添加任务")
        return
    }

    $(".ganttNewAddTaskOption").show();
    $(".ganttNewAddTaskOption").html("");


    let id = task.id;
    let parent = task.parent;
    let taskName = [];
    switch (rank) {
        case 1:

            break;
        case 2:
            taskName = ["工作包", "任务"]
            ganntSelectOption(taskName, id, parent);


            break;
        case 3:
            $(".ganttNewAddTaskOption").hide();
            ganttAbstractTask(parent);

            break
        case 4:

            break


    }


}
//设置任务添加的选择项
function ganntSelectOption(data, id, parent) {

    for (let i = 0; i < data.length; i++) {
        let newDiv = document.createElement("div");
        $(newDiv).text(data[i])
        $(newDiv).attr("class", "newAddTask");
        if (i == 0) {
            $(newDiv).attr("id", parent);
        } else {
            $(newDiv).attr("id", id);
        }
        $(".ganttNewAddTaskOption").append(newDiv)
    }
}




//获取两个日期之间的具体日期
Date.prototype.format = function() {
    var s = '';
    var mouth = (this.getMonth() + 1) >= 10 ? (this.getMonth() + 1) : ('0' + (this.getMonth() + 1));
    var day = this.getDate() >= 10 ? this.getDate() : ('0' + this.getDate());
    s += this.getFullYear() + '-'; // 获取年份。
    s += mouth + "-"; // 获取月份。
    s += day; // 获取日。
    return (s); // 返回日期。
};
//根据结束时间和开始时间获取所在的所有日期
function getTimeAll(begin, end) {
    var arr = [];
    var ab = begin.split("-");
    var ae = end.split("-");
    var db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    var de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    var unixDb = db.getTime() - 24 * 60 * 60 * 1000;
    var unixDe = de.getTime() - 24 * 60 * 60 * 1000;
    for (var k = unixDb; k <= unixDe;) {
        //console.log((new Date(parseInt(k))).format());
        k = k + 24 * 60 * 60 * 1000;
        arr.push((new Date(parseInt(k))).format());
    }
    return arr;
}
//获取任务具体的工作时间  去除周六周天

function getGanntTaskTime(start, end) {


    let time = getTimeAll(start, end);
    let newtime = [];
    time.forEach(function(v) {
        if (new Date(v).getDay() != 0 && new Date(v).getDay() != 6) {
            newtime.push(v)
        }
    });

    return newtime;


}




//将中国标准时间转换为yyyy-mm-ss
function chineseMarkingTime(start_date) {
    let Month = start_date.getMonth() + 1;
    Month = Month >= 10 ? Month : '0' + Month;
    let d = start_date.getDate();
    d = d >= 10 ? d : '0' + d
    let datetime = start_date.getFullYear() + '-' + Month + '-' + d;

    return datetime;
}


//获取休息日期
function getRestData(json) {

    var startTime = json["startTime"];
    var endTime = json["endTime"];
    var number = parseInt(json["jgNumber"]);
    var leadTime = getTimeAll(startTime, endTime);
    console.log(leadTime)

    if (number == 0) {
        return leadTime
    } else {
        var newLaedtime = [];

        for (var i = number; i < leadTime.length; i += number + 1) {

            newLaedtime.push(leadTime[i])

        }
        return newLaedtime;

    }

}

//提示输出的内容
function ganttShowMessaeg(msg) {
    alert(msg)
}


//获取资源数据
function getGanttResouceData(allSelectRecouse, restData, ganttTaskCalendar) {
    resourceTimes = {};
    var json = mygantt.serialize();
    console.log(json.data)
    json.data.forEach(function(v) {
        //只有任务类型是task 的计算资源  并且有选择资源 owner_id
        if (v.type == "task" && v.owner_id.length != 0) {
            let taskTime = getGanntTaskTime(v.start_date.split(" ")[0], v.end_date.split(" ")[0]);
            //需要删除最后一个时间  因为这个时间不在计算内
            //  taskTime.splice(taskTime.length - 1, 1)


            taskTime.forEach(function(datetime) {
                //判断任务例外
                if (ganttTaskCalendar[v.id] != undefined && ganttTaskCalendar[v.id].indexOf(datetime) != -1) {
                    //任务例外
                } else {
                    v.owner_id.forEach(function(id) {
                        if (restData[id] != undefined && restData[id].indexOf(datetime) != -1) {
                            //如果是例外就不计算在内
                            //还需要考虑 资源日历

                        } else {

                            let task_id = [];



                            if (task_id.indexOf(v.id) == -1) {

                                // //判断资源是否是 人员     复核工期
                                // if (allSelectRecouse[id].parent == "3") {
                                //   let position = taskTime.indexOf(datetime);
                                //   if (position >= parseInt(v.plan_time)) {
                                //     //表示这个日期在复核工期内
                                //     task_id.push(v.id)

                                //   }

                                // } else if (allSelectRecouse[id].parent == "4") {
                                //   //如果是人员  判断今天是否工作   设计工期  plan_time

                                //   let position = taskTime.indexOf(datetime);
                                //   if (position < parseInt(v.plan_time)) {
                                //     //表示这个设计工期内容
                                //     task_id.push(v.id)

                                //   }

                                // } else {
                                task_id.push(v.id)
                                    //}
                            }



                            if (resourceTimes[id] == undefined) {

                                if (task_id.length != 0) {

                                    resourceTimes[id] = {};
                                    resourceTimes[id] = {
                                        "id": id,
                                        "name": allSelectRecouse[id].text,
                                        "taskTime": {

                                        }
                                    };
                                    resourceTimes[id]["taskTime"][datetime] = {
                                        "day": datetime,
                                        "unit": allSelectRecouse[id].unit,
                                        "time": "8",

                                        "taskId": task_id
                                    };

                                }
                            } else if (resourceTimes[id]["taskTime"][datetime] == undefined) {
                                if (task_id.length != 0) {
                                    resourceTimes[id]["taskTime"][datetime] = {
                                        "day": datetime,
                                        "unit": allSelectRecouse[id].unit,
                                        "time": "8",
                                        "taskId": task_id
                                    };
                                }

                            } else {

                                if (task_id.length != 0) {
                                    task_id.forEach(function(element) {
                                        resourceTimes[id]["taskTime"][datetime]["taskId"].push(element)
                                    });

                                }

                            }






                        }



                    });

                }




            });

        }

    });



    let reouseTime = [];

    for (let key in resourceTimes) {
        let childrenTime = {};
        let value = resourceTimes[key];

        childrenTime["id"] = value["id"];
        childrenTime["name"] = value["name"];
        childrenTime["taskTime"] = [];
        //判断这个任务是不是一般任务   
        for (let timeKey in value["taskTime"]) {
            childrenTime["taskTime"].push(value["taskTime"][timeKey])
        }
        reouseTime.push(childrenTime)
    }

    console.log(JSON.stringify(reouseTime))


}
//返回自己需要的例外数据格式
function getGanttCalendarData(data) {
    let ganttCalender = [];
    if (data == undefined) {
        return ganttCalender;
    }
    data.forEach(function(item) {
        let time = getTimeAll(item.startTime, item.endTime);
        if (ganttCalender[item.id] == undefined) {
            ganttCalender[item.id] = [];
            ganttCalender[item.id] = time;
        } else {
            ganttCalender[item.id] = ganttCalender[item.id].concat(time);
        }
    });

    return ganttCalender;
}


//任务有例外 需要的设置任务的日历
function setTaskCalendar(data) {

    for (let key in data) {
        mygantt.addCalendar({
            id: key, // optional
            worktime: {
                days: [0, 1, 1, 1, 1, 1, 0]

            }
        });



        data[key].forEach(function(item) {

            let time = new Date(item);
            mygantt.getCalendar(key).setWorkTime({
                date: new Date(time.getFullYear(), time.getMonth(), time.getDate()),
                hours: false
            });

        });

    }


}





//  根据开始时间 和结束时间  计算工时  2019-05-13 17:30:00
function getGanttWorkTimeResource(startTime, endTime, taskId, resoucesId) {
    let start_time = startTime.split(" ");
    let end_time = endTime.split(" ");
    let end_time_work = ganttHourToSecond(end_time[1]);
    let start_time_work = ganttHourToSecond(start_time[1]);
    let workTime = getGanntTaskTime(start_time[0], end_time[0]);
    let newWorkTime = 0;
    workTime.forEach(function(item) {
        if (!(ganttTaskCalendars[taskId] != undefined && ganttTaskCalendars[taskId][item]) != undefined) {
            //判断不是任务例外
            if (!(ganttResouceCalendars[resoucesId] != undefined && ganttResouceCalendars[resoucesId][item]) != undefined) {
                //判断不是资源例外
                ++newWorkTime;
            }

        }
    });
    if (newWorkTime == 2) {
        return (end_time_work + start_time_work)
    } else if (start_time_work > 2) {
        return (end_time_work + start_time_work) + (newWorkTime * 8 - 16);
    } else if (newWorkTime == 1) {
        return end_time_work;
    } else {
        return 0;
    }



}

//将小时转化为毫秒
function ganttHourToSecond(time) {
    let hours_time = time.split(":")

    if (parseInt(hours_time[0]) <= 9) {
        return 0;
    } else if (parseInt(hours_time[0]) >= 18) {
        return 8
    }
    var second = 0;
    for (let index = 0; index < hours_time.length; index++) {
        switch (index) {
            case 0:
                if (parseInt(hours_time[index]) > 13) {
                    second = parseInt(hours_time[index]) * 60 * 60;
                } else {
                    second = parseInt(hours_time[index]) * 60 * 60;
                    second += 60 * 60;
                }
                break
            case 1:
                second += parseInt(hours_time[index]) * 60;
                break
            case 2:
                second += parseInt(hours_time[index]);
                break

        }

    }
    let differenceSecond = 8 * 60 * 60 - (18 * 60 * 60 - second)
    return differenceSecond / 3600


}

//获取任务的日志
function getTaskLog(task, newTask) {
    var logName = "";
    for (var p in newData) {
        if (task[p] != newData[p]) {
            switch (p) {
                case "text":
                    logName = logName + "  " + dialogName[p] + ":" + task[p][p] + "修改为" + newData[p]
                    break
                case "start_date":
                    break
                case "duration_plan":
                    break
                case "my_unit":
                    break
                case "major":
                    break
                case "duration":
                    break
                case "task_type":
                    break;
                case "review_task":
                    break
                case "type":
                    break
                case "describe":
                    break


            }



        }

    }

}

//设置摘要任务的点击事件  和数据设置
function setAbstractClick() {
    $(".gantt-abstract-btn-cancal").on("click", function() {
        //取消
        $(".gantt-abstract-task").hide()
    })
    $(".gantt-abstract-delete").on("click", function() {
        //X  取消
        $(".gantt-abstract-task").hide()

    })

    // //设置摘要任务的任务类型
    $("#abstract-task-types").select2({
        placeholder: '请选择任务类型',
        data: [{
            text: "摘要任务",
            id: "4"
        }, {
            text: "专业审核",
            id: "2"
        }]
    });

    //设置再要任务的专业
    $("#abstractMajor").select2({
        placeholder: '请选择任务专业',
        data: myganttData["ganttMajor"]
    })



    //设置摘要任务的单位
    $("#abstract-unit").select2({
        placeholder: '请选择任务单位',
        data: myganttData["ganntUnit"]
    })


    //设置设计任务的任务类型
    $("#design-task-type").select2({
        placeholder: '请选择任务类型',
        data: [{
            text: "一般任务",
            id: "1"
        }]
    });
    $("#design-task-type").val(["1"])
    $('#design-task-type').prop("disabled", true);
    //设置设计任务的专业
    $("#design-major").select2({
        placeholder: '请选择任务专业',
        data: myganttData["ganttMajor"]
    })


    //设置设计的单位
    $("#design-unit").select2({
            placeholder: '请选择任务单位',
            data: myganttData["ganntUnit"]
        })
        //复核任务类型
    $("#cheek-task-type").select2({
        placeholder: '请选择任务类型',
        data: [{
            text: "复核",
            id: "2"
        }]
    });
    $("#cheek-task-type").val(["2"])
    $('#cheek-task-type').prop("disabled", true);
    //设置复核专业
    $("#checkMajor").select2({
            placeholder: '请选择任务专业',
            data: myganttData["ganttMajor"]
        })
        //设置复核
    $("#check-unit").select2({
        placeholder: '请选择任务单位',
        data: myganttData["ganntUnit"]
    })

    //摘要任务 类型改变的监听
    $("#abstract-task-types").on("change", function() {
        $("#abstract-time-end").attr("disabled", true)
        $("#abstract-time-end").attr("placeholder", "自动计算")
        $("#abstract-time-end").removeAttr("type")
        $(".abstractTwo").attr("disabled", false)

        let data = $("#abstract-task-types").val();
        $("#abstract-time-start").attr("type", "date")
        $("#abstract-time-start").attr("disabled", false)
        $("#abstract-time-start").removeAttr("placeholder")
        if (data === "4" && !$("#switchAbstract").prop("checked")) {
            //摘要任务  不能是里程碑

            $(".gantt-sbatract-detail").show();
            //隐藏被审核任务
            $(".abstract-check-task").hide();

            //隐藏开始时间和工期
            $(".gantt-abstract-time").hide();
            $(".abstractStartEndTime").show()

        } else if (data === "2" && !$("#switchAbstract").prop("checked")) {
            //需要清空被选择的专业审核
            $("#abstract-time-start").removeAttr("type")
            $("#abstract-time-start").attr("disabled", true)
            $("#abstract-time-start").attr("placeholder", "根据被审核任务自动计算")
            $("#abstract-table1 tbody").html("")
            $(".abstractTwo").attr("disabled", true)
            $(".abstractTwo").attr("placeholder", "自动计算")
                //设置结束时间 不能编辑
            $("#abstract-time-end").attr("disabled", false)
            $("#abstract-time-end").attr("type", "date")

            //显示被审核任务
            $(".abstract-check-task").show();
            //隐藏 设任务  审核任务

            $(".gantt-sbatract-detail").hide()
                //显示开始时间和工期
            $(".gantt-abstract-time").show();
            $(".abstractStartEndTime").hide()
                //新增
            $("#abstract-task_one").trigger("click")
            $("#abstract-table1 .abstract-select1-name").select2("val", " ");

        } else {

            //隐藏被审核任务
            $(".abstract-check-task").hide();
            //隐藏 设任务  审核任务
            $(".gantt-sbatract-detail").hide()
                //显示开始时间和工期
            $(".gantt-abstract-time").show();
            $(".abstractStartEndTime").hide()
        }
    })

    //监听里程碑
    $("#switchAbstract").on("change", function() {
        $("#abstract-time-start").attr("type", "date")
        $("#abstract-time-start").attr("disabled", false)
        $("#abstract-time-start").removeAttr("placeholder")
            //清空开始时间  结束时间  工期
        $("#abstract-time-start").val("")
        $("#abstract-time-end").val("")
        $(".abstract-day").val("")
            //设置结束时间 不能编辑
        $("#abstract-time-end").attr("disabled", true)
        $("#abstract-time-end").attr("placeholder", "自动计算")
        $("#abstract-time-end").removeAttr("type")
        $(".abstractTwo").attr("disabled", false)
            //判断是不是里程碑
        if ($(this).prop("checked")) {
            $(".abstract-day").val("0");
            $(".abstract-day").attr("disabled", true)
                //选择里程碑  隐藏不需
            $(".isMilestone").hide();
            $(".isShowMilestone").show()
        } else {
            $(".abstract-day").val("");
            $(".abstract-day").attr("disabled", false)

            $(".isMilestone").show();
            $(".isShowMilestone").hide()
        }



        if ($("#switchAbstract").prop("checked") || $("#abstract-task-type").val() === "2") {

            $(".gantt-sbatract-detail").hide()

            //显示开始时间和工期
            $(".gantt-abstract-time").show();
            $(".abstractStartEndTime").hide()

        } else {
            $(".gantt-sbatract-detail").show()

            //显示开始时间和工期
            $(".gantt-abstract-time").hide();
            $(".abstractStartEndTime").show()


        }

        if ($("#abstract-task-types").val() === "2" && !$("#switchAbstract").prop("checked")) {
            $("#abstract-time-start").removeAttr("type")
            $("#abstract-time-start").attr("disabled", true)
            $("#abstract-time-start").attr("placeholder", "根据被审核任务自动计算")
            $(".abstractTwo").attr("disabled", true)
            $(".abstractTwo").attr("placeholder", "自动计算")
                //设置结束时间 不能编辑
            $("#abstract-time-end").attr("disabled", false)
            $("#abstract-time-end").attr("type", "date")

            //显示被审核任务
            $(".abstract-check-task").show();
        } else {
            //隐藏
            $(".abstract-check-task").hide();
        }





    })

    //设计tab 切换
    $(".gantt-abstract-item").on("click", function() {
            $(this).addClass("gantt-abstract-active").siblings().removeClass("gantt-abstract-active")
            let index = $(this).attr("index")
            $(".abstract-itemshow").removeClass("abstract-itemshow")
            $(".gantt-abstract-select-item").eq(index - 1).addClass("abstract-itemshow")


        })
        //设置tr点击
    $('tbody').on('click', 'tr', function() {
            $('tr').removeClass();
            $(this).addClass('move')
        })
        //删除  被审核任务
    $("#abstract-task_delete_check").on("click", function() {
            //  如果删除审核任务   第一个被审核的任务不能删除  只能修改
            abstractGanttRemove("abstract-table1")
        })
        //增加 被审核任务
    $("#abstract-task_one").on("click", function() {

            let newTr = getGanttElement("tr");
            let newTd = getGanttElement("td", "td");
            let newTdTwo = getGanttElement("td");
            let select = getGanttElement("select", "abstract-select1-name")
            select.style.width = "95%"
            let position = $("#abstract-table1 tr").length;
            $(newTd).html(position)
            $(newTdTwo).append(select)
            $(newTr).append(newTd)
            $(newTr).append(newTdTwo)
            $(select).select2({
                placeholder: '请选择被审核任务',
                data: abstractCheck
            })

            $("#abstract-table1").append(newTr)
            $(select).select2("val", " ");

        })
        //增加摘要细目
    $("#abstract-task_two").on("click", function() {
            addGanttAbstractDetails("abstract-table2")
        })
        //摘要细目删除
    $("#abstract-task_delete_check2").on("click", function() {
            abstractGanttRemove("abstract-table2")
        })
        //设计细目添加
    $("#abstract-task_three").on("click", function() {
            addGanttAbstractDetails("abstract-table3")

        })
        //细目删除
    $("#abstract-task_delete_check3").on("click", function() {
            abstractGanttRemove("abstract-table3")
        })
        //复核细目添加
    $("#abstract-task_four").on("click", function() {
            addGanttAbstractDetails("abstract-table4")
        })
        //复核细目删除
    $("#abstract-task_delete_check4").on("click", function() {
        abstractGanttRemove("abstract-table4")
    })

    //前置  摘要添加
    $("#abstract-task_five").on("click", function() {
            addGanttAbstractBefore("abstract-table5")
        })
        //前置  摘要删除
    $("#abstract-task_delete_check5").on("click", function() {
            abstractGanttRemove("abstract-table5")
        })
        //前置  设计添加
    $("#abstract-task_six").on("click", function() {
            addGanttAbstractBefore("abstract-table6")
        })
        //前置  设计删除
    $("#abstract-task_delete_check6").on("click", function() {
        abstractGanttRemove("abstract-table6")
    })


    //前置  复核添加
    $("#abstract-task_seven").on("click", function() {
            addGanttAbstractBefore("abstract-table7")
        })
        //前置  复核删除
    $("#abstract-task_delete_check7").on("click", function() {
        abstractGanttRemove("abstract-table7")
    })


    function abstractGanttRemove(id) {
        var len = $("tbody tr").length;
        if (len > 1) {
            $("#" + id + " tbody .move").remove();

        }
        setGanttTaskPosition(id);
    }

    //设置任务顺序
    function setGanttTaskPosition(id) {
        var i = 1;
        var str = "#" + id + " .td"

        $(str).each(function() {
            $(this).html(i++);
        })
    }

    //输入摘要任务的名称  自动生成 设计和复核的任务名称
    $("#abtract-name").on("input propertychange", function() {
        $("#design-name").val($(this).val() + "设计")
        $("#check-name").val($(this).val() + "复核")

        $("#abstract-option-name").text($(this).val() + "设计")
        if ($(this).val() == "") {
            $("#design-name").val("")
            $("#check-name").val("")
            $("#abstract-option-name").text("设计")
        }


    })

    //监听摘要任务输入工程量  设计任务和复核任务保持一致 它们不能输入
    $("#abstract-number").on("input propertychange", function() {
        $("#design-number").val($(this).val())
        $("#check-number").val($(this).val())
    })

    //监听设计任务开始时间和工期获取结束时间  
    setAbsractDesignAndCheckEndTime("#design-time", "#design-day", "#design-time-end")

    //监听复核任务开始时间和工期获取结束时间
    setAbsractDesignAndCheckEndTime("#check-time-start", "#check-day", "#check-time-end")

    //监听摘要任务或者审核任务开始时间和工期获取结束时间
    setAbsractDesignAndCheckEndTime("#abstract-time-start", ".abstract-day", "#abstract-time-end")
        //监听被审核任务的选择的第一个  这个人的结束时间是专业审核任务的开始时间
    $("#abstract-table1").on("change", ".abstract-select1-name", function() {

        let item = $("#abstract-table1 tbody tr select")[0]

        //判断第一个是不是有数据
        if ($(item).find("option:selected").text()) {

            //获取被审核任务的id
            let reviewId = $(item).val();

            //根据id 获取任务的信息
            let reviewTask = mygantt.getTask(reviewId)

            //获取第一个的结束时间 格式化时间
            let reviewEndTime = chineseMarkingTime(reviewTask["end_date"]).replace(/-/g, "/")

            //赋值
            $("#abstract-time-start").val(reviewEndTime);
            //如果输入的开始时间获取到了  并且结束时间也输入了  就要计算任务的工期
            let abstractEndTime = $("#abstract-time-end").val();
            //判断结束时间是不大于开始时间 
            if (abstractEndTime == "") {
                return
            }
            let startTime = new Date(Date.parse(reviewEndTime));
            let endTime = new Date(Date.parse(abstractEndTime));
            if (startTime >= endTime) {
                $("#abstract-time-end").val("");

                ganttShowMessaeg("项目开始时间不能大于或者等于结束时间");
            } else {
                //计算出工期  需要去除周六周天
                console.log(chineseMarkingTime(reviewTask["end_date"]))
                let dayNumber = getGanntTaskTime(chineseMarkingTime(reviewTask["end_date"]), abstractEndTime)
                $(".abstractTwo").val(dayNumber.length + "")
            }




        }



    })

    //对于专业审核任务结束时间的监听
    $("#abstract-time-end").on("input", function() {
        let abstractEndTime = $(this).val();
        let reviewEndTime = $("#abstract-time-start").val();
        if (reviewEndTime == "") {
            return
        }


        let startTime = new Date(Date.parse(reviewEndTime));
        let endTime = new Date(Date.parse(abstractEndTime));
        if (startTime >= endTime) {
            $("#abstract-time-end").val("");

            ganttShowMessaeg("项目开始时间不能大于或者等于结束时间");
        } else {
            //计算出工期  需要去除周六周天
            console.log(chineseMarkingTime(reviewTask["end_date"]))
            let dayNumber = getGanntTaskTime(chineseMarkingTime(reviewTask["end_date"]), abstractEndTime)
            $(".abstractTwo").val(dayNumber.length + "")
        }



    })


    //监听摘要任务选择了专业  复核任务和设计任务自动设置
    $("#abstractMajor").on("change", function() {
        let id = $(this).val();
        $("#design-major").val(id).trigger("change");
        $("#checkMajor").val(id).trigger("change");

        if ($("#abstract-task-types").val() == "2") {
            //表示专业审核任务

            $(".abstractTwo").val("");
            $("#abstract-time-start").val("");
            //设置被审核任务
            abstractCheck = abstractGanttCheckTask(id)
            $("#abstract-table1 .abstract-select1-name").select2({
                placeholder: '请选择被审核任务',
                data: abstractCheck
            })


            //需要清空被选择的专业审核

            $("#abstract-table1 tbody").html("")
                //新增
            $("#abstract-task_one").trigger("click")
            $("#abstract-table1 .abstract-select1-name").select2("val", " ");
        }
    })

    //监听任务类型
    $("#abstract-task-types").on("change", function() {

        $(".gantt-addTask-name").html("摘要任务")
        if ($(this).val() == "2") {
            //表示专业审核任务
            $(".gantt-addTask-name").html("专业审核任务")
            let id = $("#abstractMajor").val();
            //解决滑动冲突问题   
            // $("#ganttSelect2Id").attr("data-select2-id", "0")
            $(".gantt-abstract-select-item").css("overflow-y", "scroll")

            //设置被审核任务
            abstractCheck = abstractGanttCheckTask(id)
            $("#abstract-table1 .abstract-select1-name").select2({
                placeholder: '请选择被审核任务',
                data: abstractCheck
            })

            $("#abstract-table1 .abstract-select1-name").select2("val", " ");
        }

    })




}
//设置被审核任务
var abstractCheck = null;
//摘要任务的添加页面展示  status  存在表示插入
function ganttAbstractTask(parentId, status) {
    //清空数据
    clearGanttAbstractData()
    setAbstractClick()

    //默认不是里程碑
    if ($("#switchAbstract").prop("checked", false))
    //默认设置 摘要任务
        $("#abstract-task-types").val(4).trigger("change");

    //显示 摘要 细目  前置   设计 复核
    $(".gantt-sbatract-detail").show()

    //被审核任务
    $(".abstract-check-task").hide();

    //显示 摘要任务的添加
    $(".gantt-abstract-task").show();

    //根据父类的id   设置子类的 专业
    // let task = mygantt.getTask(parentId);
    // let id = task["major"]["id"];
    // setAbstractMajor(id)

    //设计和复核的专业是摘要任务确定的 自己不能选择
    $("#design-major").prop("disabled", true);
    $("#checkMajor").prop("disabled", true);

    //获取被审核任务参数
    abstractBefor = abstractGanttBeforTask();

    $("#abstract-table5 .abstract-select1-name").eq(0).select2({
        placeholder: '请选择被前置任务',
        data: abstractBefor
    })

    $("#abstract-table6 .abstract-select1-name").eq(0).select2({
            placeholder: '请选择被前置任务',
            data: abstractBefor
        })
        // $("#abstract-table7 .abstract-select1-name").eq(0).select2({
        //   placeholder: '请选择被前置任务',
        //   data: abstractBefor
        // })
        //点击确认添加
    $(".gantt-abstract-btn-ok").on("click", function() {

        ganttAbstractOk(parentId, status)
    })

}

//设置三个任务的专业类型 
function setAbstractMajor(id) {
    $("#abstractMajor").prop("disabled", false);
    $("#abstractMajor").val(id).trigger("change");
    $("#abstractMajor").prop("disabled", true);

    $("#design-major").prop("disabled", false);
    $("#design-major").val(id).trigger("change");
    $("#design-major").prop("disabled", true);

    $("#checkMajor").prop("disabled", false);
    $("#checkMajor").val(id).trigger("change");
    $("#checkMajor").prop("disabled", true);
}

//创建元素
function getGanttElement(ele, kind) {
    let newele = document.createElement(ele)
    if (kind != null || kind != undefined) {
        $(newele).addClass(kind)
    }

    return newele;
}
//细目任务的添加
function addGanttAbstractDetails(id) {
    let newTr = getGanttElement("tr");
    let newTd = getGanttElement("td", "td");
    let newTdTwo = getGanttElement("td");
    let newTdThree = getGanttElement("td");
    let input = getGanttElement("input")
    let inputTwo = getGanttElement("input")
    $(input).attr("placeholder", "请输入名称")
    $(inputTwo).attr("placeholder", "请输入描述")

    let position = $("#" + id).find("tr").length;
    $(newTd).html(position)
    $(newTdTwo).append(input)
    $(newTdThree).append(inputTwo)
    $(newTr).append(newTd)
    $(newTr).append(newTdTwo)
    $(newTr).append(newTdThree)

    $("#" + id).append(newTr)
}

//近前关系添加
function addGanttAbstractBefore(id) {
    let newTr = getGanttElement("tr");
    let newTd = getGanttElement("td", "td");
    let newTdTwo = getGanttElement("td");
    let newTdThree = getGanttElement("td");
    let newTdFour = getGanttElement("td");
    let select = getGanttElement("select", "abstract-select1-name")
    let selectTwo = getGanttElement("select", "abstract-select1-name")
    let input = getGanttElement("input")

    select.style.width = "247px"
    $(selectTwo).html(`<option>请选择类型</option>
     <option>FS</option>
     <option>FF</option>
     <option>SF</option>
     <option>SS</option>`)

    $(input).attr("placeholder", "请输入间隔时间")
    $(input).attr("type", "number");

    let position = $("#" + id).find("tr").length;
    $(newTd).html(position)
    newTdTwo.append(select)
    newTdThree.append(selectTwo)
    newTdFour.append(input)
    newTr.append(newTd)
    newTr.append(newTdTwo)
    newTr.append(newTdThree)
    newTr.append(newTdFour)

    $(select).select2({
        placeholder: '请选择被前置任务',
        data: abstractBefor
    })

    $("#" + id).append(newTr)


}

//获取被审核任务的数据格式  专业一样  必须是摘要任务
function abstractGanttCheckTask(ids) {
    let jsonTask = mygantt.serialize().data;

    let chenkTask = [];
    jsonTask.forEach(function(item) {

        if (item.task_type === "4" && item.major.id == ids && item.check_id == "") {

            chenkTask.push({
                id: item.id,
                text: item.text
            })
        }

    });
    return chenkTask;
}
//获取前置任务  
function abstractGanttBeforTask() {
    let jsonTask = mygantt.serialize().data;
    let beforeTask = [];
    jsonTask.forEach(function(item) {
        beforeTask.push({
            id: item.id,
            text: item.text
        })


    });
    return beforeTask;

}

//根据设计 复核 开始和工期的变化  获取  任务的结束时间

function setAbsractDesignAndCheckEndTime(timeId, dayId, endTime) {
    //abstract-time-start
    $(timeId).on("input propertychange", function() {
        let time = $(this).val();
        let day = $(dayId).val();
        if (time !== "" && day !== "") {
            let taskEnd = mygantt.calculateEndDate(new Date(time), day)
            let month = taskEnd.getMonth() + 1
            let endtime = taskEnd.getFullYear() + "/" + month + "/" + taskEnd.getDate()
            $(endTime).val(endtime)
            if (endTime === "#design-time-end") {
                $("#check-time-start").val(endtime)
            }

        }
        calculateAbstractStartEndTime();


    })


    $(dayId).on("input propertychange", function() {

        let day = $(this).val();
        let time = $(timeId).val();
        if (time !== "" && day !== "") {
            let taskEnd = mygantt.calculateEndDate(new Date(time), day)
            let month = taskEnd.getMonth() + 1
            let endtime = taskEnd.getFullYear() + "/" + month + "/" + taskEnd.getDate()
            $(endTime).val(endtime)
            console.log("0000")
            if (endTime === "#design-time-end") {
                $("#check-time-start").val(endtime)
            }
        }
        calculateAbstractStartEndTime();

    })

}
//计算摘要任务的开始时间和结束时间
function calculateAbstractStartEndTime() {
    let design_start = $("#design-time").val();
    let design_end = $("#design-time-end").val()
    let check_start = $("#check-time-start").val();
    let check_end = $("#check-time-end").val();
    if (design_start !== "" && check_start !== "") {
        if (design_start > check_start) {
            $("#abstract-startTime").val(check_start)
        } else {
            $("#abstract-startTime").val(design_start)
        }
    } else {
        $("#abstract-startTime").val(check_start === "" ? (design_start === "" ? "" : design_start) : check_start)
    }

    if (design_end !== "" && check_end !== "") {
        if (new Date(design_end) > new Date(check_end)) {
            $("#abstract-endTime").val(design_end)
        } else {
            $("#abstract-endTime").val(check_end)
        }
    } else {
        $("#abstract-endTime").val(check_end === "" ? (design_end === "" ? "" : design_end) : check_end)
    }

}

//清空摘要任务的数据
function clearGanttAbstractData() {
    $(".gantt-abstract-task").html(`
  <div class="gantt-box-abstract">
    <div class="gantt-abstract-add">
   
      <span>新增</span>
      <span class="gantt-abstract-delete">X</span>
   
    </div>
    <div class="gantt-abstract-tab">
      <div class="gantt-abstract-item  gantt-abstract-active" index="1">
      基本信息
      </div>
      <div class="gantt-abstract-item" index="2">
      任务明细
      </div>
      <div class="gantt-abstract-item" index="3">
      前置任务
      </div>
    </div>
    <!-- 基本信息 -->
    <div class="gantt-abstract-select-item  abstract-itemshow" id="ganttSelect2Id" >
     
       <div >

      <div class="gantt-abstract-line-data">
  
 
      <div class="item">
     
      <span class="gannt-abstract-line-name">
        任务类型
      </span>
      <select class="abstract-type" id="abstract-task-types">
      </select>
       
      </div>
      <div class="item">
   
      <span class="gannt-abstract-line-name" style="width: 200px;">是否里程碑</span>
      <input class="switch switch-anim" type="checkbox" id="switchAbstract" />
 
      </div>
 
    </div>
      <div>
      <strong class="gantt-addTask-name"  class="gantt-abstract-name">摘要任务</strong class="gantt-addTask-name" >
      <div class="gantt-abstract-line-data">
        <div class="item">
        <span class="gannt-abstract-line-name">
          任务名称
        </span>
        <input class="gannt-abstract-line-input" id="abtract-name" type="text">
   
        </div>
        <div class="item isShowMilestone" style="display: none;">

        <span class="gannt-abstract-line-name">
          工期
        </span>
        <input class="abstract-day abstractOne" class="gannt-abstract-line-input" type="number">
      </div>
        <div class="item isMilestone">
        <span class="gannt-abstract-line-name">
          单位
        </span>
        <select class="abstract-type" id="abstract-unit"></select>
        </div>
   
   
   
      </div>
   
      <div class="gantt-abstract-line-data isMilestone">
        <div class="item">
        <span class="gannt-abstract-line-name">
          工程量
        </span>
        <input id="abstract-number" class="gannt-abstract-line-input" type="number">
   
        </div>
        <div class="item">
        <span class="gannt-abstract-line-name">
          专业
        </span>
        <select id="abstractMajor" class="abstract-type"></select>
        </div>
   
   
      </div>
      
      <div class="gantt-abstract-line-data  abstractStartEndTime">
      <div class="item">
        <span class="gannt-abstract-line-name">
        开始时间
        </span>
        <input id="abstract-startTime" placeholder="根据子任务计算开始时间" class="gannt-abstract-line-input" type="type" disabled="disabled">
 
      </div>
      <div class="item">
      <span class="gannt-abstract-line-name">
         结束时间
        </span>
        <input id="abstract-endTime" placeholder="根据子任务计算结束时间" class="gannt-abstract-line-input" type="text" disabled="disabled">
      </div>
 
 
      </div>
 


    <div class="gantt-abstract-time" style="display: none;">
        <div class="gantt-abstract-line-data">
   
        <div class="item">
          <span class="gannt-abstract-line-name">
          开始时间
          </span>
          <input id="abstract-time-start" class="gannt-abstract-line-input" type="date">
   
   
        </div>
   
   
   
        <div class="item">
          <span class="gannt-abstract-line-name">
          结束时间
          </span>
          <input id="abstract-time-end" placeholder="自动计算出来" class="gannt-abstract-line-input"
          type="text" disabled="disabled">
   
        </div>
   
   
        </div>
        <div class="gantt-abstract-line-data isMilestone">
   
        <div class="item" style="justify-content: left;margin-left: 65px;">
          <span class="gannt-abstract-line-name">
          工期
          </span>
          <input style="margin-left: 13px;" class="abstract-day abstractTwo" class="gannt-abstract-line-input" type="number">
        </div>
        </div>
      </div>
   
   
   
   
      <div class="abstract-check-task" style="display: none;">
   
        <div class="abstract-skillBtn">
        <div style="font-size: 15px; color: black;">被审核任务</div>
        <div>
          <span class="text" id="abstract-task_one">增行</span>
          <span class="icon">|</span>
          <span class="text" id="abstract-task_delete_check">删行</span>
        </div>
   
        </div>
        <table id="abstract-table1">
        <thead>
          <tr style="background: #e5e5e5;height: 35px;">
          <th style="width: 40px; font-size: 16px;">序号</th>
   
          <th style="width: 200px;font-size: 16px;">任务名称</th>
          </tr>
   
        </thead>
   
        <tbody>
          <tr>
          <td class="td">1</td>
   
          <td>
            <select class="abstract-select1-name" style="width: 95%"></select>
          </td>
          </tr>
   
   
        </tbody>
   
        </table>
      </div>
      </div>
      </div>
   
      <div class="gantt-sbatract-detail">
      <!-- 设计任务 -->
      <div>
        <strong class="gantt-abstract-name">设计</strong>
        <div class="gantt-abstract-line-data">
        <div class="item">
          <span class="gannt-abstract-line-name">
          任务名称
          </span>
          <input class="gannt-abstract-line-input" id="design-name" disabled="disabled">
   
        </div>
        <div class="item">
          <span class="gannt-abstract-line-name">
          任务类型
          </span>
          <select class="abstract-type" id="design-task-type"></select>
        </div>
   
   
        </div>
   
        <div class="gantt-abstract-line-data">
        <div class="item">
          <span class="gannt-abstract-line-name">
          工程量
          </span>
          <input id="design-number" class="gannt-abstract-line-input" type="number">
   
        </div>
        <div class="item">
          <span class="gannt-abstract-line-name">
          专业
          </span>
          <select id="design-major" class="abstract-type"></select>
        </div>
   
   
        </div>
        <div class="gantt-abstract-line-data">
        <div class="item">
          <span class="gannt-abstract-line-name">
          开始时间
          </span>
          <input id="design-time" class="gannt-abstract-line-input" type="date">
   
        </div>
        <div class="item">
          <span class="gannt-abstract-line-name">
          单位
          </span>
          <select class="abstract-type" id="design-unit"></select>
   
   
        </div>
   
   
        </div>
   
        <div class="gantt-abstract-line-data">
   
        <div class="item">
          <span class="gannt-abstract-line-name">
          工期
          </span>
          <input id="design-day" class="gannt-abstract-line-input" type="number">
   
   
        </div>
        <div class="item">
          <span class="gannt-abstract-line-name">
          结束时间
          </span>
          <input id="design-time-end" placeholder="自动计算出来" class="gannt-abstract-line-input"
          type="text" disabled="disabled">
   
        </div>
   
   
   
        </div>
   
   
   
   
      </div>
      <!-- 复核 -->
      <div>
        <strong class="gantt-abstract-name">复核</strong>
        <div class="gantt-abstract-line-data">
        <div class="item">
          <span class="gannt-abstract-line-name">
          任务名称
          </span>
          <input class="gannt-abstract-line-input" id="check-name" disabled="disabled">
   
        </div>
        <div class="item">
          <span class="gannt-abstract-line-name">
          任务类型
          </span>
          <select class="check-type" id="cheek-task-type"></select>
        </div>
   
   
        </div>
   
        <div class="gantt-abstract-line-data">
        <div class="item">
          <span class="gannt-abstract-line-name">
          工程量
          </span>
          <input id="check-number" class="gannt-abstract-line-input" type="number">
   
        </div>
   
   
        <span class="item">
          <span class="gannt-abstract-line-name">
          专业
          </span>
   
          <select id="checkMajor" class="abstract-type"></select>
        </div>
   
        <div class="gantt-abstract-line-data">
        <div class="item">
          <span class="gannt-abstract-line-name">
          开始时间
          </span>
          <input id="check-time-start"  placeholder="自动计算出来" class="gannt-abstract-line-input" disabled="disabled">
   
        </div>
        <div class="item">
   
          <span class="gannt-abstract-line-name">
          单位
          </span>
          <select class="abstract-type" id="check-unit"></select>
        </div>
   
   
        </div>
   
        <!-- <div class="gantt-abstract-line-data">
   
        <div class="item" style="justify-content: left;margin-left: 65px;">
          <span class="gannt-abstract-line-name">
          工期
          </span>
          <input id="check-day" class="gannt-abstract-line-input" type="number">
        </div>
        </div> -->
   
   
        <div class="gantt-abstract-line-data">
   
        <div class="item">
          <span class="gannt-abstract-line-name">
          工期
          </span>
          <input id="check-day" class="gannt-abstract-line-input" type="number">
   
   
        </div>
   
   
   
        <div class="item">
          <span class="gannt-abstract-line-name">
          结束时间
          </span>
          <input id="check-time-end" placeholder="自动计算出来" class="gannt-abstract-line-input"
          type="text" disabled="disabled">
   
        </div>
   
   
        </div>
      </div>
   
      </div>
    </div>
    <!-- 任务细目 -->
    <div class="gantt-abstract-select-item">
   
      <div class="abstract-check-task-add">
   
      <div class="abstract-skillBtn">
        <div class="gantt-addTask-name"  style="font-size: 15px; color: black;">摘要任务</div>
        <div>
        <span class="text" id="abstract-task_two">增行</span>
        <span class="icon">|</span>
        <span class="text" id="abstract-task_delete_check2">删行</span>
        </div>
   
      </div>
      <table id="abstract-table2">
        <thead>
        <tr style="background: #e5e5e5;height: 35px;">
          <th style="width: 40px;">序号</th>
          <th style="width: 180px;">名称</th>
          <th style="width: 280px;">描述</th>
        </tr>
   
        </thead>
   
        <tbody>
        <tr>
          <td class="td">1</td>
          <td>
          <input type="text" placeholder="请输入名称">
          </td>
          <td>
          <input type="text" placeholder="请输入描述">
          </td>
        </tr>
   
   
        </tbody>
   
      </table>
      </div>
   
      <!-- 如果是摘要任务 或者不是里程碑 -->
      <div class="gantt-sbatract-detail">
      <!-- 设计细目 -->
      <div class="abstract-check-task-add">
   
        <div class="abstract-skillBtn">
        <div style="font-size: 15px; color: black;">设计任务</div>
        <div>
          <span class="text" id="abstract-task_three">增行</span>
          <span class="icon">|</span>
          <span class="text" id="abstract-task_delete_check3">删行</span>
        </div>
   
        </div>
        <table id="abstract-table3">
        <thead>
          <tr style="background: #e5e5e5;height: 35px;">
          <th style="width: 40px;">序号</th>
          <th style="width: 180px;">名称</th>
          <th style="width: 280px;">描述</th>
          </tr>
   
        </thead>
   
        <tbody>
          <tr>
          <td class="td">1</td>
          <td>
            <input type="text" placeholder="请输入名称">
          </td>
          <td>
            <input type="text" placeholder="请输入描述">
          </td>
          </tr>
   
   
        </tbody>
   
        </table>
      </div>
      <!-- 复核细目 -->
      <div class="abstract-check-task-add">
   
        <div class="abstract-skillBtn">
        <div style="font-size: 15px; color: black;">复核任务</div>
        <div>
          <span class="text" id="abstract-task_four">增行</span>
          <span class="icon">|</span>
          <span class="text" id="abstract-task_delete_check4">删行</span>
        </div>
   
        </div>
        <table id="abstract-table4">
        <thead>
          <tr style="background: #e5e5e5;height: 35px;">
          <th style="width: 40px;">序号</th>
          <th style="width: 180px;">名称</th>
          <th style="width: 280px;">描述</th>
          </tr>
   
        </thead>
   
        <tbody>
          <tr>
          <td class="td">1</td>
          <td>
            <input type="text" placeholder="请输入名称">
          </td>
          <td>
            <input type="text" placeholder="请输入描述">
          </td>
          </tr>
   
   
        </tbody>
   
        </table>
      </div>
   
   
      </div>
   
    </div>
    <!-- 前置任务 -->
    <div class="gantt-abstract-select-item">
      <div class="abstract-check-task-add">
   
      <div class="abstract-skillBtn">
        <div class="gantt-addTask-name" style="font-size: 15px; color: black;">摘要任务</div>
        <div>
        <span class="text" id="abstract-task_five">增行</span>
        <span class="icon">|</span>
        <span class="text" id="abstract-task_delete_check5">删行</span>
        </div>
   
      </div>
      <table id="abstract-table5">
        <thead>
        <tr style="background: #e5e5e5;height: 35px;">
          <th style="width: 40px;">序号</th>
          <th style="width: 260px;">任务名称</th>
          <th style="width: 200px;">类型</th>
          <th>间隔时间（天）</th>
        </tr>
   
        </thead>
   
        <tbody>
        <tr>
          <td class="td">1</td>
   
          <td><select class="abstract-select1-name" style="width: 247px">
   
          </select>
   
          </td>
          <td>
          <select class="abstract-select1-name">
            <option>请选择类型</option>
            <option>FS</option>
            <option>FF</option>
            <option>SF</option>
            <option>SS</option>
   
          </select>
          </td>
          <td>
          <input type="number" placeholder="请输入间隔时间">
          </td>
   
        </tr>
   
   
        </tbody>
   
      </table>
      </div>
   
      <!-- 如果是摘要任务 或者不是里程碑 -->
      <div class="gantt-sbatract-detail">
      <!-- 设计细目 -->
      <div class="abstract-check-task-add">
   
        <div class="abstract-skillBtn">
        <div style="font-size: 15px; color: black;">设计任务</div>
        <div>
          <span class="text" id="abstract-task_six">增行</span>
          <span class="icon">|</span>
          <span class="text" id="abstract-task_delete_check6">删行</span>
        </div>
   
        </div>
        <table id="abstract-table6">
        <thead>
          <tr style="background: #e5e5e5;height: 35px;">
          <th style="width: 40px;">序号</th>
          <th style="width: 260px;">任务名称</th>
          <th style="width: 200px;">类型</th>
          <th>间隔时间（天）</th>
          </tr>
   
        </thead>
   
        <tbody>
          <tr>
          <td class="td">1</td>
   
          <td><select class="abstract-select1-name" style="width: 247px">
   
            </select>
   
          </td>
          <td>
            <select class="abstract-select1-name">
            <option>请选择类型</option>
            <option>FS</option>
            <option>FF</option>
            <option>SF</option>
            <option>SS</option>
   
            </select>
          </td>
          <td>
            <input type="number" placeholder="请输入间隔时间">
          </td>
   
          </tr>
   
   
        </tbody>
   
        </table>
      </div>
      <!-- 复核细目 -->
      <div class="abstract-check-task-add">
   
        <div class="abstract-skillBtn">
        <div style="font-size: 15px; color: black;">复核任务</div>
        <div style="display: none;">
          <span class="text" id="abstract-task_seven">增行</span>
          <span class="icon">|</span>
          <span class="text" id="abstract-task_delete_check7">删行</span>
        </div>
   
        </div>
        <table id="abstract-table7">
        <thead>
          <tr style="background: #e5e5e5;height: 35px;">
          <th style="width: 40px;">序号</th>
   
          <th style="width: 260px;">任务名称</th>
          <th style="width: 200px;">类型</th>
          <th>间隔时间（天）</th>
          </tr>
   
        </thead>
   
        <tbody>
          <tr>
          <td class="td">1</td>
   
          <td><select class="abstract-select1-name" style="width: 247px">
            <option id="abstract-option-name" selected="selected">设计</option>
            </select>
   
          </td>
          <td>
            <select class="abstract-select1-name">
   
            <option selected="selected">FS</option>
   
   
            </select>
          </td>
          <td>
            <input type="number" placeholder="请输入间隔时间" value="0" disabled="disabled">
          </td>
   
          </tr>
   
   
        </tbody>
   
        </table>
      </div>
   
   
      </div>
   
    </div>
    <div class="gantt-abstract-btn">
      <span class="gantt-abstract-btn-cancal">取消</span>
      <span class="gantt-abstract-btn-ok">添加</span>
    </div>
    </div>
`)
}

//摘要任务点击确定添加
function ganttAbstractOk(parentId, status) {
    let abstractTask = {};
    let abstractTaskLike = [];

    let abstract = {};
    let abstract_name = $("#abtract-name").val();
    if (abstract_name === "") {
        ganttShowMessaeg("请输入任务的名称")
        return;
    }
    abstract["text"] = abstract_name;
    let abatract_task_type = $("#abstract-task-types").val();
    //任务类型
    abstract["task_type"] = abatract_task_type;
    if (!$("#switchAbstract").prop("checked")) {
        //不是里程碑才有这些数据
        let abstract_number = $("#abstract-number").val();
        if (abstract_number === "") {
            ganttShowMessaeg("请输入任务的工程量")
            return
        }
        abstract["duration_plan"] = abstract_number;
        let taskMajorId = $("#abstractMajor").val();
        if (taskMajorId === "") {
            ganttShowMessaeg("请选择任务的专业")
            return
        }
        let taskMajorName = $("#abstractMajor").find("option:selected").text();
        abstract["major"] = {
            id: taskMajorId,
            text: taskMajorName
        }
        let abstract_unit = $("#abstract-unit").val();
        if (abstract_unit === "") {
            ganttShowMessaeg("请选择任务的单位")
            return
        }

        let abstract_unitName = $("#abstract-unit").find("option:selected").text();
        abstract["my_unit"] = {
            id: abstract_unit,
            text: abstract_unitName
        }
    }


    let abstract_type = $("#switchAbstract").prop("checked")
    if (abstract_type) {
        abstract["type"] = "milestone"
    }

    abstract["id"] = generateUUID();
    abstractTaskLike = getAbstractBeford("#abstract-table5 tbody tr", abstract["id"])



    abstract["describe"] = getAbstractDetails("#abstract-table2 tbody tr");
    abstract["parent"] = parentId;
    if (abatract_task_type === "4" && !abstract_type) {
        //有设计任务 和复核任务
        let abstractDesgin = {};
        let abstractCheck = {};
        //获取设计的基本信息
        let desginName = $("#design-name").val();
        //设计名称
        abstractDesgin["text"] = desginName;
        //一般任务
        abstractDesgin["task_type"] = "1";

        let desginNumber = $("#design-number").val();
        if (desginNumber === "") {
            ganttShowMessaeg("请输入设计任务的工程量")
            return
        }
        abstractDesgin["duration_plan"] = desginNumber;
        //设计任务的专业
        abstractDesgin["major"] = {
            id: taskMajorId,
            text: taskMajorName
        }
        let desginTime = $("#design-time").val();
        if (desginTime === "") {
            ganttShowMessaeg("请输入设计任务的开始时间")
            return
        }
        abstractDesgin["start_date"] = desginTime
        let abstractUnits = $("#design-unit").val();
        let abstractUnitName = $("#design-unit").find("option:selected").text();
        if (abstractUnits === "") {
            ganttShowMessaeg("请选择设计任务的单位")
            return
        }

        abstractDesgin["my_unit"] = {
            id: abstractUnits,
            text: abstractUnitName
        }

        let designNumber = $("#design-day").val();
        if (designNumber === "") {
            ganttShowMessaeg("请输入设计任务的工期")
            return
        }
        abstractDesgin["duration"] = designNumber;
        abstractDesgin["parent"] = abstract["id"]
        abstractDesgin["describe"] = getAbstractDetails("#abstract-table3 tbody tr");
        abstractDesgin["id"] = generateUUID();
        abstractTaskLike = abstractTaskLike.concat(getAbstractBeford("#abstract-table6 tbody tr", abstractDesgin["id"]))
            //获取复核任务的信息
            //名称
        abstractCheck["text"] = $("#check-name").val();
        //任务类型
        abstractCheck["task_type"] = "3"
        let checkNumber = $("#check-number").val();
        if (checkNumber === "") {
            ganttShowMessaeg("请输入复核任务的工程量")
            return
        }
        abstractCheck["duration_plan"] = checkNumber;
        abstractCheck["major"] = {
            id: taskMajorId,
            text: taskMajorName
        }
        let checkTime = $("#check-time-start").val();
        if (checkTime === "") {
            ganttShowMessaeg("请输入复核任务的开始时间")
            return
        }

        abstractCheck["start_date"] = checkTime;
        let abstractUnit = $("#check-unit").val();
        if (abstractUnit === "") {
            ganttShowMessaeg("请选择复核任务的单位")
            return
        }

        abstractCheck["my_unit"] = {
            id: abstractUnits,
            text: abstractUnitName
        };
        let checkDay = $("#check-day").val();
        if (checkDay === "") {
            ganttShowMessaeg("请输入复核任务的工期")
            return
        }

        abstractCheck["duration"] = checkDay;

        abstractCheck["describe"] = getAbstractDetails("#abstract-table4 tbody tr");
        abstractCheck["id"] = generateUUID();

        abstractCheck["parent"] = abstract["id"]
        abstractTaskLike.push({
            source: abstractDesgin["id"],
            target: abstractCheck["id"],
            type: "0",
            lag: "0"
        })
        abstractTask["design"] = abstractDesgin;
        abstractTask["check"] = abstractCheck;
        abstractTask["link"] = abstractTaskLike;
        data_method.setData(abstractTask)

        if (status) {
            mygantt.addTask(abstract, parentId, status);
        } else {
            mygantt.addTask(abstract, parentId);
        }







    } else if (abatract_task_type === "4" && abstract_type) {
        let abstract_time = $("#abstract-time-start").val();
        if (abstract_time === "") {
            ganttShowMessaeg("请输入任务开始时间")
            return
        }
        abstract["start_date"] = abstract_time;
        let abstract_day = $(".abstract-day").val();
        if (abstract_day === "") {
            ganttShowMessaeg("请输入任务工期")
            return
        }
        abstract["duration"] = abstract_day
        abstractTask["link"] = abstractTaskLike;
        data_method.setData(abstractTask)
        if (status) {
            mygantt.addTask(abstract, parentId, status);
        } else {
            mygantt.addTask(abstract, parentId);
        }

    } else {
        let abstract_time = $("#abstract-time-start").val();
        if (abstract_time === "") {
            ganttShowMessaeg("请输入任务开始时间")
            return
        }
        abstract["start_date"] = abstract_time;
        //需要判断是否里程碑  从而获取那个设计工期
        if ($("#switchAbstract").prop("checked")) {
            //获取不同的设置工期   需要设置不同的获取方式
            let abstract_day = $(".abstractOne").val();
            if (abstract_day === "") {
                ganttShowMessaeg("请输入任务工期")
                return
            }
            abstract["duration"] = abstract_day
        } else {
            let abstract_day = $(".abstractTwo").val();
            if (abstract_day === "") {
                ganttShowMessaeg("请输入任务工期")
                return
            }
            abstract["duration"] = abstract_day
        }


        //获取审核任务
        abstract["review_task"] = getAbstractCheckTask();
        abstract["review_task"].forEach(item => {
            let task = mygantt.getTask(item.id);
            task["check_id"] = abstract["id"];
            mygantt.updateTask(item.id)
        });



        abstractTask["link"] = abstractTaskLike;
        data_method.setData(abstractTask)
        if (status) {
            mygantt.addTask(abstract, parentId, status);
        } else {
            mygantt.addTask(abstract, parentId);
        }


    }
    $(".gantt-abstract-task").hide()

}

//获取任务的明细
function getAbstractDetails(ele) {
    let abstractDetails = [];

    for (let i = 0; i < $(ele).length; i++) {

        let item = $(ele)[i]
        let inputContent = $(item).find("input").val();
        if (inputContent[0] !== "" && inputContent[1] !== "") {
            abstractDetails.push({
                name: inputContent[0],
                explain: inputContent[1]
            })
        }
    }


    return abstractDetails;
}

//获取前置任务
function getAbstractBeford(ele, id) {
    let abstractBeford = [];
    for (let i = 0; i < $(ele).length; i++) {
        let item = $(ele)[i];

        let selectId = $(item).find("select");
        let tagDay = $(item).find("input").val();
        let one = $(selectId[0]).val()
        let two = $(selectId[1]).val()
        if (one !== "" && two !== "" && two !== "请选择类型") {
            let taskType = "";
            switch (two) {
                case "FS":
                    taskType = 0;
                    break;
                case "SS":
                    taskType = 1;
                    break
                case "FF":
                    taskType = 2;
                    break
                case "SF":
                    taskType = 3;
                    break

            }
            abstractBeford.push({
                source: one,
                target: id,
                type: taskType,
                lag: tagDay


            })
        }

    }


    return abstractBeford;
}

//获取任务uuid
function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
//获取被审核任务

function getAbstractCheckTask() {
    let abstractCheckTask = [];
    for (let i = 0; i < $("#abstract-table1 tbody tr select").length; i++) {

        let item = $("#abstract-table1 tbody tr select")[i]
        if ($(item).val() != null && $(item).val() != "") {

            abstractCheckTask.push({
                id: $(item).val(),
                text: $(item).find("option:selected").text()
            })
        }


    }

    return abstractCheckTask;
}