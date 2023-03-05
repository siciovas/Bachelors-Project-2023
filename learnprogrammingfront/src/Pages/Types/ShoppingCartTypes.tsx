export interface ShoppingCartTypes {
cartPrice: number;
shipping: number;
totalPrice: number;
shoppingCartItems: ShoppingCartItem[];
}

export interface ShoppingCartItem{
quantity: number,
product: Product;
}

export interface Product{
price: number;
bookCoverType: string;
photo: string;
name: string;
}