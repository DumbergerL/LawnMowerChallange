import { ILawnMower, ILawnMowerFactory } from "../LawnMowerInterface";

export default class IncidenceEqualsReflectionLawnMower implements ILawnMower {
    handleBoundaryCollission(lengthBoundaryWireLeft: number, collissionAngle: number): number {
        return Math.PI- collissionAngle;
    }
}

class IncidenceEqualsReflectionLawnMowerFactory implements ILawnMowerFactory {

    createForGarden(lengthBoundaryWire: number): ILawnMower {
        return new IncidenceEqualsReflectionLawnMower();
    }
}

const factory = new IncidenceEqualsReflectionLawnMowerFactory();
export { factory };