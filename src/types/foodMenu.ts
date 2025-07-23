interface MenuItemType {
  name: string;
  description: string;
  price: number;
  available: boolean;
}
export interface FoodMenuType {
  id: string | number;
  //   eventId: string;
  name: string;
  menuImageUrl: string[];
  items?: MenuItemType[];
}
export interface ApiResponse<T> {
  data?: { menus: T };
  message?: string;
}

export type FoodMenuRequest = Omit<FoodMenuType, "id" | "eventId">;
export type FoodMenuResponse = ApiResponse<FoodMenuType>;
export type FoodMenusResponse = ApiResponse<FoodMenuType[]>;
