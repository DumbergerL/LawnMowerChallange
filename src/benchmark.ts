import { Garden } from "./Garden/Garden";
import { LawnMower } from "./LawnMower/LawnMower";
import Simulation from "./Simulation/Simulation";


const gardens = Garden.getAllGardens();
const lawnMowerFactories = LawnMower.getAllLawnMowerFactories();

const table: any = {};

gardens.forEach(garden => {

    const row: any = {};

    lawnMowerFactories.forEach(lawnMowerFactory => {
        const simulation = new Simulation(garden, lawnMowerFactory);
        simulation.initalize();

        const start = Date.now();

        let simulationStatus
        do {
            simulationStatus = simulation.step();
        } while (simulationStatus.status !== 'FINISHED');

        const end = Date.now();
        row[lawnMowerFactory.constructor.name] = [(simulationStatus.percentageCut * 100).toFixed(2) + " %", `${end - start} ms`];
    });

    table[garden.constructor.name] = row;
});

console.table(table);
