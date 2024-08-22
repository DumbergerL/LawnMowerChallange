import { ILawnMower, ILawnMowerFactory } from "../LawnMowerInterface";

/**
 * The recursive lawn mower will mow the lawn in a recursive pattern. The Collision angle will alternate in every collision between 84°, 95°, 147°, 13°, 45°, 123°, 107°, 40°.
 */
export default class RecursiveLawnMower implements ILawnMower {
    
    private stepCount = 0;
    
    private angles: number[] = [
        84 * (Math.PI/180),
        95 * (Math.PI/180),
        147 * (Math.PI/180),
        13 * (Math.PI/180),
        45 * (Math.PI/180),
        123 * (Math.PI/180),
        107 * (Math.PI/180),
        40 * (Math.PI/180),
    ]

    handleBoundaryCollision(lengthBoundaryWireLeft: number, collissionAngle: number): number {
        const angle = this.angles[this.stepCount % this.angles.length];
        this.stepCount++;
        return angle;
    }
}

class RecursiveLawnMowerFactory implements ILawnMowerFactory {

    createForGarden(lengthBoundaryWire: number): ILawnMower {
        return new RecursiveLawnMower();
    }
}

const factory = new RecursiveLawnMowerFactory();
export { factory };