import type { CanvasItem } from "./CanvasItem";

export class RectangleItem implements CanvasItem {
    public ctx: CanvasRenderingContext2D;
    public fillStyle: string;
    public strokeStyle: string;
    public lineWidth: number;
    public shape: Path2D;
    public id: string;

    public firstPoint: { x: number; y: number };
    public wh: { x: number; y: number };
    
    constructor(
        ctx: CanvasRenderingContext2D,
        point: { x: number; y: number },
        fillStyle: string,
        strokeStyle: string,
        lineWidth: number,
        id: string
    ) {
        this.ctx = ctx;
        this.firstPoint = point;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.shape = new Path2D();
        this.wh = { x: 0, y: 0 };
        this.id = id;
    }

    // Draw the rectangle on the canvas
    draw(): void {
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.lineWidth;
        this.shape = new Path2D();
        this.shape.rect(this.firstPoint.x, this.firstPoint.y, 
            this.wh.x, this.wh.y);
        this.ctx.fill(this.shape);
        this.ctx.stroke(this.shape);
    }

    contains(x: number, y: number): boolean {
        return this.ctx.isPointInPath(this.shape, x, y);
    }
    
    move(dx: number, dy: number): void {
        this.firstPoint.x += dx;
        this.firstPoint.y += dy;
    }

    update(x: number, y: number): void {
        this.wh.x = x - this.firstPoint.x;
        this.wh.y = y - this.firstPoint.y;
    }

    duplicate(id: string): CanvasItem {
        const newRect = new RectangleItem(this.ctx,
                                        { x: this.firstPoint.x + 10, // offset of 10px for visibility
                                        y: this.firstPoint.y + 10 },
                                        this.fillStyle,
                                        this.strokeStyle,
                                        this.lineWidth,
                                        id);
        newRect.wh = { x: this.wh.x, y: this.wh.y };
        return newRect;
    }
}