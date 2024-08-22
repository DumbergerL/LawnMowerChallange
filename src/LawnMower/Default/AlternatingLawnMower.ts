import { ILawnMower, ILawnMowerFactory } from "../LawnMowerInterface";

/**
 * This lawn mower will mow the lawn in alternating phases. The Collision angle will alternate in every collision between 30° and 60° degree.
 */
export default class AlternatingLawnMower implements ILawnMower {
    
    private inPhaseA = true;
    
    handleBoundaryCollision(lengthBoundaryWireLeft: number, collissionAngle: number): number {
        this.inPhaseA = !this.inPhaseA;
        if(this.inPhaseA){
            return 30 * (Math.PI/180);
        }else{
            return 60 * (Math.PI/180);
        }       
    }
}

class AlternatingLawnMowerFactory implements ILawnMowerFactory {

    createForGarden(lengthBoundaryWire: number): ILawnMower {
        return new AlternatingLawnMower();
    }
}

const factory = new AlternatingLawnMowerFactory();
export { factory };