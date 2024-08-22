import { ILawnMower, ILawnMowerFactory } from "../LawnMowerInterface";

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