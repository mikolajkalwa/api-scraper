export type Product = {
  id: number | string;
  price: number;
};

export type EcommerceResponse = {
  total: number;
  count: number;
  products: Array<Product>;
};
