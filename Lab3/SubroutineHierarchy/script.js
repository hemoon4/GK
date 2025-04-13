"use-strict";
let canvas;   // The canvas that is used as the drawing surface
let graphics; // The 2D graphics context for drawing on the canvas.

const X_LEFT = -4;    // The xy limits for the coordinate system.
const X_RIGHT = 4;
const Y_BOTTOM = -3;
const Y_TOP = 3;

const BACKGROUND = "white";  // The display is filled with this color before the scene is drawn.
     
let pixelSize;  // The size of one pixel, in the transformed coordinates.
        
let frameNumber = 0;  // Current frame number. goes up by one in each frame.

/**
 *  Responsible for drawing the entire scene.  The display is filled with the background
 *  color before this function is called.
 */
function drawWorld() {
    rotatingPentagon(1.8, -2, 0.5);
    rotatingPentagon(-0.8, -1, 0.5);
    line(1.8, -2, -0.8, -1, 0.15);
    let points = [0.75, -2.9, 0.25,-2.9, 0.5,-1.5];
    filledTriangle(graphics, points, "blue");

    let scale = 0.75
    let moveFactorX = 4;
    let moveFactorY = 3;
    points = [ -2.5, 0, -2.9, 0, -2.7, 1.15 ];
    
    rotatingPentagon((1.8-moveFactorX)*scale, (-2+moveFactorY)*scale, 0.40);
    rotatingPentagon((-0.8-moveFactorX)*scale, (-1+moveFactorY)*scale, 0.40);
    line((1.8 - moveFactorX)*scale, (-2+moveFactorY)*scale, (-0.8-moveFactorX)*scale, (-1+moveFactorY)*scale, 0.11);
    filledTriangle(graphics, points, "purple");
    scale = 0.5;
    moveFactorX = -4;
    moveFactorY = 4;
    points = [ 2.05, 0.55, 2.35, 0.55, 2.2, 1.25 ];
    rotatingPentagon((1.8-moveFactorX)*scale, (-2+moveFactorY)*scale, 0.25);
    rotatingPentagon((-0.8-moveFactorX)*scale, (-1+moveFactorY)*scale, 0.25);
    line((1.8 - moveFactorX)*scale, (-2+moveFactorY)*scale, (-0.8-moveFactorX)*scale, (-1+moveFactorY)*scale, 0.11);
    filledTriangle(graphics, points, "green");
}
/**
 * This method is called just before each frame is drawn.  It updates the modeling
 * transformations of the objects in the scene that are animated.
 */
function updateFrame() {
    frameNumber++;
}

function rotatingPentagon(x, y, radius) {
    graphics.save();
    graphics.translate(x,y);
    graphics.rotate((frameNumber * 0.75) * Math.PI/180);
    graphics.translate(-x, -y);
    pentagon(x,y, radius);
    graphics.restore();
}

//------------------- Some methods for drawing basic shapes. ----------------

function line(xStart, yStart, xEnd, yEnd, lineWidth) {
    graphics.save();
    graphics.beginPath();
    graphics.moveTo(xStart, yStart);
    graphics.lineTo(xEnd, yEnd);
    graphics.lineWidth = lineWidth;
    graphics.strokeStyle = "red";
    graphics.stroke();
    graphics.restore();
}

function circle() { // Strokes a circle, diameter = 1, center = (0,0)
    graphics.beginPath();
    graphics.arc(0,0,0.5,0,2*Math.PI);
    graphics.closePath();
    graphics.stroke();
}

function filledTriangle(g2, points, color) {
    g2.beginPath();

    g2.moveTo(points[0], points[1]);
    for (let i = 2; i < 6; i += 2) {
        g2.lineTo(points[i], points[i+1]);
    }
    g2.closePath();
    g2.fillStyle = color;
    g2.fill();
}

function pentagon(x, y, radius) {
    const numberOfSides = 5;
    const angle = 2 * Math.PI / numberOfSides;
    graphics.beginPath();
    graphics.moveTo(x +  radius * Math.cos(0), y +  radius * Math.sin(0));          
     for (let i = 1; i <= numberOfSides; ++i) {
        graphics.lineTo(x + radius*Math.cos(i * angle), y + radius*Math.sin(i * angle));
    }
    graphics.closePath();
    
    graphics.stroke();
}




// ------------------------------- graphics support functions --------------------------

/**
  * Draw one frame of the animation.  Probably doesn't need to be changed,
  * except maybe to change the setting of preserveAspect in applyLimits().
  */
function draw() {
    graphics.save();  // to make sure changes don't carry over from one call to the next
    graphics.fillStyle = BACKGROUND;  // background color
    graphics.fillRect(0,0,canvas.width,canvas.height);
    graphics.fillStyle = "black";
    applyLimits(graphics,X_LEFT,X_RIGHT,Y_TOP,Y_BOTTOM,false);
    graphics.lineWidth = pixelSize;  // Use 1 pixel as the default line width
    drawWorld();
    graphics.restore();
}

/**
 * Applies a coordinate transformation to the graphics context, to map
 * xleft,xright,ytop,ybottom to the edges of the canvas.  This is called
 * by draw().  This does not need to be changed.
 */
function applyLimits(g, xleft, xright, ytop, ybottom, preserveAspect) {
   const width = canvas.width;   // The width of this drawing area, in pixels.
   const height = canvas.height; // The height of this drawing area, in pixels.
   if (preserveAspect) {
         // Adjust the limits to match the aspect ratio of the drawing area.
      const displayAspect = Math.abs(height / width);
      const requestedAspect = Math.abs(( ybottom-ytop ) / ( xright-xleft ));
      let excess;
      if (displayAspect > requestedAspect) {
         excess = (ybottom-ytop) * (displayAspect/requestedAspect - 1);
         ybottom += excess/2;
         ytop -= excess/2;
      }
      else if (displayAspect < requestedAspect) {
         excess = (xright-xleft) * (requestedAspect/displayAspect - 1);
         xright += excess/2;
         xleft -= excess/2;
      }
   }
   const pixelWidth = Math.abs(( xright - xleft ) / width);
   const pixelHeight = Math.abs(( ybottom - ytop ) / height);
   pixelSize = Math.min(pixelWidth,pixelHeight);
   g.scale( width / (xright-xleft), height / (ybottom-ytop) );
   g.translate( -xleft, -ytop );
}


//------------------ Animation framework ------------------------------

let running = false;  // This is set to true when animation is running

function frame() {
    if (running) {
           // Draw one frame of the animation, and schedule the next frame.
        updateFrame();
        draw();
        requestAnimationFrame(frame);
    }
}

function doAnimationCheckbox() { 
    const shouldRun = document.getElementById("animateCheck").checked;
    if ( shouldRun != running ) {
        running = shouldRun;
        if (running)
            requestAnimationFrame(frame);
    }
}

//----------------------- initialization -------------------------------

window.addEventListener("load", (evt) => {    
    canvas = document.getElementById("thecanvas");
    if (!canvas.getContext) {
        document.getElementById("message").innerHTML = "ERROR: Canvas not supported";
        return;
    }
    graphics = canvas.getContext("2d");
    document.getElementById("animateCheck").checked = false; 
    document.getElementById("animateCheck").onchange = doAnimationCheckbox; 
    draw();
});