export enum BookCover {
  Soft,
  Hard,
}

export interface ShopTypes {
  id: number;
  photo: Blob;
  name: string;
  price: number;
  description: string;
  pageNumber: number;
  language: string;
  bookCoverType: BookCover;
  publisher: string;
  releaseDate: string;
}
