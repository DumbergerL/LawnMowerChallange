import { ILawnMower, ILawnMowerFactory } from "../LawnMowerInterface";

export default class DumbLawnMower implements ILawnMower {
    handleBoundaryCollission(lengthBoundaryWireLeft: number, collissionAngle: number): number {
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