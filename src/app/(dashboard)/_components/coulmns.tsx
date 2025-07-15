import { ColumnDef } from "@tanstack/react-table";
import {
  CompanySession,
  CertificatePerCourse,
  CompanyCertificate,
  SessionByInstructor,
} from "@/types/statistics";

// Company Sessions Columns
export const companySessionsColumns: ColumnDef<CompanySession>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "companyName",
    header: "Company",
  },
  {
    accessorKey: "sessions_count",
    header: "Sessions",
  },
  {
    accessorKey: "certificates_count",
    header: "Certificates",
  },
];

// Certificates Per Course Columns
export const certificatesPerCourseColumns: ColumnDef<CertificatePerCourse>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "courseName",
    header: "Course",
  },
  {
    accessorKey: "certificates_count",
    header: "Certificates",
  },
];

// Company Certificates Columns
export const companyCertificatesColumns: ColumnDef<CompanyCertificate>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "companyName",
    header: "Company",
  },
  {
    accessorKey: "certificates_count",
    header: "Certificates",
  },
];

// Sessions By Instructor Columns
export const sessionsByInstructorColumns: ColumnDef<SessionByInstructor>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "instructorName",
    header: "Instructor",
  },
  {
    accessorKey: "sessions_count",
    header: "Sessions",
  },
];
