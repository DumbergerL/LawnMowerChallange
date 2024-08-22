import { beforeEach, describe, expect, it } from "@jest/globals";
import { Position } from "../../src/2D/Position";
import IGarden from "../../src/Garden/GardenInterface";
import { ILawnMower, ILawnMowerFactory } from "../../src/LawnMower/LawnMowerInterface";
import Simulation from "../../src/Simulation/Simulation";
import { fail } from "assert";

class BouncyLawnMower implements ILawnMower {

    bounces: number[] = [
        45 * (Math.PI/180),
        110 * (Math.PI/180),
        45 * (Math.PI/180),
        45 * (Math.PI/180),
        45 * (Math.PI/180),
    ]

    private bounceIndex = 0;

    handleBoundaryCollision(lengthBoundaryWireLeft: number, collissionAngle: number): number {
        const angle = this.bounces[this.bounceIndex % this.bounces.length];
        this.bounceIndex++;
        return angle;
    }
}

class BouncyLawnMowerFactory implements ILawnMowerFactory {
    createForGarden(): ILawnMower {
        return new BouncyLawnMower();
    }
}

class TestBounceGarden implements IGarden {
    getStartPosition(): Position {
        return { x: 0, y: 0 };
    }
    getStartAngle(): number {
        return 45 * (Math.PI/180);
    }
    getOtherBoundaryNodes(): Position[] {
        return [
            { x: 0, y: 0 },
            { x: 5, y: 0 },
            { x: 5, y: 6 },
            { x: 0, y: 6 },
        ];
    }
    getResolution(): number {
        return 1; // pixel has size 1
    }
    getMaxSteps(): number {
        return 100;
    }
}

const simulation = new Simulation(new TestBounceGarden(), new BouncyLawnMowerFactory()).withDistance(4).withMaxBounceAttempts(Number.POSITIVE_INFINITY);

describe('Simulation Bounce IntegrationTest', () => {
    beforeEach(() => {
        simulation.initalize();
    });

    it('bounce off the boundary', () => {
        // Step 1: No bounce
        let status = simulation.step();
        expect(status.collisions).toBeUndefined();        
        expect(status.lawnMower.position.x).toBeCloseTo(2.828);
        expect(status.lawnMower.position.y).toBeCloseTo(2.828);
        expect(status.percentageCut).toEqual(5 / 30);

        // Step 2: First Bounce (45°)
        status = simulation.step();
        expect(status.collisions?.length).toBe(1);        
        expect(status.lawnMower.position.x).toBeCloseTo(4.343);
        expect(status.lawnMower.position.y).toBeCloseTo(5.656);
        expect(status.percentageCut).toEqual(10 / 30);

        // Step 3: Second Bounce (160°) and Third Bounce (45°)
        status = simulation.step();
        expect(status.collisions?.length).toBe(2);  
        
        if(status.collisions){
            expect(status.collisions[0].position.x).toBeCloseTo(4);
            expect(status.collisions[0].position.y).toBeCloseTo(6);
    
            expect(status.collisions[1].position.x).toBeCloseTo(5);
            expect(status.collisions[1].position.y).toBeCloseTo(3.25);
        }else{
            fail("No collisions found");
        }
                
        expect(status.lawnMower.position.x).toBeCloseTo(4.239);
        expect(status.lawnMower.position.y).toBeCloseTo(4.013);
    });
});