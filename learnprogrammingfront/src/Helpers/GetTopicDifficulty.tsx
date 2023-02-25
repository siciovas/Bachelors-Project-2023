import React from "react";
import { Difficulty } from "../Pages/Types/LearningTopicsTypes";

const GetTopicDifficulty = (difficulty: Difficulty) : string => {
    switch(difficulty.toString()){
        
        case Difficulty.Easy: {
            return "Lengva";
        }
        
        case Difficulty.Normal: {
            return "Vidutinis";
        }

        case Difficulty.Hard: {
            return "Sunku";
        }

        default:
            return "Nenustatyta";
    }
}

export { GetTopicDifficulty };