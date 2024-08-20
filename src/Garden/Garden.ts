import { Line } from "../2D/Line";
import { Position } from "../2D/Position";
import AngleCrookedGarden from "./Default/AngleCrookedGarden";
import DefaultGarden from "./Default/DefaultGarden";
import LongGarden from "./Default/LongGarden";
import UShapeGarden from "./Default/UShapeGarden";
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

    /**
     * List of all garden implementations
     */
    getAllGardens: (): IGarden[] => {
        return [
          new DefaultGarden(),
          new AngleCrookedGarden(),
          new LongGarden(), 
          new UShapeGarden() 
        ];
    },

    defaultMaxSteps: 100000,
}