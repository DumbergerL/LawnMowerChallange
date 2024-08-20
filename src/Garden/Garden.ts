import { Line } from "../2D/Line";
import { Position } from "../2D/Position";
import IGarden from "./GardenInterface";

export const Garden = {
    /**
     * Create a list with all boundary nodes of the garden including the start node.
     * @param garden 
     * @returns 
     */
    getAllBoundaryNodes: (garden: IGarden): Position[] => {
        return [garden.getStartPosition(), ...garden.getOtherBoundaryNodes()];
    },
    
    /**
     * Create a boundary line for the garden including the start node.
     * @param garden 
     * @returns 
     */
    getBoundaryLine: (garden: IGarden): Line[] => {
        return Line.convertPositionArrayToLines(Garden.getAllBoundaryNodes(garden));
    },
}