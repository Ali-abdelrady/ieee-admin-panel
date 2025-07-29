interface MenuItemType {
  name: string;
  description: string;
  price: number;
  available: boolean;
}
export interface FoodMenuType {
  id: string | number;
  eventId: string;
  name: string;
  coverImage: File | string;
  menuImages: File[] | string[];
  items?: MenuItemType[];
}
export interface ApiResponse<T> {
  data?: { menus: T };
  message?: string;
}

export type FoodMenuRequest = Omit<FoodMenuType, "id" | "eventId">;
// export type FoodMenuResponse = ApiResponse<FoodMenuType>;
export type FoodMenuResponse = ApiResponse<FoodMenuType[]>;
