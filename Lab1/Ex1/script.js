"use strict";  // gives improved error-checking in scripts.

function drawCircle(graphics, x,y,radius, fillColor, strokeWidth, strokeColor) {
    graphics.beginPath();
    graphics.arc(x, y, radius, 0, 2*Math.PI);
    graphics.fillStyle = fillColor;
    graphics.fill();
    graphics.lineWidth = strokeWidth;
    graphics.strokeStyle = strokeColor;
    graphics.stroke();
    graphics.closePath();
}

/**
 *  The draw() function is called by init() after the page loads,
 *  to draw the content of the canvas.  At the start, clear the canvas
 *  and save a copy of the state; restore the state at the end.  (These
 *  actions are not necessary in this program, since the function will
 *  only be called once.)
 */
function draw(graphics) {
    graphics.clearRect(graphics, 0,0,600,600);
    //face
    drawCircle(graphics, 300, 300, 100, "red", 2, "black");
    //eyes
    drawCircle(graphics, 260, 270, 20, "white", 0, "white");
    drawCircle(graphics, 340, 270, 20, "white", 0, "white");
    //black thing inside eyes
    drawCircle(graphics, 257, 267, 10, "black", 0, "black");
    drawCircle(graphics, 337, 267, 10, "black", 0, "black");
    //white thing inside black thing inside eyes
    drawCircle(graphics, 252, 263, 2, "white", 0, "white");
    drawCircle(graphics, 332, 263, 2, "white", 0, "white");

    //mouth
    graphics.beginPath();
    graphics.moveTo(250, 350);
    graphics.bezierCurveTo(270, 370, 300, 400, 350, 350);
    graphics.fillStyle = "black";
    graphics.fill();
    graphics.closePath();
    graphics.beginPath();
    graphics.moveTo(250, 350);
    graphics.bezierCurveTo(300, 360, 300, 360, 360, 350);
    graphics.fillStyle = "red";
    graphics.fill();
    
    //teeth
    graphics.fillStyle = "white";
    graphics.strokeStyle = "grey";
    graphics.lineWidth = 1.3;
    graphics.fillPoly(290, 357, 290, 368, 297, 368, 297, 358);
    graphics.stroke();
    graphics.fillStyle = "white";
    graphics.strokeStyle = "grey";
    graphics.lineWidth = 1.3;
    graphics.fillPoly(297, 358, 297, 368, 308, 368, 308, 357);
    graphics.stroke();
    graphics.closePath();
    graphics.beginPath();

    //thing on the left and right side of mouth
    graphics.beginPath();
    graphics.arc(240, 350, 10, 5.5, 7.32);
    graphics.strokeStyle = "black";
    graphics.lineWidth = 2;
    graphics.stroke();
    graphics.closePath();

    //thing on the right and right side of mouth
    graphics.beginPath();
    graphics.arc(356, 352, 10, 2.3, 4);
    graphics.strokeStyle = "black";
    graphics.lineWidth = 2;
    graphics.stroke();
    graphics.closePath();
} // end of draw()



/**
 * Sets up a transformation in the graphics context so that the canvas will
 * show x-values in the range from left to right, and y-values in the range
 * from bottom to top.  If preserveAspect is true, then one of the ranges
 * will be increased, if necessary, to account for the aspect ratio of the
 * canvas.  This function sets the global variable pixelsize to be the
 * size of a pixel in the new coordinate system.  (If preseverAspect is
 * true, pixelSize is the maximum of its horizontal and vertical sizes.)
 */
function applyWindowToViewportTransformation(left,right,bottom,top,preserveAspect) {
    if (preserveAspect) {
        // Adjust the limits to match the aspect ratio of the drawing area.
        const displayAspect = Math.abs(canvas.height / canvas.width);
        const windowAspect = Math.abs(( top-bottom ) / ( right-left ));
        let excess;
        if (displayAspect > windowAspect) {
            // Expand the viewport vertically.
            excess = (top-bottom) * (displayAspect/windowAspect - 1);
            top = top + excess/2;
            bottom = bottom - excess/2;
        }
        else if (displayAspect < windowAspect) {
            // Expand the viewport vertically.
            excess = (right-left) * (windowAspect/displayAspect - 1);
            right = right + excess/2;
            left = left - excess/2;
        }
    }
    graphics.scale( canvas.width / (right-left), canvas.height / (bottom-top) );
    graphics.translate( -left, -top );
    const pixelwidth =  Math.abs(( right - left ) / canvas.width);
    const pixelheight = Math.abs(( bottom - top ) / canvas.height);
    const pixelSize = Math.max(pixelwidth,pixelheight);
}  // end of applyWindowToViewportTransformation()


/**
 * This function can be called to add a collection of extra drawing function to
 * a graphics context, to make it easier to draw basic shapes with that context.
 * The parameter, graphics, must be a canvas 2d graphics context.
 *
 * The following new functions are added to the graphics context:
 *
 *    graphics.strokeLine(x1,y1,x2,y2) -- stroke the line from (x1,y1) to (x2,y2).
 *    graphics.fillCircle(x,y,r) -- fill the circle with center (x,y) and radius r.
 *    graphics.strokeCircle(x,y,r) -- stroke the circle.
 *    graphics.fillOval(x,y,r1,r2) -- fill oval with center (x,y) and radii r1 and r2.
 *    graphics.stokeOval(x,y,r1,r2) -- stroke the oval
 *    graphics.fillPoly(x1,y1,x2,y2,...) -- fill polygon with vertices (x1,y1), (x2,y2), ...
 *    graphics.strokePoly(x1,y1,x2,y2,...) -- stroke the polygon.
 *    graphics.getRGB(x,y) -- returns the color components of pixel at (x,y) as an array of
 *         four integers in the range 0 to 255, in the order red, green, blue, alpha.
 *
 * (Note that "this" in a function that is called as a member of an object refers to that
 * object.  Here, this will refer to the graphics context.)
 */
function addGraphicsContextExtras(graphics) {
    graphics.strokeLine = function(x1,y1,x2,y2) {
        this.beginPath();
        this.moveTo(x1,y1);
        this.lineTo(x2,y2);
        this.stroke();
    }
    graphics.fillCircle = function(x,y,r) {
        this.beginPath();
        this.arc(x,y,r,0,2*Math.PI,false);
        this.fill();
    }
    graphics.strokeCircle = function(x,y,radius) {
        this.beginPath();
        this.arc(x,y,radius,0,2*Math.PI,false);
        this.stroke();
    }
    graphics.fillPoly = function() { 
        if (arguments.length < 6)
           return;
        this.beginPath();
        this.moveTo(arguments[0],arguments[1]);
        for (let i = 2; i+1 < arguments.length; i = i + 2) { 
           this.lineTo(arguments[i],arguments[i+1]);
        }
        this.closePath();
        this.fill();
    }
    graphics.strokePoly = function() { 
        if (arguments.length < 4)
            return;
        this.beginPath();
        this.moveTo(arguments[0],arguments[1]);
        for (let i = 2; i+1 < arguments.length; i = i + 2) { 
            this.lineTo(arguments[i],arguments[i+1]);
        }
        this.closePath();
        this.stroke();
    }
    graphics.fillOval = function(x,y,horizontalRadius,verticalRadius) {
        this.save();
        this.translate(x,y);
        this.scale(horizontalRadius,verticalRadius);
        this.beginPath();
        this.arc(0,0,1,0,2*Math.PI,false);
        this.restore();
        this.fill();
    }
    graphics.strokeOval = function(x,y,horizontalRadius,verticalRadius) {
        this.save();
        this.translate(x,y);
        this.scale(horizontalRadius,verticalRadius);
        this.beginPath();
        this.arc(0,0,1,0,2*Math.PI,false);
        this.restore();
        this.stroke();
    }
    graphics.getRGB = function(x,y) {
        const color = this.getImageData(x,y,1,1);
        return color.data;
    }
}    // end of addGraphicsContextExtras()

window.addEventListener("load", (event) => {
    let graphics;
    try {
        const canvas = document.getElementById("canvas"); // The canvas element on which we will draw.
        graphics = canvas.getContext("2d"); // A 2D graphics context for drawing on the canvas.
        addGraphicsContextExtras(graphics);
    } catch (e) {
        document.getElementById("canvasDiv").innerHTML =
            "Canvas graphics is not supported.<br>" +
            "An error occurred while initializing graphics.";
    }    
    draw(graphics);
});

