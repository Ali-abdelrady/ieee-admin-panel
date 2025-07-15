"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "@/components/table/dataTable";
import {
  certificatesPerCourseColumns,
  companyCertificatesColumns,
  companySessionsColumns,
  sessionsByInstructorColumns,
} from "./_components/coulmns";

import { ColumnDef } from "@tanstack/react-table";
import {
  Building2,
  Contact,
  GraduationCap,
  Presentation,
  ScrollText,
} from "lucide-react";
import { BarChartHorizontal } from "@/components/charts/barChartHorizontal";
import { BarChartVertical } from "@/components/charts/barChartVertical";
import { ChartPieLabelList } from "@/components/charts/pieChart";
import { CustomLineChart } from "@/components/charts/lineChart";
import TabsDatables from "@/components/table/tabsDataTable";
// import { BaseTabConfig } from "@/types/tabs";

export default function DashboardPage() {
  // const {
  //   data: dashboardData,
  //   isLoading,
  //   isError,
  // } = useGetDashboardDataQuery();

  // if (isError) return <div>Error loading dashboard data</div>;

  // const tabs = [
  //   {
  //     value: "companySessionsAndAttendees",
  //     data: dashboardData?.companySessionsAndAttendees ?? [],
  //     columns: companySessionsColumns,
  //     filterKey: "companyName",
  //   },
  //   {
  //     value: "certificatesPerCourse",
  //     data: dashboardData?.certificatesPerCourse ?? [],
  //     columns: certificatesPerCourseColumns,
  //     filterKey: "courseName",
  //   },
  //   {
  //     value: "companyCertificates",
  //     data: dashboardData?.companyCertificates ?? [],
  //     columns: companyCertificatesColumns,
  //     filterKey: "companyName",
  //   },
  //   {
  //     value: "sessionsByInstructor",
  //     data: dashboardData?.sessionsByInstructor ?? [],
  //     columns: sessionsByInstructorColumns,
  //     filterKey: "instructorName",
  //   },
  // ] satisfies BaseTabConfig<any, any>[];
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Summary Cards */}
          {/* <SummaryCards dashboardData={dashboardData} isLoading={isLoading} />
          {isLoading ? (
            <SkeletonCards isLoading={isLoading} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4 lg:gap-6 px-6">
              <Charts dashboardData={dashboardData} isLoading={isLoading} />
              <TabsDatables tabs={tabs} />
            </div>
          )} */}
          dashboardPage
          {/* Charts */}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function SummaryCard({
  title,
  value,
  isLoading,
  icon,
}: {
  title: string;
  value?: number;
  isLoading: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Card className="flex flex-row items-center justify-between gap-2 px-6">
      <div>
        <CardTitle className="text-lg font-medium gap-2 flex flex-col ">
          <div className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-12" /> : value}
          </div>
          {title}
        </CardTitle>
      </div>
      <div>
        {isLoading ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : (
          <div className="bg-primary text-primary-foreground rounded-full p-4">
            {" "}
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

interface CommonProps {
  dashboardData: any;
  isLoading: boolean;
}

// function Charts({ dashboardData, isLoading }: CommonProps) {
//   return (
//     <>
//       {/* Vertical Bar Chart */}
//       <div className="lg:col-span-4 w-full md:min-h-[400px]">
//         <BarChartVertical
//           data={dashboardData?.companySessionsAndAttendees || []}
//           xAxisKey="companyName"
//           barKey="sessions_count"
//           title="The number of sessions per company"
//           description="Number of sessions per company"
//           barLabel="Sessions"
//         />
//       </div>

//       {/* Line Chart */}
//       <div className="lg:col-span-2 w-full md:min-h-[400px]">
//         <CustomLineChart
//           data={dashboardData?.certificatesPerCourse || []}
//           xAxisKey="courseName"
//           lineKey="certificates_count"
//           title="Certificates per Course"
//           description="Number of certificates issued per course"
//           lineLabel={"Certificates"}
//         />
//       </div>

//       {/* Pie Chart */}
//       <div className="lg:col-span-2 w-full md:min-h-[400px]">
//         <ChartPieLabelList<CompanyCertificate>
//           title="Certificates per Company"
//           description="Distribution of certificates per company"
//           nameKey="companyName"
//           valueKey="certificates_count"
//           data={dashboardData?.companyCertificates || []}
//         />
//       </div>

//       {/* Horizontal Bar Chart */}
//       <div className="lg:col-span-2 w-full md:min-h-[400px]">
//         <BarChartHorizontal
//           data={dashboardData?.sessionsByInstructor || []}
//           yAxisKey="instructorName"
//           barKey="sessions_count"
//           title="Sessions per Instructor"
//           description="Number of sessions conducted per instructor"
//           barLabel="Sessions"
//         />
//       </div>
//     </>
//   );
// }
// function SummaryCards({ dashboardData, isLoading }: CommonProps) {
//   return (
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 px-6">
//       <SummaryCard
//         title="Sessions"
//         value={dashboardData?.sessions}
//         isLoading={isLoading}
//         icon={<Contact />}
//       />
//       <SummaryCard
//         title="Certificates"
//         value={dashboardData?.certificates}
//         isLoading={isLoading}
//         icon={<ScrollText />}
//       />
//       <SummaryCard
//         title="Courses"
//         value={dashboardData?.courses}
//         isLoading={isLoading}
//         icon={<GraduationCap />}
//       />
//       <SummaryCard
//         title="Companies"
//         value={dashboardData?.companies}
//         isLoading={isLoading}
//         icon={<Building2 />}
//       />
//       <SummaryCard
//         title="Instructors"
//         value={dashboardData?.instructor}
//         isLoading={isLoading}
//         icon={<Presentation />}
//       />
//     </div>
//   );
// }

// function SkeletonCards({ isLoading }: { isLoading: boolean }) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
//       {[...Array(5)].map((_, i) => (
//         <Card
//           key={i}
//           className={`min-h-[400px] w-full ${
//             i === 0 ? "lg:col-span-4" : "lg:col-span-2"
//           }`}
//         >
//           <CardHeader>
//             <Skeleton className="h-6 w-3/4" />
//             <Skeleton className="h-4 w-full mt-2" />
//           </CardHeader>
//           <CardContent>
//             <Skeleton className="h-[250px] w-full" />
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }
