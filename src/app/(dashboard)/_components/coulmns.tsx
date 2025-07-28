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
    accessorKey: "instructorName",
    header: "Instructor",
  },
  {
    accessorKey: "sessions_count",
    header: "Sessions",
  },
];
