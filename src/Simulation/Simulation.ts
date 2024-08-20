import { Position } from "../2D/Position";
import { Line } from "../2D/Line";
import IGarden from "../Garden/GardenInterface";
import { ILawnMower, ILawnMowerFactory } from "../LawnMower/LawnMowerInterface";
import { Angle } from "../2D/Angle";
import { Collision } from "../2D/Collision";
import { Garden } from "../Garden/Garden";


type SimulationStatus = {
    lawnMower: {
        position: Position,
        angle: number,
    },
    collsionPoint?: CollisionData
}

type CollisionData = {
    position: Position,
    angleToBorder: number,
    borderAngle: number,
    lengthToIntersection: number
}

export default class Simulation {
    private DISTACNE = 20;

    private garden: IGarden;
    private boundaryNodes: Position[];
    private boundaryLines: Line[];
    private boundaryLength: number;
    private lawnMower: ILawnMower;

    private currentPosition: Position | undefined;
    private currentAngle: number | undefined;

    private isFreshInitialized: boolean = false;

    constructor(garden: IGarden, lawnMowerFactory: ILawnMowerFactory) {
        this.garden = garden;
        this.boundaryNodes = Garden.getAllBoundaryNodes(garden);
        this.boundaryLines = Garden.getBoundaryLine(garden);
        this.boundaryLength = Position.calculateBoundaryLength(this.boundaryNodes);
        this.lawnMower = lawnMowerFactory.createForGarden(this.boundaryLength);
    }

    public initalize(): SimulationStatus {
        if (this.boundaryNodes.length < 3) {
            throw new Error('At least 3 nodes are required to form a polygon');
        }

        this.currentPosition = this.garden.getStartPosition();
        this.currentAngle = this.garden.getStartAngle();
        this.isFreshInitialized = true;

        return this.getSimulationStatus();
    }

    public getSimulationStatus(collision?: CollisionData): SimulationStatus {
        if (this.currentAngle === undefined || this.currentPosition === undefined) {
            throw new Error('Simulation not initialized');
        }

        const data: SimulationStatus = {
            lawnMower: {
                position: this.currentPosition,
                angle: this.currentAngle
            }
        };

        if (collision !== undefined) {
            data.collsionPoint = collision;
        }
        return data;
    };

    public getCurrentPoint(): Position {
        if (this.currentPosition === undefined) {
            throw new Error('Simulation not initialized');
        }

        return this.currentPosition;
    }

    public getCurrentAngle(): number {
        if (this.currentAngle === undefined) {
            throw new Error('Simulation not initialized');
        }

        return this.currentAngle;
    }

    public getBoundaryLength(): number {
        return this.boundaryLength;
    }

    public getBoundaryNodes() {
        return this.boundaryNodes;
    }

    public step(): SimulationStatus {
        if (this.currentAngle === undefined || this.currentPosition === undefined) {
            throw new Error('Simulation not initialized');
        }

        const newPoint = Position.calculateFromAngleAndDistance(this.currentPosition, this.currentAngle, this.DISTACNE);

        const collisionData = this.checkCollision(this.currentPosition, newPoint);

        if (collisionData == false || this.isFreshInitialized) {
            this.isFreshInitialized = false;
            this.currentPosition = newPoint;
            return this.getSimulationStatus();
        } else {
            const newPointAfterCollision = this.calculatePositionAfterCollision(collisionData);
            this.currentPosition = newPointAfterCollision
            return this.getSimulationStatus(collisionData);
        }
    }

    private checkCollision(oldPosition: Position, newPosition: Position): CollisionData | false {

        for (let i = 0; i < this.boundaryLines.length; i++) {
            const boundary = this.boundaryLines[i];
            const collisionPosition = Collision.twoLines(boundary, [oldPosition, newPosition]);
            if (collisionPosition) {
                return {
                    position: collisionPosition,
                    angleToBorder: Angle.betweenTwoLines(boundary, [oldPosition, newPosition]),
                    borderAngle: Angle.betweenToPoints(boundary[0], boundary[1]),
                    lengthToIntersection: Position.calculateDistance(oldPosition, collisionPosition)
                };
            }
        }
        return false;
    }

    private calculatePositionAfterCollision(collisionData: CollisionData): Position {
        // TODO: Calculate distance from position to left starting point!
        const angle = this.lawnMower.handleBoundaryCollission(0, collisionData.angleToBorder);
        if(angle < 0 || angle > Math.PI) {
            throw new Error("New LawnMower Angle is not in the range of 0 to 180 degrees: " + angle);
        }
        const absoluteAngle = Angle.toAbsoluteAngle(collisionData.borderAngle, angle);

        this.currentAngle = absoluteAngle;
        const lengthAfterCollision = this.DISTACNE - collisionData.lengthToIntersection;

        console.log("Angle | BorderAngle | AbsoluteBorder", angle * (180/Math.PI) , collisionData.borderAngle  * (180/Math.PI) , absoluteAngle  * (180/Math.PI) );

        // TODO: Check if new calculated positoin is inside the boundary
        return Position.calculateFromAngleAndDistance(collisionData.position, absoluteAngle, lengthAfterCollision);
    }
}