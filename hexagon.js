// hexagon.js
export class Hex {
    constructor(centerAxial, centerCart, edges, d, yingyang, stroke, showCoord) {
        this.centerAxial = centerAxial;
        this.centerCart = centerCart;
        this.edges = edges;
        this.d = d;
        this.stroke = stroke;
        this.yingyang = yingyang; // 0 == white ball on black background, 1 == black ball on white background
        this.showCoord = showCoord;
    }

    // Draw a single hexagon at the coordinates (x,y) and of size r
    draw(ctx) {
        if (this.yingyang!=null){
            ctx.save();
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                let angle = (Math.PI / 3) * i;
                ctx.lineTo(this.centerCart.x + this.d * Math.cos(angle), this.centerCart.y + this.d * Math.sin(angle));
            }
            ctx.closePath();
            this.yingyang == 1? ctx.strokeStyle = "black": ctx.strokeStyle = "white";
            this.yingyang == 1? ctx.fillStyle = "white": ctx.fillStyle = "black";
            if (this.stroke) ctx.stroke();
            ctx.fill();
            ctx.restore();
            if(this.showCoord){
                let x,y;
                this.showCoord == 1 ? [x, y] = [Math.round(this.centerCart.x),Math.round(this.centerCart.y)] : [x,y] = [this.centerAxial.q,this.centerAxial.r];
                ctx.save();
                ctx.textAlign = "center";
                this.yingyang == 1?ctx.fillStyle = "black": ctx.fillStyle = "white";
                ctx.fillText("(" + x + "," + y + ")", this.centerCart.x, this.centerCart.y);
                ctx.restore();
            }
        }
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