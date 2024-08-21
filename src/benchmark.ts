import { Garden } from "./Garden/Garden";
import { LawnMower } from "./LawnMower/LawnMower";
import Simulation from "./Simulation/Simulation";

const startBenchmark = Date.now();

const gardens = Garden.getAllGardens();
const lawnMowerFactories = LawnMower.getAllLawnMowerFactories();

const tableTime: any = {};
const tableMaxBounces: any = {};
const tablePercentage: any = {};
const tableSteps: any = {};

gardens.forEach(garden => {

    const rowTime: any = {};
    const rowMaxBounces: any = {};
    const rowPercentage: any = {};
    const rowSteps: any = {};

    lawnMowerFactories.forEach(lawnMowerFactory => {
        const simulation = new Simulation(garden, lawnMowerFactory);
        simulation.initalize();

        const start = Date.now();

        let maxBounces = 0;

        let simulationStatus
        do {
            simulationStatus = simulation.step();
            if(simulationStatus.collisions?.length ?? 0 > maxBounces){
                maxBounces = simulationStatus.collisions?.length ?? 0;
            }

        } while (simulationStatus.status !== 'FINISHED' && simulationStatus.status !== 'ERROR');

        const end = Date.now();
        if (simulationStatus.status === 'ERROR') {
            rowTime[lawnMowerFactory.constructor.name] = null;
        }else{
            rowTime[lawnMowerFactory.constructor.name] = end - start;
        }
        rowMaxBounces[lawnMowerFactory.constructor.name] = maxBounces;
        rowPercentage[lawnMowerFactory.constructor.name] = simulationStatus.percentageCut;
        const stepCount = simulation.getStepCount();
        rowSteps[lawnMowerFactory.constructor.name] = stepCount >= garden.getMaxSteps() ? 'MAX' : stepCount;

    });

    tableTime[garden.constructor.name] = rowTime;
    tableMaxBounces[garden.constructor.name] = rowMaxBounces;
    tablePercentage[garden.constructor.name] = rowPercentage;
    tableSteps[garden.constructor.name] = rowSteps;
});

const endBenchmark = Date.now();

const printFormattedTable = (tableData: any, formatter: (cellValue: any) => string, calculateAvg: boolean = false) => {
    const avg: Record<string,number> = {};
    const numberOfGardens = Object.keys(tableData).length;

    for(const [gardenName, mowerData] of Object.entries(tableData)){
        for(const [mowerName, value] of Object.entries(mowerData as object)){
            tableData[gardenName][mowerName] = formatter(value);
        
            if(!avg[mowerName] && calculateAvg){
                avg[mowerName] = 0;
            }

            if(calculateAvg){
                avg[mowerName] += value;
            }
        }
    }
    if(calculateAvg){
        tableData["Average"] = {};
        for(const [mowerName, value] of Object.entries(avg)){
            tableData["Average"][mowerName] = formatter(value / numberOfGardens);
        }    
    }
    console.table(tableData);
}

console.log("Finished benchmark in " + ((endBenchmark - startBenchmark) / 100).toFixed(2) + " s");

console.log("\nTime in ms:")
printFormattedTable(tableTime, cell => `${cell} ms`, true);

console.log("\nPercentage Cut:")
printFormattedTable(tablePercentage, cell => `${((cell * 10000) / 100).toFixed(2)} %`, true);

console.log("\nMaximum Bounces (per Step):")
printFormattedTable(tableMaxBounces, cell => cell, true);

console.log("\nSteps for Simulation:")
printFormattedTable(tableSteps, cell => cell, false);
