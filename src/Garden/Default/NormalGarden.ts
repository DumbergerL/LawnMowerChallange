import { Position } from "../../2D/Position";
import { Garden } from "../Garden";
import  IGarden from "../GardenInterface";

export default class NormalGarden implements IGarden {
    
    getStartPosition(): Position {
        return {x: 0, y: 140};
    }
    
    getStartAngle(): number {
       return 20 * (Math.PI/180);
    }
        
    getOtherBoundaryNodes(): Position[] {
        return [
            //{x: 0, y: 140}, Start Boundary
            {x: 0, y: 0},
            {x: 160, y: 0},
            {x: 160, y: 180},
            {x: 240, y: 220},
            {x: 360, y: 200},
            {x: 370, y: 40},
            {x: 440, y: 0},
            {x: 560, y: 0},
            {x: 560, y: 300},
            {x: 480, y: 400},
            {x: 280, y: 400},
            {x: 40, y: 320},            
        ]
    }

    getResolution(): number {
        return 20;
    }

    getMaxSteps(): number {
        return Garden.defaultMaxSteps;
    }
}