import { describe, expect, it } from "@jest/globals";
import { Angle } from "../../src/2D/Angle";
import { Line } from "../../src/2D/Line";

describe("Angle", () => {
    describe("betweenToPoints", () => {
        it("45 degree", () => {
            const result = Angle.betweenToPoints({x: 1, y: 1}, {x: 2, y: 2});
            expect(result).toBe(45 * (Math.PI/180));
        });

        it("45 degree reverse order => will be 225 (other direction)", () => {
            const result = Angle.betweenToPoints({x: 2, y: 2}, {x: 1, y: 1});
            expect(result).toBeCloseTo(225 * (Math.PI/180), 0.01);
        });

        it("315 degree", () => {
            const result = Angle.betweenToPoints({x: 1, y: 2}, {x: 2, y: 1});
            expect(result).toBeCloseTo(315 * (Math.PI/180), 0.01);
        });

        it("135 degree reverse direction is => 135", () => {
            const result = Angle.betweenToPoints({x: 2, y: 1}, {x: 1, y: 2});
            expect(result).toBe(135 * (Math.PI/180));
        });

        it("0 degree", () => {
            const result = Angle.betweenToPoints({x: 1, y: 1}, {x: 5, y: 1});
            expect(result).toBe(0 * (Math.PI/180));
        });

        it("0 degree reverse order", () => {
            const result = Angle.betweenToPoints({x: 5, y: 1}, {x: 1, y: 1});
            expect(result).toBe(180 * (Math.PI/180));
        });
    });

    describe("betweenTwoLines", () => {
        it("should calculate the angle between two lines", () => {
            const lineA: Line = [{ x: 0, y: 0 }, { x: 2, y: 2 }];
            const lineB: Line = [{ x: 1, y: 0 }, { x: 1, y: 2 }];
            const result = Angle.betweenTwoLines(lineA, lineB);

            expect(result).toBe(45 * (Math.PI/180));
        });

        it("should calculate the angle between two lines", () => {
            const lineA: Line = [{ x: 0, y: 0 }, { x: 2, y: 2 }];
            const lineB: Line = [{ x: 1, y: 0 }, { x: 1, y: 2 }];
            const result = Angle.betweenTwoLines(lineB, lineA);

            expect(result).toBe(135 * (Math.PI/180));
        });

        it("should be zero if same line", () => {
            const lineA: Line = [{ x: 0, y: 0 }, { x: 2, y: 2 }];
            const result = Angle.betweenTwoLines(lineA, lineA);

            expect(result).toBe(0);
        });
        it("should be zero if minus vector", () => {
            const lineA: Line = [{ x: 0, y: 0 }, { x: 2, y: 2 }];
            const lineB: Line = [{ x: 2, y: 2 }, { x: 0, y: 0 }];
            
            const result = Angle.betweenTwoLines(lineA, lineB);

            expect(result).toBe(0);
        });

        it("should positive", () => {
            const lineA: Line = [{ x: 0, y: 0 }, { x: 1, y: 2 }];
            const lineB: Line = [{ x: 0, y: 1 }, { x: 2, y: 2 }];
            
            const result = Angle.betweenTwoLines(lineA, lineB);

            expect(result).toBeCloseTo(143 * (Math.PI/180), 0.1);
        });
    });

    describe("toAbsoluteAngle", () => {
        it("should calc with small angles", () => {
            const borderAngle = 45 * (Math.PI/180);
            const relativeAngle = 45 * (Math.PI/180);

            const result = Angle.toAbsoluteAngle(borderAngle, relativeAngle);

            expect(result).toBe( 90 * (Math.PI/180));
        });

        it("should with big angles", () => {
            const borderAngle = 135 * (Math.PI/180);
            const relativeAngle = 135 * (Math.PI/180);

            const result = Angle.toAbsoluteAngle(borderAngle, relativeAngle);

            expect(result).toBe( 270 * (Math.PI/180));
        });

        it("should with zero border angle", () => {
            const borderAngle = 0;
            const relativeAngle = 122 * (Math.PI/180);

            const result = Angle.toAbsoluteAngle(borderAngle, relativeAngle);

            expect(result).toBe( 122 * (Math.PI/180));
        });

        it("should with zero relative angle", () => {
            const borderAngle = 96 * (Math.PI/180);
            const relativeAngle = 0;

            const result = Angle.toAbsoluteAngle(borderAngle, relativeAngle);

            expect(result).toBe( 96 * (Math.PI/180));
        });
    });
});