new Vue({
  delimiters: ["${", "}"],
  data: {
    setTimePanelShow: false,
    setCalendarPanelShow: false,
    editCalendarPanelShow: false,
    addExcPanelShow: false,
    pickerOptions: {
      disabledDate(time) {
        // return time.getTime() <= Date.now() - 24 * 60 * 60 * 1000
      }
    },
    form: {
      currentDate: Time.getCurrentFormatTime(false),
      schedule: 1,
      date: "",
      calendarName: '项目new项目日历'
    },
    // 当前选择的日历的信息
    selectedCalendar: {
      "calendarId": "792562908369259520",
      "calendarName": "项目new项目日历",
      "calendarType": "3",
      "selected": "true"
    },
    // 所有日历信息
    calendarData: [{
        "calendarId": "757708700617033728",
        "calendarName": "无休",
        "calendarType": "1",
        "selected": "false"
      },
      {
        "calendarId": "757712731527728128",
        "calendarName": "标准",
        "calendarType": "0",
        "selected": "false"
      },
      {
        "calendarId": "792562908369259520",
        "calendarName": "项目new项目日历",
        "calendarType": "3",
        "selected": "true"
      }
    ],
    currentYMD: new Date(), // 获取系统当前年月日 为date类型 时间戳
    currentYear: "", // 当前年
    currentMonth: "", // 当前月
    currentDay: "", // 当前日
    currentYearAndMonth: "", // 当前年月
    week: ["日", "一", "二", "三", "四", "五", "六"], // 日历渲染的周顺序
    legendText: ["非工作日", "工作日例外", "非工作日例外"], // 日历图例信息
    legendColors: ["#fff", "#F56C6C", "#5582f4", "#67C23A"], // 日历图例颜色
    projectCalendarData: {
      param: "72e35339-7b6e-496e-924d-e1a52bba3658",
      exceptionData: [{
        "cycleType": "0",
        "endTime": "2020-01-10",
        "exceptionId": "792565484175233024",
        "exceptionName": "a",
        "exceptionType": "3",
        "jgNumber": "1",
        "startTime": "2020-01-01"
      }],
      calendarData: []
    }, // 后台返回的日历信息
    renderDate: [], // 日历渲染所需数据
    tableExcData: [ // 例外表格渲染所需数据
      // {
      //   exceptionId: 'uuid', // 数据库中取出的例外的主键,新增的没有
      //   exceptionName: '月例外', // 例外名称
      //   exceptionType: 1, // 例外类型
      //   startTime: '2019-11-01', // 开始时间
      //   endTime: '2019-12-31', // 结束时间
      //   cycleType: '1', // 例外设置类型 (0:按天设置1:按周设置2:按月设置)
      //   jgNumber: 3, //按天设置时候的间隔,按周设置时候的间隔,按月设置时候每间隔几月
      //   weekChecks: [0, 1], // 按周设置时候选择的星期数,(0-6日-六)
      //   isChange: "0", // 是否 0 : 新增   1: 修改  2: 删除
      //   monthIndex: 1, // 按月设置时候 每月第1个周几
      // }
    ],
    tableExcDataSelection: [], // 例外表格数据的多选结果
    editCalendarName: "", // 新增/编辑 绑定的日历名称
    editExcId: "", //新增/编辑例外 id
    currentClickedExcIsChange: null, // 标记当前点击例外信息是否为刚才新增的
    editExcName: "", // 新增/编辑例外 输入的例外名称
    editExcType: "1", // 新增/编辑例外 所选例外类型 默认1 工作日例外
    editExcTypeOption: [{
        excTypeName: "工作日例外",
        typeNum: "1"
      },
      {
        excTypeName: "非工作日例外",
        typeNum: "2"
      }
    ],
    pickedDateRange: [], // 新增/编辑例外 所选日期范围
    cycleType: "0", // 新增/编辑例外 所选循环类型  0按天  1按周  2按月
    stepDay: 0, // 新增/编辑例外 所选循环类型为0时 间隔
    stepWeek: 0, // 新增/编辑例外 所选循环类型为1时 间隔
    stepMonth: 0, // 新增/编辑例外 所选循环类型为2时 间隔
    weekChecked: [], // 新增/编辑例外 所选一周内的那几天
    selectedWeekInOneMonth: 1, // 新增/编辑例外 所选一个月的第几周 默认为第一周
    weeksInOneMonth: [{
        weekText: "第一个",
        weekIndex: 1
      },
      {
        weekText: "第二个",
        weekIndex: 2
      },
      {
        weekText: "第三个",
        weekIndex: 3
      },
      {
        weekText: "第四个",
        weekIndex: 4
      },
      {
        weekText: "第五个",
        weekIndex: 5
      },
    ],
    selectedDayInOneWeek: 0, // 新增/编辑例外 所选一周内的周几  默认为周日
    daysInOneWeek: [{
        dayText: "周日",
        dayIndex: 0
      },
      {
        dayText: "周一",
        dayIndex: 1
      },
      {
        dayText: "周二",
        dayIndex: 2
      },
      {
        dayText: "周三",
        dayIndex: 3
      },
      {
        dayText: "周四",
        dayIndex: 4
      },
      {
        dayText: "周五",
        dayIndex: 5
      },
      {
        dayText: "周六",
        dayIndex: 6
      },
    ],
    currentExcOperateFlag: null, // 标记当前例外操作的状态  0新增  1编辑  2删除
    currentCalOperateFlag: null, // 标记当前日历操作的状态  0新增  1编辑  2删除
    currentClickedExcIndex: null, // 标记当前所点击例外的index
    excDataWillBeSend: {
      calendarId: "",
      calendarName: "",
      calendarChange: null,
      exArr: []
    } // 将要发送到后台保存的例外数据
  },
  components: {},
  created() {
    this.initCurrentDate()
    this.projectCalendarData.calendarData = this.initSelectedMonthDays(this.currentYearAndMonth)
    var excArr = [{
        exceptionId: 'uuid', // 数据库中取出的例外的主键,新增的没有
        exceptionName: '月例外', // 例外名称
        exceptionType: 3, // 例外类型
        startTime: '2020-01-01', // 开始时间
        endTime: '2020-07-31', // 结束时间
        cycleType: '0', // 例外设置类型 (0:按天设置1:按周设置2:按月设置)
        jgNumber: 1, //按天设置时候的间隔,按周设置时候的间隔,按月设置时候每间隔几月
        weekChecks: [4], // 按周设置时候选择的星期数,(0-6日-六)
        isChange: "0", // 是否 0 : 新增   1: 修改  2: 删除
        monthIndex: 1, // 按月设置时候 每月第1个周几
      },
      {
        exceptionId: 'uuid', // 数据库中取出的例外的主键,新增的没有
        exceptionName: '月例外', // 例外名称
        exceptionType: 4, // 例外类型
        startTime: '2020-01-01', // 开始时间
        endTime: '2021-01-01', // 结束时间
        cycleType: '1', // 例外设置类型 (0:按天设置1:按周设置2:按月设置)
        jgNumber: 1, //按天设置时候的间隔,按周设置时候的间隔,按月设置时候每间隔几月
        weekChecks: [0, 6], // 按周设置时候选择的星期数,(0-6日-六)
        isChange: "0", // 是否 0 : 新增   1: 修改  2: 删除
        monthIndex: 1, // 按月设置时候 每月第1个周几
      },
      {
        exceptionId: 'uuid', // 数据库中取出的例外的主键,新增的没有
        exceptionName: '月例外', // 例外名称
        exceptionType: 3, // 例外类型
        startTime: '2020-01-01', // 开始时间
        endTime: '2025-07-31', // 结束时间
        cycleType: '2', // 例外设置类型 (0:按天设置1:按周设置2:按月设置)
        jgNumber: 1, //按天设置时候的间隔,按周设置时候的间隔,按月设置时候每间隔几月
        weekChecks: [4], // 按周设置时候选择的星期数,(0-6日-六)
        isChange: "0", // 是否 0 : 新增   1: 修改  2: 删除
        monthIndex: 1, // 按月设置时候 每月第1个周几
      }
    ]
    excArr.forEach(v => {
      this.renderDate = this.handleCalendarData(this.projectCalendarData.calendarData, v)
    })

  },
  mounted() {

  },
  methods: {
    // 为所选月份初始化基础例外的日历数据
    initSelectedMonthDays(yearAndMonth) {
      let dateDates = []
      let tempDate = new Date(yearAndMonth)
      let tempYear = tempDate.getFullYear()
      let tempMonth = tempDate.getMonth() + 1
      let daysInOneMonth = Time.howManyDays(tempYear, tempMonth) // 获取该年月有多少天
      for (let i = 1; i <= daysInOneMonth; i++) {
        let weekDay = new Date(yearAndMonth + "-" + i).getDay()
        if (weekDay === 0 || weekDay === 6) {
          // 周六和周日 设置dateType为"2"
          dateDates.push({
            workDate: yearAndMonth + "-" + i,
            dateType: "2"
          })
        } else {
          // 周一~周五 设置dateType为"1"
          dateDates.push({
            workDate: yearAndMonth + "-" + i,
            dateType: "1"
          })
        }
      }
      return dateDates
    },
    // 设置项目时间面板 监听项目开始或结束日期改变
    changeProjectStartOrEndDate(val) {
      console.log(val)
    },
    // 初始化年月日信息
    initCurrentDate() {
      this.currentYear = this.currentYMD.getFullYear()
      this.currentMonth = Number(this.currentYMD.getMonth()) + 1
      this.currentDay = this.currentYMD.getDate()
      this.currentYearAndMonth = this.currentYear + '-' + this.currentMonth
    },
    // 处理日期数据为日历数据
    handleCalendarData(dateData, exceptionalData) {
      if (dateData.length === 0) return
        // let _dateData = _.cloneDeep(dateData)
      let _dateData = dateData
      _dateData = this.addExcToDateStyle(_dateData, exceptionalData) // 添加例外
      _dateData = this.addNlAndBgcolor(_dateData) // 添加农历信息并根据dateType设置背景色
      _dateData = this.dateFix(_dateData) //不慢日期开始前和结束后的周信息
      let resData = this.cutArray(_dateData, 7) // 将每月天数按周切割
      return resData
    },
    // 为日历日期添加例外
    addExcToDateStyle(dateData, excData) {
      // var _this=this
      if (excData) {
        let data = null
        switch (excData.cycleType) {
          case "0": // 添加日间隔数据
            data = this.handleDaystep({
              dateDate: dateData,
              startTime: excData.startTime,
              endTime: excData.endTime,
              step: excData.jgNumber,
              excType: excData.exceptionType
            })
            break;
          case "1": // 添加周间隔数据
            data = this.handleWeekstep({
              dateDate: dateData,
              startTime: excData.startTime,
              endTime: excData.endTime,
              weekChecks: excData.weekChecks,
              step: excData.jgNumber,
              excType: excData.exceptionType
            })
            break;
          case "2":
            data = this.handleMonthstep({
              dateDate: dateData,
              startTime: excData.startTime,
              endTime: excData.endTime,
              weekChecks: excData.weekChecks,
              monthIndex: excData.monthIndex,
              step: excData.jgNumber,
              excType: excData.exceptionType
            })
            break;
          default:
            break;
        }
        return data
      }
    },
    // 处理日间隔
    handleDaystep({ dateDate, startTime, endTime, step, excType }) {
      // console.log("handleDaystep in>>>", dateDate)
      // debugger
      let dateRange = []
      for (v of dateDate) {
        if (!Time(v.workDate).isBetween(startTime, endTime)) continue
        dateRange.push(v.workDate)
      }
      let count = 1
      let result = [dateRange[0]]
      while ((step + 1) * count <= dateRange.length - 1) {
        result.push(dateRange[(step + 1) * count])
        count += 1
      }
      dateDate.forEach(function(fuck) {
          result.forEach(function(shit) {
            if (fuck.workDate === shit) {
              fuck.dateType = excType
            }
          })
        })
        // console.log("handleDaystep out>>>", dateDate)
        // debugger
      return dateDate
    },
    // 处理周间隔
    handleWeekstep({ dateDate, startTime, endTime, weekChecks, step, excType }) {
      // console.log("handleWeekstep in>>>", dateDate)
      // debugger
      let dateRange = []
      for (v of dateDate) {
        if (!Time(v.workDate).isBetween(startTime, endTime)) continue
        dateRange.push(v)
      }
      if (dateRange.length > 0) {
        dateRange = this.dateFix(dateRange)
        let weekRange = this.cutArray(dateRange, 7)
        console.log(weekRange)

        let count = 1
        let result = [weekRange[0]]
        while ((step + 1) * count <= weekRange.length - 1) {
          result.push(weekRange[(step + 1) * count])
          count += 1
        }
        result.forEach(function(fuck) {
          weekChecks.forEach(function(shit) {
            fuck[shit].dateType = excType
          })
        })
        result = result.flat(Infinity)
        dateDate.forEach(function(fuck) {
          result.forEach(function(shit) {
            if (shit.workDate !== "" && fuck.workDate === shit.workDate) {
              fuck.dateType = shit.dateType
            }
          })
        })
      }

      // console.log("handleWeekstep out>>>", dateDate)
      // debugger
      return dateDate
    },
    // 处理月间隔
    handleMonthstep({ dateDate, startTime, endTime, weekChecks, monthIndex, step, excType }) {
      // console.log("handleMonthstep in>>>", dateDate)
      // debugger
      let yearCrossed = []
      let yearStart = new Date(startTime).getFullYear()
      let yearEnd = new Date(endTime).getFullYear()
      for (let i = yearStart; i <= yearEnd; i++) {
        yearCrossed.push(i)
      }
      // 如果所选日期跨越多个年份 monthStart为第一个年份的开始月份 monthEnd为最有一个年份的结束月份
      let monthStart = new Date(startTime).getMonth() + 1
      let monthEnd = new Date(endTime).getMonth() + 1
      let resMonth = []
      let type_start = []
      let type_end = []
      let type_start_end = []
      let type_nomal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      for (let i = monthStart; i <= 12; i++) {
        type_start.push(i)
      }
      for (let i = 1; i <= monthEnd; i++) {
        type_end.push(i)
      }
      for (let i = monthStart; i <= monthEnd; i++) {
        type_start_end.push(i)
      }
      // 为跨越的年份补足月份
      if (yearCrossed.length > 1) {
        // 如果跨年份 比如["2020-06-01", "2025-07-30"]
        yearCrossed.forEach(function(fuck, fIndex) {
          if (fIndex === 0) {
            // 如果跨年份 第一年2020年从开始月份6月到12月
            resMonth.push({
              year: fuck,
              month: type_start
            })
          }
          if (fIndex === (yearCrossed.length - 1)) {
            // 如果跨年份 最后一年2025从1月到结束月份7月
            resMonth.push({
              year: fuck,
              month: type_end
            })
          }
          if (0 < fIndex && fIndex < yearCrossed.length - 1) {
            // 如果跨年份 中间月份都是从1月到11月
            resMonth.push({
              year: fuck,
              month: type_nomal
            })
          }
        })
      } else {
        // 如果所选日期都在同一年 就从所选日期开始月份到所选日期结束月份
        resMonth.push({
          year: yearCrossed[0],
          month: type_start_end
        })
      }
      // 为所选日期计算间隔月
      resMonth.forEach(function(fuck) {
        let index = 0
        let tempArr = []
        while (index * (step + 1) <= fuck.month.length - 1) {
          tempArr.push(fuck.month[index * (step + 1)])
          index++
        }
        fuck.month = tempArr
      })
      for (v of dateDate) {
        if (!Time(v.workDate).isBetween(startTime, endTime)) continue
        let tempDate = new Date(v.workDate) // 当前日期对象
        let tempYear = tempDate.getFullYear() //当前日期所属年
        let tempMonth = tempDate.getMonth() + 1 //当前日期所属月
        let tempDay = tempDate.getDate() //当前日期所属日
        let monthWeek = this.getMonthWeek(tempYear, tempMonth, tempDay) //当前日期所属当月的第几周
        let weekDay = tempDate.getDay() //当前日期是周几
        resMonth.forEach(function(fuck) {
          if (fuck.year === tempYear) {
            if (fuck.month.includes(tempMonth) && monthWeek === monthIndex && weekDay === weekChecks[0]) {
              v.dateType = excType
            }
          }
        })
      }
      // console.log("handleMonthstep out>>>", dateDate)
      // debugger
      return dateDate
    },
    //判断当前日期为当月第几周
    getMonthWeek(a, b, c) {
      //a = d = 当前日期
      //b = 6 - w = 当前周的还有几天过完(不算今天)
      //a + b 的和在除以7 就是当天是当前月份的第几周
      var date = new Date(a, parseInt(b) - 1, c),
        w = date.getDay(),
        d = date.getDate();
      return Math.ceil((d + 6 - w) / 7);
    },
    // 日期补全 用于日历显示
    dateFix(data) {
      let tempDate = new Date(data[0].workDate)
      let startFromWeek = tempDate.getDay() // 获取第一天从周几开始
        // 如果不是从周末开始  前修正 补全
      if (startFromWeek > 0) {
        let preFix = new Array(startFromWeek).fill({ workDate: "", dateType: 0 })
        data = preFix.concat(data)
      }
      // 按周分 最后一周不足七天的 后修正 补全
      let remainder = data.length % 7
      if (remainder > 0) {
        let sufFix = new Array(7 - remainder).fill({ workDate: "", dateType: 0 })
        data = data.concat(sufFix)
      }
      return data
    },
    //切割数组
    cutArray(array, size) {
      const length = array.length
      if (!length || !size || size < 1) {
        return []
      }
      let index = 0
      let resIndex = 0
      let result = new Array(Math.ceil(length / size))
      while (index < length) {
        result[resIndex++] = array.slice(index, (index += size))
      }
      return result
    },
    // 添加农历和背景色
    addNlAndBgcolor(data) {
      let _this = this
      data.forEach(function(fuck) {
        fuck.color = _this.legendColors[fuck.dateType - 1]
        if (fuck.workDate !== "") {
          let date = new Date(fuck.workDate)
          let year = date.getFullYear()
          let month = date.getMonth() + 1
          let day = date.getDate()
          fuck.day = day
          let nlData = calendar.solar2lunar(year, month, day)
          if (nlData.festival !== null) {
            fuck.wnl = nlData.festival
          } else if (nlData.IDayCn !== "初一") {
            fuck.wnl = nlData.IDayCn
          } else {
            fuck.wnl = nlData.IMonthCn
          }
        }
      })
      return data
    },
    // 监听设置项目日历 日历面板页面 选择月份改变
    changeMonth() {
      console.log(this.currentYearAndMonth)
        // 改变后 初始化所选月份的基础日历
      this.projectCalendarData.calendarData = this.initSelectedMonthDays(this.currentYearAndMonth)
        // 在该所选月的基础日历数据上添加例外信息 并返回给要渲染的数据
      var excArr = [{
          exceptionId: 'uuid', // 数据库中取出的例外的主键,新增的没有
          exceptionName: '月例外', // 例外名称
          exceptionType: 3, // 例外类型
          startTime: '2020-01-01', // 开始时间
          endTime: '2020-07-31', // 结束时间
          cycleType: '0', // 例外设置类型 (0:按天设置1:按周设置2:按月设置)
          jgNumber: 1, //按天设置时候的间隔,按周设置时候的间隔,按月设置时候每间隔几月
          weekChecks: [4], // 按周设置时候选择的星期数,(0-6日-六)
          isChange: "0", // 是否 0 : 新增   1: 修改  2: 删除
          monthIndex: 1, // 按月设置时候 每月第1个周几
        },
        {
          exceptionId: 'uuid', // 数据库中取出的例外的主键,新增的没有
          exceptionName: '月例外', // 例外名称
          exceptionType: 4, // 例外类型
          startTime: '2020-01-01', // 开始时间
          endTime: '2021-01-01', // 结束时间
          cycleType: '1', // 例外设置类型 (0:按天设置1:按周设置2:按月设置)
          jgNumber: 1, //按天设置时候的间隔,按周设置时候的间隔,按月设置时候每间隔几月
          weekChecks: [0, 6], // 按周设置时候选择的星期数,(0-6日-六)
          isChange: "0", // 是否 0 : 新增   1: 修改  2: 删除
          monthIndex: 1, // 按月设置时候 每月第1个周几
        },
        {
          exceptionId: 'uuid', // 数据库中取出的例外的主键,新增的没有
          exceptionName: '月例外', // 例外名称
          exceptionType: 3, // 例外类型
          startTime: '2020-01-01', // 开始时间
          endTime: '2025-07-31', // 结束时间
          cycleType: '2', // 例外设置类型 (0:按天设置1:按周设置2:按月设置)
          jgNumber: 1, //按天设置时候的间隔,按周设置时候的间隔,按月设置时候每间隔几月
          weekChecks: [4], // 按周设置时候选择的星期数,(0-6日-六)
          isChange: "0", // 是否 0 : 新增   1: 修改  2: 删除
          monthIndex: 1, // 按月设置时候 每月第1个周几
        }
      ]
      excArr.forEach(v => {
        this.renderDate = this.handleCalendarData(this.projectCalendarData.calendarData, v)
      })
    },
    openSetTime() {
      this.setTimePanelShow = true
    },
    closeSetTimePanel() {
      this.setTimePanelShow = false
    },
    openSetCalendar() {
      this.setCalendarPanelShow = true
      console.log()
    },
    setTimeConfirm() {
      console.log(this.form)
        // TODO 如果数据有改变 调接口发送数据到后台
        // 如果数据没改变 提示用户数据没变化
        // this.setTimePanelShow = false
    },
    setTimeCancel() {
      this.setTimePanelShow = false
    },
    closeSetCalendarPanel() {
      if (this.editCalendarPanelShow) return
      this.setCalendarPanelShow = false
    },
    // 修改/新增日历
    goEdit(bool) {
      if (bool) {
        //true 修改
        this.editCalendarName = this.selectedCalendar.calendarName
        this.currentCalOperateFlag = 1
        this.excDataWillBeSend.calendarChange = 1
        var data = [{
              "cycleType": "2",
              "endTime": "2020-01-10",
              "exceptionId": "800607266083449856",
              "exceptionName": "和规范化5",
              "exceptionType": "1",
              "jgNumber": "0",
              "monthIndex": "1",
              "startTime": "2020-01-01",
              "weekChecks": [
                "5"
              ]
            },
            {
              "cycleType": "0",
              "endTime": "2020-01-23",
              "exceptionId": "800610794533300224",
              "exceptionName": "news",
              "exceptionType": "2",
              "jgNumber": "0",
              "startTime": "2020-01-20"
            },
            {
              "cycleType": "1",
              "endTime": "2020-01-10",
              "exceptionId": "800645825184149504",
              "exceptionName": "a1",
              "exceptionType": "1",
              "jgNumber": "0",
              "startTime": "2020-01-01",
              "weekChecks": [
                "1",
                "6"
              ]
            }
          ] // 模拟后台提供的已有例外信息
        data.forEach(function(fuck, index) {
          fuck.index = index
          fuck.isChange = null
        })
        this.tableExcData = data
      } else {
        //false 新建.
        this.currentCalOperateFlag = 0
        this.excDataWillBeSend.calendarChange = 0
        this.tableExcData = []
        this.editCalendarName = ""
      }
      this.editCalendarPanelShow = true
    },
    // 关闭 修改/新增日历 面板
    closeEditCalendarPanel() {
      if (this.addExcPanelShow) return
      this.editCalendarPanelShow = false
    },
    addExc() {
      // 新增例外
      this.currentExcOperateFlag = 0 // 标记当前例外操作为新增操作
      this.currentClickedExcIndex = null
      this.addExcPanelShow = true
    },
    delExc() {
      // 删除例外
      var _this = this
      let data = _.cloneDeep(this.tableExcDataSelection)
      if (data.length === 0) return
      this.$confirm('请确认是否删除所选例外信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        // this.$refs.multipleTable.clearSelection();
        data.forEach(function(fuck) {
          // 判断选择的该条是已有的 还是此次新增的
          if (fuck.isChange === null || fuck.isChange === undefined) {
            fuck.isChange = 2
              //将删除的例外项添加到要发送到后台的数据里
            _this.excDataWillBeSend.exArr.push(fuck)
          }
          _this.tableExcData.forEach(function(shit, k) {
            if (shit.index === fuck.index) {
              _this.tableExcData.splice(k, 1)
            }
          })
        })
      })
    },
    editConfirm() {
      // 编辑确定
      var _this = this
      if (this.editCalendarName === "" || this.editCalendarName === null || this.editCalendarName == undefined) {
        this.$message.warning('日历名称不能为空');
        return
      }
      this.excDataWillBeSend.calendarId = this.selectedCalendar.calendarId
      this.excDataWillBeSend.calendarName = this.editCalendarName
      this.tableExcData.forEach(function(fuck) {
        if (fuck.isChange !== null) {
          _this.excDataWillBeSend.exArr.push(fuck)
        }
      })
      console.log("将要发送到后台保存的例外信息>>>", this.excDataWillBeSend)
      if (this.excDataWillBeSend.exArr.length === 0) {
        this.$message.warning('例外信息没有任何改动');
      } else {
        // TODO 调接口发送例外信息到后台进行保存
      }
      this.resetExcDataWillBeSend() // 确定后重置 要发送的数据
      this.editCalendarPanelShow = false // 关闭日历编辑/新增面板
    },
    editCancel() {
      // 编辑取消
      var _this = this

      // 如果有改动  取消时提示确认取消
      if (this.excDataWillBeSend.exArr.length !== 0) {
        this.$confirm('例外信息有改动, 请确认是否取消?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          _this.resetExcDataWillBeSend() // 取消后重置 要发送的数据
          _this.editCalendarPanelShow = false // 关闭日历编辑/新增面板
        })
      } else {
        _this.editCalendarPanelShow = false // 关闭日历编辑/新增面板
      }
    },
    resetExcDataWillBeSend() {
      // 重置 要发送的数据
      this.excDataWillBeSend.calendarId = ""
      this.excDataWillBeSend.calendarName = ""
      this.excDataWillBeSend.calendarChange = null
      this.excDataWillBeSend.exArr = []
    },
    closeaddExcPanel() {
      this.addExcPanelShow = false
    },
    handleSelectionChange(val) {
      // 获取勾选的要删除的例外项
      this.tableExcDataSelection = val
      console.log("多选>>", this.tableExcDataSelection)

    },
    addExcConfirm() {
      // 添加例外 确定
      // 判断必填项是否已填
      if (this.editExcName === "") {
        this.$message.error('请添加例外名称');
        return
      }
      if (this.pickedDateRange.length === 0) {
        this.$message.error('请选择日期范围');
        return
      }
      if (this.cycleType === "1" && this.weekChecked.length === 0) {
        this.$message.error('请选择要例外的周日期');
        return
      }
      let tempExcData = {
        exceptionId: "",
        exceptionName: this.editExcName,
        exceptionType: this.editExcType,
        startTime: this.pickedDateRange[0],
        endTime: this.pickedDateRange[1],
        cycleType: this.cycleType,
        jgNumber: 0,
        weekChecks: [],
        // isChange: this.currentExcOperateFlag,
        monthIndex: 1,
      }
      tempExcData.isChange = this.currentClickedExcIsChange === 0 ? 0 : this.currentExcOperateFlag
      switch (this.cycleType) {
        case "0":
          tempExcData.jgNumber = this.stepDay
          break;
        case "1":
          tempExcData.jgNumber = this.stepWeek
          tempExcData.weekChecks = this.weekChecked
          break;
        case "2":
          tempExcData.jgNumber = this.stepMonth
          tempExcData.monthIndex = this.selectedWeekInOneMonth
          tempExcData.weekChecks = []
          tempExcData.weekChecks.push(this.selectedDayInOneWeek)
          break;
      }
      console.log(this.currentExcOperateFlag)
      if (this.currentExcOperateFlag === 0) {
        // 如果是新增操作
        // 添加新增的例外信息到 例外表格信息
        tempExcData.exceptionId = ""
        tempExcData.index = this.tableExcData.length
        this.tableExcData.push(tempExcData)
      } else if (this.currentExcOperateFlag === 1) {
        // 如果是编辑操作
        tempExcData.exceptionId = this.editExcId // 将当前点击的例外的id赋值给当前编辑例外临时变量
        tempExcData.index = this.currentClickedExcIndex
        this.$set(this.tableExcData, this.currentClickedExcIndex, tempExcData) // 为当前点击的例外赋值
      }
      this.resetEditExcInfos()
      this.addExcPanelShow = false
    },
    addExcCancel() {
      // 添加例外 取消
      this.resetEditExcInfos()
      this.addExcPanelShow = false
    },
    excNameClick(row) {
      var _this = this
      console.log(row)
        // 点击例外名称跳转例外编辑  打开例外编辑面板  回填数据
      this.currentClickedExcIndex = row.index // 标记当前点击行的index
      this.currentClickedExcIsChange = row.isChange === 0 ? 0 : null // 标记当前点击例外信息是否为刚才新增的
      this.editExcId = row.exceptionId
      this.addExcPanelShow = true
      this.currentExcOperateFlag = 1 // 标记当前例外操作为编辑操作
      this.editExcName = row.exceptionName;
      this.pickedDateRange = [row.startTime, row.endTime]
      this.cycleType = row.cycleType
      this.stepDay = 0
      this.stepMonth = 0
      this.stepWeek = 0
      this.weekChecked = []
      this.selectedWeekInOneMonth = 1
      this.selectedDayInOneWeek = 0
      switch (row.cycleType) {
        case "0":
          this.stepDay = row.jgNumber
          break;
        case "1":
          this.stepWeek = row.jgNumber
          row.weekChecks.forEach(function(v) {
              _this.weekChecked.push(Number(v))
            })
            // this.weekChecked = row.weekChecks
          break;
        case "2":
          this.stepMonth = row.jgNumber
          this.selectedWeekInOneMonth = Number(row.monthIndex)
          this.selectedDayInOneWeek = Number(row.weekChecks[0])
          break;
      }
    },
    // 重置例外面板数据
    resetEditExcInfos() {
      this.editExcName = "";
      this.pickedDateRange = [];
      this.cycleType = "0";
      this.stepDay = 0;
      this.stepWeek = 0;
      this.stepMonth = 0;
      this.editExcType = "1";
      this.weekChecked = [];
      this.selectedWeekInOneMonth = 1
      this.selectedDayInOneWeek = 0
      this.editExcId = ""
    },
    handleWeekSelectChange(val) {
      console.log("change>>>", val)
    },
  }
}).$mount("#projectCalenderApp")