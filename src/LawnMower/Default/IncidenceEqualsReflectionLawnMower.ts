import { ILawnMower, ILawnMowerFactory } from "../LawnMowerInterface";

/**
 * The "incidence equals reflection"-lawn mower will mow the lawn in a way that the angle of incidence is equal to the angle of reflection.
 */
export default class IncidenceEqualsReflectionLawnMower implements ILawnMower {
    handleBoundaryCollision(lengthBoundaryWireLeft: number, collissionAngle: number): number {
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