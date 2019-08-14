

//落ちるスピード
const GAME_SPEED = 350;

//f-size
const FIELD_COL = 10;
const FIELD_ROW = 20;

//b-size
const BLOCK_SIZE = 30;

//s-size
const SCREEN_W = BLOCK_SIZE * FIELD_COL;
const SCREEN_H = BLOCK_SIZE * FIELD_ROW;

//テトロミノサイズ
const TETRO_SIZE = 4;

let can = document.getElementById("can");
let con = can.getContext("2d");

can.width = SCREEN_W;
can.height = SCREEN_H;
can.style.border = "4px solid black";

const TETRO_COLORS = [
  "#000",           //0--
  "#F9B7B7",           //1
  "#F9B7EF",           //2
  "#CBB7F9",           //3
  "#B7DCF9",           //4
  "#B7F9DF",           //5
  "#C8F9B7",           //6
  "#F9F3B7",           //7
  "#777",           //8
];

const TETRO_TYPES = [
  [], //0

  [           //1.i
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ],
  [           //2.l
    [0,1,0,0],
    [0,1,0,0],
    [0,1,1,0],
    [0,0,0,0]
  ],
  [           //3.j
    [0,0,1,0],
    [0,0,1,0],
    [0,1,1,0],
    [0,0,0,0]
  ],
  [           //4.t
    [0,1,0,0],
    [0,1,1,0],
    [0,1,0,0],
    [0,0,0,0]
  ],
  [           //5.o
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0]
  ],
  [           //6.z
    [0,0,0,0],
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0]
  ],
  [           //7.s
    [0,0,0,0],
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0]
  ],
  [           //8
    [0,0,0,0],
    [0,1,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ]
];

//画像
let blimage;
blimage = new Image();
blimage.src = "3.png";

const START_X = FIELD_COL/2 - TETRO_SIZE/2;
const START_Y = 0;

//テトロミノ本体
let tetro;

//テトロミノ座標
let tetro_x = START_X;
let tetro_y = START_Y;

//テトロミノの形
let tetro_t;

//初期化
let field = [];

//ゲームオーバーフラグ
let over = false;

//スコア
let scores = 0;
let scoresp = 0;

if (scoresp >= 10) {
  GAME_SPEED = 300;
}else if (scoresp >= 30) {
  GAME_SPEED = 250;
}else if (scoresp >= 40) {
  GAME_SPEED = 200;
}else if (scoresp >= 50) {
  GAME_SPEED = 100;
}

tetro_t = Math.floor(Math.random()*(TETRO_TYPES.length-1)+1);
tetro = TETRO_TYPES[ tetro_t];

function init(){
  for(let y = 0 ; y < FIELD_ROW ; y++){
    field[y] = [];
    for(let x = 0 ; x < FIELD_COL ; x++){
      field[y][x] = 0;
      }
  }
  //test

  // let tra_x1 = Math.floor(Math.random()*3);
  // let tra_y1 = Math.floor(Math.random()*12+7);
  // let tra_x2 = Math.floor(Math.random()*3+3);
  // let tra_y2 = Math.floor(Math.random()*12+7);
  // let tra_x3 = Math.floor(Math.random()*3+7);
  // let tra_y3 = Math.floor(Math.random()*12+7);
  // field[tra_y1][tra_x1] = 1;
  // field[tra_y2][tra_x2] = 1;
  // field[tra_y3][tra_x3] = 1;
}

init();
drawField();
drawTetro();

setInterval(dropTetro, GAME_SPEED);

function drawBlock(x,y,c){
  let px = x * BLOCK_SIZE;
  let py = y * BLOCK_SIZE;

  con.drawImage(blimage,
      (c-1)*BLOCK_SIZE,0, BLOCK_SIZE,BLOCK_SIZE,
      px,py,          BLOCK_SIZE,BLOCK_SIZE);

  con.fillStyle = TETRO_COLORS[c];
  con.strokeStyle = 'black';
  // con.fillRect(px,py, BLOCK_SIZE, BLOCK_SIZE);
  // con.strokeRect(px,py, BLOCK_SIZE, BLOCK_SIZE);
}
drawBlock();

//f表示
function drawField(){
  con.clearRect(0,0,SCREEN_W,SCREEN_H);
for(let y = 0 ; y < FIELD_ROW ; y++){
  for(let x = 0 ; x < FIELD_COL ; x++){
    if(field[y][x]){
      drawBlock(x,y,field[y][x]);
    }
  }
}
}

// let plus = 0;
// while (checkMove(0,plus+1))plus++;

//テトロミノ表示
function drawTetro(){
for(let y = 0 ; y < TETRO_SIZE ; y++){
  for(let x = 0 ; x < TETRO_SIZE ; x++){
    if(tetro[y][x] == 1){
      // drawBlock(tetro_x+x,tetro_y+y+plus,0);

      drawBlock(tetro_x + x,tetro_y + y,tetro_t);
    }
  }
}
if (over){
  let s = "GAME OVER";
  con.font = "40px 'ＭＳ ゴシック'";
  let w = con.measureText(s).width;
  let x = SCREEN_W/2 - w/2;
  let y = SCREEN_H/2 - 20;
  con.lineWidth = 4;
  con.strokeStyle = "deeppink";
  con.strokeText(s,x,y);
  con.fillStyle = "#fff";
  con.fillText(s,x,y);
  can.style.background = "pink";
  }
}
//ブロックの衝突判定
function checkMove(mx,my,ntetro){
  if (ntetro == undefined) ntetro = tetro;
  for(let y = 0 ; y < TETRO_SIZE ; y++){
    for(let x = 0 ; x < TETRO_SIZE ; x++){

      if(ntetro[y][x] ){
        let nx = tetro_x + mx + x;
        let ny = tetro_y + my + y;
        if (ny < 0 ||
            nx < 0 ||
            ny >= FIELD_ROW ||
            nx >= FIELD_COL ||
            field[ny][nx]) {
          return false;
        }
      }
    }
  }
  return true;
}

//テトロ回転
function rotate(){
  let ntetro = [];
  for(let y = 0 ; y < TETRO_SIZE ; y++){
    ntetro[y] = [];
    for(let x = 0 ; x < TETRO_SIZE ; x++){
    ntetro[y][x] = tetro[TETRO_SIZE-x-1][y];
  }
}
return ntetro;
}

//テトロを固定する
function fixTetro(){
  for(let y = 0 ; y < TETRO_SIZE ; y++){
    for(let x = 0 ; x < TETRO_SIZE ; x++){
      if (tetro[y][x]) {
        field[tetro_y + y][tetro_x + x] = tetro_t;
      }
  }
}
}

score.textContent = 'SCORE  0';

//ラインが揃ったかチェックして消す
function checkLine(){
  //let linec = 0;
  for(let y = 0 ; y < FIELD_ROW ; y++){
    let flag = true;
    for(let x = 0 ; x < FIELD_COL ; x++){
      if (!field[y][x]){
        flag = false;
        break;
      }
    }
    if(flag){
      //linec++;

      scores = scores + 1;
      scoresp = scores * 5;
      score.textContent = `SCORE  ${scoresp}`;
      for(let ny = y;ny > 0;ny--){
        for(let nx = 0;nx < FIELD_COL;nx++){
          field[ny][nx] = field[ny-1][nx];
        }
      }
    }
  }
}

//ブロックの落ちる処理
function dropTetro(){
  if (over)return;
  if (checkMove(0,1))tetro_y++;
  else {
    fixTetro();
    checkLine();

    tetro_t = Math.floor(Math.random()*(TETRO_TYPES.length-1)+1);
    tetro = TETRO_TYPES[ tetro_t];
    tetro_x = START_X;
    tetro_y = START_Y;

    if(!checkMove(0,0)){
      over = true;
    }
  }

    drawField();
    drawTetro();
}

//キーイベント
document.onkeydown = function(e){
  if (over)return;
  switch (e.keyCode){
    case 37://l
    if (checkMove(-1,0))
      tetro_x--;
      break;
    // case 38://u
    // if (checkMove(0,-1))
    //   tetro_y--;
    //   break;
    case 39://r
    if (checkMove(1,0))
      tetro_x++;
      break;
    case 40://d
    if(checkMove(0,1))
      tetro_y++;
      break;
    case 32://s
      let ntetro = rotate();
      if (checkMove(0,0,ntetro))
      tetro = rotate();
      break;

    case 97:
      blimage.src = "2.png";
      break;
    case 98:
      blimage.src = "3.png";
      break;
    case 99:
      blimage.src = "4.png";
      break;
    case 100:
      blimage.src = "5.png";
      break;
    case 101:
      blimage.src = "6.png";
      break;
  }
  drawField();
  drawTetro();
}
// const l = document.getElementById('l');
// const k = document.getElementById('k');
// const r = document.getElementById('r');
// const d = document.getElementById('d');
//
// l.addEventListener('click',function(){
//   if (checkMove(-1,0))
//     tetro_y--;
//     drawField();
//     drawTetro();
// })
// k.addEventListener('click',function(){
//   let ntetro = rotate();
//   if (checkMove(0,0,ntetro))
//   tetro = rotate();
//   drawField();
//   drawTetro();
// })
// r.addEventListener('click',function(){
//   if (checkMove(1,0))
//     tetro_y--;
//     drawField();
//     drawTetro();
// })
// d.addEventListener('click',function(){
//   if (checkMove(0,1))
//     tetro_y--;
//     drawField();
//     drawTetro();
// })
