import { BookCover } from "../Pages/Types/ShopTypes";

const GetBookCoverType = (bookCover: BookCover) : string => {
    switch(bookCover){
        
        case BookCover.Soft: {
            return "Minkštas viršelis";
        }
        
        case BookCover.Hard: {
            return "Kietas viršelis";
        }

        default:
            return "Nenustatyta";
    }
}

export { GetBookCoverType };