"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { broadcast } from "@/lib/broadcast";
import { api } from "@/services/Api/api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    broadcast.onmessage = (event) => {
      const { type, tag, id } = event.data;
      if (type === "invalidate") {
        const invalidateTag = id
          ? [{ type: tag, id }] // invalidate specific item
          : [{ type: tag }]; // fallback
        dispatch(api.util.invalidateTags(invalidateTag));
      }
    };
  }, []);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex px-4">
            <ModeToggle />
          </div>
        </header>

        <main className="p-4 flex-1 overflow-hidden">
          <div className="h-full overflow-auto">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
