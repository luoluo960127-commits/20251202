// sprite sheets
let attackSheet, runSheet, jumpSheet, char2StandbySheet, char2RunSheet;
let char1Icon, char2Icon; // 虛擬鍵盤的角色圖示
let char2SlideSheet, char2JumpSheet, char3Sheet; // 新增角色三的 sprite sheet
let char1SlideSheet;

// 背景圖片
let bgImage;

let char1MeetSheet, char2MeetSheet;

// 題庫相關
let questionTable;
let questions = [];
let currentQuestion = null; // 用於儲存當前正在進行的題目

// 畫格尺寸 (Frame dimensions) - 根據圖片實際尺寸修正
const ATTACK_FRAME_W = 50; // 角色1 攻擊圖檔: 395px / 5幀 = 79px
const RUN_FRAME_W = 45;    // 角色1 跑步圖檔: 474px / 6幀 ~= 79px
const JUMP_FRAME_W = 38;   // 角色1 跳躍圖檔: 200px / 4幀 = 50px
const CHAR2_STANDBY_FRAME_W = 66; // 角色2 待機圖檔: 250px / 5幀 = 50px
const CHAR2_RUN_FRAME_W = 61; // 角色2 跑步圖檔: 350px / 7幀 = 50px
const FRAME_H = 70;
const ATTACK_FRAMES = 5;
const RUN_FRAMES = 6;
const JUMP_FRAMES = 4;
const CHAR2_STANDBY_FRAMES = 5;
const CHAR2_RUN_FRAMES = 7;
const CHAR2_SLIDE_FRAMES = 5; // 2-滑鏟/2-all滑鏟.png 內含 5 張
const CHAR2_JUMP_FRAMES = 4; // 2-跳躍/2-跳躍all.png 內含 4 張
const CHAR1_SLIDE_FRAMES = 6; // 1-滑鏟/1-滑鏟all.png 內含 6 張
const CHAR1_SLIDE_FRAME_W = 50; // 角色1 滑鏟幀寬（待調）

// 角色三相關
const CHAR3_FRAMES = 7; // 角色三的幀數 (問題1all.png 內含 7 張)
const CHAR3_FRAME_W = 50; // 角色三的幀寬（待根據實際圖片調整）

const CHAR1_MEET_FRAMES = 5; // 1-相遇/1-相遇all.png 內含 5 張
const CHAR2_MEET_FRAMES = 6; // 2-相遇/2-相遇all.png 內含 6 張

// 動畫計時與速度控制（數字越小越快）
// 使用毫秒穩定計時來控制逐格播放（更像跑馬燈）
let currentIdx = 0;
let lastChange = 0;
let char3CurrentIdx = 0; // 角色三的當前幀索引
let char3LastChange = 0; // 角色三上次幀變化的時間
let attackDuration = 120; // 每幀毫秒（待機/攻擊）
let runDuration = 80; // 每幀毫秒（跑步）
let jumpDuration = 100; // 每幀毫秒（跳躍）
let char2StandbyDuration = 150; // 角色2 待機速度
let char2RunDuration = 90; // 角色2 跑步速度
let char2SlideDuration = 80; // 角色2 滑鏟每幀毫秒
let char2SlideSpeed = 6; // 滑鏟時前進速度（可調）
let char2JumpDuration = 100; // 角色2 跳躍每幀毫秒
let char1SlideDuration = 80; // 角色1 滑鏟每幀毫秒
let char3Duration = 100; // 角色三每幀毫秒
let char1SlideSpeed = 5; // 角色1 滑鏟前進速度（可調）
let char1MeetFrameDuration = 100;
let char2MeetFrameDuration = 100;

let meetStart = 0;
let meetPlaying = false;
let prevMode1 = null;
let prevMode2 = null;
// 對話框狀態：相遇時顯示
let showDialog = false;
let dialogStart = 0;
let dialogDuration = 5000; // 毫秒，延長顯示時間
let char1DialogText = ''; // 改為動態載入
// 輸入與角色2 對話狀態
let cnv = null;
let inputElem = null;
let showInput = false;
let char2DisplayText = '';
let showDialog2 = false;
let dialogStart2 = 0;
let dialogDuration2 = 5000; // 5 秒

// -- 角色1 狀態 --
let mode = 'attack';
let char1X, char1Y;
let char1Facing = 1;
let char1VelocityY = 0;
let char1IsJumping = false;

// -- 角色2 狀態 --
let mode2 = 'standby';
let char2X, char2Y;
let char2Facing = 1;
let char2VelocityY = 0;
let char2IsJumping = false;

// -- 角色3 狀態 --
let mode3 = 'idle'; // 角色三的模式
let char3X, char3Y;
let char3Facing = 1; // 角色三的方向

// -- 全域物理相關變數 --
let moveSpeed = 4;
let groundY;
let gravity = 0.6;
let jumpStrength = -15;
let worldOffset = 0; // 世界/攝影機的偏移量

// 角色二在螢幕上的固定位置
let char2ScreenX;

function preload() {
  // 載入所有角色的圖片資源
  attackSheet = loadImage('1-攻擊/1-all攻擊.png');
  runSheet = loadImage('1/all.png');
  char1SlideSheet = loadImage('1-滑鏟/1-滑鏟all.png');

  // 載入背景圖
  bgImage = loadImage('4.png');
  char2StandbySheet = loadImage('2-待機/2-待機all.png');
  char2RunSheet = loadImage('2/all.png');
  char2SlideSheet = loadImage('2-滑鏟/2-all滑鏟.png');
  char2JumpSheet = loadImage('2-跳躍/2-跳躍all.png');
  char1MeetSheet = loadImage('1-相遇/1-相遇all.png');
  char1Icon = loadImage('1-攻擊/0.png'); // 預載入角色圖示
  char2Icon = loadImage('2-跳躍/1.png'); // 預載入角色2圖示
  char2MeetSheet = loadImage('2-相遇/2-相遇all.png');
  char3Sheet = loadImage('備用/問題1all.png'); // 載入角色三的 sprite sheet

  // 預載入題庫 CSV
  questionTable = loadTable('question.csv', 'csv');
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  noSmooth();

  // 初始化地面高度
  groundY = height / 2;

  // 初始化角色1位置（右側）
  char1X = (width * 3) / 4;
  char1Y = groundY;
  char1Facing = 1;

  // 初始化角色2位置（畫面中央）
  char2ScreenX = width / 2;
  char2X = char2ScreenX; // 角色2的世界座標從畫面中央開始
  char2Y = groundY;
  char2Facing = 1;

  // 初始化角色3位置（隨機位置）
  char3X = random(width);
  char3Y = groundY; // 假設也在地面上
  char3Facing = (random(1) > 0.5) ? 1 : -1; // 隨機方向

  // 解析題庫
  if (questionTable) {
    for (let r = 0; r < questionTable.getRowCount(); r++) {
      questions.push({
        question: questionTable.getString(r, 0),
        answer: questionTable.getString(r, 1),
        correctFeedback: questionTable.getString(r, 2),
        wrongFeedback: questionTable.getString(r, 3),
        hint: questionTable.getString(r, 4)
      });
    }
  }

  // 建立輸入元素，但預設隱藏（用於角色2）
  inputElem = createInput('', 'number'); // 設定 input 類型為數字
  inputElem.attribute('placeholder', '在此輸入...');
  inputElem.hide();
  inputElem.style('font-size', '16px');
  inputElem.style('padding', '6px');
  inputElem.style('border-radius', '6px');
  inputElem.style('border', '1px solid #333');
  // 按 Enter 提交
  inputElem.elt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      let val = inputElem.value().trim();
      inputElem.value('');
      inputElem.hide();
      showInput = false;
      // 檢查是否有當前問題且玩家有輸入
      if (currentQuestion && val.length > 0) {
        // 比對答案
        if (val === currentQuestion.answer) {
          char2DisplayText = currentQuestion.correctFeedback; // 答對的回饋
        } else {
          char2DisplayText = currentQuestion.wrongFeedback; // 答錯的回饋
        }
        showDialog2 = true;
        dialogStart2 = millis();
        // 隱藏角色1 對話
        showDialog = false;
        // 重置當前問題，以便下次可以出新題目
        currentQuestion = null;
      }
    }
  });
}

function draw() {
  // 在每一幀開始時清空畫布，解決背景殘影問題
  background('#f5ebe0');

  // --- 繪製可捲動的背景 ---
  if (bgImage && bgImage.width > 0) {
    const bgW = bgImage.width;
    const bgH = height; // 讓背景填滿整個畫布高度
    const scaleY = bgH / bgImage.height;
    const scaledBgW = bgW * scaleY;

    // --- 修正背景平鋪邏輯，確保無縫連接 ---
    // 計算從螢幕左邊緣需要的第一張圖的索引
    const startOffset = worldOffset % scaledBgW;
    const numTiles = Math.ceil(width / scaledBgW) + 2; // 計算需要多少張圖才能填滿螢幕，並額外加2張以防萬一

    // 從螢幕左側之外的一張圖開始繪製，確保完全覆蓋
    for (let i = -1; i < numTiles - 1; i++) {
      image(bgImage, startOffset + i * scaledBgW, height / 2, scaledBgW, bgH);
    }
  }

  // 左右控制說明
  push();
  textSize(24);
  fill(0);
  textAlign(LEFT, TOP);
  text('角色一使用wasd鍵控制', 20, 20);
  textAlign(RIGHT, TOP);
  text('角色二:使用上下左右鍵控制', width - 20, 20);
  pop();

  // 若正在播放相遇動畫，檢查是否結束
  if (meetPlaying) {
    let meetTotal = max(CHAR1_MEET_FRAMES * char1MeetFrameDuration, CHAR2_MEET_FRAMES * char2MeetFrameDuration);
    if (millis() - meetStart >= meetTotal) {
      meetPlaying = false;
      mode = prevMode1 || 'standby';
      mode2 = prevMode2 || 'standby';
      currentIdx = 0;
      lastChange = millis();
      // 相遇結束時隱藏角色1對話
      showDialog = false;
    }
  } else {
    // 若未在相遇狀態，檢查角色三與角色二是否碰撞以啟動相遇動畫
    let dx = abs(char3X - char2X);
    let dy = abs(char3Y - char2Y);
    let collideThresholdX = 120; // 可微調
    let collideThresholdY = 40;
    if (dx <= collideThresholdX && dy <= collideThresholdY && !showDialog2) { // 只有在沒有顯示回饋時才觸發
      if (!meetPlaying) { // 避免重複觸發
        // 啟動相遇（角色二播放相遇動畫，角色三維持 idle）
        prevMode2 = mode2;
        mode2 = 'meet2';
        meetStart = millis();
        meetPlaying = true;
        currentIdx = 0;
        lastChange = millis();

        // 如果當前沒有題目，才從題庫中隨機選一題
        if (questions.length > 0 && !currentQuestion) {
          let randomIndex = floor(random(questions.length));
          currentQuestion = questions[randomIndex];
          // 將題目設定為對話文字
          char1DialogText = currentQuestion.question;
        }
        // 啟動角色三的對話顯示
        if (currentQuestion && !showDialog2) { // 同樣檢查回饋是否顯示中
          showDialog = true;
          dialogStart = millis();
          // 顯示並聚焦輸入元素給玩家輸入（角色2）
          showInput = true;
          inputElem.show();
          // 將 input 定位到角色2 上方（稍後在 draw 中會更新位置以保持同步）
          setTimeout(()=>{ try{ inputElem.elt.focus(); } catch(e){} }, 80);
        }
      }
    }
  }

  // 同時繪製兩個角色
  drawCharacter1();
  drawCharacter2();
  drawCharacter3(); // 繪製角色三

  // 若需要顯示相遇對話框（角色1）
  if (showDialog && millis() - dialogStart < dialogDuration) {
    // 對話框位置：在角色三上方
    let boxX = char3X + worldOffset; // 顯示在角色三頭上 (加上世界偏移)
    let boxY = char1Y - 120;
    let boxW = 220;
    let boxH = 64;

    // 背景矩形（半透明）
    push();
    rectMode(CENTER);
    noStroke();
    fill(0, 150);
    rect(boxX, boxY, boxW, boxH, 10);
    pop();

    // 彩虹文字（使用 HSB 變換色相）
    push();
    textAlign(CENTER, CENTER);
    textSize(28);
    colorMode(HSB, 360, 100, 100, 1);
    let hue = (millis() / 8) % 360;
    fill(hue, 100, 100);
    noStroke();
    text(char1DialogText, boxX, boxY);
    pop();
  }

  // 如果 input 顯示中，更新它的位置（定位到角色2 上方）
  if (showInput && inputElem && cnv) {
    let rect = cnv.elt.getBoundingClientRect(); // 讓輸入框跟隨角色2
    const boxW = 220;
    const left = rect.left + char2ScreenX - boxW / 2; // 使用螢幕固定座標
    const top = rect.top + char2Y - 180;
    inputElem.position(left, top);
    inputElem.size(boxW - 12, 34);
  }

  // 顯示角色2 的歡迎對話（輸入後）
  if (showDialog2 && millis() - dialogStart2 < dialogDuration2) {
    let boxX = char3X + worldOffset; // 回饋訊息顯示在角色三頭上 (加上世界偏移)
    let boxY = char3Y - 120;
    let boxW = 260;
    let boxH = 64;
    push();
    rectMode(CENTER);
    noStroke();
    fill(255, 230);
    rect(boxX, boxY, boxW, boxH, 10);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(char2DisplayText, boxX, boxY);
    pop();
  } else {
    // 超過時間後隱藏
    if (showDialog2 && millis() - dialogStart2 >= dialogDuration2) {
      showDialog2 = false;
      showDialog = false;
    }
  }

  // 在所有元素繪製完畢後，繪製虛擬鍵盤
  drawVirtualKeyboard();
  drawVirtualKeyboardWASD();
}

function drawCharacter1() {
  // 檢查是否按住右方向鍵（持續按住則跑步）
  let wantRun = (keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW)) && !char1IsJumping;
  let wantSlide = keyIsDown(DOWN_ARROW);
  
  // 決定當前模式（相遇優先）
  let newMode;
  if (meetPlaying && mode === 'meet1') {
    newMode = 'meet1';
  } else if (char1IsJumping) {
    newMode = 'jump';
  } else if (wantSlide) {
    newMode = 'slide';
  } else if (wantRun) {
    newMode = 'run';
  } else {
    newMode = 'attack';
  }

  // --- 物理與位置更新 ---
  // 套用重力
  char1VelocityY += gravity;
  char1Y += char1VelocityY;

  // 如果角色落地
  if (char1Y >= groundY) {
    char1Y = groundY;
    char1VelocityY = 0;
    char1IsJumping = false;
  }

  // 如果正在跑步或滑鏟，更新角色位置和方向
  if (wantRun && !char1IsJumping && !wantSlide) {
    if (keyIsDown(LEFT_ARROW)) {
      char1X -= moveSpeed;
      char1Facing = -1; // 朝左
    } else if (keyIsDown(RIGHT_ARROW)) {
      char1X += moveSpeed;
      char1Facing = 1; // 朝右
    }
  }

  // 如果在滑鏟，讓角色往 facing 方向持續前進
  if (wantSlide && !char1IsJumping) {
    char1X += char1Facing * char1SlideSpeed;
  }

  // --- 動畫狀態管理 ---
  // 模式切換時重置索引與計時，避免跳幀
  if (newMode !== mode) {
    mode = newMode;
    currentIdx = 0;
    lastChange = millis();
  }

  // 選擇對應的幀數長度與間隔（毫秒）
  let framesLength, duration, sheet, fallbackFrameW;
  if (mode === 'run') {
    framesLength = RUN_FRAMES; duration = runDuration; sheet = runSheet; fallbackFrameW = RUN_FRAME_W;
  } else if (mode === 'jump') {
    framesLength = JUMP_FRAMES; duration = jumpDuration; sheet = jumpSheet; fallbackFrameW = JUMP_FRAME_W;
  } else if (mode === 'slide') {
    framesLength = CHAR1_SLIDE_FRAMES; duration = char1SlideDuration; sheet = char1SlideSheet; fallbackFrameW = CHAR1_SLIDE_FRAME_W;
  } else if (mode === 'meet1') {
    framesLength = CHAR1_MEET_FRAMES; duration = char1MeetFrameDuration; sheet = char1MeetSheet; fallbackFrameW = CHAR1_SLIDE_FRAME_W;
  } else { // 'attack'
    framesLength = ATTACK_FRAMES; duration = attackDuration; sheet = attackSheet; fallbackFrameW = ATTACK_FRAME_W;
  }

  // 動態計算每幀寬與高（若圖片已載入）
  let currentFrameW, currentFrameH;
  if (sheet && sheet.width && framesLength > 0) {
    currentFrameW = sheet.width / framesLength;
  } else {
    currentFrameW = fallbackFrameW;
  }
  if (sheet && sheet.height) {
    currentFrameH = sheet.height;
  } else {
    currentFrameH = FRAME_H;
  }

  // 若超過間隔則切到下一幀（逐格更新）
  if (millis() - lastChange >= duration) {
    currentIdx = (currentIdx + 1) % framesLength;
    lastChange = millis();
  }

  let idx = currentIdx;

  // --- 繪圖 ---
  let maxTargetW = width * 0.25;
  let scaleFactor = maxTargetW / currentFrameW;
  if (scaleFactor > 2) scaleFactor = 2;
  if (scaleFactor < 0.3) scaleFactor = 0.3;
  let targetW = currentFrameW * scaleFactor;
  let targetH = currentFrameH * scaleFactor;

  // --- 繪圖區塊 ---
  push(); // 儲存當前的繪圖設定
  translate(char1X + worldOffset, char1Y); // 將畫布原點移動到角色位置 (加上世界偏移)
  scale(char1Facing, 1); // 根據 facing 變數翻轉 X 軸

  // 從對應的 spritesheet 取出子影格並繪製（確保來源矩形不會超出圖片範圍）
  idx = (framesLength > 0) ? (idx % framesLength) : 0;
  let sx = idx * currentFrameW;
  if (sheet && sheet.width) {
    // 夾住來源 x，使其不會超出圖片右邊界
    if (sx + currentFrameW > sheet.width) sx = Math.max(0, sheet.width - currentFrameW);
  } else {
    sx = 0;
  }
  image(sheet, 0, 0, targetW, targetH, sx, 0, currentFrameW, currentFrameH);
  pop(); // 恢復到儲存的繪圖設定
}

function drawCharacter2() {
  // WASD 控制：W=上, A=左, D=右, S=下
  let wantRun = keyIsDown(65) || keyIsDown(68); // A(65) 或 D(68)
  let wantSlide = keyIsDown(83); // S(83)

  // --- 跳躍物理（若正在跳躍） ---
  if (char2IsJumping) {
    char2VelocityY += gravity;
    char2Y += char2VelocityY;

    // 落地判定
    if (char2Y >= groundY) {
      char2Y = groundY;
      char2VelocityY = 0;
      char2IsJumping = false;
      // 回到待機狀態
      mode2 = 'standby';
      currentIdx = 0;
      lastChange = millis();
    }
  } else {
    // 非跳躍期間將角色 Y 重置為地面
    char2Y = groundY;
  }

  // 優先處理跳躍（若正在跳躍）其餘行為再處理（相遇優先）
  let newMode;
  if (meetPlaying && mode2 === 'meet2') {
    newMode = 'meet2';
  } else if (char2IsJumping) {
    newMode = 'jump';
  } else if (wantSlide) {
    newMode = 'slide';
  } else if (wantRun) {
    newMode = 'run';
  } else {
    newMode = 'standby';
  }

  // 如果正在跑步或滑鏟，更新角色位置和方向
  // 現在只更新世界座標，並捲動背景
  if (wantRun && !wantSlide && !char2IsJumping) {
    if (keyIsDown(65)) { // A
      worldOffset += moveSpeed; // 背景向右移動
      char2X -= moveSpeed; // 角色在世界中向左移動
      char2Facing = -1; // 朝左
    } else if (keyIsDown(68)) { // D
      worldOffset -= moveSpeed; // 背景向左移動
      char2X += moveSpeed; // 角色在世界中向右移動
      char2Facing = 1; // 朝右
    }
  }
  // 若為滑鏟，讓角色往 facing 方向持續前進
  if (wantSlide && !char2IsJumping) {
    char2X += char2Facing * char2SlideSpeed;
  }

  // --- 動畫狀態管理 ---
  if (newMode !== mode2) {
    mode2 = newMode;
    currentIdx = 0;
    lastChange = millis();
  }

  // 選擇對應的幀數長度與間隔
  let framesLength, duration, currentFrameW, sheet;
  if (mode2 === 'run') {
    framesLength = CHAR2_RUN_FRAMES; duration = char2RunDuration; sheet = char2RunSheet;
  } else if (mode2 === 'slide') {
    framesLength = CHAR2_SLIDE_FRAMES; duration = char2SlideDuration; sheet = char2SlideSheet;
  } else if (mode2 === 'jump') {
    framesLength = CHAR2_JUMP_FRAMES; duration = char2JumpDuration; sheet = char2JumpSheet;
  } else if (mode2 === 'meet2') {
    framesLength = CHAR2_MEET_FRAMES; duration = char2MeetFrameDuration; sheet = char2MeetSheet;
  } else { // 'standby'
    framesLength = CHAR2_STANDBY_FRAMES; duration = char2StandbyDuration; sheet = char2StandbySheet;
  }

  // 如果能讀到 spritesheet 寬度，動態計算每幀寬度（較穩健）
  if (sheet && sheet.width) {
    currentFrameW = sheet.width / framesLength;
  } else {
    // 後備值（若尚未載入或無法讀取寬度）
    currentFrameW = CHAR2_STANDBY_FRAME_W;
  }

  // 若超過間隔則切到下一幀（逐格更新）
  if (millis() - lastChange >= duration) {
    currentIdx = (currentIdx + 1) % framesLength;
    lastChange = millis();
  }
  
  let idx = currentIdx;

  // --- 繪圖 ---
  let maxTargetW = width * 0.25;
  let scaleFactor = maxTargetW / currentFrameW;
  if (scaleFactor > 2) scaleFactor = 2;
  if (scaleFactor < 0.3) scaleFactor = 0.3;
  let targetW = currentFrameW * scaleFactor;
  let targetH = FRAME_H * scaleFactor;
  
  // --- 繪圖區塊 ---
  push();
  translate(char2ScreenX, char2Y); // 使用角色2的螢幕固定 X 座標
  scale(char2Facing, 1); // 翻轉角色方向

  // 從對應的 spritesheet 取出子影格並繪製（確保來源矩形不會超出圖片範圍）
  idx = (framesLength > 0) ? (idx % framesLength) : 0;
  let sx = idx * currentFrameW;
  let currentFrameH = FRAME_H;
  if (sheet && sheet.width) {
    if (sx + currentFrameW > sheet.width) sx = Math.max(0, sheet.width - currentFrameW);
  }
  if (sheet && sheet.height) currentFrameH = sheet.height;
  image(sheet, 0, 0, targetW, targetH, sx, 0, currentFrameW, currentFrameH);
  pop();
}

function drawCharacter3() {
  // 決定當前模式 (目前只有 idle)
  let newMode = 'idle'; // 角色三目前只有一個動畫模式

  // --- 動畫狀態管理 ---
  // 模式切換時重置索引與計時
  if (newMode !== mode3) {
    mode3 = newMode;
    char3CurrentIdx = 0;
    char3LastChange = millis();
  }

  // 選擇對應的幀數長度與間隔
  let framesLength, duration, sheet, fallbackFrameW;
  if (mode3 === 'idle') {
    framesLength = CHAR3_FRAMES;
    duration = char3Duration;
    sheet = char3Sheet;
    fallbackFrameW = CHAR3_FRAME_W;
  } else {
    // 預設情況，以防 mode3 未知
    framesLength = CHAR3_FRAMES;
    duration = char3Duration;
    sheet = char3Sheet;
    fallbackFrameW = CHAR3_FRAME_W;
  }

  // 動態計算每幀寬與高
  let currentFrameW, currentFrameH;
  if (sheet && sheet.width && framesLength > 0) {
    currentFrameW = sheet.width / framesLength;
  } else {
    currentFrameW = fallbackFrameW;
  }
  if (sheet && sheet.height) {
    currentFrameH = sheet.height;
  } else {
    currentFrameH = FRAME_H; // 假設與其他角色共享 FRAME_H
  }

  // 若超過間隔則切到下一幀（逐格更新）
  if (millis() - char3LastChange >= duration) {
    char3CurrentIdx = (char3CurrentIdx + 1) % framesLength;
    char3LastChange = millis();
  }

  let idx = char3CurrentIdx;

  // --- 繪圖 ---
  // 調整角色大小，使其不會過大或過小
  let maxTargetW = width * 0.2; // 角色三可以稍微小一點
  let scaleFactor = maxTargetW / currentFrameW;
  if (scaleFactor > 1.5) scaleFactor = 1.5; // 限制最大縮放
  if (scaleFactor < 0.2) scaleFactor = 0.2; // 限制最小縮放
  let targetW = currentFrameW * scaleFactor;
  let targetH = currentFrameH * scaleFactor;

  push();
  translate(char3X + worldOffset, char3Y); // 加上世界偏移
  scale(char3Facing, 1); // 根據 facing 變數翻轉 X 軸

  // 從對應的 spritesheet 取出子影格並繪製
  idx = (framesLength > 0) ? (idx % framesLength) : 0;
  let sx = idx * currentFrameW;
  if (sheet && sheet.width && sx + currentFrameW > sheet.width) sx = Math.max(0, sheet.width - currentFrameW);
  image(sheet, 0, 0, targetW, targetH, sx, 0, currentFrameW, currentFrameH);
  pop();
}

function keyPressed() {
  // 角色1 的控制（方向鍵）
  // 跳躍：上鍵
  if (keyCode === UP_ARROW && !char1IsJumping) {
    char1IsJumping = true;
    char1VelocityY = jumpStrength;
  }
  
  // 角色2 的控制（WASD）
  // 跳躍：W(87)
  if (keyCode === 87 && !char2IsJumping) { // W
    char2IsJumping = true;
    char2VelocityY = jumpStrength;
    mode2 = 'jump';
    currentIdx = 0;
    lastChange = millis();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/**
 * 繪製右下角的虛擬方向鍵盤
 */
function drawVirtualKeyboard() {
  const scale = 1.5; // 放大倍率
  const keySize = 40 * scale;
  const keySpacing = 5 * scale;
  const cornerRadius = 5 * scale;
  const iconSize = 60;
  const iconPadding = 10;

  // 計算鍵盤的基準位置 (從右下角往左上角推算)
  const keyboardWidth = keySize * 3 + keySpacing * 2;
  const keyboardHeight = keySize * 2 + keySpacing;
  const baseX = width - keyboardWidth - 20; // 20px 是右邊距
  const baseY = height - keyboardHeight - 20;   // 20px 是下邊距

  // 定義顏色
  const baseColor = color(220);       // 未按下時的顏色
  const pressedColor = color(150);    // 按下時的顏色
  const arrowColor = color(0);        // 箭頭符號的顏色

  // --- 繪製角色圖示 ---
  if (char1Icon) {
    const iconX = baseX + keyboardWidth / 2;
    const iconY = baseY - iconSize / 2 - iconPadding;
    push();
    imageMode(CENTER);
    image(char1Icon, iconX, iconY, iconSize, iconSize);
    pop();
  }

  push();
  noStroke();

  // --- 繪製按鍵背景 ---
  // 上鍵
  fill(keyIsDown(UP_ARROW) ? pressedColor : baseColor);
  rect(baseX + keySize + keySpacing, baseY, keySize, keySize, cornerRadius);  
  // 下鍵
  fill(keyIsDown(DOWN_ARROW) ? pressedColor : baseColor);
  rect(baseX + keySize + keySpacing, baseY + keySize + keySpacing, keySize, keySize, cornerRadius);
  // 左鍵
  fill(keyIsDown(LEFT_ARROW) ? pressedColor : baseColor);
  rect(baseX, baseY + keySize + keySpacing, keySize, keySize, cornerRadius);
  // 右鍵
  fill(keyIsDown(RIGHT_ARROW) ? pressedColor : baseColor);
  rect(baseX + keySize * 2 + keySpacing * 2, baseY + keySize + keySpacing, keySize, keySize, cornerRadius);

  // --- 繪製箭頭符號 ---
  const arrowMargin = keySize * 0.25; // 箭頭與按鍵邊緣的距離
  const arrowTip = arrowMargin;
  const arrowBase = keySize - arrowMargin;
  fill(arrowColor);
  // 上
  triangle(baseX + keySize + keySpacing + keySize / 2, baseY + arrowTip, baseX + keySize + keySpacing + arrowMargin, baseY + arrowBase, baseX + keySize + keySpacing + arrowBase, baseY + arrowBase);
  // 下
  triangle(baseX + keySize + keySpacing + keySize / 2, baseY + keySize + keySpacing + arrowBase, baseX + keySize + keySpacing + arrowMargin, baseY + keySize + keySpacing + arrowTip, baseX + keySize + keySpacing + arrowBase, baseY + keySize + keySpacing + arrowTip);
  // 左
  triangle(baseX + arrowTip, baseY + keySize + keySpacing + keySize / 2, baseX + arrowBase, baseY + keySize + keySpacing + arrowMargin, baseX + arrowBase, baseY + keySize + keySpacing + arrowBase);
  // 右
  triangle(baseX + keySize * 2 + keySpacing * 2 + arrowBase, baseY + keySize + keySpacing + keySize / 2, baseX + keySize * 2 + keySpacing * 2 + arrowTip, baseY + keySize + keySpacing + arrowMargin, baseX + keySize * 2 + keySpacing * 2 + arrowTip, baseY + keySize + keySpacing + arrowBase);
  pop();
}

/**
 * 繪製左下角的虛擬 WASD 鍵盤
 */
function drawVirtualKeyboardWASD() {
  const scale = 1.5; // 放大倍率
  const keySize = 40 * scale;
  const keySpacing = 5 * scale;
  const cornerRadius = 5 * scale;
  const iconSize = 60;
  const iconPadding = 10;

  // 計算鍵盤的基準位置 (從左下角往右上角推算)
  const keyboardWidth = keySize * 3 + keySpacing * 2;
  const keyboardHeight = keySize * 2 + keySpacing;
  const baseX = 20; // 20px 是左邊距
  const baseY = height - keyboardHeight - 20;   // 20px 是下邊距

  // 定義顏色
  const baseColor = color(220);
  const pressedColor = color(150);
  const letterColor = color(0);

  // --- 繪製角色圖示 ---
  if (char2Icon) {
    const iconX = baseX + keyboardWidth / 2;
    const iconY = baseY - iconSize / 2 - iconPadding;
    push();
    imageMode(CENTER);
    image(char2Icon, iconX, iconY, iconSize, iconSize);
    pop();
  }

  push();
  noStroke();

  // --- 繪製按鍵背景 ---
  // W 鍵 (上)
  fill(keyIsDown(87) ? pressedColor : baseColor); // 87 is 'W'
  rect(baseX + keySize + keySpacing, baseY, keySize, keySize, cornerRadius);
  // S 鍵 (下)
  fill(keyIsDown(83) ? pressedColor : baseColor); // 83 is 'S'
  rect(baseX + keySize + keySpacing, baseY + keySize + keySpacing, keySize, keySize, cornerRadius);
  // A 鍵 (左)
  fill(keyIsDown(65) ? pressedColor : baseColor); // 65 is 'A'
  rect(baseX, baseY + keySize + keySpacing, keySize, keySize, cornerRadius);
  // D 鍵 (右)
  fill(keyIsDown(68) ? pressedColor : baseColor); // 68 is 'D'
  rect(baseX + keySize * 2 + keySpacing * 2, baseY + keySize + keySpacing, keySize, keySize, cornerRadius);

  // --- 繪製按鍵上的字母 ---
  fill(letterColor);
  textAlign(CENTER, CENTER);
  textSize(keySize * 0.6);
  textStyle(BOLD);
  // W
  text('W', baseX + keySize + keySpacing + keySize / 2, baseY + keySize / 2);
  // S
  text('S', baseX + keySize + keySpacing + keySize / 2, baseY + keySize + keySpacing + keySize / 2);
  // A
  text('A', baseX + keySize / 2, baseY + keySize + keySpacing + keySize / 2);
  // D
  text('D', baseX + keySize * 2 + keySpacing * 2 + keySize / 2, baseY + keySize + keySpacing + keySize / 2);
  pop();
}
