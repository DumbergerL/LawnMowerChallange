import { Position } from "../../2D/Position";
import  IGarden from "../GardenInterface";

export default class DefaultGarden implements IGarden {
        
    getBoundaryNodes(): Position[] {
        return [
            {x: 0, y: 0},
            {x: 200, y: 0},
            {x: 200, y: 300},
            {x: 0, y: 300},            
        ]
    }

}