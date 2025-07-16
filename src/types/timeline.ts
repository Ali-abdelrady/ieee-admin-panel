export interface TimelineType {
  id: number;
  date: string;
  label: string;
  agenda: AgendaItemType[];
}
export interface ApiResponse<T> {
  data?: { timeline: T };
  message?: string;
}

export type TimelineRequest = Omit<TimelineType, "id">;
export type TimelineResponse = ApiResponse<TimelineType>;
export type TimelinesResponse = ApiResponse<TimelineType[]>;

export interface AgendaItemType {
  id: number | string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  speakerId: string;
}
