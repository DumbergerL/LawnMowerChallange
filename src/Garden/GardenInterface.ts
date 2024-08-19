import { Position } from "../2D/Position";


export default interface IGarden {

    /**
     * Returns the nodes of the boundary wire for the garden (polygon shape)
     */
    getBoundaryNodes(): Position[]
}