export interface ILawnMowerFactory {

    createForGarden(lengthBoundaryWire: number): ILawnMower;

}

/**
 * LawnMower instance interface
 */
export interface ILawnMower {
    
    /**
     * Returns the angle (in rad), the lawn mower turns after the collission with the boundary wire
     * 
     * @param lengthBoundaryWireLeft (Currently default 0) Length of the boundary wire from collission point to left starting point
     * @param collissionAngle Angle (in rad) of collission with boundary wire
     */
    handleBoundaryCollission(lengthBoundaryWireLeft: number, collissionAngle: number): number
}