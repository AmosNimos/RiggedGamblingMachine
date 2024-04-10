let Size = 0;
let Cursor = [0,0];
let Target = [2,2];
let fx =1;
let Start = false
let DelayTime = 1;
let RoleTime=0;
let clickSound,vicSound,losSound;
let spinMomentum = 0;
let money = 0;
let textScale = 65;
let win = false;
let looserAim = 9;
let maxAim=10,minAim=7;
let luck = true;
let prize = 20
let winRate =1;
let awin=3;

//Setup the canvas and stuff.
function preload(){
  clickSound = loadSound('click.wav');
  clickSound = loadSound('HomeMade.wav');
  vicSound = loadSound('victory.mp3');
  losSound = loadSound('loose2.wav');
  logo = loadImage('GAME.png'); 
}

// This `setup()` function is responsible for initializing the game environment and setting up the initial state of the game.
function setup(){
  // Overall, this function sets up the initial game environment, including the canvas size, graphics settings, text settings, and initial game state.
  pixelDensity(displayDensity()); // Sets the pixel density of the canvas based on the display density of the device. This ensures that graphics are displayed correctly on high-density screens.
  createCanvas(displayWidth, displayHeight); // Creates a canvas element with the specified width and height, matching the size of the display.
  frameRate(30); // Sets the frame rate of the animation to 30 frames per second.

  // Initial win conditions 
  win = round(random(1)); // Generates a random number between 0 and 1 and rounds it to the nearest integer. This is used to randomly determine the initial state of the game (win or lose).
  looserAim = random(minAim,maxAim); // Sets `looserAim` to a random value between `minAim` and `maxAim`. This variable is used to determine the maximum number of rolls before losing.


  // Based scale on canvas:
  Size = (width+height)/17; // Calculates the size of grid cells based on the width and height of the canvas.
  strokeWeight(Size/16); // Sets the stroke weight (line thickness) based on the size of grid cells.
  rectMode(CENTER); // Set rectangle position from the center

  // Display background and logo
  background(0); // Set background to black
  imageMode(CENTER); // Set image position from the center
  image(logo, width/2, (height/2)-(width/10), width*2, width); // Display image logo

  // Text prompt:
  fill(255); // Set text filling to white
  noStroke(); // No text border
  textAlign(CENTER,CENTER); // Placement at the center
  textScale = Size/2; // Based text size on the canvas
  textSize(textScale/2); //Apply text size
  text("[CLICK TO START]",width/2,height/2+(height/5)); // Display text
}

//Draw everithing.
// Update the visual display of the game
function draw(){
  // Handle animation effect
  if(fx>1){
    // Decrease the animation effect
    fx -= 0.1;
    // Update the display
    draw_update();
  }

  // Check if the game has started and there is a small delay
  if(Start==true && DelayTime<=1){
    // Perform a game action
    roll();
    // Update the display
    draw_update();
  } else if(Start==true && DelayTime>=0){
    // Decrease the delay time
    DelayTime -= 1;
  }

  // Handle the spinMomentum animation
  if(spinMomentum>0){
    // Decrease the spinMomentum value
    spinMomentum -= 1;
    // Update the display
    draw_update();
  }
}

//Update draw manually
// Manually update the visual display
function draw_update(){
  // Set the background color
  background(0);

  // Set the text and stroke styles based on the spinMomentum
  if(spinMomentum<=0){
    // If no spinMomentum, set fill color to white and disable stroke
    fill(255);
    noStroke();
  } else {
    // If spinMomentum, set fill color to white and stroke color to red or green
    fill(255);
    stroke(round(random(1))*255,0,0); // Randomly choose between red (255,0,0) and green (0,255,0) stroke
  }

  // Set text size and font for money display
  textSize(textScale+fx*10);
  textFont('Helvetica'); 
  // Display player's money
  text(money+"$",2*Size*1.5,Size/2);

  // Set text size and font for prize display
  textSize(round(textScale/2)+fx*10);
  textFont('Times New Roman');
  // Display current prize
  text("PRIZE: "+prize+"$",2*Size*1.5,(3*Size*1.5)+Size);

  // Draw the grid
  grid();
}

//Calsulate the grid to render.
// Calculate and render the grid for the game
function grid(){
  // Set the stroke color for grid lines
  stroke(255);

  // Iterate over each square in the 3x3 grid
  for(x=0; x<3; x++){
    for(y=0; y<3; y++){
      // Cursor
      // Check if the current square is the cursor's position and the game has started or the wheel is still spinning
      if(x == Cursor[0] && y == Cursor[1] && (Start || spinMomentum>0)){
        // Check if the cursor is not on the target square
        if((x == Target[0] && y == Target[1]) == false){
          // Draw a filled rectangle for the cursor
          fill(255);
          rect(Size*1.5+x*Size*1.5, Size*1.5+y*Size*1.5, Size/fx, Size/fx, 5);
        } else {
          // Draw a filled rectangle for the cursor at half size if it's on the target square
          fill(255)
          rect(Size*1.5+x*Size*1.5, Size*1.5+y*Size*1.5, Size/2, Size/2, 5);
        }
      } else if(x == Cursor[0] && y == Cursor[1]){
        // Draw an empty rectangle for the cursor if the game has not started or the wheel has stopped
        noFill();
        rect(Size*1.5+x*Size*1.5, Size*1.5+y*Size*1.5, Size/2, Size/2, 5);
      }

      // Target
      // Check if the current square is the target square
      if(x == Target[0] && y == Target[1]){
        // Set the stroke color to red and draw an empty rectangle for the target square
        stroke(255, 0, 0);
        noFill();
        rect(Size*1.5+x*Size*1.5, Size*1.5+y*Size*1.5, Size/2, Size/2, 5);
      }

      // Draw the grid squares
      if(spinMomentum <= 0){
        // If the wheel has stopped, draw an empty rectangle for the grid square
        noFill();
        stroke(255);
        rect(Size*1.5+x*Size*1.5, Size*1.5+y*Size*1.5, Size, Size, 5);
      } else {
        // If the wheel is still spinning, draw a filled rectangle with a random color for the grid square
        fill(round(random(1))*255, 0, 0); // Randomly choose between red (255,0,0) and green (0,255,0) fill
        stroke(255);
        rect(Size*1.5+x*Size*1.5, Size*1.5+y*Size*1.5, Size, Size, 5);
        
        // Highlight the cursor position if the game has started or the wheel is still spinning
        if(x == Cursor[0] && y == Cursor[1] && (Start || spinMomentum>0)){
          fill(255);
          rect(Size*1.5+x*Size*1.5, Size*1.5+y*Size*1.5, Size/fx, Size/fx, 5);
        } else if(x == Cursor[0] && y == Cursor[1]){
          // Draw an empty rectangle for the cursor position if the game has not started
          rect(Size*1.5+x*Size*1.5, Size*1.5+y*Size*1.5, Size/2, Size/2, 5);
        }
      }
    }
  }
}

var roleSpeed=0.5; // Initial value for roleSpeed

// Roll function controls the spinning animation of the grid squares
function roll(){
  if(awin==0){ // If player wins
    aswin(); // Call aswin function
    awin=3; // Reset awin
  } else if (awin==1){ // If player loses
    aslost(); // Call aslost function
    awin=3; // Reset awin
  } else {
    RoleTime+=roleSpeed; // Increment RoleTime by roleSpeed
    if(RoleTime>1){ // If RoleTime exceeds 1
      roleSpeed+=0.05; // Increase roleSpeed by 0.05
    }
    DelayTime=RoleTime; // Set DelayTime to RoleTime
    if(Cursor[0]<2){ // Move cursor to the next square horizontally
      Cursor[0]+=1;
    } else {
      Cursor[0]=0; // Reset cursor to the first square in the row
      if(Cursor[1]<2){ // Move cursor to the next row
        Cursor[1]+=1;
      } else {
        Cursor[1]=0; // Reset cursor to the first row
      }
    }
    clickSound.play(); // Play click sound
  }
  // Check if player wins or loses
  if(round(DelayTime)>looserAim-1 && Cursor[0]==Target[0] && Cursor[1]==Target[1] && win==true){
    awin=0; // Player wins
  } else if(round(DelayTime)>looserAim && Cursor[0]!=Target[0] && Cursor[1]!=Target[1] && win==false){
    awin=1; // Player loses
  }
}

// Function called when player loses
function aslost(){
  Start=false; // Stop the game
  fx+=1; // Increment fx (spin speed)
  DelayTime=1; // Reset DelayTime
  RoleTime=0; // Reset RoleTime
  money-=10; // Deduct money
  if(winRate>1){ // Decrease winRate
    winRate-=0.1;
  }
  if(round(random(3))==1){ // Possibly add a small prize
    prize+=5;
  }
  looserAim = random(minAim,maxAim); // Generate a new losing aim
  roleSpeed=0.5; // Reset roleSpeed
  if (losSound.isPlaying()) { // Play losing sound
    losSound.stop();
    losSound.play();
  } else {
    losSound.play();
  } 
  Luck(); // Call Luck function
}

// Function called when player wins
function aswin(){
  Start=false; // Stop the game
  DelayTime=1; // Reset DelayTime
  RoleTime=0; // Reset RoleTime
  roleSpeed=0.5; // Reset N
  spinMomentum=40; // Set spinMomentum
  money+=prize; // Add prize money to balance
  prize=20; // Reset prize
  clickSound.stop(); // Stop click sound
  fx+=1; // Increment fx (spin speed)
  if (vicSound.isPlaying()) { // Play winning sound
    vicSound.stop();
    vicSound.play();
  } else {
    vicSound.play();
  }
  Luck(); // Call Luck function
  winRate+=1; // Increment winRate
  // Generate a new target square
  Target = [round(random(2)),round(random(2))];
  while(Target==Cursor){ // Ensure target is not the same as cursor
    Target = [round(random(2)),round(random(2))];
  }
}

// Simulate luck
function Luck(){
  if(luck==true){
    if(round(random(winRate))==1){ // Determine if player wins based on winRate
      win=true;
    } else {
      win=false;
    }
    print(win); // Print win outcome
  }
}

// Event handler for mouse press
function mousePressed(){
  fullscreen(true); // Toggle fullscreen mode
  if(Start==false && spinMomentum<=0){ // Start the game if not already started and grid is not spinning
    fx+=0.5; // Increment fx (spin speed)
    Start=true; // Set Start to true
  }
}

// Event handler for key press
function keyPressed() {
  fullscreen(true); // Toggle fullscreen mode
  if (keyCode === ENTER || keyCode === 32) { // If Enter or Spacebar is pressed
    if(Start==false && spinMomentum<=0){ // Start the game if not already started and grid is not spinning
      fx+=0.5; // Increment fx (spin speed)
      Start=true; // Set Start to true
    }
  } else {
    print(keyCode); // Print the keyCode
  }
}
