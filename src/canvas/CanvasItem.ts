export interface CanvasItem {
    ctx: CanvasRenderingContext2D;
    fillStyle: string;
    strokeStyle: string;
    lineWidth: number;
    shape: Path2D;
    id: string;

    draw(): void;
    contains(x: number, y: number): boolean;
    move(dx: number, dy: number): void;
    update(x: number, y: number): void;
    duplicate(id: string): CanvasItem;
}