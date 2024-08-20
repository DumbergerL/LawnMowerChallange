import { Position } from "./Position";
import { Line } from "./Line";

export const Collision = {
    lineWithLine: (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): false | Position => {
        const uA: number = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        const uB: number = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
          const intersectionX: number = x1 + (uA * (x2 - x1));
          const intersectionY: number = y1 + (uA * (y2 - y1));
          
          return {x: intersectionX, y: intersectionY};
        }
        return false;
    },
    
    twoLinesFromPoints: (posA1: Position, posA2: Position , posB1: Position, posB2: Position): false | Position => {
        return Collision.lineWithLine(posA1.x, posA1.y, posA2.x, posA2.y, posB1.x, posB1.y, posB2.x, posB2.y);
    },
    
    twoLines: (lineA: Line , lineB: Line): false | Position => {
        return Collision.twoLinesFromPoints(lineA[0], lineA[1], lineB[0], lineB[1]);
    },
}