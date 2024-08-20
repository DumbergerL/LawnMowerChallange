import { Position } from "../../2D/Position";
import { Garden } from "../Garden";
import  IGarden from "../GardenInterface";

export default class UShapeGarden implements IGarden {
    
    getStartPosition(): Position {
        return {x: 10, y: 10};
    }
    
    getStartAngle(): number {
       return 20 * (Math.PI/180);
    }
        
    getOtherBoundaryNodes(): Position[] {
        return [
            //{x: 10, y: 10}, Start Boundary
            {x: 110, y: 10},
            {x: 110, y: 110},
            {x: 210, y: 110},
            {x: 210, y: 10},
            {x: 310, y: 10},
            {x: 310, y: 210},
            {x: 10, y: 210},
        ]
    }

    getResolution(): number {
        return 15;
    }

    getMaxSteps(): number {
        return Garden.defaultMaxSteps;
    }
}