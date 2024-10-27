// ball.js
export class Ball {
    constructor(x, y, radius, dx, dy, yingyang) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.yingyang = yingyang; // 0 == white ball on black background, 1 == black ball on white background
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.yingyang ? "black" : "red";
        ctx.fill();
        ctx.closePath();
    }

    update(cvs, ctx, hexGrid) {
        // Update position
        this.x += this.dx;
        this.y += this.dy;
    
        // Calculate boundary for collision in centered canvas coordinates
        const boundaryX = cvs.width / 2;
        const boundaryY = cvs.height / 2;
    
        // Reverse direction upon hitting boundaries, based on centered coordinates
        if (this.x - this.radius < -boundaryX || this.x + this.radius > boundaryX) {
            this.dx *= -1;
        }
        if (this.y - this.radius < -boundaryY || this.y + this.radius > boundaryY) {
            this.dy *= -1;
        }
    }
    

    checkCollisionWithHexEdges(hexGrid) {
        for (let hex of hexGrid) {
            const hexEdges = getHexEdges(hex.x, hex.y, d);
            for (let edge of hexEdges) {
                const distance = pointToLineDistance(this.x, this.y, edge.x1, edge.y1, edge.x2, edge.y2);
                if (distance <= this.radius) {
                    reflectBall(this, edge.x1, edge.y1, edge.x2, edge.y2);
                    return;
                }
            }
        }
    }
}
