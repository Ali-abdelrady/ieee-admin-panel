export interface SocialLinksType {
  url: string;
  icon: string;
  name: string;
}

export interface ApiResponse<T> {
  data?: { forms: T };
  message?: string;
}

export type FormResponse = ApiResponse<FormType>;
export type FormResponses = ApiResponse<FormType[]>;

export type FormRequest = Omit<FormType, "id">;

export interface FormType {
  id: string;
  name: string;
  description: string;
  type: "EVENT" | "SURVEY" | "OUTING" | "FEEDBACK" | "ANY";
  eventId?: string;
  isPublic: boolean;
  isPublished: boolean;
  isRegistrationForm: boolean;
  startDate: string;
  endDate: string;

  createdAt: string;
  updatedAt?: string;
  fields?: FormFieldType[];
}

export type FieldType =
  | "TEXT"
  | "EMAIL"
  | "NUMBER"
  | "SELECT"
  | "RADIO"
  | "CHECKBOX"
  | "TEXTAREA"
  | "DROPDOWN"
  | "OPTIONS"
  | "FILE"
  | "DATE"
  | "PARAGRAPH";
export interface FormFieldType {
  id: string;
  label: string;
  type: FieldType;

  name: string;
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  placeholder?: string;

  options?: string[]; // for select;
}
