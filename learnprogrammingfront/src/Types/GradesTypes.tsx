export interface GradesTypes {
  id: number;
  topic: string;
  subTopic: string;
  task: string;
  grade: number;
}

export interface GradesForTeacherTypes {
  id: number;
  name: string;
  surname: string;
  grades: GradesTypes[];
}
