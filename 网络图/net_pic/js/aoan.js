import { Graph } from "./libs/graph.js";
import { Vertex } from "./libs/vertex.js";
import { Edge } from "./libs/edge.js";
import { Dictionary } from "./libs/dictionary.js";
import { Libs } from "./libs/libs.js";
import { Gantt } from "./gantt.js";
import { Collection } from "./libs/collection.js"
import { Tree } from "./libs/tree.js";
import { Coordinate } from "./coordinate.js";
import { Joke } from "./libs/joke.js";

const TARGET_TASK_MODEL = {
    TEMPLATE: 1,
    CONVENTION: 2
};
const TASK_TYPE = {
    REAL: 1,                            //实工作
    REAL_TEXT: "实工作",                //实工作
    DUMMY: 2,                           //虚工作
    DUMMY_TEXT: "虚工作",               //虚工作
    HANG: 3,                            //挂起工作
    HANG_TEXT: "挂起工作",              //挂起工作
    AVOID_REPETITION: 4,                //避免重复
    AVOID_REPETITION_TEXT: "避免重复",  //避免重复
    LAG: 5,                             //延时工作
    LAG_TEXT: "延时",                    //延时工作   
    RELATION: 6,                         //延时工作
    RELATION_TEXT: "搭接关系"            //延时工作  
}
const TASK_LINK_TYPE = {
    FS: 0,
    FS_TEXT: "FS",
    SS: 1,
    SS_TEXT: "SS",
    FF: 2,
    FF_TEXT: "FF",
    SF: 3,
    SF_TEXT: "SF"
}

const ONLY_START_END = true;                //是否唯一起始点
const INDEPENDENT_START_HANG = false;        //开始处是否独立创建挂起工作
const INDEPENDENT_END_HANG = false;          //结束处是否独立创建挂起工作

export class ActivityOnArrowNetwork extends Graph {
    constructor(_ganttData, _option) {
        super();
        this.option = _option ? _option : null;                                  //项目其它配置信息
        this.layoutFactor = this.option.layoutFactor ? this.option.layoutFactor : 10;
        this.frontLinksCode = new Dictionary();                                  //初始网络图的紧前工序集
        this.followLinksCode = new Dictionary();                                 //初始网络图的紧后工序集
        this.frontLinks = new Dictionary();                                     //初始网络图的紧前工序集
        this.followLinks = new Dictionary();                                    //初始网络图的紧后工序集
        this.rawTasks = {};                                                   //任务集
        this.endTasks = [];
        this.dummyTasks = {};
        this.dummyTasks2 = {};
        this.aIntersects = {};
        this.timeScale = 1000 * 60 * 60 * 24;                                   //时间刻度：天
        this.arbitraryDummyEdge = {};
        this.firstNode = "1";
        this.lastNode = "LAST";
        this.projectStartTime = null;
        this.projectEndTime = null;
        this.dummyTasksTreeData = null;
        this.idTable = {};
        console.time("创建网络图:");
        this._createGraph(_ganttData);                                           //创建网络图
        console.timeEnd("创建网络图:");
        this.nodesData = {};
        this.edgesMap = {};
        this._initDate();                                                //获取基础数据
        this.sameTimeScale = {};
        //console.log("this.nodesData :", this.nodesData);
        //console.log("allPaths:", this.allPaths);
        //this._layoutPlan();
        //this.toString();
        //this.taskTopSort();

    }
    //创建网络图
    _createGraph(ganttData) {
        //=====================整理甘特图数据=================================
        let gantt = new Gantt(ganttData, this.timeScale, TARGET_TASK_MODEL.TEMPLATE, this.enforce);
        this.rawTasks = gantt.rawTasks;
        this.frontLinks = gantt.frontLinks;
        this.followLinks = gantt.followLinks;
        this.frontLinksCode = gantt.frontLinksCode;
        this.followLinksCode = gantt.followLinksCode;
        console.log("最终紧前关系：", this.frontLinks);
        console.log("最终紧后关系：", this.followLinks);
        console.log("最终紧前关系：", this.frontLinksCode);
        console.log("最终紧后关系：", this.followLinksCode);
        //console.log("gantt", gantt);
        this.projectEndTime = gantt.projectEndTime;
        this.projectStartTime = gantt.projectStartTime;
        //this._setMaxTime(gantt)
        //===================================================================
        this.endTasks = this._getStartEndTasks().endTasks;
        //console.log("this.endTasks",);
        this._createDummyTask();
        this._createRealTasks(gantt.links, gantt.unFS);
        //console.log("gantt.tasksTopSort",gantt.tasksTopSort);
        this._optimizeDummyTasks();         //优化虚工作
        this._handleArbitraryDummyEdge();   //处理任意方向的虚工作
        this.print();
        // this._identifierNodes();
        //this.drawSupplemenTasks();
        //this.drawDummyEdge();
    }
    //重新编号
    _identifierNodes() {
        // let myJson = new MyJson();
        // myJson.sortResults(this.vertexs, 'weight', 'number', true);
        // console.log(JSON.stringify(this.vertexs));
        this.vertexs = this.vertexs.sort((a, b) => {
            let dateA = new Date(a.xtime).getTime();
            let dateB = new Date(b.xtime).getTime();
            return (dateA - dateB);
        })

        //console.log("_vertexs", _vertexs);
        //为提高性能，先生成字典，避免遍历
        let idNodesTable = {};
        for (let i = 0; i < this.vertexs.length; i++) {
            idNodesTable[this.vertexs[i].code] = (i + 1) + '';
        }
        //重新编制节点
        //console.log(idNodesTable);
        this.firstNode = '1';
        this.lastNode = this.vertexs.length + '';
        this.renumber(idNodesTable);
    }
    //找到虚工作
    _createDummyTask() {
        let collection = new Collection();
        let keys = this.frontLinksCode.keys();
        for (let i = 0; i < keys.length; i++) {
            let aTaskCode = keys[i];                           //E
            let aInfo = this.getTaskInfo(aTaskCode);
            let aFronts = aInfo.frontsCode;                   //获取任务的紧前工序集Code
            let aFollows = aInfo.followsCode;                 //获取任务的紧后工序
            this.aIntersects[aTaskCode] = { tasks: [] };
            for (let j = 0; j < keys.length; j++) {
                let bTaskCode = keys[j];
                //console.log("--a:", aTaskCode, "，b:", bTaskCode);
                let bInfo = this.getTaskInfo(bTaskCode);
                let bFronts = bInfo.frontsCode;           //获取任务的紧前工序集Code
                let bFollows = bInfo.followsCode;         //获取任务的紧后工序
                if (aTaskCode !== bTaskCode) {
                    let intersect = collection.intersect(aFronts, bFronts);         //交集
                    let difference = collection.difference(aFronts, bFronts);       //差集
                    let key = collection.toStr(intersect, ",");
                    if (collection.isEqual(aFronts, bFronts) &&
                        collection.isEqual(aFollows, bFollows) &&
                        aFronts.length != 0) {
                        //console.log("--aFronts:", aFronts, "，key:", key, "bFronts", aTaskCode);
                        this._addArbitraryTask(aFronts, aInfo);
                    }
                    if (intersect.length > 0) {
                        //console.log("--a:", aTaskCode, "，b:", bTaskCode, "，aFronts:", aFronts, "，bFronts:", bFronts, "交集:", intersect, "差集:", difference);
                        let dummyInfo = {
                            "aFronts": aFronts,
                            "bFronts": bFronts,
                            "aTaskCode": aTaskCode,
                            "bTaskCode": bTaskCode,
                            "intersect": intersect,
                            "difference": difference
                        }

                        //console.log("----------key:", key, aTaskCode);
                        this.aIntersects[aTaskCode].tasks.push(dummyInfo);
                        this._addDummyTask(key, aTaskCode, dummyInfo);
                    }
                }
            }


        }

        //console.log("aIntersects:", JSON.stringify(this.aIntersects));
        //console.log("arbitraryDummyEdge:", this.arbitraryDummyEdge);
        //console.log("bNoDifference:", this.emptyDifference);

        let tree = new Tree();
        let dummyTasksTreeData = tree.getTree(this.dummyTasks);
        this.dummyTasksTreeData = dummyTasksTreeData;
        let _idTable = tree.idTableList;
        this.idTable = _idTable;
        //console.log("____idTable:", JSON.stringify(_idTable));
        //console.log("this.dummyTasks:", JSON.stringify(this.dummyTasks));
        //console.log("this.dummyTask2:", JSON.stringify(this.dummyTasks2));
        //console.log("dummyTasksTreeData:", JSON.stringify(dummyTasksTreeData));
        this._ergodicDummyTasks(dummyTasksTreeData)             // 执行递归
        //console.log(this.dummyTaskLinks)       // 查看结果

    }
    //优化虚工作
    _optimizeDummyTasks() {
        let collection = new Collection();
        let keys = this.edges.keys();
        for (let i = 0; i < keys.length; i++) {
            let code = keys[i];
            let edgeVertexs = this.edges.get(code);
            if (edgeVertexs) {
                if (edgeVertexs.length === 1) {
                } else {
                    for (let j = 0; j < edgeVertexs.length; j++) {
                        if (edgeVertexs[j]) {
                            let vType = edgeVertexs[j].type;
                            let vCode = edgeVertexs[j].code;
                            let vEnd = edgeVertexs[j].vertexEnd;
                            if (vType === TASK_TYPE.DUMMY) {
                                let has = this.hasPointSelf(code, vEnd);
                                if (has.has) {                              //有指向自己的边,表示是多余的节点
                                    //console.log("指向自己的节点，删除之", has.deleteNode);
                                    //this.removeEdge(vCode);                 //先删除这条虚边
                                    //this.onlyDeleteNode(has.deleteNode);    //删除找到的节点
                                } else {
                                    let node1Nodes = this.getNodeByNode(code);
                                    let node2Nodes = this.getNodeByNode(vEnd);
                                    let node1DummyNodes = node1Nodes.dummyNodes;
                                    let node1RealNodes = node1Nodes.realNodes;
                                    let node2DummyNodes = node2Nodes.dummyNodes;
                                    let node2RealNodes = node2Nodes.realNodes;
                                    let isProperSubset = false;

                                    if (node1DummyNodes.length != 0 &&
                                        node2DummyNodes.length != 0 &&
                                        node1RealNodes.length == 0) {
                                        isProperSubset = collection.isProperSubset(node2DummyNodes, node1DummyNodes);
                                    }

                                    if (isProperSubset) {
                                        //console.log(code, "-->", vEnd, "连接有完全子集，合并之", node1DummyNodes, node2DummyNodes);
                                        //console.log(code, "node1DummyNodes:", node1DummyNodes, "node1RealNodes:", node1RealNodes);
                                        //console.log(vEnd, "node2DummyNodes:", node2DummyNodes, "node2RealNodes:", node2RealNodes);
                                        //this.mergeNode(vEnd, code);
                                        this.mergeNodeForward(code, vEnd, vCode);        //向前合并
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        //前节点出度为1(第二遍优化关键路径)
        for (let i = 0; i < keys.length; i++) {
            let code = keys[i];
            let edgeVertexs = this.edges.get(code);
            if (edgeVertexs) {
                for (let j = 0; j < edgeVertexs.length; j++) {
                    if (edgeVertexs[j]) {
                        let vType = edgeVertexs[j].type;
                        let vCode = edgeVertexs[j].code;
                        let vEnd = edgeVertexs[j].vertexEnd;
                        let option = edgeVertexs[j].option;
                        if (vType === TASK_TYPE.DUMMY) {
                            let nodes = this.getNodeByNode(code).nodes;
                            let isCritical = this._inNodeCritical(code);
                            if (isCritical && nodes.length === 1) {
                                //console.log("----- ", code, "--->", vEnd, "----- ", code, "出度：", nodes, code, "_inNodeCritical", isCritical, nodes.length);
                                this.mergeNodeBackward(code, vEnd, vCode);   //向后合并节点
                            }
                        }
                    }
                }
            }
        }
        //后节点入度为1(第二遍优化关键路径)
        for (let i = 0; i < keys.length; i++) {
            let code = keys[i];
            let edgeVertexs = this.edges.get(code);
            if (edgeVertexs) {
                for (let j = 0; j < edgeVertexs.length; j++) {
                    if (edgeVertexs[j]) {
                        let vType = edgeVertexs[j].type;
                        let vCode = edgeVertexs[j].code;
                        let vEnd = edgeVertexs[j].vertexEnd;
                        if (vType === TASK_TYPE.DUMMY) {
                            let nodes = this.getOppositeNodeByNode(vEnd).nodes;
                            let isCritical = this._outNodeCritical(vEnd);
                            if (isCritical && nodes.length === 1) {
                                //console.log("+++++", code, "-->", vEnd, "----", vCode, "入度：", nodes, code, "_outNodeCritical", isCritical);
                                //this.mergeNode2(vEnd, code);
                                //this.removeEdge(vCode);                            //移除虚工作的边
                                this.mergeNodeForward(code, vEnd, vCode);            //向前合并节点
                            }
                        }
                    }
                }
            }
        }
        //前节点出度为1(第一遍优化非关键路径)
        for (let i = 0; i < keys.length; i++) {
            let code = keys[i];
            let edgeVertexs = this.edges.get(code);
            if (edgeVertexs) {
                for (let j = 0; j < edgeVertexs.length; j++) {
                    if (edgeVertexs[j]) {
                        let vType = edgeVertexs[j].type;
                        let vCode = edgeVertexs[j].code;
                        let vEnd = edgeVertexs[j].vertexEnd;
                        let option = edgeVertexs[j].option;
                        if (vType === TASK_TYPE.DUMMY) {
                            let nodes = this.getNodeByNode(code).nodes;
                            let isCritical = this._inNodeCritical(code);
                            //console.log("----- ", code, "--->", vEnd, "----- ", code, "出度：", nodes, code, "_inNodeCritical!!", isCritical);
                            if (!isCritical && nodes.length === 1) {
                                this.mergeNodeBackward(code, vEnd, vCode);   //向后合并节点
                            }
                        }
                    }
                }
            }
        }
        //后节点入度为1(第一遍优化非关键路径)
        for (let i = 0; i < keys.length; i++) {
            let code = keys[i];
            let edgeVertexs = this.edges.get(code);
            if (edgeVertexs) {
                for (let j = 0; j < edgeVertexs.length; j++) {
                    if (edgeVertexs[j]) {
                        let vType = edgeVertexs[j].type;
                        let vCode = edgeVertexs[j].code;
                        let vEnd = edgeVertexs[j].vertexEnd;
                        if (vType === TASK_TYPE.DUMMY) {
                            let nodes = this.getOppositeNodeByNode(vEnd).nodes;
                            let isCritical = this._outNodeCritical(vEnd);
                            if (!isCritical && nodes.length === 1) {
                                //console.log("+++++", code, "-->", vEnd, "----", vEnd, "入度：", nodes, code, "_outNodeCritical", isCritical);
                                //this.mergeNode2(vEnd, code);
                                //this.removeEdge(vCode);                                 //移除虚工作的边
                                this.mergeNodeForward(code, vEnd, vCode);            //向前合并节点
                            }
                        }
                    }
                }
            }
        }
        //如果节点同时指向虚工作的前后节点，而后节点除了虚工作，只有一条指向自己的虚边，则向前合并虚节点
        for (let i = 0; i < keys.length; i++) {
            let code = keys[i];
            let edgeVertexs = this.edges.get(code);
            if (edgeVertexs) {
                for (let j = 0; j < edgeVertexs.length; j++) {
                    if (edgeVertexs[j]) {
                        let vType = edgeVertexs[j].type;
                        let vCode = edgeVertexs[j].code;
                        let vEnd = edgeVertexs[j].vertexEnd;
                        if (vType === TASK_TYPE.DUMMY) {
                            let frontNodes = this.getOppositeNodeByNode(code).dummyNodes;
                            let followNodes = this.getOppositeNodeByNode(vEnd).dummyNodes;
                            // //console.log("++++++", code, "-->", vEnd);
                            // //console.log("++++++frontNodes", frontNodes, "followNodes：", followNodes);
                            // //console.log("++++++intersectNodes：", intersectNodes);
                            // //console.log("++++++differenceNodes：", differenceNodes);
                            // //console.log("++++++frontNodes", frontNodes, "followNodes：", followNodes);
                            let intersectNodes = collection.intersect(followNodes, frontNodes);
                            let differenceNodes = collection.difference(followNodes, frontNodes);
                            if (intersectNodes.length == 1 &&
                                differenceNodes.length == 1 &&
                                differenceNodes[0] == code) {
                                //this.mergeNodeForward(code, vEnd, vCode);            //向前合并节点
                            }

                        }
                    }
                }
            }
        }
    }
    //判断是否有指向节点的关键任务
    _inNodeCritical(node) {
        let keys = this.edges.keys();
        for (let i = 0; i < keys.length; i++) {
            let code = keys[i];
            let edgeVertexs = this.edges.get(code);
            for (let j = 0; j < edgeVertexs.length; j++) {
                if (edgeVertexs[j]) {
                    let vEnd = edgeVertexs[j].vertexEnd;
                    if (vEnd == node) {
                        if (edgeVertexs[j].option) {
                            let isCritical = edgeVertexs[j].option.isCriticalTask;
                            if (isCritical == true) {
                                return (true);
                            }
                        }
                    }
                }
            }
        }
        return (false);
    }
    //判断节点是否有指向关键任务
    _outNodeCritical(node) {
        let edgeVertexs = this.edges.get(node);
        if (edgeVertexs) {
            for (let j = 0; j < edgeVertexs.length; j++) {
                if (edgeVertexs[j]) {
                    if (edgeVertexs[j].option) {
                        let isCritical = edgeVertexs[j].option.isCriticalTask;
                        if (isCritical === true) {
                            return (true);
                        }
                    }
                }
            }
        }
        return (false);
    }
    //只找长度最接近级别的父级key
    _getParentKey(nowKey) {
        //console.log("nowKey:", nowKey);
        let keyArr = ("" + nowKey).split(",");
        let collection = new Collection();
        let parentKeys = [];
        let isFirstFinded = 0;
        for (let i = this.idTable.length - 1; i >= 0; i--) {
            let parentKey = this.idTable[i].key;
            let parentKeyArr = parentKey.split(",");
            let intersect = collection.intersect(keyArr, parentKeyArr);
            //console.log("i:", i, "parentKey:", parentKey, "nowKey:", nowKey, "intersect", intersect, "keyArr.length", keyArr.length, "parentKeyArr.length", parentKeyArr.length);
            if (parentKey != nowKey && intersect.length != 0 &&
                keyArr.length < parentKeyArr.length) {
                if (isFirstFinded == 0) {
                    //console.log("找到：", parentKeyArr.length);
                    isFirstFinded = parentKeyArr.length;
                    break;
                }
            }
        }

        for (let i = this.idTable.length - 1; i >= 0; i--) {
            let parentKey = this.idTable[i].key;
            let parentKeyArr = parentKey.split(",");
            let intersect = collection.intersect(keyArr, parentKeyArr);
            if (parentKey != nowKey && intersect.length != 0 &&
                keyArr.length < parentKeyArr.length && isFirstFinded == parentKeyArr.length) {
                parentKeys.push(parentKey);
            }
        }
        return (parentKeys);
    }
    //找全部父级key
    _getAllParentKey(nowKey) {
        //console.log("nowKey:", nowKey);
        let keyArr = ("" + nowKey).split(",");
        let collection = new Collection();
        let parentKeys = [];
        let isFirstFinded = 0;
        for (let i = this.idTable.length - 1; i >= 0; i--) {
            let parentKey = this.idTable[i].key;
            let parentKeyArr = parentKey.split(",");
            let intersect = collection.intersect(keyArr, parentKeyArr);
            if (parentKey != nowKey && intersect.length != 0) {
                parentKeys.push(parentKey);
            }
        }
        return (parentKeys);
    }
    //移除边
    removeParentEdge(parentKey, key) {
        for (let i = 0; i < this.dummyToEdge.length; i++) {
            if (this.dummyToEdge[i].start == key && this.dummyToEdge[i].end == parentKey) {
                this.dummyToEdge.splice(i, 1);
            }
        }
    }
    //创建子集到一个汇点的多个任务
    _createSetTasks(key, parentKey) {
        let collection = new Collection();
        //如果找到父集，则移除对应父集创建的边
        if (parentKey.length != 0) {
            for (let temp1 = 0; temp1 < parentKey.length; temp1++) {
                let _parentKey = parentKey[temp1];
                let _parentKeyArr = _parentKey.split(",");
                let keyArr = key.split(",");
                let tempKeyInt = collection.intersect(_parentKeyArr, keyArr);
                //console.log("交集：：：：：：：：：：：：：：：：：", tempKeyInt);
                for (let s = 0; s < tempKeyInt.length; s++) {
                    let __key = tempKeyInt[s];
                    //console.log("移除实边:", _parentKey, __key);
                    // this.removeParentEdge(_parentKey, __key);
                    //console.log("2222");
                    this.removeEdge(__key);
                }
            }
        }
        //创建分别从key汇到一个点
        let meetingNode = "M-" + key
        let ret = {
            meetingNode: meetingNode,
            isCreated: false
        }
        let keyArr = key.split(",");
        for (let s = 0; s < keyArr.length; s++) {
            let __key = keyArr[s];
            let task = this.getTaskInfo(__key);
            let taskNode = this.getTaskNode(__key);
            let taskIsCreated = true;
            if (taskNode == null) {
                taskNode = this.createTaskNode(task);
                taskIsCreated = false;
            }

            if (taskIsCreated) {
                this.addDummyEdge(taskNode.end, meetingNode, "D:" + taskNode.end + "->" + meetingNode, task);
            } else {
                this._addTaskEdge(taskNode.start, meetingNode, task);
            }
        }
        return (ret);
    }
    //遍历this.dummyTasks计算出虚工作和特殊情况的边创建规则
    _ergodicDummyTasks(source) {
        let collection = new Collection();
        source.forEach(el => {
            let key = el.key;
            let parentKey = this._getParentKey(key);
            let diff = el.diff;
            let data = el.data;
            //console.log(key, "父级key:", parentKey, "diff:", diff, "data:", data);
            let keys = Object.keys(data);
            //遍历数据
            for (let x = 0; x < keys.length; x++) {
                let _data = data[keys[x]];
                let _keys = Object.keys(_data);
                for (let y = 0; y < _keys.length; y++) {
                    let __data = _data[_keys[y]];
                    let aTaskCode = __data.aTaskCode;
                    let difference = __data.difference;
                    //如果父级创建过，则忽略，否则创建虚工作
                    let parentFinded = 0;
                    //console.log("===parentKey:", parentKey, "key:", key, "aTaskCode:", aTaskCode, "_keys[y]:", _keys[y], "difference：", difference, "====");
                    if (parentKey.length != 0) {
                        for (let temp1 = 0; temp1 < parentKey.length; temp1++) {
                            let _parentKey = parentKey[temp1];
                            let _parentKeyArr = _parentKey.split(",");
                            let keyArr = key.split(",");
                            let tempKeyInt = collection.intersect(_parentKeyArr, keyArr);
                            //console.log(_parentKey, ",", key, ",tempKeyInt::", tempKeyInt);
                            if (tempKeyInt.length > 0) {
                                if (this.dummyTasks[_parentKey]) {
                                    let parentDummyTasks = this.dummyTasks[_parentKey];
                                    let parentKeys = Object.keys(parentDummyTasks);
                                    for (let s = 0; s < parentKeys.length; s++) {
                                        let parentIntKey = parentKeys[s];
                                        let taskKeys = Object.keys(parentDummyTasks[parentIntKey]);
                                        for (let s1 = 0; s1 < taskKeys.length; s1++) {
                                            //console.log("wwww:", parentDummyTasks[parentIntKey][taskKeys[s1]]);
                                            let _aTaskCode = parentDummyTasks[parentIntKey][taskKeys[s1]].aTaskCode;
                                            let _difference = parentDummyTasks[parentIntKey][taskKeys[s1]].difference;
                                            //console.log("不创建_aTaskCode:", _aTaskCode + "---aTaskCode:" + aTaskCode, "--_difference", _difference);
                                            if (_aTaskCode == aTaskCode && _difference.length != 0) {
                                                //console.log("不创建", key + "->" + aTaskCode);
                                                parentFinded++;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }

                    //let meetingNode = this._createSetTasks(key, parentKey);
                    let createSetTasks = this._createSetTasks(key, parentKey);
                    //console.log('createSetTasks', createSetTasks);
                    let meetingNode = createSetTasks.meetingNode;
                    if (difference.length != 0) {
                        if (parentFinded == 0) {
                            let aTask = this.getTaskInfo(aTaskCode);
                            let aTaskNode = this.getTaskNode(aTaskCode);
                            //console.log(aTaskCode, "---", aTaskNode);
                            let aTaskIsCreated = true;
                            if (aTaskNode == null) {
                                aTaskNode = this.createTaskNode(aTask);
                                aTaskIsCreated = false;
                            }


                            //console.log(aTask, "---", aTaskNode);
                            this._addTaskEdge(aTaskNode.start, aTaskNode.end, aTask);
                            //创建交集汇点到aTask的虚工作
                            let dummyCode = "D:" + meetingNode + "->" + aTaskNode.start;
                            //console.log(aTaskIsCreated, aTask.text, "创建22:", meetingNode, aTaskNode.start, dummyCode, null);
                            this.addDummyEdge(meetingNode, aTaskNode.start, dummyCode, aTask);
                        }
                    } else {
                        //实连接
                        let aTask = this.getTaskInfo(aTaskCode);
                        let aTaskNode = this.getTaskNode(aTaskCode);
                        let aTaskIsCreated = true;
                        if (aTaskNode == null) {
                            aTaskNode = this.createTaskNode(aTask);
                            aTaskIsCreated = false;
                        }
                        if (aTaskIsCreated) {
                            let dummyCode = "D:" + meetingNode + "->" + aTaskNode.start;
                            this.addDummyEdge(meetingNode, aTaskNode.start, dummyCode, aTask);
                        } else {
                            this._addTaskEdge(meetingNode, aTaskNode.end, aTask);
                        }

                    }
                }
            }


            //递归调用
            if (el.subset && el.subset.length > 0) {     //如果有子集
                //console.log(key, "==================");
                this._ergodicDummyTasks(el.subset)
            } else {                                     //没有子集
                //console.log(key, "++++++++++++++");
            }
        })
    }
    //如果有多级包含关系，则父级创建过的，这里忽略创建
    _isCreateTask(frontCode, code) {
        let parentKeys = this._getAllParentKey(frontCode);
        //console.log(code, "parentKey:", parentKeys);
        if (parentKeys.length == 0) {
            // //console.log("已经返回true");
            return (true);              //没有找到父级key、直接返回未创建
        } else {
            //循环查找，是否父级已经创建过
            for (let parentKeyI = 0; parentKeyI < parentKeys.length; parentKeys++) {
                let parentKey = parentKeys[parentKeyI];
                if (this.dummyTasks[parentKey]) {
                    let parentDummyTasks = this.dummyTasks[parentKey];
                    let keys = Object.keys(parentDummyTasks);
                    for (let s = 0; s < keys.length; s++) {
                        // //console.log("keys:", keys[s], parentDummyTasks[keys[s]]);
                        let tasks = parentDummyTasks[keys[s]];
                        let _keys = Object.keys(tasks);
                        for (let ss = 0; ss < _keys.length; ss++) {
                            let task = parentDummyTasks[keys[s]][_keys[ss]];
                            // //console.log(_keys[ss], "---", task.aTaskCode, task.aTaskCode == code);
                            if (task.aTaskCode == code) {
                                return (false);
                            }
                        }
                    }
                }
            }
            return (true);
        }
    }
    //找到链接点
    _findConnectioNode() {
        let keys = Object.keys(this.arbitraryDummyEdge);
        if (keys.length > 0) {
            for (let i = 0; i < keys.length; i++) {
                if (this.arbitraryDummyEdge[keys[i]]) {
                    let tasks = (this.arbitraryDummyEdge[keys[i]]).tasks;
                    let temp = [];
                    let lastTask = null;
                    let lastCriticalTask = null;
                    let isUnCriticalPush = true;
                    let isUnPush = true;
                    //console.log("==========", keys[i], "tasks", tasks);
                    if (tasks.length > 0) {
                        //优先寻找关键路径上的任务
                        for (let j = 0; j < tasks.length; j++) {
                            let task = tasks[j];
                            let taskNode = this.getTaskNode(task.code);
                            //console.log(task.code, taskNode);
                            let endEdges = this.getEdges(taskNode.end);
                            let hasRealTask = 0;
                            let hasCritical = 0;
                            //console.log(task.code, "endEdges:", endEdges, "taskNode", taskNode);

                            for (let tt = 0; tt < endEdges.length; tt++) {
                                //console.log("endEdges[tt]", endEdges[tt]);
                                if (endEdges[tt].type == 1) {
                                    hasRealTask++;
                                    if (endEdges[tt].option) {
                                        if (endEdges[tt].option.isCriticalTask == true) {
                                            hasCritical++;
                                        }
                                    }
                                }
                            }
                            //console.log(taskNode.end, "--->", endEdges, "hasCritical:", hasCritical, "hasRealTask:", hasRealTask);
                            if (hasCritical > 0 && isUnCriticalPush) {
                                lastCriticalTask = { task: task, node: taskNode };
                                isUnCriticalPush = false;
                            } else if (hasRealTask > 0 && isUnPush) {
                                lastTask = { task: task, node: taskNode };
                                isUnPush = false;
                            } else {
                                temp.push({ task: task, node: taskNode });
                            }
                        }
                    }
                    if (lastTask != null) {
                        temp.push(lastTask);
                    }
                    if (lastCriticalTask != null) {
                        temp.push(lastCriticalTask);
                    }
                    this.arbitraryDummyEdge[keys[i]].tasks = temp;
                }
            }
        }
    }
    //将任意方向的虚工作代码转换为节点
    _handleArbitraryDummyEdge() {
        //console.log(this.arbitraryDummyEdge);
        let keys = Object.keys(this.arbitraryDummyEdge);
        if (keys.length > 0) {
            this._findConnectioNode();   //寻找连接点
            //连接这些节点
            for (let i = 0; i < keys.length; i++) {
                let frontCode = keys[i];
                let frontNode = this.getTaskNode(frontCode);
                if (this.arbitraryDummyEdge[keys[i]]) {
                    let tasks = (this.arbitraryDummyEdge[keys[i]]).tasks;
                    if (tasks.length > 0) {
                        if (tasks.length == 1) {
                            let node1 = tasks[0].node;
                            //console.log("开始节点是：", node1.start);
                            this.setFirstNode(node1.start);
                            this.firstNode = node1.start;
                        } else {
                            for (let j = 0; j < tasks.length - 1; j++) {
                                let task1 = tasks[j].task;
                                let node1 = tasks[j].node;
                                let task2 = tasks[j + 1].task;
                                let node2 = tasks[j + 1].node;
                                if (frontCode == "FIRST" && j == 0) {
                                    //console.log("开始节点是：", node1.start);
                                    this.setFirstNode(node1.start);
                                    this.firstNode = node1.start;
                                }
                                //console.log(task2.code, "节点", task2Node);
                                //如果合并节点后不重复，则连接节点
                                //console.log("连接", node1, node2);
                                let dummyCode = "D:" + node1.start + "->" + node2.start;
                                if (node1.end == node2.end && node1.start == node2.start) {
                                    //开始结束节点都相同，需添加虚节点
                                    if (tasks.length - 2 == j) {
                                        //console.log("倒数第二个", task1, "最后一个", task2);
                                        dummyCode = "D:" + "DT" + task1.code + "->" + node2.end;
                                        this._modifyTaskNode(task1, node1.start, "DT" + task1.code);
                                        this.addDummyEdge("DT" + task1.code, node2.end, dummyCode, task1);
                                    } else {
                                        dummyCode = "D:" + "DT" + task1.code + "->" + "DT" + task2.code;
                                        this._modifyTaskNode(task1, node1.start, "DT" + task1.code);
                                        this._modifyTaskNode(task2, node2.start, "DT" + task2.code);
                                        this.addDummyEdge("DT" + task1.code, "DT" + task2.code, dummyCode, task1);
                                    }
                                } else if (node1.end == node2.end || frontCode == "FIRST") {
                                    //结束节点相同，则从头连接
                                    //console.log("头连接");
                                    dummyCode = "D:" + node1.start + "->" + node2.start;
                                    this.addDummyEdge(node1.start, node2.start, dummyCode, task1);
                                } else if (node1.start == node2.start) {
                                    //开始节点相同，则从尾部连接
                                    //console.log("尾连接");
                                    //console.log(node1, node2);
                                    dummyCode = "D:" + node1.end + "->" + node2.end;
                                    this.addDummyEdge(node1.end, node2.end, dummyCode, task1);
                                } else {
                                    //console.log("合并");
                                    this._modifyTaskNode(task2, frontNode.end, node2.end);
                                }
                            }
                        }
                        //console.log("tasks[j].tasktasks[j].task", tasks[tasks.length - 1].task);
                    }
                }
            }
        }
    }
    //创建实工作
    //_createRealTasks(unFS) {
    _createRealTasks(FS, unFS) {
        //创建FS关系的任务
        //this._drawFSTasksByLink(FS)           //线性算法
        this._drawFSTasks(this.endTasks);       //递归算法
        //创建非FS关系的任务
        this._drawUnFSTasks(unFS);
    }
    //创建全部FS实工作，递归算法
    _drawFSTasks(tasks) {                    //递归方式
        //递归方式
        for (let i = 0; i < tasks.length; i++) {
            let task = tasks[i];
            if (task !== null) {
                if (task.isFirstTask && task.isLastTask) {                  //既是开始就是结束，则是孤立任务
                    this._createSeparateTask(task);                         //创建孤立任务
                } else {
                    let taskFronts = task.fronts;                           //获取任务的紧前
                    if (taskFronts.length === 0) {                          //没有紧前任务则退出递归
                        return;
                    } else {
                        for (let t = 0; t < taskFronts.length; t++) {
                            let taskFront = taskFronts[t];
                            if (taskFront !== null) {
                                this._createFSTaskLink(taskFront, task);    //创建有关系的任务
                            }
                        }
                    }
                    this._drawFSTasks(taskFronts);                          //递归
                }
            }
        }
    }
    //画全部FS实工作，Links线性算法
    _drawFSTasksByLink(FSLinks) {
        //创建没有关系的孤立任务
        let keys = Object.keys(this.rawTasks);
        for (let i = 0; i < keys.length; i++) {
            let task = this.rawTasks[keys[i]];
            if (task !== null) {
                if (task.isFirstTask && task.isLastTask) {      //即是开始就是结束，则是孤立任务
                    this._createSeparateTask(task);
                }
            }
        }
        //使用link关系，线型创建FS实工作
        //console.log("--fs-->", FSLinks);
        if (FSLinks.length > 0) {
            for (let i = 0; i < FSLinks.length; i++) {
                let link = FSLinks[i];
                //console.log("--fs-->", link);
                let frontId = link.frontId;
                let followId = link.followId;
                let taskFront = this.getTaskInfo(frontId);
                let task = this.getTaskInfo(followId);
                if (task && taskFront) {
                    this._createFSTaskLink(taskFront, task);
                } else {
                    if (this.enforce) {
                        console.log("Error:缺少任务", frontId, "或", followId);
                    } else {
                        throw new Error("缺少任务" + frontId, "或" + followId);
                    }
                }
            }
        }
    }
    //画非FS实工作
    _drawUnFSTasks(unFSLinks) {
        //console.log("--unFS-->", unFSLinks);
        if (unFSLinks.length > 0) {
            for (let i = 0; i < unFSLinks.length; i++) {
                let link = unFSLinks[i];
                let frontId = link.frontId;
                let followId = link.followId;
                let taskFront = this.getTaskInfo(frontId);
                let task = this.getTaskInfo(followId);
                if (task && taskFront) {
                    this._createUnFSTaskLink(link);
                } else {
                    if (this.enforce) {
                        console.log("Error:缺少任务", frontId, "或", followId);
                    } else {
                        throw new Error("缺少任务" + frontId, "或" + followId);
                    }
                }
            }
        }
    }
    //创建非FS关系
    _createUnFSTaskLink(link) {
        let frontTask = this.getTaskInfo(link.frontId);
        let task = this.getTaskInfo(link.followId);
        //console.log("SS:", frontTask.text, "--->", task.text);
        //console.log("SS:", frontTask.code, "--->", task.code);
        let frontTaskIsCreate = frontTask.isCreated;                                    //紧前任务是否已经创建
        let taskIsCreate = task.isCreated;                                              //后任务是否已经创建
        let lag = Number(link.lag ? link.lag : 0);
        let type = link.type;
        let _frontNode = null;
        let _taskNode = null;

        if (!frontTaskIsCreate && !taskIsCreate) {                                      //都没有创建过
            _frontNode = this._createFrontTaskEdge(frontTask);                          //创建紧前任务并获取节点
            _taskNode = this._createTaskEdge(task);                                     //创建后任务并获取节点
        } else {
            if (frontTaskIsCreate && taskIsCreate) {                                    //都已经创建过
                _frontNode = this.getTaskNode(frontTask.code);
                _taskNode = this.getTaskNode(task.code);
            } else if (!frontTaskIsCreate) {                                            //紧前没有创建过
                _taskNode = this.getTaskNode(task.code);                                //获取后任务的节点信息
                _frontNode = this._createFrontTaskEdge(frontTask);                      //创建紧前任务并获取节点
            } else if (!taskIsCreate) {                                                 //后任务没有创建过
                _frontNode = this.getTaskNode(frontTask.code);                          //获取紧前任务的节点信息
                _taskNode = this._createTaskEdge(task);                                 //创建后任务并获取节点
            }
        }
        //创建搭接关系
        //console.log("_frontNode:", _frontNode);
        //console.log("_taskNode:", _taskNode);
        switch (type) {
            case TASK_LINK_TYPE.SS:
                if (_frontNode.start !== _taskNode.start) {
                    let option = {
                        "taskType": TASK_TYPE.RELATION,
                        "typeText": TASK_TYPE.RELATION_TEXT,
                        "lag": lag,
                        "relationLinkType": TASK_LINK_TYPE.SS,
                        "relationLinkTypeText": TASK_LINK_TYPE.SS_TEXT
                    }
                    this._createEdge({
                        node: _frontNode.start,
                        time: _frontNode.startTime,
                        critical: frontTask.isCriticalTask
                    }, {
                        node: _taskNode.start,
                        time: _taskNode.startTime,
                        critical: task.isCriticalTask
                    },
                        TASK_TYPE.RELATION,
                        frontTask.isCriticalTask && task.isCriticalTask,
                        "R-SS-" + frontTask.code + "-" + task.code,
                        option);
                }
                break;
            case TASK_LINK_TYPE.FF:
                if (_frontNode.end !== _taskNode.end) {
                    let option = {
                        "taskType": TASK_TYPE.RELATION,
                        "typeText": TASK_TYPE.RELATION_TEXT,
                        "lag": lag,
                        "relationLinkType": TASK_LINK_TYPE.FF,
                        "relationLinkTypeText": TASK_LINK_TYPE.FF_TEXT
                    }
                    this._createEdge({
                        node: _frontNode.end,
                        time: _frontNode.endTime,
                        critical: frontTask.isCriticalTask
                    }, {
                        node: _taskNode.end,
                        time: _taskNode.endTime,
                        critical: task.isCriticalTask
                    },
                        TASK_TYPE.RELATION,
                        frontTask.isCriticalTask && task.isCriticalTask,
                        "R-FF-" + frontTask.code + "-" + task.code,
                        option);
                }
                break;
            case TASK_LINK_TYPE.SF:
                if (_frontNode.start !== _taskNode.end) {
                    let option = {
                        "taskType": TASK_TYPE.RELATION,
                        "typeText": TASK_TYPE.RELATION_TEXT,
                        "lag": lag,
                        "relationLinkType": TASK_LINK_TYPE.SF,
                        "relationLinkTypeText": TASK_LINK_TYPE.SF_TEXT
                    }
                    this._createEdge({
                        node: _frontNode.start,
                        time: _frontNode.startTime,
                        critical: frontTask.isCriticalTask
                    }, {
                        node: _taskNode.end,
                        time: _taskNode.endTime,
                        critical: task.isCriticalTask
                    },
                        TASK_TYPE.RELATION,
                        frontTask.isCriticalTask && task.isCriticalTask,
                        "R-SF-" + frontTask.code + "-" + task.code,
                        option);
                }
                break;
            default:
                if (this.enforce) {
                    console.log("Error:错误的搭接关系，必须是：0,1,2,3，当前关系：" + JSON.stringify(link));
                } else {
                    throw new Error("错误的搭接关系，必须是：0,1,2,3，当前关系：" + JSON.stringify(link));
                }
        }
    }
    //创建有关系的两个任务
    _createFSTaskLink(frontTask, task) {
        let frontTaskIsCreate = frontTask.isCreated;                                    //紧前任务是否已经创建
        let taskIsCreate = task.isCreated;                                              //后任务是否已经创建
        let relation = frontTask.relation;
        let source = relation.frontId;
        let target = relation.followId;
        let lag = 0;
        //console.log('-------', frontTask.text, task.text);
        //只有关系符合时才计算延时数据
        if (source === frontTask.code && target === task.code) {
            lag = relation.lag
            // if (lag !== 0) {
            //     console.log('-------', lag);
            // }
        };
        if (!frontTaskIsCreate && !taskIsCreate) {                               //都没有创建过
            this._createConsecutiveFSTask(frontTask, task, lag);
        } else {

            let _frontNode = null;
            let _taskNode = null;
            if (frontTaskIsCreate && taskIsCreate) {                                        //都已经创建过
                //console.log('1');
                _frontNode = this.getTaskNode(frontTask.code);
                _taskNode = this.getTaskNode(task.code);
            } else if (!frontTaskIsCreate) {                                                //紧前没有创建过
                //console.log('2');
                _taskNode = this.getTaskNode(task.code);                                //获取后任务的节点信息
                _frontNode = this._createFrontTaskEdge(frontTask);                      //创建紧前任务并获取节点
            } else if (!taskIsCreate) {                                                     //后任务没有创建过
                //console.log('3');
                _frontNode = this.getTaskNode(frontTask.code);                       //获取紧前任务的节点信息
                _taskNode = this._createTaskEdge(task);                                  //创建后任务并获取节点
            }

            //创建虚工作或延时工作
            if (_frontNode.end !== _taskNode.start) {     //说明不是直接创建的，创建虚工作暂时连接
                let option = {
                    "taskType": TASK_TYPE.RELATION,
                    "typeText": TASK_TYPE.RELATION_TEXT,
                    "lag": lag,
                    "relationLinkType": TASK_LINK_TYPE.FS,
                    "relationLinkTypeText": TASK_LINK_TYPE.FS_TEXT
                }
                if (lag !== 0) {
                    //console.log('-------', _frontNode, _taskNode);                   //创建延时工作
                    this._createEdge({
                        node: _frontNode.end,
                        time: _frontNode.endTime,
                        critical: frontTask.isCriticalTask
                    }, {
                        node: _taskNode.start,
                        time: _taskNode.startTime,
                        critical: task.isCriticalTask
                    },
                        TASK_TYPE.LAG,
                        frontTask.isCriticalTask,
                        "L" + frontTask.code + "-" + task.code,
                        option);
                } else {                                                                //创建虚工作
                    let tempCode = "D:" + _frontNode.end + "->" + _taskNode.start;
                    this.addDummyEdge(_frontNode.end, _taskNode.start, tempCode, option);
                }
            }
        }
    }
    //直接创建连续节点的两个任务
    _createConsecutiveFSTask(frontTask, task, lag) {
        //==================创建前任务================================
        let libs = new Libs();
        let createTaskNodeFront = this.createTaskNode(frontTask);
        let createTaskNode = this.createTaskNode(task);
        let realEdgeNode1 = {
            node: createTaskNodeFront.start,
            time: frontTask.start_date,
            critical: frontTask.isCriticalTask
        };
        let realEdgeNode2 = {
            node: createTaskNodeFront.end,
            time: frontTask.end_date,
            critical: frontTask.isCriticalTask
        };
        let realEdgeNode3 = {
            node: createTaskNode.start,
            time: task.start_date,
            critical: task.isCriticalTask
        };
        let realEdgeNode4 = {
            node: createTaskNode.end,
            time: task.end_date,
            critical: task.isCriticalTask
        };
        if (lag !== 0) {        //创建延时工作
            let lagEdgeNode1 = {
                node: realEdgeNode2.node,
                time: '',
                critical: frontTask.isCriticalTask
            };
            let lagEdgeNode2 = {
                node: realEdgeNode3.node,
                time: '',
                critical: task.isCriticalTask
            };
            //创建延迟任务
            let option = {
                "taskType": TASK_TYPE.RELATION,
                "typeText": TASK_TYPE.RELATION_TEXT,
                "lag": lag,
                "relationLinkType": TASK_LINK_TYPE.FS,
                "relationLinkTypeText": TASK_LINK_TYPE.FS_TEXT
            }
            let lagTaskCode = "L" + frontTask.code + "-" + task.code;
            let edgeIsCritical = frontTask.isCriticalTask && task.isCriticalTask;
            this._createEdge(lagEdgeNode1, lagEdgeNode2, TASK_TYPE.LAG, edgeIsCritical, lagTaskCode, option);
        } else {
            realEdgeNode2 = {
                node: createTaskNode.start,
                time: task.start_date,
                critical: frontTask.isCriticalTask
            };
            realEdgeNode3 = {
                node: createTaskNode.start,
                time: task.start_date,
                critical: task.isCriticalTask
            };
        }

        if (task.isLastTask === true &&
            task.end_date !== this.projectEndTime &&
            ONLY_START_END) {
            //创建后挂起工作
            let hangNode = {
                node: this.lastNode,
                time: this.projectEndTime,
                critical: true
            };
            //修改后任务的节点信息
            realEdgeNode4.node = realEdgeNode4.node + 'TE';
            //console.log('hangNode', hangNode, 'realEdgeNode4', realEdgeNode4);
            let hangTaskCode = "HE" + task.code;
            let hangTime = libs.dateDifferenceToDays(realEdgeNode4.time, this.projectEndTime).diff;
            let option = {
                "taskType": TASK_TYPE.HANG,
                "typeText": TASK_TYPE.HANG_TEXT,
                "hangTime": hangTime
            }
            this._createEdge(realEdgeNode4, hangNode, TASK_TYPE.HANG, task.isCriticalTask, hangTaskCode, option);
        }
        if (frontTask.isFirstTask === true &&
            frontTask.start_date !== this.projectStartTime &&
            ONLY_START_END) {
            //创建前挂起工作
            let hangNode = {
                node: this.firstNode,
                time: this.projectStartTime,
                critical: true
            };
            //修改前任务的节点信息
            realEdgeNode1.node = realEdgeNode1.node + 'TS';
            let hangTaskCode = "HS" + frontTask.code;
            let hangTime = libs.dateDifferenceToDays(this.projectStartTime, realEdgeNode1.time).diff;
            let option = {
                "taskType": TASK_TYPE.HANG,
                "typeText": TASK_TYPE.HANG_TEXT,
                "hangTime": hangTime
            }
            this._createEdge(hangNode, realEdgeNode1, TASK_TYPE.HANG, frontTask.isCriticalTask, hangTaskCode, option);
        }
        //创建前任务
        this._createEdge(realEdgeNode1, realEdgeNode2, TASK_TYPE.REAL, frontTask.isCriticalTask, frontTask.code, frontTask);
        //创建后任务
        this._createEdge(realEdgeNode3, realEdgeNode4, TASK_TYPE.REAL, task.isCriticalTask, task.code, task);
    }
    //创建前任务
    _createFrontTaskEdge(task) {
        let libs = new Libs();
        let taskStartDate = task.start_date;
        let taskEndDate = task.end_date;
        let frontMaxEndTime = task.frontMaxEndTime ? task.frontMaxEndTime : taskStartDate;
        let createTaskNode = this.createTaskNode(task);
        let result = {};
        let startHangTime = libs.dateDifferenceToDays(frontMaxEndTime, taskStartDate).diff;  //记录开始挂起时间长度
        let taskEdgeStart = {
            node: createTaskNode.start,
            time: taskStartDate,
            critical: task.isCriticalTask
        };
        let taskEdgeEnd = {
            node: createTaskNode.end,
            time: taskEndDate,
            critical: task.isCriticalTask

        };
        if (startHangTime !== 0 && INDEPENDENT_START_HANG) { //需要添加前挂起工作
            let hangTaskCodeFront = "HS" + task.code;
            let hangEdgeStart = {
                node: createTaskNode.start,
                time: frontMaxEndTime,
                critical: task.isCriticalTask
            };
            let hangEdgeEnd = {
                node: hangTaskCodeFront,
                time: taskStartDate,
                critical: task.isCriticalTask
            };
            //创建前挂起边
            // this._createEdge(hangEdgeStart, hangEdgeEnd, TASK_TYPE.HANG, task.isCriticalTask, hangTaskCodeFront, { "taskType": TASK_TYPE.HANG_TEXT, "hangTime": startHangTime });
            let option = {
                "taskType": TASK_TYPE.HANG,
                "typeText": TASK_TYPE.HANG_TEXT,
                "hangTime": startHangTime
            }
            this._createEdge(hangEdgeStart, hangEdgeEnd, TASK_TYPE.HANG, task.isCriticalTask, hangTaskCodeFront, option);
            taskEdgeStart.node = hangTaskCodeFront;
            taskEdgeStart.time = taskStartDate;
            //创建实工作
            this._createEdge(taskEdgeStart, taskEdgeEnd, TASK_TYPE.REAL, task.isCriticalTask, task.code, task, hangEdgeStart.node, 1);
            result = {
                start: hangEdgeStart.node,
                startTime: taskEdgeStart.time,
                end: taskEdgeEnd.node,
                endTime: taskEdgeEnd.node
            }
        } else {
            //创建实工作
            this._createEdge(taskEdgeStart, taskEdgeEnd, TASK_TYPE.REAL, task.isCriticalTask, task.code, task);
            result = {
                start: taskEdgeStart.node,
                startTime: taskEdgeStart.time,
                end: taskEdgeEnd.node,
                endTime: taskEdgeEnd.node
            }
        }
        return (result);
    }
    //创建后任务
    _createTaskEdge(task) {
        let libs = new Libs();
        let taskStartDate = task.start_date;
        let taskEndDate = task.end_date;
        let taskMaxEndTime = task.isLastTask ? this.projectEndTime : taskEndDate;
        let createTaskNode = this.createTaskNode(task);
        let result = {};
        //==================创建后任务================================
        let taskEdgeStart = {
            node: createTaskNode.start,
            time: taskStartDate,
            critical: task.isCriticalTask
        };
        let taskEdgeEnd = {
            node: createTaskNode.end,
            time: taskEndDate,
            critical: task.isCriticalTask
        };

        let hangTaskCode = "HE" + task.code;
        let endHangTime = libs.dateDifferenceToDays(taskEndDate, taskMaxEndTime).diff;    //记录结束挂起时间长度
        let hangEdgeStart = {
            node: hangTaskCode,
            time: taskEndDate,
            critical: task.isCriticalTask
        };
        let hangEdgeEnd = {
            node: createTaskNode.end,
            time: taskMaxEndTime,
            critical: task.isCriticalTask
        };
        if (endHangTime !== 0 && INDEPENDENT_END_HANG) {                                  //结束需要添加挂起工作
            //创建后挂起边
            // this._createEdge(hangEdgeStart, hangEdgeEnd, TASK_TYPE.HANG, task.isCriticalTask, hangTaskCode, { "taskType": TASK_TYPE.HANG_TEXT, "hangTime": endHangTime });
            let option = {
                "taskType": TASK_TYPE.HANG,
                "typeText": TASK_TYPE.HANG_TEXT,
                "hangTime": endHangTime
            }
            this._createEdge(hangEdgeStart, hangEdgeEnd, TASK_TYPE.HANG, task.isCriticalTask, hangTaskCode, option);
            taskEdgeEnd.node = hangTaskCode;
            taskEdgeEnd.time = taskEndDate;
        } else {
            let check = this.checkDuplicateNode(createTaskNode.start, createTaskNode.end, task.code);
            //节点重复，但是任务不重复
            if (check.nodeDuplicate && !check.taskDuplicate) {  //后面没有挂起工作，则添加一个挂起工作防止重复
                //创建后挂起边
                // this._createEdge(hangEdgeStart, hangEdgeEnd, TASK_TYPE.AVOID_REPETITION, task.isCriticalTask, "A" + task.code, { "taskType": TASK_TYPE.AVOID_REPETITION_TEXT });
                this._createEdge(hangEdgeStart, hangEdgeEnd, 9, task.isCriticalTask, "A" + task.code, { "taskType": TASK_TYPE.AVOID_REPETITION_TEXT });
                taskEdgeEnd.node = hangTaskCode;
                taskEdgeEnd.time = taskEndDate;
            }
        }
        //创建实工作
        this._createEdge(taskEdgeStart, taskEdgeEnd, TASK_TYPE.REAL, task.isCriticalTask, task.code, task);
        result = {
            start: taskEdgeStart.node,
            startTime: taskEdgeStart.node,
            end: taskEdgeEnd.node,
            endTime: taskEdgeEnd.node
        }
        return (result);
    }
    //创建孤立的单个任务
    _createSeparateTask(task) {
        let libs = new Libs();
        let maxStartTime = this.projectStartTime;
        let maxEndTime = this.projectEndTime;
        let taskStartDate = task.start_date;
        let taskEndDate = task.end_date;
        let createTaskNode = this.createTaskNode(task);
        let taskEdgeStart = {
            node: createTaskNode.start,
            time: taskStartDate,
            critical: task.isCriticalTask
        };
        //console.log("创建孤立任务：", task.text, createTaskNode);
        let taskEdgeEnd = {
            node: createTaskNode.end,
            time: taskEndDate,
            critical: task.isCriticalTask
        };

        let startHangTime = libs.dateDifferenceToDays(maxStartTime, taskStartDate).diff;     //记录开始挂起时间长度
        let sHangTaskCode = "HS" + task.code;
        let sHangEdgeStart = {
            node: createTaskNode.start,
            time: maxStartTime,
            critical: task.isCriticalTask
        };
        let sHangEdgeEnd = {
            node: sHangTaskCode,
            time: taskStartDate,
            critical: task.isCriticalTask
        };
        if (startHangTime !== 0 && ONLY_START_END) {                                         //需要添加前挂起工作
            //创建前挂起边
            let option = {
                "taskType": TASK_TYPE.HANG,
                "typeText": TASK_TYPE.HANG_TEXT,
                "hangTime": startHangTime
            }
            this._createEdge(
                sHangEdgeStart,
                sHangEdgeEnd,
                TASK_TYPE.HANG,
                task.isCriticalTask,
                sHangTaskCode,
                option);
            taskEdgeStart.node = sHangTaskCode;
            taskEdgeStart.time = taskStartDate;
        }
        //==================创建后任务================================
        let endHangTime = libs.dateDifferenceToDays(taskEndDate, maxEndTime).diff;    //记录结束挂起时间长度
        let eHangTaskCode = "HE" + task.code;
        let eHangEdgeStart = {
            node: eHangTaskCode,
            time: taskEndDate,
            critical: task.isCriticalTask
        };
        let eHangEdgeEnd = {
            node: createTaskNode.end,
            time: maxEndTime,
            critical: task.isCriticalTask
        };
        if (endHangTime !== 0 && ONLY_START_END) {                                  //结束需要添加挂起工作
            //创建后挂起边
            let option = {
                "taskType": TASK_TYPE.HANG,
                "typeText": TASK_TYPE.HANG_TEXT,
                "hangTime": endHangTime
            }
            this._createEdge(
                eHangEdgeStart,
                eHangEdgeEnd,
                TASK_TYPE.HANG,
                task.isCriticalTask,
                eHangTaskCode,
                option);
            taskEdgeEnd.node = eHangTaskCode;
            taskEdgeEnd.time = taskEndDate;
        } else {
            let check = this.checkDuplicateNode(createTaskNode.start, createTaskNode.end, task.code);
            //节点重复，但是任务不重复
            if (check.nodeDuplicate && !check.taskDuplicate) {  //后面没有挂起工作，则添加一个挂起工作防止重复
                //创建后挂起边
                let option = {
                    "taskType": TASK_TYPE.HANG,
                    "typeText": TASK_TYPE.HANG_TEXT,
                    "hangTime": endHangTime
                }
                this._createEdge(
                    eHangEdgeStart,
                    eHangEdgeEnd,
                    TASK_TYPE.HANG,
                    task.isCriticalTask,
                    eHangTaskCode,
                    option);
                taskEdgeEnd.node = eHangTaskCode;
                taskEdgeEnd.time = taskEndDate;
            }
        }
        //创建任务
        this._createEdge(taskEdgeStart, taskEdgeEnd, TASK_TYPE.REAL, task.isCriticalTask, task.code, task);
        //console.log(sHangEdgeStart, sHangEdgeEnd, taskEdgeStart, taskEdgeEnd, eHangEdgeStart, eHangEdgeEnd);
    }
    //创建边，增加挂起工作的节点信息参数
    _createEdge(nodeStart, nodeEnd, type, isCriticalTask, taskCode, task, hangCode, hangType) {
        let vertexLeft = this._createVertex(nodeStart.node, nodeStart.time, nodeStart.critical);
        let vertexRight = this._createVertex(nodeEnd.node, nodeEnd.time, nodeEnd.critical);
        let newEdge = new Edge(vertexLeft, vertexRight, type, isCriticalTask, taskCode, task);
        this.addEdge(newEdge, hangCode, hangType);
        if (type === TASK_TYPE.REAL) {
            task.isCreated = true;
        }
    }

    //修改任务的连接节点
    _modifyTaskNode(task, node1, node2) {
        //先判断修改后的节点是否有重复
        let hasNodeToNode = this.hasNodeToNode(node1, node2);
        if (hasNodeToNode) {
            //console.log("不允许相同节点的两条边");
        } else {
            //先删除边
            //console.log("333");
            this.removeEdge(task.code);
            //添加新的边
            this._addTaskEdge(node1, node2, task);
        }

    }

    //给任务添加边
    _addTaskEdge(node1, node2, task) {
        let libs = new Libs();
        let frontMaxEndTime = task.frontMaxEndTime ? task.frontMaxEndTime : "";
        let startDate = task.start_date
        //let endDate = task.end_date;
        let endDate = task.followMaxStartTime
        let taskCode = task.code;
        if (node1 === this.firstNode) {
            frontMaxEndTime = this.projectStartTime;
        }
        //console.log("TTT:", task.text);
        //let _isCriticalTask = task.isCriticalTask ? (task.isCriticalTask === "true" ? true : false) : false;
        let _isCriticalTask = task.isCriticalTask ? (task.isCriticalTask === true ? true : false) : false;
        //添加边时统一再处理挂起任务节点错误
        //if (libs.dateDifferenceToDays(frontMaxEndTime, startDate).diff !== 0) {
        // //console.log("--node1, node2, task", node1, node2, task);
        // //前面添加一个挂起工作
        // let hNodeCode = "H" + taskCode;
        // let vertexLeft = this._createVertex(node1, frontMaxEndTime, _isCriticalTask);
        // let vertexRight = this._createVertex(hNodeCode, startDate, _isCriticalTask);
        // // let newEdge = new Edge(vertexLeft, vertexRight, TASK_TYPE.HANG, _isCriticalTask, hNodeCode, task);
        // // this.addEdge(newEdge);
        // let newEdge = new Edge(vertexLeft, vertexRight, 13, _isCriticalTask, hNodeCode, task);
        // this.addEdge(newEdge);
        // //console.log(node1, "---H-->", hNodeCode, vertexRight);
        // node1 = hNodeCode;
        //}
        let check = this.checkDuplicateNode(node1, node2, task.code);
        if (check.nodeDuplicate) {
            if (check.taskDuplicate) {
                //console.log("不允许完全重复的添加任务");
            } else {
                //后面添加一个节点防止重复
                let vertexLeft = this._createVertex(node1, startDate, _isCriticalTask);
                let middleCode = "M" + taskCode;
                let vertexMiddle = this._createVertex(middleCode, endDate, _isCriticalTask);
                let newEdge = new Edge(vertexLeft, vertexMiddle, TASK_TYPE.REAL, _isCriticalTask, task.code, task);
                this.addEdge(newEdge);
                //console.log(node1, "----R--->", middleCode);
                let vertexRight = this._createVertex(node2, "", _isCriticalTask);
                newEdge = new Edge(vertexMiddle, vertexRight, TASK_TYPE.AVOID_REPETITION, _isCriticalTask, "A" + task.code, task);
                this.addEdge(newEdge);
                //console.log(middleCode, "---A-->", node2);
                task.isCreated = true;
                node2 = middleCode;
            }
        } else {
            //如果结束时间不等于最晚结束时间，需要添加挂起工作
            //console.log(node1, "----RR--->", node2);
            let vertexLeft = this._createVertex(node1, startDate, _isCriticalTask);
            let vertexRight = this._createVertex(node2, endDate, _isCriticalTask);
            let newEdge = new Edge(vertexLeft, vertexRight, TASK_TYPE.REAL, _isCriticalTask, task.code, task);
            this.addEdge(newEdge);
            task.isCreated = true;

        }

        return ({
            "start": node1,
            "end": node2
        });
    }
    /**
     * 给一个任务创建节点
     * @param {Json} task
     * @param {Array} follows
     * @param {Array} fronts
     */
    createTaskNode(task) {
        let ret = {};
        if (task.isFirstTask && task.isLastTask) {
            if (ONLY_START_END) {
                ret = {
                    start: "1",
                    end: this.lastNode
                };
            } else {
                ret = {
                    start: "F" + task.code,
                    end: "" + task.code + "E"
                };
            }
        } else {
            if (task.isFirstTask) {
                if (ONLY_START_END) {
                    ret = {
                        start: "1",
                        end: "" + task.code + "E"
                    };
                } else {
                    ret = {
                        start: "F" + task.code,
                        end: "" + task.code + "E"
                    };
                }
            } else if (task.isLastTask) {            //结束
                if (ONLY_START_END) {
                    ret = {
                        start: task.code + "",
                        end: this.lastNode
                    };
                } else {
                    ret = {
                        start: "" + task.code + "S",
                        end: "" + task.code + "E"
                    };
                }
            } else {
                //普通
                ret = {
                    start: "" + task.code + "S",
                    end: "" + task.code + "E"
                };
            }
        }
        return (ret);
    }
    //添任意方向的虚任务
    _addArbitraryTask(flag, task) {
        //type  1,开始连接到开始   2，结束链接到结束
        if (this.arbitraryDummyEdge[flag]) {
            for (var i = 0; i < this.arbitraryDummyEdge[flag].tasks.length; i++) {
                if (this.arbitraryDummyEdge[flag].tasks[i] == task) {
                    return;
                }
            }
            this.arbitraryDummyEdge[flag].tasks.push(task);
        } else {
            this.arbitraryDummyEdge[flag] = {
                "tasks": []
            };
            this.arbitraryDummyEdge[flag].tasks.push(task);
        }
    }
    //添加虚工序
    _addDummyTask(key, aTaskCode, dummyInfo) {
        if (this.dummyTasks[key]) {
            if (this.dummyTasks[key][aTaskCode]) {
            } else {
                this.dummyTasks[key][aTaskCode] = {};
            }
        } else {
            this.dummyTasks[key] = {
                [aTaskCode]: {}
            };
        }
        this.dummyTasks[key][aTaskCode][dummyInfo.bTaskCode] = dummyInfo;

        if (this.dummyTasks2[aTaskCode]) {
        } else {
            this.dummyTasks2[aTaskCode] = {};
        }
        this.dummyTasks2[aTaskCode][aTaskCode + "-" + dummyInfo.bTaskCode] = dummyInfo;
    }
    //添加虚边
    addDummyEdge(startNode, endNode, code, option) {
        let vertexLeft = this._createVertex(startNode, "", false);
        let vertexRight = this._createVertex(endNode, "", false);
        let critical = vertexLeft.critical && vertexRight.critical;
        //console.log('----',startNode, endNode, code);
        let newEdge = new Edge(vertexLeft, vertexRight, TASK_TYPE.DUMMY, critical, code, option);
        this.addEdge(newEdge);
    }
    getTaskInfo(taskCode) {
        taskCode = taskCode + "";
        if (taskCode == this.lastNode) {
            return ({
                "code": this.lastNode,
                "fronts": this._getFronts(this.frontLinks, taskCode),
                "frontsCode": this._getFronts(this.frontLinksCode, taskCode),
                "follows": [],
                "followsCode": [],
                "startDate": "",
                "endDate": "",
                "weight": 0,
                "text": this.lastNode,
                "lag": 0,
                "isFirst": false,
                "isLast": true,
                "isCriticalTask": false
            });
        } else if (taskCode == "FIRST") {
            return ({
                "code": "FIRST",
                "fronts": [],
                "frontsCode": [],
                "follows": this._getFronts(this.followLinks, taskCode),
                "followsCode": this._getFronts(this.followLinksCode, taskCode),
                "startDate": "",
                "endDate": "",
                "weight": 0,
                "text": "FIRST",
                "lag": 0,
                "isFirst": true,
                "isLast": false,
                "isCriticalTask": false
            });
        } else if (taskCode.indexOf("D") !== -1) {    //虚节点
            return ({
                "code": taskCode,
                "fronts": [],
                "frontsCode": [],
                "follows": [],
                "followsCode": [],
                "startDate": "",
                "endDate": "",
                "weight": 0,
                "text": taskCode,
                "lag": 0,
                "isFirst": false,
                "isLast": false,
                "isCriticalTask": false
            });
        } else {
            let tempTask = this.rawTasks[taskCode];
            if (tempTask) {
                tempTask.fronts = this._getFronts(this.frontLinks, taskCode);
                tempTask.frontsCode = this._getFronts(this.frontLinksCode, taskCode);
                tempTask.follows = this._getFronts(this.followLinks, taskCode);
                tempTask.followsCode = this._getFronts(this.followLinksCode, taskCode);
                return (tempTask);
            } else {
                return null;
            }
            // for (let i = 0; i < this.tasks.length; i++) {
            //     if (this.tasks[i].code == taskCode) {
            //         let tempTask = this.tasks[i];
            //         tempTask.fronts = this._getFronts(this.frontLinks, taskCode);
            //         tempTask.frontsCode = this._getFronts(this.frontLinksCode, taskCode);
            //         tempTask.follows = this._getFronts(this.followLinks, taskCode);
            //         tempTask.followsCode = this._getFronts(this.followLinksCode, taskCode);
            //         return (tempTask);
            //     }
            // }
        }
    }
    //获取双代号网络图的配置项
    getOption() {
        return this.option;
    }
    //输出对象
    print() {
        console.log('print:', this);
    }
    //获取一个task的紧前工作
    _getFronts(frontLinks, taskCode) {
        let _f = frontLinks.get(taskCode);
        return (_f ? _f : []);
    }
    //获取一个task的紧后工作
    _getFollows(followLinks, taskCode) {
        let _f = followLinks.get(taskCode);
        return (_f ? _f : []);
    }
    //删除工序关系
    _removeLink(startCode, endCode, taskCode) {
        //console.log("::::::::::::::startCode:", startCode, "endCode:", endCode, "taskCode", taskCode);
        let _edges = this.edges.get(startCode);
        if (_edges) {
            //console.log("_edges::::::::::::::", _edges);
            for (let i = 0; i < _edges.length; i++) {
                //console.log("_edges[i]", _edges[i]);
                if (_edges[i]) {
                    if (_edges[i].code == endCode && _edges[i].option.code == taskCode) {
                        delete _edges[i];
                    }
                }

            }
        }
        this.edges.set(startCode, _edges);
    }
    //创建一个顶点
    _createVertex(code, xtime, critical) {
        let index = this.getNumber();;
        if (xtime === this.projectStartTime) {
            critical = true;
        }
        if (code === this.lastNode) {
            xtime = this.projectEndTime;
            index = 9999;
            critical = true;
        }
        //console.log('this.firstNode', this.firstNode, index, code, xtime, critical);
        let vertex = new Vertex(index, code, xtime, critical);
        return this.getVertexByCode(vertex, code);
    }
    //获取全部结束的任务
    _getStartEndTasks() {
        let endTasks = [];
        let startTasks = [];
        let keys = this.followLinksCode.keys();
        for (let i = 0; i < keys.length; i++) {
            let _info = this.getTaskInfo(keys[i]);
            let follows = _info.follows;
            let fronts = _info.fronts;
            if (follows.length == 0) {
                endTasks.push(_info);
                _info.isLastTask = true;
            }
            if (fronts.length == 0) {
                startTasks.push(_info);
                _info.isFirstTask = true;
                if (this._isCriticalTask(_info)) {
                    this._addArbitraryTask("FIRST", _info);
                }
            }
        }
        return ({
            "endTasks": endTasks,
            "startTasks": startTasks
        })
    }
    /******************************************************************
     * @description 获取时标对应所有节点的字典信息表
     * @param {Object} this    ActivityOnArrowNetwork自定义双代号网络数据结构
     * @date    2020-02-19
     *          2020-03-18     将方法从Arrange对象迁移至本对象
     *                         修改方法名getNodesTable为init()
     *                         集成多个初始化方法_formatData,getNodesTable等
     *          2020-05-21     整合到aoan对象中
     * @return  {JSON}         返回每个时标对应所有节点的字典信息表
     * @author 杨勇
     * ****************************************************************/
    _initDate() {
        let vertexs = this.vertexs;
        //this._setNodeTime();
        this.clearNodes();
        this._identifierNodes();
        let timeList = {};
        vertexs.forEach((item) => {
            if (item) {
                let tempKey = item.xtime.slice(0, 10);
                if (timeList[tempKey]) {
                    timeList[tempKey].push(item)
                } else {
                    timeList[tempKey] = [];
                    timeList[tempKey].push(item)
                }
            }
        })
        this._formatData(timeList);
    }
    /******************************************************************
     * @description  将时标转化为，间隔时间，序号方式数据
     * @param {Json} nodeTable           时标的节点信息数据
     * @date   2020-02-28
     *         2020-03-18               将方法从Arrange对象迁移至本对象
     *                                  新增返回值nodes，保存每个节点横坐标序列
     *         2020-05-21               整合到aoan对象中
     * @return {Json}                   对应的权重值
     *      returnJson.rawData          返回原始时间对应节点数据
     *      returnJson.indexData        返回索引序号对应的节点数据，主要用于比较前后关系等
     *      returnJson.differenceData   返回基于开始时间的时差对应的节点数据，主要直接用于确定横坐标
     *      returnJson.nodes            速查节点对应的索引序号和时差的映射表
     * @author 杨勇
     * ****************************************************************/
    _formatData(nodeTable) {
        //console.log(nodeTable);
        let jsonData = {
            "rawData": nodeTable,
            "indexData": {},
            "differenceData": {},
            "nodes": {},
            "tasks": {}
        }
        let libs = new Libs();
        let count = 0;
        let baseTime = libs.dateFormat("yyyy-MM-dd", this.projectStartTime) + " 00:00:00";
        //let baseTime = this.projectStartTime;
        for (const key in nodeTable) {
            let timeNodes = nodeTable[key];
            let _dataTime = new Date(key);
            //let difference = libs.dateDifferenceToDays(baseTime, _dataTime).diff.toFixed(2);
            //jsonData.differenceData[difference] = timeNodes;
            for (let i = 0; i < timeNodes.length; i++) {
                let nodeCode = timeNodes[i].code;
                let inEdges = this.getOppositeNodeByNode(nodeCode);
                let outEdges = this.getNodeByNode(nodeCode);
                //2020-09-10 时标key取值和节点保存的时标对齐值保持一致的小数位数
                let differenceDiff = libs.dateDifferenceToDays(baseTime, timeNodes[i].xtime).diff.toFixed(4);
                //let differenceDays = libs.dateDifferenceToDays(baseTime, timeNodes[i].xtime).days;
                //console.log(nodeCode, baseTime, timeNodes[i].xtime);
                //timeNodes[i].hoursOffset = libs.dateDifferenceToDays(_dataTime, timeNodes[i].xtime).hours;
                jsonData.differenceData[differenceDiff] = libs.dateFormat("yyyy-MM-dd", timeNodes[i].xtime);
                if (jsonData.indexData[differenceDiff]) {
                    jsonData.indexData[differenceDiff].push(nodeCode);
                } else {
                    jsonData.indexData[differenceDiff] = [nodeCode];
                }

                jsonData.nodes[nodeCode] =
                {
                    "index": count,
                    "difference": differenceDiff,
                    "timeMark": key,
                    //"critical": this.tasksNode[nodeCode].critical ? this.tasksNode[nodeCode].critical : false,
                    "in": inEdges,
                    "out": outEdges
                };
            }
            count++;
        }
        //2020-05-22  获取边字典表
        let keys = this.edges.keys();
        let tasks = {};
        for (let i = 0; i < keys.length; i++) {
            let code = keys[i];
            let edgeVertexs = this.edges.get(code);
            tasks[code] = {};
            let info = {};
            //console.log("code:", code);
            for (let j = 0; j < edgeVertexs.length; j++) {
                if (edgeVertexs[j]) {
                    let isDummy = false;
                    let vEnd = edgeVertexs[j].vertexEnd;
                    let vType = edgeVertexs[j].type;
                    let vCritical = edgeVertexs[j].critical;
                    let taskCode = edgeVertexs[j].code;
                    let option = edgeVertexs[j].option;
                    let duration = 0;

                    if (vType === TASK_TYPE.DUMMY) {
                        isDummy = true;
                        //清除虚工作的option
                        edgeVertexs[j].option = null;
                        option = null;
                    }
                    //console.log(code, "---->", vEnd, "  :", isDummy, edgeVertexs[j]);
                    info[vEnd] = {
                        "startCode": code,
                        "endCode": vEnd,
                        "type": vType,
                        "taskCode": taskCode,
                        "duration": edgeVertexs[j].option ? edgeVertexs[j].option.duration : 0,
                        "isDummy": isDummy,
                        "isCritical": vCritical,
                        "option": option
                    };
                    //边表Map结构
                    let __key = code + "-" + vEnd;
                    this.edgesMap[__key] = {
                        start: code,
                        end: vEnd,
                        isDummy: isDummy,
                        isCritical: vCritical,
                        duration: duration,
                        taskType: vType,
                        link: null,
                        option: option
                    };
                    //初始化边布局数据
                    // if (this.coordinates.layoutEdge[code]) {
                    //     if (this.coordinates.layoutEdge[code][vEnd]) {

                    //     } else {
                    //         let temp = this.coordinates.layoutEdge[code];
                    //         temp[vEnd] = {
                    //             isLayout: false,
                    //             start: "",
                    //             end: ""
                    //         };
                    //         this.coordinates.layoutEdge[code] = temp;
                    //     }
                    // } else {
                    //     this.coordinates.layoutEdge[code] = {
                    //         [vEnd]:
                    //         {
                    //             isLayout: false,
                    //             start: "",
                    //             end: ""
                    //         }
                    //     };
                    // }
                }
            }
            tasks[code] = info;
        }
        jsonData.tasks = tasks;
        this.nodesData = jsonData;
        new Joke();
        //return (jsonData);
    }
    getFronts() {
        let frontNodes = new Map()
        for (const front in this.edges.items) {
            for (const back of this.edges.items[front]) {
                if (back === undefined) {
                    continue;
                }
                let tempString = back.vertexEnd.toString()
                if (!frontNodes.has(tempString)) {
                    frontNodes.set(tempString, []);
                }
                frontNodes.get(tempString).push(front)
            }
        }
        return (frontNodes);
    }
    //布局前准备
    _layoutPlan() {
        //先找到关键路径
        let throughPaths = this.getThroughPaths();
        let firstCriticalPath = [];

        //----------无--------情--------的--------分------割------线----------

        //===========================正方化路径 Begin===========================
        //布局关键路径
        //先布局第一条关键路径
        if (this.criticalPaths.length > 0) {
            firstCriticalPath = this.criticalPaths[0].path;
            this._pathToBlock(firstCriticalPath, true, true);
        } else {
            //console.log("Error：没有关键路径................");
        }
        //布局其它路径
        if (firstCriticalPath.length === 0) {
            //console.log("Error：数据有误，没有关键路径，无法布局................");
        } else {
            let otherPaths = this.findedUnLayoutPaths([], firstCriticalPath);;
            //console.log("@@@@@其它路径：", otherPaths);
            for (let i = 0; i < otherPaths.length; i++) {
                let otherPath = otherPaths[i];
                this.layoutOtherPath(otherPath);
                //this.layerSwitch = this.layerSwitch * -1;  //控制方向
            }
        }
        //其它未布局的边
        let unLayoutEdge = this.findedUnLayoutEdge();
        //console.log("@@@@@其它未布局的边：", unLayoutEdge);
        for (let i = 0; i < unLayoutEdge.length; i++) {
            //console.log("unLayoutEdge[i].path", unLayoutEdge[i].path);
            let sectionPaths = this.sectionPath(unLayoutEdge[i].path);
            //console.log("sectionPaths", sectionPaths);
            if (sectionPaths.length > 0) {
                for (let k = 0; k < sectionPaths.length; k++) {
                    let sectionPath = sectionPaths[k];
                    //console.log("sectionPath", sectionPath);
                    this._pathToBlock(sectionPath, false, false);
                }
            }
        }
        //测试数据完整性（节点是否全部布局）
        this.testIsLayoutAllNode();
        //创建边的连线

        //console.log("pathToBlock", JSON.stringify(this.pathToBlock));
        //console.log("pathToBlock", this.edgesMap);
        //===========================正方化路径 End===========================

        //----------无--------情--------的--------分------割------线----------

        //获取同时标的数据
        this._getSameTimeScale();
    }
    /**
    * 排布节点
    * @date 2020-05-28
    * @author 杨勇
    */
    layoutPlan(callback) {
        //===========================布局开始 ===========================
        // let factor = this.layoutFactor;
        // let viz = new Viz({ workerURL: './js/libs/full.render.js' });
        // let linkPlan = new LinkPlan(this, viz,factor);
        // linkPlan.createPlan(factor, (nodes, edges, option) => {
        //     callback(nodes, edges, option)
        // })
        let factor = this.layoutFactor;
        let viz = new Viz({ workerURL: './js/libs/full.render.js' });
        let coordinate = new Coordinate(this, viz, factor);
        coordinate.createPlan(factor, (nodes, edges, option) => {
            callback(nodes, edges, option)
        })
        //===========================布局开始 ============================
    }
    //2020-07-01压缩层
    _compressRank() {
        //TODO
    }

    /**
    * 根据时标表，查找同时标超过三个节点的情况
    * @return {Array}
    * @date 2020-06-09
    *       2020-06-11         将节点转为路径，并找到需要分支和独立展开的路径
    * @author 杨勇
    */
    _getSameTimeScale() {
        let indexData = this.nodesData.indexData;
        let find = [];
        for (const key in indexData) {
            let timeNodes = indexData[key];
            if (timeNodes.length > 2) {
                let nodes = [];
                for (const node in timeNodes) {
                    nodes.push(timeNodes[node].code);
                }
                find.push(nodes);
            }
        }
        //2020-06-11
        //处理同时标节点
        let forking = {};
        let separate = [];
        let collection = new Collection();
        if (find.length > 0) {
            for (let i = 0; i < find.length; i++) {
                let nodes = find[i];                      //节点列表
                //this.findPathOrEdge(nodes);
                let temp = [];
                //找到节点的全部路径
                if (nodes.length > 2) {
                    for (let x = 0; x < nodes.length; x++) {
                        let _source = nodes[x];
                        for (let y = 0; y < nodes.length; y++) {
                            let _target = nodes[y];
                            if (_source !== _target) {
                                let paths = this.getOnePath(_source, _target);
                                if (paths.length > 0) {
                                    for (let z = 0; z < paths.length; z++) {
                                        if (paths[z].path.length > 1) {
                                            temp.push(paths[z].path);
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
                //如果路径中出现不包括在找到的节点中的情况，则剔除
                if (temp.length > 0) {
                    for (let i = 0; i < temp.length; i++) {
                        let path = temp[i];
                        let unFinded = false;
                        if (path.length > 0) {
                            for (let j = 0; j < path.length; j++) {
                                let node = path[j];
                                //console.log(nodes, node, nodes.indexOf(node) === -1);
                                if (nodes.indexOf(node) === -1) {
                                    //console.log("------------------");
                                    unFinded = true;
                                    break;
                                };
                            }
                        }
                        if (unFinded) {
                            //_temp.splice(i, 0);
                            delete temp[i];
                        }
                    }
                }
                //console.log("_temp::::", temp);
                temp = collection.clearNull(temp);
                //对路径按长度进行排序
                temp = temp.sort((a, b) => {
                    return a.length - b.length;
                })
                console.log("temp::::", temp);
                //克隆一份数据
                let _temp = JSON.parse(JSON.stringify(temp));
                //剔除重复的子路径
                // if (temp.length > 0) {
                //     for (let i = 0; i < temp.length; i++) {
                //         for (let j = 0; j < temp.length; j++) {
                //             console.log(temp[i], temp[j]);
                //             let increment = collection.intersect(temp[i], temp[j]);
                //             if (collection.isEqual(increment, temp[i]) && !collection.isEqual(increment, temp[j])) {
                //                 //console.log(increment, temp[i], temp[j]);
                //                 //_temp.splice(i, 1);
                //                 delete temp[i];
                //             }
                //         }
                //     }
                // }
                var obj = {};
                for (let i = 0; i < _temp.length; i++) {
                    // 判断当前项是否遍历过，是则删除，否存入obj以作对照
                    if (obj.hasOwnProperty(_temp[i])) {
                        _temp.splice(i, 1)
                        i++;
                    }
                    obj[_temp[i]] = i;
                }

                temp = collection.clearNull(_temp);
                //console.log("_temp::::", temp);
                //对路径进行分类
                if (temp.length > 0) {
                    for (let i = 0; i < temp.length; i++) {
                        let isSeparate = true;
                        for (let j = 0; j < temp.length; j++) {
                            if (!collection.isEqual(temp[i], temp[j])) {
                                let increment = collection.intersect(temp[i], temp[j]);
                                if (increment.length > 0) {     //有交集，说明从这个交集节点有多条路径
                                    //console.log(increment, temp[i], temp[j]);
                                    //console.log(increment);
                                    let node = increment[0];
                                    isSeparate = false;
                                    if (forking[node]) {
                                        let temPath = forking[node];
                                        let isExist = false;
                                        if (temPath.length > 0) {
                                            for (let t = 0; t < temPath.length; t++) {
                                                if (collection.isEqual(temPath[t], temp[i])) {
                                                    isExist = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if (!isExist) {
                                            forking[node].push(temp[i]);
                                        }
                                        isExist = false;
                                        if (temPath.length > 0) {
                                            for (let t = 0; t < temPath.length; t++) {
                                                if (collection.isEqual(temPath[t], temp[j])) {
                                                    isExist = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if (!isExist) {
                                            forking[node].push(temp[j]);
                                        }
                                    } else {
                                        forking[node] = [
                                            temp[i],
                                            temp[j]
                                        ]
                                    }
                                }
                            }
                        }
                        //未找到有交集的节点，说明是独立路径
                        if (isSeparate) {
                            separate.push(temp[i]);
                        }

                    }
                }
                //console.log("forking::::", forking);
                //console.log("separate::::", separate);
                //test
                //console.log("test:");
                //nodes = ["5", "4", "7", "8"];
                //找到这些路径，优先确定同坐标的连线情況，避免穿点情况
                //this.findPathOrEdge(nodes);
                //todo  处理布局路径
            }
        }
        this.sameTimeScale = {
            "forking": forking,
            "separate": separate
        };
    }

    //自测，节点是否已经全部处理
    testIsLayoutAllNode() {
        let allNode = this.edges.keys();
        let find = 0;
        for (let t = 0; t < allNode.length; t++) {
            let node = allNode[t];
            if (((_node) => {
                let layoutNodes = this.pathToBlock;
                for (let i = 0; i < layoutNodes.length; i++) {
                    let path = layoutNodes[i].path;
                    //console.log(path);
                    for (let j = 0; j < path.length; j++) {
                        let pathNode = path[j];
                        if (pathNode === _node) {
                            return (true);
                        }
                    }
                }
                return (false);
            })(node)) {
                find++;
            }
        }
        //console.log("------------------", find, allNode.length, "------------------");
        if (find === allNode.length) {
            //console.log("OK");
            return (true);
        } else {
            return (false)
        }
    }


    //一个路径当遇到有布局过的节点,则分段处理
    sectionPath(otherPath) {
        let _sectionPath = [];
        //console.log("_otherPath", otherPath);
        //找到已经布局过的节点
        let layoutNodesIndex = [];
        let layoutNodes = [];
        for (let k = 0; k < otherPath.length; k++) {
            let _nodeIsLayout = this.nodeIsLayout(otherPath[k]);
            if (_nodeIsLayout) {
                layoutNodesIndex.push(k);
                //layoutNodes.push(otherPath[k]);
            }
        }

        // //console.log("layoutNodesIndex", layoutNodesIndex);
        // //console.log("layoutNodes", layoutNodes);
        layoutNodesIndex.forEach((nodesIndex, index, array) => {
            //添加待优化边
            let prevIndex = nodesIndex - 1;
            let nextIndex = nodesIndex + 1;
            if (otherPath[prevIndex]) {
                //console.log(otherPath[prevIndex], "-t-->", otherPath[nodesIndex]);
                this.addAwaitOptimizeEdge(otherPath[prevIndex], otherPath[nodesIndex]);
            }
            if (otherPath[nextIndex]) {
                //console.log(otherPath[nodesIndex], "--w->", otherPath[nextIndex]);
                this.addAwaitOptimizeEdge(otherPath[nodesIndex], otherPath[nextIndex]);
            }
            //计算分段
            if (layoutNodesIndex[index + 1]) {
                let flag = nodesIndex + 1;
                let flagNext = layoutNodesIndex[index + 1];
                let section = otherPath.slice(flag, flagNext);
                if (section.length > 0) {
                    _sectionPath.push(section);
                }
                //console.log(otherPath[nodesIndex], flag, flagNext, "section---------", section);
            }
        })
        return (_sectionPath);
    }
    /**
     * 获取任务是否关键路径上的任务
     * @param {String||Object} task
     */
    _isCriticalTask(task) {
        if (typeof (task) === "object") {
            return (task.isCriticalTask ?
                (task.isCriticalTask === true ? true : false) :
                false);
        } else {
            let _task = this.getTaskInfo(task);
            return (_task.isCriticalTask ?
                (_task.isCriticalTask === true ? true : false) :
                false);
        }
    }

}