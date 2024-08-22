import { Position } from "../2D/Position";
import { Line } from "../2D/Line";
import IGarden from "../Garden/GardenInterface";
import { ILawnMower, ILawnMowerFactory } from "../LawnMower/LawnMowerInterface";
import { Angle } from "../2D/Angle";
import { Collision } from "../2D/Collision";
import { Garden } from "../Garden/Garden";
import { Lawn, LawnPixel } from "./Lawn";



type SimulationStatusCategory = 'INITIALIZED' | 'IN_PROGRESS' | 'FINISHED' | 'ERROR';

type SimulationStatus = {
    status: SimulationStatusCategory,
    lawnMower: {
        position: Position,
        angle: number,
    },
    lawn: LawnPixel[],
    percentageCut: number,
    collisions?: CollisionData[]
}

type CollisionData = {
    position: Position,
    angleToBorder: number,
    borderAngle: number,
    lengthToIntersection: number
}

export default class Simulation {
   
    private DISTACNE = 20;
    private MAX_BOUNCE_ATTEMPTS = 15;

    private garden: IGarden;
    private boundaryNodes: Position[];
    private boundaryLines: Line[];
    private boundaryLength: number;
    private lawnMower: ILawnMower;

    private lawn: Lawn;

    private currentPosition: Position | undefined;
    private currentAngle: number | undefined;

    private isFreshInitialized: boolean = false;
    private isError: boolean = false;

    private stepCount = 0;

    constructor(garden: IGarden, lawnMowerFactory: ILawnMowerFactory) {
        this.garden = garden;
        this.boundaryNodes = Garden.getAllBoundaryNodes(garden);
        this.boundaryLines = Garden.getBoundaryLine(garden);
        this.boundaryLength = Position.calculateBoundaryLength(this.boundaryNodes);
        this.lawnMower = lawnMowerFactory.createForGarden(this.boundaryLength);

        this.lawn = new Lawn(this.boundaryNodes, this.garden.getResolution());

    }

    public withDistance(distance: number): Simulation {
        this.DISTACNE = distance;
        return this;
    }

    public withMaxBounceAttempts(maxBounceAttempts: number): Simulation {
        this.MAX_BOUNCE_ATTEMPTS = maxBounceAttempts;
        return this;
    }

    public initalize(): SimulationStatus {
        if (this.boundaryNodes.length < 3) {
            throw new Error('At least 3 nodes are required to form a polygon');
        }

        this.currentPosition = this.garden.getStartPosition();
        this.currentAngle = this.garden.getStartAngle();
        this.isFreshInitialized = true;
        this.isError = false;
        this.stepCount = 0;

        this.lawn.initialize();

        return this.getSimulationStatus();
    }

    public getSimulationStatus(collisions: CollisionData[] = []): SimulationStatus {
        if (this.currentAngle === undefined || this.currentPosition === undefined) {
            throw new Error('Simulation not initialized');
        }

        const data: SimulationStatus = {
            status: this.getSimulationStatusCategory(),
            lawn: this.lawn.getLawnPixels(),
            percentageCut: this.lawn.getPercentageCut(),
            lawnMower: {
                position: this.currentPosition,
                angle: this.currentAngle
            }
        };

        if (collisions.length > 0) {
            data.collisions = collisions;
        }
        return data;
    };

    public getSimulationStatusCategory(): SimulationStatusCategory {
        if(this.isError) {
            return 'ERROR';
        }

        if(this.isFreshInitialized){
            return 'INITIALIZED';
        }
        const percentageCut = this.lawn.getPercentageCut();

        if(percentageCut >= 1 || this.stepCount >= this.garden.getMaxSteps()) {
            return 'FINISHED';
        }

        return 'IN_PROGRESS';
    }

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

    public getLawnResolution(): number {
        return this.garden.getResolution();
    }

    public getStepCount(): any {
        return this.stepCount;
    }

    public step(): SimulationStatus {
        if(this.isError){
            return this.getSimulationStatus();
        }

        this.stepCount++;

        if(this.stepCount > this.garden.getMaxSteps()) {
            return this.getSimulationStatus();
        }

        if (this.currentAngle === undefined || this.currentPosition === undefined) {
            throw new Error('Simulation not initialized');
        }

        let pointFrom = this.currentPosition;
        let pointTo = Position.calculateFromAngleAndDistance(this.currentPosition, this.currentAngle, this.DISTACNE);
        
        let collisionDataOrFalse: CollisionData | false =  this.checkCollision(pointFrom, pointTo, this.isFreshInitialized ? this.currentPosition : undefined);
        let collisions: CollisionData[] = [];
        let attempts = 0;
        while(collisionDataOrFalse !== false) {
            collisions.push(collisionDataOrFalse);
            
            // Resolve Collision
            let bounceOffPoint = this.calculatePositionAfterCollision(collisionDataOrFalse);   
            
            this.lawn.cutGrass(pointFrom, collisionDataOrFalse.position);
            this.lawn.cutGrass(collisionDataOrFalse.position, bounceOffPoint);

            pointFrom = collisionDataOrFalse.position;
            pointTo = bounceOffPoint;

            collisionDataOrFalse = this.checkCollision(pointFrom, pointTo, collisionDataOrFalse.position);
            attempts++;
            if(attempts > this.MAX_BOUNCE_ATTEMPTS) {
                this.isError = true;
                break;
            }
        }

        this.lawn.cutGrass(pointFrom, pointTo);

        if(this.isFreshInitialized){
            this.isFreshInitialized = false;
        }

        this.currentPosition = pointTo;
        return this.getSimulationStatus(collisions);     
    }

    private checkCollision(oldPosition: Position, newPosition: Position, ignorePosition: Position|undefined = undefined): CollisionData | false {

        for (let i = 0; i < this.boundaryLines.length; i++) {
            const boundary = this.boundaryLines[i];
            const collisionPosition = Collision.twoLines(boundary, [oldPosition, newPosition], ignorePosition ? [ignorePosition] : []);
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

    /**
     * Calculate point where lawn mower lands when it bounce of the border. 
     * @param collisionData 
     * @returns 
     */
    private calculatePositionAfterCollision(collisionData: CollisionData): Position {
        // TODO: Calculate distance from position to left starting point!
        const angle = this.lawnMower.handleBoundaryCollision(0, collisionData.angleToBorder);
        if(angle < 0 || angle > Math.PI) {
            throw new Error("New LawnMower Angle is not in the range of 0 to 180 degrees: " + angle);
        }
        const absoluteAngle = Angle.toAbsoluteAngle(collisionData.borderAngle, angle);

        this.currentAngle = absoluteAngle;
        const lengthAfterCollision = this.DISTACNE - collisionData.lengthToIntersection;

        return Position.calculateFromAngleAndDistance(collisionData.position, absoluteAngle, lengthAfterCollision);
    }
}