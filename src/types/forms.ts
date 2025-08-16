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
  hasQrCode: boolean;
  isRegistrationForm: boolean;
  startDate: string;
  endDate: string;
  responsesCount?: number;
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
  maxFileSize?: number;
  name: string;
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  placeholder?: string;

  options?: string[]; // for select;
}

export type RawSubmission = {
  id: string;
  submittedAt: string;
  user?: { id: string; name?: string | null; email?: string | null } | null;
  // dynamic keys: name/email/anything-else -> { id, value, fieldId, submissionId }
  [key: string]:
    | unknown
    | { id: string; value?: unknown; fieldId: string; submissionId: string };
};

export type RawApiForm = {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  responses?: RawSubmission[];
  // ...other form fields
};

export type ApiEnvelope = {
  status: string;
  data: { form: RawApiForm };
};

export type NormalizedFormResponses = {
  form: RawApiForm;
  responses: FormResponse[];
};
