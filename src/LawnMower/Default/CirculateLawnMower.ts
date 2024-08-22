import { ILawnMower, ILawnMowerFactory } from "../LawnMowerInterface";

export default class CirculateLawnMower implements ILawnMower {
    
    private inPhaseA = true;
    
    handleBoundaryCollision(lengthBoundaryWireLeft: number, collissionAngle: number): number {
        this.inPhaseA = !this.inPhaseA;
        if(this.inPhaseA){
            return 5 * (Math.PI/180);
        }else{
            return 175 * (Math.PI/180);
        }
    }
}

class CirculateLawnMowerFactory implements ILawnMowerFactory {

    createForGarden(lengthBoundaryWire: number): ILawnMower {
        return new CirculateLawnMower();
    }
}

const factory = new CirculateLawnMowerFactory();
export { factory };