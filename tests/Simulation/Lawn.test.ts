import { Lawn, LawnPixel } from "../../src/Simulation/Lawn";
import { Position } from "../../src/2D/Position";
import { Line } from "../../src/2D/Line";
import { beforeEach, describe, expect, it } from "@jest/globals";

describe("Lawn", () => {
    let lawn: Lawn;

    beforeEach(() => {
        const boundaryNodes: Position[] = [
            { x: 0, y: 0 },
            { x: 5, y: 0 },
            { x: 0, y: 2.5 },
        ];

        const lawnPixelSize = 1;

        lawn = new Lawn(boundaryNodes, lawnPixelSize);
        lawn.initialize();
    });

    it("should return the correct lawn dimensions", () => {
        const lawnDimensions = lawn.getLawnDimensions();

        expect(lawnDimensions).toEqual({
            minX: 0,
            maxX: 5,
            minY: 0,
            maxY: 2.5,
        });
    });

    it("should return the correct lawn pixels", () => {
        const lawnPixels = lawn.getLawnPixels();
        expect(lawnPixels).toEqual([
            { x: 0, y: 0, wasCut: false },
            { x: 0, y: 1, wasCut: false },
            { x: 0, y: 2, wasCut: false },

            { x: 1, y: 0, wasCut: false },
            { x: 1, y: 1, wasCut: false },

            { x: 2, y: 0, wasCut: false },
            { x: 2, y: 1, wasCut: false },

            { x: 3, y: 0, wasCut: false },

            { x: 4, y: 0, wasCut: false }
        ]);
    });

    it("should return the correct percentage of grass cut", () => {
        lawn.cutGrass({ x: 0.5, y: 0.5 }, { x: 15, y: 15 });

        const percentageCut = lawn.getPercentageCut();

        expect(percentageCut).toBe(5 / 9);
    });

    it("shoud spawn right on equal sized lawn", () => {
        const boundaryNodes: Position[] = [
            { x: 1, y: 1 },
            { x: 3, y: 1 },
            { x: 3, y: 3 },
            { x: 1, y: 3 },
        ];

        const lawnPixelSize = 1;

        lawn = new Lawn(boundaryNodes, lawnPixelSize);
        lawn.initialize();

        expect(lawn.getLawnDimensions()).toEqual({ minX: 1, maxX: 3, minY: 1, maxY: 3 });

        const lawnPixels = lawn.getLawnPixels();
        
        expect(lawnPixels).toHaveLength(4);
        expect(lawnPixels).toEqual( [
            { x: 1, y: 1, wasCut: false },
            { x: 1, y: 2, wasCut: false },
            { x: 2, y: 1, wasCut: false },
            { x: 2, y: 2, wasCut: false }
        ]);
    });
});