import { Collision } from "../2D/Collision";
import { Line } from "../2D/Line";
import { Position } from "../2D/Position";
import Simulation from "./Simulation";

type LawnDimensions = {
    minX: number,
    maxX: number,
    minY: number,
    maxY: number,
};

export type LawnPixel = {
    x: number,
    y: number,
    wasCut: boolean
};

export class Lawn {

    private boundaryNodes: Position[];
    private lawnPixels: LawnPixel[] = [];
    private lawnPixelSize: number;


    constructor(boundaryNodes: Position[], lawnPixelSize: number) {

        this.boundaryNodes = boundaryNodes;
        this.lawnPixelSize = lawnPixelSize;
    }

    public initialize() {
        const lawnDimensions = this.getLawnDimensions();

        for (let x = lawnDimensions.minX; x <= lawnDimensions.maxX; x += this.lawnPixelSize) {
            for (let y = lawnDimensions.minY; y <= lawnDimensions.maxY; y += this.lawnPixelSize) {
                let pixel = { x: x, y: y, wasCut: false };
                if (this.isInsideBoundary(pixel)) {
                    this.lawnPixels.push(pixel);
                }
            }
        }

    }

    private isInsideBoundary(pixel: LawnPixel): boolean {
        return Collision.positionIsInsideBoundary({ x: pixel.x, y: pixel.y }, this.boundaryNodes);
    }

    public getLawnDimensions(): LawnDimensions {
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;

        for (let node of this.boundaryNodes) {
            if (node.x < minX) {
                minX = node.x;
            }
            if (node.x > maxX) {
                maxX = node.x;
            }
            if (node.y < minY) {
                minY = node.y;
            }
            if (node.y > maxY) {
                maxY = node.y;
            }
        }

        return {
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY
        };
    }

    public getLawnPixels(): LawnPixel[] {
        return this.lawnPixels;
    }

    public getPercentageCut(): number {
        return this.lawnPixels.filter(pixel => pixel.wasCut).length / this.lawnPixels.length;
    }

    public cutGrass(from: Position, to: Position) {
        for (let pixel of this.lawnPixels) {
            if (pixel.wasCut) {
                continue;
            }

            const collision = Collision.lineWithLawnPixel([from, to], pixel, this.lawnPixelSize);
            if (collision) {
                pixel.wasCut = true;
            }
        }
    }

}