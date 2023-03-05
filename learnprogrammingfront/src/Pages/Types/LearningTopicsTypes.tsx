export enum Difficulty {
  Easy,
  Normal,
  Hard,
}

export interface LearningTopicTypes {
  id: number;
  photo: Blob;
  title: string;
  difficultyInText: Difficulty;
}
