import type { CanvasItem } from "./CanvasItem";

export class PathItem implements CanvasItem {
    public ctx: CanvasRenderingContext2D;
    public fillStyle: string = "#000000";
    public strokeStyle: string;
    public lineWidth: number;
    public shape: Path2D;
    public id: string;

    public path: { x: number; y: number }[];

    constructor(
        ctx: CanvasRenderingContext2D,
        point: { x: number; y: number },
        strokeStyle: string,
        lineWidth: number,
        id: string
    ) {
        this.ctx = ctx;
        this.path = [point];
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.shape = new Path2D();
        this.id = id;
    }

    // Draw the path on the canvas
    draw(): void {
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.lineWidth;
        this.shape = new Path2D();
        this.shape.moveTo(this.path[0].x, this.path[0].y);
        for (let point of this.path) {
            this.shape.lineTo(point.x, point.y);
        }
        this.ctx.stroke(this.shape);
    }

    contains(x: number, y: number): boolean {
        return this.ctx.isPointInPath(this.shape, x, y);
    }
    
    move(dx: number, dy: number): void {
        for (let point of this.path) {
            point.x += dx;
            point.y += dy;
        }
    }

    update(x: number, y: number): void {
        this.path.push({ x, y });
    }

    duplicate(id: string): CanvasItem {
        const newItem = new PathItem(this.ctx, 
                                    { x: this.path[0].x + 10, // offset of 10px for visibility
                                        y: this.path[0].y + 10 },
                                    this.strokeStyle, 
                                    this.lineWidth,
                                    id);
        newItem.path = this.path.map(point => ({ x: point.x + 10, 
                                                y: point.y + 10 }));
        return newItem;
    }
}