; (function (KDApi, $) {
    function MyComponent(model) {
        this._setModel(model)
    }

    // 顶层变量声明
    var data = []
    MyComponent.prototype = { // 内部函数不推荐修改
        _setModel: function (model) {
            this.model = model // 内部变量挂载
        },
        init: function (props) {
            console.log('-----init', this.model, props)
            setHtml(this.model, props)
        },
        update: function (props) {
            console.log('-----update', this.model, props)
            setHtml(this.model, props)
        },
        destoryed: function () {
            console.log('-----destoryed', this.model)
        }

    }

    /*
     * 外部函数声明
     */
    var setHtml = function (model, props) {
        KDApi.loadFile('./css/layui.css', model.schemaId, function () {
            KDApi.loadFile('./css/quality_analysis_table.css', model.schemaId, function () {
                KDApi.loadFile('./js/layui.js', model.schemaId, function () {
                    KDApi.templateFilePath('./html/quality_analysis_table.html', model.schemaId, {
                        path: KDApi.nameSpace(model.schemaId) + './img/lock.png'
                    }).then(function (result) {
                        model.dom.innerHTML = result
                        // console.log(result);
                        if (props.data) {
                            data = props.data
                        }
                        data = [
                            {
                                "task_id": 1,
                                "serialNumber": "010101",
                                "task_name": "环境调查",
                                // 设计
                                "design_owner": "0",
                                "design_time_plan": "0",
                                "design_time_fact": "0",
                                // 复核
                                "review_first_owner": "0",
                                "review_modify_owner": "0",
                                "review_mod_con_owner": "0",
                                "review_confirm_owner": "0",
                                "review_first_duration_plan": "1",
                                "review_modify_duration_plan": "1",
                                "review_mod_con_duration_plan": "1",
                                "review_confirm_duration_plan": "1",
                                "review_first_duration_fact": "2",
                                "review_modify_duration_fact": "2",
                                "review_mod_con_duration_fact": "2",
                                "review_confirm_duration_fact": "2",
                                "review_time_first_plan": "1",
                                "review_time_modify_plan": "1",
                                "review_mod_con_time_plan": "1",
                                "review_confirm_time_plan": "1",
                                "review_time_first_fact": "2",
                                "review_time_modify_fact": "2",
                                "review_mod_con_time_fact": "2",
                                "review_confirm_time_fact": "2",
                                // 复核偏差值
                                "review_first_deviation_value": "5",
                                // 复核偏差原因
                                "review_deviation_causes": "一",
                                // 复核偏差措施
                                "review_deviation_measures": "二",
                                "review_modify_deviation_value": "6",
                                "review_mod_con_deviation_value": "7",
                                "review_confirm_deviation_value": "8",
                                // 一审
                                "audit_first_owner": "0",
                                "audit_modify_owner": "0",
                                "audit_mod_con_owner": "0",
                                "audit_confirm_owner": "0",
                                "audit_first_duration_plan": "1",
                                "audit_modify_duration_plan": "1",
                                "audit_mod_con_duration_plan": "1",
                                "audit_confirm_duration_plan": "1",
                                "audit_first_duration_fact": "2",
                                "audit_modify_duration_fact": "2",
                                "audit_mod_con_duration_fact": "2",
                                "audit_confirm_duration_fact": "2",
                                "audit_first_time_plan": "1",
                                "audit_modify_time_plan": "1",
                                "audit_mod_con_time_plan": "1",
                                "audit_confirm_time_plan": "1",
                                "audit_first_time_fact": "2",
                                "audit_modify_time_fact": "2",
                                "audit_mod_con_time_fact": "2",
                                "audit_confirm_time_fact": "2",
                                // 偏差
                                "audit_first_deviation_value": "1",
                                "audit_deviation_causes": "一",
                                "audit_deviation_measures": "二",
                                "audit_modify_deviation_value": "2",
                                "audit_mod_con_deviation_value": "3",
                                "audit_confirm_deviation_value": "4",
                                "qualityplan_version": "v1.0",
                                "parent_id": 0,
                                "type": "project"
                            },
                            {
                                "task_id": 2,
                                "serialNumber": "010102",
                                "task_name": "环境调查",
                                // 设计
                                "design_owner": "0",
                                "design_time_plan": "0",
                                "design_time_fact": "0",
                                // 复核
                                "review_first_owner": "0",
                                "review_modify_owner": "0",
                                "review_mod_con_owner": "0",
                                "review_confirm_owner": "0",
                                "review_first_duration_plan": "1",
                                "review_modify_duration_plan": "1",
                                "review_mod_con_duration_plan": "1",
                                "review_confirm_duration_plan": "1",
                                "review_first_duration_fact": "2",
                                "review_modify_duration_fact": "2",
                                "review_mod_con_duration_fact": "2",
                                "review_confirm_duration_fact": "2",
                                "review_time_first_plan": "1",
                                "review_time_modify_plan": "1",
                                "review_mod_con_time_plan": "1",
                                "review_confirm_time_plan": "1",
                                "review_time_first_fact": "2",
                                "review_time_modify_fact": "2",
                                "review_mod_con_time_fact": "2",
                                "review_confirm_time_fact": "2",
                                // 复核偏差值
                                "review_first_deviation_value": "5",
                                // 复核偏差原因
                                "review_deviation_causes": "一",
                                // 复核偏差措施
                                "review_deviation_measures": "二",
                                "review_modify_deviation_value": "6",
                                // "review_modify_deviation_causes": "一",
                                // "review_modify_deviation_measures": "二",
                                "review_mod_con_deviation_value": "7",
                                // "review_mod_con_deviation_causes": "一",
                                // "review_mod_con_deviation_measures": "二",
                                "review_confirm_deviation_value": "8",
                                // "review_confirm_deviation_causes": "一",
                                // "review_confirm_deviation_measures": "二",
                                // 一审
                                "audit_first_owner": "0",
                                "audit_modify_owner": "0",
                                "audit_mod_con_owner": "0",
                                "audit_confirm_owner": "0",
                                "audit_first_duration_plan": "1",
                                "audit_modify_duration_plan": "1",
                                "audit_mod_con_duration_plan": "1",
                                "audit_confirm_duration_plan": "1",
                                "audit_first_duration_fact": "2",
                                "audit_modify_duration_fact": "2",
                                "audit_mod_con_duration_fact": "2",
                                "audit_confirm_duration_fact": "2",
                                "audit_first_time_plan": "1",
                                "audit_modify_time_plan": "1",
                                "audit_mod_con_time_plan": "1",
                                "audit_confirm_time_plan": "1",
                                "audit_first_time_fact": "2",
                                "audit_modify_time_fact": "2",
                                "audit_mod_con_time_fact": "2",
                                "audit_confirm_time_fact": "2",
                                // 偏差
                                "audit_first_deviation_value": "1",
                                "audit_deviation_causes": "一",
                                "audit_deviation_measures": "二",
                                "audit_modify_deviation_value": "2",
                                // "audit_modify_deviation_causes": "一",
                                // "audit_modify_deviation_measures": "二",
                                "audit_mod_con_deviation_value": "3",
                                // "audit_mod_con_deviation_causes": "一",
                                // "audit_mod_con_deviation_measures": "二",
                                "audit_confirm_deviation_value": "4",
                                // "audit_confirm_deviation_causes": "一",
                                // "audit_confirm_deviation_measures": "二",
                                "qualityplan_version": "v1.0",
                                "parent_id": 0,
                                "type": "project"
                            }
                        ]

                        var str = ''
                        for (var i = 0; i < data.length; i++) {
                            str += `
                            <tr>
                                <td rowspan="4">${i + 1}</td>
                                <td rowspan="4">${data[i].serialNumber}</td>
                                <td rowspan="4" class="task_name" id="${data[i].task_id}">${data[i].task_name}</td>
                                <td rowspan="4">${data[i].design_owner}</td>
                                <td rowspan="4">${data[i].design_time_plan}</td>
                                <td rowspan="4">${data[i].design_time_fact}</td>
                                <td colspan="2">首次复核意见</td>
                                <td>${data[i].review_first_owner}</td>
                                <td>${data[i].review_first_duration_plan}</td>
                                <td>${data[i].review_first_duration_fact}</td>
                                <td>${data[i].review_time_first_plan}</td>
                                <td>${data[i].review_time_first_fact}</td>
                                <td>${data[i].review_first_deviation_value}</td>
                                <td rowspan="4">${data[i].review_deviation_causes}</td>
                                <td rowspan="4">${data[i].review_deviation_measures}</td>
                                <td colspan="2">首次审核</td>
                                <td>${data[i].audit_first_owner}</td>
                                <td>${data[i].audit_first_duration_plan}</td>
                                <td>${data[i].audit_first_duration_fact}</td>
                                <td>${data[i].audit_first_time_plan}</td>
                                <td>${data[i].audit_first_time_fact}</td>
                                <td>${data[i].audit_first_deviation_value}</td>
                                <td rowspan="4">${data[i].audit_deviation_causes}</td>
                                <td rowspan="4">${data[i].audit_deviation_measures}</td>
                            </tr>
                            <tr>
                                <td rowspan="2">修改</td>
                                <td>修改</td>
                                <td>${data[i].review_modify_owner}</td>
                                <td>${data[i].review_modify_duration_plan}</td>
                                <td>${data[i].review_modify_duration_fact}</td>
                                <td>${data[i].review_time_modify_plan}</td>
                                <td>${data[i].review_time_modify_fact}</td>
                                <td>${data[i].review_modify_deviation_value}</td>
                                <td rowspan="2">整改</td>
                                <td>修改</td>
                                <td>${data[i].audit_modify_owner}</td>
                                <td>${data[i].audit_modify_duration_plan}</td>
                                <td>${data[i].audit_modify_duration_fact}</td>
                                <td>${data[i].audit_modify_time_plan}</td>
                                <td>${data[i].audit_modify_time_fact}</td>
                                <td>${data[i].audit_modify_deviation_value}</td>
                            </tr>
                            <tr>
                                <td>修改确认</td>
                                <td>${data[i].review_mod_con_owner}</td>
                                <td>${data[i].review_mod_con_duration_plan}</td>
                                <td>${data[i].review_mod_con_duration_fact}</td>
                                <td>${data[i].review_mod_con_time_plan}</td>
                                <td>${data[i].review_mod_con_time_fact}</td>
                                <td>${data[i].review_mod_con_deviation_value}</td>
                                <td>修改确认</td>
                                <td>${data[i].audit_mod_con_owner}</td>
                                <td>${data[i].audit_mod_con_duration_plan}</td>
                                <td>${data[i].audit_mod_con_duration_fact}</td>
                                <td>${data[i].audit_mod_con_time_plan}</td>
                                <td>${data[i].audit_mod_con_time_fact}</td>
                                <td>${data[i].audit_mod_con_deviation_value}</td>
                            </tr>
                            <tr>
                                <td colspan="2">复核确认</td>
                                <td>${data[i].review_confirm_owner}</td>
                                <td>${data[i].review_confirm_duration_plan}</td>
                                <td>${data[i].review_confirm_duration_fact}</td>
                                <td>${data[i].review_confirm_time_plan}</td>
                                <td>${data[i].review_confirm_time_fact}</td>
                                <td>${data[i].review_confirm_deviation_value}</td>
                                <td colspan="2">审核确认</td>
                                <td>${data[i].audit_confirm_owner}</td>
                                <td>${data[i].audit_confirm_duration_plan}</td>
                                <td>${data[i].audit_confirm_duration_fact}</td>
                                <td>${data[i].audit_confirm_time_plan}</td>
                                <td>${data[i].audit_confirm_time_fact}</td>
                                <td>${data[i].audit_confirm_deviation_value}</td>
                            </tr>`
                        }
                        $("#tbody_result").append(str);

                        $(".task_name").on("dblclick", function (e) {
                            console.log(e.target.id)
                        })

                    })
                })
            })
        })
    }

    // 注册自定义控件
    KDApi.register('quality_analysis_table', MyComponent)
})(window.KDApi, jQuery)