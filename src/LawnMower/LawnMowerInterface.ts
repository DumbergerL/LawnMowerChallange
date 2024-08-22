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
     * @param travelledDistanceSinceLastCollision Length the lawn mower has travelled since the last collision
     * @param colissionAngle Angle (in rad) of collision with boundary wire
     */
    handleBoundaryCollision(travelledDistanceSinceLastCollision: number, colissionAngle: number): number
}