import { Line } from "./Line";
import { Position } from "./Position";

export const Angle = {

    /**
     * The angle between two points. The order of the points does matter an give the direction of the vector. Angle can only be between 0 and <360 degrees. 360 degrees is always 0 degrees.
     * @param nodeA Position A
     * @param nodeB Position B
     * @returns 
     */

    betweenToPoints: (nodeA: Position, nodeB: Position): number => {
        let angle = Math.atan2(nodeB.y - nodeA.y, nodeB.x - nodeA.x);

        if(angle < 0){
            // Convert negative angle to positive angle
            angle = Math.PI * 2 + angle;
        }
        
        // reduce all angles to 0 to 360 degrees
        while(angle >= Math.PI * 2){
            angle = angle - Math.PI * 2;
        }
        return angle;
    
    },

    /**
     * Calculates the angle from line A to line B. The direction of the line is irrelevant. The angle is always between 0 and 180 degrees. 180 degrees is always 0 degrees.
     * @param lineA 
     * @param lineB 
     * @returns 
     */
    betweenTwoLines: (lineA: Line, lineB: Line): number => {
        const angleA = Angle.betweenToPoints(lineA[0], lineA[1]);
        const angleB = Angle.betweenToPoints(lineB[0], lineB[1]);

        let angle = angleB - angleA;

        if(angle < 0){
            //convert negative angle to positive angle
            angle = Math.PI * 2 + angle;
        }

        // reduce all angles to 0 to 180 degrees
        while(angle >= Math.PI){
            angle = angle - Math.PI;
        }

        if(angle < 0 || angle > Math.PI) {
            throw new Error('Angle is not in the range of 0 to 180 degrees: ' + angle);
        }

        return angle;
    },

    /**
     * Convert a relative angle to an absolute angle. The anlge is always between 0 and 180 degrees. 180 degrees is always 0 degrees.
     * @param absoluteAngleLine absolute angle of line (between 0 and 360 degrees)
     * @param relativeAnlgeToLine relative angle to line (between 0 and 180 degrees)
     * @returns absolute angle of line (between 0 and 360 degrees).
     */
    toAbsoluteAngle: (absoluteAngleLine: number, relativeAnlgeToLine: number): number => {
        if(absoluteAngleLine === 0){
            return relativeAnlgeToLine;
        }
        if(absoluteAngleLine === Math.PI){
            return Math.PI + relativeAnlgeToLine;
        }

        let absoluteAngle = absoluteAngleLine + relativeAnlgeToLine;

        if((relativeAnlgeToLine -absoluteAngleLine) >= Math.PI / 2){
            // if difference is greater than 90 degrees, then reverse direction
            absoluteAngle = absoluteAngle - Math.PI;
        }

        if(absoluteAngle < 0){
            // make absolute angle positive
            absoluteAngle = Math.PI * 2 + absoluteAngle;
        }

        // reduce all angles to 0 to 360 degrees
        while(absoluteAngle >= Math.PI * 2){
            absoluteAngle = absoluteAngle - Math.PI * 2;
        }

        return absoluteAngle;
    }
}