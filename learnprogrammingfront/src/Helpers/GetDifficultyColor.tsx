import React from "react";
import { Difficulty } from "../Pages/Types/LearningTopicsTypes";

const GetDifficultyColor = (difficulty: Difficulty) : string => {
    switch(difficulty.toString()){
        
        case Difficulty.Easy: {
            return "green";
        }
        
        case Difficulty.Normal: {
            return "purple";
        }

        case Difficulty.Hard: {
            return "red";
        }

        default:
            return "#000000";
    }
}

export { GetDifficultyColor };