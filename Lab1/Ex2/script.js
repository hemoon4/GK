"use strict";  // gives improved error-checking in scripts.

/**
 * This function returns a string representing a random RGB color.
 * The returned string can be assigned as the value of graphics.fillStyle
 * or graphics.strokeStyle.
 */
function randomColorString() {
    const r = Math.floor(256*Math.random());
    const g = Math.floor(256*Math.random());
    const b = Math.floor(256*Math.random());
    return "rgb(" + r + "," + g + "," + b + ")";
}
    
/**
 * This function is called in init() to set up mouse event handling
 * on the canvas.  You can modify the nested functions doMouseDown,
 * doMouseDrag, and possibly doMouseUp to change the reponse to
 * mouse events.  As an example, this program does some simple drawing.
 */
function installMouseHandler(graphics) {

    let dragging = false;  // set to true when a drag action is in progress.
    let prevX, prevY;      // previous mouse position during a drag.
    
    let colorChoice;  // Integer code for the selected color in the "colorChoide"
                        // popup menu.  The value is assigned in doMouseDown.
    const shapeSelect = document.getElementById("shapeChoice");
    function doMouseDown(evt) {
            // This function is called when the user presses a button on the mouse.
            // Only the main mouse button will start a drag.
        if (dragging) {
            return;  // if a drag is in progress, don't start another.
        }
        if (evt.button != 0) {
            return;  // don't respond unless the button is the main (left) mouse button.
        }
        var x,y;  // mouse position in canvas coordinates
        var r = canvas.getBoundingClientRect();
        x = Math.round(evt.clientX - r.left);  // translate mouse position from screen coords to canvas coords.
        y = Math.round(evt.clientY - r.top);   // round to integer values; some browsers would give non-integers.
        dragging = true;  // (this won't be the case for all mousedowns in all programs)
        if (dragging) {
            const startX = prevX = x;
            const startY = prevY = y;
            document.addEventListener("mousemove", doMouseMove, false);
            document.addEventListener("mouseup", doMouseUp, false);
        }
        colorChoice = Number(document.getElementById("colorChoice").value);
        // TODO: Anything else to do when mouse is first pressed?
    }
    
    function doMouseMove(evt) {
            // This function is called when the user moves the mouse during a drag.
        if (!dragging) {
            return;  // (shouldn't be possible)
        }
        var x,y;  // mouse position in canvas coordinates
        var r = canvas.getBoundingClientRect();
        x = Math.round(evt.clientX - r.left);  
        y = Math.round(evt.clientY - r.top);
        
        /*------------------------------------------------------------*/
        /* TODO: Add support for more drawing tools. */
        
        if ( Math.abs(x-prevX) + Math.abs(y-prevY) < 3 ) {
            return;  // don't draw squares too close together
        }
            
        if (colorChoice == 0) {
            graphics.fillStyle = randomColorString();
        }
        else if (colorChoice == 1) {
            graphics.fillStyle = "red";
        }
        else if (colorChoice == 2) {
            graphics.fillStyle = "green";
        }
        else if (colorChoice == 3) {
            graphics.fillStyle = "blue";
        } else if(colorChoice === 4) {
            graphics.fillStyle = "pink";
        }
        //https://www.coding.academy/blog/how-to-draw-regular-polygons-using-the-html-canvas
        let numberOfSides = Number(shapeSelect.value);
        if (numberOfSides === 0) {
            numberOfSides = Math.round(Math.random() * 2 + 3); //[3,5]
        }
        const radius = 40;
		const angle = 2 * Math.PI / numberOfSides;
 		graphics.beginPath();
		graphics.moveTo(x +  radius*Math.cos(0), y +  radius*Math.sin(0));          
 		for (let i = 1; i <= numberOfSides; ++i) {
			graphics.lineTo(x + radius*Math.cos(i * angle), y + radius*Math.sin(i * angle));
		}
 		graphics.stroke();
        graphics.fill();
        graphics.closePath();
        
        /*------------------------------------------------------------*/
        
        prevX = x;  // update prevX,prevY to prepare for next call to doMouseMove
        prevY = y;
    }
    
    function doMouseUp(evt) {
            // This function is called when the user releases a mouse button during a drag.
        if (!dragging) {
            return;  // (shouldn't be possible)
        }
        dragging = false;
        document.removeEventListener("mousemove", doMouseMove, false);
        document.removeEventListener("mouseup", doMouseMove, false);
        }
        
        canvas.addEventListener("mousedown", doMouseDown, false);

} // end installMouseHandler


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
        for (var i = 2; i+1 < arguments.length; i = i + 2) { 
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
        for (var i = 2; i+1 < arguments.length; i = i + 2) { 
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
        var color = this.getImageData(x,y,1,1);
        return color.data;
    }
}    // end of addGraphicsContextExtras()

function clearScreen(graphics) {
    graphics.fillStyle = "white";
    graphics.fillRect(0,0,canvas.width,canvas.height);
}

window.addEventListener("load", (event) => {
    let graphics;
    try {
        const canvas = document.getElementById("canvas");
        graphics = canvas.getContext("2d");
    } catch(e) {
        document.getElementById("canvasholder").innerHTML =
            "<p>Canvas graphics is not supported.<br>" +
            "An error occurred while initializing graphics.</p>";
            return;
    }

    addGraphicsContextExtras(graphics);
    installMouseHandler(graphics);
    clearScreen(graphics);

    const clearBtn = document.getElementById("clearBtn");

    clearBtn.addEventListener("click", (event) => {
        clearScreen(graphics);
    });
});
