export type Position = {
    x: number,
    y: number
}

export const calculateBoundaryLength = (nodes: Position[]): number => {
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
}

export const calculateAngle = (nodeA: Position, nodeB: Position): number => {
    return Math.atan2(nodeB.y - nodeA.y, nodeB.x - nodeA.x);
}