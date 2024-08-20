import { Position } from "../2D/Position";


export default interface IGarden {

    /**
     * Returns the start position of the boundary wire for the garden.
     */
    getStartPosition(): Position
    
    /**
     * Returns the start angle of the boundary wire for the garden. The angle must be in radian and between 0 and <180 degrees. 180 degrees is always 0 degrees.
     */
    getStartAngle(): number

    /**
     * Returns the other nodes of the boundary wire for the garden. The start position node is not included.
     */
    getOtherBoundaryNodes(): Position[]
}