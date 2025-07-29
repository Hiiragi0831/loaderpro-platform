export interface OrderItem {
  id: number;
  payment_date: string;
  shipment_date: string;
  ship_date: string;
  create_time: string;
  num_orders: string;
  user: {
    id: number;
    firstname: string;
    lastname: string;
  };
  status_name: string;
  total_price: number;
}
