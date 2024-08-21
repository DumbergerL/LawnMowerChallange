import { Position } from "../../2D/Position";
import { Garden } from "../Garden";
import  IGarden from "../GardenInterface";

export default class AngleCrookedGarden implements IGarden {
    
    getStartPosition(): Position {
        return {x: 20, y: 700};
    }
    
    getStartAngle(): number {
       return 307 * (Math.PI/180);
    }
        
    getOtherBoundaryNodes(): Position[] {
        return [
            //{x: 20, y: 700},
            {x: 0, y: 400}, 
            {x: 500, y: 20},
            {x: 600, y: 600},                   
        ]
    }

    getResolution(): number {
        return 40;
    }

    getMaxSteps(): number {
        return Garden.defaultMaxSteps;
    }
}