export interface LearningSubTopicsType {
  id: number;
  learningTopicId: number;
  subTopicName: string;
  tasks: TasksInfoType[];
}

export interface TasksInfoType {
  id: number;
  name: string;
}
