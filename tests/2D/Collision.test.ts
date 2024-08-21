import { Collision } from "../../src/2D/Collision";
import { Line } from "../../src/2D/Line";
import { LawnPixel } from "../../src/Simulation/Lawn";
import { describe, expect, it, test } from "@jest/globals";

describe("Collision", () => {
    describe("twoLinesFromPoints", () => {
        it("should return false when two lines do not intersect", () => {
            const posA1 = { x: 0, y: 0 };
            const posA2 = { x: 1, y: 1 };
            const posB1 = { x: 2, y: 2 };
            const posB2 = { x: 3, y: 3 };
            const result = Collision.twoLinesFromPoints(posA1, posA2, posB1, posB2);
            expect(result).toBe(false);
        });

        it("should return the intersection position when two lines intersect", () => {
            const posA1 = { x: 0, y: 0 };
            const posA2 = { x: 2, y: 2 };

            const posB1 = { x: 0, y: 2 };
            const posB2 = { x: 2, y: 0 };
            const result = Collision.twoLinesFromPoints(posA1, posA2, posB1, posB2);
            expect(result).toEqual({ x: 1, y: 1 });
        });


        it("should return the intersection position when two lines start at same position", () => {
            const posA1 = { x: 0, y: 0 };
            const posA2 = { x: 2, y: 2 };

            const posB1 = { x: 0, y: 0 };
            const posB2 = { x: 2, y: 0 };
            const result = Collision.twoLinesFromPoints(posA1, posA2, posB1, posB2);
            expect(result).toEqual({ x: 0, y: 0 });
        });

        it("should return false when two lines are laying on each other", () => {
            const posA1 = { x: 0, y: 0 };
            const posA2 = { x: 2, y: 0 };

            const posB1 = { x: 0, y: 0 };
            const posB2 = { x: 2, y: 0 };
            const result = Collision.twoLinesFromPoints(posA1, posA2, posB1, posB2);
            expect(result).toEqual(false);
        });
    });

    describe("twoLines", () => {
        it("should return false when two lines do not intersect", () => {
            const posA1 = { x: 0, y: 0 };
            const posA2 = { x: 1, y: 1 };
            const posB1 = { x: 2, y: 2 };
            const posB2 = { x: 3, y: 3 };
            const result = Collision.twoLines([posA1, posA2], [posB1, posB2]);
            expect(result).toBe(false);
        });

        it("should return the intersection position when two lines intersect", () => {
            const posA1 = { x: 0, y: 0 };
            const posA2 = { x: 2, y: 2 };

            const posB1 = { x: 0, y: 2 };
            const posB2 = { x: 2, y: 0 };
            const result = Collision.twoLines([posA1, posA2], [posB1, posB2], [{ x: 20, y: 1 }]);
            expect(result).toEqual({ x: 1, y: 1 });
        });

        it("should not return the intersection position because it is ignored", () => {
            const posA1 = { x: 0, y: 0 };
            const posA2 = { x: 2, y: 2 };

            const posB1 = { x: 0, y: 2 };
            const posB2 = { x: 2, y: 0 };
            const result = Collision.twoLines([posA1, posA2], [posB1, posB2], [{ x: 1, y: 1 }]);
            expect(result).toEqual(false);
        });


        it("should return the intersection position when two lines start at same position", () => {
            const posA1 = { x: 0, y: 0 };
            const posA2 = { x: 2, y: 2 };

            const posB1 = { x: 0, y: 0 };
            const posB2 = { x: 2, y: 0 };
            const result = Collision.twoLines([posA1, posA2], [posB1, posB2]);
            expect(result).toEqual({ x: 0, y: 0 });
        });

        it("should return false when two lines are laying on each other", () => {
            const posA1 = { x: 0, y: 0 };
            const posA2 = { x: 2, y: 0 };

            const posB1 = { x: 0, y: 0 };
            const posB2 = { x: 2, y: 0 };
            const result = Collision.twoLines([posA1, posA2], [posB1, posB2]);
            expect(result).toEqual(false);
        });
    });

    describe("positionIsInsideBoundary", () => {
        it("should return true when position is inside the boundary", () => {
            const position = { x: 1, y: 1 };
            const boundary = [
                { x: 0, y: 0 },
                { x: 2, y: 0 },
                { x: 2, y: 2 },
                { x: 0, y: 2 }
            ];
            const result = Collision.positionIsInsideBoundary(position, boundary);
            expect(result).toBe(true);
        });

        it("should return false when position is outside the boundary", () => {
            const position = { x: 3, y: 3 };
            const boundary = [
                { x: 0, y: 0 },
                { x: 2, y: 0 },
                { x: 2, y: 2 },
                { x: 0, y: 2 }
            ];
            const result = Collision.positionIsInsideBoundary(position, boundary);
            expect(result).toBe(false);
        });

        it("should return false when position is on the boundary", () => {
            const position = { x: 2, y: 1 };
            const boundary = [
                { x: 0, y: 0 },
                { x: 2, y: 0 },
                { x: 2, y: 2 },
                { x: 0, y: 2 }
            ];
            const result = Collision.positionIsInsideBoundary(position, boundary);
            expect(result).toBe(false);
        });

        it("should return false when position is on a boundary node", () => {
            const position = { x: 2, y: 0 };
            const boundary = [
                { x: 0, y: 0 },
                { x: 2, y: 0 },
                { x: 2, y: 2 },
                { x: 0, y: 2 }
            ];
            const result = Collision.positionIsInsideBoundary(position, boundary);
            expect(result).toBe(false);
        });
    });

    describe("lineWithLawnPixel", () => {
        it("should return true when line intersects with lawn pixel", () => {
            const line: Line = [{ x: 0, y: 0},{x: 2, y: 2 }];
            const lawnPixel: LawnPixel = { x: 1, y: 1, wasCut: false };
            const result = Collision.lineWithLawnPixel(line, lawnPixel, 1);
            expect(result).toBe(true);
        });

        it("should return true when line intersects with lawn pixel - crossing top to bottom", () => {
            const line: Line = [{ x: 1, y: 0},{x: 1, y: 5 }];
            const lawnPixel: LawnPixel = { x: 0, y: 1, wasCut: false };
            const result = Collision.lineWithLawnPixel(line, lawnPixel, 2);
            expect(result).toBe(true);
        });

        it("should return true when line intersects with lawn pixel - crossing the border", () => {
            const line: Line = [{ x: 1, y: 0},{x: 1, y: 5 }];
            const lawnPixel: LawnPixel = { x: 0, y: 1, wasCut: false };
            const result = Collision.lineWithLawnPixel(line, lawnPixel, 1);
            expect(result).toBe(true);
        });

        it("should return false when line does not intersect with lawn pixel", () => {
            const line: Line = [{x: 0, y: 0}, {x: 2, y: 2 }];
            const lawnPixel: LawnPixel = { x: 3, y: 3, wasCut: false };
            const result = Collision.lineWithLawnPixel(line, lawnPixel, 1);
            expect(result).toBe(false);
        });

        it("should return false when line is completely inside lawn pixel - no collistion to border", () => {
            const line: Line = [{ x: 1, y: 1},{ x: 2, y: 2 }];
            const lawnPixel: LawnPixel = { x: 0, y: 0, wasCut: false };
            const result = Collision.lineWithLawnPixel(line, lawnPixel, 5);
            expect(result).toBe(false);
        });

        it("should return true when line is partially inside lawn pixel", () => {
            const line: Line = [{ x: 1, y: 1}, {x: 4, y: 4 }];
            const lawnPixel: LawnPixel = { x: 0, y: 0, wasCut: false };
            const result = Collision.lineWithLawnPixel(line, lawnPixel, 2);
            expect(result).toBe(true);
        });

        it("should return false when line is outside lawn pixel", () => {
            const line: Line = [{ x: 0, y: 0}, {x: 2, y: 2 }];
            const lawnPixel: LawnPixel = { x: 3, y: 3, wasCut: false };
            const result = Collision.lineWithLawnPixel(line, lawnPixel, 15);
            expect(result).toBe(false);
        });
    });
});