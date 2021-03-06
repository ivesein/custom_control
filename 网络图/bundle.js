//字典
class Dictionary {
  constructor() {
    this.items = {};
  }

  set(key, value) {
    // 向字典中添加或修改元素
    this.items[key] = value;
  }
  setArrValue(key, i, prop, value) {
    // 向字典中添加或修改元素
    this.items[key][i][prop] = value;
  }
  deleteArrValue(key, i) {
    // 删除指定元素数组中的一个值
    this.items[key].splice(i, 1);
  }
  pushValueToArr(key, value, judgeKey, judgeValue) {
    // 向字典中添加或修改元素
    let has = false;
    for (let i = 0; i < this.items[key].length; i++) {
      //console.log("value:", value, "=================this.items[key][i]", this.items[key][i]);
      if (this.items[key][i][judgeKey] == judgeValue) {
        has = true;
        break;
      }
    }
    if (!has) {
      this.items[key].push(value);
    }
  }
  add(key, value) {
    // 字典中不存在则添加元素
    if (!this.has(key)) {
      this.items[key] = value;
    }
  }

  get(key) {
    // 通过键值查找字典中的值
    return this.items[key]
      ? this.items[key] === null
        ? []
        : this.items[key]
      : [];
  }

  delete(key) {
    // 通过使用键值来从字典中删除对应的元素
    if (this.has(key)) {
      delete this.items[key];
      return true;
    }
    return false;
  }
  has(key) {
    // 判断给定的键值是否存在于字典中
    return this.items.hasOwnProperty(key);
  }

  clear() {
    // 清空字典内容
    this.items = {};
  }

  size() {
    // 返回字典中所有元素的数量
    return Object.keys(this.items).length;
  }

  keys() {
    // 返回字典中所有的键值
    return Object.keys(this.items);
  }

  values() {
    // 返回字典中所有的值
    return Object.values(this.items);
  }

  getItems() {
    // 返回字典中的所有元素
    return this.items;
  }
}

/**
 * author:杨勇
 * date  ：2019-09-19
 * 说明   ：为js添加事件机制
 */

//===============================事件机制=========================
class Evee {
  constructor() {
    this.gid = 0;
    this.receivers = [];
  }

  /**
   * Subscribe to an event.
   * @param {object} name - The event name
   * @param {function} action - The event action
   */
  on(name, action) {
    if (name.constructor !== String) {
      throw new TypeError("name has to be of type string.");
    }
    if (action.constructor !== Function) {
      throw new TypeError("action has to be of type function.");
    }
    var event = {
      name: name,
      action: action,
      id: this.gid++,
    };
    for (var i = 0; i < this.receivers.length; i++) {
      var items = this.receivers[i];
      if (items.length > 0 && items[0].name === name) {
        items.push(event);
        return event;
      }
    }
    this.receivers.push([event]);
    return event;
  }

  /**
   * Subscribe to an event and fire only once.
   * @param {object} name - The event name
   * @param {function} action - The event action
   */
  once(name, action) {
    if (name.constructor !== String) {
      throw new TypeError("name has to be of type string.");
    }
    if (action.constructor !== Function) {
      throw new TypeError("action has to be of type function.");
    }
    var event = {
      name: name,
      id: this.gid++,
      action: (e) => {
        this.drop(e.sender);
        return action(e);
      },
    };
    for (var i = 0; i < this.receivers.length; i++) {
      var items = this.receivers[i];
      if (items.length > 0 && items[0].name === name) {
        items.push(event);
        return event;
      }
    }
    this.receivers.push([event]);
    return event;
  }

  /**
   * Drop an event.
   * @param {Object} event - The event
   * @returns {boolean} - Whether the event has been dropped
   */
  drop(event) {
    if (event === undefined || event.name === undefined) {
      throw new TypeError("attempt to drop undefined event.");
    }
    for (let i = 0; i < this.receivers.length; i++) {
      var items = this.receivers[i];
      if (items.length === 0 || items[0].name !== event.name) {
        continue;
      }
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === event.id) {
          items.splice(i, 1);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Emit an event.
   * @param {string|array|object} target - The target(s)
   * @param {object=} data - The event data
   */
  emit(target, data) {
    if (target === undefined && data === undefined) {
      throw new Error("emit called without arguments.");
    }
    if (this.receivers.length === 0) {
      return;
    }
    for (let i = 0; i < (target || []).length; i++) {
      var o = target[i];
      if (o.constructor === Object) {
        for (let i = 0; i < this.receivers.length; i++) {
          var items = this.receivers[i];
          if (items.length > 0 && items[0].name === target) {
            for (let i = 0; i < items.length; i++) {
              var item = items[i];
              item.action({
                sender: item,
                data: data,
              });
            }
            return;
          }
          if (items.length > 0 && items[0].name === o.name) {
            for (let i = 0; i < items.length; i++) {
              var item = items[i];
              item.action({
                sender: item,
                data: o.data,
              });
            }
          }
        }
      } else if (o.constructor === String) {
        for (let i = 0; i < this.receivers.length; i++) {
          var items = this.receivers[i];
          if (items.length > 0 && items[0].name === target) {
            for (let i = 0; i < items.length; i++) {
              var item = items[i];
              item.action({
                sender: item,
                data: data,
              });
            }
            return;
          }
          if (items.length > 0 && items[0].name === o) {
            for (let i = 0; i < items.length; i++) {
              var item = items[i];
              item.action({
                sender: item,
                data: data,
              });
            }
          }
        }
      } else {
        throw new TypeError("target has to be of type string|object|array.");
      }
    }
  }

  /**
   * Signal an event.
   * @param {array} args - The names of the events
   */
  signal(...args) {
    if (args.length === 0) {
      throw new Error("signal called without arguments.");
    }
    if (this.receivers.length === 0) {
      return;
    }
    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      for (let i = 0; i < this.receivers.length; i++) {
        let items = this.receivers[i];
        if (items.length > 0 && items[0].name === arg) {
          for (let i = 0; i < items.length; i++) {
            let item = items[i];
            item.action({
              sender: item,
            });
          }
        }
      }
    }
  }

  /**
   * Clear all receivers.
   */
  clear() {
    this.receivers = [];
  }
}

/*
 * @Author: your name
 * @Date: 2019-12-30 16:13:14
 * @LastEditTime: 2019-12-30 17:12:07
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \netpic\js\libs\libs.js
 */
//常用方法
class Libs {
  constructor() {}

  /**
     * 计算时间差的天数
     * 2020-08-06 同时返回小时部分和带小数的天数差
     * @param {String} _startDate 
     * @param {String} _endDate 
     * @returns {String} 时间差
     * {
            diff: 2.33,
            days: 2,
            hours: 8
        }
     */
  dateDifferenceToDays(_startDate, _endDate) {
    let startDate = new Date(_startDate);
    let endDate = new Date(_endDate);
    let timeDifference = endDate.getTime() - startDate.getTime(); //时间差的毫秒数
    let difference = Math.abs(timeDifference);
    let days = Math.floor(difference / (24 * 3600 * 1000));
    let hours = Math.floor(
      (difference - days * 24 * 3600 * 1000) / (3600 * 1000)
    );
    return {
      diff: difference / (24 * 3600 * 1000),
      days: days,
      hours: hours,
    };
  }
  /**
   * 给时间字符串增加天数
   * @param {String} timeString
   * @param {Number} days
   * @returns {String} 增加天数后的时间字符串
   */
  timeAddDays(timeString, days) {
    let d = new Date(timeString);
    return this.dateFormat(
      "yyyy-MM-dd hh:mm:ss",
      d.setDate(d.getDate() + days)
    );
  }
  timeToNumber(timeString) {
    let _time = new Date(timeString);
    return _time.getTime();
  }
  dateFormat(fmt, date) {
    date = new Date(date);
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  }
}

const TASK_TYPE = {
  REAL: 1, //实工作
  DUMMY: 2, //虚工作
  HANG: 3, //挂起工作
};
const ENFORCE = true; //出错也强制执行
class Graph extends Evee {
  constructor() {
    super();
    this.isDirected = true; //是否有向图
    this.numberCounter = 1; //初始化顶点编号
    this.vertexs = []; // 用来存放图中的顶点
    this.edges = new Dictionary(); // 用来存放图中的边
    this.oppositeEdges = new Dictionary(); // 用来存放图相反方向边信息
    this.tasksNode = {};
    this.topSortPath = [];
    this.enforce = ENFORCE;
    console.log(this);
  }

  //获取图顶点的唯一编号
  getNumber() {
    return this.numberCounter++;
  }
  createFirstTaskNode(task, follows, fronts) {
    let ret = {
      start: task.code,
      end: Number(task.code) + 1 + "",
      follows: follows,
      fronts: fronts,
      info: info,
    };
    return ret;
  }
  //获取任务的节点信息
  getTaskNode(taskCode) {
    //console.log("this.tasksNode", this.tasksNode);
    let _node = null;
    if (this.tasksNode[taskCode]) {
      _node = this.tasksNode[taskCode];
    }
    //console.log("taskCodetaskCodetaskCode", taskCode, _node);
    return _node;
  }
  addTaskNode(taskCode, nodeInfo) {
    this.tasksNode[taskCode] = nodeInfo;
  }
  // 向图中添加一个新顶点
  addVertexEnd(v) {
    //console.log("addVertexEnd:", v);
    if (v) {
      let isExist = this.codeIsExist(v.code).isExist;
      //console.log("isExist:", isExist);
      let _vertexs = JSON.parse(JSON.stringify(this.vertexs));
      //console.log("_vertexs", _vertexs);
      if (!isExist) {
        this.vertexs.push(v);
        this.edges.set(v.code, []);
        this.oppositeEdges.set(v.code, []);
      }
      //console.log("this.vertexs", JSON.parse(JSON.stringify(this.vertexs)));
    }
  }
  addVertexStart(v) {
    //console.log("addVertexStart:", v);
    if (v) {
      let isExist = this.codeIsExist(v.code);
      if (!isExist.isExist) {
        this.vertexs.push(v);
        this.edges.set(v.code, []);
        this.oppositeEdges.set(v.code, []);
      } else {
        if (this.edges.get(v.code));
        else {
          this.edges.set(v.code, []);
          this.oppositeEdges.set(v.code, []);
        }
      }
    }
  }
  // 删除顶点
  removeVertex(vCode) {
    for (let i = 0; i < this.vertexs.length; i++) {
      if (this.vertexs[i].code == vCode) this.vertexs.splice(i, 1);
    }
  }
  //仅删除节点和相关的边（为了性能，未删除指向该节点的边）
  onlyDeleteNode(nodeCode) {
    this.edges.delete(nodeCode);
  }
  //向后合并节点
  mergeNodeBackward(frontNode, followNode, deleteDummyCode) {
    //先找到指向前节点的节点
    let edges = this.getOppositeEdgesByNode(frontNode).edges;
    //console.log("edges:", edges);
    let edgesCount = edges.length;
    let change = 0;
    for (let i = 0; i < edgesCount; i++) {
      let tempEdge = edges[i].edge;
      let startCode = edges[i].startCode;
      let ii = edges[i].i;
      //tempEdges.push(tempEdge);
      let _hasNodeToNode = this._hasNodeToNode(startCode, followNode); //先判断修改后的节点是否有重复
      if (_hasNodeToNode) {
        console.log(
          "不允许相同节点的两条边",
          startCode,
          followNode,
          deleteDummyCode
        );
      } else {
        //console.log("startCode:", startCode, "-->", followNode);
        this.edges.setArrValue(startCode, ii, "vertexEnd", followNode); //修改为指向后节点
        let nodeInfo = {
          start: startCode,
          end: followNode,
          option: tempEdge.option,
        };
        this.tasksNode[tempEdge.code] = nodeInfo;
        change++;
      }
    }
    //console.log("edgesCount:", edgesCount, "change:", change);
    if (change >= edgesCount) {
      this.edges.delete(frontNode);
      this.removeEdge(deleteDummyCode); //移除虚工作的边
    }
    //前节点指向其它节点的边无需处理
  }
  //向前合并节点
  mergeNodeForward(frontNode, followNode, deleteDummyCode) {
    let followEdges = this.getEdges(followNode);
    let frontEdges = this.getEdges(frontNode);
    //console.log(frontNode, "-->", followNode, "frontEdges:", frontEdges);
    //console.log(frontNode, "-->", followNode, "followEdges:", followEdges);
    for (let i = 0; i < followEdges.length; i++) {
      let tempEdge = followEdges[i];
      this.edges.pushValueToArr(
        frontNode,
        tempEdge,
        "vertexEnd",
        tempEdge.vertexEnd
      );
      let nodeInfo = {
        start: frontNode,
        end: tempEdge.vertexEnd,
        option: tempEdge.option,
      };
      this.tasksNode[tempEdge.code] = nodeInfo;
    }
    this.edges.delete(followNode);
    this.removeEdge(deleteDummyCode); //移除虚工作的边
    //将指向原来节点的节点，指向新的节点
    let edges = this.getOppositeEdgesByNode(followNode).edges;
    for (let i = 0; i < edges.length; i++) {
      let tempEdge = edges[i].edge;
      let startCode = edges[i].startCode;
      let ii = edges[i].i;
      //tempEdges.push(tempEdge);
      this.edges.deleteArrValue(startCode, ii); //先删除对应的边
      let _hasNodeToNode = this._hasNodeToNode(startCode, frontNode); //先判断修改后的节点是否有重复
      if (_hasNodeToNode) {
        console.log("不允许相同节点的两条边", startCode, frontNode);
      } else {
        if (frontNode != startCode) {
          this.edges.setArrValue(startCode, ii, "vertexEnd", frontNode);
          let nodeInfo = {
            start: startCode,
            end: frontNode,
            option: tempEdge.option,
          };
          this.tasksNode[tempEdge.code] = nodeInfo;
        }
      }
    }
  }
  //为了性能，最后一次性清理多余的节点
  clearNodes() {
    let _vertexs = JSON.parse(JSON.stringify(this.vertexs));

    let _del = {};
    for (let i = 0; i < _vertexs.length; i++) {
      let code = _vertexs[i].code;
      //入度
      let _in = this.getOppositeEdgesByNode(code).edges;
      //出度
      let _out = this.getEdges(code);
      if (_in.length === 0 && _out.length === 0) {
        _del[code] = true; //记录删除
      }
    }

    let keys = Object.keys(_del);
    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      this.edges.delete(code);
      //删除节点
      for (let j = 0; j < this.vertexs.length; j++) {
        if (this.vertexs[j] && this.vertexs[j].code === code) {
          delete this.vertexs[j];
        }
      }
    }

    this.vertexs = this.vertexs.filter(function (val) {
      return val;
    });
  }
  //删除边
  removeEdge(code) {
    let keys = this.edges.keys();
    let startCode = 0;
    let endCode = 0;
    for (let t = 0; t < keys.length; t++) {
      let edges = this.edges.get(keys[t]);
      if (edges) {
        if (edges.length > 0) {
          for (let i = 0; i < edges.length; i++) {
            if (edges[i]) {
              if (edges[i].code == code) {
                startCode = keys[t];
                endCode = edges[i].vertexEnd;
                //edges.splice(i, 1);
                //this.edges.set(keys[t], edges);
                this.edges.items[keys[t]].splice(i, 1);
              }
            }
          }
        }
      }
    }

    if (startCode !== 0 && this.edges.get(startCode)) {
      if (this.edges.get(startCode).length == 0) {
        this.edges.delete(startCode); //删除边
        this.removeVertex(startCode); //删除顶点
      }
    }
    if (endCode !== 0 && this.edges.get(endCode)) {
      if (this.edges.get(endCode).length == 0) {
        //console.log("删除2",endCode);
        this.edges.delete(endCode); //删除边
        this.removeVertex(endCode); //删除顶点
      }
    }
    //console.log("#########",code);

    delete this.tasksNode[code];
  }
  // 通过顶点编号获取一个顶点
  getVertex(vertexNumber) {
    // //console.log("VS:", this.vertexs);
    for (let i = 0; i < this.vertexs.length; i++) {
      if (this.vertexs[i].number == vertexNumber) return this.vertexs[i];
    }
  }
  //是指开始节点
  setFirstNode(node) {
    for (let i = 0; i < this.vertexs.length; i++) {
      if (this.vertexs[i].code == node) this.vertexs[i].isFirst = true;
    }
  }
  //是否存在边
  hasEdge(code) {
    let keys = this.edges.keys();
    let has = {
      has: false,
      start: "0",
      end: "0",
    };
    for (let t = 0; t < keys.length; t++) {
      let edges = this.edges.get(keys[t]);
      if (edges) {
        if (edges.length > 0) {
          for (let i = 0; i < edges.length; i++) {
            if (edges[i]) {
              //if (edges[i].type == 2) {   //只判断虚工作边
              if (edges[i].code == code) {
                has = {
                  has: true,
                  start: keys[t],
                  end: edges[i],
                };
                break;
              }
              //}
            }
          }
        }
      }
    }
    // //console.log(start, end, code, has);
    return has;
  }
  //获取节点的出度代码信息
  getNodeByNode(node) {
    let nodes = [];
    let edgeVertexs = this.edges.get(node);
    let dummyNodes = [];
    let realNodes = [];
    let hangNodes = [];
    if (edgeVertexs) {
      for (let j = 0; j < edgeVertexs.length; j++) {
        if (edgeVertexs[j]) {
          let vType = edgeVertexs[j].type;
          let vEnd = edgeVertexs[j].vertexEnd;
          if (vEnd === node) {
            if (vType == TASK_TYPE.REAL) {
              realNodes.push(code);
            } else if (vType == TASK_TYPE.DUMMY) {
              dummyNodes.push(code);
            } else if (vType == TASK_TYPE.HANG) {
              hangNodes.push(code);
            }
            nodes.push(code);
          }
          nodes.push(vEnd);
        }
      }
    }
    return {
      dummyNodes: dummyNodes,
      realNodes: realNodes,
      hangNodes: hangNodes,
      nodes: nodes,
    };
  }
  //获取节点的入度代码信息
  getOppositeEdgesByNode(node) {
    let edges = [];
    let dummyEdges = [];
    let realEdges = [];
    let hangEdges = [];
    let keys = this.edges.keys();
    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      let edgeVertexs = this.edges.get(code);
      for (let j = 0; j < edgeVertexs.length; j++) {
        if (edgeVertexs[j]) {
          let vType = edgeVertexs[j].type;
          let vEnd = edgeVertexs[j].vertexEnd;
          if (vEnd === node) {
            //console.log("node:", node, "vEnd:", vEnd, edgeVertexs[j]);
            if (vType == TASK_TYPE.REAL) {
              realEdges.push({ startCode: code, i: j, edge: edgeVertexs[j] });
            } else if (vType == TASK_TYPE.DUMMY) {
              dummyEdges.push({ startCode: code, i: j, edge: edgeVertexs[j] });
            } else if (vType == TASK_TYPE.HANG) {
              hangEdges.push({ startCode: code, i: j, edge: edgeVertexs[j] });
            }
            edges.push({ startCode: code, i: j, edge: edgeVertexs[j] });
          }
        }
      }
    }
    return {
      dummyEdges: dummyEdges,
      realEdges: realEdges,
      hangEdges: hangEdges,
      edges: edges,
    };
  }
  //获取节点的入度代码信息
  getOppositeNodeByNode(node) {
    // let nodes = [];
    // let edgeVertexs = this.oppositeEdges.get(node);
    // let dummyNodes = [];
    // let realNodes = [];
    // if (edgeVertexs) {
    //     for (let j = 0; j < edgeVertexs.length; j++) {
    //         if (edgeVertexs[j]) {
    //             let vType = edgeVertexs[j].type;
    //             let vertexStart = edgeVertexs[j].vertexStart;
    //             if (vType == 2) {
    //                 dummyNodes.push(vertexStart);
    //             } else if (vType == 1) {
    //                 realNodes.push(vertexStart);
    //             }
    //             nodes.push(vertexStart);
    //         }
    //     }
    // }
    // return ({
    //     "dummyNodes": dummyNodes,
    //     "realNodes": realNodes,
    //     "nodes": nodes
    // });

    let nodes = [];
    let dummyNodes = [];
    let realNodes = [];
    let hangNodes = [];
    let keys = this.edges.keys();
    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      let edgeVertexs = this.edges.get(code);
      for (let j = 0; j < edgeVertexs.length; j++) {
        if (edgeVertexs[j]) {
          let vType = edgeVertexs[j].type;
          let vEnd = edgeVertexs[j].vertexEnd;
          //console.log("node:", node, "vEnd:", vEnd);

          if (vEnd === node) {
            if (vType == TASK_TYPE.REAL) {
              realNodes.push(code);
            } else if (vType == TASK_TYPE.DUMMY) {
              dummyNodes.push(code);
            } else if (vType == TASK_TYPE.HANG) {
              hangNodes.push(code);
            }
            nodes.push(code);
          }
        }
      }
    }

    return {
      dummyNodes: dummyNodes,
      realNodes: realNodes,
      hangNodes: hangNodes,
      nodes: nodes,
    };
  }

  // 2020-08-07  移除开始和结束任务不在关键路径时的默认虚工作
  addEdge(edge) {
    let _hasNodeToNode = this._hasNodeToNode(
      edge.vertexEnd.code,
      edge.vertexStart.code
    );
    if (_hasNodeToNode) {
      console.log("不允许相同节点的两条边");
    } else {
      // 如果图中没有顶点，先添加顶点
      this.addVertexStart(edge.vertexStart);
      this.addVertexEnd(edge.vertexEnd);
      // 在开始节点中添加指向结束节点的边（有向单边）
      if (
        !this.hasEdge(edge.code).has &&
        edge.vertexEnd.code != edge.vertexStart.code
      ) {
        //console.log("1111", edge.option);
        this.edges.get(edge.vertexStart.code).push({
          vertexEnd: edge.vertexEnd.code,
          code: edge.code,
          type: edge.type,
          critical: edge.critical,
          option: edge.option,
        });
        this.oppositeEdges.get(edge.vertexEnd.code).push({
          vertexStart: edge.vertexStart.code,
          code: edge.code,
          type: edge.type,
          critical: edge.critical,
          option: edge.option,
        });
        this.addTaskNode(edge.code, {
          start: edge.vertexStart.code,
          end: edge.vertexEnd.code,
          startTime: edge.vertexStart.xtime,
          endTime: edge.vertexEnd.xtime,
          critical: edge.critical,
          option: edge.option,
        });
      }
      //如果是无向图则同时添加结束节点指向开始节点的边
      // if (this.isDirected !== true) {
      //     if (!(this.hasEdge(edge.code).has) && edge.vertexEnd.code != edge.vertexStart.code) {
      //         this.edges.get(edge.vertexEnd.code)
      //             .push({ "vertexEnd": edge.vertexStart.code, "code": edge.code, "type": edge.type, "critical": edge.critical, "option": edge.option });
      //         this.oppositeEdges.get(edge.vertexStart.code)
      //             .push({ "vertexEnd": edge.vertexEnd.code, "code": edge.code, "type": edge.type });
      //         this.addTaskNode(edge.code, { start: edge.vertexEnd.code, end: edge.vertexEnd.code, "critical": edge.critical, "option": edge.option });
      //     }
      // }
    }
    return {};
  }
  // 获取图的vertexs
  getvertexs() {
    return this.vertexs;
  }
  // 设置图是否为有向图
  setDirected(_isDirected) {
    this.isDirected = _isDirected;
  }
  // 获取图中的边集合
  getEdges() {
    return this.edges;
  }
  // 获取图中的边集合
  getEdgeCount() {
    let keys = this.edges.keys();
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      let edgeVertexs = this.edges.get(code);
      for (let j = 0; j < edgeVertexs.length; j++) {
        if (edgeVertexs[j]) {
          count++;
        }
      }
    }
    return count;
  }
  // 通过一个顶点获取他的边
  getEdges(vertexCode) {
    if (this.edges.get(vertexCode)) {
      return this.edges.get(vertexCode);
    } else {
      return [];
    }
  }
  toString() {
    let keys = this.edges.keys();
    let firstCode = "";
    for (let i = 0; i < keys.length; i++) {
      if (i === 0) {
        firstCode = keys[i];
      }
      let code = keys[i];
      let edge = "";
      let edgeVertexs = this.edges.get(code);
      for (let j = 0; j < edgeVertexs.length; j++) {
        if (edgeVertexs[j]) {
          let vType = edgeVertexs[j].type;
          let vText = edgeVertexs[j].text;
          let vCode = edgeVertexs[j].code;
          let vEnd = edgeVertexs[j].vertexEnd;
          let option = edgeVertexs[j].option;
          // let isCritical = "非关键";
          // if (option.isCriticalTask == 'true') {
          //     isCritical = "【关键】"
          // }
          let info = "";
          if (vType == TASK_TYPE.REAL) {
            vType = "实";
            info = JSON.stringify(option.text);
          } else if (vType == TASK_TYPE.DUMMY) {
            vType = "虚";
          } else if (vType == TASK_TYPE.HANG) {
            vType = "挂起";
          }
          edge += `【结束：${vEnd}/代码：${vCode}/类型：${vType}】`;
        }
      }
      console.log(`起点：${code}->${edge}  \n\r`);
    }
    //this.dfs(firstCode);
    //this.topSort();
  }
  //重新编制节点
  renumber(idNodesTable) {
    //console.log(idNodesTable);
    let keys = this.edges.keys();
    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      let newCode = idNodesTable[code];
      // if (code == lastCode) {
      //     newCode = lastCode;
      // }
      let edges = [];
      let edgeVertexs = this.edges.get(code);
      for (let j = 0; j < edgeVertexs.length; j++) {
        if (edgeVertexs[j]) {
          let vEnd = edgeVertexs[j].vertexEnd;
          let newEnd = idNodesTable[vEnd];
          //console.log("vEnd", vEnd, "newEnd", newEnd);
          let edge = edgeVertexs[j];
          // if (vEnd == lastCode) {
          //     newEnd = lastCode;
          // }
          edge.vertexEnd = newEnd;
          edges.push(edge);
        }
      }
      this.edges.delete(code);
      this.edges.set(newCode, edges);
    }
    //重新赋值节点
    for (let i = 0; i < this.vertexs.length; i++) {
      let code = this.vertexs[i].code;
      //if (code != lastCode) {
      this.vertexs[i].rawCode = this.vertexs[i].code;
      this.vertexs[i].code = idNodesTable[code];

      //}
    }
  }
  //修改节点指向
  pointNewNode(oldNode, newNode, exception) {
    let keys = this.edges.keys();
    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      if (exception != code) {
        let edgeVertexs = this.edges.get(code);
        for (let j = 0; j < edgeVertexs.length; j++) {
          if (edgeVertexs[j]) {
            let vType = edgeVertexs[j].type;
            let vCritical = edgeVertexs[j].critical;
            let vCode = edgeVertexs[j].code;
            let vEnd = edgeVertexs[j].vertexEnd;
            let option = edgeVertexs[j].option;
            if (vEnd == oldNode) {
              this.edges.items[code].splice(j, 1);
              this.edges.get(code).push({
                vertexEnd: newNode,
                code: vCode,
                type: vType,
                critical: vCritical,
                option: option,
              });

              this.oppositeEdges
                .get(newNode)
                .push({ vertexStart: code, code: vCode, type: vType });
            }
          }
        }
      }
    }
  }
  //判断是否有指向自己的边
  hasPointSelf(node1, node2) {
    let edges = this.edges.get(node2);
    if (edges) {
      if (edges.length > 0) {
        for (let i = 0; i < edges.length; i++) {
          if (edges[i]) {
            if (edges[i].vertexEnd == node1) {
              let node2DegeNumber = edges.length;
              let node1DegeNumber = this.edges.get(node1).length;
              //console.log(node2 + ":" + node2DegeNumber, node1 + ":" +node1DegeNumber);
              let deleteNode = node1;
              if (node2DegeNumber < node1DegeNumber) {
                deleteNode = node2;
              }
              return {
                has: true,
                deleteNode: deleteNode,
              };
            }
          }
        }
      }
    }
    return {
      has: false,
      deleteNode: null,
    };
  }
  /**
   * 检查节点是否重复，并且任务相同
   * @param {String} node1
   * @param {String} node2
   * @param {String} taskCode
   */
  checkDuplicateNode(node1, node2, taskCode) {
    let edges = this.edges.get(node1);
    let nodeDuplicate = false;
    let taskDuplicate = false;
    if (edges) {
      if (edges.length > 0) {
        for (let i = 0; i < edges.length; i++) {
          if (edges[i]) {
            if (edges[i].vertexEnd === node2) {
              nodeDuplicate = true;
              if (taskCode === edges[i].code) {
                taskDuplicate = true;
              }
            }
          }
        }
      }
    }
    return {
      nodeDuplicate: nodeDuplicate,
      taskDuplicate: taskDuplicate,
    };
  }
  /**
   * 判断节点到节点是否已经存在
   * @param {String} node1
   * @param {String} node2
   */
  _hasNodeToNode(node1, node2) {
    let edges = this.edges.get(node1);
    if (edges) {
      if (edges.length > 0) {
        for (let i = 0; i < edges.length; i++) {
          if (edges[i]) {
            if (edges[i].vertexEnd == node2) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  //判断对象数组objArr中是否有obj
  _isExist(objArr, obj) {
    if (objArr.length > 0) {
      for (let i = 0; i < objArr.length; i++) {
        if (objArr[i] == obj) return true;
      }
    }
    return false;
  }
  //通过顶点代码，判断顶点是否存在
  codeIsExist(code) {
    if (this.vertexs.length > 0) {
      for (let i = 0; i < this.vertexs.length; i++) {
        if (this.vertexs[i].code == code) {
          return {
            isExist: true,
            index: i,
          };
        }
      }
    }

    return {
      isExist: false,
      index: -1,
    };
  }
  //通过顶点代码，获取顶点，存在直接返回，不存在则添加
  getVertexByCode(vertex, vertexCode) {
    let returnVertex = vertex;
    if (this.vertexs.length > 0) {
      for (let i = 0; i < this.vertexs.length; i++) {
        if (this.vertexs[i].code == vertexCode) {
          returnVertex = this.vertexs[i];
          this.numberCounter--;
          break;
        }
      }
    }
    return returnVertex;
  }
  //创建initializeColor用来初始化各个顶点的颜色，为遍历过程中的标记做准备
  initializeColor() {
    var color = {};
    let keys = this.edges.keys();
    for (let i = 0; i < keys.length; i++) {
      color[keys[i]] = "white";
    }
    return color;
  }

  /**
   * 对节点进行拓扑排序
   */
  taskTopSort() {
    let that = this;
    let visiteds = {};
    for (let i = 0; i < this.vertexs.length; i++) {
      let code = this.vertexs[i].code;
      console.log("code", code);
      visiteds[this.vertexs[i].code] = false;
    }
    console.log("visiteds", visiteds);
    let pathNodes = [];
    let paths = new Array();
    let duration = 0;
    let count = 0;
    // 遍历所有节点，并依次调用sortHelper函数
    let keys = Object.keys(visiteds);
    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      if (!visiteds[code]) {
        sortHelper(code);
      }
    }
    function sortHelper(v) {
      // 深度搜索
      //if (!visiteds[v]) {
      pathNodes.push(v);
      visiteds[v] = true;
      let _edges = that.edges.get(v);
      if (_edges && _edges.length > 0) {
        _edges.forEach(function (w) {
          count++;
          duration =
            duration +
            (w.option
              ? w.option.duration
                ? Number(w.option.duration)
                : 0
              : 0);
          sortHelper(w.vertexEnd);
        });
      } else {
        paths.push({
          path: pathNodes,
          duration: duration,
        });
        pathNodes = [];
        duration = 0;
      }
      //}
    }
    console.log("count", count, this.getEdgeCount());
    if (count !== this.getEdgeCount()) {
      if (this.enforce) {
        console.log("Error:存在环状数据");
      } else {
        throw new Error("存在环状数据");
      }
    }
    console.log(paths);
    console.log(pathNodes);
    paths.sort((a, b) => {
      return b.duration - a.duration;
    });
    return { pathNodes, paths };
  }
  /**
   * 对关键路径节点进行拓扑排序
   */
  criticalTopSort() {
    let that = this;
    let visiteds = {};
    for (let i = 0; i < this.vertexs.length; i++) {
      let code = this.vertexs[i].code;
      let critical = this.vertexs[i].critical;
      if (critical) {
        visiteds[this.vertexs[i].code] = false;
      }
    }
    let pathNodes = [];
    let paths = new Array();
    let duration = 0;
    // 遍历所有节点，并依次调用sortHelper函数
    let keys = Object.keys(visiteds);
    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      if (!visiteds[code]) {
        sortHelper(code);
      }
    }
    function sortHelper(v) {
      // 深度搜索
      pathNodes.push(v);
      visiteds[v] = true;
      let _edges = that.edges.get(v);
      if (_edges && _edges.length > 0) {
        _edges.forEach(function (w) {
          if (w.critical) {
            duration =
              duration +
              (w.option
                ? w.option.duration
                  ? Number(w.option.duration)
                  : 0
                : 0);
            sortHelper(w.vertexEnd);
          }
        });
      } else {
        paths.push({
          path: pathNodes,
          duration: duration,
        });
        pathNodes = [];
        duration = 0;
      }
    }
    paths.sort((a, b) => {
      return b.duration - a.duration;
    });
    return paths;
  }
  /**
   * 对非关键路径节点进行拓扑排序
   */
  unCriticalTopSort() {
    let that = this;
    let visiteds = {};
    for (let i = 0; i < this.vertexs.length; i++) {
      let code = this.vertexs[i].code;
      let critical = this.vertexs[i].critical;
      if (!critical) {
        visiteds[this.vertexs[i].code] = false;
      }
    }
    let pathNodes = [];
    let paths = new Array();
    let duration = 0;
    // 遍历所有节点，并依次调用sortHelper函数
    let keys = Object.keys(visiteds);
    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      if (!visiteds[code]) {
        sortHelper(code);
      }
    }
    function sortHelper(v) {
      // 深度搜索
      pathNodes.push(v);
      visiteds[v] = true;
      let _edges = that.edges.get(v);
      if (_edges && _edges.length > 0) {
        _edges.forEach(function (w) {
          if (!w.critical) {
            duration =
              duration +
              (w.option
                ? w.option.duration
                  ? Number(w.option.duration)
                  : 0
                : 0);
            sortHelper(w.vertexEnd);
          }
        });
      } else {
        paths.push({
          path: pathNodes,
          duration: duration,
        });
        pathNodes = [];
        duration = 0;
      }
    }
    paths.sort((a, b) => {
      return b.duration - a.duration;
    });
    return paths;
  }
}

/**
 * @explain 封装顶点Class
 * @param {Number} number                  顶点索引
 * @param {String} xtime                   时标
 * @param {String} text                    顶点文本
 * @param {Boolean} critical               是否关键路径
 *
 * @return {String}                        返回读取到的字符串
 * @date   2019-09-17
 * @author 杨勇
 * **/

class Vertex {
  constructor(number, code, xtime, critical) {
    this.number = number ? number : 0;
    this.code = code ? code : "-1";
    this.xtime = "";
    this.critical = critical ? critical : 0;
    this.setXtime(xtime);
  }
  setXtime(xtime) {
    if (xtime !== "") {
      this.xtime = xtime;
    }
  }
  // 设置顶点的属性
  setAttribute(number, code, type, critical) {
    this.number = number ? number : 0;
    this.code = code ? code : "-1";
    this.type = type ? type : "REAL";
    this.critical = critical ? critical : 0;
  }

  setFirst() {
    this.isFirst = true;
  }
}

/**
 * @explain 封装边的Class
 * @param {Object->Vertex} _vertexStart                开始顶点
 * @param {Object->Vertex} _vertexEnd                  结束顶点
 * @param {String} _type                               边类型   1,REALWORK实工作边/2,DUMMYWORK虚工作边
 * @param {Boolean} _critical                          是否关键路径
 * @param {String} _code                               代表的任务编码
 * @param {Object->Json} _option                       边的其它属性

 * @date   2019-09-23
 * @author 杨勇
 * **/

class Edge {
  constructor(_vertexStart, _vertexEnd, _type, _critical, _code, _edgeOption) {
    this.vertexStart = _vertexStart ? _vertexStart : null;
    this.vertexEnd = _vertexEnd ? _vertexEnd : null;
    this.type = _type ? _type : 1;
    this.code = _code ? _code : "default dege";
    this.critical = _critical ? _critical : false;
    this.option = _edgeOption ? _edgeOption : null;
  }
}

//集合
class Collection {
  constructor() {
    this.temp = [];
  }

  //排序(升序)
  sortAsc(a) {
    var arr = a;
    return arr.sort(compareAsc);
  }
  //排序(降序)
  sortDesc(a) {
    var arr = a;
    return arr.sort(compareDesc);
  }
  // 并集   a + b
  union(a, b) {
    let s1 = new Set(a);
    let s2 = new Set(b);
    let union = [...s1, ...s2];
    return union;
  }
  //清除数组中的undefined
  clearNull(arr) {
    let newArr = [];
    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
          newArr.push(arr[i]);
        }
      }
    }
    return newArr;
  }
  // 交集   a & b
  intersect(a, b) {
    // if (a.length === 0 || b.length === 0) {
    //     return ([]);
    // } else {
    //     console.log("b===", b);

    //     let s2 = new Set(b);
    //     let intersect = a.filter(x => s2.has(x));
    //     return intersect;
    // }
    let s2 = new Set(b);
    let intersect = a.filter((x) => s2.has(x));
    //console.log("intersect:", a, b, intersect);
    return intersect;
  }
  // 交集   a & b
  intersectString(a, b) {
    if (a.length === 0 || b.length === 0) {
      return [];
    }
    let s2 = new Set(b.split(","));
    let intersect = a.split(",").filter((x) => s2.has(x));
    return intersect;
  }
  // 差集   a - b
  difference(a, b) {
    let s2 = new Set(b);
    let difference = a.filter((x) => !s2.has(x));
    return difference;
  }
  differenceString(a, b) {
    if (a.length === 0 || b.length === 0) {
      return [];
    }
    let s2 = new Set(b.split(","));
    let difference = a.split(",").filter((x) => !s2.has(x));
    return difference;
  }
  // 去重
  minus(a) {
    let minus = [...new Set(a)];
    return minus;
  }
  // 并集+去重
  unionMinus(a, b) {
    let union = this.union(a, b);
    let minus = [...new Set(union)];
    return minus;
  }
  //判断a集合是否真包含集合b
  isProperSubset(a, b) {
    let _intersect = this.intersect(a, b);
    if (this.isEqual(_intersect, a)) {
      return true;
    } else {
      return false;
    }
  }
  //判断b是否a的超集
  isSuperset(a, b) {
    let set = new Set(a);
    let subset = new Set(b);
    for (var elem of subset) {
      if (!set.has(elem)) {
        return false;
      }
    }
    return true;
  }
  //判断a是否等于b
  isEqual(a, b) {
    let aStr = new Array(a).join("-");
    let bStr = new Array(b).join("-");
    if (aStr == bStr) {
      return true;
    } else {
      return false;
    }
  }
  //数组转字符串
  toStr(a, prefix) {
    return a.join(prefix);
  }
  //取出两个数组的不同元素
  getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function (v, i, arr) {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    });
  }
  //取出两个数组的相同元素
  getArrEqual(arr1, arr2) {
    let newArr = [];
    for (let i = 0; i < arr2.length; i++) {
      for (let j = 0; j < arr1.length; j++) {
        if (arr1[j] === arr2[i]) {
          newArr.push(arr1[j]);
        }
      }
    }
    return newArr;
  }
  //数组的排列组合
  //var arr = [1, 2, 3];
  // 临时变量，用于输出

  n(arr) {
    for (var i = 0; i < arr.length; i++) {
      // 插入第i个值
      this.temp.push(arr[i]);
      // 复制数组
      var copy = arr.slice();
      // 删除复制数组中的第i个值，用于递归
      copy.splice(i, 1);
      if (copy.length == 0) {
        // 如果复制数组长度为0了，则打印变量
        console.log(this.temp);
      } else {
        // 否则进行递归
        this.n(copy);
      }
      // 递归完了之后删除最后一个元素，保证下一次插入的时候没有上一次的元素
      this.temp.pop();
    }
  }
  combination(arr) {
    this.temp = [];
    for (let i = 0; i < arr.length; i++) {
      let newArr = arr.slice(i);
      //console.log(newArr);

      this.n(newArr);
    }
    return this.temp;
  }
}
function compareAsc(val1, val2) {
  if (val1 < val2) {
    return -1;
  } else if (val1 > val2) {
    return 1;
  } else {
    return 0;
  }
}
function compareDesc(val1, val2) {
  if (val1 > val2) {
    return -1;
  } else if (val1 < val2) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * @explain 封装甘特图数据的Class
 * @param {Object->Json} _ganttData               甘特图数据

 * @date   2019-09-23
 * @author 杨勇
 * **/
const TARGET_TASK_MODEL = {
  TEMPLATE: 1,
  CONVENTION: 2,
};
const TASK_LINK_TYPE = {
  FS: 0,
  SS: 1,
  FF: 2,
  SF: 3,
};
class Gantt {
  constructor(_ganttData, _timeScale, _targetTaskModel, _enforce) {
    this.graph = new Graph();
    this.timeScale = _timeScale;
    this.targetTaskModel = _targetTaskModel;
    this.flagTasks = {};
    this.links = [];
    this.unFS = [];
    this.rawTasks = {};
    this.maxTime = {};
    this.enforce = _enforce;
    //处理前后关系
    this._linksHandle(_ganttData.links);
    this.projectStartTime = null;
    this.projectEndTime = null;
    this._rawTasksHandle(_ganttData.data);
    this.frontLinks = null;
    this.followLinks = null;
    this.tasksTopSort = [];
    this.getData(_ganttData ? _ganttData : null);
  }

  //将数组转为hash，降低时间复杂度
  _rawTasksHandle(allTasks) {
    let start = null;
    let end = null;
    for (let i = 0; i < allTasks.length; i++) {
      let taskInfo = allTasks[i];
      if (taskInfo.isCriticalTask === true) {
        console.log("关键：", taskInfo.text);
      }
      //2020-08-06 根据模板数据取目标级别的任务数据（当前取4级任务）
      //2020-08-07 重构根据task_type取值，并且包含3级 专业审核任务  增加常规1级任务模式选项
      if (this.targetTaskModel === TARGET_TASK_MODEL.TEMPLATE) {
        if (
          taskInfo.task_type === "1" || //设计任务(4级)
          taskInfo.task_type === "3" || //复核任务(4级)
          taskInfo.task_type === "2" || //专业审核(3级)
          this.flagTasks[taskInfo.id]
        ) {
          //关系中用到的任务
          if (start === null) {
            start = new Date(taskInfo.start_date);
            end = new Date(taskInfo.end_date);
          } else {
            start =
              new Date(taskInfo.start_date) < start
                ? new Date(taskInfo.start_date)
                : start;
            end =
              new Date(taskInfo.end_date) > end
                ? new Date(taskInfo.end_date)
                : end;
          }

          taskInfo.code = taskInfo.id;
          taskInfo.isCreated = false;
          taskInfo.isLastTask = false;
          taskInfo.isFirstTask = false;
          taskInfo.isAlone = true;
          this.rawTasks[taskInfo.id] = taskInfo;
        }
      } else if (this.targetTaskModel === TARGET_TASK_MODEL.CONVENTION) {
        if (start === null) {
          start = new Date(taskInfo.start_date);
          end = new Date(taskInfo.end_date);
        } else {
          start =
            new Date(taskInfo.start_date) < start
              ? new Date(taskInfo.start_date)
              : start;
          end =
            new Date(taskInfo.end_date) > end
              ? new Date(taskInfo.end_date)
              : end;
        }
        taskInfo.code = taskInfo.id;
        taskInfo.created = false;
        taskInfo.isLastTask = false;
        taskInfo.isFirstTask = false;
        taskInfo.isAlone = true;
        this.rawTasks[taskInfo.id] = taskInfo;
      }
    }
    //console.log(this.rawTasks);
    let libs = new Libs();
    this.projectStartTime = libs.dateFormat("yyyy-MM-dd hh:mm:ss", start);
    this.projectEndTime = libs.dateFormat("yyyy-MM-dd hh:mm:ss", end);
  }
  //通过关系图整理出必要的工序集合
  //2020-08-06 根据模板数据 整理目标级别的工序集合
  getData() {
    let frontArr = [];
    let followArr = [];
    let frontLinks = new Dictionary();
    let followLinks = new Dictionary();
    let frontLinksCode = new Dictionary();
    let followLinksCode = new Dictionary();

    let keys = Object.keys(this.rawTasks);
    for (let i = 0; i < this.links.length; i++) {
      frontArr.push(this.links[i].frontId);
      followArr.push(this.links[i].followId);
    }
    //通过不重复的link中task的id整理task信息
    if (keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        let code = keys[i];
        frontLinks.set(code, []); //初始化紧前关系字典
        followLinks.set(code, []); //初始化紧后关系字典
        frontLinksCode.set(code, []); //初始化紧前关系字典
        followLinksCode.set(code, []); //初始化紧后关系字典
      }
    }

    //遍历填充紧前紧后关系字典
    let _taskInfo = null;
    let _tempFrontCode = "";
    let _tempFollowCode = "";

    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      let task = this._getTask(code);
      //console.log("code---", code);
      for (let j = 0; j < this.links.length; j++) {
        //紧后任务
        let link = this.links[j];
        link.lag = Number(link.lag ? link.lag : 0);
        if (link.type === TASK_LINK_TYPE.FS) {
          if (code === this.links[j].frontId) {
            _tempFollowCode = this.links[j].followId;
            _taskInfo = this._getTask(_tempFollowCode);
            _taskInfo.isAlone = false;
            if (_taskInfo !== null) {
              _taskInfo.relation = link;
              followLinks.get(code).push(_taskInfo);
              followLinksCode.get(code).push(_tempFollowCode);
            } else {
              if (this.enforce) {
                console.log(
                  "Error:数据错误,缺少id为",
                  _tempFollowCode,
                  "的任务"
                );
              } else {
                throw new Error("数据错误,缺少id为", _tempFollowCode, "的任务");
              }
            }
          }
          //紧前
          if (code === this.links[j].followId) {
            _tempFrontCode = this.links[j].frontId;
            _taskInfo = this._getTask(_tempFrontCode);
            _taskInfo.isAlone = false;
            if (_taskInfo !== null) {
              _taskInfo.relation = link;
              frontLinks.get(code).push(_taskInfo);
              frontLinksCode.get(code).push(_tempFrontCode);
              this.frontMaxEndTime(code, _taskInfo.end_date);
            } else {
              if (this.enforce) {
                console.log(
                  "Error:数据错误,缺少id为",
                  _tempFrontCode,
                  "的任务"
                );
              } else {
                throw new Error("数据错误,缺少id为", _tempFrontCode, "的任务");
              }
            }
          }
        }
      }
    }
    //处理开始处任务的最大紧前结束时间
    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      let fronts = frontLinks.get(code);
      if (fronts.length === 0) {
        this.frontMaxEndTime(code, this.projectStartTime);
      }
    }
    this.frontLinks = frontLinks;
    this.followLinks = followLinks;
    this.frontLinksCode = frontLinksCode;
    this.followLinksCode = followLinksCode;
    //this.taskTopSort();
  }
  //设置紧前最晚结束时间
  frontMaxEndTime(taskCode, _time) {
    if (undefined === this.rawTasks[taskCode].frontMaxEndTime) {
      this.rawTasks[taskCode].frontMaxEndTime = _time;
    } else if (_time > this.rawTasks[taskCode].frontMaxEndTime) {
      this.rawTasks[taskCode].frontMaxEndTime = _time;
    }
  }
  /**
   * 获取任务在wbs中的界别
   * @param {String} taskCode
   */
  _getTaskLevel(task) {
    //let task = this._getTask(taskCode);
    let _level = 1;
    console.log(task);
    if (task) {
      if (task.position === "1") {
        _level = 1;
      } else {
        _level = task.wbs.split(".").length + 1;
      }
    }
    return _level;
  }

  //获取任务信息
  _getTask(taskCode) {
    return this.rawTasks[taskCode] ? this.rawTasks[taskCode] : null;
  }
  //整理关系
  _linksHandle(links) {
    let newLinks = [];
    //获取不重复的连接  紧前点
    for (let i = 0; i < links.length; i++) {
      //默认fs   links[i].type == "0"
      let frontId = links[i].source;
      let followId = links[i].target;
      let type = Number(links[i].type ? links[i].type : 0);
      let lag = Number(links[i].lag ? links[i].lag : 0);
      let newData = {
        frontId: frontId,
        followId: followId,
        type: type,
        lag: lag,
      };
      //将FS关系和其它搭接关系的数据分开
      if (Number(type) === TASK_LINK_TYPE.FS) {
        this.flagTasks[frontId] = true;
        this.flagTasks[followId] = true;
        newLinks.push(newData);
      }
      // else if (Number(type) === TASK_LINK_TYPE.SF) {  //SF转FS关系
      //     newData = {
      //         "frontId": followId,
      //         "followId": frontId,
      //         "type": TASK_LINK_TYPE.FS,
      //         "lag": lag * -1
      //     }
      //     this.flagTasks[frontId] = true;
      //     this.flagTasks[followId] = true;
      //     newLinks.push(newData);
      // }
      else {
        this.unFS.push(newData);
      }
    }
    //console.log(" this.links[j]", this.unFS);
    this.links = newLinks;
    //return (newLinks);
  }
  /**
   * 对任务机型拓扑排序
   */
  taskTopSort() {
    var that = this;
    var visiteds = {};
    let keys = Object.keys(this.rawTasks);
    for (var i = 0; i < keys.length; i++) {
      let code = keys[i];
      visiteds[code] = false;
    }
    //console.log(visiteds);
    var linkStack = [];
    var unLinkStack = [];
    // 遍历所有节点，并一次调用sortHelper函数
    for (var i = 0; i < keys.length; i++) {
      let code = keys[i];
      if (!visiteds[code]) {
        sortHelper(code);
      }
    }
    function sortHelper(v) {
      // 类似深度搜索
      if (!visiteds[v]) {
        linkStack.push(v);
        visiteds[v] = true;
        let follows = that.followLinksCode.get(v);
        if (follows && follows.length > 0) {
          follows.forEach(function (w) {
            sortHelper(w);
          });
        } else {
          unLinkStack.push(v);
        }
      }
    }
    // console.log(linkStack);
    // console.log(unLinkStack);
    this.tasksTopSort = linkStack;
    return { linkStack, unLinkStack };
  }
}

/**
 * Tree数据结构
 */
class Tree {
  constructor() {
    this.index = 1;
    this.insterTable = {};
    this.idTable = {};
    this.idTableList = {};
    this.source = [];
  }
  createId() {
    return this.index++;
  }
  getKeyByLen(keysArr, key, len) {
    let arr = [];
    let collection = new Collection();
    for (let i = 0; i < keysArr.length; i++) {
      let _key = keysArr[i].key;
      let intersect = collection.intersectString(key, _key);
      if (keysArr[i].len == len && key != _key && intersect.length > 0) {
        arr.push(keysArr[i]);
      }
    }

    return arr;
  }
  getId(key) {
    if (this.idTable[key]) {
      return this.idTable[key];
    }
  }
  insterData(key, parentId, parentKey, diff, jsonData) {
    if (this.insterTable[key]);
    else {
      this.source.push({
        key: key,
        parentId: parentId,
        parentKey: parentKey,
        diff: diff,
        data: jsonData,
        id: this.getId(key),
      });
      this.insterTable[key] = true;
    }
  }
  getTree(json) {
    let keys = Object.keys(json);
    let collection = new Collection();
    let arr = [];
    let temp = {};
    for (let i = 0; i < keys.length; i++) {
      let _key = keys[i];
      let _keyLen = _key.split(",").length;
      for (let i = 0; i < keys.length; i++) {
        temp[_key] = {
          len: _keyLen,
          key: _key,
        };
      }
    }
    keys = Object.keys(temp);
    for (let i = 0; i < keys.length; i++) {
      let _key = keys[i];
      let _temp = temp[_key];
      let _id = this.createId();
      _temp.id = _id;
      arr.push(_temp);
      this.idTable[_key] = _id;
    }
    arr.sort(sortBy("len", true, parseInt)); //将数组按长度排序
    this.idTableList = arr;
    this.index = 1;
    for (let i = 0; i < arr.length; i++) {
      let _json = arr[i];
      let len = _json.len;
      let key = _json.key;
      let keyArr = key.split(",");
      let isFind = false;
      for (let i = 0; i < arr.length; i++) {
        //查找没有父集的
        let _key = arr[i].key;
        let _keyArr = _key.split(",");
        let intersect = collection.intersect(keyArr, _keyArr);
        //console.log(key, "--", _key, "intersect:", intersect);
        if (
          key != _key &&
          intersect.length != 0 &&
          keyArr.length < _keyArr.length
        ) {
          isFind = true;
          break;
        }
      }

      //console.log(key, "--", "isFind:", isFind);

      if (!isFind) {
        //console.log(key, "未找到父集:", json[key]);
        this.insterData(key, 0, "", "", json[key]);
      }

      for (let j = len; j > 0; j--) {
        let subsetKeys = this.getKeyByLen(arr, key, len - 1);
        // console.log("subsetKeys", subsetKeys);
        if (subsetKeys.length > 0) {
          //找到则退出，说明最大的子集已经找到
          for (let x = 0; x < subsetKeys.length; x++) {
            let subsetKeyArr = subsetKeys[x].key.split(",");
            let keyArr = key.split(",");
            let diff = collection.difference(keyArr, subsetKeyArr);
            let parentId = this.getId(key);
            let nowKey = subsetKeys[x].key;
            //console.log(key, "找到长度为", len - 1, "的子集:", subsetKeys[x], "差集：", diff);
            if (this.insterTable[nowKey]);
            else {
              let parentId = this.getId(key);
              this.insterData(nowKey, parentId, key, diff, json[nowKey]);
            }
          }
          break;
        } else {
          //未找到，则长度减一，在找
          continue;
        }
      }
    }
    // 调用
    return treeData(this.source, "id", "parentId", "subset");
  }
}

var sortBy = function (filed, rev, primer) {
  rev = rev ? -1 : 1;
  return function (a, b) {
    let a2 = a.id;
    let b2 = b.id;
    a = a[filed];
    b = b[filed];
    if (a == b) {
      a = a2;
      b = b2;
    }
    if (typeof primer != "undefined") {
      a = primer(a);
      b = primer(b);
    }
    if (a < b) {
      return rev * -1;
    }
    if (a > b) {
      return rev * 1;
    }
    return 1;
  };
};

/* 封装函数 */
/* 字段名以字符串的形式传入 */
function treeData(source, id, parentId, children) {
  let cloneData = JSON.parse(JSON.stringify(source));
  return cloneData.filter((father) => {
    let branchArr = cloneData.filter((child) => father[id] == child[parentId]);
    branchArr.length > 0 ? (father[children] = branchArr) : "";
    return father[parentId] == 0;
  });
}

/**
 * @description 封装节点连接的Class
 * @date   2020-07-01
 * @author 杨勇
 * **/
class Link {
  constructor(option, type, link, startCode, endCode) {
    this.option = option; //选项
    this.type = type;
    this.startCode = startCode;
    this.endCode = endCode;
    this.intersections = link
      ? link.intersection
        ? link.intersection
        : []
      : []; //交叉点
    this.passNodes = link ? (link.passNodes ? link.passNodes : []) : []; //穿过的节点
    this.lines = link ? (link.lines ? link.lines : []) : []; //组成线段
  }

  /**
   * @explain 设置线段
   * @param {JsonArr} lines                    线段结构集合
   * **/
  setLines(lines) {
    this.lines = lines;
  }

  /**
   * @explain 设置交叉点
   * @param {JsonArr} intersections           交叉点结构集合
   * **/
  setIntersections(intersections) {
    this.intersections = intersections;
  }
  /**
   * @explain 设置穿点
   * @param {JsonArr} passNodes           穿点结构集合
   * **/
  setPassNodes(passNodes) {
    this.passNodes = passNodes;
  }
  //获取线段
  getLines() {
    if (this.lines) {
      return this.lines;
    } else {
      return [];
    }
  }
  /**
   * @explain 添加一个线段
   * @param {Json} line                       线段结构
   * **/
  addLine(line) {
    this.lines.push(line);
  }
}

/**********************************************
 * @description 双代号网络图节点连线CLASS
 * @date   2020-07-02
 * @date   2020-08-05      剥离节点布局部分
 * @author 杨勇
 * ********************************************/

const _DIRECTION = {
  NONE: 0, //没有方向
  UP: 1, //向上
  DOWN: 2, //向下
  LEFT: 3, //向左
  RIGHT: 4, //向右
};
const _LINE_DIRECTION = {
  HORIZON: 1, //水平线
  VERTICAL: 2, //垂直线
};
const _LINE_SHAPE = {
  SOLID: 1, // 实工作 - 实线
  DOTTED: 2, // 虚工作 - 虚线
  WAVE: 3, // 自由时差 - 波浪线
  // HANG: 4,                        // 挂起工作 - (暂定)虚线
  // AVOID_REPETITION: 5,            // 避免重复的线 - (暂定)虚线
  // LAG: 6,                         // 延时工作 - (暂定)虚线
  // RELATION: 7,                    // 搭接关系工作 - (暂定)虚线
};
const _LINK_TYPE = {
  HORIZON: 1, //水平线
  VERTICAL: 2, //垂直线
  L1: 3, //3，┌
  L2: 4, //4，┐
  L3: 5, //5，└
  L4: 6, //6，┘
  S1: 7, //7，┌┘
  S2: 8, //8，└┐
  U1: 9, //9, ┌┐
  U2: 10, //10,└┘
};

class LinkPlan {
  constructor(Coordinate) {
    this.nodes = Coordinate.nodes;
    this.aoan = Coordinate.aoan;
    this.option = Coordinate.option;
    this.pretreatmentNodesTable = {};
    this.lineCount = 1000;
    this.contactPoint = {};
    this.contactPointOffsetBase = {};
    this.rankIncrement = 0;
    this.linked = {
      lines: [],
    };
    this.tempLineOffset = {};
    console.log(this);
  }

  // 给线段生成唯一编号
  getLineIndex() {
    this.lineCount++;
    return this.lineCount;
  }

  // 预处理节点，按分层和时标归类
  _pretreatmentNodes(nodes) {
    let result = {
      xList: {},
      yList: {},
    };
    let keys = Object.keys(nodes);
    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      this.contactPointOffsetBase[code] = {
        _top: {
          left: 0,
          middle: 0,
          right: 0,
        },
        _bottom: {
          left: 0,
          middle: 0,
          right: 0,
        },
      };
      this.contactPoint[code] = {
        _top: {
          left: [],
          middle: [],
          right: [],
        },
        _bottom: {
          left: [],
          middle: [],
          right: [],
        },
        top: [],
        bottom: [],
      };
      let location = nodes[code];
      let x = location.x;
      let y = location.y;
      if (result.xList[x]) {
        result.xList[x].push({
          node: code,
          x: x,
          y: y,
        });
        // 排序
        result.xList[x] = result.xList[x].sort((a, b) => {
          return a.y - b.y;
        });
      } else {
        result.xList[x] = [];
        result.xList[x].push({
          node: code,
          x: x,
          y: y,
        });
      }

      if (result.yList[y]) {
        result.yList[y].push({
          node: code,
          x: x,
          y: y,
        });
        // 排序
        result.yList[y] = result.yList[y].sort((a, b) => {
          return a.x - b.x;
        });
      } else {
        result.yList[y] = [];
        result.yList[y].push({
          node: code,
          x: x,
          y: y,
        });
      }
    }
    // console.log("---result", result);
    // 排序
    // for (let key in result.yList) {
    //     result.yList[key] = result.yList[key].sort((a, b) => {
    //         return a.x - b.x;
    //     })
    // }

    // for (let key in result.xList) {
    //     result.xList[key] = result.xList[key].sort((a, b) => {
    //         return a.x - b.x;
    //     })
    // }
    // this._compressRank();
    return result;
  }

  // 初始化
  _init() {
    // 节点预处理
    this.pretreatmentNodesTable = this._pretreatmentNodes(this.nodes);
  }

  /**
   * 创建节点的坐标
   * 此方法耗时较多，故使用回调方式，再由layoutPlan方法回调暴露接口
   * @param {String} initData       整理后的图数据信息
   * @param {function}              回调函数，返回节点的坐标信息
   * @date 2020-06-24
   * @author 杨勇
   */
  // 创建节点的坐标
  createPlan(callback) {
    this._init();

    // ----------无--------情--------的--------分------割------线----------
    // Step1:连接相同层(或相同时标)的连续节点   水平线
    let keys = Object.keys(this.aoan.edgesMap);
    for (let i = 0; i < keys.length; i++) {
      let edgeCode = keys[i]; // 正序
      {
        edgeCode = keys[keys.length - 1 - i]; // 倒序
      }
      let edge = this.aoan.edgesMap[edgeCode];
      let startCode = edge.start;
      let endCode = edge.end;
      // console.log(startCode, "------11111------->", endCode);
      this._createHorizonLink(startCode, endCode);
    }

    // ----------无--------情--------的--------分------割------线----------
    // Step2:连接L线
    for (let i = 0; i < keys.length; i++) {
      let edgeCode = keys[i]; // 正序
      {
        edgeCode = keys[keys.length - 1 - i]; // 倒序
      }
      let edge = this.aoan.edgesMap[edgeCode];
      let startCode = edge.start;
      let endCode = edge.end;
      let isCritical = edge.isCritical;
      // let isDummy = edge.end;
      if (edge.link === null && isCritical) {
        // console.log(startCode, "------22222111------->", endCode);
        this._createLLink(startCode, endCode, false);
      }
    }

    // ----------无--------情--------的--------分------割------线----------
    // Step2:连接L线
    for (let i = 0; i < keys.length; i++) {
      let edgeCode = keys[i]; // 正序
      {
        edgeCode = keys[keys.length - 1 - i]; // 倒序
      }
      let edge = this.aoan.edgesMap[edgeCode];
      let startCode = edge.start;
      let endCode = edge.end;
      // let isCritical = edge.isCritical;
      // let isDummy = edge.end;
      if (edge.link === null) {
        // console.log(startCode, "------22222111------->", endCode);
        this._createLLink(startCode, endCode, false);
      }
    }

    // ----------无--------情--------的--------分------割------线----------
    // Step5:连接S线（允许并行，不允许穿点）
    for (let i = 0; i < keys.length; i++) {
      let edgeCode = keys[i]; // 正序
      {
        edgeCode = keys[keys.length - 1 - i]; // 倒序
      }
      let edge = this.aoan.edgesMap[edgeCode];
      let startCode = edge.start;
      let endCode = edge.end;
      if (edge.link === null) {
        // console.log(startCode, "------3333333------->", endCode);
        this._createSLink(startCode, endCode, false);
      }
    }

    // ----------无--------情--------的--------分------割------线----------
    // Step6:连接U线
    for (let i = 0; i < keys.length; i++) {
      let edgeCode = keys[i]; // 正序
      {
        edgeCode = keys[keys.length - 1 - i]; // 倒序
      }
      let edge = this.aoan.edgesMap[edgeCode];
      let startCode = edge.start;
      let endCode = edge.end;
      if (edge.link === null) {
        // console.log(startCode, "------444444444------->", endCode);
        this._createULink(startCode, endCode);
      }
    }

    // ----------无--------情--------的--------分------割------线----------
    // Step8:连接(相同层或)相同时标的连续节点   垂直线
    for (let i = 0; i < keys.length; i++) {
      let edgeCode = keys[i]; // 正序
      {
        edgeCode = keys[keys.length - 1 - i]; // 倒序
      }
      let edge = this.aoan.edgesMap[edgeCode];
      let startCode = edge.start;
      let endCode = edge.end;
      // let isCritical = edge.isCritical;
      // let isDummy = edge.end;
      // console.log(startCode, "------11111------->", endCode);
      if (edge.link === null) {
        this._createVerticalLink(startCode, endCode, false);
      }
    }

    // ----------无--------情--------的--------分------割------线----------
    // Step7:找到合适的连线（允许穿点）
    for (let i = 0; i < keys.length; i++) {
      let edgeCode = keys[i]; // 正序
      {
        edgeCode = keys[keys.length - 1 - i]; // 倒序
      }
      let edge = this.aoan.edgesMap[edgeCode];
      let startCode = edge.start;
      let endCode = edge.end;
      if (edge.link === null) {
        // console.log(startCode, "------77777------->", endCode);
        this._createBestLink(startCode, endCode);
      }
    }

    // ----------无--------情--------的--------分------割------线----------

    // 计算线条的偏移量
    this._computeOffset();
    // console.log("this:", this);
    this._updateRank(callback);
    // callback(nodes, option);
    // console.timeEnd("布局计算:");
  }

  /**
   *创建水平连接
   * @param {String} startCode
   * @param {String} endCode
   */
  // 创建水平连接        duration / (duration + free) = length / linelen
  _createHorizonLink(startCode, endCode) {
    // console.log(startCode + "------aaaa------->" + endCode);
    let startLocation = this.nodes[startCode];
    let endLocation = this.nodes[endCode];
    if (startLocation && endLocation) {
      let sX = startLocation.x;
      let eX = endLocation.x;
      let sY = startLocation.y;
      let eY = endLocation.y;

      let taskInfo = this.aoan.edgesMap[startCode + "-" + endCode];
      let taskType = taskInfo.taskType;
      let rawTaskInfo = taskInfo.option;
      let type = 1;
      let lines = [];
      let label = "";
      let isCritical = taskInfo.isCritical;
      let isDummy = taskInfo.isDummy;
      let direction = _DIRECTION.NONE;
      let lineLen = Number(eX) - Number(sX);
      let free = rawTaskInfo ? rawTaskInfo.free_float : 0;
      let freeDay = Number(free / 24).toFixed(4);
      let duration = taskInfo.duration || 0;
      let durationDay = Number(duration / 24).toFixed(4);

      if (!isDummy) {
        // 实工作
        label = rawTaskInfo.text ? rawTaskInfo.text : "";
      }

      if (sY === eY) {
        // 水平线
        let isContinuousNodesOnTime = this._isContinuousNodes(
          startCode,
          endCode,
          _LINE_DIRECTION.HORIZON,
          sY
        );
        if (isContinuousNodesOnTime) {
          if (sX < eX) {
            // 后节点在后方       向后
            direction = _DIRECTION.RIGHT;
            // 判断在同层是否连续节点
            let isContinuousNodesOnRank = this._isContinuousNodes(
              startCode,
              endCode,
              _LINE_DIRECTION.HORIZON,
              sY
            );
            // console.log("isContinuousNodesOnRank", isContinuousNodesOnRank);
            if (isContinuousNodesOnRank) {
              // 是连续节点  1，─
              type = _LINK_TYPE.HORIZON;
              lines = this._createHorizonLines(sX, eX, sY, direction, taskInfo);
            }
          } else if (sX > eX) {
            // 后节点在前方        向前
            direction = _DIRECTION.LEFT;
            // 判断在同层是否连续节点
            let isContinuousNodesOnRank = this._isContinuousNodes(
              startCode,
              endCode,
              _LINE_DIRECTION.HORIZON,
              sY
            );
            // console.log("isContinuousNodesOnRank2", isContinuousNodesOnRank);
            if (isContinuousNodesOnRank) {
              // 是连续节点  1，─
              type = _LINK_TYPE.HORIZON;
              lines = this._createHorizonLines(eX, sX, sY, direction, taskInfo);
            }
          }
        } // else 两个节点不是连续的节点 应该用U型链接
      }

      if (lines.length > 0) {
        let option = {
          label: label,
          critical: isCritical,
          dummy: isDummy,
          length: lineLen,
          duration: duration,
          durationDay: durationDay,
          direction: direction,
          free: free,
          freeDay: freeDay,
        };

        let link = new Link(option, type, { lines: lines }, startCode, endCode);
        this.aoan.edgesMap[startCode + "-" + endCode].link = link;
        this._registerLink(link);
      }
    } else {
      console.log("ERROR:水平线缺少节点");
    }
  }
  // 创建水平线段        duration / (duration + free) = length / linelen
  _createHorizonLines(sX, eX, y, arrow, taskInfo) {
    let lines = [];
    let label = "";
    let taskType = taskInfo.taskType;
    let rawTaskInfo = taskInfo.option;
    let lineLen = Number(eX) - Number(sX);
    let free = Number(rawTaskInfo ? rawTaskInfo.free_float : 0); // 自由时差 - 小时
    let freeDay = Number(free / 24).toFixed(4); // 自由时差 - 小时转化为天
    let duration = Number(taskInfo.duration) || 0; // 持续时间 - 小时
    let durationDay = Number(duration / 24).toFixed(4); // 小时转化为天
    let durationLength = (duration * lineLen) / (duration + free) || 0;
    // console.log(durationLength);
    let freeLength = (free * lineLen) / (duration + free) || 0;

    let isDummy = taskInfo.isDummy;
    if (!isDummy) {
      label = rawTaskInfo.text ? rawTaskInfo.text : "";
    }

    let lineShape = _LINE_SHAPE.WAVE;
    switch (taskType) {
      case 1: // 1 - 实工作 - 实线
        lineShape = _LINE_SHAPE.SOLID;
        break;
      case 2: // 2 - 虚工作 - 虚线
        lineShape = _LINE_SHAPE.DOTTED;
        break;
      case 3: // 3 - 挂起工作 - 虚线(暂定)
        lineShape = _LINE_SHAPE.DOTTED;
        break;
      case 4: // 4 - 避免重复 - 虚线(暂定)
        lineShape = _LINE_SHAPE.DOTTED;
        break;
      case 5: // 5 - 延时 - 虚线(暂定)
        lineShape = _LINE_SHAPE.DOTTED;
        break;
      case 6: // 6 - 搭接关系 - 虚线(暂定)
        lineShape = _LINE_SHAPE.DOTTED;
        break;
      default:
        // 自由时差 - 波浪线
        lineShape = _LINE_SHAPE.WAVE;
    }

    if (isDummy) {
      lines.push({
        arrow: arrow,
        shape: lineShape,
        length: lineLen,
        direction: _LINE_DIRECTION.HORIZON,
        start: {
          x: sX,
          y: y,
          xOffset: 0,
          yOffset: 0,
        },
        end: {
          x: eX,
          y: y,
          xOffset: 0,
          yOffset: 0,
        },
        passNodes: [],
      });
    } else {
      if (free > 0) {
        lines.push({
          arrow: _DIRECTION.NONE,
          shape: lineShape,
          length: Number(durationLength).toFixed(4),
          direction: _LINE_DIRECTION.HORIZON,
          start: {
            x: sX,
            y: y,
            xOffset: 0,
            yOffset: 0,
          },
          end: {
            x: (Number(sX) + Number(durationLength)).toFixed(4),
            y: y,
            xOffset: 0,
            yOffset: 0,
          },
          passNodes: [],
        });
        lines.push({
          arrow: arrow,
          shape: _LINE_SHAPE.WAVE, // 自由时差 - 波浪线
          length: Number(freeLength).toFixed(4),
          direction: _LINE_DIRECTION.HORIZON,
          start: {
            x: (Number(sX) + Number(durationLength)).toFixed(4),
            y: y,
            xOffset: 0,
            yOffset: 0,
          },
          end: {
            x: eX,
            y: y,
            xOffset: 0,
            yOffset: 0,
          },
          passNodes: [],
        });
      } else {
        lines.push({
          arrow: arrow,
          shape: lineShape,
          length: Number(lineLen).toFixed(4),
          direction: _LINE_DIRECTION.HORIZON,
          start: {
            x: sX,
            y: y,
            xOffset: 0,
            yOffset: 0,
          },
          end: {
            x: eX,
            y: y,
            xOffset: 0,
            yOffset: 0,
          },
          passNodes: [],
        });
      }
    }
    return lines;
  }

  // 创建L型链接
  _createLLink(startCode, endCode, enablePassNode) {
    let startLocation = this.nodes[startCode];
    let endLocation = this.nodes[endCode];
    if (startLocation && endLocation) {
      let sX = startLocation.x;
      let eX = endLocation.x;
      let sY = startLocation.y;
      let eY = endLocation.y;

      let taskInfo = this.aoan.edgesMap[startCode + "-" + endCode];
      let rawTaskInfo = taskInfo.option;
      let label = "";
      let isCritical = taskInfo.isCritical;
      let isDummy = taskInfo.isDummy;
      let lineLen = Number(eX) - Number(sX);
      let free = rawTaskInfo ? rawTaskInfo.free_float : 0;
      let duration = taskInfo.duration || 0;

      if (!isDummy) {
        // 实工作
        label = rawTaskInfo.text ? rawTaskInfo.text : "";
      }

      if (sX !== eX && sY !== eY) {
        // 后节点在后方           向后
        let links = this._checkLLink(
          startLocation,
          endLocation,
          taskInfo,
          enablePassNode
        );
        // 找到交叉点较少的结果
        if (links.length > 0) {
          if (links.length === 2) {
            links = links.sort((a, b) => {
              return a.intersection.length - b.intersection.length;
            });
            // 如果交叉数相同，则找扣分较少的
            if (links[0].intersection.length === links[1].intersection.length) {
              let temp = links[0].intersection.length;
              for (let i = 0; i < links.length; i++) {
                if (temp !== links[i].intersection.length) {
                  links.splice(i, 1);
                }
              }
              links = links.sort((a, b) => {
                return a.deduction - b.deduction;
              });
            }
          }
          let _link = links[0];

          let option = {
            label: label,
            critical: isCritical,
            dummy: isDummy,
            length: lineLen,
            duration: duration,
            direction: _link.direction,
            free: free,
          };

          let link = new Link(option, _link.type, _link, startCode, endCode);
          this.aoan.edgesMap[startCode + "-" + endCode].link = link;
          this._registerLink(link);
        }
      }
    } else {
      console.log("ERROR:L型线缺少节点");
    }
  }
  /**
   *
   * @param {Json} startLocation          开始位置
   * @param {Json} endLocation            结束位置
   * @param {Json} taskInfo               任务信息
   * @param {boolean} parallel            是否允许并行（垂直线）
   * @param {boolean} enablePassNode      是否允许穿过节点（垂直线）
   */
  // 检查L型连线
  _checkLLink(startLocation, endLocation, taskInfo, enablePassNode) {
    let sX = startLocation.x;
    let eX = endLocation.x;
    let sY = startLocation.y;
    let eY = endLocation.y;

    let _result1 = null;
    let _result2 = null;
    let deduction = 0;
    let direction = _DIRECTION.NONE;

    let _horizon = {};
    let _vertical = {};

    let lines = [];
    let links = [];

    if (sX < eX) {
      // 后节点在后方        向后
      direction = _DIRECTION.RIGHT;
      if (sY < eY) {
        // 后节点在前节点的下方
        // -----------------    4，┐  ----------------------
        lines = [];
        // 水平线
        _horizon = {
          start: sX,
          end: eX,
          arrow: _DIRECTION.NONE,
          parameter: sY,
        };
        _result1 = this._resolve(_horizon, _LINE_DIRECTION.HORIZON, false);
        // console.log("_result1", _result1);
        if (_result1.isOk) {
          // 如果水平线可以连接，则判断垂直线
          // 垂直线
          _vertical = {
            start: sY,
            end: eY,
            arrow: _DIRECTION.DOWN,
            parameter: eX,
          };
          deduction = deduction + _result1.deduction;
          _result2 = this._resolve(
            _vertical,
            _LINE_DIRECTION.VERTICAL,
            enablePassNode
          );
          // console.log("_result2", _result2);
          if (_result2.isOk) {
            // 垂直线也可以连接，则生成线段
            lines = this._createLLines(_horizon, _vertical, taskInfo);
            deduction = deduction + _result2.deduction;
          }
        }
        if (lines.length > 0) {
          links.push({
            type: _LINK_TYPE.L2,
            deduction: deduction,
            direction: direction,
            lines: lines,
            passNodes: _result1.passNodes.concat(_result2.passNodes),
            intersection: _result1.intersection.concat(_result2.intersection),
          });
        }
        // -----------------    5，└  ----------------------
        lines = [];
        deduction = 0;
        // 水平线
        _horizon = {
          start: sX,
          end: eX,
          arrow: _DIRECTION.RIGHT,
          parameter: eY,
        };
        _result1 = this._resolve(_horizon, _LINE_DIRECTION.HORIZON, false);
        // console.log("_result1", _result1);
        if (_result1.isOk) {
          // 如果水平线可以连接，则判断垂直线
          // 垂直线
          _vertical = {
            start: sY,
            end: eY,
            arrow: _DIRECTION.NONE,
            parameter: sX,
          };
          deduction = deduction + _result1.deduction;
          _result2 = this._resolve(
            _vertical,
            _LINE_DIRECTION.VERTICAL,
            enablePassNode
          );
          // console.log("_result2", _result2);
          if (_result2.isOk) {
            // 垂直线也可以连接，则生成线段
            deduction = deduction + _result2.deduction;
            lines = this._createLLines(_horizon, _vertical, taskInfo);
          }
        }
        if (lines.length > 0) {
          links.push({
            type: _LINK_TYPE.L3,
            deduction: deduction,
            direction: direction,
            lines: lines,
            passNodes: _result1.passNodes.concat(_result2.passNodes),
            intersection: _result1.intersection.concat(_result2.intersection),
          });
        }
        // console.log("---links:", links);
      } else if (sY > eY) {
        // 后节点在前节点的上方
        // -----------------    6，┘  ----------------------
        // 水平线
        _horizon = {
          start: sX,
          end: eX,
          arrow: _DIRECTION.NONE,
          parameter: sY,
        };
        _result1 = this._resolve(_horizon, _LINE_DIRECTION.HORIZON, false);
        if (_result1.isOk) {
          // 如果水平线可以连接，则判断垂直线
          // 垂直线
          _vertical = {
            start: eY,
            end: sY,
            arrow: _DIRECTION.UP,
            parameter: eX,
          };
          deduction = deduction + _result1.deduction;
          _result2 = this._resolve(
            _vertical,
            _LINE_DIRECTION.VERTICAL,
            enablePassNode
          );
          if (_result2.isOk) {
            // 垂直线也可以连接，则生成线段
            lines = this._createLLines(_horizon, _vertical, taskInfo);
            deduction = deduction + _result2.deduction;
          }
        }

        if (lines.length > 0) {
          links.push({
            type: _LINK_TYPE.L4,
            deduction: deduction,
            direction: direction,
            lines: lines,
            passNodes: _result1.passNodes.concat(_result2.passNodes),
            intersection: _result1.intersection.concat(_result2.intersection),
          });
        }
        // -----------------    3，┌  ----------------------
        lines = [];
        deduction = 0;
        // 水平线
        _horizon = {
          start: sX,
          end: eX,
          arrow: _DIRECTION.RIGHT,
          parameter: eY,
        };
        _result1 = this._resolve(_horizon, _LINE_DIRECTION.HORIZON, false);
        if (_result1.isOk) {
          // 如果水平线可以连接，则判断垂直线
          // 垂直线
          _vertical = {
            start: eY,
            end: sY,
            arrow: _DIRECTION.NONE,
            parameter: sX,
          };
          deduction = deduction + _result1.deduction;
          _result2 = this._resolve(
            _vertical,
            _LINE_DIRECTION.VERTICAL,
            enablePassNode
          );
          if (_result2.isOk) {
            // 垂直线也可以连接，则生成线段
            lines = this._createLLines(_horizon, _vertical, taskInfo);
            deduction = deduction + _result2.deduction;
          }
        }
        if (lines.length > 0) {
          links.push({
            type: _LINK_TYPE.L1,
            deduction: deduction,
            direction: direction,
            lines: lines,
            passNodes: _result1.passNodes.concat(_result2.passNodes),
            intersection: _result1.intersection.concat(_result2.intersection),
          });
        }
        // console.log("links:", links);
      }
    } else if (sX > eX) {
      // 后节点在前方              向前
      direction = _DIRECTION.LEFT;
      if (sY < eY) {
        // 后节点在前节点的下方
        // -----------------    6，┘  ----------------------
        _horizon = {
          start: eX,
          end: sX,
          arrow: _DIRECTION.LEFT,
          parameter: eY,
        };
        _result1 = this._resolve(_horizon, _LINE_DIRECTION.HORIZON, false);
        if (_result1.isOk) {
          // 如果水平线可以连接，则判断垂直线
          // 垂直线
          _vertical = {
            start: sY,
            end: eY,
            arrow: _DIRECTION.NONE,
            parameter: sX,
          };
          deduction = deduction + _result1.deduction;
          _result2 = this._resolve(
            _vertical,
            _LINE_DIRECTION.VERTICAL,
            enablePassNode
          );
          if (_result2.isOk) {
            // 垂直线也可以连接，则生成线段
            lines = this._createLLines(_horizon, _vertical, taskInfo);
            deduction = deduction + _result2.deduction;
          }
        }

        if (lines.length > 0) {
          links.push({
            type: _LINK_TYPE.L4,
            deduction: deduction,
            direction: direction,
            lines: lines,
            passNodes: _result1.passNodes.concat(_result2.passNodes),
            intersection: _result1.intersection.concat(_result2.intersection),
          });
        }
        // -----------------    3，┌ ----------------------
        lines = [];
        deduction = 0;
        // 水平线
        _horizon = {
          start: eX,
          end: sX,
          arrow: _DIRECTION.RIGHT,
          parameter: eY,
        };
        _result1 = this._resolve(_horizon, _LINE_DIRECTION.HORIZON, false);
        if (_result1.isOk) {
          // 如果水平线可以连接，则判断垂直线
          // 垂直线
          _vertical = {
            start: sY,
            end: eY,
            arrow: _DIRECTION.NONE,
            parameter: eX,
          };
          deduction = deduction + _result1.deduction;
          _result2 = this._resolve(
            _vertical,
            _LINE_DIRECTION.VERTICAL,
            enablePassNode
          );
          if (_result2.isOk) {
            // 垂直线也可以连接，则生成线段
            lines = this._createLLines(_horizon, _vertical, taskInfo);
            deduction = deduction + _result2.deduction;
          }
        }

        if (lines.length > 0) {
          links.push({
            type: _LINK_TYPE.L1,
            deduction: deduction,
            direction: direction,
            lines: lines,
            passNodes: _result1.passNodes.concat(_result2.passNodes),
            intersection: _result1.intersection.concat(_result2.intersection),
          });
        }
        // console.log("links:", links);
      } else if (sY > eY) {
        // 后节点在前节点的上方
        // -----------------    4，┐  ----------------------
        // 水平线
        _horizon = {
          start: eX,
          end: sX,
          arrow: _DIRECTION.LEFT,
          parameter: eY,
        };
        _result1 = this._resolve(_horizon, _LINE_DIRECTION.HORIZON, false);
        if (_result1.isOk) {
          // 如果水平线可以连接，则判断垂直线
          // 垂直线
          _vertical = {
            start: eY,
            end: sY,
            arrow: _DIRECTION.NONE,
            parameter: sX,
          };
          deduction = deduction + _result1.deduction;
          _result2 = this._resolve(
            _vertical,
            _LINE_DIRECTION.VERTICAL,
            enablePassNode
          );
          if (_result2.isOk) {
            // 垂直线也可以连接，则生成线段
            lines = this._createLLines(_horizon, _vertical, taskInfo);
            deduction = deduction + _result2.deduction;
          }
        }

        if (lines.length > 0) {
          links.push({
            type: _LINK_TYPE.L2,
            deduction: deduction,
            direction: direction,
            lines: lines,
            passNodes: _result1.passNodes.concat(_result2.passNodes),
            intersection: _result1.intersection.concat(_result2.intersection),
          });
        }
        // -----------------    5，└  ----------------------
        lines = [];
        deduction = 0;
        // 水平线
        _horizon = {
          start: eX,
          end: sX,
          arrow: _DIRECTION.NONE,
          parameter: sY,
        };
        _result1 = this._resolve(_horizon, _LINE_DIRECTION.HORIZON, false);
        if (_result1.isOk) {
          // 如果水平线可以连接，则判断垂直线
          // 垂直线
          _vertical = {
            start: eY,
            end: sY,
            arrow: _DIRECTION.UP,
            parameter: eX,
          };
          deduction = deduction + _result1.deduction;
          _result2 = this._resolve(
            _vertical,
            _LINE_DIRECTION.VERTICAL,
            enablePassNode
          );
          if (_result2.isOk) {
            // 垂直线也可以连接，则生成线段
            lines = this._createLLines(_horizon, _vertical, taskInfo);
            deduction = deduction + _result2.deduction;
          }
        }
        if (lines.length > 0) {
          links.push({
            type: _LINK_TYPE.L3,
            deduction: deduction,
            direction: direction,
            lines: lines,
            passNodes: _result1.passNodes.concat(_result2.passNodes),
            intersection: _result1.intersection.concat(_result2.intersection),
          });
        }
      }
    }
    // console.log("L-links", links);
    return links;
  }
  // 创建L型连线的线段
  _createLLines(hData, vDate, taskInfo) {
    let hLines = this._createHorizonLines(
      hData.start,
      hData.end,
      hData.parameter,
      hData.arrow,
      taskInfo
    );
    let vLines = this._createVerticalLines(
      vDate.start,
      vDate.end,
      vDate.parameter,
      vDate.arrow,
      taskInfo,
      vDate
    );
    let _lines = hLines.concat(vLines);
    return _lines;
  }

  // 创建S型链接
  _createSLink(startCode, endCode, enablePassNode) {
    let startLocation = this.nodes[startCode];
    let endLocation = this.nodes[endCode];
    if (startLocation && endLocation) {
      let sX = startLocation.x;
      let eX = endLocation.x;

      let taskInfo = this.aoan.edgesMap[startCode + "-" + endCode];
      let rawTaskInfo = taskInfo.option;
      let label = "";
      let isCritical = taskInfo.isCritical;
      let isDummy = taskInfo.isDummy;
      if (!isDummy) {
        // 实工作
        label = rawTaskInfo.text ? rawTaskInfo.text : "";
      }
      let lineLen = Number(eX) - Number(sX);
      let duration = taskInfo.duration || 0;
      let durationDay = Number(duration / 24).toFixed(4);
      let free = rawTaskInfo ? rawTaskInfo.free_float : 0;

      // console.log("startLocation, endLocation", startLocation, endLocation);
      /* @describe    线型
       *  7，  ┌┘
       *  8，  └┐
       * ***************************************************************/

      if (
        taskInfo.link === null &&
        startLocation.x !== endLocation.x &&
        startLocation.y !== endLocation.y
      ) {
        let links = this._checkSLink(
          startLocation,
          endLocation,
          taskInfo,
          enablePassNode
        );
        // 找到交叉点较少的结果
        if (links.length > 0) {
          if (links.length > 1) {
            links = links.sort((a, b) => {
              return a.intersection.length - b.intersection.length;
            });
            // 如果交叉数相同，则找扣分较少的
            if (links[0].intersection.length === links[1].intersection.length) {
              let temp = links[0].intersection.length;
              for (let i = 0; i < links.length; i++) {
                if (temp !== links[i].intersection.length) {
                  links.splice(i, 1);
                }
              }
              links = links.sort((a, b) => {
                return a.deduction - b.deduction;
              });
            }
          }
          let _link = links[0];
          let option = {
            label: label,
            critical: isCritical,
            dummy: isDummy,
            length: lineLen,
            duration: duration,
            direction: _link.direction,
            free: free,
          };
          let link = new Link(option, _link.type, _link, startCode, endCode);
          this.aoan.edgesMap[startCode + "-" + endCode].link = link;
          this._registerLink(link);
        }
      }
    } else {
      console.log("ERROR:S型线缺少节点");
    }
  }
  // 检查S型连线
  _checkSLink(startLocation, endLocation, taskInfo, enablePassNode) {
    let sX = startLocation.x;
    let eX = endLocation.x;
    let sY = startLocation.y;
    let eY = endLocation.y;

    // let lineLen = Number(eX) - Number(sX);
    // let type = taskInfo.type;
    // let label = "";
    // let duration = taskInfo.duration;

    let direction = _DIRECTION.NONE;

    // console.log("startLocation, endLocation", startLocation, endLocation);
    /* @describe    线型
     *  7，  ┌┘
     *  8，  └┐
     * ***************************************************************/

    let links = [];

    let searchPlan = [];
    if (sX < eX) {
      // 后节点在后方              向后
      direction = _DIRECTION.RIGHT;
      if (sY < eY) {
        // 后下
        // -----------------    8，  └┐  ----------------------
        for (let i = sY + 1; i < eY; i++) {
          searchPlan.push({
            linkType: _LINK_TYPE.S2,
            lines: {
              // 垂直线1
              line1: {
                type: _LINE_DIRECTION.VERTICAL,
                line: {
                  start: sY,
                  end: i,
                  arrow: _DIRECTION.NONE,
                  parameter: sX,
                },
              },
              // 垂直线2
              line2: {
                type: _LINE_DIRECTION.VERTICAL,
                line: {
                  start: i,
                  end: eY,
                  arrow: _DIRECTION.DOWN,
                  parameter: eX,
                },
              },
              // 水平线
              line3: {
                type: _LINE_DIRECTION.HORIZON,
                line: {
                  start: sX,
                  end: eX,
                  arrow: _DIRECTION.NONE,
                  parameter: i,
                },
              },
            },
          });
        }
      } else if (sY > eY) {
        // 后上
        // -----------------    7，  ┌┘  ----------------------
        for (let i = eY + 1; i < sY; i++) {
          searchPlan.push({
            linkType: _LINK_TYPE.S1,
            lines: {
              // 垂直线1
              line1: {
                type: _LINE_DIRECTION.VERTICAL,
                line: {
                  start: i,
                  end: sY,
                  arrow: _DIRECTION.NONE,
                  parameter: sX,
                },
              },
              // 垂直线2
              line2: {
                type: _LINE_DIRECTION.VERTICAL,
                line: {
                  start: eY,
                  end: i,
                  arrow: _DIRECTION.UP,
                  parameter: eX,
                },
              },
              // 水平线
              line3: {
                type: _LINE_DIRECTION.HORIZON,
                line: {
                  start: sX,
                  end: eX,
                  arrow: _DIRECTION.NONE,
                  parameter: i,
                },
              },
            },
          });
        }
      }
    } else if (sX > eX) {
      // 后节点在前方              向前
      direction = _DIRECTION.LEFT;
      if (sY < eY) {
        // 前下
        // -----------------    7，  ┌┘  ----------------------
        for (let i = sY + 1; i < eY; i++) {
          searchPlan.push({
            linkType: _LINK_TYPE.S1,
            lines: {
              // 垂直线1
              line1: {
                type: _LINE_DIRECTION.VERTICAL,
                line: {
                  start: i,
                  end: eY,
                  arrow: _DIRECTION.DOWN,
                  parameter: eX,
                },
              },
              // 垂直线2
              line2: {
                type: _LINE_DIRECTION.VERTICAL,
                line: {
                  start: sY,
                  end: i,
                  arrow: _DIRECTION.NONE,
                  parameter: sX,
                },
              },
              // 水平线
              line3: {
                type: _LINE_DIRECTION.HORIZON,
                line: {
                  start: sX,
                  end: eX,
                  arrow: _DIRECTION.NONE,
                  parameter: i,
                },
              },
            },
          });
        }
      } else if (sY > eY) {
        // 前上
        // -----------------    8，  └┐  ----------------------
        for (let i = eY + 1; i < sY; i++) {
          searchPlan.push({
            linkType: _LINK_TYPE.S2,
            lines: {
              // 垂直线1
              line1: {
                type: _LINE_DIRECTION.VERTICAL,
                line: {
                  start: eY,
                  end: i,
                  arrow: _DIRECTION.UP,
                  parameter: eX,
                },
              },
              // 垂直线2
              line2: {
                type: _LINE_DIRECTION.VERTICAL,
                line: {
                  start: i,
                  end: sY,
                  arrow: _DIRECTION.NONE,
                  parameter: sX,
                },
              },
              // 水平线
              line3: {
                type: _LINE_DIRECTION.HORIZON,
                line: {
                  start: sX,
                  end: eX,
                  arrow: _DIRECTION.NONE,
                  parameter: i,
                },
              },
            },
          });
        }
      }
    }
    if (searchPlan.length > 0) {
      links = this._findBlankS(searchPlan, taskInfo, direction, enablePassNode);
    }

    return links;
  }
  // 在两个坐标范围内找到可以┌┘连接的空白位置
  _findBlankS(searchPlan, taskInfo, direction, enablePassNode) {
    let _line1 = {};
    let _line2 = {};
    let _line3 = {};
    let _result1 = null;
    let _result2 = null;
    let _result3 = null;
    let deduction = 0;
    let hLineData = [];
    let vLineData = [];
    let links = [];
    for (let i = 0; i < searchPlan.length; i++) {
      let lines = searchPlan[i].lines;
      let linkType = searchPlan[i].linkType;
      // console.log(lines);
      hLineData = [];
      vLineData = [];
      // 垂直线1
      _line1 = lines.line1;
      // ��直线2
      _line2 = lines.line2;
      // 水平线
      _line3 = lines.line3;
      // 生成方案
      // console.log("1", _line1, "_2", _line2, "_3", _line3);
      // 垂直线1
      _result1 = this._resolve(_line1.line, _line1.type, enablePassNode);
      if (_result1.isOk) {
        // 如果垂直线1可以连接，则判断垂直线2
        deduction = deduction + _result1.deduction;
        // 垂直线2
        _result2 = this._resolve(_line2.line, _line2.type, enablePassNode);
        if (_result2.isOk) {
          // 如果垂直线2可以连接，则判断水平线
          deduction = deduction + _result2.deduction;
          // 水平线
          _result3 = this._resolve(_line3.line, _line3.type, false);
          if (_result3.isOk) {
            // 如果垂直线2可以连接，则判断水平线
            deduction = deduction + _result3.deduction;
            vLineData.push(_line1);
            vLineData.push(_line2);
            hLineData.push(_line3);
            lines = this._createIrregularLines(hLineData, vLineData, taskInfo);
            if (lines.length > 0) {
              links.push({
                type: linkType,
                lines: lines,
                direction: direction,
                deduction: deduction,
                passNodes: _result1.passNodes
                  .concat(_result2.passNodes)
                  .concat(_result3.passNodes),
                intersection: _result1.intersection
                  .concat(_result2.intersection)
                  .concat(_result3.intersection),
              });
            }
          }
        }
      }
    }
    return links;
  }

  // 创建U型链接
  _createULink(startCode, endCode) {
    let startLocation = this.nodes[startCode];
    let endLocation = this.nodes[endCode];
    if (startLocation && endLocation) {
      let sX = startLocation.x;
      let eX = endLocation.x;

      let taskInfo = this.aoan.edgesMap[startCode + "-" + endCode];
      let rawTaskInfo = taskInfo.option;
      let label = "";
      let isCritical = taskInfo.isCritical;
      let isDummy = taskInfo.isDummy;
      if (!isDummy) {
        // 实工作
        label = rawTaskInfo.text ? rawTaskInfo.text : "";
      }
      let links = this._checkULink(startLocation, endLocation, taskInfo, false);
      let lineLen = Number(eX) - Number(sX);
      let free = rawTaskInfo ? rawTaskInfo.free_float : 0;
      let duration = taskInfo.duration || 0;
      let durationDay = Number(duration / 24).toFixed(4);

      // let free = Number(lineLen) - Number(duration);
      // let free = (Number(lineLen) - Number(durationDay)).toFixed(4);
      // let startTime = new Date(taskInfo.option.earliest_end_time).getTime();
      // let endTime = new Date(taskInfo.option.latest_end_time).getTime();
      // let days = (endTime - startTime) / (1000 * 24 * 3600);
      // let free = Math.floor(days);

      // 找到交叉点较少的结果
      if (links.length > 0) {
        if (links.length > 1) {
          // console.log("linkslinkslinks", links);
          links = links.sort((a, b) => {
            return a.intersection.length - b.intersection.length;
          });
          // 如果交叉数相同，则找扣分较少的
          if (links[0].intersection.length === links[1].intersection.length) {
            let temp = links[0].intersection.length;
            for (let i = 0; i < links.length; i++) {
              if (temp !== links[i].intersection.length) {
                links.splice(i, 1);
              }
            }
            // console.log("links", links);
            links = links.sort((a, b) => {
              return a.sort - b.sort;
            });
          }
        }
        let _link = links[0];
        let option = {
          label: label,
          critical: isCritical,
          dummy: isDummy,
          length: lineLen,
          duration: duration,
          direction: _link.direction,
          turnRank: _link.turnRank,
          free: free,
        };
        let link = new Link(option, _link.type, _link, startCode, endCode);
        if (link.option.turnRank) {
          if (link.option.turnRank < this.option.rank.min) {
            this.option.rank.min = _link.turnRank;
            this.rankIncrement = _link.turnRank * -1;
          }
          if (link.option.turnRank > this.option.rank.max) {
            this.option.rank.max = link.option.turnRank;
          }
        }
        this.aoan.edgesMap[startCode + "-" + endCode].link = link;
        this._registerLink(link);
      }
    } else {
      console.log("ERROR:U型线缺少节点");
    }
  }
  // 检查U型连线
  _checkULink(startLocation, endLocation, taskInfo, enablePassNode) {
    let rank = this.option.rank;
    let sX = startLocation.x;
    let eX = endLocation.x;
    let sY = startLocation.y;
    let eY = endLocation.y;
    let min = rank.min;
    let max = rank.max;
    let _horizon = {};
    let _vertical = {};

    let links = [];
    if (sX < eX) {
      // 后节点在后方              向后
      _horizon = {
        start: sX,
        end: eX,
      };
      _vertical = {
        start: sY,
        end: eY,
      };
      // -----------------   9, ┌┐  ----------------------
      links = this._findBlankU(
        _horizon,
        _vertical,
        _DIRECTION.RIGHT,
        _LINK_TYPE.U1,
        taskInfo,
        min,
        max,
        enablePassNode
      );
      // -----------------   10,└┘  ----------------------
      let _links = this._findBlankU(
        _horizon,
        _vertical,
        _DIRECTION.RIGHT,
        _LINK_TYPE.U2,
        taskInfo,
        min,
        max,
        enablePassNode
      );
      if (_links.length > 0) {
        links = links.concat(_links);
      }
    } else if (sX > eX) {
      // 后节点在前方              向前
      _horizon = {
        start: eX,
        end: sX,
      };
      _vertical = {
        start: sY,
        end: eY,
      };
      // -----------------   10,└┘  ----------------------
      links = this._findBlankU(
        _horizon,
        _vertical,
        _DIRECTION.LEFT,
        _LINK_TYPE.U2,
        taskInfo,
        min,
        max,
        enablePassNode
      );
      // -----------------   9, ┌┐  ----------------------
      let _links = this._findBlankU(
        _horizon,
        _vertical,
        _DIRECTION.LEFT,
        _LINK_TYPE.U1,
        taskInfo,
        min,
        max,
        enablePassNode
      );
      if (_links.length > 0) {
        links = links.concat(_links);
      }
    }
    return links;
  }
  // 在两个坐标范围内找到可以U连接的空白位置
  _findBlankU(
    horizon,
    vertical,
    direction,
    linkType,
    taskInfo,
    min,
    max,
    enablePassNode
  ) {
    let hStart = Number(horizon.start);
    let hEnd = Number(horizon.end);
    let vStart = Number(vertical.start);
    let vEnd = Number(vertical.end);

    let _line1 = {};
    let _line2 = {};
    let _line3 = {};

    let hLineData = [];
    let vLineData = [];
    let lines = [];
    let links = [];
    let _result1 = null;
    let _result2 = null;
    let _result3 = null;
    let deduction = 0;

    let isDummy = taskInfo.isDummy;
    let isCritical = taskInfo.isCritical;
    for (let i = min - 1; i <= max + 1; i++) {
      // console.log(i, linkType, "vStart:", vStart, "vEnd:", vEnd, "hStart:", hStart, "hEnd:", hEnd);
      if (i !== vStart && i !== vEnd) {
        hLineData = [];
        vLineData = [];
        if (linkType === _LINK_TYPE.U1 && i < vStart && i < vEnd) {
          // 垂直线1
          _line1 = {
            type: _LINE_DIRECTION.VERTICAL,
            line: {
              start: i,
              end: vStart,
              arrow: _DIRECTION.NONE,
              parameter: hStart,
            },
          };
          // 垂直线2
          _line2 = {
            type: _LINE_DIRECTION.VERTICAL,
            line: {
              start: i,
              end: vEnd,
              arrow: _DIRECTION.NONE,
              parameter: hEnd,
            },
          };
          // 水平线
          _line3 = {
            type: _LINE_DIRECTION.HORIZON,
            line: {
              start: hStart,
              end: hEnd,
              arrow: _DIRECTION.NONE,
              parameter: i,
            },
          };
          // 确定箭头
          switch (linkType) {
            case _LINK_TYPE.U1: // 9, ┌┐
              switch (direction) {
                case _DIRECTION.RIGHT:
                  _line2.line.arrow = _DIRECTION.DOWN;
                  break;
                case _DIRECTION.LEFT:
                  _line1.line.arrow = _DIRECTION.UP;
                  break;
              }
              break;
            case _LINK_TYPE.U2: // 10,└┘
              switch (direction) {
                case _DIRECTION.RIGHT:
                  _line2.line.arrow = _DIRECTION.DOWN;
                  break;
                case _DIRECTION.LEFT:
                  _line1.line.arrow = _DIRECTION.UP;
                  break;
              }
              break;
          }
          // 生成方案
          // 垂直线1
          _result1 = this._resolve(_line1.line, _line1.type, enablePassNode);
          // console.log("_result1", _result1);
          if (_result1.isOk) {
            // 如果垂直线1可以连接，则判断垂直线2
            deduction = deduction + _result1.deduction;
            // 垂直线2
            _result2 = this._resolve(_line2.line, _line2.type, enablePassNode);
            if (_result2.isOk) {
              // 如果垂直线2可以连接，则判断水平线
              deduction = deduction + _result2.deduction;
              // 水平线
              _result3 = this._resolve(_line3.line, _line3.type, false);
              if (_result3.isOk) {
                // 如果垂直线2可以连接，则判断水平线
                vLineData.push(_line1);
                vLineData.push(_line2);
                hLineData.push(_line3);
                deduction = deduction + _result3.deduction;
                lines = this._createIrregularLines(
                  hLineData,
                  vLineData,
                  taskInfo
                );
                if (lines.length > 0) {
                  links.push({
                    type: linkType,
                    turnRank: i,
                    y: { vStart: vStart, vEnd: vEnd },
                    sort: Math.abs(vStart - i) + Math.abs(vEnd - i),
                    direction: direction,
                    deduction: deduction,
                    lines: lines,
                    passNodes: _result1.passNodes
                      .concat(_result2.passNodes)
                      .concat(_result3.passNodes),
                    intersection: _result1.intersection
                      .concat(_result2.intersection)
                      .concat(_result3.intersection),
                  });
                }
              }
            }
          }
        } else if (linkType === _LINK_TYPE.U2 && i > vStart && i > vEnd) {
          // 垂直线1
          _line1 = {
            type: _LINE_DIRECTION.VERTICAL,
            line: {
              start: vStart,
              end: i,
              arrow: _DIRECTION.NONE,
              parameter: hStart,
            },
          };
          // 垂直线2
          _line2 = {
            type: _LINE_DIRECTION.VERTICAL,
            line: {
              start: vEnd,
              end: i,
              arrow: _DIRECTION.NONE,
              parameter: hEnd,
            },
          };
          // 水平线
          _line3 = {
            type: _LINE_DIRECTION.HORIZON,
            line: {
              start: hStart,
              end: hEnd,
              arrow: _DIRECTION.NONE,
              parameter: i,
            },
          };
          // 确定箭头
          switch (linkType) {
            case _LINK_TYPE.U1: // 9, ┌┐
              switch (direction) {
                case _DIRECTION.RIGHT:
                  _line2.line.arrow = _DIRECTION.DOWN;
                  break;
                case _DIRECTION.LEFT:
                  _line1.line.arrow = _DIRECTION.UP;
                  break;
              }
              break;
            case _LINK_TYPE.U2: // 10,└┘
              switch (direction) {
                case _DIRECTION.RIGHT:
                  _line2.line.arrow = _DIRECTION.DOWN;
                  break;
                case _DIRECTION.LEFT:
                  _line1.line.arrow = _DIRECTION.UP;
                  break;
              }
              break;
          }
          // 生成方案
          // console.log(i, "1", _line1, "_2", _line2, "_3", _line3);
          // 垂直线1
          _result1 = this._resolve(_line1.line, _line1.type, enablePassNode);
          // console.log("------------_result1", _result1);
          if (_result1.isOk) {
            // 如果垂直线1可以连接，则判断垂直线2
            deduction = deduction + _result1.deduction;
            // 垂直线2
            _result2 = this._resolve(_line2.line, _line2.type, enablePassNode);
            // console.log("------------_result2", _result2);
            if (_result2.isOk) {
              // 如果垂直线2可以连接，则判断水平线
              deduction = deduction + _result2.deduction;
              // 水平线
              _result3 = this._resolve(_line3.line, _line3.type, false);
              if (_result3.isOk) {
                // 如果垂直线2可以连接，则判断水平线
                // console.log("------------_result3", _result3);
                vLineData.push(_line1);
                vLineData.push(_line2);
                hLineData.push(_line3);
                deduction = deduction + _result3.deduction;
                lines = this._createIrregularLines(
                  hLineData,
                  vLineData,
                  taskInfo
                );
                if (lines.length > 0) {
                  links.push({
                    type: linkType,
                    turnRank: i,
                    y: { vStart: vStart, vEnd: vEnd },
                    sort: Math.abs(vStart - i) + Math.abs(vEnd - i),
                    lines: lines,
                    deduction: deduction,
                    direction: direction,
                    passNodes: _result1.passNodes
                      .concat(_result2.passNodes)
                      .concat(_result3.passNodes),
                    intersection: _result1.intersection
                      .concat(_result2.intersection)
                      .concat(_result3.intersection),
                  });
                }
              }
            }
          }
        }
      }
    }
    // console.log("-----links", links);
    return links;
  }

  // 创建垂直连接
  _createVerticalLink(startCode, endCode, enablePassNode) {
    let startLocation = this.nodes[startCode];
    let endLocation = this.nodes[endCode];
    if (startLocation && endLocation) {
      let sX = startLocation.x;
      let eX = endLocation.x;
      let sY = startLocation.y;
      let eY = endLocation.y;

      let taskInfo = this.aoan.edgesMap[startCode + "-" + endCode];
      let taskType = taskInfo.taskType;
      let rawTaskInfo = taskInfo.option;
      let type = 2;
      let lines = [];
      let label = "";
      let isCritical = taskInfo.isCritical;
      let isDummy = taskInfo.isDummy;
      let direction = _DIRECTION.NONE;
      let lineLen = Number(eY) - Number(sY);
      let free = rawTaskInfo ? rawTaskInfo.free_float : 0; // 自由时差 - 小时
      let freeDay = Number(free / 24).toFixed(4);
      let duration = taskInfo.duration || 0;
      let durationDay = Number(duration / 24).toFixed(4);

      if (!isDummy) {
        // 实工作
        label = rawTaskInfo.text ? rawTaskInfo.text : "";
      }
      let deduction = 0;
      let intersections = [];
      let passNodes = [];

      if (sX === eX) {
        // 相同时标
        // 判断在同时标是否连续节点
        let isContinuousNodesOnTime = this._isContinuousNodes(
          startCode,
          endCode,
          _LINE_DIRECTION.VERTICAL,
          sX
        );
        // console.log("isContinuousNodesOnTime", isContinuousNodesOnTime);
        if (isContinuousNodesOnTime) {
          let _result = null;
          if (sY < eY) {
            // 后节点在前节点的下方      向下        2，│↓
            // 垂直线
            type = _LINK_TYPE.VERTICAL;
            direction = _DIRECTION.DOWN;
            let _vertical = {
              start: sY,
              end: eY,
              arrow: direction,
              parameter: sX,
            };
            _result = this._resolve(_vertical, type, enablePassNode);
            // console.log("_result", _result);
            if (_result.isOk) {
              // 垂直线也可以连接，则生成线段
              lines = this._createVerticalLines(
                sY,
                eY,
                sX,
                direction,
                taskInfo,
                _result
              );
              deduction = deduction + _result.deduction;
              intersections = _result.intersection;
              passNodes = _result.passNodes;
            }
          } else if (sY > eY) {
            // 后节点在前节点的上方      向上        2，│↑│
            type = _LINK_TYPE.VERTICAL;
            direction = _DIRECTION.UP;
            let _vertical = {
              start: eY,
              end: sY,
              arrow: direction,
              parameter: sX,
            };
            _result = this._resolve(_vertical, type, enablePassNode);
            // console.log("_result1", _result);
            if (_result.isOk) {
              // 垂直线也可以连接，则生成线段
              lines = this._createVerticalLines(
                eY,
                sY,
                sX,
                direction,
                taskInfo,
                _result
              );
              deduction = deduction + _result.deduction;
              intersections = _result.intersection;
              passNodes = _result.passNodes;
            }
          }
        } else {
          let _result = null;
          if (sY < eY) {
            // 后节点在前节点的下方      向下        2，│
            // 垂直线
            type = _LINK_TYPE.VERTICAL;
            direction = _DIRECTION.DOWN;
            let _vertical = {
              start: sY,
              end: eY,
              arrow: direction,
              parameter: sX,
            };
            _result = this._resolve(_vertical, type, enablePassNode);
            // console.log("_result", _result);
            if (_result.isOk) {
              // 垂直线也可以连接，则生成线段
              lines = this._createVerticalLines(
                sY,
                eY,
                sX,
                direction,
                taskInfo,
                _result
              );
              deduction = deduction + _result.deduction;
              intersections = _result.intersection;
              passNodes = _result.passNodes;
            }
          } else if (sY > eY) {
            // 后节点在前节点的上方      向上        2，│
            type = _LINK_TYPE.VERTICAL;
            direction = _DIRECTION.UP;
            let _vertical = {
              start: eY,
              end: sY,
              arrow: direction,
              parameter: sX,
            };
            _result = this._resolve(_vertical, type, enablePassNode);
            // console.log("_result1", _result);
            if (_result.isOk) {
              // 垂直线也可以连接，则生成线段
              lines = this._createVerticalLines(
                eY,
                sY,
                sX,
                direction,
                taskInfo,
                _result
              );
              deduction = deduction + _result.deduction;
              intersections = _result.intersection;
              passNodes = _result.passNodes;
            }
          }
        }
      }

      if (lines.length > 0) {
        let option = {
          label: label,
          critical: isCritical,
          dummy: isDummy,
          length: lineLen,
          duration: duration,
          durationDay: durationDay,
          direction: direction,
          free: free,
          freeDay: freeDay,
        };

        let link = new Link(option, type, { lines: lines }, startCode, endCode);
        link.setIntersections(intersections);
        link.setPassNodes(passNodes);
        this.aoan.edgesMap[startCode + "-" + endCode].link = link;
        this._registerLink(link);
      }
    } else {
      console.log("ERROR:垂直线缺少节点");
    }
  }
  // 创建垂直线段
  _createVerticalLines(sY, eY, x, arrow, taskInfo, vDate) {
    let lines = [];
    let label = "";
    let taskType = taskInfo.taskType;
    let rawTaskInfo = taskInfo.option;
    let isDummy = taskInfo.isDummy;
    let lineShape = _LINE_SHAPE.WAVE;

    if (!isDummy) {
      // 实工作
      label = rawTaskInfo.text ? rawTaskInfo.text : "";
    }
    switch (taskType) {
      case 1: // 1 - 实工作 - 实线
        lineShape = _LINE_SHAPE.SOLID;
        break;
      case 2: // 2 - 虚工作 - 虚线
        lineShape = _LINE_SHAPE.DOTTED;
        break;
      case 3: // 3 - 挂起工作 - 虚线(暂定)
        lineShape = _LINE_SHAPE.DOTTED;
        break;
      case 4: // 4 - 避免重复 - 虚线(暂定)
        lineShape = _LINE_SHAPE.DOTTED;
        break;
      case 5: // 5 - 延时 - 虚线(暂定)
        lineShape = _LINE_SHAPE.DOTTED;
        break;
      case 6: // 6 - 搭接关系 - 虚线(暂定)
        lineShape = _LINE_SHAPE.DOTTED;
        break;
      default:
        // 自由时差 - 波浪线
        lineShape = _LINE_SHAPE.WAVE;
    }

    lines.push({
      arrow: arrow,
      shape: lineShape,
      direction: _LINE_DIRECTION.VERTICAL,
      length: 0,
      start: {
        x: x,
        y: sY,
        xOffset: 0,
        yOffset: 0,
      },
      end: {
        x: x,
        y: eY,
        xOffset: 0,
        yOffset: 0,
      },
      passNodes: vDate ? (vDate.passNodes ? vDate.passNodes : []) : [],
    });
    return lines;
  }

  // 创建不规则连线的线段
  _createIrregularLines(hData, vDate, taskInfo) {
    let hLines = [];
    for (let i = 0; i < hData.length; i++) {
      let data = hData[i].line;
      hLines = hLines.concat(
        this._createHorizonLines(
          data.start,
          data.end,
          data.parameter,
          data.arrow,
          taskInfo
        )
      );
    }
    let vLines = [];
    for (let i = 0; i < vDate.length; i++) {
      let data = vDate[i].line;
      vLines = vLines.concat(
        this._createVerticalLines(
          data.start,
          data.end,
          data.parameter,
          data.arrow,
          taskInfo,
          data
        )
      );
    }
    return hLines.concat(vLines);
  }
  // 找到合适的连线（允许并行，允许穿点）
  _createBestLink(startCode, endCode) {
    let startLocation = this.nodes[startCode];
    let endLocation = this.nodes[endCode];
    if (startLocation && endLocation) {
      let sX = startLocation.x;
      let eX = endLocation.x;
      let sY = startLocation.y;
      let eY = endLocation.y;

      let taskInfo = this.aoan.edgesMap[startCode + "-" + endCode];
      let rawTaskInfo = taskInfo.option;
      let enablePassNode = true;
      let label = "";
      let isCritical = taskInfo.isCritical;
      let isDummy = taskInfo.isDummy;
      if (!isDummy) {
        // 实工作
        label = rawTaskInfo.text ? rawTaskInfo.text : "";
      }
      let lineLen = Number(eX) - Number(sX);
      let free = rawTaskInfo ? rawTaskInfo.free_float : 0;
      let duration = taskInfo.duration || 0;
      let durationDay = Number(duration / 24).toFixed(4);

      // let free = (Number(lineLen) - Number(durationDay)).toFixed(4);
      // let startTime = new Date(taskInfo.option.earliest_end_time).getTime();
      // let endTime = new Date(taskInfo.option.latest_end_time).getTime();
      // let days = (endTime - startTime) / (1000 * 24 * 3600);
      // let free = Math.floor(days);

      if (sX === eX) {
        // 垂直穿点连线
        this._createVerticalLink(startCode, endCode, true);
      } else {
        // 不垂直，则找其他连接方式
        // U
        let links = [];
        links = links.concat(
          this._checkULink(startLocation, endLocation, taskInfo, enablePassNode)
        );
        // L
        if (sX !== eX && sY !== eY) {
          // 后节点在后方              向后
          links = links.concat(
            this._checkLLink(
              startLocation,
              endLocation,
              taskInfo,
              true,
              enablePassNode
            )
          );
        }
        // S
        if (
          startLocation.x !== endLocation.x &&
          startLocation.y !== endLocation.y
        ) {
          links = links.concat(
            this._checkSLink(
              startLocation,
              endLocation,
              taskInfo,
              enablePassNode
            )
          );
        }
        // 按照穿点较少，交叉较少，线型数值较小，等分较高的优先级，找到合适的连接
        if (links.length > 0) {
          if (links.length > 1) {
            // 优先找到穿点较少的方案
            links = links.sort((a, b) => {
              return a.passNodes.length - b.passNodes.length;
            });
            // 如果穿点相同
            if (links[0].passNodes.length === links[1].passNodes.length) {
              let temp = links[0].passNodes.length;
              for (let i = 0; i < links.length; i++) {
                if (temp !== links[i].passNodes.length) {
                  links.splice(i, 1);
                }
              }
              // 如果穿点相同，则找交叉较少的方案
              if (links.length > 1) {
                links = links.sort((a, b) => {
                  return a.intersection.length - b.intersection.length;
                });
                // 如果交叉相同
                if (
                  links[0].intersection.length === links[1].intersection.length
                ) {
                  let temp = links[0].intersection.length;
                  for (let i = 0; i < links.length; i++) {
                    if (temp !== links[i].intersection.length) {
                      links.splice(i, 1);
                    }
                  }
                  // 如果交叉相同，则找线型较小的方案
                  if (links.length > 1) {
                    links = links.sort((a, b) => {
                      return a.type - b.type;
                    });
                    // 如果线型相同，则找扣分较少的方案
                    if (links[0].type === links[1].type) {
                      let temp = links[0].type;
                      for (let i = 0; i < links.length; i++) {
                        if (temp !== links[i].type) {
                          links.splice(i, 1);
                        }
                      }
                      if (links.length > 1) {
                        links = links.sort((a, b) => {
                          return a.deduction - b.deduction;
                        });
                      }
                    }
                  }
                }
              }
            }
          }

          let _link = links[0];
          let option = {
            label: label,
            critical: isCritical,
            dummy: isDummy,
            length: lineLen,
            duration: duration,
            direction: _link.direction,
            free: free,
          };
          let link = new Link(option, _link.type, _link, startCode, endCode);
          this.aoan.edgesMap[startCode + "-" + endCode].link = link;
          this._registerLink(link, true);
        }
      }
    } else {
      console.log("ERROR:合适的连线缺少节点");
    }
  }

  // 检查线段重合
  _resolve(line, type, enablePassNode) {
    let scanResult = this._scanLinkedLine(line, type);
    // console.log(scanResult);
    let isOk = true;
    let passNodes = scanResult.passNodes;
    let intersection = scanResult.intersection;
    let deduction = intersection.length * 5;
    let result = {
      isOk: isOk,
      deduction: deduction,
    };
    if (!enablePassNode && passNodes.length > 0) {
      result.isOk = false;
      return result;
    }
    let coincide = scanResult.coincide;
    if (coincide.length > 0) {
      for (let i = 0; i < coincide.length; i++) {
        let level = coincide[i].level;
        let direction = coincide[i].direction;
        if (direction === _LINE_DIRECTION.VERTICAL);
        else {
          // 水平线  不允许重合
          if (level !== 0) {
            result.isOk = false;
            return result;
          }
        }
      }
    }
    // console.log("---deduction", deduction);
    line.deduction = deduction;
    line.intersection = intersection;
    line.passNodes = passNodes;
    result.deduction = deduction;
    result.intersection = intersection;
    result.passNodes = passNodes;
    return result;
  }

  // 将已经连接过的线段注册到记录中
  _registerLink(link) {
    let lines = link.getLines();
    let critical = link.option.critical;
    let dummy = link.option.dummy;
    let linkStart = this.nodes[link.startCode];
    let linkEnd = this.nodes[link.endCode];
    if (lines.length > 0) {
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        line.critical = critical;
        line.dummy = dummy;
        let lineId = this.getLineIndex();
        line.id = lineId;
        let startLocation = line.start;
        let endLocation = line.end;
        let sX = startLocation.x;
        let eX = endLocation.x;
        let sY = startLocation.y;
        let eY = endLocation.y;

        let data = {
          link: link,
          line: line,
          lineId: lineId,
          passNodes: line.passNodes,
          linkDirection: link.option.direction,
        };
        // 将节点的线段分方向注册到连接点记录中
        if (line.direction === _LINE_DIRECTION.VERTICAL) {
          // 垂直线
          let isPassNodes = line.passNodes.length > 0;
          let len = Math.abs(line.start.y - line.end.y);
          data.lineLength = len;
          // 开始节点
          if ((sY > linkStart.y || eY > linkStart.y) && sX === linkStart.x) {
            data.type = "out";
            this.contactPoint[link.startCode].bottom.push(data);
            switch (link.option.direction) {
              case _DIRECTION.LEFT:
                this._registerContactPoint(
                  link.startCode,
                  data,
                  "_bottom",
                  "left"
                );
                break;
              case _DIRECTION.RIGHT:
                this._registerContactPoint(
                  link.startCode,
                  data,
                  "_bottom",
                  "right"
                );
                break;
              case _DIRECTION.UP:
                if (isPassNodes) {
                  this._registerContactPoint(
                    link.startCode,
                    data,
                    "_bottom",
                    "right"
                  );
                } else {
                  this._registerContactPoint(
                    link.startCode,
                    data,
                    "_bottom",
                    "middle"
                  );
                }
                break;
              case _DIRECTION.DOWN:
                if (isPassNodes) {
                  this._registerContactPoint(
                    link.startCode,
                    data,
                    "_bottom",
                    "left"
                  );
                } else {
                  this._registerContactPoint(
                    link.startCode,
                    data,
                    "_bottom",
                    "middle"
                  );
                }
                break;
            }
          }
          if ((sY < linkStart.y || eY < linkStart.y) && sX === linkStart.x) {
            data.type = "out";
            this.contactPoint[link.startCode].top.push(data);
            switch (link.option.direction) {
              case _DIRECTION.LEFT:
                this._registerContactPoint(
                  link.startCode,
                  data,
                  "_top",
                  "left"
                );
                break;
              case _DIRECTION.RIGHT:
                this._registerContactPoint(
                  link.startCode,
                  data,
                  "_top",
                  "right"
                );
                break;
              case _DIRECTION.UP:
                if (isPassNodes) {
                  this._registerContactPoint(
                    link.startCode,
                    data,
                    "_top",
                    "left"
                  );
                } else {
                  this._registerContactPoint(
                    link.startCode,
                    data,
                    "_top",
                    "middle"
                  );
                }
                break;
              case _DIRECTION.DOWN:
                if (isPassNodes) {
                  this._registerContactPoint(
                    link.startCode,
                    data,
                    "_top",
                    "right"
                  );
                } else {
                  this._registerContactPoint(
                    link.startCode,
                    data,
                    "_top",
                    "middle"
                  );
                }
                break;
            }
          }
          // 结束节点
          if ((sY > linkEnd.y || eY > linkEnd.y) && sX === linkEnd.x) {
            data.type = "in";
            this.contactPoint[link.endCode].bottom.push(data);
            switch (link.option.direction) {
              case _DIRECTION.LEFT:
                this._registerContactPoint(
                  link.endCode,
                  data,
                  "_bottom",
                  "right"
                );
                break;
              case _DIRECTION.RIGHT:
                this._registerContactPoint(
                  link.endCode,
                  data,
                  "_bottom",
                  "left"
                );
                break;
              case _DIRECTION.UP:
                if (isPassNodes) {
                  this._registerContactPoint(
                    link.endCode,
                    data,
                    "_bottom",
                    "left"
                  );
                } else {
                  this._registerContactPoint(
                    link.endCode,
                    data,
                    "_bottom",
                    "middle"
                  );
                }
                break;
              case _DIRECTION.DOWN:
                if (isPassNodes) {
                  this._registerContactPoint(
                    link.endCode,
                    data,
                    "_bottom",
                    "right"
                  );
                } else {
                  this._registerContactPoint(
                    link.endCode,
                    data,
                    "_bottom",
                    "middle"
                  );
                }
                break;
            }
          }
          if ((sY < linkEnd.y || eY < linkEnd.y) && sX === linkEnd.x) {
            data.type = "in";
            this.contactPoint[link.endCode].top.push(data);
            switch (link.option.direction) {
              case _DIRECTION.LEFT:
                this._registerContactPoint(link.endCode, data, "_top", "right");
                break;
              case _DIRECTION.RIGHT:
                this._registerContactPoint(link.endCode, data, "_top", "left");
                break;
              case _DIRECTION.UP:
                if (isPassNodes) {
                  this._registerContactPoint(
                    link.endCode,
                    data,
                    "_top",
                    "left"
                  );
                } else {
                  this._registerContactPoint(
                    link.endCode,
                    data,
                    "_top",
                    "middle"
                  );
                }
                break;
              case _DIRECTION.DOWN:
                if (isPassNodes) {
                  this._registerContactPoint(
                    link.endCode,
                    data,
                    "_top",
                    "right"
                  );
                } else {
                  this._registerContactPoint(
                    link.endCode,
                    data,
                    "_top",
                    "middle"
                  );
                }
                break;
            }
          }
        }
        this.linked.lines.push(line);
      }
    }
  }

  /**
   * 判断两点是否连续节点
   * @param {String} startCode     开始节点
   * @param {String} endCode       结束节点
   * @param {Number} type          判断类型  1,判断同层  2,判断  同时标
   * @param {Number} parameter     当type=1时传入要判断的层，当type=1时传入要判断的列
   * @date 2020-07-02              层和时标的两个判断方法有bug，这里合并且重写之
   * @author 杨勇
   */
  // 判断两点是否连续节点
  _isContinuousNodes(startCode, endCode, type, parameter) {
    let nodes = [];
    if (type === _LINE_DIRECTION.HORIZON) {
      // 判断水平方向
      nodes = this.pretreatmentNodesTable.yList[parameter];
    } else if (type === _LINE_DIRECTION.VERTICAL) {
      // 判断垂直方向
      nodes = this.pretreatmentNodesTable.xList[parameter];
    }
    if (nodes.length >= 2) {
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i].node;
        if (node === startCode) {
          if (nodes[i + 1]) {
            if (nodes[i + 1].node === endCode) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  /**
   * 判断两个坐标之间是否有节点
   * @param {Number} start         开始节点
   * @param {String} end           结束节点
   * @param {Number} type          类型  1,层  2,时标
   * @param {Number} parameter     当type=1时传入要判断的层，当type=2时传入要判断的列
   * @date 2020-07-07
   * @date 2020-07-13
   * @author 杨勇
   */
  // 判断两个坐标之间是否有节点
  _hasNode(start, end, type, parameter) {
    let nodes = [];
    let result = {
      hasNode: false,
      nodes: [],
    };
    if (type === _LINE_DIRECTION.HORIZON) {
      // 要判断的是水平线
      nodes = this.pretreatmentNodesTable.yList[parameter];
    } else if (type === _LINE_DIRECTION.VERTICAL) {
      // 要判断的是垂直线
      nodes = this.pretreatmentNodesTable.xList[parameter];
    }
    let temp = 0;

    if (nodes) {
      if (nodes.length > 0) {
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          if (type === 1) {
            // 要判断的是水平线
            temp = node.x;
          } else if (type === 2) {
            // 要判断的是垂直线
            temp = node.y;
          }

          if (temp > start && temp < end) {
            result.hasNode = true;
            result.nodes.push(node);
          }
        }
      }
    }
    return result;
  }

  /**
   * @description  计算一个接触点的偏移
   * @param {JsonArr} links       所有连接
   * @param {Number} direction    方向
   * @param {Number} baseOffset   计算偏移的基数
   */
  // 计算一个接触点的偏移
  _sortOneContactPoint(links, direction, baseOffset) {
    let equalType = [];
    // 遍历数据，合并完全相同的线段，允许重叠
    for (let t = 0; t < links.length; t++) {
      let link = links[t];
      let line = link.line;
      let isPassNodes = link.passNodes.length > 0;
      let len = Math.abs(line.start.y - line.end.y);
      link.len = len;
      let type =
        line.direction +
        "-" +
        line.critical +
        "-" +
        line.dummy +
        "-" +
        line.shape;
      if (isPassNodes) {
        type = type + "-" + link.lineId;
      }
      let finded = false;
      for (let x = 0; x < equalType.length; x++) {
        if (equalType[x].type === type) {
          finded = true;
          if (equalType[x].len < len) {
            equalType[x].len = len;
          }
          equalType[x].links.push(link);
          break;
        }
      }
      if (!finded) {
        equalType.push({
          type: type,
          links: [link],
          direction: direction,
          len: len,
        });
      }
    }
    // 生成排序数组
    let sortArr = [];
    for (let x = 0; x < equalType.length; x++) {
      sortArr.push(equalType[x]);
    }
    // console.log(sortArr);
    // 根据线段长度排序
    sortArr = sortArr.sort((a, b) => {
      return a.len - b.len;
    });
    // 遍历顺序，生成偏移量
    for (let x = 0; x < sortArr.length; x++) {
      // console.log("-----sortArr----->", sortArr);
      let links = sortArr[x].links;
      let offset = 0;
      if (sortArr[x].direction === _DIRECTION.RIGHT) {
        offset = Math.abs(x + baseOffset - sortArr.length + 1);
      } else {
        offset = Math.abs(x + baseOffset - sortArr.length + 1) * -1;
      }
      for (let y = 0; y < links.length; y++) {
        // console.log(offset, "-----offset----->", links);
        this._setLineOffset(links[y].link, links[y].line, offset);
        // TODO: -===-
        // if (offset !== 0) { //  && links[y].type == 'out'
        //     console.log(offset, links[y]);
        //     let _line = JSON.parse(JSON.stringify(links[y].line));
        //     _line = {
        //         start: _line.start.y,
        //         end: _line.end.y,
        //         arrow: links[y].line.arrow,
        //         parameter: _line.start.x + 0.01
        //     };
        //     console.log(sortArr)

        //     let scan = this._scanLinkedLine(_line, _LINE_DIRECTION.VERTICAL);  // HORIZON    VERTICAL
        //     if (scan.intersection.length > 0) {
        //         links[y].link.intersections = links[y].link.intersections.concat(scan.intersection);
        //     }
        // }
      }
    }
  }
  /**
   * @description  创建偏移量
   * @param {Json} contactPointData    一个节点上所有接触点上的数据
   * @date 2020-07-30
   * @author 杨勇
   */
  // 创建偏移量
  _createOffset(contactPointData) {
    // top
    let topRightData = contactPointData._top.right;
    let topLeftData = contactPointData._top.left;
    let topMiddleData = contactPointData._top.middle;

    let topRightBase =
      topLeftData.length > 0 || topMiddleData.length > 0 ? 1 : 0;
    let topLeftBase =
      topRightData.length > 0 || topMiddleData.length > 0 ? 1 : 0;

    if (contactPointData.top.length > 1) {
      // right
      if (topRightData.length > 0) {
        console.log("topRightData", topRightData);
        this._sortOneContactPoint(topRightData, _DIRECTION.RIGHT, topRightBase);
      }
      // left
      if (topLeftData.length > 0) {
        console.log("topLeftData", topLeftData);
        this._sortOneContactPoint(topLeftData, _DIRECTION.LEFT, topLeftBase);
      }
      // middle
      if (topMiddleData.length > 0) {
        console.log("topMiddleData", topMiddleData);
        this._setLineOffset(topMiddleData[0].link, topMiddleData[0].line, 0);
      }
    }
    // bottom
    let bottomRightData = contactPointData._bottom.right;
    let bottomLeftData = contactPointData._bottom.left;
    let bottomMiddleData = contactPointData._bottom.middle;

    let bottomRightBase =
      bottomLeftData.length > 0 || bottomMiddleData.length > 0 ? 1 : 0;
    let bottomLeftBase =
      bottomRightData.length > 0 || bottomMiddleData.length > 0 ? 1 : 0;

    if (contactPointData.bottom.length > 1) {
      // right
      if (bottomRightData.length > 0) {
        console.log("bottomRightData", bottomRightData);
        this._sortOneContactPoint(
          bottomRightData,
          _DIRECTION.RIGHT,
          bottomRightBase
        );
      }
      // left
      if (bottomLeftData.length > 0) {
        console.log("bottomLeftData", bottomLeftData);
        this._sortOneContactPoint(
          bottomLeftData,
          _DIRECTION.LEFT,
          bottomLeftBase
        );
      }
      // middle
      if (bottomMiddleData.length > 0) {
        console.log("bottomMiddleData", bottomMiddleData);
        this._setLineOffset(
          bottomMiddleData[0].link,
          bottomMiddleData[0].line,
          0
        );
      }
    }
  }
  /**
   * 设置线段的偏移量
   * @param {Object} line      线段对象
   * @param {Number} offset    偏移量
   * @date 2020-07-30
   * @author 杨勇
   */
  // 设置线段的偏移量
  _setLineOffset(link, line, offset) {
    console.log("link.................", link);
    console.log("line.................", line);
    console.log("offset.................", offset);
    if (offset !== 0) {
      // line.offset = offset;
      line.start.xOffset = offset;
      line.end.xOffset = offset;
      let relevantLines = link.lines;
      if (relevantLines.length > 1) {
        for (let i = 0; i < relevantLines.length; i++) {
          let tempLine = relevantLines[i];
          if (
            (line.start.x === tempLine.start.x ||
              line.end.x === tempLine.start.x) &&
            line.id !== tempLine.id
          ) {
            // 在水平线开始处接触拐弯
            tempLine.start.xOffset = offset;
          }
          if (
            (line.start.x === tempLine.end.x ||
              line.end.x === tempLine.end.x) &&
            line.id !== tempLine.id
          ) {
            // 在水平线结尾处接触拐弯
            tempLine.end.xOffset = offset;
          }
        }
      }
    }
    // TODO: 计算线段坐标及相连线段坐标的偏移
  }
  // 同方向多条线段，计算线条的偏移量
  _computeOffset() {
    console.log("this.contactPoint", this.contactPoint);
    let keys = Object.keys(this.contactPoint);
    // 遍历注册的节点连线接触点数据
    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      let _data = this.contactPoint[code];
      // console.log("--------------", code, "--------------", _data);
      this._createOffset(_data);
    }
  }
  // 更新坐标和连线的分层
  _updateRank(callback) {
    if (this.rankIncrement > 0) {
      let nodeKeys = Object.keys(this.nodes);
      for (let i = 0; i < nodeKeys.length; i++) {
        let key = nodeKeys[i];
        this.nodes[key].y = this.nodes[key].y + Number(this.rankIncrement);
      }
      let edgeKeys = Object.keys(this.aoan.edgesMap);
      for (let i = 0; i < edgeKeys.length; i++) {
        let key = edgeKeys[i];
        if (this.aoan.edgesMap[key].link !== null) {
          let lines = this.aoan.edgesMap[key].link.lines;
          let intersections = this.aoan.edgesMap[key].link.intersections;
          // console.log(lines);
          for (let i = 0; i < lines.length; i++) {
            lines[i].start.y = lines[i].start.y + Number(this.rankIncrement);
            lines[i].end.y = lines[i].end.y + Number(this.rankIncrement);
          }
          for (let i = 0; i < intersections.length; i++) {
            intersections[i].location.y =
              intersections[i].location.y + Number(this.rankIncrement);
          }
        }
      }
      this.option.rank.max =
        Number(this.option.rank.max) + Number(this.rankIncrement);
    }
    // console.log("this.nodes", this.option);
    this.option.projectEndTime = this.aoan.projectEndTime;
    this.option.projectStartTime = this.aoan.projectStartTime;
    callback(this.nodes, this.aoan.edgesMap, this.option);
  }
  /**
   * 注册连接节点的接触点
   * @param {*} nodeCode
   * @param {*} data
   * @param {*} ContactPoint
   * @param {*} section
   */
  // 注册连接节点的接触点
  _registerContactPoint(nodeCode, data, ContactPoint, section) {
    this.contactPoint[nodeCode][ContactPoint][section].push(data);
  }
  /**
   * 获取指定层上，指定时标到时标之间的节点
   * @param {*} start
   * @param {*} end
   * @param {*} chkStart
   * @param {*} chkEnd
   */
  // 获取指定层上，指定时标到时标之间的节点
  _isCoincide(start, end, chkStart, chkEnd) {
    if (end <= chkStart || start >= chkEnd) return false;
    return true;
  }
  /**
   * 扫描线段获取一条线段，与已经连接过的线段相交和重合情况
   * @param {Json} line               线段数据
   * @param {Number} type             类型  1,水平线  2,垂直线
   * @param {Boolean} parallel        是否有允许并行（垂直线）
   * @param {Boolean} target          穿点判断是否包含目标节点
   * @param {Boolean} source          穿点判断是否包含起始节点
   * @param {Boolean} enablePassNode  是否允许穿点
   * @date 2020-07-02
   * @date 2020-07-03
   * @date 2020-07-07
   * @date 2020-07-13
   * @author 杨勇
   */
  // 扫描线段获取一条线段，与已经连接过的线段相交和重合情况
  _scanLinkedLine(line, type) {
    let linkedLines = this.linked.lines;
    let coincide = []; // 记录路径重合的地方
    let intersection = []; // 记录交叉点
    let start = Number(line.start);
    let end = Number(line.end);
    let parameter = Number(line.parameter);
    let hasNode = this._hasNode(start, end, type, parameter);
    // 先判断是否穿点
    // console.log("enablePassNode", enablePassNode, hasNode);
    // if (hasNode.hasNode && !enablePassNode) {
    //     // console.log("**********穿点*************");
    //     return ({
    //         "enable": false,
    //         "coincide": [],
    //         "passNodes": [],
    //         "intersection": []
    //     });
    // }
    for (let i = 0; i < linkedLines.length; i++) {
      let _line = linkedLines[i];
      let direction = _line.direction;
      let critical = _line.critical;
      let dummy = _line.dummy;
      let arrow = _line.arrow;
      let startLocation = _line.start;
      let endLocation = _line.end;
      let sX = Number(startLocation.x);
      let eX = Number(endLocation.x);
      let sY = Number(startLocation.y);
      let eY = Number(endLocation.y);
      // 默认不重合

      let isCoincide = false;
      if (type === _LINE_DIRECTION.VERTICAL) {
        // 要判断的是垂直线
        if (direction === _LINE_DIRECTION.VERTICAL) {
          // 当前是垂直线
          // 判断重合
          if (parameter === sX) {
            // x相同才可能重合
            isCoincide = this._isCoincide(start, end, sY, eY);
            if (isCoincide) {
              coincide.push({
                level: 1,
                critical: critical,
                dummy: dummy,
                arrow: arrow,
                direction: direction,
                id: _line.id,
                line: _line,
              });
            }
          }
        } else if (direction === _LINE_DIRECTION.HORIZON) {
          // 当前是水平线
          // 判断相交
          // console.log(parameter, sX, eX, sY, start, end);
          if (parameter > sX && parameter < eX && sY > start && sY < end) {
            intersection.push({
              direction: _DIRECTION.UP,
              critical: critical,
              dummy: dummy,
              arrow: arrow,
              line: _line,
              location: {
                x: parameter,
                y: sY,
              },
            });
          }
        }
      } else if (type === _LINE_DIRECTION.HORIZON) {
        // 要判断的是水平线
        if (direction === _LINE_DIRECTION.VERTICAL) {
          // 当前是垂直线
          // 判断相交
          if (parameter > sY && parameter < eY && sX > start && sX < end) {
            intersection.push({
              direction: _DIRECTION.LEFT,
              critical: critical,
              dummy: dummy,
              arrow: arrow,
              line: _line,
              location: {
                x: sX,
                y: parameter,
              },
            });
          }
        } else if (direction === _LINE_DIRECTION.HORIZON) {
          // 当前是水平线
          // 判断重合
          if (parameter === sY) {
            // Y相同才可能重合
            isCoincide = this._isCoincide(start, end, sX, eX);
            if (isCoincide) {
              coincide.push({
                level: -1,
                critical: critical,
                dummy: dummy,
                arrow: arrow,
                direction: direction,
                id: _line.id,
                line: _line,
              });
            }
          }
        }
      }
    }

    // console.log("---coincide", coincide);
    // console.log("---intersection", intersection);
    return {
      enable: true,
      coincide: coincide,
      passNodes: hasNode.nodes,
      intersection: intersection,
    };
  }

  // TODO: del- - - - - - - -- -- - - -  - - - - - - - - - -- - -  -- - - - -  - -  -- - -  - - - -

  // 创建水平和垂直链接
  _createStraightLink(startCode, endCode, enablePassNode) {
    // console.log(startCode + "------aaaa------->" + endCode);
    let startLocation = this.nodes[startCode];
    let endLocation = this.nodes[endCode];
    let sX = startLocation.x;
    let eX = endLocation.x;
    let sY = startLocation.y;
    let eY = endLocation.y;
    let lineLen = Number(eX) - Number(sX);

    let taskInfo = this.aoan.edgesMap[startCode + "-" + endCode];
    let type = 1;
    let label = "";
    let duration = taskInfo.duration || 0;
    let rawTaskInfo = taskInfo.option;
    let isDummy = taskInfo.isDummy;
    let isCritical = taskInfo.isCritical;
    if (!isDummy) {
      // 实工作
      label = rawTaskInfo.text ? rawTaskInfo.text : "";
    }

    let lines = [];
    let direction = _DIRECTION.NONE;
    let free = Number(lineLen) - Number(duration);
    let deduction = 0;

    if (sX === eX) {
      // 相同时标
      // 判断在同时标是否连续节点
      let isContinuousNodesOnTime = this._isContinuousNodes(
        startCode,
        endCode,
        _LINE_DIRECTION.VERTICAL,
        sX
      );
      // console.log("isContinuousNodesOnTime", isContinuousNodesOnTime);
      if (isContinuousNodesOnTime) {
        if (sY < eY) {
          // 后节点在前节点的下方      向下        2，│
          type = _LINK_TYPE.VERTICAL;
          direction = _DIRECTION.DOWN;
          lines = this._createVerticalLines(sY, eY, sX, direction, taskInfo);
        } else if (sY > eY) {
          // 后节点在前节点的上方      向上        2，│
          type = _LINK_TYPE.VERTICAL;
          direction = _DIRECTION.UP;
          lines = this._createVerticalLines(eY, sY, sX, direction, taskInfo);
        }
      } else {
        // console.log(startCode + "------bbbb------->" + endCode, enablePassNode);
        if (enablePassNode) {
          let _result = null;
          if (sY < eY) {
            // 后节点在前节点的下方      向下        2，│
            // 垂直线
            type = _LINK_TYPE.VERTICAL;
            direction = _DIRECTION.DOWN;
            let _vertical = {
              start: sY,
              end: eY,
              arrow: direction,
              parameter: sX,
            };
            _result = this._resolve(_vertical, type, enablePassNode);
            // console.log("_result", _result);
            if (_result.isOk) {
              // 垂直线也可以连接，则生成线段
              lines = this._createVerticalLines(
                sY,
                eY,
                sX,
                direction,
                taskInfo,
                _result
              );
              deduction = deduction + _result.deduction;
            }
          } else if (sY > eY) {
            // 后节点在前节点的上方      向上        2，│
            type = _LINK_TYPE.VERTICAL;
            direction = _DIRECTION.UP;
            let _vertical = {
              start: eY,
              end: sY,
              arrow: direction,
              parameter: sX,
            };
            _result = this._resolve(_vertical, type, enablePassNode);
            // console.log("_result1", _result);
            if (_result.isOk) {
              // 垂直线也可以连接，则生成线段
              lines = this._createVerticalLines(
                eY,
                sY,
                sX,
                direction,
                taskInfo,
                _result
              );
              deduction = deduction + _result.deduction;
            }
          }
        }
      }
    } else if (sX < eX) {
      // 后节点在后方              向后
      direction = _DIRECTION.RIGHT;
      if (sY === eY) {
        // 后节点和前节点在同一层
        // 判断在同层是否连续节点
        let isContinuousNodesOnRank = this._isContinuousNodes(
          startCode,
          endCode,
          _LINE_DIRECTION.HORIZON,
          sY
        );
        // console.log("isContinuousNodesOnRank", isContinuousNodesOnRank);
        if (isContinuousNodesOnRank) {
          // 是连续节点  1，─
          type = _LINK_TYPE.HORIZON;
          lines = this._createHorizonLines(sX, eX, sY, direction, taskInfo);
        }
      }
    } else if (sX > eX) {
      // 后节点在前方              向前
      direction = _DIRECTION.LEFT;
      if (sY === eY) {
        // 后节点和前节点在同一层    1，─    9, ┌┐    10,└┘
        // 判断在同层是否连续节点
        let isContinuousNodesOnRank = this._isContinuousNodes(
          startCode,
          endCode,
          _LINE_DIRECTION.HORIZON,
          sY
        );
        // console.log("isContinuousNodesOnRank2", isContinuousNodesOnRank);
        if (isContinuousNodesOnRank) {
          // 是连续节点  1，─
          type = _LINK_TYPE.HORIZON;
          lines = this._createHorizonLines(eX, sX, sY, direction, taskInfo);
        }
      }
    }

    if (lines.length > 0) {
      let option = {
        label: label,
        critical: isCritical,
        dummy: isDummy,
        length: lineLen,
        duration: duration,
        direction: direction,
        free: free,
      };

      let link = new Link(option, type, { lines: lines }, startCode, endCode);
      this.aoan.edgesMap[startCode + "-" + endCode].link = link;
      this._registerLink(link);
    }
  }
  /**
   * 获取两标志之间的线段
   * @param {String} start         开始标志
   * @param {String} end           结束标志
   * @param {Number} type          类型  1,层上的线段（横线）  2,判断  时标上的线段（竖线）
   * @param {Number} parameter     当type=1时传入层，当type=2时传入 列
   * @date 2020-07-02
   * @author 杨勇
   */
  _getBetweenLines(start, end, type, parameter) {
    let lines = [];
    if (type === 1) {
      lines = this.linked.yList[parameter];
    } else if (type === 2) {
      lines = this.linked.xList[parameter];
    }
    let result = [];
    let isPush = false;
    if (lines.length > 0) {
      for (let i = 0; i < lines.length; i++) {
        if (isPush) {
          result.push(lines[i]);
        }
        if (lines.node === start) {
          isPush = true;
        }
        if (lines.node === end) {
          return result;
        }
      }
    }
    return result;
  }
  /**
   *
   * @param {Number} level         重合级别
   * @param {Number} arrow         当前线段的箭头
   * @param {Number} isArrow       要检查线段的箭头
   * @date 2020-07-07
   */
  _checkCode(level, arrow, isArrow) {
    let isOk = true;
    let deduction = 0;
    const _CHECK_CODE = {
      _COINCIDE_LEVEL: {
        NONE: 0, // 不重合
        IDENTICAL: 1, // 完全相同（起点终点相同）
        SCOINCIDE: 2, // 起点相同的重合
        SEXCEED: 3, // 起点相同的超出
        ECOINCIDE: 4, // 终点相同的重合
        EEXCEED: 5, // 结束相同的超出
        PUBLIC: 6, // 有公共部分
        INCLUDE: 7, // 包含
        PINCLUDE: 8, // 被包含
      },
    };
    switch (level) {
      case _CHECK_CODE._COINCIDE_LEVEL.IDENTICAL: // 完全相同（起点终点相同）
        isOk = false;
        break;
      case _CHECK_CODE._COINCIDE_LEVEL.SCOINCIDE: // 起点相同的重合
        if (isArrow === _DIRECTION.NONE) {
          deduction = 5;
        } else {
          // 经过箭头，不允许
          isOk = false;
        }
        break;
      case _CHECK_CODE._COINCIDE_LEVEL.SEXCEED: // 起点相同的超出
        if (arrow === _DIRECTION.NONE) {
          deduction = 5;
        } else {
          // 经过箭头，不允许
          isOk = false;
        }
        break;
      case _CHECK_CODE._COINCIDE_LEVEL.ECOINCIDE: // 终点相同的重合
        if (
          arrow !== _DIRECTION.NONE &&
          isArrow !== _DIRECTION.NONE &&
          arrow === isArrow
        ) {
          // 箭头相同指向时允许，否则不允许
          deduction = 5;
        } else {
          isOk = false;
        }
        break;
      case _CHECK_CODE._COINCIDE_LEVEL.EEXCEED: // 终点相同的超出
        if (
          arrow !== _DIRECTION.NONE &&
          isArrow !== _DIRECTION.NONE &&
          arrow === isArrow
        ) {
          // 箭头相同指向时允许，否则不允许
          deduction = 5;
        } else {
          isOk = false;
        }
        break;
      case _CHECK_CODE._COINCIDE_LEVEL.PUBLIC: // 有公共部分,不允许
        isOk = false;
        break;
      case _CHECK_CODE._COINCIDE_LEVEL.INCLUDE: // 包含,不允许
        isOk = false;
        break;
      case _CHECK_CODE._COINCIDE_LEVEL.PINCLUDE: // 被包含,不允许
        isOk = false;
        break;
    }
    // console.log("deduction", deduction);

    return {
      isOk: isOk,
      deduction: deduction,
    };
  }
  _isBetween(start, end, parameter) {
    if (start <= parameter && end >= parameter) {
      return true;
    }
    if (start >= parameter && end <= parameter) {
      return true;
    }
    return false;
  }
}

/**********************************************
 * @description 双代号网络图的节点布局CLASS
 * @date   2020-08-05
 * @author 杨勇
 * ********************************************/
const USER_DPI = 72;

class Coordinate {
  constructor(aoan, viz, factor) {
    this.nodes = {};
    this.aoan = aoan;
    this.viz = viz;
    this.factor = factor;
  }
  /**
   * @description  整理图数据信息
   * @param {Number} factor       寻优因子
   * @return {String}             返回下一步创建节点坐标时所需的dot脚本
   * @date 2020-06-24
   * @author 杨勇
   */
  _createGraphData() {
    //排布数据优化
    //let lastNodeDiff = this.aoan.nodesData.nodes[LAST_CODE].difference;
    // //标尺
    let ruleString = "";
    // for (let i = 0; i <= lastNodeDiff - 1; i++) {
    //     ruleString = ruleString + "__" + i + "->__" + (Number(i) + 1) + "[len=1]\n";
    // }
    // //console.log("ruleString:", ruleString);
    // ruleString = ruleString + "\n";

    let differenceData = this.aoan.nodesData.differenceData;
    let keys = Object.keys(differenceData);
    let ruleStringPath = "";
    // for (let i = 1; i < keys.length; i++) {
    //     let current = i;
    //     let previous = i - 1;
    //     let currentKey = keys[current];
    //     let previousKey = keys[previous];
    //     //let len = (Number(currentKey) - Number(previousKey)).toFixed(2);
    //     if (i === 1) {
    //         //ruleStringPath = ruleStringPath + "T" + previous + "->T" + current + "[len=" + len + "]";
    //         ruleStringPath = ruleStringPath + "T" + previous + "->T" + current + "";
    //     } else {
    //         //ruleStringPath = ruleStringPath + "->T" + current + "[len=" + len + "]";
    //         ruleStringPath = ruleStringPath + "->T" + current + "";
    //     }
    //     //ruleString = ruleString + "__" + previousKey + "->__" + currentKey + "[len=" + len + "]\n";
    // }
    // console.log("ruleStringPath", ruleStringPath);
    //ruleStringPath = "";
    //对齐
    let xAlign = "";
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let nodes = this.aoan.nodesData.indexData[key];
      let temp = "";
      for (let j = 0; j < nodes.length; j++) {
        temp = temp + " " + nodes[j];
      }
      temp = "    {rank=same T" + i + " " + temp + "}\n";
      xAlign = xAlign + temp;
    }
    //console.log("xAlign:", xAlign);
    //关键路径,尽量保持直线
    let pathsString = "";
    let paths = this.aoan.criticalTopSort();
    if (paths.length > 0) {
      for (let i = 0; i < paths.length; i++) {
        let pathNodes = paths[i].path;
        let path = "";
        for (let j = 0; j < pathNodes.length; j++) {
          if (j === 0) {
            path = pathNodes[j];
          } else {
            path = path + "->" + pathNodes[j];
          }
        }
        pathsString =
          pathsString + "    " + path + "[weight=" + this.factor + "]\n";
      }
    } else {
      console.log("****************************");
      console.log("***  Info：没有关键路径  ****");
      console.log("****************************");
    }
    //非关键路径,尽量保持直线（权重降低）
    paths = this.aoan.unCriticalTopSort();
    if (paths.length > 0) {
      for (let i = 0; i < paths.length; i++) {
        let pathNodes = paths[i].path;
        let path = "";
        for (let j = 0; j < pathNodes.length; j++) {
          if (j === 0) {
            path = pathNodes[j];
          } else {
            path = path + "->" + pathNodes[j];
          }
        }
        pathsString =
          pathsString +
          "    " +
          path +
          "[weight=" +
          Math.round(this.factor / 2) +
          "]\n";
      }
    }
    //边
    let edgeString = "";
    let nodeString = "";
    keys = this.aoan.edges.keys();
    for (let i = 0; i < keys.length; i++) {
      let code = keys[i];
      let edgeVertexs = this.aoan.edges.get(code);
      for (let j = 0; j < edgeVertexs.length; j++) {
        if (edgeVertexs[j]) {
          let vType = edgeVertexs[j].type;
          let vEnd = edgeVertexs[j].vertexEnd;
          edgeString = edgeString + `    ${code}->${vEnd}\n`;
        }
      }
    }

    let ranksep = 1.0;
    let nodesep = 2.0;
    let graphData = `
strict digraph g {
    rankdir=LR
    splines=ortho
    graph [
        dpi=${USER_DPI}
        newrank=true
        ranksep=${ranksep}
        nodesep=${nodesep}
        remincross=true
    ]
    edge[]
    node [
        width=0.2
        height=0.2
        shape=circle
        margin=0
        //shape=point
        fixedsize=true
    ]
${nodeString}
${pathsString}
${edgeString}
${ruleStringPath}
${ruleString}
${xAlign}
}`;
    //console.log("edgeString:", edgeString);
    console.log("pathsString:", pathsString);
    //console.log("ruleString:", ruleString);
    //console.log("graphData:", graphData);
    //console.log(graphData);
    return graphData;
  }
  /**
   * 创建节点的坐标
   * 此方法耗时较多，故使用回调方式，再由layoutPlan方法回调暴露接口
   * @param {String} initData       整理后的图数据信息
   * @param {function}              回调函数，返回节点的坐标信息
   * @date 2020-06-24
   * @author 杨勇
   */
  _createCoordinate(initData, callback) {
    let __nodes = {};
    let maxXIndex = 0;
    let maxYIndex = 0;
    let that = this;

    // this.viz.renderSVGElement(initData)
    //     .then(function (element) {
    //         document.getElementById("test").appendChild(element);
    //     });
    console.time("布局计算:");
    this.viz.getSvgData(initData).then(function (element) {
      //DOM方式解析坐标
      let tempElement = document.createElement("div");
      tempElement.innerHTML = element;
      var tempNodes = tempElement.getElementsByClassName("node");
      for (let i = 0; i < tempNodes.length; i++) {
        let tempNode = tempNodes[i];
        let y = tempNode.children[1].getAttribute("cy");
        let code = tempNode.children[0].innerHTML;
        if (code.indexOf("T") === -1) {
          let xIndex = Number(that.aoan.nodesData.nodes[code].difference);
          maxXIndex = maxXIndex < xIndex ? xIndex : maxXIndex;
          let yIndex = Math.round(y / USER_DPI);
          maxYIndex = maxYIndex > yIndex ? yIndex : maxYIndex;
          __nodes[code] = {
            x: xIndex,
            y: yIndex,
          };
        }
      }

      //自定义解析坐标（Nodejs）
      // let data = element.replace("\n");
      // data = data.replace(/\n/g, '');
      // //console.log(data);
      // let t = data.split('<svg width="');
      // let t1 = t[1].split('pt" height="');
      // let w = t1[0];
      // let h = t1[1].split('pt"')[0];
      // //console.log("w", w);
      // //console.log("h", h);
      // let tempArr = data.split('><!-- ');
      // for (let i = 0; i < tempArr.length; i++) {
      //     let temp1 = tempArr[i];
      //     let tempArr1 = temp1.split(' -->');
      //     let code = tempArr1[0];
      //     //console.log("code:", code);
      //     //节点
      //     if (temp1.indexOf('class="node"') !== -1) {
      //         //console.log("temp1", temp1);
      //         let temp2 = tempArr1[1];
      //         let tempArr2 = temp2.split('" cx="');
      //         let tempArr3 = tempArr2[1].split('" cy="');
      //         let x = tempArr3[0];
      //         let tempArr4 = tempArr3[1].split('" rx="');
      //         let y = tempArr4[0];
      //         if (code.indexOf("__") === -1) {
      //             //console.log(code);
      //             let xIndex = Number(that.aoan.nodesData.nodes[code].difference);
      //             //let xIndex = Math.round((x - (0.5 * xIndex)) / USER_DPI);
      //             maxX = maxX < x ? x : maxX;
      //             maxXIndex = maxXIndex < xIndex ? xIndex : maxXIndex;
      //             let yIndex = Math.round(y / USER_DPI);
      //             maxY = maxY > y ? y : maxY;
      //             maxYIndex = maxYIndex > yIndex ? yIndex : maxYIndex;
      //             // __nodes[code] = {
      //             //     "x": x,
      //             //     "xIndex": xIndex,
      //             //     "y": y,
      //             //     "yIndex": yIndex,
      //             // }
      //             __nodes[code] = {
      //                 "x": xIndex,
      //                 "y": yIndex,
      //             }
      //         }
      //     }
      // }
      //----------无--------情--------的--------分------割------线----------
      //负坐标转正坐标
      let nodes = Object.keys(__nodes);
      maxYIndex = maxYIndex * -1;
      for (let i = 0; i < nodes.length; i++) {
        __nodes[nodes[i]].critical =
          that.aoan.nodesData.nodes[nodes[i]].critical;
        __nodes[nodes[i]].y = maxYIndex + __nodes[nodes[i]].y;
      }
      //----------无--------情--------的--------分------割------线----------
      //根据同时标数据，优化穿点情况
      // let forking = that.aoan.sameTimeScale.forking;
      // let forkingKeys = Object.keys(forking);
      // if (forkingKeys.length > 0) {
      //     for (let i = 0; i < forkingKeys.length; i++) {
      //         let startCode = forkingKeys[i];
      //         let startY = Number(__nodes[startCode].y);
      //         let startX = __nodes[startCode].x;
      //         if (forking[startCode]) {
      //             let forkingPaths = forking[startCode];
      //             //只有一个节点出现两个分叉时可以优化，其他情况无法或无需优化
      //             if (forkingPaths.length === 2) {
      //                 let node1 = forkingPaths[0][1];
      //                 let node2 = forkingPaths[1][1];
      //                 //获取这两个节点的坐标
      //                 let node1Coordinate = __nodes[node1];
      //                 let node2Coordinate = __nodes[node2];
      //                 let node1Y = Number(node1Coordinate.y);
      //                 let node2Y = Number(node2Coordinate.y);
      //                 //判断是否需要优化
      //                 if (
      //                     (node1Y < startY && startY < node2Y) ||
      //                     (node1Y > startY && startY > node2Y)
      //                 ) {
      //                     //console.log("do nothing");
      //                 } else {
      //                     //获取这个时标上的全部节点
      //                     let tempNodes = that.aoan.nodesData.differenceData[startX];
      //                     //找到位于两个两个节点之间的节点
      //                     let _min = node1Y;
      //                     let _max = node2Y;
      //                     if (node2Y < node1Y) {
      //                         _min = node2Y;
      //                         _max = node1Y;
      //                     }
      //                     let findedNodes = [];
      //                     for (let t = 0; t < tempNodes.length; t++) {
      //                         let _code = tempNodes[t].code;
      //                         if (_code !== startCode && _code !== node1 && _code !== node2) {
      //                             let findedCodeY = Number(__nodes[_code].y);
      //                             if (findedCodeY > _min && findedCodeY < _max) {
      //                                 findedNodes.push({
      //                                     code: _code,
      //                                     y: findedCodeY
      //                                 });
      //                             }
      //                         }
      //                     }
      //                     //console.log("findedNodes:", findedNodes);
      //                     let findLayer = startY;
      //                     if (findedNodes.length === 0) {           //如果两层之间不存在其他节点
      //                         //TEST
      //                         //_max = 4;
      //                         //_min = 2;
      //                         //找到两层的中间层
      //                         if (_max - _min > 1) {      //有移动空间，找到中间层
      //                             findLayer = (_max + _min) % 2 === 0 ? (_max + _min) / 2 : Math.floor((_max + _min) / 2) + 1;
      //                         } else {                    //没有移动空间
      //                             //将靠下的节点，再向下移动一层，找到中间层为移动前的层
      //                             if (node2Y < node1Y) {
      //                                 __nodes[node1].y = node1Y + 1
      //                                 findLayer = node1Y;
      //                             } else {
      //                                 __nodes[node2].y = node2Y + 1
      //                                 findLayer = node2Y;
      //                             }
      //                             //更新最高层数
      //                             if (maxYIndex === findLayer) {
      //                                 maxYIndex = maxYIndex + 1;
      //                             }
      //                         }
      //                         //当前主节点移动到该层上
      //                         __nodes[startCode].y = findLayer;
      //                     } else {                                   //如果两层之间还存在其他节点的情况
      //                         //TODO
      //                     }
      //                 }
      //             }
      //         }
      //     }
      // }
      let option = {
        timeMark: {
          min: 0,
          max: maxXIndex,
        },
        rank: {
          min: 0,
          max: maxYIndex,
        },
      };
      // //console.log("__nodes",__nodes);
      that.option = option;
      that.nodes = __nodes;
      console.timeEnd("布局计算:");
      //----------无--------情--------的--------分------割------线----------
      let linkPlan = new LinkPlan(that);
      linkPlan.createPlan((nodes, edges, option) => {
        callback(nodes, edges, option);
      });
    });
  }
  /**
   * @description  计算连接方案
   * @param {Number} factor       布局因子
   * @param {function} callback   回调
   */
  createPlan(factor, callback) {
    //生成结构化数据
    let initData = this._createGraphData(factor);
    //计算坐标
    this._createCoordinate(initData, callback);
  }
}

class Joke {
  constructor() {
    this.showText();
  }
  showText() {
    let rand = Math.floor(Math.random() * 400);
    this._getShowText(rand)
      ? console.log(this._getShowText(rand))
      : function () {};
  }
  _getShowText(id) {
    let text = [];
    text[0] = `
            ██╗███╗   ███╗    ███╗   ██╗ ██████╗ ████████╗    ███████╗██████╗  ██████╗ ███╗   ██╗████████╗███████╗███╗   ██╗██████╗ 
            ██║████╗ ████║    ████╗  ██║██╔═══██╗╚══██╔══╝    ██╔════╝██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝████╗  ██║██╔══██╗
            ██║██╔████╔██║    ██╔██╗ ██║██║   ██║   ██║       █████╗  ██████╔╝██║   ██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║██║  ██║
            ██║██║╚██╔╝██║    ██║╚██╗██║██║   ██║   ██║       ██╔══╝  ██╔══██╗██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║██║  ██║
            ██║██║ ╚═╝ ██║    ██║ ╚████║╚██████╔╝   ██║       ██║     ██║  ██║╚██████╔╝██║ ╚████║   ██║   ███████╗██║ ╚████║██████╔╝
            ╚═╝╚═╝     ╚═╝    ╚═╝  ╚═══╝ ╚═════╝    ╚═╝       ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝╚═════╝
            
            `;
    text[1] = `
            ___              __         __      
             | __  __  __|_ |____ ___|_|_ __  _|
            _|_||| | |(_)|_ | |(_)| ||_|__| |(_|
                
                `;
    text[2] = `
            ___                                       ___                           ___              
             |                             |         |                         |   |               | 
             +   |- -        |-     -     -+-        |-+-  |-     -    |-     -+-  |-+-  |-       -| 
             |   | | |       | |   | |     |         |     |     | |   | |     |   |     | |     | | 
            ---                     -       -                     -             -   ---           -
            
            `;
    text[3] = `
           dMP dMMMMMMMMb         dMMMMb  .aMMMb dMMMMMMP         dMMMMMP dMMMMb  .aMMMb  dMMMMb dMMMMMMP dMMMMMP dMMMMb  dMMMMb 
          amr dMP"dMP"dMP        dMP dMP dMP"dMP   dMP           dMP     dMP.dMP dMP"dMP dMP dMP   dMP   dMP     dMP dMP dMP VMP 
         dMP dMP dMP dMP        dMP dMP dMP dMP   dMP           dMMMP   dMMMMK" dMP dMP dMP dMP   dMP   dMMMP   dMP dMP dMP dMP  
        dMP dMP dMP dMP        dMP dMP dMP.aMP   dMP           dMP     dMP"AMF dMP.aMP dMP dMP   dMP   dMP     dMP dMP dMP.aMP   
       dMP dMP dMP dMP        dMP dMP  VMMMP"   dMP           dMP     dMP dMP  VMMMP" dMP dMP   dMP   dMMMMMP dMP dMP dMMMMP"
       
       `;
    return text[id];
  }
}

const TARGET_TASK_MODEL$1 = {
  TEMPLATE: 1,
  CONVENTION: 2,
};
const TASK_TYPE$1 = {
  REAL: 1, //实工作
  REAL_TEXT: "实工作", //实工作
  DUMMY: 2, //虚工作
  DUMMY_TEXT: "虚工作", //虚工作
  HANG: 3, //挂起工作
  HANG_TEXT: "挂起工作", //挂起工作
  AVOID_REPETITION: 4, //避免重复
  AVOID_REPETITION_TEXT: "避免重复", //避免重复
  LAG: 5, //延时工作
  LAG_TEXT: "延时", //延时工作
  RELATION: 6, //延时工作
  RELATION_TEXT: "搭接关系", //延时工作
};
const TASK_LINK_TYPE$1 = {
  FS: 0,
  FS_TEXT: "FS",
  SS: 1,
  SS_TEXT: "SS",
  FF: 2,
  FF_TEXT: "FF",
  SF: 3,
  SF_TEXT: "SF",
};

const ONLY_START_END = true; //是否唯一起始点
const INDEPENDENT_START_HANG = true; //开始处是否独立创建挂起工作
const INDEPENDENT_END_HANG = true; //结束处是否独立创建挂起工作

class ActivityOnArrowNetwork extends Graph {
  constructor(_ganttData, _option) {
    super();
    this.option = _option ? _option : null; //项目其它配置信息
    this.layoutFactor = this.option.layoutFactor
      ? this.option.layoutFactor
      : 10;
    this.frontLinksCode = new Dictionary(); //初始网络图的紧前工序集
    this.followLinksCode = new Dictionary(); //初始网络图的紧后工序集
    this.frontLinks = new Dictionary(); //初始网络图的紧前工序集
    this.followLinks = new Dictionary(); //初始网络图的紧后工序集
    this.rawTasks = {}; //任务集
    this.endTasks = [];
    this.dummyTasks = {};
    this.dummyTasks2 = {};
    this.aIntersects = {};
    this.timeScale = 1000 * 60 * 60 * 24; //时间刻度：天
    this.arbitraryDummyEdge = {};
    this.firstNode = "";
    this.lastNode = "LAST";
    this.projectStartTime = null;
    this.projectEndTime = null;
    this.dummyTasksTreeData = null;
    this.idTable = {};
    console.time("创建网络图:");
    this._createGraph(_ganttData); //创建网络图
    console.timeEnd("创建网络图:");
    this.nodesData = {};
    this.edgesMap = {};
    this._initDate(); //获取基础数据
    this.sameTimeScale = {};
    //console.log("this.nodesData :", this.nodesData);
    //console.log("allPaths:", this.allPaths);
    //this._layoutPlan();
    this.toString();
    //this.taskTopSort();
    console.time("绘制界面:");
    console.timeEnd("绘制界面:");
  }
  //创建网络图
  _createGraph(ganttData) {
    //=====================整理甘特图数据=================================
    let gantt = new Gantt(
      ganttData,
      this.timeScale,
      TARGET_TASK_MODEL$1.TEMPLATE,
      this.enforce
    );
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
    this._createRealTasks(gantt.unFS);
    //console.log("gantt.tasksTopSort",gantt.tasksTopSort);
    this._optimizeDummyTasks(); //优化虚工作
    this._handleArbitraryDummyEdge(); //处理任意方向的虚工作
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
      return dateA - dateB;
    });
    let _vertexs = JSON.parse(JSON.stringify(this.vertexs));
    //console.log("_vertexs", _vertexs);
    //为提高性能，先生成字典，避免遍历
    let idNodesTable = {};
    for (let i = 0; i < this.vertexs.length; i++) {
      idNodesTable[this.vertexs[i].code] = i + 1 + "";
    }
    //重新编制节点

    //console.log(idNodesTable);
    this.firstNode = "1";
    this.lastNode = this.vertexs.length;
    this.renumber(idNodesTable);
  }
  //杨昊天
  // _setLines(task) {
  //     let libs = new Libs();
  //     let tempFollows = task.follows;
  //     let lines = [
  //         {
  //             txt: task.text,
  //             len: task.duration,
  //             type: 1
  //         }
  //     ];
  //     if (tempFollows.length === 1) {
  //         let maxfrontEndTime = tempFollows[0].maxfrontEndTime
  //         task.free_time = libs.dateDifferenceToDays(maxfrontEndTime, task.end_date).diff;
  //         if (task.free_time != 0) {
  //             lines.push({
  //                 txt: '',
  //                 len: task.free_time,
  //                 type: 3
  //             })
  //         }
  //     }
  //     return lines;
  // }
  //杨昊天
  //_setMaxTime(gantt) {
  //getOppositeEdgesByNode
  //for (const key in gantt.frontLinks.items) {
  //let tempTask = this.getTaskInfo(key);
  // if (gantt.frontLinks.items.hasOwnProperty(key)) {
  //     let tempTask = this.getTaskInfo(key);
  //     if (gantt.frontLinks.get(key).length === 0) {
  //         continue;
  //     }
  //     let maxfrontEndTime = 0;
  //     let tempNode;
  //     // 获取紧前最大结束时间
  //     for (const iterator of gantt.frontLinks.items[key]) {
  //         console.log("iterator",iterator);
  //         let temptime = new Date(iterator.end_date).getTime();
  //         if (temptime > maxfrontEndTime) {
  //             tempNode = iterator;
  //             maxfrontEndTime = temptime;
  //         }
  //     }
  //     let maxTimeString = tempNode.end_date;
  //     tempTask.maxfrontEndTime = maxTimeString;
  // }
  //tempTask.maxfrontEndTime = tempTask.;
  //}
  //}

  /******************************************************************
   * @description 设置节点的time信息
   * @date  2020-05-21
   * @date  2020-08-06  重写，xtime属性重置为含小时
   * ****************************************************************/
  // _setNodeTime() {
  //     let startDates = [];// 开始时间数组
  //     let libs = new Libs();
  //     for (const key in this.edges.items) {
  //         if (this.edges.items.hasOwnProperty(key)) {
  //             for (let index = 0; index < this.edges.items[key].length; index++) {
  //                 if (this.edges.items[key][index] === undefined) {
  //                     this.edges.items[key].splice(index, 1)
  //                     index--
  //                 }
  //             }
  //         }
  //     }
  //     for (const temp of this.vertexs) {
  //         let key = temp.code;
  //         // if (this.edges.items.hasOwnProperty(key)) {
  //         const element = this.edges.items[key];
  //         if (element[0] !== undefined) {
  //             for (const iterator of element) {
  //                 if (iterator.type === 1) {
  //                     startDates.push({
  //                         name: key,
  //                         start_date: iterator.option.start_date
  //                         //start_date: iterator.option.maxfrontEndTime ? iterator.option.maxfrontEndTime : iterator.option.start_date
  //                     })
  //                     break;
  //                 }
  //             }
  //         }
  //         // }
  //     }
  //     //console.log('时间数组', startDates)
  //     for (const iterator of startDates) {
  //         this.vertexs.find(function (item) {
  //             return item.code == iterator.name
  //         }).xtime = iterator.start_date
  //     }
  //     let frontNodes = this.getFronts();
  //     //console.log('紧前', frontNodes);
  //     for (let i = 0; i < this.vertexs.length; i++) {
  //         if (this.vertexs[i].xtime === undefined) {
  //             if (frontNodes.get(this.vertexs[i].code.toString()) === undefined) {
  //                 continue;
  //             }
  //             for (const iterator of frontNodes.get(this.vertexs[i].code.toString())) {
  //                 // let temp = this.vertexs.find(function (item) {
  //                 //     return item.code == iterator
  //                 // });
  //                 // if (temp.xtime !== undefined) {
  //                 //     this.vertexs[i].xtime = Number(tempTime) < Number(new Date(temp.xtime)) ? temp.xtime : tempTime
  //                 // }
  //                 let tempEdge = this.edges.items[iterator].find((item) => {
  //                     //console.log(i, this.vertexs);
  //                     return item.vertexEnd == this.vertexs[i].code.toString()
  //                 });
  //                 if (tempEdge.option != undefined && tempEdge.option.lines != undefined) {

  //                     let type = 0, len = 0;
  //                     for (const item of tempEdge.option.lines) {
  //                         if (item.type === 3) {
  //                             len = item.len
  //                         }
  //                     }

  //                     if (len === 0) {
  //                         this.vertexs[i].xtime = tempEdge.option.end_date;
  //                     } else {
  //                         console.log(tempEdge);
  //                         let timeNumber = new Date(tempEdge.option.end_date).getTime() + len * this.timeScale;
  //                         let tempDate = new Date(timeNumber);
  //                         this.vertexs[i].xtime = libs.dateFormat("yyyy-MM-dd hh:mm:ss", tempDate);
  //                     }
  //                 }
  //             }
  //         }
  //     }
  //     // end = new Date(this.vertexs.find(function (item) {
  //     //     return item.code === 'LAST';
  //     // }).xtime);

  // }
  //找到虚工作
  _createDummyTask() {
    let collection = new Collection();
    let keys = this.frontLinksCode.keys();
    for (let i = 0; i < keys.length; i++) {
      let aTaskCode = keys[i]; //E
      let aInfo = this.getTaskInfo(aTaskCode);
      let aFronts = aInfo.frontsCode; //获取任务的紧前工序集Code
      let aFollows = aInfo.followsCode; //获取任务的紧后工序
      this.aIntersects[aTaskCode] = { tasks: [] };
      for (let j = 0; j < keys.length; j++) {
        let bTaskCode = keys[j];
        //console.log("--a:", aTaskCode, "，b:", bTaskCode);
        let bInfo = this.getTaskInfo(bTaskCode);
        let bFronts = bInfo.frontsCode; //获取任务的紧前工序集Code
        let bFollows = bInfo.followsCode; //获取任务的紧后工序
        if (aTaskCode !== bTaskCode) {
          let intersect = collection.intersect(aFronts, bFronts); //交集
          let difference = collection.difference(aFronts, bFronts); //差集
          let key = collection.toStr(intersect, ",");
          if (
            collection.isEqual(aFronts, bFronts) &&
            collection.isEqual(aFollows, bFollows) &&
            aFronts.length != 0
          ) {
            //console.log("--aFronts:", aFronts, "，key:", key, "bFronts", aTaskCode);
            this._addArbitraryTask(aFronts, aInfo);
          }
          if (intersect.length > 0) {
            //console.log("--a:", aTaskCode, "，b:", bTaskCode, "，aFronts:", aFronts, "，bFronts:", bFronts, "交集:", intersect, "差集:", difference);
            let dummyInfo = {
              aFronts: aFronts,
              bFronts: bFronts,
              aTaskCode: aTaskCode,
              bTaskCode: bTaskCode,
              intersect: intersect,
              difference: difference,
            };

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
    this._ergodicDummyTasks(dummyTasksTreeData); // 执行递归
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
        if (edgeVertexs.length === 1);
        else {
          for (let j = 0; j < edgeVertexs.length; j++) {
            if (edgeVertexs[j]) {
              let vType = edgeVertexs[j].type;
              let vCode = edgeVertexs[j].code;
              let vEnd = edgeVertexs[j].vertexEnd;
              if (vType === TASK_TYPE$1.DUMMY) {
                let has = this.hasPointSelf(code, vEnd);
                if (has.has);
                else {
                  let node1Nodes = this.getNodeByNode(code);
                  let node2Nodes = this.getNodeByNode(vEnd);
                  let node1DummyNodes = node1Nodes.dummyNodes;
                  let node1RealNodes = node1Nodes.realNodes;
                  let node2DummyNodes = node2Nodes.dummyNodes;
                  let node2RealNodes = node2Nodes.realNodes;
                  let isProperSubset = false;

                  if (
                    node1DummyNodes.length != 0 &&
                    node2DummyNodes.length != 0 &&
                    node1RealNodes.length == 0
                  ) {
                    isProperSubset = collection.isProperSubset(
                      node2DummyNodes,
                      node1DummyNodes
                    );
                  }

                  if (isProperSubset) {
                    //console.log(code, "-->", vEnd, "连接有完全子集，合并之", node1DummyNodes, node2DummyNodes);
                    //console.log(code, "node1DummyNodes:", node1DummyNodes, "node1RealNodes:", node1RealNodes);
                    //console.log(vEnd, "node2DummyNodes:", node2DummyNodes, "node2RealNodes:", node2RealNodes);
                    //this.mergeNode(vEnd, code);
                    this.mergeNodeForward(code, vEnd, vCode); //向前合并
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
            if (vType === TASK_TYPE$1.DUMMY) {
              let nodes = this.getNodeByNode(code).nodes;
              let isCritical = this._inNodeCritical(code);
              if (isCritical && nodes.length === 1) {
                //console.log("----- ", code, "--->", vEnd, "----- ", code, "出度：", nodes, code, "_inNodeCritical", isCritical, nodes.length);
                this.mergeNodeBackward(code, vEnd, vCode); //向后合并节点
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
            if (vType === TASK_TYPE$1.DUMMY) {
              let nodes = this.getOppositeNodeByNode(vEnd).nodes;
              let isCritical = this._outNodeCritical(vEnd);
              if (isCritical && nodes.length === 1) {
                //console.log("+++++", code, "-->", vEnd, "----", vCode, "入度：", nodes, code, "_outNodeCritical", isCritical);
                //this.mergeNode2(vEnd, code);
                //this.removeEdge(vCode);                            //移除虚工作的边
                this.mergeNodeForward(code, vEnd, vCode); //向前合并节点
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
            if (vType === TASK_TYPE$1.DUMMY) {
              let nodes = this.getNodeByNode(code).nodes;
              let isCritical = this._inNodeCritical(code);
              //console.log("----- ", code, "--->", vEnd, "----- ", code, "出度：", nodes, code, "_inNodeCritical!!", isCritical);
              if (!isCritical && nodes.length === 1) {
                this.mergeNodeBackward(code, vEnd, vCode); //向后合并节点
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
            if (vType === TASK_TYPE$1.DUMMY) {
              let nodes = this.getOppositeNodeByNode(vEnd).nodes;
              let isCritical = this._outNodeCritical(vEnd);
              if (!isCritical && nodes.length === 1) {
                //console.log("+++++", code, "-->", vEnd, "----", vEnd, "入度：", nodes, code, "_outNodeCritical", isCritical);
                //this.mergeNode2(vEnd, code);
                //this.removeEdge(vCode);                                 //移除虚工作的边
                this.mergeNodeForward(code, vEnd, vCode); //向前合并节点
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
            if (vType === TASK_TYPE$1.DUMMY) {
              let frontNodes = this.getOppositeNodeByNode(code).dummyNodes;
              let followNodes = this.getOppositeNodeByNode(vEnd).dummyNodes;
              // //console.log("++++++", code, "-->", vEnd);
              // //console.log("++++++frontNodes", frontNodes, "followNodes：", followNodes);
              // //console.log("++++++intersectNodes：", intersectNodes);
              // //console.log("++++++differenceNodes：", differenceNodes);
              // //console.log("++++++frontNodes", frontNodes, "followNodes：", followNodes);
              let intersectNodes = collection.intersect(
                followNodes,
                frontNodes
              );
              let differenceNodes = collection.difference(
                followNodes,
                frontNodes
              );
              if (
                intersectNodes.length == 1 &&
                differenceNodes.length == 1 &&
                differenceNodes[0] == code
              );
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
              if (isCritical == "true") {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }
  //判断节点是否有指向关键任务
  _outNodeCritical(node) {
    let edgeVertexs = this.edges.get(node);
    if (edgeVertexs) {
      for (let j = 0; j < edgeVertexs.length; j++) {
        if (edgeVertexs[j]) {
          if (edgeVertexs[j].option) {
            let isCritical = edgeVertexs[j].option.isCriticalTask;
            if (isCritical == "true") {
              return true;
            }
          }
        }
      }
    }
    return false;
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
      if (
        parentKey != nowKey &&
        intersect.length != 0 &&
        keyArr.length < parentKeyArr.length
      ) {
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
      if (
        parentKey != nowKey &&
        intersect.length != 0 &&
        keyArr.length < parentKeyArr.length &&
        isFirstFinded == parentKeyArr.length
      ) {
        parentKeys.push(parentKey);
      }
    }
    return parentKeys;
  }
  //找全部父级key
  _getAllParentKey(nowKey) {
    //console.log("nowKey:", nowKey);
    let keyArr = ("" + nowKey).split(",");
    let collection = new Collection();
    let parentKeys = [];
    for (let i = this.idTable.length - 1; i >= 0; i--) {
      let parentKey = this.idTable[i].key;
      let parentKeyArr = parentKey.split(",");
      let intersect = collection.intersect(keyArr, parentKeyArr);
      if (parentKey != nowKey && intersect.length != 0) {
        parentKeys.push(parentKey);
      }
    }
    return parentKeys;
  }
  //移除边
  removeParentEdge(parentKey, key) {
    for (let i = 0; i < this.dummyToEdge.length; i++) {
      if (
        this.dummyToEdge[i].start == key &&
        this.dummyToEdge[i].end == parentKey
      ) {
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
    let meetingNode = "M-" + key;
    let ret = {
      meetingNode: meetingNode,
      isCreated: false,
    };
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
        this.addDummyEdge(
          taskNode.end,
          meetingNode,
          "D:" + taskNode.end + "->" + meetingNode,
          task
        );
      } else {
        this._addTaskEdge(taskNode.start, meetingNode, task);
      }
    }
    return ret;
  }
  //遍历this.dummyTasks计算出虚工作和特殊情况的边创建规则
  _ergodicDummyTasks(source) {
    let collection = new Collection();
    source.forEach((el) => {
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
                      let _aTaskCode =
                        parentDummyTasks[parentIntKey][taskKeys[s1]].aTaskCode;
                      let _difference =
                        parentDummyTasks[parentIntKey][taskKeys[s1]].difference;
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
          let meetingNode = createSetTasks.meetingNode;
          if (difference.length != 0) {
            if (parentFinded == 0) {
              let aTask = this.getTaskInfo(aTaskCode);
              let aTaskNode = this.getTaskNode(aTaskCode);
              if (aTaskNode == null) {
                aTaskNode = this.createTaskNode(aTask);
              }
              this._addTaskEdge(aTaskNode.start, aTaskNode.end, aTask);
              //创建交集汇点到aTask的虚工作
              //console.log("创建1---", key + "->" + aTaskCode);
              let dummyCode = "D:" + meetingNode + "->" + aTaskNode.start;
              //console.log(aTaskIsCreated, "创建22:", meetingNode, aTaskNode.start, dummyCode, null);
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
      if (el.subset && el.subset.length > 0) {
        //如果有子集
        //console.log(key, "==================");
        this._ergodicDummyTasks(el.subset);
      }
    });
  }
  //如果有多级包含关系，则父级创建过的，这里忽略创建
  _isCreateTask(frontCode, code) {
    let parentKeys = this._getAllParentKey(frontCode);
    //console.log(code, "parentKey:", parentKeys);
    if (parentKeys.length == 0) {
      // //console.log("已经返回true");
      return true; //没有找到父级key、直接返回未创建
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
                return false;
              }
            }
          }
        }
      }
      return true;
    }
  }
  //找到链接点
  _findConnectioNode() {
    let keys = Object.keys(this.arbitraryDummyEdge);
    if (keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        if (this.arbitraryDummyEdge[keys[i]]) {
          let tasks = this.arbitraryDummyEdge[keys[i]].tasks;
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
              let endEdges = this.getEdges(taskNode.end);
              let hasRealTask = 0;
              let hasCritical = 0;
              //console.log(task.code, "endEdges:", endEdges, "taskNode", taskNode);

              for (let tt = 0; tt < endEdges.length; tt++) {
                //console.log("endEdges[tt]", endEdges[tt]);
                if (endEdges[tt].type == 1) {
                  hasRealTask++;
                  if (endEdges[tt].option) {
                    if (endEdges[tt].option.isCriticalTask == "true") {
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
      this._findConnectioNode(); //寻找连接点
      //连接这些节点
      for (let i = 0; i < keys.length; i++) {
        let frontCode = keys[i];
        let frontNode = this.getTaskNode(frontCode);
        if (this.arbitraryDummyEdge[keys[i]]) {
          let tasks = this.arbitraryDummyEdge[keys[i]].tasks;
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
                    this.addDummyEdge(
                      "DT" + task1.code,
                      node2.end,
                      dummyCode,
                      task1
                    );
                  } else {
                    dummyCode =
                      "D:" + "DT" + task1.code + "->" + "DT" + task2.code;
                    this._modifyTaskNode(task1, node1.start, "DT" + task1.code);
                    this._modifyTaskNode(task2, node2.start, "DT" + task2.code);
                    this.addDummyEdge(
                      "DT" + task1.code,
                      "DT" + task2.code,
                      dummyCode,
                      task1
                    );
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
  _createRealTasks(unFS) {
    this._drawFSTasks(this.endTasks);
    console.log("this.endTasks", this.endTasks);
    //调用从结束时
    // for (let i = taskList.length - 1; i >= 0; i--) {
    //     let _task = this.getTaskInfo(taskList[i]);
    //     if (false === _task.isCreated) {
    //     console.log("taskList[i]", taskList[i], _task);
    //     this._drawFSTasks([_task]);
    //     }
    // }
    //画非FS关系的任务
    this._drawUnFSTasks(unFS);
  }
  //画全部FS实工作
  _drawFSTasks(tasks) {
    for (let i = 0; i < tasks.length; i++) {
      let task = tasks[i];
      if (task !== null) {
        if (task.isFirstTask && task.isLastTask) {
          //既是开始就是结束，则是孤立任务
          this._createSeparateTask(task); //创建孤立任务
        } else {
          let taskFronts = task.fronts; //获取任务的紧前
          if (taskFronts.length === 0) {
            //没有紧前任务则退出递归
            return;
          } else {
            for (let t = 0; t < taskFronts.length; t++) {
              let taskFront = taskFronts[t];
              if (taskFront !== null) {
                this._createFSTaskLink(taskFront, task); //创建有关系的任务
              }
            }
          }
          this._drawFSTasks(taskFronts); //递归
        }
      }
    }
  }
  //画全部FS实工作
  // _drawFSTasks2(tasks) {
  //     let nullFrontsNumber = 0;
  //     for (let i = 0; i < tasks.length; i++) {
  //         let task = tasks[i];
  //         if (task !== null) {
  //             if (task.isFirstTask && task.isLastTask) {      //即是开始就是结束，则是孤立任务
  //                 this._createOneTask(task);
  //             } else {
  //                 let taskFronts = tasks[i].fronts;           //获取任务的紧前
  //                 if (taskFronts.length == 0) {
  //                 } else {
  //                 }
  //             }
  //             //console.log("task", task.text);
  //             let taskCode = task.code;
  //             let taskNode = this.getTaskNode(taskCode);
  //             let relation = task.relation;
  //             //console.log(taskCode, "1taskNode", taskNode);
  //             let taskIsCreated = true;
  //             if (taskNode == null) {
  //                 taskNode = this.createTaskNode(task);
  //                 //console.log(taskCode, "-----未创建");
  //                 taskNode = this._addTaskEdge(taskNode.start, taskNode.end, task); //创建当前任务
  //                 taskIsCreated = false;
  //             }
  //             console.log(task.text, "2taskNode", taskNode);
  //             // if (libs.dateDifferenceToDays(task.end_date, this.projectEndTime) === 0) {
  //             //     this.lastNode = taskNode.end;
  //             // }
  //             let taskFronts = tasks[i].fronts;           //获取任务的紧前
  //             //console.log(taskFronts);
  //             if (taskFronts.length == 0) {
  //                 nullFrontsNumber++;
  //                 return;
  //                 //console.log("FIRST 没有紧前");
  //             } else {
  //                 for (let t = 0; t < taskFronts.length; t++) {
  //                     let taskFront = taskFronts[t];
  //                     if (taskFront !== null) {
  //                         let taskFrontCode = taskFront.code;
  //                         console.log(taskFrontCode, "-->", taskCode, "-----未创建");
  //                         let taskFrontNode = this.getTaskNode(taskFrontCode);
  //                         let frontIsCreated = true;
  //                         if (taskFrontNode == null) {
  //                             taskFrontNode = this.createTaskNode(taskFront);
  //                             frontIsCreated = false;
  //                         }
  //                         let tempCode = "D:" + taskFrontNode.end + "->" + taskNode.start;
  //                         //if (isCreate) {
  //                         if (taskIsCreated) {           //taskCode已经创建
  //                             if (frontIsCreated) {      //taskFrontCode也已经创建，则忽略
  //                                 if (taskFrontNode.end == taskNode.start) {   //如果本身就是连接，则忽略
  //                                 } else {
  //                                     this.addDummyEdge(taskFrontNode.end, taskNode.start, tempCode, taskFront);
  //                                 }
  //                             } else {                   //taskFrontCode未创建
  //                                 this._addTaskEdge(taskFrontNode.start, taskFrontNode.end, taskFront);
  //                                 this.addDummyEdge(taskFrontNode.end, taskNode.start, tempCode, taskFront);
  //                             }
  //                         } else {                        //taskCode未创建
  //                             if (frontIsCreated) {      //taskFrontCode已经创建
  //                                 this.addDummyEdge(taskFrontNode.end, taskNode.start, tempCode, taskFront);//创建虚工作连接
  //                             } else {                   //都未创建
  //                                 this._addTaskEdge(taskFrontNode.start, taskNode.start, taskFront); //创建紧前任务,实工作
  //                             }
  //                         }
  //                         //} else {
  //                         //console.log(taskFrontCode, "-->", taskCode, "-----已经创建");
  //                         //}
  //                     }
  //                 }
  //             }
  //             this._drawFSTasks(taskFronts);
  //         }
  //     }
  //     if (nullFrontsNumber === 0) {
  //         //console.log("END");
  //         return;
  //     }
  // }
  //画非FS实工作
  _drawUnFSTasks(unFSLinks) {
    console.log("--unFS-->", unFSLinks);
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
  //创建SS关系
  _createUnFSTaskLink(link) {
    let frontTask = this.getTaskInfo(link.frontId);
    let task = this.getTaskInfo(link.followId);
    console.log("SS:", frontTask.text, "--->", task.text);
    console.log("SS:", frontTask.code, "--->", task.code);
    let frontTaskIsCreate = frontTask.isCreated; //紧前任务是否已经创建
    let taskIsCreate = task.isCreated; //后任务是否已经创建
    let lag = Number(link.lag ? link.lag : 0);
    let type = link.type;
    let _frontNode = null;
    let _taskNode = null;

    if (!frontTaskIsCreate && !taskIsCreate) {
      //都没有创建过
      _frontNode = this._createFrontTaskEdge(frontTask); //创建紧前任务并获取节点
      _taskNode = this._createTaskEdge(task); //创建后任务并获取节点
    } else {
      if (frontTaskIsCreate && taskIsCreate) {
        //都已经创建过
        _frontNode = this.getTaskNode(frontTask.code);
        _taskNode = this.getTaskNode(task.code);
      } else if (!frontTaskIsCreate) {
        //紧前没有创建过
        _taskNode = this.getTaskNode(task.code); //获取后任务的节点信息
        _frontNode = this._createFrontTaskEdge(frontTask); //创建紧前任务并获取节点
      } else if (!taskIsCreate) {
        //后任务没有创建过
        _frontNode = this.getTaskNode(frontTask.code); //获取紧前任务的节点信息
        _taskNode = this._createTaskEdge(task); //创建后任务并获取节点
      }
    }
    //创建搭接关系
    console.log("_frontNode:", _frontNode);
    console.log("_taskNode:", _taskNode);

    switch (type) {
      case TASK_LINK_TYPE$1.SS:
        if (_frontNode.start !== _taskNode.start) {
          console.log(TASK_LINK_TYPE$1.SS);
          this._createEdge(
            {
              node: _frontNode.start,
              time: _frontNode.startTime,
              critical: frontTask.isCriticalTask,
            },
            {
              node: _taskNode.start,
              time: _taskNode.startTime,
              critical: task.isCriticalTask,
            },
            TASK_TYPE$1.RELATION,
            frontTask.isCriticalTask && task.isCriticalTask,
            "R-SS-" + frontTask.code + "-" + task.code,
            {
              taskType: TASK_TYPE$1.RELATION_TEXT,
              lag: lag,
              relationLinkType: TASK_LINK_TYPE$1.SS,
              relationLinkTypeText: TASK_LINK_TYPE$1.SS_TEXT,
            }
          );
        }
        break;
      case TASK_LINK_TYPE$1.FF:
        if (_frontNode.end !== _taskNode.end) {
          console.log(TASK_LINK_TYPE$1.FF);
          this._createEdge(
            {
              node: _frontNode.end,
              time: _frontNode.endTime,
              critical: frontTask.isCriticalTask,
            },
            {
              node: _taskNode.end,
              time: _taskNode.endTime,
              critical: task.isCriticalTask,
            },
            TASK_TYPE$1.RELATION,
            frontTask.isCriticalTask && task.isCriticalTask,
            "R-FF-" + frontTask.code + "-" + task.code,
            {
              taskType: TASK_TYPE$1.RELATION_TEXT,
              lag: lag,
              relationLinkType: TASK_LINK_TYPE$1.FF,
              relationLinkTypeText: TASK_LINK_TYPE$1.FF_TEXT,
            }
          );
        }
        break;
      case TASK_LINK_TYPE$1.SF:
        if (_frontNode.start !== _taskNode.end) {
          console.log(TASK_LINK_TYPE$1.SF);
          this._createEdge(
            {
              node: _frontNode.start,
              time: _frontNode.startTime,
              critical: frontTask.isCriticalTask,
            },
            {
              node: _taskNode.end,
              time: _taskNode.endTime,
              critical: task.isCriticalTask,
            },
            TASK_TYPE$1.RELATION,
            frontTask.isCriticalTask && task.isCriticalTask,
            "R-SF-" + frontTask.code + "-" + task.code,
            {
              taskType: TASK_TYPE$1.RELATION_TEXT,
              lag: lag,
              relationLinkType: TASK_LINK_TYPE$1.SF,
              relationLinkTypeText: TASK_LINK_TYPE$1.SF_TEXT,
            }
          );
        }
        break;
      default:
        if (this.enforce) {
          console.log(
            "Error:错误的搭接关系，必须是：0,1,2,3，当前关系：" +
              JSON.stringify(link)
          );
        } else {
          throw new Error(
            "错误的搭接关系，必须是：0,1,2,3，当前关系：" + JSON.stringify(link)
          );
        }
    }
  }
  //创建有关系的两个任务
  _createFSTaskLink(frontTask, task) {
    let frontTaskIsCreate = frontTask.isCreated; //紧前任务是否已经创建
    let taskIsCreate = task.isCreated; //后任务是否已经创建
    let relation = frontTask.relation;
    let source = relation.frontId;
    let target = relation.followId;
    let lag = 0;
    //只有关系符合时才计算延时数据
    if (source === frontTask.code && target === task.code) {
      lag = relation.lag;
    }
    if (!frontTaskIsCreate && !taskIsCreate) {
      //都没有创建过
      this._createConsecutiveFSTask(frontTask, task, lag);
    } else {
      let _frontNode = null;
      let _taskNode = null;
      if (frontTaskIsCreate && taskIsCreate) {
        //都已经创建过
        _frontNode = this.getTaskNode(frontTask.code);
        _taskNode = this.getTaskNode(task.code);
      } else if (!frontTaskIsCreate) {
        //紧前没有创建过
        _taskNode = this.getTaskNode(task.code); //获取后任务的节点信息
        _frontNode = this._createFrontTaskEdge(frontTask); //创建紧前任务并获取节点
      } else if (!taskIsCreate) {
        //后任务没有创建过
        _frontNode = this.getTaskNode(frontTask.code); //获取紧前任务的节点信息
        _taskNode = this._createTaskEdge(task); //创建后任务并获取节点
      }
      //创建虚工作或延时工作
      if (_frontNode.end !== _taskNode.start) {
        //说明不是直接创建的，创建虚工作暂时连接
        if (lag !== 0) {
          //创建延时工作
          this._createEdge(
            {
              node: _frontNode.end,
              time: _frontNode.endTime,
              critical: frontTask.isCriticalTask,
            },
            {
              node: _taskNode.start,
              time: _taskNode.startTime,
              critical: task.isCriticalTask,
            },
            TASK_TYPE$1.LAG,
            frontTask.isCriticalTask,
            "L" + frontTask.code + "-" + task.code,
            {
              taskType: TASK_TYPE$1.LAG_TEXT,
              lag: lag,
              relationLinkType: TASK_LINK_TYPE$1.FS,
              relationLinkTypeText: TASK_LINK_TYPE$1.FS_TEXT,
            }
          );
        } else {
          //创建虚工作
          let tempCode = "D:" + _frontNode.end + "->" + _taskNode.start;
          this.addDummyEdge(_frontNode.end, _taskNode.start, tempCode, {
            relationLinkType: TASK_LINK_TYPE$1.FS,
            relationLinkTypeText: TASK_LINK_TYPE$1.FS_TEXT,
          });
        }
      }
    }
  }
  //直接创建连续节点的两个任务
  _createConsecutiveFSTask(frontTask, task, lag) {
    //==================创建前任务================================
    let libs = new Libs();
    let taskStartDateFront = frontTask.start_date;
    let taskEndDateFront = frontTask.end_date;
    let frontMaxEndTime = frontTask.frontMaxEndTime
      ? frontTask.frontMaxEndTime
      : taskStartDateFront;
    let createTaskNodeFront = this.createTaskNode(frontTask);
    let createTaskNode = this.createTaskNode(task);
    let taskStartDate = task.start_date;
    let taskEndDate = task.end_date;
    let taskMaxEndTime = task.isLastTask ? this.projectEndTime : taskEndDate;
    let realEdgeNode1 = {
      node: createTaskNodeFront.start,
      time: frontMaxEndTime,
      critical: frontTask.isCriticalTask,
    };
    let realEdgeNode2 = {
      node: createTaskNodeFront.end,
      time: taskEndDateFront,
      critical: frontTask.isCriticalTask,
    };
    let realEdgeNode3 = {
      node: createTaskNode.start,
      time: taskStartDate,
      critical: task.isCriticalTask,
    };
    let realEdgeNode4 = {
      node: createTaskNode.end,
      time: taskMaxEndTime,
      critical: task.isCriticalTask,
    };

    let hangTaskCodeFront = "HS" + frontTask.code;
    let startHangTime = libs.dateDifferenceToDays(
      frontMaxEndTime,
      taskStartDateFront
    ).diff; //记录开始挂起时间长度
    if (startHangTime !== 0 && INDEPENDENT_START_HANG) {
      //需要添加前挂起工作
      let hangEdgeStart = {
        node: createTaskNodeFront.start,
        time: frontMaxEndTime,
        critical: frontTask.isCriticalTask,
      };
      let hangEdgeEnd = {
        node: hangTaskCodeFront,
        time: taskStartDateFront,
        critical: frontTask.isCriticalTask,
      };
      //创建前挂起边
      this._createEdge(
        hangEdgeStart,
        hangEdgeEnd,
        TASK_TYPE$1.HANG,
        frontTask.isCriticalTask,
        hangTaskCodeFront,
        { taskType: TASK_TYPE$1.HANG_TEXT, hangTime: startHangTime }
      );
      realEdgeNode1.node = hangTaskCodeFront;
      realEdgeNode1.time = taskStartDateFront;
    }
    //==================创建后任务================================
    let hangTaskCode = "HE" + task.code;
    let endHangTime = libs.dateDifferenceToDays(taskEndDate, taskMaxEndTime)
      .diff; //记录结束挂起时间长度
    let hangEdgeStart = {
      node: hangTaskCode,
      time: taskEndDate,
      critical: task.isCriticalTask,
    };
    let hangEdgeEnd = {
      node: createTaskNode.end,
      time: taskMaxEndTime,
      critical: task.isCriticalTask,
    };

    if (endHangTime !== 0 && INDEPENDENT_END_HANG) {
      //结束需要添加挂起工作
      //创建后挂起边
      this._createEdge(
        hangEdgeStart,
        hangEdgeEnd,
        TASK_TYPE$1.HANG,
        task.isCriticalTask,
        hangTaskCode,
        { taskType: TASK_TYPE$1.HANG_TEXT, hangTime: startHangTime }
      );
      realEdgeNode4.node = hangTaskCode;
      realEdgeNode4.time = taskEndDate;
    } else {
      let check = this.checkDuplicateNode(
        createTaskNode.start,
        createTaskNode.end,
        task.code
      );
      //节点重复，但是任务不重复
      if (check.nodeDuplicate && !check.taskDuplicate) {
        //后面没有挂起工作，则添加一个挂起工作防止重复
        //创建后挂起边
        this._createEdge(
          hangEdgeStart,
          hangEdgeEnd,
          TASK_TYPE$1.AVOID_REPETITION,
          task.isCriticalTask,
          "A" + task.code,
          { taskType: TASK_TYPE$1.AVOID_REPETITION_TEXT }
        );
        realEdgeNode4.node = hangTaskCode;
        realEdgeNode4.time = taskEndDate;
      }
    }

    if (realEdgeNode2.time !== realEdgeNode3.time && lag !== 0) {
      //console.log("realEdgeNode1:", realEdgeNode1, "realEdgeNode2", realEdgeNode2, "realEdgeNode3:", realEdgeNode3, "realEdgeNode4", realEdgeNode4);
      //创建前任务
      this._createEdge(
        realEdgeNode1,
        realEdgeNode2,
        TASK_TYPE$1.REAL,
        frontTask.isCriticalTask,
        frontTask.code,
        frontTask
      );
      //创建延迟任务
      this._createEdge(
        realEdgeNode2,
        realEdgeNode3,
        TASK_TYPE$1.LAG,
        frontTask.isCriticalTask,
        "L" + frontTask.code + "-" + task.code,
        { taskType: TASK_TYPE$1.LAG_TEXT, lag: lag }
      );
      //创建后任务
      this._createEdge(
        realEdgeNode3,
        realEdgeNode4,
        TASK_TYPE$1.REAL,
        task.isCriticalTask,
        task.code,
        task
      );
    } else {
      //创建前任务
      this._createEdge(
        realEdgeNode1,
        realEdgeNode3,
        TASK_TYPE$1.REAL,
        frontTask.isCriticalTask,
        frontTask.code,
        frontTask
      );
      //创建后任务
      this._createEdge(
        realEdgeNode3,
        realEdgeNode4,
        TASK_TYPE$1.REAL,
        task.isCriticalTask,
        task.code,
        task
      );
    }
  }
  //创建前任务
  _createFrontTaskEdge(task) {
    let libs = new Libs();
    let taskStartDate = task.start_date;
    let taskEndDate = task.end_date;
    let frontMaxEndTime = task.frontMaxEndTime
      ? task.frontMaxEndTime
      : taskStartDate;
    let createTaskNode = this.createTaskNode(task);
    let result = {};
    let startHangTime = libs.dateDifferenceToDays(
      frontMaxEndTime,
      taskStartDate
    ).diff; //记录开始挂起时间长度
    let taskEdgeStart = {
      node: createTaskNode.start,
      time: taskStartDate,
      critical: task.critical,
    };
    let taskEdgeEnd = {
      node: createTaskNode.end,
      time: taskEndDate,
      critical: task.critical,
    };
    if (startHangTime !== 0 && INDEPENDENT_START_HANG) {
      //需要添加前挂起工作
      let hangTaskCodeFront = "HS" + task.code;
      let hangEdgeStart = {
        node: createTaskNode.start,
        time: frontMaxEndTime,
        critical: task.isCriticalTask,
      };
      let hangEdgeEnd = {
        node: hangTaskCodeFront,
        time: taskStartDate,
        critical: task.isCriticalTask,
      };
      //创建前挂起边
      this._createEdge(
        hangEdgeStart,
        hangEdgeEnd,
        TASK_TYPE$1.HANG,
        task.isCriticalTask,
        hangTaskCodeFront,
        { taskType: TASK_TYPE$1.HANG_TEXT, hangTime: startHangTime }
      );
      taskEdgeStart.node = hangTaskCodeFront;
      taskEdgeStart.time = taskStartDate;
    }
    //创建实工作
    this._createEdge(
      taskEdgeStart,
      taskEdgeEnd,
      TASK_TYPE$1.REAL,
      task.critical,
      task.code,
      task
    );
    result = {
      start: taskEdgeStart.node,
      startTime: taskEdgeStart.node,
      end: taskEdgeEnd.node,
      endTime: taskEdgeEnd.node,
    };
    return result;
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
      critical: task.critical,
    };
    let taskEdgeEnd = {
      node: createTaskNode.end,
      time: taskEndDate,
      critical: task.critical,
    };

    let hangTaskCode = "HE" + task.code;
    let endHangTime = libs.dateDifferenceToDays(taskEndDate, taskMaxEndTime)
      .diff; //记录结束挂起时间长度
    let hangEdgeStart = {
      node: hangTaskCode,
      time: taskEndDate,
      critical: task.isCriticalTask,
    };
    let hangEdgeEnd = {
      node: createTaskNode.end,
      time: taskMaxEndTime,
      critical: task.isCriticalTask,
    };
    if (endHangTime !== 0 && INDEPENDENT_END_HANG) {
      //结束需要添加挂起工作
      //创建后挂起边
      this._createEdge(
        hangEdgeStart,
        hangEdgeEnd,
        TASK_TYPE$1.HANG,
        task.isCriticalTask,
        hangTaskCode,
        { taskType: TASK_TYPE$1.HANG_TEXT, hangTime: endHangTime }
      );
      taskEdgeEnd.node = hangTaskCode;
      taskEdgeEnd.time = taskEndDate;
    } else {
      let check = this.checkDuplicateNode(
        createTaskNode.start,
        createTaskNode.end,
        task.code
      );
      //节点重复，但是任务不重复
      if (check.nodeDuplicate && !check.taskDuplicate) {
        //后面没有挂起工作，则添加一个挂起工作防止重复
        //创建后挂起边
        this._createEdge(
          hangEdgeStart,
          hangEdgeEnd,
          TASK_TYPE$1.AVOID_REPETITION,
          task.isCriticalTask,
          "A" + task.code,
          { taskType: TASK_TYPE$1.AVOID_REPETITION_TEXT }
        );
        taskEdgeEnd.node = hangTaskCode;
        taskEdgeEnd.time = taskEndDate;
      }
    }
    //创建实工作
    this._createEdge(
      taskEdgeStart,
      taskEdgeEnd,
      TASK_TYPE$1.REAL,
      task.critical,
      task.code,
      task
    );
    result = {
      start: taskEdgeStart.node,
      startTime: taskEdgeStart.node,
      end: taskEdgeEnd.node,
      endTime: taskEdgeEnd.node,
    };
    return result;
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
      critical: task.critical,
    };
    //console.log("创建孤立任务：", task.text, createTaskNode);
    let taskEdgeEnd = {
      node: createTaskNode.end,
      time: taskEndDate,
      critical: task.critical,
    };

    let startHangTime = libs.dateDifferenceToDays(maxStartTime, taskStartDate)
      .diff; //记录开始挂起时间长度
    let sHangTaskCode = "HS" + task.code;
    let sHangEdgeStart = {
      node: createTaskNode.start,
      time: maxStartTime,
      critical: task.isCriticalTask,
    };
    let sHangEdgeEnd = {
      node: sHangTaskCode,
      time: taskStartDate,
      critical: task.isCriticalTask,
    };
    if (startHangTime !== 0 && ONLY_START_END) {
      //需要添加前挂起工作
      //创建前挂起边
      this._createEdge(
        sHangEdgeStart,
        sHangEdgeEnd,
        TASK_TYPE$1.HANG,
        task.isCriticalTask,
        sHangTaskCode,
        {
          taskType: TASK_TYPE$1.HANG_TEXT,
          hangTime: startHangTime,
        }
      );
      taskEdgeStart.node = sHangTaskCode;
      taskEdgeStart.time = taskStartDate;
    }
    //==================创建后任务================================
    let endHangTime = libs.dateDifferenceToDays(taskEndDate, maxEndTime).diff; //记录结束挂起时间长度
    let eHangTaskCode = "HE" + task.code;
    let eHangEdgeStart = {
      node: eHangTaskCode,
      time: taskEndDate,
      critical: task.isCriticalTask,
    };
    let eHangEdgeEnd = {
      node: createTaskNode.end,
      time: maxEndTime,
      critical: task.isCriticalTask,
    };
    if (endHangTime !== 0 && ONLY_START_END) {
      //结束需要添加挂起工作
      //创建后挂起边
      this._createEdge(
        eHangEdgeStart,
        eHangEdgeEnd,
        TASK_TYPE$1.HANG,
        task.isCriticalTask,
        eHangTaskCode,
        {
          taskType: TASK_TYPE$1.HANG_TEXT,
          hangTime: startHangTime,
        }
      );
      taskEdgeEnd.node = eHangTaskCode;
      taskEdgeEnd.time = taskEndDate;
    } else {
      let check = this.checkDuplicateNode(
        createTaskNode.start,
        createTaskNode.end,
        task.code
      );
      //节点重复，但是任务不重复
      if (check.nodeDuplicate && !check.taskDuplicate) {
        //后面没有挂起工作，则添加一个挂起工作防止重复
        //创建后挂起边
        this._createEdge(
          eHangEdgeStart,
          eHangEdgeEnd,
          TASK_TYPE$1.HANG,
          task.isCriticalTask,
          eHangTaskCode,
          {
            taskType: TASK_TYPE$1.HANG_TEXT,
            hangTime: startHangTime,
          }
        );
        taskEdgeEnd.node = eHangTaskCode;
        taskEdgeEnd.time = taskEndDate;
      }
    }
    //创建任务
    this._createEdge(
      taskEdgeStart,
      taskEdgeEnd,
      TASK_TYPE$1.REAL,
      task.isCriticalTask,
      task.code,
      task
    );
    //console.log(sHangEdgeStart, sHangEdgeEnd, taskEdgeStart, taskEdgeEnd, eHangEdgeStart, eHangEdgeEnd);
  }
  //创建边
  _createEdge(nodeStart, nodeEnd, type, isCriticalTask, taskCode, task) {
    let vertexLeft = this._createVertex(
      nodeStart.node,
      nodeStart.time,
      nodeStart.critical
    );
    let vertexRight = this._createVertex(
      nodeEnd.node,
      nodeEnd.time,
      nodeEnd.critical
    );
    let newEdge = new Edge(
      vertexLeft,
      vertexRight,
      type,
      isCriticalTask,
      taskCode,
      task
    );
    this.addEdge(newEdge);
    if (type === TASK_TYPE$1.REAL) {
      task.isCreated = true;
    }
  }

  //修改任务的连接节点
  _modifyTaskNode(task, node1, node2) {
    //先判断修改后的节点是否有重复
    let hasNodeToNode = this.hasNodeToNode(node1, node2);
    if (hasNodeToNode);
    else {
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
    let startDate = task.start_date;
    let endDate = task.end_date;
    let taskCode = task.code;
    if (node1 === this.firstNode) {
      frontMaxEndTime = this.projectStartTime;
    }
    //console.log("TTT:", task.text);
    let _isCriticalTask = task.isCriticalTask
      ? task.isCriticalTask === "true"
        ? true
        : false
      : false;
    if (libs.dateDifferenceToDays(frontMaxEndTime, startDate).diff !== 0) {
      //console.log("--node1, node2, task", node1, node2, task);
      //前面添加一个挂起工作
      let hNodeCode = "H" + taskCode;
      let vertexLeft = this._createVertex(
        node1,
        frontMaxEndTime,
        _isCriticalTask
      );
      let vertexRight = this._createVertex(
        hNodeCode,
        startDate,
        _isCriticalTask
      );
      let newEdge = new Edge(
        vertexLeft,
        vertexRight,
        TASK_TYPE$1.HANG,
        _isCriticalTask,
        hNodeCode,
        task
      );
      this.addEdge(newEdge);
      console.log(node1, "---H-->", hNodeCode, vertexRight);
      node1 = hNodeCode;
    }
    let check = this.checkDuplicateNode(node1, node2, task.code);
    if (check.nodeDuplicate) {
      if (check.taskDuplicate) {
        console.log("不允许完全重复的添加任务");
      } else {
        //后面添加一个节点防止重复
        let vertexLeft = this._createVertex(node1, startDate, _isCriticalTask);
        let middleCode = "M" + taskCode;
        let vertexMiddle = this._createVertex(
          middleCode,
          endDate,
          _isCriticalTask
        );
        let newEdge = new Edge(
          vertexLeft,
          vertexMiddle,
          TASK_TYPE$1.REAL,
          _isCriticalTask,
          task.code,
          task
        );
        this.addEdge(newEdge);
        //console.log(node1, "----R--->", middleCode);
        let vertexRight = this._createVertex(node2, "", _isCriticalTask);
        newEdge = new Edge(
          vertexMiddle,
          vertexRight,
          TASK_TYPE$1.AVOID_REPETITION,
          _isCriticalTask,
          "A" + task.code,
          task
        );
        this.addEdge(newEdge);
        //console.log(middleCode, "---A-->", node2);
        task.isCreated = true;
        node2 = middleCode;
      }
    } else {
      //如果结束时间不等于最晚结束时间，需要添加挂起工作
      console.log(node1, "----RR--->", node2);
      let vertexLeft = this._createVertex(node1, startDate, _isCriticalTask);
      let vertexRight = this._createVertex(node2, endDate, _isCriticalTask);
      let newEdge = new Edge(
        vertexLeft,
        vertexRight,
        TASK_TYPE$1.REAL,
        _isCriticalTask,
        task.code,
        task
      );
      this.addEdge(newEdge);
      task.isCreated = true;
    }

    return {
      start: node1,
      end: node2,
    };
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
      {
        ret = {
          start: "1",
          end: this.lastNode,
        };
      }
    } else {
      if (task.isFirstTask) {
        {
          ret = {
            start: "1",
            end: "" + task.code + "E",
          };
        }
      } else if (task.isLastTask) {
        //结束
        {
          ret = {
            start: task.code + "",
            end: this.lastNode,
          };
        }
      } else {
        //普通
        ret = {
          start: "" + task.code + "S",
          end: "" + task.code + "E",
        };
      }
    }
    return ret;
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
        tasks: [],
      };
      this.arbitraryDummyEdge[flag].tasks.push(task);
    }
  }
  //添加虚工序
  _addDummyTask(key, aTaskCode, dummyInfo) {
    if (this.dummyTasks[key]) {
      if (this.dummyTasks[key][aTaskCode]);
      else {
        this.dummyTasks[key][aTaskCode] = {};
      }
    } else {
      this.dummyTasks[key] = {
        [aTaskCode]: {},
      };
    }
    this.dummyTasks[key][aTaskCode][dummyInfo.bTaskCode] = dummyInfo;

    if (this.dummyTasks2[aTaskCode]);
    else {
      this.dummyTasks2[aTaskCode] = {};
    }
    this.dummyTasks2[aTaskCode][
      aTaskCode + "-" + dummyInfo.bTaskCode
    ] = dummyInfo;
  }
  //添加虚边
  addDummyEdge(startNode, endNode, code, option) {
    let vertexLeft = this._createVertex(startNode, "", false);
    let vertexRight = this._createVertex(endNode, "", false);
    let critical = vertexLeft.critical && vertexRight.critical;
    let newEdge = new Edge(
      vertexLeft,
      vertexRight,
      TASK_TYPE$1.DUMMY,
      critical,
      code,
      option
    );
    this.addEdge(newEdge);
  }
  getTaskInfo(taskCode) {
    taskCode = taskCode + "";
    if (taskCode == this.lastNode) {
      return {
        code: this.lastNode,
        fronts: this._getFronts(this.frontLinks, taskCode),
        frontsCode: this._getFronts(this.frontLinksCode, taskCode),
        follows: [],
        followsCode: [],
        startDate: "",
        endDate: "",
        weight: 0,
        text: this.lastNode,
        lag: 0,
        isFirst: false,
        isLast: true,
        isCriticalTask: false,
      };
    } else if (taskCode == "FIRST") {
      return {
        code: "FIRST",
        fronts: [],
        frontsCode: [],
        follows: this._getFronts(this.followLinks, taskCode),
        followsCode: this._getFronts(this.followLinksCode, taskCode),
        startDate: "",
        endDate: "",
        weight: 0,
        text: "FIRST",
        lag: 0,
        isFirst: true,
        isLast: false,
        isCriticalTask: false,
      };
    } else if (taskCode.indexOf("D") !== -1) {
      //虚节点
      return {
        code: taskCode,
        fronts: [],
        frontsCode: [],
        follows: [],
        followsCode: [],
        startDate: "",
        endDate: "",
        weight: 0,
        text: taskCode,
        lag: 0,
        isFirst: false,
        isLast: false,
        isCriticalTask: false,
      };
    } else {
      let tempTask = this.rawTasks[taskCode];
      if (tempTask) {
        tempTask.fronts = this._getFronts(this.frontLinks, taskCode);
        tempTask.frontsCode = this._getFronts(this.frontLinksCode, taskCode);
        tempTask.follows = this._getFronts(this.followLinks, taskCode);
        tempTask.followsCode = this._getFronts(this.followLinksCode, taskCode);
        return tempTask;
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
    console.log("print:", this);
  }
  //获取一个task的紧前工作
  _getFronts(frontLinks, taskCode) {
    let _f = frontLinks.get(taskCode);
    return _f ? _f : [];
  }
  //获取一个task的紧后工作
  _getFollows(followLinks, taskCode) {
    let _f = followLinks.get(taskCode);
    return _f ? _f : [];
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
    let index = this.getNumber();
    if (code === this.lastNode) {
      index = 9999;
    }
    if (code === this.lastNode) {
      xtime = this.projectEndTime;
    }
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
    return {
      endTasks: endTasks,
      startTasks: startTasks,
    };
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
          timeList[tempKey].push(item);
        } else {
          timeList[tempKey] = [];
          timeList[tempKey].push(item);
        }
      }
    });
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
      rawData: nodeTable,
      indexData: {},
      differenceData: {},
      nodes: {},
      tasks: {},
    };
    let libs = new Libs();
    let count = 0;
    let baseTime =
      libs.dateFormat("yyyy-MM-dd", this.projectStartTime) + " 00:00:00";
    //let baseTime = this.projectStartTime;
    for (const key in nodeTable) {
      let timeNodes = nodeTable[key];
      //let difference = libs.dateDifferenceToDays(baseTime, _dataTime).diff.toFixed(2);
      //jsonData.differenceData[difference] = timeNodes;
      for (let i = 0; i < timeNodes.length; i++) {
        let nodeCode = timeNodes[i].code;
        let inEdges = this.getOppositeNodeByNode(nodeCode);
        let outEdges = this.getNodeByNode(nodeCode);
        let differenceDiff = libs
          .dateDifferenceToDays(baseTime, timeNodes[i].xtime)
          .diff.toFixed(4);
        //let differenceDays = libs.dateDifferenceToDays(baseTime, timeNodes[i].xtime).days;
        //console.log(nodeCode, baseTime, timeNodes[i].xtime);
        //timeNodes[i].hoursOffset = libs.dateDifferenceToDays(_dataTime, timeNodes[i].xtime).hours;
        jsonData.differenceData[differenceDiff] = libs.dateFormat(
          "yyyy-MM-dd",
          timeNodes[i].xtime
        );
        if (jsonData.indexData[differenceDiff]) {
          jsonData.indexData[differenceDiff].push(nodeCode);
        } else {
          jsonData.indexData[differenceDiff] = [nodeCode];
        }
        jsonData.nodes[nodeCode] = {
          index: count,
          difference: differenceDiff,
          timeMark: key,
          in: inEdges,
          out: outEdges,
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

          if (vType === TASK_TYPE$1.DUMMY) {
            isDummy = true;
            //清除虚工作的option
            edgeVertexs[j].option = null;
            option = null;
          }
          //console.log(code, "---->", vEnd, "  :", isDummy, edgeVertexs[j]);
          info[vEnd] = {
            startCode: code,
            endCode: vEnd,
            type: vType,
            taskCode: taskCode,
            duration: edgeVertexs[j].option
              ? edgeVertexs[j].option.duration
              : 0,
            isDummy: isDummy,
            isCritical: vCritical,
            option: option,
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
            option: option,
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
    let frontNodes = new Map();
    for (const front in this.edges.items) {
      for (const back of this.edges.items[front]) {
        if (back === undefined) {
          continue;
        }
        let tempString = back.vertexEnd.toString();
        if (!frontNodes.has(tempString)) {
          frontNodes.set(tempString, []);
        }
        frontNodes.get(tempString).push(front);
      }
    }
    return frontNodes;
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
    }
    //布局其它路径
    if (firstCriticalPath.length === 0);
    else {
      let otherPaths = this.findedUnLayoutPaths([], firstCriticalPath); //console.log("@@@@@其它路径：", otherPaths);
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
    let viz = new Viz({
      workerURL: "./isv/sxzd/net_pic/net_pic/js/full.render.js",
    });
    let coordinate = new Coordinate(this, viz, factor);
    coordinate.createPlan(factor, (nodes, edges, option) => {
      callback(nodes, edges, option);
    });
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
        let nodes = find[i]; //节点列表
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
                }
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
        });
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
            _temp.splice(i, 1);
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
                if (increment.length > 0) {
                  //有交集，说明从这个交集节点有多条路径
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
                    forking[node] = [temp[i], temp[j]];
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
      forking: forking,
      separate: separate,
    };
  }

  //自测，节点是否已经全部处理
  testIsLayoutAllNode() {
    let allNode = this.edges.keys();
    let find = 0;
    for (let t = 0; t < allNode.length; t++) {
      let node = allNode[t];
      if (
        ((_node) => {
          let layoutNodes = this.pathToBlock;
          for (let i = 0; i < layoutNodes.length; i++) {
            let path = layoutNodes[i].path;
            //console.log(path);
            for (let j = 0; j < path.length; j++) {
              let pathNode = path[j];
              if (pathNode === _node) {
                return true;
              }
            }
          }
          return false;
        })(node)
      ) {
        find++;
      }
    }
    //console.log("------------------", find, allNode.length, "------------------");
    if (find === allNode.length) {
      //console.log("OK");
      return true;
    } else {
      return false;
    }
  }

  //一个路径当遇到有布局过的节点,则分段处理
  sectionPath(otherPath) {
    let _sectionPath = [];
    //console.log("_otherPath", otherPath);
    //找到已经布局过的节点
    let layoutNodesIndex = [];
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
    });
    return _sectionPath;
  }
  /**
   * 获取任务是否关键路径上的任务
   * @param {String||Object} task
   */
  _isCriticalTask(task) {
    if (typeof task === "object") {
      return task.isCriticalTask
        ? task.isCriticalTask === "true"
          ? true
          : false
        : false;
    } else {
      let _task = this.getTaskInfo(task);
      return _task.isCriticalTask
        ? _task.isCriticalTask === "true"
          ? true
          : false
        : false;
    }
  }
}

// export { ActivityOnArrowNetwork };
