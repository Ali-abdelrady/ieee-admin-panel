export interface TimelineType {
  id?: number;
  date: string;
  label: string;
  agenda: AgendaItemType[];
}
export interface ApiResponse<T> {
  data?: { Timelines: T };
  message?: string;
}

export type TimelineRequest = Omit<TimelineType, "id">;
export type TimelineResponse = ApiResponse<TimelineType>;
export type TimelinesResponse = ApiResponse<TimelineType[]>;

export interface AgendaItemType {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  speakerId: string;
}
