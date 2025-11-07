import type { CanvasItem } from "./CanvasItem";

export class EllipseItem implements CanvasItem {
	public ctx: CanvasRenderingContext2D;
	public fillStyle: string;
	public strokeStyle: string;
	public lineWidth: number;
	public shape: Path2D;
	public id: string;

	public firstPoint: { x: number; y: number };
	public radius: { x: number; y: number };
	public rotation: number;
	public angle: { startAngle: number; endAngle: number };

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
		this.radius = { x: 0, y: 0 };
		this.rotation = 0;
		this.angle = { startAngle: 0, endAngle: 2 * Math.PI };
		this.id = id;
	}

	// Draw the ellipse on the canvas
	draw(): void {
		this.ctx.fillStyle = this.fillStyle;
		this.ctx.strokeStyle = this.strokeStyle;
		this.ctx.lineWidth = this.lineWidth;

		const cx = this.firstPoint.x + this.radius.x;
		const cy = this.firstPoint.y + this.radius.y;

		this.shape = new Path2D();
		this.shape.ellipse(
			cx,
			cy,
			Math.abs(this.radius.x),
			Math.abs(this.radius.y),
			this.rotation,
			this.angle.startAngle,
			this.angle.endAngle
		);

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
		this.radius.x = (x - this.firstPoint.x) / 2;
		this.radius.y = (y - this.firstPoint.y) / 2;
	}

	duplicate(id: string): CanvasItem {
		const newEllipse = new EllipseItem(this.ctx,
											{ x: this.firstPoint.x + 10, // offset of 10px for visibility
											y: this.firstPoint.y + 10 },
											this.fillStyle,
											this.strokeStyle,
											this.lineWidth,
											id);

		newEllipse.radius = { x: this.radius.x, y: this.radius.y };
		newEllipse.rotation = this.rotation;
		newEllipse.angle = { startAngle: this.angle.startAngle, 
								endAngle: this.angle.endAngle };

	return newEllipse;
	}
}
