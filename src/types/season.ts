import { BoardType } from "./board";
import { EventType } from "./events";
import { PostType } from "./post";

export interface SeasonType {
  id: number | string;
  name: string;
  startDate: string;
  endDate: string;
  board: BoardType[];
  events: EventType[];
  posts: PostType[];
  // seasonMemberships: SeasonMembership [not null]
}
export interface ApiResponse<T> {
  data?: {
    seasons: T;
  };
  message?: string;
}

export type SeasonRequest = Omit<
  SeasonType,
  "id" | "board" | "events" | "posts"
>;
export type SeasonResponse = ApiResponse<SeasonType>;
export type SeasonsResponse = ApiResponse<SeasonType[]>;
