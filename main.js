import { Ball } from './ball.js';  
import { Hex } from './hexagon.js';  

var cvs;
var ctx;
var d = 20; // Default hexagon radius
var n = 5;  // Default number of hexagons
const hexGrid = Array.from({ length: 2 * n + 1 }, () => Array(2 * n + 1).fill(null));; //Store grid coordinates in axial coordinate system
var balls = [];

// Flags
var showCoord = 2; // Flag to show or hide axial coordinates. 0 = Off, 1 = Cartesian, 2 = Axial
var showBorder = 1; // Flag to show border around hexagons. 1 = show border, 0 = hide border

document.addEventListener('DOMContentLoaded', function() {
    cvs = document.getElementById('hexbreakout');
    ctx = cvs.getContext('2d');

    // initialize balls
    balls = [
        new Ball(cvs.width / 2, cvs.height / 2, 5, 2, 3),
        new Ball(cvs.width / 3, cvs.height / 3, 5, -2, 2),
    ];

    // Call the function initially and whenever the window is resized
    initHexGrid();
    resizeCanvas();
    updateCanvas();
    // Start animation
    animate();
});

// Window resize
window.addEventListener('resize', resizeCanvas);



// Helper Functions =============================================

// Animation loop
function animate() {
    updateCanvas();
    requestAnimationFrame(animate);
}

function updateCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    // Translate to the center of the canvas and apply the current rotation
    ctx.save();  // Save the current context state
    ctx.translate(cvs.width / 2, cvs.height / 2);

    // Redraw the hexagonal grid
    hexGrid.forEach(row => {
        row.forEach(hex => {
            hex.draw(ctx);
        });
    });
    balls.forEach(ball => {
        ball.update(cvs,ctx);
        ball.draw(ctx);
    });

    // Restore the context to remove the translation and rotation for future drawings
    ctx.restore();
}

// Initialize Hex Pattern
function initHexGrid() {
    let q, r, x, y;
    for (q = -n; q <= n; q++) {
        for (r = -n; r <= n; r++) {
            [x, y] = hexToCart([q, r], d);
            hexGrid[q+n][r+n] = new Hex({q,r},{x,y},null,d,null,showBorder);
            hexGrid[q+n][r+n].showCoord = showCoord;
            if (Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r)) < n) {
                // Set initial hex color: 0=black, 1=white. Splitting the hex pattern in half
                if(q<0){
                    hexGrid[q + n][r + n].yingyang = 1;
                } 
                else if (q>0){
                    hexGrid[q + n][r + n].yingyang = 0;
                }
                else if (q==0){
                    (r%2==0) ? hexGrid[q + n][r + n].yingyang = 0 : hexGrid[q + n][r + n].yingyang = 1; // Center row of hexagons split evenly based on even and odd coordinates
                }
                else {
                    hexGrid[q + n][r + n].yingyang = null;
                }
            }
        }
    }
    console.log(hexGrid);
}

// Transform Axial coordinates into cartesian coordinates of unit size d (1 unit is a hexagon of radius d)
function hexToCart(h, d) {
    let x = (3 / 2) * h[0] * d;
    let y = Math.sqrt(3) * d * (h[1] + (h[0] / 2));
    return [x, y];
}



// Function to resize the canvas based on window width
function resizeCanvas() {

    const aspectRatio = 1.777777778; // 16:9 aspect ratio
    const width = cvs.offsetWidth;
    const height = width / aspectRatio;

    // Set the actual canvas size in memory (scaled by device pixel ratio)
    const scaleFactor = window.devicePixelRatio || 1;
    cvs.width = width * scaleFactor;
    cvs.height = height * scaleFactor;

    // Scale the drawing context to account for the device pixel ratio
    //ctx.scale(scaleFactor, scaleFactor);

    // Redraw your content (replace this with your own drawing code)
    updateCanvas(); 
  }


