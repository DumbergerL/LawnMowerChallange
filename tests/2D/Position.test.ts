import { describe, expect, it, test } from '@jest/globals';
import { Line } from "../../src/2D/Line";
import { Position } from '../../src/2D/Position';
import { Angle } from '../../src/2D/Angle';
import { Collision } from '../../src/2D/Collision';


describe('Position', () => {
    
    describe('calculateFromAngleAndDistance', () => {
        it('should calculate the new position based on the given angle and distance', () => {
            const position = { x: 0, y: 0 };
            const angle = 45 * (Math.PI / 180);
            const distance = 10;
            const expectedPosition = { x: 7.07, y: 7.07 };

            const result = Position.calculateFromAngleAndDistance(position, angle, distance);

            expect(result.x).toBeCloseTo(expectedPosition.x, 0.01);
            expect(result.y).toBeCloseTo(expectedPosition.y, 0.01);
        });

        it('should calculate the new position when angle is 0', () => {
            const position = { x: 0, y: 0 };
            const angle = 0;
            const distance = 5;
            const expectedPosition = { x: 5, y: 0 };

            const result = Position.calculateFromAngleAndDistance(position, angle, distance);

            expect(result).toEqual(expectedPosition);
        });

        it('should calculate the new position when distance is 0', () => {
            const position = { x: 2, y: 3 };
            const angle = 90 * (Math.PI / 180);
            const distance = 0;
            const expectedPosition = { x: 2, y: 3 };

            const result = Position.calculateFromAngleAndDistance(position, angle, distance);

            expect(result).toEqual(expectedPosition);
        });
    });

    
    describe('convertArrayToLineArray', () => {
        it('should convert an array of positions to an array of lines', () => {
            const positions = [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 }];
            const expectedLines = [
                [{ x: 1, y: 2 }, { x: 3, y: 4 }],
                [{ x: 3, y: 4 }, { x: 5, y: 6 }],
                [{ x: 5, y: 6 }, { x: 1, y: 2 }],
            ];

            const result = Line.convertPositionArrayToLines(positions);

            expect(result).toEqual(expectedLines);
        });
    });

    describe('calculateBoundaryLength', () => {
        it('should calculate the total length of the boundary given an array of positions', () => {
            const positions = [{ x: 1, y: 1 }, { x: 6, y: 1 }, { x: 6, y: 6 }, { x: 6, y: 1 }];
            const expectedLength = 20;

            const result = Position.calculateBoundaryLength(positions);

            expect(result).toBeCloseTo(expectedLength);
        });
    });

    describe('calculateAngle', () => {
        it('should calculate 0 degree', () => {
            const result = Angle.betweenToPoints({ x: 1, y: 1 }, { x: 5, y: 1 });
            expect(result).toBe(0);
        });
        it('should calculate 90 degree', () => {
            const result = Angle.betweenToPoints({ x: 1, y: 1 }, { x: 1, y: 5 });
            expect(result).toBe(90 * (Math.PI / 180));
        });
        it('should calculate 45 degree', () => {
            const result = Angle.betweenToPoints({ x: 1, y: 1 }, { x: 5, y: 5 });
            expect(result).toBe(45 * (Math.PI / 180));
        });
        it('should calculate 26.5 degree', () => {
            const result = Angle.betweenToPoints({ x: 1, y: 1 }, { x: 11, y: 6 });
            expect(result).toBeCloseTo(26.56 * (Math.PI / 180), 0.01);
        });
    });

    describe('twoLinesIntesect', () => {
        it('should return true if two lines intersect', () => {
            const lineA = [{ x: 1, y: 1 }, { x: 3, y: 3 }];
            const lineB = [{ x: 2, y: 1 }, { x: 1, y: 2 }];

            const result = Collision.twoLines([lineA[0], lineA[1]], [lineB[0], lineB[1]]);

            expect(result).toEqual({ "x": 1.5, "y": 1.5 });
        });

        it('should return false if two lines do not intersect', () => {
            const lineA = [{ x: 1, y: 1 }, { x: 3, y: 3 }];
            const lineB = [{ x: 4, y: 4 }, { x: 5, y: 5 }];

            const result = Collision.twoLines([lineA[0], lineA[1]], [lineB[0], lineB[1]]);

            expect(result).toBe(false);
        });
    });

    describe('calculateDistance', () => {
        it('should calculate the distance between two positions', () => {
            const posA = { x: 1, y: 1 };
            const posB = { x: 4, y: 5 };
            const expectedDistance = 5;

            const result = Position.calculateDistance(posA, posB);

            expect(result).toBe(expectedDistance);
        });

        it('should calculate the distance when positions have decimal coordinates', () => {
            const posA = { x: 1.5, y: 2.5 };
            const posB = { x: 4.5, y: 6.5 };
            const expectedDistance = 5;

            const result = Position.calculateDistance(posA, posB);

            expect(result).toBe(expectedDistance);
        });

        it('should calculate the distance when positions are the same', () => {
            const posA = { x: 3, y: 4 };
            const posB = { x: 3, y: 4 };
            const expectedDistance = 0;

            const result = Position.calculateDistance(posA, posB);

            expect(result).toBe(expectedDistance);
        });
    });
});