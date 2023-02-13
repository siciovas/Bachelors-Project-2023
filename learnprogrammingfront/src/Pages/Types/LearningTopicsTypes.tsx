export enum Difficulty {
    Easy = "1",
    Normal = "2",
    Hard = "3"
}

export interface LearningTopic {
    id: number,
    photo: Blob,
    title: string,
    numberOfSubTopics: number,
    numberOfAllTasks: number,
    difficultyInText: Difficulty,
    difficultyInStars : number
}