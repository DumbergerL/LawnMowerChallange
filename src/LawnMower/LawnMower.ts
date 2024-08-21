import { factory as randomLawnMowerFactory } from "./Default/RandomLawnMower";
import { factory as dumbLawnMowerFactory } from "./Default/DumbLawnMower";
import { factory as incidenceEqualsReflectionLawnMowerFactory } from "./Default/IncidenceEqualsReflectionLawnMower";
import { factory as alternatingLawnMowerFactory } from "./Default/AlternatingLawnMower";
import { factory as circulateLawnMowerFactory } from "./Default/CirculateLawnMower";

import { ILawnMowerFactory } from "./LawnMowerInterface";


export const LawnMower = {
    getAllLawnMowerFactories: (): ILawnMowerFactory[] => {
        return [
            randomLawnMowerFactory,
            dumbLawnMowerFactory,
            alternatingLawnMowerFactory,
            circulateLawnMowerFactory,
            incidenceEqualsReflectionLawnMowerFactory
        ]
    }
}