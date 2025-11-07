import type { CanvasItem } from "./CanvasItem";

export class LineItem implements CanvasItem {
    public ctx: CanvasRenderingContext2D;
    public fillStyle: string = "#000000";
    public strokeStyle: string;
    public lineWidth: number;
    public shape: Path2D;
    public id: string;

    public startPoint: { x: number; y: number };
    public endPoint: { x: number; y: number };

    constructor(
        ctx: CanvasRenderingContext2D,
        point: { x: number; y: number },
        strokeStyle: string,
        lineWidth: number,
        id: string
    ) {
        this.ctx = ctx;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.shape = new Path2D();
        this.startPoint = point;
        this.endPoint = point;
        this.id = id;
    }

    // Draw the line on the canvas
    draw(): void {
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.lineWidth;
        this.shape = new Path2D();
        this.shape.moveTo(this.startPoint.x, this.startPoint.y);
        this.shape.lineTo(this.endPoint.x, this.endPoint.y);
        this.ctx.stroke(this.shape);
    }

    contains(x: number, y: number): boolean {
        const slope = ((this.endPoint.y - this.startPoint.y) 
                        / (this.endPoint.x - this.startPoint.x));
        const intercept = this.startPoint.y - slope * this.startPoint.x;
        // 5px tolerance for easier selection
        return (y >= slope * x + intercept - 5 && y <= slope * x + intercept + 5);
    }
    
    move(dx: number, dy: number): void {
        this.startPoint.x += dx;
        this.startPoint.y += dy;
        this.endPoint.x += dx;
        this.endPoint.y += dy;
    }

    update(x: number, y: number): void {
        this.endPoint = {x: x, y: y};
    }

    duplicate(id: string): CanvasItem {
        const newLine = new LineItem(this.ctx,
                                    { x: this.startPoint.x + 10, // offset of 10px for visibility
                                    y: this.startPoint.y + 10 },
                                    this.strokeStyle,
                                    this.lineWidth,
                                    id);
        newLine.endPoint = { x: this.endPoint.x, y: this.endPoint.y };
        return newLine;
    }
}