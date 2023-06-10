export default class Ball {
    x: number;
    y: number;
    radius: number;
    color: string;
    constructor(stageWidth: number, stageHeight: number, radius: number, speed: number, acceleration : number = 0.5) {
        this.radius = radius;

        const diameter = this.radius * 2;
        this.x = diameter + (Math.random() * stageWidth - diameter);
        this.y = diameter + (Math.random() * stageHeight - diameter);
    }

    draw(ctx: CanvasRenderingContext2D, stageWidth: number, stageHeight: number) {
        const maxSpeed = 42;
        if (Math.abs(this.vx) < maxSpeed || Math.abs(this.vy) < maxSpeed) {
            this.vy += this.acceleration ;
        }
        this.x += this.vx;
        this.y += this.vy;

        this.bounceWindow(stageWidth, stageHeight);
        this.bounceBlock(block);

        if (Math.abs(this.vx) < 12)
            ctx.fillStyle = "#fdd700";
        else if (Math.abs(this.vx) < 20)
            ctx.fillStyle = "#ff9800";
        else
            ctx.fillStyle = "#ff5722";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    bounceWindow(stageWidth: number, stageHeight: number) {
        const minX = this.radius;
        const maxX = stageWidth - this.radius;
        const minY = this.radius;
        const maxY = stageHeight - this.radius;

        if (this.x <= minX || this.x >= maxX) {
            this.vx *= -1;
            this.x += this.vx;
        } else if (this.y <= minY || this.y >= maxY) {
            this.vy *= -1;
            this.y += this.vy;
        }
    }

    bounceBlock(block: Block) {
        if (!block) return;
        const minX = block.x - this.radius;
        const maxX = block.maxX + this.radius;
        const minY = block.y - this.radius;
        const maxY = block.maxY + this.radius;

        if (this.x > minX && this.x < maxX && this.y > minY && this.y < maxY) {
            const x1 = Math.abs(minX - this.x);
            const x2 = Math.abs(this.x - maxX);
            const y1 = Math.abs(minY - this.y);
            const y2 = Math.abs(this.y - maxY);
            const min = Math.min(x1, x2, y1, y2);
            switch (min) {
                case x1:
                    this.vx *= -1;
                    this.x += this.vx;
                    break;
                case x2:
                    this.vx *= -1;
                    this.x += this.vx;
                    break;
                case y1:
                    this.vy *= -1;
                    this.y += this.vy;
                    break;
                case y2:
                    this.vy *= -1;
                    this.y += this.vy;
                    break;
            }
        }
    }
}