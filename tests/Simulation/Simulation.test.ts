import { beforeEach, describe, expect, it } from "@jest/globals";
import { Position } from "../../src/2D/Position";
import IGarden from "../../src/Garden/GardenInterface";
import { ILawnMower, ILawnMowerFactory } from "../../src/LawnMower/LawnMowerInterface";
import Simulation from "../../src/Simulation/Simulation";
import { LawnPixel } from "../../src/Simulation/Lawn";

class NinentyDegreeLawnMower implements ILawnMower {
    handleBoundaryCollision(lengthBoundaryWireLeft: number, collissionAngle: number): number {
        return Math.PI / 2;
    }
}

class NinentyDegreeLawnMowerFactory implements ILawnMowerFactory {
    createForGarden(): ILawnMower {
        return new NinentyDegreeLawnMower();
    }
}

class TestGarden implements IGarden {
    getStartPosition(): Position {
        return { x: 0, y: 4.5 };
    }
    getStartAngle(): number {
        return 0; //straight left
    }
    getOtherBoundaryNodes(): Position[] {
        return [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
        ];
    }
    getResolution(): number {
        return 1; // pixel has size 1
    }
    getMaxSteps(): number {
        return 100;
    }
}

const simulation = new Simulation(new TestGarden(), new NinentyDegreeLawnMowerFactory()).withDistance(1).withMaxBounceAttempts(Number.POSITIVE_INFINITY);

describe('Simulation IntegrationTest', () => {
    beforeEach(() => {
        simulation.initalize();
    });

    it('mows the lawn', () => {
        // Make Step
        let status = simulation.step();

        expect(simulation.getCurrentPoint()).toEqual({ x: 1, y: 4.5 });
        let mowedPixels = status.lawn.filter((pixel: LawnPixel) => pixel.wasCut);
        expect(mowedPixels).toEqual([
            { x: 0, y: 4, wasCut: true },
            { x: 1, y: 4, wasCut: true }
        ]);
    
        // Make another Step
        status = simulation.step();

        expect(simulation.getCurrentPoint()).toEqual({ x: 2, y: 4.5 });
        mowedPixels = status.lawn.filter((pixel: LawnPixel) => pixel.wasCut);
        expect(mowedPixels).toEqual([
            { x: 0, y: 4, wasCut: true },
            { x: 1, y: 4, wasCut: true },
            { x: 2, y: 4, wasCut: true },
        ]);
    });

    it('reach max steps in garden', () => {
        for (let i = 0; i < 98; i++) {
            simulation.step();
        }

        // 99th step
        let status = simulation.step();
        expect(status.status).toBe('IN_PROGRESS');

        // 100th step
        status = simulation.step();
        expect(status.status).toBe('FINISHED');
    });

});