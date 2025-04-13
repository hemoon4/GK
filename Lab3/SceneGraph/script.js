"use strict";

let canvas;   // The canvas that is used as the drawing surface
let graphics; // The 2D graphics context for drawing on the canvas.

const X_LEFT = -4;    // The xy limits for the coordinate system.
const X_RIGHT = 4;
const Y_BOTTOM = -3;
const Y_TOP = 3;

const BACKGROUND = "white";  // The display is filled with this color before the scene is drawn.
     
let pixelSize;  // The size of one pixel, in the transformed coordinates.
        
let frameNumber = 0;  // Current frame number. goes up by one in each frame.

let world;  // A SceneGraphNode representing the entire scene. 
let swing1, swing2, swing3;

/**
 *  Builds the data structure that represents the entire picture.
 */

function createWorld() {
    world = new CompoundObject();
    swing1 = new Swing("purple");
    swing2 = new Swing("blue");
    swing3 = new Swing("green");

    const swingTranform1 = new TransformedObject(swing1);
    swingTranform1.setTranslation(-2.5, 1).setScale(0.75, 0.75);
    world.add(swingTranform1);

    const swingTranform2 = new TransformedObject(swing2);
    swingTranform2.setTranslation(1, -0.5);
    world.add(swingTranform2);

    const swingTranform3 = new TransformedObject(swing3);
    swingTranform3.setTranslation(2,2).setScale(0.5, 0.5);
    world.add(swingTranform3);
}



/**
 * This method is called just before each frame is drawn.  It updates the modeling
 * transformations of the objects in the scene that are animated.
 */
function updateFrame() {
    frameNumber++;

    const angle = frameNumber * 0.75;

    swing1.setPentagonsRotation(angle);
    swing2.setPentagonsRotation(angle);
    swing3.setPentagonsRotation(angle);
}

//------------------- A Simple Scene Object-Oriented Scene Graph API ----------------

/**
 * The (abstract) base class for all nodes in the scene graph data structure.
 */
class SceneGraphNode {
    #fillColor
    #strokeColor
    constructor() {
        this.#fillColor = null;   // If non-null, the default fillStyle for this node.
        this.#strokeColor = null; // If non-null, the default strokeStyle for this node.
    }
    // This method is meant to be abstract and must be OVERRIDDEN in an actual
    // object. It is not meant to be called; it is called by draw().
    doDraw(g) {
        throw "doDraw not implemented in SceneGraphNode"
    }
    // This method should be CALLED to draw the object It should NOT
    // ordinarily be overridden in subclasses.
    draw(g) {
        graphics.save();
        if (this.#fillColor) {
            g.fillStyle = this.#fillColor;
        }
        if (this.#strokeColor) {
            g.strokeStyle = this.#strokeColor;
        }
        this.doDraw(g);
        graphics.restore();
    }
    // Sets fillColor for this node to color.
    // Color should be a legal CSS color string, or null.
    set fillColor(color) {
        this.#fillColor = color;
    }
    // Sets strokeColor for this node to color.
    // Color should be a legal CSS color string, or null.
    set strokeColor(color) {
        this.#strokeColor = color;
    }
    // Sets both the fillColor and strokeColor to color.
    // Color should be a legal CSS color string, or null.
    setColor(color) {
        this.#strokeColor = color;
        this.#fillColor = color;
        return this;
    }
}

/**
 *  Defines a subclass, CompoundObject, of SceneGraphNode to represent
 *  an object that is made up of sub-objects.  Initially, there are no
 *  sub-objects.  Objects are added with the add() method.
 */
class CompoundObject extends SceneGraphNode {
    constructor() {
        super();
        this.subobjects = [];
    }
    add(node) {
        this.subobjects.push(node);
        return this;
    }
    doDraw(g) {
        // Just call the sub-objects' draw() methods.
        for (const node of this.subobjects) {
            node.draw(g);
        }
    }
    draw(g) {
        super.draw(g);
    }
}

class Swing extends CompoundObject {
    #leftPentagon
    #rightPentagon
    #lineBetween
    #base
    constructor(color) {
        super();

        this.#leftPentagon = new TransformedObject(pentagon);
        this.#leftPentagon.setTranslation(-1.3, 0.7);

        this.add(this.#leftPentagon);
        
        this.#rightPentagon = new TransformedObject(pentagon);
        this.#rightPentagon.setTranslation(1.3, -0.7);
        this.add(this.#rightPentagon);

        this.#lineBetween = new TransformedObject(line);
        this.#lineBetween.setColor("red");
        this.#lineBetween.rotationInDegrees = -30;
        this.add(this.#lineBetween);

        this.#base = new TransformedObject(filledTriangle);
        this.#base.setScale(0.75, 2).setTranslation(0, -2).setColor(color);
        this.add(this.#base);
    }
    setPentagonsRotation(angle) {
        this.#leftPentagon.rotationInDegrees = angle;
        this.#rightPentagon.rotationInDegrees = angle;
    }
}


/**
 *  Define a subclass, TransformedObject, of SceneGraphNode that
 *  represents an object along with a modeling transformation to
 *  be applied to that object.  The object must be specified in
 *  the constructor.  The transformation is specified by calling
 *  the setScale(), setRotate() and setTranslate() methods. Note that
 *  each of these methods returns a reference to the TransformedObject
 *  as its return value, to allow for chaining of method calls.
 *  The modeling transformations are always applied to the object
 *  in the order scale, then rotate, then translate.
 */
class TransformedObject extends SceneGraphNode {
    #object
    #rotationInDegrees
    #scaleX
    #scaleY
    #translateX
    #translateY
    constructor(object) {
        super();
        this.#object = object;
        this.#rotationInDegrees = 0;
        this.#scaleX = 1;
        this.#scaleY = 1;
        this.#translateX = 0;
        this.#translateY = 0;
    }
    // Set the angle of rotation, measured in DEGREES.  The rotation
    // is always about the origin.
    set rotationInDegrees(angle) {
        this.#rotationInDegrees = angle;
        return this;
    }
    // Sets scaling factors.
    setScale(sx, sy) {
        this.#scaleX = sx;
        this.#scaleY = sy;
        return this;
    }
    // Set translation mounts.
    setTranslation(dx,dy) {
        this.#translateX = dx;
        this.#translateY = dy;
        return this;
    }
    // Draws the object, with its modeling transformation.
    doDraw(g) {
        g.save();
        if (this.#translateX != 0 || this.#translateY != 0) {
            g.translate(this.#translateX, this.#translateY);
        }
        if (this.rotationInDegree != 0) {
            g.rotate(this.#rotationInDegrees / 180 * Math.PI);
        }
        if (this.scaleX != 1 || this.scaleY != 1) {
            g.scale(this.#scaleX, this.#scaleY);
        }
        this.#object.draw(g);
        g.restore();
    }
}

       // Create some basic shapes as custom SceneGraphNode objects.

const line = new SceneGraphNode();  // Line from (-0.5,0) to (0.5,0)
line.doDraw = function(g) {
    g.beginPath();
    g.moveTo(-1.5,0);
    g.lineTo(1.5,0);
    g.lineWidth = 0.2;
    g.stroke();
}

const filledRect = new SceneGraphNode();  // Filled square, size = 1, center = (0,0)
filledRect.doDraw = function(g) {
    g.fillRect(-0.5,-0.5,1,1);
}

const rect = new SceneGraphNode(); // Stroked square, size = 1, center = (0,0)
rect.doDraw = function(g) {
    g.strokeRect(-0.5,-0.5,1,1);
}

const filledCircle = new SceneGraphNode(); // Filled circle, diameter = 1, center = (0,0)
filledCircle.doDraw = function(g) {
    g.beginPath();
    g.arc(0,0,0.5,0,2*Math.PI);
    g.fill();
}

const circle = new SceneGraphNode();// Stroked circle, diameter = 1, center = (0,0)
circle.doDraw = function(g) {
    g.beginPath();
    g.arc(0,0,0.5,0,2*Math.PI);
    g.stroke();
}

const filledTriangle = new SceneGraphNode(); // Filled Triangle, width 1, height 1, center of base at (0,0)
filledTriangle.doDraw = function(g) {
    g.beginPath();
    g.moveTo(-0.5,0);
    g.lineTo(0.5,0);
    g.lineTo(0,1);
    g.closePath();
    g.fill();
} 
const pentagon = new SceneGraphNode();
pentagon.doDraw = function(g) {
    const numberOfSides = 5;
    const angle = 2 * Math.PI / numberOfSides;
    const radius = 0.5;
    graphics.beginPath();
    graphics.moveTo(radius * Math.cos(0), radius * Math.sin(0));          
     for (let i = 1; i < numberOfSides; ++i) {
        graphics.lineTo(radius*Math.cos(i * angle), radius*Math.sin(i * angle));
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
    graphics.fillRect(0, 0, canvas.width, canvas.height);
    graphics.fillStyle = "black";
    applyLimits(graphics, X_LEFT, X_RIGHT, Y_TOP, Y_BOTTOM, false);
    graphics.lineWidth = pixelSize;  // Use 1 pixel as the default line width
    world.draw(graphics);
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
   pixelSize = Math.min(pixelWidth, pixelHeight);
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

window.addEventListener("load", () => {
    canvas = document.getElementById("thecanvas");
    if (!canvas.getContext) {
        document.getElementById("message").innerHTML = "ERROR: Canvas not supported";
        return;
    }
    graphics = canvas.getContext("2d");
    document.getElementById("animateCheck").checked = false; 
    document.getElementById("animateCheck").onchange = doAnimationCheckbox; 
    createWorld();
    draw();
});
