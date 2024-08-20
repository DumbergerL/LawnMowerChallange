import { Position } from "../../2D/Position";
import  IGarden from "../GardenInterface";

export default class AngleCrookedGarden implements IGarden {
    
    getStartPosition(): Position {
        return {x: 0, y: 400};
    }
    
    getStartAngle(): number {
       return 15 * (Math.PI/180);
    }
        
    getOtherBoundaryNodes(): Position[] {
        return [
            //{x: 0, y: 400}, Start Boundary
            {x: 500, y: 20},
            {x: 600, y: 600},            
            {x: 20, y: 700},
        ]
    }

    getResolution(): number {
        return 40;
    }

    getMaxSteps(): number {
        return 5;
    }
}