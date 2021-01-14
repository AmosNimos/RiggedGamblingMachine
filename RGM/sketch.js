let Size = 0;
let Cursor = [0,0];
let Target = [2,2];
let fx =1;
let Start = false
let DelayTime = 1;
let RoleTime=0;
let clickSound,vicSound,losSound;
let JackPot = 0;
let money = 0;
let textScale = 65;
let win = false;
let looserAim = 9;
let maxAim=10,minAim=7;
let luck = true;
let prize = 20
let winRate =1;
let awin=3;
let ingame=false;
//Setup the canvas and stuff.
function preload(){
  clickSound = loadSound('click.wav');
  //clickSound = loadSound('HomeMade.wav');
  vicSound = loadSound('victory.mp3');
  losSound = loadSound('loose2.wav');
  logo = loadImage('GAME.png'); 
}

function setup(){
  win = round(random(1));
  pixelDensity(displayDensity());
  createCanvas(displayWidth, displayHeight);
  looserAim = random(minAim,maxAim);
  frameRate(30); 
  stroke(255);
  textAlign(CENTER,CENTER);
  Size = (width+height)/17;
  textScale = Size/2;
  strokeWeight(Size/16);
  rectMode(CENTER);
  background(0);
  //draw_update();
  imageMode(CENTER);
  image(logo, width/2, (height/2)-(width/10), width*2, width); 
  fill(255);
  noStroke();
  textSize(textScale/2);
  text("[CLICK TO START]",width/2,height/2+(height/5));
}

//Draw everithing.
function draw(){
  if(fx>1){
    fx-=0.1;
    draw_update();
  }
  if(Start==true && DelayTime<=1){
    roll();
    draw_update();
  } else if(Start==true && DelayTime>=0){
    DelayTime-=1;
  }
  if(JackPot>0){
    JackPot-=1;
    draw_update();
  }
}

//Update draw manually
function draw_update(){
  background(0);
  if(JackPot<=0){
    fill(255);
    noStroke();
  } else {
    fill(255);
    stroke(round(random(1))*255,0,0);
  }
  textSize(textScale+fx*10);
  textFont('Helvetica'); 
  text(money+"$",2*Size*1.5,Size/2);
  textSize(round(textScale/2)+fx*10);
  textFont('Times New Roman');
  text("PRIZE: "+prize+"$",2*Size*1.5,(3*Size*1.5)+Size);
  grid();
}

//Calsulate the grid to render.
function grid(){
  stroke(255);
  for(x=0;x<3;x++){
    for(y=0;y<3;y++){
      //Cursor
      if(x == Cursor[0] && y == Cursor[1] && (Start || JackPot>0)){
        if((x == Target[0] && y == Target[1])==false){
          fill(255);
          rect(Size*1.5+x*Size*1.5,Size*1.5+y*Size*1.5,Size/fx,Size/fx,5);
        } else {
          fill(255)
          rect(Size*1.5+x*Size*1.5,Size*1.5+y*Size*1.5,Size/2,Size/2,5);
        }
      } else if(x == Cursor[0] && y == Cursor[1]){
        noFill();
        rect(Size*1.5+x*Size*1.5,Size*1.5+y*Size*1.5,Size/2,Size/2,5);
      }
      
      //Target
      if(x == Target[0] && y == Target[1]){
        stroke(255,0,0);
        noFill();
        rect(Size*1.5+x*Size*1.5,Size*1.5+y*Size*1.5,Size/2,Size/2,5);
      }
      if(JackPot<=0){
        noFill();
        stroke(255);
        rect(Size*1.5+x*Size*1.5,Size*1.5+y*Size*1.5,Size,Size,5);
      } else {
        //fill(random(5)*50,random(5)*50,random(5)*50);
        fill(round(random(1))*255,0,0);
        stroke(255);
        rect(Size*1.5+x*Size*1.5,Size*1.5+y*Size*1.5,Size,Size,5);
        if(x == Cursor[0] && y == Cursor[1] && (Start || JackPot>0) ){
          fill(255);
          rect(Size*1.5+x*Size*1.5,Size*1.5+y*Size*1.5,Size/fx,Size/fx,5);
        } else if(x == Cursor[0] && y == Cursor[1]){
          rect(Size*1.5+x*Size*1.5,Size*1.5+y*Size*1.5,Size/2,Size/2,5);
        }
        //noStroke();
      }
    }
  }
}

var N=0.5;
function roll(){
  if(awin==0){
    aswin();
    awin=3;
  } else if (awin==1){
    aslost();
    awin=3;
  } else {
    RoleTime+=N;
    if(RoleTime>1){
      N+=0.05;
    }
    DelayTime=RoleTime;
    if(Cursor[0]<2){
      Cursor[0]+=1;
    } else {
      Cursor[0]=0;
      if(Cursor[1]<2){
        Cursor[1]+=1;
      } else {
        Cursor[1]=0;
      }
    }
    clickSound.play();
  }
  if(round(DelayTime)>looserAim-1 && Cursor[0]==Target[0] && Cursor[1]==Target[1] && win==true){
    awin=0
  } else if(round(DelayTime)>looserAim && Cursor[0]!=Target[0] && Cursor[1]!=Target[1] && win==false){
    awin=1
  }
}

function aslost(){
    Start=false;
    fx+=1;
    DelayTime=1;
    RoleTime=0;
    money-=10;
    if(winRate>1){
      winRate-=0.1;
    }
    if(round(random(3))==1){
      prize+=5;
    }
    looserAim = random(minAim,maxAim);
    N=0.5;
    if (losSound.isPlaying()) {
      losSound.stop();
      losSound.play();
    } else {
      losSound.play();
    } 
    Luck();
}

function aswin(){
    Start=false;
    DelayTime=1;
    RoleTime=0;
    N=0.5;
    JackPot=40;
    money+=prize;
    prize=20;
    clickSound.stop();
    fx+=1;
    if (vicSound.isPlaying()) {
      vicSound.stop();
      vicSound.play();
    } else {
      vicSound.play();
    }
    Luck();
    winRate+=1;
    Target = [round(random(2)),round(random(2))];
    while(Target==Cursor){
      Target = [round(random(2)),round(random(2))];
    }
}

function Luck(){
    if(luck==true){
      if(round(random(winRate))==1){
        win=true;
      } else {
        win=false;
      }
      print(win);
    }
}

//detect when mouse is pressed
function mousePressed(){
  fullscreen(true);
  if(Start==false && JackPot<=0){
    fx+=0.5;
    Start=true;
  }
}

function keyPressed() {
  fullscreen(true);
  if (keyCode === ENTER || keyCode === 32) {
    if(Start==false && JackPot<=0){
      fx+=0.5;
      Start=true;
    }
  } else {
    print(keyCode);
  }
}

function mouseDragged(){
}
  
function mouseReleased(){
}
