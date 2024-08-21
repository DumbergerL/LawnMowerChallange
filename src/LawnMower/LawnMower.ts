import { factory as randomLawnMowerFactory } from "./Default/RandomLawnMower";
import { factory as dumbLawnMowerFactory } from "./Default/DumbLawnMower";
import { factory as incidenceEqualsReflectionLawnMowerFactory } from "./Default/IncidenceEqualsReflectionLawnMower";
import { factory as alternatingLawnMowerFactory } from "./Default/AlternatingLawnMower";
import { factory as circulateLawnMowerFactory } from "./Default/CirculateLawnMower";
import { factory as excellentLawnMowerFactory } from "./Default/ExcellentLawnMower";

import { ILawnMower, ILawnMowerFactory } from "./LawnMowerInterface";

type LawnMowerFactoryRegistry = {
    id: number,
    factory: ILawnMowerFactory
}

export const LawnMower = {

    /**
     * List of all lawn mower implementations
     */
    getAllLawnMowerFactories: (): LawnMowerFactoryRegistry[] => {
        return [
            { id: 1, factory: randomLawnMowerFactory },
            { id: 2, factory: dumbLawnMowerFactory },
            { id: 3, factory: alternatingLawnMowerFactory },
            { id: 4, factory: circulateLawnMowerFactory },
            { id: 5, factory: incidenceEqualsReflectionLawnMowerFactory },
            { id: 6, factory: excellentLawnMowerFactory }
        ]
    }
}