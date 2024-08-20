import { Position } from "../../2D/Position";
import  IGarden from "../GardenInterface";

export default class DefaultGarden implements IGarden {
    
    getStartPosition(): Position {
        return {x: 200, y: 0};
    }
    
    getStartAngle(): number {
       return 135 * (Math.PI/180);
    }
        
    getOtherBoundaryNodes(): Position[] {
        return [
            //{x: 200, y: 0}, Start Boundary
            {x: 200, y: 300},
            {x: 0, y: 300},            
            {x: 0, y: 0},
        ]
    }

    getResolution(): number {
        return 30;
    }

    getMaxSteps(): number {
        return 500;
    }
}