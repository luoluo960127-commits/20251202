// sprite sheets
let attackSheet, runSheet, jumpSheet, char2StandbySheet, char2RunSheet, char4Sheet, char5Sheet;
let char1Icon, char2Icon; // 虛擬鍵盤的角色圖示
let char2SlideSheet, char2JumpSheet, char3Sheet; // 新增角色三的 sprite sheet
let char1SlideSheet, char1HitSheet, char2HitSheet;

// 背景圖片
let bgImage;
let bossBgImage; // 魔王關背景
let bgMusic; // 背景音樂變數

let char1MeetSheet, char2MeetSheet;

// 題庫相關
let questionTable;
let questions = [];
let currentQuestion = null; // 用於儲存當前正在進行的題目
let lastQuestionIndex = -1; // 用於儲存上一個問題的索引，避免重複

// -- 遊戲進度與慶祝 --
let questionsAnsweredCount = 0;
let fireworks = [];
let bubbles = [];
let stars = [];
let showFireworks = false;
let candyColors = []; // 用於存放泡泡的糖果顏色
let attackWaves = []; // 用於存放角色二的攻擊波
let lasers = []; // 用於存放懲罰光束

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
const CHAR1_HIT_FRAMES = 4; // 1-被攻擊/1-被攻擊all.png 內含 4 張
const CHAR1_HIT_FRAME_W = 50;
const CHAR2_HIT_FRAMES = 3; // 2-被攻擊all.png 內含 3 張

// 角色三相關
const CHAR3_FRAMES = 7; // 角色三的幀數 (問題1all.png 內含 7 張)
const CHAR3_FRAME_W = 50; // 角色三的幀寬（待根據實際圖片調整）

// 角色四相關
const CHAR4_FRAMES = 12; // 問題2all.png 內含 12 張
const CHAR4_FRAME_W = 50; // 角色四的幀寬（待調）
let char4Duration = 100; // 角色四每幀毫秒

// 角色五相關
const CHAR5_FRAMES = 7; // 問題3all.png 內含 7 張
const CHAR5_FRAME_W = 50; // 角色五的幀寬（待調）
let char5Duration = 100; // 角色五每幀毫秒

const CHAR1_MEET_FRAMES = 5; // 1-相遇/1-相遇all.png 內含 5 張
const CHAR2_MEET_FRAMES = 6; // 2-相遇/2-相遇all.png 內含 6 張

// 動畫計時與速度控制（數字越小越快）
// 使用毫秒穩定計時來控制逐格播放（更像跑馬燈）
let currentIdx = 0;
let lastChange = 0;
let char3CurrentIdx = 0; // 角色三的當前幀索引
let char3LastChange = 0; // 角色三上次幀變化的時間
let char4CurrentIdx = 0; // 角色四的當前幀索引
let char4LastChange = 0; // 角色四上次幀變化的時間
let char5CurrentIdx = 0; // 角色五的當前幀索引
let char5LastChange = 0; // 角色五上次幀變化的時間
let attackDuration = 120; // 每幀毫秒（待機/攻擊）
let runDuration = 80; // 每幀毫秒（跑步）
let jumpDuration = 100; // 每幀毫秒（跳躍）
let char2StandbyDuration = 150; // 角色2 待機速度
let char2RunDuration = 90; // 角色2 跑步速度
let char2SlideDuration = 80; // 角色2 滑鏟每幀毫秒
let char2SlideSpeed = 6; // 滑鏟時前進速度（可調）
let char2JumpDuration = 100; // 角色2 跳躍每幀毫秒
let char1SlideDuration = 80; // 角色1 滑鏟每幀毫秒
let char1HitDuration = 100; // 角色1 被攻擊動畫速度
let char2HitDuration = 100; // 角色2 被攻擊動畫速度
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
let optionButtons = []; // 改用按鈕陣列
let showInput = false;
let char2DisplayText = '';
let showDialog2 = false;
let dialogStart2 = 0;
let dialogDuration2 = 5000; // 5 秒
// -- 重答機制 --
let isPromptingRetry = false; // 是否正在提示玩家重答
let retryButton = { x: 0, y: 0, w: 0, h: 0 }; // 用於儲存重答按鈕的邊界
// -- 提示機制 --
let showHintPrompt = false; // 是否顯示 "需要提示嗎?"
let hintButton = { x: 0, y: 0, w: 0, h: 0 }; // 儲存 "好哇" 按鈕的邊界
let hintStartTime = 0;      // 提示開始顯示的時間
let globalHintUsed = false; // 全域提示使用狀態，整場遊戲只能用一次
let isMuted = false; // 靜音狀態
let muteBtn = { x: 0, y: 0, r: 50 }; // 靜音按鈕
let bossMode = false; // 魔王關模式
let bossEndTime = 0;  // 魔王關結束時間
let bossStartTime = 0; // 魔王關正式開始時間 (用於準備階段)



// -- 角色1 狀態 --
let mode = 'attack';
let char1X, char1Y;
let char1Facing = 1;
let char1VelocityY = 0;
let char1IsJumping = false;
let char1IsHit = false; // 角色1 是否正在被攻擊
let char1JumpCount = 0; // 角色1 跳躍次數

// -- 角色2 狀態 --
let mode2 = 'standby';
let char2X, char2Y;
let char2Facing = 1;
let char2VelocityY = 0;
let char2IsJumping = false;
let char2IsHit = false; // 角色2 是否正在被攻擊
let char2JumpCount = 0; // 角色2 跳躍次數
let gameState = 'start'; // 遊戲狀態: 'start' 或 'playing'
let punishmentActive = false; // 是否處於懲罰狀態
let punishmentEndTime = 0; // 懲罰結束時間
let nextLaserTime = 0; // 下一次發射光束的時間
let punishmentCountdownActive = false; // 懲罰倒數計時狀態
let punishmentCountdownStart = 0; // 懲罰倒數開始時間

// -- 角色3 狀態 --
let char3 = {
  x: 0, y: 0,
  facing: 1,
  mode: 'idle',
  isVisible: true,
};

// -- 角色4 狀態 --
let char4 = {
  x: 0, y: 0, facing: 1, mode: 'idle', isVisible: false
};

// -- 角色5 狀態 --
let char5 = {
  x: 0, y: 0, facing: 1, mode: 'idle', isVisible: false
};

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
  jumpSheet = loadImage('1-跳/1-跳all.png'); // 修正：將路徑改為正確的資料夾 '1-跳'
  char1SlideSheet = loadImage('1-滑鏟/1-滑鏟all.png');

  // 載入背景圖
  bgImage = loadImage('4.png');
  bossBgImage = loadImage('5.png'); // 載入魔王關背景
  bgMusic = loadSound('chiptune-happiness-retro-8bit-game-music-453214.mp3'); // 載入背景音樂
  char2StandbySheet = loadImage('2-待機/2-待機all.png');
  char2RunSheet = loadImage('2/all.png');
  char2SlideSheet = loadImage('2-滑鏟/2-all滑鏟.png');
  char2JumpSheet = loadImage('2-跳躍/2-跳躍all.png');
  char2HitSheet = loadImage('2/2-被攻擊all.png'); // 載入角色2被攻擊圖檔
  char1HitSheet = loadImage('1/1-被攻擊all.png'); // 修正路徑：載入被攻擊圖檔
  char1MeetSheet = loadImage('1-相遇/1-相遇all.png');
  char1Icon = loadImage('1-攻擊/0.png'); // 預載入角色圖示
  char2Icon = loadImage('2-跳躍/1.png'); // 預載入角色2圖示
  char2MeetSheet = loadImage('2-相遇/2-相遇all.png');
  char5Sheet = loadImage('備用/問題3all.png'); // 載入角色五的 sprite sheet
  char4Sheet = loadImage('備用/問題2all.png'); // 載入角色四的 sprite sheet
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
  
  // 初始化靜音按鈕位置 (右上角，位於文字下方)
  muteBtn.x = width - 50;
  muteBtn.y = 80;

  // 初始化角色3位置（隨機位置）
  char3.x = random(width);
  char3.y = groundY;
  char3.facing = (random(1) > 0.5) ? 1 : -1;
  char3.isVisible = true;

  // 初始化角色4（預設不可見）
  char4.isVisible = false;

  // 初始化角色5（預設不可見）
  char5.isVisible = false;

  // 解析題庫
  // 定義泡泡的糖果色
  candyColors = [
    color(255, 182, 193, 150), // 粉紅色
    color(221, 160, 221, 150), // 紫羅蘭色
    color(135, 206, 250, 150), // 天藍色
    color(144, 238, 144, 150), // 淺綠色
    color(255, 255, 224, 150), // 淺黃色
    color(255, 160, 122, 150)  // 珊瑚色
  ];

  if (questionTable) {
    for (let r = 1; r < questionTable.getRowCount(); r++) { // 從 1 開始跳過標題列
      questions.push({
        question: questionTable.getString(r, 0),
        options: [questionTable.getString(r, 1), questionTable.getString(r, 2), questionTable.getString(r, 3)], // 讀取選項
        answer: questionTable.getString(r, 4),
        correctFeedback: questionTable.getString(r, 5),
        wrongFeedback: questionTable.getString(r, 6),
        hint: questionTable.getString(r, 7)
      });
    }
  }

  // 建立 3 個選項按鈕
  for (let i = 0; i < 3; i++) {
    let btn = createButton('');
    btn.hide();
    btn.class('option-btn'); // 可在 CSS 中定義樣式
    btn.style('font-size', '18px');
    btn.style('padding', '10px 20px');
    btn.style('border-radius', '10px');
    btn.style('border', '2px solid #333');
    btn.style('background-color', '#fff');
    btn.style('cursor', 'pointer');
    btn.style('width', '220px');
    btn.style('text-align', 'left');
    // 綁定點擊事件
    btn.mousePressed(() => handleAnswer(btn.html()));
    optionButtons.push(btn);
  }
}

function handleAnswer(val) {
  // 隱藏所有按鈕
  optionButtons.forEach(b => b.hide());
  showInput = false;

  if (currentQuestion) {
    // 比對答案
    if (val === currentQuestion.answer) {
      char2DisplayText = currentQuestion.correctFeedback; // 答對的回饋
      isPromptingRetry = false;
      
      // 答對特效：生成大量星星 (背景)
      for (let i = 0; i < 30; i++) {
        stars.push(new Star());
      }
      
      currentQuestion = null; // 答對了才重置問題
    } else {
      char2DisplayText = "離發射光束還有三秒請盡速逃離"; // 答錯的回饋
      isPromptingRetry = false; // 先不顯示重答按鈕，等待懲罰結束
      
      // 啟動懲罰倒數
      punishmentCountdownActive = true;
      punishmentCountdownStart = millis();
    }
    showDialog2 = true;
    dialogStart2 = millis();
    // 回答後隱藏提示
    showHintPrompt = false;
    // 隱藏角色1 對話
    showDialog = false;
  }
}

function draw() {
  if (gameState === 'start') {
    drawStartScreen();
    return;
  }
  
  if (gameState === 'gameOver') {
    drawGameOverScreen();
    return;
  }

  // 在每一幀開始時清空畫布，解決背景殘影問題
  background('#f5ebe0');

  // 決定當前使用的背景圖 (如果是魔王關就用 5.png，否則用 4.png)
  let currentBg = bossMode ? bossBgImage : bgImage;

  // --- 繪製可捲動的背景 ---
  if (currentBg && currentBg.width > 0) {
    const bgW = currentBg.width;
    const bgH = height; // 讓背景填滿整個畫布高度
    const scaleY = bgH / currentBg.height;
    const scaledBgW = bgW * scaleY;

    // --- 修正背景平鋪邏輯，確保無縫連接 ---
    // 計算從螢幕左邊緣需要的第一張圖的索引
    const startOffset = worldOffset % scaledBgW;
    const numTiles = Math.ceil(width / scaledBgW) + 2; // 計算需要多少張圖才能填滿螢幕，並額外加2張以防萬一

    // 從螢幕左側之外的一張圖開始繪製，確保完全覆蓋
    for (let i = -1; i < numTiles - 1; i++) {
      image(currentBg, startOffset + i * scaledBgW, height / 2, scaledBgW, bgH);
    }
  }

  // 答對特效：正確時生成星星
  if (currentQuestion === null && !punishmentActive && frameCount % 10 === 0 && showDialog2) {
     // 這裡可以根據需要增加持續性的慶祝特效，目前 handleAnswer 已經觸發了一次爆發
  }

  // --- 顯示回合數 ---
  if (!showFireworks) {
    push();
    textAlign(CENTER, TOP);
    textSize(32);
    textStyle(BOLD);
    fill(0); // 黑色文字
    text(`回合 ${min(questionsAnsweredCount + 1, 3)}/3`, width / 2, 30);
    pop();
  }

  // 左右控制說明
  push();
  textSize(24);
  fill(0);
  textAlign(LEFT, TOP);
  text('角色一使用上下左右鍵控制', 20, 20);
  textAlign(RIGHT, TOP);
  text('角色二:使用wasd鍵控制', width - 20, 20);
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
      // showDialog = false; // 讓對話框繼續顯示直到回答問題
    }
  } else {
    // 檢查與當前可見的 NPC (角色三或四) 是否碰撞
    let activeNPC = null;
    if (char3.isVisible) activeNPC = char3;
    else if (char4.isVisible) activeNPC = char4;
    else if (char5.isVisible) activeNPC = char5;

    // 新增：檢查是否離開問題範圍 (當角色離開時，隱藏選項與題目)
    if (showInput && activeNPC && !punishmentActive) { // 懲罰期間不隱藏，避免邏輯衝突
      let dx = abs(activeNPC.x - char2X);
      if (dx > 200) { // 設定離開距離閾值
        showInput = false;
        showDialog = false;
        showHintPrompt = false;
        optionButtons.forEach(b => b.hide());
      }
    }

    if (activeNPC && !meetPlaying && !showDialog2) {
      let dx = abs(activeNPC.x - char2X);
      let dy = abs(activeNPC.y - char2Y);
      let collideThresholdX = 120; // 可微調
      let collideThresholdY = 40;

      if (dx <= collideThresholdX && dy <= collideThresholdY) {
        // --- 觸發提問的核心邏輯 ---
        prevMode2 = mode2;
        mode2 = 'meet2';
        meetStart = millis();
        meetPlaying = true;
        currentIdx = 0;
        lastChange = millis();

        // 如果當前沒有題目，從題庫中選一個不重複的新題目
        if (questions.length > 0 && !currentQuestion) {
          let randomIndex = floor(random(questions.length));
          
          // 取得題目並從陣列中移除，確保不會再次出現
          let q = questions[randomIndex];
          questions.splice(randomIndex, 1);
          
          // 複製題目並打亂選項順序，避免答案固定在第二個
          currentQuestion = Object.assign({}, q); // 淺拷貝物件
          currentQuestion.options = shuffle(q.options); // 打亂選項 (回傳新陣列)
          
          char1DialogText = currentQuestion.question;
        }

        // 啟動對話與輸入
        showDialog = true;
        dialogStart = millis();
        showHintPrompt = true;
        hintStartTime = 0;
        showInput = true;
        
        // 設定並顯示選項按鈕
        if (currentQuestion) {
          for (let i = 0; i < 3; i++) {
            optionButtons[i].html(currentQuestion.options[i]);
            optionButtons[i].show();
          }
        }
      }
    }
  }

  // 同時繪製兩個角色
  drawCharacter1();
  drawCharacter2();
  if (char3.isVisible) drawCharacter3(); // 繪製角色三
  if (char4.isVisible) drawCharacter4(); // 繪製角色四
  if (char5.isVisible) drawCharacter5(); // 繪製角色五

  // 若需要顯示相遇對話框（角色1）
  if (showDialog && millis() - dialogStart < dialogDuration) {
    // 對話框位置：在角色三上方
    let activeNPC = char3.isVisible ? char3 : (char4.isVisible ? char4 : char5);
    let boxX = activeNPC.x + worldOffset; // 顯示在當前NPC頭上

    let boxY = activeNPC.y - 120; // 改為固定在 NPC 頭上，避免隨角色跳躍移動
    let boxW = 220;
    let boxH = 100; // 增加高度以容納換行文字

    // 背景矩形（半透明）
    push();
    rectMode(CENTER);
    noStroke();
    fill(0, 150);
    rect(boxX, boxY, boxW, boxH, 10);
    pop();

    // 將文字改為白色，並支援換行
    push();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textSize(20); // 稍微縮小字體
    fill(255); // 改為白色
    text(char1DialogText, boxX, boxY, boxW, boxH);
    pop();
  }

  // 繪製提示相關的 UI (在角色一頭上)
  if (showHintPrompt && currentQuestion && !globalHintUsed) { // 只有在全域提示尚未使用時才顯示
    const hintBoxW = 180;
    const hintBoxH = 90;
    const hintBoxX = char1X + worldOffset; // 跟隨角色一
    const hintBoxY = char1Y - 120;         // 在頭上

    const promptY = hintBoxY - 15;
    const buttonY = hintBoxY + 20;
    const buttonW = 100;
    const buttonH = 45;

    // 儲存按鈕位置
    hintButton.x = hintBoxX - buttonW / 2;
    hintButton.y = buttonY - buttonH / 2;
    hintButton.w = buttonW;
    hintButton.h = buttonH;

    push();
    rectMode(CENTER);
    // 繪製背景框
    fill(255, 240);
    stroke(100);
    strokeWeight(2);
    rect(hintBoxX, hintBoxY, hintBoxW, hintBoxH, 10);

    // 繪製 "需要提示嗎?"
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    text('需要提示嗎?', hintBoxX, promptY);

    // 繪製 "好哇" 按鈕
    fill('#2196F3'); // 藍色按鈕
    rect(hintBoxX, buttonY, buttonW, buttonH, 8);
    fill(255);
    textSize(24);
    textStyle(BOLD);
    text('好哇', hintBoxX, buttonY);
    pop();

  } else if (globalHintUsed && millis() - hintStartTime < 3000) {
    // 如果點擊了提示，且在5秒內，則顯示提示內容
    const hintDisplayX = char1X + worldOffset;
    const hintDisplayY = char1Y - 120;
    push();
    fill(20, 40, 120); // 改為深藍色文字
    textAlign(CENTER, CENTER);
    textSize(22);
    textStyle(BOLD);
    if (currentQuestion) text(`提示：${currentQuestion.hint}`, hintDisplayX, hintDisplayY);
    pop();
  }

  // 如果選項按鈕顯示中，更新它們的位置（定位到角色2 上方）
  if (showInput && cnv) {
    let rect = cnv.elt.getBoundingClientRect();
    let startY = rect.top + groundY - 230; // 調整高度，避免太上面
    let btnX = rect.left + char2ScreenX - 110; // 置中 (按鈕寬度 220 / 2)
    
    for (let i = 0; i < optionButtons.length; i++) {
      optionButtons[i].position(btnX, startY + i * 55); // 垂直排列，間距 55px
    }
  }

  // 顯示角色2 的歡迎對話（輸入後）
  if (showDialog2 && (millis() - dialogStart2 < dialogDuration2 || isPromptingRetry)) {
    let activeNPC = char3.isVisible ? char3 : (char4.isVisible ? char4 : char5);
    let boxX = activeNPC.x + worldOffset; // 回饋訊息顯示在當前NPC頭上
    let boxY = activeNPC.y - 120;
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

    // 如果正在提示重答，繪製額外的UI
    if (isPromptingRetry) {
      // --- 繪製一個在回饋框上方的獨立重答框 ---
      const retryBoxW = 200;
      const retryBoxH = 90;
      const retryBoxX = boxX; // 與下方回饋框對齊
      const retryBoxY = boxY - boxH / 2 - 15 - retryBoxH / 2; // 向上偏移

      const retryPromptY = retryBoxY - 15; // "再回答一次?" 的 Y 座標
      const buttonY = retryBoxY + 20;      // "來!" 按鈕的 Y 座標
      const buttonW = 100;
      const buttonH = 45;

      // 儲存按鈕位置以供點擊檢測
      retryButton.x = retryBoxX - buttonW / 2;
      retryButton.y = buttonY - buttonH / 2;
      retryButton.w = buttonW;
      retryButton.h = buttonH;

      push();
      rectMode(CENTER);

      // 繪製重答框的白色背景
      fill(255, 240); // 帶點透明的白色
      stroke(100);    // 加上灰色邊框
      strokeWeight(2);
      rect(retryBoxX, retryBoxY, retryBoxW, retryBoxH, 10);

      // 繪製提示文字 "再回答一次?"
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(20);
      text('再回答一次?', retryBoxX, retryPromptY);

      // 繪製 "來!" 按鈕
      fill('#4CAF50'); // 綠色按鈕
      rect(retryBoxX, buttonY, buttonW, buttonH, 8);
      fill(255);
      textSize(24);
      textStyle(BOLD);
      text('來!', retryBoxX, buttonY);
      pop();
    }
  } else {
    // 超過時間後隱藏
    if (showDialog2) {
      showDialog2 = false;
      showDialog = false;
      // isPromptingRetry = false; // 不要在這裡重置，因為可能是因為懲罰而暫時隱藏
      showHintPrompt = false; // 隱藏提示

      // 只有在答對的情況下（currentQuestion 為 null），才切換到下一個 NPC
      if (currentQuestion === null) {
        // 角色輪換邏輯
        if (char3.isVisible) {
          // 角色三完成
          char3.isVisible = false; // 隱藏角色三
          questionsAnsweredCount++;
          
          // 第一回合結束 -> 進入第二回合 (角色四)
          char4.x = char1X + random(200, 500);
          char4.y = groundY;
          char4.facing = -1; // 面向左邊
          char4.isVisible = true; // 顯示角色四
          currentQuestion = null;
        } else if (char4.isVisible) {
          // 角色四 -> 角色五
          char4.isVisible = false; // 隱藏角色四
          questionsAnsweredCount++;
          char5.x = char1X + random(200, 500);
          char5.y = groundY;
          char5.facing = -1; // 面向左邊
          char5.isVisible = true; // 顯示角色五
          // 為角色五準備一個新問題
          currentQuestion = null;
        } else if (char5.isVisible) {
          // 角色五 (第三回合) -> 結束
          char5.isVisible = false;
          questionsAnsweredCount++;
          startBossMode(); // 進入魔王關卡，而不是直接結束
        }
      }
    }
  }

  // 在所有元素繪製完畢後，繪製虛擬鍵盤
  drawVirtualKeyboard();
  drawVirtualKeyboardWASD();

  // 如果觸發煙火，則開始繪製
  if (showFireworks) {
    // 首先繪製彩虹，讓它在最底層
    drawRainbow();

    // --- 提高所有特效的生成率 ---
    // 生成煙火
    if (random(1) < 0.25) { // 煙火頻率增加五倍
      fireworks.push(new Firework());
    }
    // 生成泡泡
    if (random(1) < 0.35) { // 增加泡泡數量
      bubbles.push(new Bubble());
    }
    // 生成星星
    if (random(1) < 0.4) { // 大量生成星星
      stars.push(new Star());
    }

    // 更新並繪製所有煙火和粒子
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].show();
      if (fireworks[i].done()) {
        fireworks.splice(i, 1);
      }
    }

    // 更新並繪製所有泡泡
    for (let i = bubbles.length - 1; i >= 0; i--) {
      bubbles[i].update();
      bubbles[i].show();
      if (bubbles[i].done()) {
        bubbles.splice(i, 1);
      }
    }

    // 更新並繪製所有星星
    for (let i = stars.length - 1; i >= 0; i--) {
      stars[i].update();
      stars[i].show();
      if (stars[i].done()) {
        stars.splice(i, 1);
      }
    }
  }

  // 更新並繪製所有攻擊波
  for (let i = attackWaves.length - 1; i >= 0; i--) {
    attackWaves[i].update();
    attackWaves[i].show();

    // 檢查與角色2的碰撞 (當攻擊波來自 player1)
    if (attackWaves[i].owner === 'player1' && !char2IsHit && !meetPlaying && !showDialog2) {
      let d = dist(attackWaves[i].pos.x, attackWaves[i].pos.y, char2ScreenX, char2Y);
      if (d < 100) { // 碰撞距離判定
        char2IsHit = true;
      }
    }

    // 檢查與角色1的碰撞 (當攻擊波來自 player2)
    if (attackWaves[i].owner === 'player2' && !char1IsHit && !meetPlaying && !showDialog) {
      let d = dist(attackWaves[i].pos.x, attackWaves[i].pos.y, char1X + worldOffset, char1Y);
      if (d < 100) { // 碰撞距離判定
        char1IsHit = true;
      }
    }

    if (attackWaves[i].done()) {
      attackWaves.splice(i, 1);
    }
  }

  // --- 懲罰倒數邏輯 ---
  if (punishmentCountdownActive) {
    let elapsed = millis() - punishmentCountdownStart;
    let remaining = 3000 - elapsed;
    
    if (remaining <= 0) {
      // 倒數結束，開始懲罰
      punishmentCountdownActive = false;
      punishmentActive = true;
      punishmentEndTime = millis() + 15000;
      char2DisplayText = "開始發射！";
      dialogStart2 = millis(); // 讓文字顯示一下
    } else {
      // 更新倒數文字
      char2DisplayText = "離發射光束還有三秒請盡速逃離\n" + Math.ceil(remaining / 1000);
      dialogStart2 = millis(); // 保持對話框顯示
    }
  }

  // --- 懲罰機制：發射光束 ---
  if (punishmentActive) {
    // 檢查是否結束懲罰
    if (millis() > punishmentEndTime) {
      punishmentActive = false;
      lasers = [];
      
      // 懲罰結束，顯示重答按鈕
      isPromptingRetry = true;
      showDialog2 = true;
      dialogStart2 = millis(); // 重置計時器
      char2DisplayText = "還活著嗎？再試一次！";
    } else {
      // 定時發射光束
      if (millis() > nextLaserTime) {
        let activeNPC = char3.isVisible ? char3 : (char4.isVisible ? char4 : char5);
        if (activeNPC) {
          // 從 NPC 發射光束瞄準角色二
          // 計算目標位置 (角色二的世界座標)
          let targetX = char2X; 
          let targetY = char2Y; // 瞄準身體中心
          
          // 建立光束 (傳入 NPC 的世界座標)
          lasers.push(new Laser(activeNPC.x, activeNPC.y - 40, targetX, targetY));
          
          nextLaserTime = millis() + 800; // 每 0.8 秒發射一次 (變簡單)
        }
      }
    }
    
    // 繪製角色一的防護罩 (保護沒事做的角色一)
    push();
    translate(char1X + worldOffset, char1Y - 35);
    noFill();
    stroke(0, 255, 255, 200);
    strokeWeight(3);
    circle(0, 0, 100); // 防護罩圓圈
    // 加上閃爍效果
    stroke(255, 255, 255, 100 + sin(millis() / 100) * 100);
    circle(0, 0, 90);
    pop();
  }

  // --- 魔王關卡邏輯 ---
  if (bossMode) {
    // 讓魔王跟隨玩家 (保持在右側)
    let bosses = [char3, char4, char5];
    for(let i=0; i<bosses.length; i++) {
        let targetPos = char2X + 300 + i * 150;
        bosses[i].x = lerp(bosses[i].x, targetPos, 0.05);
        bosses[i].facing = -1;
    }

    if (millis() < bossStartTime) {
        // 準備階段：顯示提示文字，不攻擊
        push();
        textAlign(CENTER, TOP);
        textSize(40);
        fill(255, 255, 0); // 黃色提示
        stroke(0);
        strokeWeight(4);
        text("準備躲避光束！", width / 2, 100);
        pop();
    } else {
        // 正式開始：倒數計時與攻擊
        let remaining = ceil((bossEndTime - millis()) / 1000);
    
        // 顯示倒數計時
        push();
        textAlign(CENTER, TOP);
        textSize(40);
        fill(255, 0, 0);
        stroke(255);
        strokeWeight(4);
        text(`魔王關卡: ${remaining}`, width / 2, 100);
        pop();

        // 發射雷射
        if (millis() > nextLaserTime) {
            let npc = random(bosses); // 隨機選一個魔王發射，而不是全部一起
            lasers.push(new Laser(npc.x, npc.y - 40, char2X, char2Y));
            nextLaserTime = millis() + 1000; // 改為輪流發射，頻率設為 1 秒
        }

        // 結束判斷
        if (remaining <= 0) {
            bossMode = false;
            char3.isVisible = false;
            char4.isVisible = false;
            char5.isVisible = false;
            showFireworks = true;
            lasers = [];
        }
    }
  }

  // 更新並繪製懲罰光束
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].update();
    lasers[i].show();
    
    // 檢查是否擊中角色二
    // 角色二的螢幕座標是 char2ScreenX (固定在畫面中央)
    let laserScreenX = lasers[i].currentX + worldOffset;
    let d = dist(laserScreenX, lasers[i].currentY, char2ScreenX, char2Y);
    
    if (d < 20) { // 擊中判定 (再次縮小範圍)
      gameState = 'gameOver';
    }

    if (lasers[i].done()) {
      lasers.splice(i, 1);
    }
  }
  
  // 繪製靜音按鈕
  drawMuteButton();
}

/**
 * 啟動魔王關卡
 */
function startBossMode() {
  bossMode = true;
  bossStartTime = millis() + 4000; // 設定 4 秒後的正式開始時間
  bossEndTime = bossStartTime + 15000; // 結束時間為正式開始後 15 秒
  
  // 讓三個角色出現在角色二右側
  let startX = char2X + 300;
  
  char3.isVisible = true;
  char3.x = startX;
  char3.y = groundY;
  char3.facing = -1;
  
  char4.isVisible = true;
  char4.x = startX + 150;
  char4.y = groundY;
  char4.facing = -1;
  
  char5.isVisible = true;
  char5.x = startX + 300;
  char5.y = groundY;
  char5.facing = -1;
  
  // 顯示警告
  char2DisplayText = "請躲避光束 15 秒！";
  showDialog2 = true;
  dialogStart2 = millis();
  dialogDuration2 = 5000;
  
  nextLaserTime = bossStartTime + 1000; // 正式開始後 1 秒才發射
}

function drawCharacter1() {
  // 檢查是否按住右方向鍵（持續按住則跑步）
  let wantRun = keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW);
  let wantSlide = keyIsDown(DOWN_ARROW);
  
  // 決定當前模式（相遇優先）
  let newMode;
  if (meetPlaying && mode === 'meet1') {
    newMode = 'meet1';
  } else if (char1IsHit) {
    newMode = 'hit';
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
    char1JumpCount = 0; // 落地重置跳躍次數
  }

  // 如果正在跑步或滑鏟，更新角色位置和方向
  if (wantRun && !wantSlide) {
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
    // 當模式首次切換為滑鏟時，產生一個攻擊波
    if (newMode === 'slide') {
      attackWaves.push(new AttackWave(char1X + worldOffset, char1Y - 20, char1Facing, color(0, 191, 255), color(255, 105, 180), 'player1'));
    }
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
  } else if (mode === 'hit') {
    framesLength = CHAR1_HIT_FRAMES; duration = char1HitDuration; sheet = char1HitSheet; fallbackFrameW = CHAR1_HIT_FRAME_W;
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
    if (mode === 'hit' && currentIdx >= framesLength - 1) {
      char1IsHit = false; // 播放完畢後結束被攻擊狀態
    } else {
      currentIdx = (currentIdx + 1) % framesLength;
      lastChange = millis();
    }
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
      char2JumpCount = 0; // 落地重置跳躍次數
      // 回到待機狀態
      if (true) { // 移除 char2IsHit 判斷
        mode2 = 'standby';
        currentIdx = 0;
        lastChange = millis();
      }
    }
  } else {
    // 非跳躍期間將角色 Y 重置為地面
    char2Y = groundY;
  }

  // 優先處理跳躍（若正在跳躍）其餘行為再處理（相遇優先）
  let newMode;
  if (meetPlaying && mode2 === 'meet2') {
    newMode = 'meet2';
  } else if (char2IsHit) {
    newMode = 'hit';
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
  if (wantRun && !wantSlide && !char2IsHit) {
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
  if (wantSlide && !char2IsJumping && !char2IsHit) {
    char2X += char2Facing * char2SlideSpeed;
  }

  // --- 動畫狀態管理 ---
  if (newMode !== mode2) {
    mode2 = newMode;
    currentIdx = 0;
    lastChange = millis();
    // 當模式首次切換為滑鏟時，產生一個攻擊波
    if (newMode === 'slide') {
      attackWaves.push(new AttackWave(char2ScreenX, char2Y - 20, char2Facing, color(138, 43, 226), color(255, 0, 255), 'player2')); // 改為亮紫色和洋紅色
    }
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
  } else if (mode2 === 'hit') {
    framesLength = CHAR2_HIT_FRAMES; duration = char2HitDuration; sheet = char2HitSheet;
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
    if (mode2 === 'hit' && currentIdx >= framesLength - 1) {
      char2IsHit = false; // 播放完畢後結束被攻擊狀態
    } else {
      currentIdx = (currentIdx + 1) % framesLength;
      lastChange = millis();
    }
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
  let newMode = char3.mode;

  // --- 動畫狀態管理 ---
  // 模式切換時重置索引與計時
  if (newMode !== char3.mode) {
    char3.mode = newMode;
    char3CurrentIdx = 0;
    char3LastChange = millis();
  }

  // 選擇對應的幀數長度與間隔
  let framesLength, duration, sheet, fallbackFrameW;
  if (char3.mode === 'idle') {
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
  translate(char3.x + worldOffset, char3.y); // 加上世界偏移
  scale(char3.facing, 1); // 根據 facing 變數翻轉 X 軸

  // 從對應的 spritesheet 取出子影格並繪製
  idx = (framesLength > 0) ? (idx % framesLength) : 0;
  let sx = idx * currentFrameW;
  if (sheet && sheet.width && sx + currentFrameW > sheet.width) sx = Math.max(0, sheet.width - currentFrameW);
  image(sheet, 0, 0, targetW, targetH, sx, 0, currentFrameW, currentFrameH);
  pop();
}

function drawCharacter4() {
  // --- 動畫狀態管理 ---
  let framesLength = CHAR4_FRAMES;
  let duration = char4Duration;
  let sheet = char4Sheet;
  let fallbackFrameW = CHAR4_FRAME_W;

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
    currentFrameH = FRAME_H;
  }

  // 若超過間隔則切到下一幀（逐格更新）
  if (millis() - char4LastChange >= duration) {
    char4CurrentIdx = (char4CurrentIdx + 1) % framesLength;
    char4LastChange = millis();
  }
  let idx = char4CurrentIdx;

  // --- 繪圖 ---
  // 調整角色大小
  let maxTargetW = width * 0.2;
  let scaleFactor = maxTargetW / currentFrameW;
  if (scaleFactor > 1.5) scaleFactor = 1.5;
  if (scaleFactor < 0.2) scaleFactor = 0.2;
  let targetW = currentFrameW * scaleFactor;
  let targetH = currentFrameH * scaleFactor;

  push();
  translate(char4.x + worldOffset, char4.y); // 加上世界偏移
  scale(char4.facing, 1); // 根據 facing 變數翻轉 X 軸

  // 從對應的 spritesheet 取出子影格並繪製
  idx = (framesLength > 0) ? (idx % framesLength) : 0;
  let sx = idx * currentFrameW;
  if (sheet && sheet.width && sx + currentFrameW > sheet.width) {
    sx = Math.max(0, sheet.width - currentFrameW);
  }
  image(
    sheet,
    0, 0,
    targetW, targetH,
    sx, 0,
    currentFrameW, currentFrameH
  );
  pop();
}

function drawCharacter5() {
  // --- 動畫狀態管理 ---
  let framesLength = CHAR5_FRAMES;
  let duration = char5Duration;
  let sheet = char5Sheet;
  let fallbackFrameW = CHAR5_FRAME_W;

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
    currentFrameH = FRAME_H;
  }

  // 若超過間隔則切到下一幀（逐格更新）
  if (millis() - char5LastChange >= duration) {
    char5CurrentIdx = (char5CurrentIdx + 1) % framesLength;
    char5LastChange = millis();
  }
  let idx = char5CurrentIdx;

  // --- 繪圖 ---
  // 調整角色大小
  let maxTargetW = width * 0.2;
  let scaleFactor = maxTargetW / currentFrameW;
  if (scaleFactor > 1.5) scaleFactor = 1.5;
  if (scaleFactor < 0.2) scaleFactor = 0.2;
  let targetW = currentFrameW * scaleFactor;
  let targetH = currentFrameH * scaleFactor;

  push();
  translate(char5.x + worldOffset, char5.y); // 加上世界偏移
  scale(char5.facing, 1); // 根據 facing 變數翻轉 X 軸

  // 從對應的 spritesheet 取出子影格並繪製
  idx = (framesLength > 0) ? (idx % framesLength) : 0;
  let sx = idx * currentFrameW;
  if (sheet && sheet.width && sx + currentFrameW > sheet.width) {
    sx = Math.max(0, sheet.width - currentFrameW);
  }
  image(
    sheet,
    0, 0,
    targetW, targetH,
    sx, 0,
    currentFrameW, currentFrameH
  );
  pop();
}


function keyPressed() {
  // 角色1 的控制（方向鍵）
  // 跳躍：上鍵
  if (keyCode === UP_ARROW) {
    if (!char1IsJumping) {
      char1IsJumping = true;
      char1VelocityY = jumpStrength;
      char1JumpCount = 1;
    } else if (char1JumpCount < 5) { // 允許連續跳躍 (例如最多5次)
      char1VelocityY = jumpStrength * 1.1; // 越跳越高 (增加 10% 力道)
      char1JumpCount++;
    }
  }
  
  // 角色2 的控制（WASD）
  // 跳躍：W(87)
  if (keyCode === 87 && !char2IsHit) { // W
    if (!char2IsJumping) {
      char2IsJumping = true;
      char2VelocityY = jumpStrength;
      char2JumpCount = 1;
    } else if (char2JumpCount < 5) { // 允許連續跳躍
      char2VelocityY = jumpStrength * 1.1; // 越跳越高
      char2JumpCount++;
    }
  }
}

function mousePressed() {
  // 優先檢查靜音按鈕點擊 (在任何狀態下都有效)
  if (dist(mouseX, mouseY, muteBtn.x, muteBtn.y) < muteBtn.r / 2) {
    isMuted = !isMuted;
    if (bgMusic) {
      bgMusic.setVolume(isMuted ? 0 : 0.3);
    }
    return; // 阻止後續事件 (例如避免點擊靜音時誤觸開始遊戲)
  }

  if (gameState === 'start') {
    gameState = 'playing';
    // 播放背景音樂 (如果尚未播放)
    if (bgMusic && !bgMusic.isPlaying()) {
      bgMusic.setVolume(isMuted ? 0 : 0.3); // 設定音量 (0.0 ~ 1.0)，避免太大聲
      bgMusic.loop();         // 循環播放
    }
    return;
  }
  
  if (gameState === 'gameOver') {
    // 檢查是否點擊 "再玩一次!" 按鈕
    let btnW = 200;
    let btnH = 60;
    let btnX = width / 2 - btnW / 2;
    let btnY = height / 2 + 50;
    
    if (mouseX >= btnX && mouseX <= btnX + btnW &&
        mouseY >= btnY && mouseY <= btnY + btnH) {
      if (bossMode) {
        // 如果是在魔王關失敗，重置狀態並重新開始魔王關
        gameState = 'playing';
        lasers = [];
        startBossMode();
      } else {
        window.location.reload();
      }
    }
    return;
  }

  // 檢查是否正在提示重答，且滑鼠點擊在 "來!" 按鈕的範圍內
  if (isPromptingRetry &&
      mouseX >= retryButton.x &&
      mouseX <= retryButton.x + retryButton.w &&
      mouseY >= retryButton.y &&
      mouseY <= retryButton.y + retryButton.h) {

    // 重置狀態，準備讓玩家重新輸入
    isPromptingRetry = false;
    showDialog2 = false; // 隱藏回饋框
    showDialog = true; // 重新顯示題目

    // 再次顯示選項按鈕
    showInput = true;
    for (let btn of optionButtons) {
      btn.show();
    }
  }

  // 檢查是否點擊了 "好哇" 提示按鈕
  if (showHintPrompt && !globalHintUsed &&
      mouseX >= hintButton.x &&
      mouseX <= hintButton.x + hintButton.w &&
      mouseY >= hintButton.y &&
      mouseY <= hintButton.y + hintButton.h) {
    
    showHintPrompt = false; // 隱藏按鈕
    globalHintUsed = true;  // 標記全域提示已被使用
    hintStartTime = millis(); // 開始計時
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  muteBtn.x = width - 50; // 更新靜音按鈕位置
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
 * 繪製開始畫面
 */
function drawStartScreen() {
  // 繪製背景圖
  if (bgImage && bgImage.width > 0) {
    push();
    imageMode(CENTER);
    // 簡單縮放以填滿畫面
    let scaleFactor = max(width / bgImage.width, height / bgImage.height);
    image(bgImage, width / 2, height / 2, bgImage.width * scaleFactor, bgImage.height * scaleFactor);
    pop();
  } else {
    background('#f5ebe0');
  }

  // 半透明黑色遮罩 (全螢幕)
  push();
  fill(0, 100); // 稍微淡一點，因為後面有面板
  rectMode(CORNER);
  rect(0, 0, width, height);
  pop();

  // --- 美化後的資訊面板 ---
  push();
  rectMode(CENTER);
  
  // 面板背景
  fill(0, 0, 0, 220); // 深色半透明背景
  stroke(0, 191, 255); // 藍色邊框
  strokeWeight(4);
  
  // 計算面板大小
  let panelW = min(800, width * 0.9);
  let panelH = min(600, height * 0.85);
  let panelX = width / 2;
  let panelY = height / 2;
  
  rect(panelX, panelY, panelW, panelH, 20); // 圓角矩形

  // 設定文字共用屬性
  textAlign(CENTER, CENTER);
  noStroke();

  // --- 標題 ---
  // 使用陰影效果讓標題更突出
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = '#00BFFF'; // 藍色光暈
  
  fill(0, 191, 255); // 藍色文字
  textSize(48);
  textStyle(BOLD);
  text("冷笑話大冒險", panelX, panelY - panelH * 0.35);
  
  // 重置陰影，避免影響後續文字
  drawingContext.shadowBlur = 0;

  // --- 內容區塊 ---
  let contentStartY = panelY - panelH * 0.15;
  let lineSpacing = 35;
  let sectionSpacing = 90;

  // 1. 關於遊戲
  fill(135, 206, 250); // 淺藍色標題
  textSize(26);
  textStyle(BOLD);
  text("關於遊戲", panelX, contentStartY);
  
  fill(255); // 白色內文
  textSize(18);
  textStyle(NORMAL);
  text("這是一個雙人互動冒險遊戲，兩位玩家將在奇幻世界中相遇並挑戰冷笑話問答。", panelX, contentStartY + lineSpacing);

  // 2. 操作說明
  let section2Y = contentStartY + sectionSpacing;
  fill(135, 206, 250);
  textSize(26);
  textStyle(BOLD);
  text("操作說明", panelX, section2Y);

  fill(255);
  textSize(18);
  textStyle(NORMAL);
  text("角色一 (右側): 方向鍵 (↑↓←→) 移動與跳躍，下鍵滑鏟。", panelX, section2Y + lineSpacing);
  text("角色二 (左側): WASD 鍵移動與跳躍，S鍵滑鏟。", panelX, section2Y + lineSpacing * 2);

  // 3. 遊戲目標
  let section3Y = section2Y + sectionSpacing + lineSpacing;
  fill(135, 206, 250);
  textSize(26);
  textStyle(BOLD);
  text("遊戲目標", panelX, section3Y);

  fill(255);
  textSize(18);
  textStyle(NORMAL);
  text("尋找 NPC，觸發冷笑話挑戰，答對問題收集進度，最終欣賞慶祝煙火！", panelX, section3Y + lineSpacing);

  // --- 開始提示 ---
  // 閃爍效果
  if (frameCount % 60 < 30) {
    fill(0, 255, 255); // 藍色(青色)
    textSize(28);
    textStyle(BOLD);
    text("- 點擊螢幕開始遊戲 -", panelX, panelY + panelH * 0.4);
  }
  
  // 繪製靜音按鈕
  drawMuteButton();
  pop();
}

/**
 * 繪製遊戲結束畫面
 */
function drawGameOverScreen() {
  push();
  background(0); // 黑色背景
  
  textAlign(CENTER, CENTER);
  fill(255, 0, 0); // 紅色文字
  textSize(60);
  textStyle(BOLD);
  if (bossMode) {
    text("大魔王太強了!", width / 2, height / 2 - 50);
  } else {
    text("你鼠掉了", width / 2, height / 2 - 50);
  }
  
  // 繪製 "再玩一次!" 按鈕
  let btnW = 200;
  let btnH = 60;
  let btnX = width / 2 - btnW / 2;
  let btnY = height / 2 + 50;
  
  // 按鈕懸停效果
  if (mouseX >= btnX && mouseX <= btnX + btnW &&
      mouseY >= btnY && mouseY <= btnY + btnH) {
    fill(50, 205, 50); // 亮綠色
    cursor(HAND);
  } else {
    fill(34, 139, 34); // 深綠色
    cursor(ARROW);
  }
  
  rectMode(CORNER);
  rect(btnX, btnY, btnW, btnH, 15);
  
  fill(255);
  textSize(30);
  textStyle(BOLD);
  if (bossMode) {
    text("再挑戰一次!", width / 2, btnY + btnH / 2);
  } else {
    text("再玩一次!", width / 2, btnY + btnH / 2);
  }
  
  // 繪製靜音按鈕
  drawMuteButton();
  
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

/**
 * 繪製一道巨大且帶有閃爍效果的彩虹
 */
function drawRainbow() {
  const centerX = width / 2;
  const centerY = height + 150; // 將圓心放在畫面下方，形成巨大弧形
  const maxRadius = width * 1.1; // 彩虹的最大半徑
  const bandWidth = 25; // 每條色帶的寬度

  push();
  noFill();
  strokeCap(SQUARE);

  // 使用 sin 和 millis 創建一個 100 到 180 之間變化的透明度，來模擬閃爍
  let shimmerAlpha = 140 + sin(millis() / 400) * 40;

  for (let i = 0; i < candyColors.length; i++) {
    let c = candyColors[i];
    stroke(red(c), green(c), blue(c), shimmerAlpha);
    strokeWeight(bandWidth);
    
    let r = maxRadius - i * bandWidth;
    arc(centerX, centerY, r, r, PI, TWO_PI); // 只畫上半圓
  }

  // --- 繪製通關文字 ---
  textAlign(CENTER, CENTER);
  textSize(120); // 設定大字體
  textStyle(BOLD);

  // 加上白色外框讓文字更突出
  stroke(255, 255, 255, 200);
  strokeWeight(10);
  fill(0, 191, 255); // 藍色填充
  text('恭喜通關', width / 2, height / 4);

  pop();
}

// --- 煙火系統 ---

/**
 * 代表單個火花粒子的類別
 */
class Particle {
  constructor(x, y, hu, firework) {
    this.pos = createVector(x, y);
    this.firework = firework; // 是否為第一階段的煙火
    this.lifespan = 255;      // 生命值，用於淡出效果
    this.hu = hu;             // 顏色

    if (this.firework) {
      // 上升的煙火
      this.vel = createVector(0, random(-18, -10));
    } else {
      // 爆炸後的火花
      this.vel = p5.Vector.random2D();
      this.vel.mult(random(2, 12));
    }
    this.acc = createVector(0, 0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.firework) {
      this.vel.mult(0.9); // 模擬空氣阻力
      this.lifespan -= 4; // 生命值衰減
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  done() {
    return this.lifespan < 0;
  }

  show() {
    colorMode(HSB);
    if (!this.firework) {
      strokeWeight(2);
      stroke(this.hu, 255, 255, this.lifespan);
    } else {
      strokeWeight(4);
      stroke(this.hu, 255, 255);
    }
    point(this.pos.x, this.pos.y);
    colorMode(RGB); // 恢復顏色模式
  }
}

/**
 * 代表一整顆煙火（包含上升和爆炸）的類別
 */
class Firework {
  constructor() {
    this.hu = random(255); // 隨機顏色
    // 從底部隨機位置發射
    this.firework = new Particle(random(width), height, this.hu, true);
    this.exploded = false;
    this.particles = [];
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(createVector(0, gravity * 0.5)); // 煙火受到的重力較小
      this.firework.update();
      // 如果煙火上升到最高點（速度接近0），就爆炸
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(createVector(0, gravity * 0.2));
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    // 產生 100 個爆炸後的火花
    for (let i = 0; i < 100; i++) {
      const p = new Particle(this.firework.pos.x, this.firework.pos.y, this.hu, false);
      this.particles.push(p);
    }
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
}

// --- 泡泡系統 ---
class Bubble {
  constructor() {
    this.pos = createVector(random(width), height + random(100));
    this.vel = createVector(random(-0.5, 0.5), random(-2, -4)); // 讓泡泡上升快一點
    this.size = random(10, 60);
    this.lifespan = 255;
    this.color = random(candyColors); // 從糖果色中隨機選一個
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan -= 1.2; // 消失速度
  }

  done() {
    return this.lifespan < 0;
  }

  show() {
    // 取得基礎顏色，並設定透明度
    let baseColor = this.color;
    let alpha = this.lifespan;

    push();
    // 繪製半透明的彩色邊框
    stroke(red(baseColor), green(baseColor), blue(baseColor), alpha * 0.8);
    strokeWeight(2);
    // 繪製更淺、更透明的填充色，營造立體感
    fill(red(baseColor), green(baseColor), blue(baseColor), alpha * 0.3);
    ellipse(this.pos.x, this.pos.y, this.size);
    // 內部高光
    fill(255, 255, 255, alpha * 0.7);
    noStroke();
    ellipse(this.pos.x - this.size * 0.15, this.pos.y - this.size * 0.15, this.size * 0.3);
    pop();
  }
}

/**
 * 繪製靜音按鈕
 */
function drawMuteButton() {
  push();
  translate(muteBtn.x, muteBtn.y);
  
  // 按鈕背景與懸停效果
  noStroke();
  if (dist(mouseX, mouseY, muteBtn.x, muteBtn.y) < muteBtn.r / 2) {
    fill(255, 240);
    cursor(HAND);
  } else {
    fill(255, 200);
  }
  circle(0, 0, muteBtn.r);
  
  // 繪製喇叭圖示
  fill(50);
  stroke(50);
  strokeWeight(2);
  strokeJoin(ROUND);
  
  // 喇叭主體
  beginShape();
  vertex(-8, -5); vertex(-3, -5); vertex(7, -10);
  vertex(7, 10); vertex(-3, 5); vertex(-8, 5);
  endShape(CLOSE);
  
  // 聲波或叉叉
  noFill();
  if (isMuted) {
    stroke(200, 50, 50); // 紅色叉叉
    line(10, -5, 18, 5);
    line(18, -5, 10, 5);
  } else {
    stroke(50); // 聲波
    arc(10, 0, 8, 8, -PI/3, PI/3);
    arc(10, 0, 14, 14, -PI/3, PI/3);
  }
  
  pop();
}

// --- 懲罰光束系統 ---
class Laser {
  constructor(startX, startY, targetX, targetY) {
    this.startX = startX; // 世界座標 X
    this.startY = startY;
    this.currentX = startX;
    this.currentY = startY;
    
    // 計算方向向量
    // 加入一點隨機偏移，讓玩家有機會躲避
    let angle = atan2(targetY - startY, targetX - startX);
    angle += random(-0.25, 0.25); // 增加隨機擴散角度，讓射擊更不精準
    
    this.speed = 6; // 光束速度再變慢
    this.velX = cos(angle) * this.speed;
    this.velY = sin(angle) * this.speed;
    
    this.lifespan = 200; // 存活時間
  }

  update() {
    this.currentX += this.velX;
    this.currentY += this.velY;
    this.lifespan -= 1;
  }

  done() {
    return this.lifespan < 0;
  }

  show() {
    push();
    // 轉換為螢幕座標繪製
    translate(this.currentX + worldOffset, this.currentY);
    
    // 繪製光束
    rotate(atan2(this.velY, this.velX));
    // 金色細細的光束 (一條線)
    stroke(255, 215, 0); // 金色
    strokeWeight(3);
    line(-40, 0, 40, 0); // 長條線
    stroke(255, 223, 0, 100); // 光暈
    strokeWeight(6);
    line(-40, 0, 40, 0);
    pop();
  }
}

// --- 星星系統 ---
class Star {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.maxSize = random(10, 25);
    this.size = this.maxSize;
    this.lifespan = 255;
    this.angle = random(TWO_PI);
    this.twinkleFactor = 0;
  }

  update() {
    // 使用 sin 函數來模擬閃爍
    this.twinkleFactor += 0.1;
    this.size = this.maxSize * (0.5 + (sin(this.twinkleFactor) + 1) * 0.25);
    this.lifespan -= 1.5;
  }

  done() {
    return this.lifespan < 0;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    // 閃爍的黃色
    fill(255, 255, 0, this.lifespan);
    noStroke();
    this.drawStarShape(0, 0, this.size / 2, this.size, 5);
    pop();
  }

  /**
   * 繪製一個標準的五角星形狀
   * @param {number} x - 中心 x
   * @param {number} y - 中心 y
   * @param {number} radius1 - 內圈半徑
   * @param {number} radius2 - 外圈半徑
   * @param {number} npoints - 角的數量
   */
  drawStarShape(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
}

// --- 攻擊波系統 ---
class AttackWave {
  /**
   * @param {number} x - 初始世界 X 座標
   * @param {number} y - 初始世界 Y 座標
   * @param {number} facing - 方向 (1 為右, -1 為左)
   */
  constructor(screenX, y, facing, color1, color2, owner) {
    // 直接使用螢幕座標，不再受 worldOffset 影響
    this.pos = createVector(screenX, y);
    this.facing = facing;
    this.speed = 12; // 攻擊波的飛行速度
    this.vel = createVector(this.facing * this.speed, 0);
    this.lifespan = 100; // 生命值，決定飛行距離
    this.size = { w: 240, h: 150 }; // 尺寸放大三倍
    // 儲存顏色
    this.color1 = color1; // 外層光暈顏色
    this.color2 = color2; // 內層核心顏色
    this.owner = owner; // 'player1' or 'player2'
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan -= 2; // 生命值衰減
  }

  done() {
    return this.lifespan < 0;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y); // 直接使用自己的螢幕座標
    scale(this.facing, 1); // 根據方向翻轉

    // 繪製紫色的月牙形攻擊波
    noStroke();

    // 將 lifespan (100 -> 0) 映射到 alpha (255 -> 0)
    const alpha = map(this.lifespan, 0, 100, 0, 255);

    // 外層較深的紫色光暈
    fill(red(this.color1), green(this.color1), blue(this.color1), alpha * 0.8);
    beginShape();
    vertex(0, -this.size.h / 2);
    bezierVertex(this.size.w / 2, -this.size.h / 2, this.size.w, this.size.h / 2, 0, this.size.h / 2);
    bezierVertex(this.size.w / 1.5, 0, this.size.w / 2, -this.size.h / 2, 0, -this.size.h / 2);
    endShape(CLOSE);

    // 內層較亮的紫色核心
    fill(red(this.color2), green(this.color2), blue(this.color2), alpha);
    beginShape();
    vertex(0, -this.size.h / 3);
    bezierVertex(this.size.w / 2.5, -this.size.h / 3, this.size.w / 1.5, this.size.h / 3, 0, this.size.h / 3);
    bezierVertex(this.size.w / 2, 0, this.size.w / 2.5, -this.size.h / 3, 0, -this.size.h / 3);
    endShape(CLOSE);
    pop();
  }
}
