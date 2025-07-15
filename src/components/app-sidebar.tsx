"use client";

import * as React from "react";
import {
  Activity,
  AudioWaveform,
  BookOpen,
  BookOpenText,
  Bot,
  Building,
  Calendar,
  Calendar1Icon,
  Cog,
  Command,
  Frame,
  GalleryVerticalEnd,
  House,
  KeyRound,
  LogOut,
  Map,
  Paperclip,
  PieChart,
  QrCode,
  ScanEye,
  ScrollText,
  Settings,
  Settings2,
  SlidersHorizontal,
  SquareTerminal,
  UserRound,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./ui/theme-toggle";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/services/store/store";
import { Button } from "./ui/button";
import Image from "next/image";
import { logout } from "@/services/store/features/AuthSlice";
import { useRouter } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  // This is sample data.
  const [isMounted, setIsMounted] = React.useState(false);
  const { open } = useSidebar();
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Before client mount, show basic shell to avoid mismatch:
  if (!isMounted) {
    return <Sidebar {...props} />;
  }
  const handleLogout = () => {
    console.log("logout");
    dispatch(logout());
    router.push("/login");
  };
  const data = {
    user: {
      name: user?.name || "Youssef",
      email: user?.email || "admin@admin.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashbaord",
        url: "/",
        icon: House,
        isActive: true,
        isSubItem: false,
      },
      {
        title: "Event Management",
        icon: Calendar,
        isSubItem: false,
        url: "/events",
      },
      {
        title: "Memeber Management",
        icon: Users,
        isSubItem: true,
        url: "/tasks",
        items: [
          // {
          //   title: "Tasks",
          //   url: "/tasks",
          // },
          // {
          //   title: "Sessions",
          //   url: "/sessions",
          // },
          // {
          //   title: "Attendance",
          //   url: "/attendance",
          // },
          // {
          //   title: "Best Members",
          //   url: "/best-members",
          // },
          {
            title: "Committes",
            url: "/committes",
          },
          {
            title: "Board",
            url: "/board",
          },
        ],
      },
      {
        title: "CMS",
        icon: Paperclip,
        isSubItem: true,
        url: "/companies",
        items: [
          {
            title: "FAQS",
            url: "/faqs",
          },
          {
            title: "Posts",
            url: "/posts",
          },
          {
            title: "Awards",
            url: "/awards",
          },
          {
            title: "Partners",
            url: "/partners",
          },
        ],
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image
              src={"/favicon.ico"}
              alt="lloyds logo"
              width={25}
              height={20}
            />
            {/* <Settings width={20} /> */}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">IEEE BUB</span>
            <span className="truncate text-xs">Enterprise</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={handleLogout} variant={"default"} className="w-full">
          <LogOut />
          {open && "Logout"}
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
