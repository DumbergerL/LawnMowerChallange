import { ILawnMower, ILawnMowerFactory } from "../LawnMowerInterface";

/**
 * The dumb lawn mower always returns a collision in an angle of 33°.
 */
export default class DumbLawnMower implements ILawnMower {
    handleBoundaryCollision(lengthBoundaryWireLeft: number, collissionAngle: number): number {
        return 33 * (Math.PI/180);
    }
}

class DumbLawnMowerFactory implements ILawnMowerFactory {

    createForGarden(lengthBoundaryWire: number): ILawnMower {
        return new DumbLawnMower();
    }
}

const factory = new DumbLawnMowerFactory();
export { factory };