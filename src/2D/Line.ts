import { Position } from "./Position";


export type Line = [Position, Position];

export const Line = {
    convertPositionArrayToLines: (nodes: Position[]): Line[] => {

        const lines: Line[] = [];
    
        for(let i = 0; i < nodes.length; i++) {
    
            let j = i + 1;
            if(i === nodes.length - 1) {
                // connect last polygon point with first
                j = 0;
            }
    
            const nodeA = nodes[i];
            const nodeB = nodes[j];
    
            lines.push([nodeA, nodeB]);
        }
    
        return lines;
    }
}