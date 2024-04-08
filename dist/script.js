var canvas = document.createElement('canvas');
var start = document.getElementById('start');
var container = document.querySelector('.container');
container.appendChild(canvas);
var ctx = canvas.getContext('2d');
var dpr = window.devicePixelRatio;
var scoreContainer = document.querySelector('#score');
var globalRafTask = null;
var globalSlowRafTask = null;
var genShapeTaskId = null;
var working = false; // task 是否暂停
var isFinished = false; // 游戏是否结束
var isQuickMove = false; // 是否是快速移动
let keyDuration = 0;
let keydownDuration = 60; // 按钮事件触发时间间隔
let keyLeftDuration = 120; // 按钮事件触发时间间隔
function pause(event) {
  var w = canvas.width;
  if (working) {
    event.target.textContent = '开始';
  } else {
    event.target.textContent = '暂停';
  }
  working = !working;
}
function init() {
  working = false;
  start.textContent = '开始';
  isFinished = false;
  var total = 0;
  var unit = 0; // 每个矩形的大小
  var rows = 20; // 划分多少行
  var cols = 12; // 划分多少列
  var isClearFrame = false;
  function shape6() { // 底部三个
    this.points = [
      {
        x: 0,
        y: 0,
        isFixed: false,//不能移动、下次绘制必须绘制
      },
      {
        x: 0,
        y: 1,
        isFixed: false,
      },
      {
        x: 1,
        y: 1,
        isFixed: false,
      },
      {
        x: 2,
        y: 1,
        isFixed: false,
      }
    ]
    this.transform = function () {
      // 清空rets收集的
      for (var i = 0; i < this.points.length; i++) {
        var rect = this.points[i];
        var { x, y } = rect;
        if (rets[y]?.[x]) {
          rets[y][x] = null;
        }
      }
      switch (this.currentState) {
        case 0: // 旋转90deg
          this.points[0].x += 2;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[2].x -= 2;
            return;
          }
          break;
        case 1:
          this.points[0].y += 1;
          this.points[1].y -= 1;
          this.points[2].y -= 1;
          this.points[3].y -= 1;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[0].y -= 1;
            this.points[1].y += 1;
            this.points[2].y += 1;
            this.points[3].y += 1;
            return;
          }
          break;
        case 2:
          this.points[0].x -= 2;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[0].x += 2;
            return;
          }
          break;
        case 3:
          this.points[3].x -= 2;
          this.points[3].y += 2;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[3].x += 2;
            this.points[3].y -= 2;
            return;
          }
          break;
        case 4:
          this.points[0].x += 1;
          this.points[1].x += 1;
          this.points[3].x += 1;
          this.points[2].x -= 1;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[0].x -= 1;
            this.points[1].x -= 1;
            this.points[3].x -= 1;
            this.points[2].x += 1;
            return;
          }
          break;
        case 5:
          this.points[0].x -= 1;
          this.points[1].x -= 1;
          this.points[3].x -= 1;
          this.points[2].x += 1;
          this.points[2].y += 2;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[0].x += 1;
            this.points[1].x += 1;
            this.points[3].x += 1;
            this.points[2].x -= 1;
            this.points[2].y -= 2;
            return;
          }
          break;
        case 6:
          this.points[0].x += 1;
          this.points[1].x += 1;
          this.points[3].x += 1;
          this.points[2].x -= 1;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[0].x -= 1;
            this.points[1].x -= 1;
            this.points[3].x -= 1;
            this.points[2].x += 1;
            return;
          }
          break;
        case 7:
          this.points[0].x -= 1;
          this.points[1].x -= 1;
          this.points[1].y += 2;
          this.points[3].x += 1;
          this.points[2].x += 1;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[0].x += 1;
            this.points[1].x += 1;
            this.points[1].y -= 2;
            this.points[3].x -= 1;
            this.points[2].x -= 1;
            return;
          }
          break;
      }
      this.currentState = (this.currentState + 1) % 8; // 旋转90deg;
    };
    this.currentState = 0 // 四个状态
    this.length = 3;
  }
  function shape5() { // 底部两个
    this.points = [
      {
        x: 0,
        y: 0,
        isFixed: false,//不能移动、下次绘制必须绘制
      },
      {
        x: 0,
        y: 1,
        isFixed: false,
      },
      {
        x: 1,
        y: 1,
        isFixed: false,
      },
      {
        x: 1,
        y: 2,
        isFixed: false,
      }
    ]
    this.transform = function () {
      // 清空rets收集的
      for (var i = 0; i < this.points.length; i++) {
        var rect = this.points[i];
        var { x, y } = rect;
        if (rets[y]?.[x]) {
          rets[y][x] = null;
        }
      }
      switch (this.currentState) {
        case 0: // 旋转90deg
          this.points[2].x -= 2;
          this.points[3].y -= 2;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[2].x += 2;
            this.points[3].y += 2;
            return;
          }
          break;
        case 1:
          this.points[2].y--;
          this.points[3].y++;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[2].y++;
            this.points[3].y--;
            return;
          }
          break;
        case 2:
          this.points[2].x += 2;
          this.points[3].y += 2;
          this.points[2].y++;
          this.points[3].y--;
          this.points[0].x++;
          this.points[3].x--;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[2].x -= 2;
            this.points[3].y -= 2;
            this.points[2].y--;
            this.points[3].y++;
            this.points[0].x--;
            this.points[3].x++;
            return;
          }
          break;
        case 3:
          this.points[0].x--;
          this.points[3].x++;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[0].x++;
            this.points[3].x--;
            return;
          }
          break;
      }
      this.currentState = (this.currentState + 1) % 4; // 旋转90deg;
    };
    this.currentState = 0 // 四个状态
    this.length = 2;
  }
  function shape4() { // 土
    this.points = [
      {
        x: 1,
        y: 0,
        isFixed: false,//不能移动、下次绘制必须绘制
      },
      {
        x: 0,
        y: 1,
        isFixed: false,
      },
      {
        x: 1,
        y: 1,
        isFixed: false,
      },
      {
        x: 2,
        y: 1,
        isFixed: false,
      }
    ]
    this.transform = function () {
      // 清空rets收集的
      for (var i = 0; i < this.points.length; i++) {
        var rect = this.points[i];
        var { x, y } = rect;
        if (rets[y]?.[x]) {
          rets[y][x] = null;
        }
      }
      switch (this.currentState) {
        case 0: // 旋转90deg
          this.points[3].x--;
          this.points[3].y++;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[3].x++;
            this.points[3].y--;
            return;
          }
          break;
        case 1:
          this.points[1].x += 2;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[1].x -= 2;
            return;
          }
          break;
        case 2:
          this.points[3].x++;
          this.points[3].y--;
          this.points[1].x -= 2;
          this.points[0].y += 2;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[3].x--;
            this.points[3].y++;
            this.points[1].x += 2;
            this.points[0].y -= 2;
            return;
          }
          break;
        case 3:
          this.points[0].y -= 2;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[0].y += 2;
            return;
          }
          break;
      }
      this.currentState = (this.currentState + 1) % 4; // 旋转90deg;
    };
    this.currentState = 0 // 四个状态
    this.length = 3;
  }
  function shape3() { // 正方体
    this.points = [
      {
        x: 0,
        y: 0,
        isFixed: false,//不能移动、下次绘制必须绘制
      },
      {
        x: 1,
        y: 0,
        isFixed: false,
      },
      {
        x: 0,
        y: 1,
        isFixed: false,
      },
      {
        x: 1,
        y: 1,
        isFixed: false,
      }
    ]
    this.transform = function () { };
    this.length = 2;
  }
  function shape2() { // 横条
    this.points = [
      {
        x: 0,
        y: 0,
        isFixed: false,//不能移动、下次绘制必须绘制
      },
      {
        x: 1,
        y: 0,
        isFixed: false,
      },
      {
        x: 2,
        y: 0,
        isFixed: false,
      },
      {
        x: 3,
        y: 0,
        isFixed: false,
      }
    ]
    this.transform = function () {
      // 清空rets收集的
      for (var i = 0; i < this.points.length; i++) {
        var rect = this.points[i];
        var { x, y } = rect;
        if (rets[y]?.[x]) {
          rets[y][x] = null;
        }
      }
      switch (this.currentState) {
        case 0: // 旋转90deg
          this.points[0].x += 2;
          this.points[0].y -= 2;
          this.points[1].x++;
          this.points[1].y--;
          this.points[3].x--;
          this.points[3].y++;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[0].x -= 2;
            this.points[0].y += 2;
            this.points[1].x--;
            this.points[1].y++;
            this.points[3].x++;
            this.points[3].y--;
            return;
          }
          break;
        case 1:
          this.points[0].x -= 2;
          this.points[0].y += 2;
          this.points[1].x--;
          this.points[1].y++;
          this.points[3].x++;
          this.points[3].y--;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[0].x += 2;
            this.points[0].y -= 2;
            this.points[1].x++;
            this.points[1].y--;
            this.points[3].x--;
            this.points[3].y++;
            return;
          }
          break;
      }
      this.currentState = (this.currentState + 1) % 2; // 旋转90deg;
    }
    this.currentState = 0 // 两个个状态
    this.length = 4;
  }
  function shape1() {
    this.points = [
      {
        x: 0,
        y: 0,
        isFixed: false,//不能移动、下次绘制必须绘制
      },
      {
        x: 0,
        y: 1,
        isFixed: false,
      },
      {
        x: 0,
        y: 2,
        isFixed: false,
      },
      {
        x: 1,
        y: 2,
        isFixed: false,
      }
    ]
    this.transform = function () {
      // 清空rets收集的
      for (var i = 0; i < this.points.length; i++) {
        var rect = this.points[i];
        var { x, y } = rect;
        if (rets[y]?.[x]) {
          rets[y][x] = null;
        }
      }
      switch (this.currentState) {
        case 0: // 旋转90deg
          this.points[0].x++;
          this.points[1].x++;
          this.points[2].x++;
          this.points[3].x--;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[0].x--;
            this.points[1].x--;
            this.points[2].x--;
            this.points[3].x++;
            return;
          }
          break;
        case 1:
          this.points[3].y -= 2;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[3].y += 2;
            return;
          }
          break;
        case 2:
          this.points[0].x--;
          this.points[1].x--;
          this.points[2].x--;
          this.points[3].x++;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[0].x++;
            this.points[1].x++;
            this.points[2].x++;
            this.points[3].x--;
            return;
          }
          break;
        case 3:
          this.points[1].x -= 1;
          this.points[1].y -= 1;
          this.points[2].x += 1;
          this.points[2].y -= 1;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[1].x += 1;
            this.points[1].y += 1;
            this.points[2].x -= 1;
            this.points[2].y += 1;
            return;
          }
          // this.points[3].y += 2;
          // if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
          // 	this.points[3].y -= 2;
          // 	return;
          // }
          break;
        case 4:
          this.points[2].y -= 2;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[2].y += 2;
            return;
          }
          break;
        case 5:
          this.points[2].x -= 2;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[2].x += 2;
            return;
          }
          break;
        case 6:
          this.points[2].y += 2;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[2].y -= 2;
            return;
          }
          break;
        case 7:
          this.points[0].y--;
          this.points[1].x++;
          this.points[2].x++;
          this.points[3].y++;
          if (!checkCanTransform(this)) { // 先变形、如果发现不能变形、则还原
            this.points[0].y++;
            this.points[1].x--;
            this.points[2].x--;
            this.points[3].y--;
            return;
          }
          break;
      }
      this.currentState = (this.currentState + 1) % 8; // 旋转90deg;
    };
    this.currentState = 0 // 四个状态
    this.length = 2;
  }
  var shapes = [shape1, shape1, shape2, shape2, shape2, shape2,shape3, shape4, shape5, shape5, shape6, shape6, shape6];

  var shape = null; // 当前形状
  var rets = Array(rows).fill(0).map(i => Array(cols).fill(null));
  var isKeepMoving = false;
  document.onkeyup = () => {
    isKeepMoving = false;
  }
  document.onkeydown = function (e) { // 监听上下左右事件
    isKeepMoving = true;
    keyAction(e);
  }
  function keyAction(e) {
    if (!shape || isQuickMove || isClearFrame || !isKeepMoving) {
      return;
    }
    var _x = 0;
    var _y = 0;
    switch (e.keyCode) {
      case 32: // 空格 移动到最下面
        var maxGap = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < shape.points.length; i++) {// 计算能移动的最大距离
          var rect = shape.points[i];
          var { x, y } = rect;
          if (y == rows - 1 || (rets[y + 1]?.[x] && rets[y + 1][x].isFixed)) { // 到底了 or 下面有方块了、直接return
            return;
          }
          if (rets[y + 1]?.[x]) { // 当前方块下面存在兄弟节点、跳过
            continue;
          }
          var y1 = y + 1;
          while (y1 < rows) { // 找到第一个存在的
            if (rets[y1]?.[x]) {
              break;
            }
            y1++;
          }
          y1--;
          maxGap = Math.min(y1 - y, maxGap);
        }
        if (maxGap != Number.MAX_SAFE_INTEGER) {
          for (let i = 0; i < shape.points.length; i++) {
            var rect = shape.points[i];
            rect.y += maxGap;
          }
        }
        isQuickMove = true;
        return
      case 37: // 左
      case 65:
        keyDuration = keyLeftDuration;
        _x = -1;
        break;
      case 39: // 右
      case 68:
        keyDuration = keyLeftDuration;
        _x = 1;
        break;
      case 40: // 下
      case 83:
        keyDuration = keydownDuration;
        _y = 1;
        break;
      case 38:// 上 变形
      case 87:
        shape.transform();
        return;
    }
    if (!checkCanMove(shape, _x, _y)) {
      return;
    }
    for (var i = 0; i < shape.points.length; i++) {
      var rect = shape.points[i];
      rect.x += _x;
      rect.y += _y;
    }
    setTimeout(() => {
      keyAction(e);
    }, keyDuration)
  }
  // 是否可以变形
  function checkCanTransform(shape) {
    for (var i = 0; i < shape.points.length; i++) {
      var rect = shape.points[i];
      var { x, y } = rect;
      if (x < 0 || x > cols - 1 || y >= rows || (rets[y]?.[x] && rets[y][x].isFixed)
         ) {// 越界了 or 已经有格子了
        return;
      }
    }
    return true;
  }
  // 是否可以移动
  function checkCanMove(shape, _x, _y) {
    for (var i = 0; i < shape.points.length; i++) {
      var rect = shape.points[i];
      var { x, y } = rect;
      if (_x < 0 && (
        x <= 0 || (rets[y]?.[x - 1] && rets[y][x - 1].isFixed)
      )) {// 到最左侧了
        return;
      }
      if (_x > 0 && (
        x >= cols - 1 || (rets[y]?.[x + 1] && rets[y][x + 1].isFixed)
      )) { // 到最右侧了
        return;
      }
      if (_y > 0 && (
        y >= rows - 1 || (rets[y + 1]?.[x] && rets[y + 1][x].isFixed)
      )) { // 到底了
        return
      }
    }
    return true;
  }
  genShape(); // 生成一个shape
  resize(); // 初始化大小
  function tryToClearBlock() { // 尝试清除
    var added = 0;
    for (var i = rets.length - 1; i >= 0; i--) {// 检测是否要消除
      var shouldClear = true;
      for (var j = 0; j < rets[0].length; j++) {
        if (!rets[i][j]) { // 有空格 不应该清除
          shouldClear = false;
        }
      }
      if (shouldClear) {
        added++;
        break;
      }
    }
    let isToBottom = false;
    // 检查是否到底了 是否能移动
    for (var i = 0; i < shape.points.length; i++) {
      var rect = shape.points[i];
      var { x, y } = rect;
      if (y >= rows - 1 || (rets[y + 1]?.[x] && rets[y + 1][x].isFixed)) {// 到底了
        isToBottom = true;
        break;
      }
    }
    if (added > 0 && isToBottom) { // 延迟清除
      isClearFrame = true;
      shape = null;
      setTimeout(() => { // toDo 可以添加一个消除动画
        isClearFrame = false;
        var added = 0;
        for (var i = rets.length - 1; i >= 0; i--) {// 检测是否要消除
          var shouldClear = true;
          for (var j = 0; j < rets[0].length; j++) {
            if (!rets[i][j]) { // 有空格 不应该清除
              shouldClear = false;
            } else {
              rets[i][j].y += added;
            }
          }
          if (shouldClear) {
            rets[i] = Array(cols).fill(null); // 清空
            added++;
            total++;
            // 更新分数
            scoreContainer.textContent = `score： ${total}`;
          } else if (added > 0) {
            rets[i + added] = rets[i]; // 往下移动
            rets[i] = Array(cols).fill(null); // 清空当前行
          }
        }
        setTimeout(genShape, 250);
      }, 100)
    }
  }
  // 绘制任务
  function paintTask() {
    if (!working || !shape) { //继续注册任务 空转
      task(paintTask);
      return;
    }
    // 如何判断游戏结束
    if (isFinished) {
      // 满了 游戏结束
      working = false;
      alert('GAME OVER!');
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空
    _rets = Array(rows).fill(0).map(i => Array(cols).fill(null));
    if (isClearFrame) { // 消除帧
    } else { // 普通帧
      // 收集shape
      for (var i = 0; i < shape.points.length; i++) {
        var rect = shape.points[i];
        rect.y = Math.min(rect.y, rows - 1); // 保险措施
        if (rect.y < rows && rect.y >= 0) {
          _rets[rect.y][rect.x] = shape.points[i]; // 加入到新的一帧中
        }
      }
      // 收集上一帧的块
      for (var i = 0; i < rets.length; i++) {
        for (var j = 0; j < rets[0].length; j++) {
          if (rets[i][j] && rets[i][j].isFixed) {
            _rets[i][j] = rets[i][j];
          }
        }
      }
    }
    rets = _rets;
    tryToClearBlock(); // 检测是否有可以消除的行
    // 绘制
    for (var i = 0; i < rets.length; i++) {
      for (var j = 0; j < rets[0].length; j++) {
        if (rets[i][j]) {
          var rect = rets[i][j];
          var { x, y } = rect;
          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = rect.color;
          ctx.fillRect(x * unit / dpr, y * unit / dpr, unit / dpr, unit / dpr);
          ctx.strokeStyle = '#fff';
          ctx.strokeRect(x * unit / dpr, y * unit / dpr, unit / dpr, unit / dpr);
          ctx.restore();
        }
      }
    }
    task(paintTask);
  }
  // 移动任务
  function moveTask() {
    if (!working || !shape || isClearFrame) { //这三种情况下：继续注册任务 空转
      slowTask(moveTask);
      return;
    }
    let isToBottom = false;
    // 检查是否到底了 是否能移动
    for (var i = 0; i < shape.points.length; i++) {
      var rect = shape.points[i];
      var { x, y } = rect;
      if (y >= rows - 1 || (rets[y + 1]?.[x] && rets[y + 1][x].isFixed)) {// 到底了
        isToBottom = true;
        // 如果最小的y <= 0 则游戏结束
        var min_y = Number.MAX_SAFE_INTEGER;
        for (var j = 0; j < shape.points.length; j++) { // 寻找最上面的顶点
          var rect2 = shape.points[j];
          var { y: y2 } = rect2;
          min_y = Math.min(y2, min_y);
        }
        if (min_y <= 0) {
          isFinished = true;
          break;
        }
        //注册一个延迟任务去产生下一个方块
        setTimeout(genShape, 250);
        break;
      }
    }
    if (!isToBottom && !shape._new) {
      // 先移动
      for (var i = 0; i < shape.points.length; i++) {
        var rect = shape.points[i];
        rect.y += 1; // 往下移动一格
        rect.y = Math.min(rect.y, rows - 1); // 保险措施
      }
    }
    if (shape && shape._new) shape._new = false;
    slowTask(moveTask);
  }
  function slowTask(cb) {
    var k = 50;// 50帧绘制一次 控制下降速度
    cancelAnimationFrame(globalSlowRafTask);
    function inner() {
      k--;
      if (k <= 0) {
        cb();
      } else {
        globalSlowRafTask = requestAnimationFrame(inner);
      }
    }
    inner();
  }
  function task(cb) {
    var k = 2;// 1帧绘制一次、k最小为2 可调整频率
    cancelAnimationFrame(globalRafTask);
    function inner() {
      k--;
      if (k <= 0) {
        cb();
      } else {
        globalRafTask = requestAnimationFrame(inner);
      }
    }
    inner();
  }
  function genShape() {
    // 固定已有的方块
    for (var i = 0; i < rets.length; i++) {
      for (var j = 0; j < rets[0].length; j++) {
        if (rets[i][j]) {
          rets[i][j].isFixed = true;
        }
      }
    }
    shape = new shapes[shapes.length * Math.random() | 0](); // 随机产生一个形状
    var color = getColor();
    var max = cols - shape.length + 1;
    var l = max * Math.random() | 0;
    for (var i = 0; i < shape.points.length; i++) {
      shape.points[i].color = color; // 颜色
      shape.points[i].x += l; // 位移
    }
    shape._new = true;
    isQuickMove = false;
  }
  function resize() {
    var h = window.innerHeight;
    unit = h / rows;
    canvas.height = h;
    canvas.width = unit * cols + 1;
    ctx.scale(dpr, dpr);
  }
  function getColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 75%)`;
  }
  window.onresize = resize;
  paintTask(); // 启动绘制任务
  moveTask();// 启动向下移动任务
}
init();