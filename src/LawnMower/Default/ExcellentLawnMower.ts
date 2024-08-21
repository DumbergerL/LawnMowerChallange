import { ILawnMower, ILawnMowerFactory } from "../LawnMowerInterface";

export default class ExcellentLawnMower implements ILawnMower {
    
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

    handleBoundaryCollission(lengthBoundaryWireLeft: number, collissionAngle: number): number {
        const angle = this.angles[this.stepCount % this.angles.length];
        this.stepCount++;
        return angle;
    }
}

class ExcellentLawnMowerFactory implements ILawnMowerFactory {

    createForGarden(lengthBoundaryWire: number): ILawnMower {
        return new ExcellentLawnMower();
    }
}

const factory = new ExcellentLawnMowerFactory();
export { factory };