import { Position } from "./Position";
import { Line } from "./Line";
import { LawnPixel } from "../Simulation/Lawn";

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

    positionIsInsideBoundary: (position: Position, boundary: Position[]): boolean => {
        // ray-casting algorithm based on
        // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
        
        var x = position.x, y = position.y;
        
        var inside = false;
        for (var i = 0, j = boundary.length - 1; i < boundary.length; j = i++) {
            var xi = boundary[i].x, yi = boundary[i].y;
            var xj = boundary[j].x, yj = boundary[j].y;
            
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
    },

    lineWithBox: (x1: number, y1: number, x2: number, y2: number, bx1: number, by1: number, bx2: number, by2: number): boolean => {
        let t = 0;
      
          //  If the start or end of the line is inside the rect then we assume
          //  collision, as rects are solid for our use-case.
      
        if ((x1 >= bx1 && x1 <= bx2 && y1 >= by1 && y1 <= by2) ||
            (x2 >= bx1 && x2 <= bx2 && y2 >= by1 && y2 <= by2)) {
          return true;
        }
      
        if (x1 < bx1 && x2 >= bx1) { //  Left edge
          t = y1 + (y2 - y1) * (bx1 - x1) / (x2 - x1);
          if (t > by1 && t <= by2) {
            return true;
          }
        }
        else if (x1 > bx2 && x2 <= bx2) { //  Right edge
          t = y1 + (y2 - y1) * (bx2 - x1) / (x2 - x1);
          if (t >= by1 && t <= by2) {
            return true;
          }
        }
        if (y1 < by1 && y2 >= by1) { //  Top edge
          t = x1 + (x2 - x1) * (by1 - y1) / (y2 - y1);
          if (t >= bx1 && t <= bx2) {
            return true;
          }
        } else if (y1 > by2 && y2 <= by2) {  //  Bottom edge
          t = x1 + (x2 - x1) * (by2 - y1) / (y2 - y1);
          if (t >= bx1 && t <= bx2) {
            return true;
          }
        }
        return false;
    },

    lineWithLawnPixel: (line: Line, lawnPixel: LawnPixel, pixelDimension: number): boolean => {
        const pointA = line[0];
        const pointB = line[0];
        
        return Collision.lineWithBox(pointA.x, pointA.y, pointB.x, pointB.y, lawnPixel.x, lawnPixel.y, lawnPixel.x + pixelDimension, lawnPixel.y + pixelDimension);
    }
}