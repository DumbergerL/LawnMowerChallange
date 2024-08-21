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

      return { x: intersectionX, y: intersectionY };
    }
    return false;
  },

  twoLinesFromPoints: (posA1: Position, posA2: Position, posB1: Position, posB2: Position): false | Position => {
    return Collision.lineWithLine(posA1.x, posA1.y, posA2.x, posA2.y, posB1.x, posB1.y, posB2.x, posB2.y);
  },
  /**
   * Return false if the two lines do not intersect. Otherwise, return the intersection point. The intesection point can also be the start and endpoint of the line.
   * @param lineA 
   * @param lineB 
   * @param ignorePositions array of positions to ignore when intersection is found
   * @returns 
   */
  twoLines: (lineA: Line, lineB: Line, ignorePositions: Position[] = []): false | Position => {
    const position = Collision.twoLinesFromPoints(lineA[0], lineA[1], lineB[0], lineB[1]);
  
    for(const ignorePosition of ignorePositions) {
      if(position && (Position.isEqual(position, ignorePosition))) {
        return false;
      }
    }

    return position;
  },
  /**
   * Check if given position is inside the boundary of the positions. The boundary array spans the polygon.
   * <b>This function returns false if the position is on the boundary!</b>
   * @param position position to check
   * @param boundary array of position that forms the boundary
   * @returns true if the position is inside the boundary, false otherwise
   */
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

  lineWithBox: (x1: number, y1: number, x2: number, y2: number, rx: number, ry: number, rw: number, rh: number): boolean => {

    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function below
    const left = !!Collision.lineWithLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
    const right = !!Collision.lineWithLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
    const top = !!Collision.lineWithLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
    const bottom = !!Collision.lineWithLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

    // if ANY of the above are true, the line
    // has hit the rectangle
    if (left || right || top || bottom) {
      return true;
    }
    return false;
  },

  /**
   * Collision between line and a lawn pixel (rectangle). The line is defined by two points.
   * <b>If the line is completely inside the lawn pixel, this function returns false!</b>
   * @param line 
   * @param lawnPixel 
   * @param pixelDimension 
   * @returns 
   */
  lineWithLawnPixel: (line: Line, lawnPixel: LawnPixel, pixelDimension: number): boolean => {
    const pointA = line[0];
    const pointB = line[1];

    return Collision.lineWithBox(pointA.x, pointA.y, pointB.x, pointB.y, lawnPixel.x, lawnPixel.y, pixelDimension, pixelDimension);
  }
}