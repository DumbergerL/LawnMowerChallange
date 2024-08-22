import { ILawnMower, ILawnMowerFactory } from "../LawnMowerInterface";

export default class RandomLawnMower implements ILawnMower {
    handleBoundaryCollision(lengthBoundaryWireLeft: number, collissionAngle: number): number {
        const randomAngle = Math.floor(Math.random() * 179) + 1;
        return randomAngle * (Math.PI/180);
    }
}

class RandomLawnMowerFactory implements ILawnMowerFactory {

    createForGarden(lengthBoundaryWire: number): ILawnMower {
        return new RandomLawnMower();
    }
}

const factory = new RandomLawnMowerFactory();
export { factory };