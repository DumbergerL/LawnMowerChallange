import { Position, calculateAngle, calculateBoundaryLength } from "../2D/Position";
import IGarden from "../Garden/GardenInterface";
import { ILawnMower, ILawnMowerFactory } from "../LawnMower/LawnMowerInterface";


type SimulationStatus = {
    lawnMower: {
        position: Position,
        angle: number,
    },
    collsionPoint?: {
        position: Position,
        angle: number
    }
}

export default class Simulation {
    private DISTACNE = 10;

    private garden: IGarden;
    private boundaryNodes: Position[];
    private boundaryLength: number;
    private lawnMower: ILawnMower | undefined;

    private currentPosition: Position | undefined;
    private currentAngle: number | undefined;

    constructor(garden: IGarden, lawnMowerFactory: ILawnMowerFactory) {
        this.garden = garden;
        this.boundaryNodes = garden.getBoundaryNodes();
        this.boundaryLength = calculateBoundaryLength(this.boundaryNodes);
        this.lawnMower = lawnMowerFactory.createForGarden(this.boundaryLength);
    }

    public initalize(): SimulationStatus {
        if (this.boundaryNodes.length < 3) {
            throw new Error('At least 3 nodes are required to form a polygon');
        }

        const firstNode = this.boundaryNodes[0];
        const secondNode = this.boundaryNodes[1];
        const thirdNode = this.boundaryNodes[2];

        const firstAngle = calculateAngle(secondNode, firstNode);
        const secondAngle = calculateAngle(secondNode, thirdNode);

        const lawnMowerAngle = (firstAngle + secondAngle) / 2;

        this.currentPosition = secondNode;
        this.currentAngle = lawnMowerAngle;

        return this.getSimulationStatus();
    }

    public getSimulationStatus(): SimulationStatus {
        if (this.currentAngle === undefined || this.currentPosition === undefined) {
            throw new Error('Simulation not initialized');
        }

        return {
            lawnMower: {
                position: this.currentPosition,
                angle: this.currentAngle
            }
        }
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

        const newPoint = { x: 0, y: 0 };

        newPoint.x = Math.round(Math.cos(this.currentAngle) * this.DISTACNE + this.currentPosition.x);
        newPoint.y = Math.round(Math.sin(this.currentAngle) * this.DISTACNE + this.currentPosition.y);

        this.currentPosition = newPoint;

        return this.getSimulationStatus();
    }
}