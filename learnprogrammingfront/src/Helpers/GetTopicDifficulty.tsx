import { Difficulty } from "../Types/LearningTopicsTypes";

const GetTopicDifficulty = (difficulty: Difficulty): string => {
    switch (difficulty) {

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