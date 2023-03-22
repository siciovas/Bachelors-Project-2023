export interface ShoppingCartTypes {
cartPrice: number;
shipping: number;
totalPrice: number;
shoppingCartItems: ShoppingCartItem[];
}

export interface ShoppingCartItem{
id: number;
quantity: number;
product: Product;
}

export interface Product{
price: number;
bookCoverType: string;
photo: string;
name: string;
}