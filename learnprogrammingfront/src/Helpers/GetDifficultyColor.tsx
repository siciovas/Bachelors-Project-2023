import { Difficulty } from "../Types/LearningTopicsTypes";

const GetDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty) {
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
};

export { GetDifficultyColor };
