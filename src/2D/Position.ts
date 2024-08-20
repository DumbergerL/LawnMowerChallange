import { Line } from "./Line";

export type Position = {
    x: number,
    y: number
}

export const Position = {
    calculateFromAngleAndDistance: (position: Position, angle: number, distance: number): Position => {
        return {
            x: Math.round(Math.cos(angle) * distance + position.x),
            y: Math.round(Math.sin(angle) * distance + position.y)
        
        }    
    },
    calculateBoundaryLength: (nodes: Position[]): number => {
        let length = 0;
        
        for(let i = 0; i < nodes.length; i++) {
    
            let j = i + 1;
            if(i === nodes.length - 1) {
                // connect last polygon point with first
                j = 0;
            }
    
            const nodeA = nodes[i];
            const nodeB = nodes[j];
    
            var a = nodeA.x - nodeB.x;
            var b = nodeA.y - nodeB.y;
    
            var c = Math.sqrt( a*a + b*b );
            length += c;
        }
        
        return length;
    },
    calculateDistance: (posA: Position, posB: Position): number => {
        var a = posA.x - posB.x;
        var b = posA.y - posB.y;

        return Math.sqrt( a*a + b*b );
    }
}