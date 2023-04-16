export interface OrderTypes {
  orderNumber: string;
  orderTime: Date;
  total: number;
  orderItems: OrderItemsTypes[];
}

export interface OrderItemsTypes {
  name: string;
  photo: string;
  quantity: number;
  productId: number;
  price: number;
}
