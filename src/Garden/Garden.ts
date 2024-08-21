import { Line } from "../2D/Line";
import { Position } from "../2D/Position";
import AngleCrookedGarden from "./Default/AngleCrookedGarden";
import DefaultGarden from "./Default/DefaultGarden";
import LongGarden from "./Default/LongGarden";
import NormalGarden from "./Default/NormalGarden";
import UShapeGarden from "./Default/UShapeGarden";
import IGarden from "./GardenInterface";

type GardenRegistry = {
    id: number,
    garden: IGarden
}

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
    getAllGardens: (): GardenRegistry[] => {
        return [
            { id: 1, garden: new DefaultGarden() },
            { id: 2, garden: new AngleCrookedGarden() },
            { id: 3, garden: new LongGarden() },
            { id: 4, garden: new UShapeGarden() },
            { id: 5, garden: new NormalGarden() }
        ];
    },

    defaultMaxSteps: 10000000,
}