import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateDuration, formatDate } from "@/services/helpers/dateHelpers";
import { EventType } from "@/types/events";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CalendarDays,
  Camera,
  Clock,
  Edit,
  Globe,
  MapPin,
  Pen,
  ScrollText,
  Shield,
  Tag,
  Timer,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import EventForm from "../../../_components/form";
import EditButton from "@/components/button/editButton";
import {
  useDeleteEventMutation,
  useGetEventByIdQuery,
} from "@/services/Api/events";
import Loader from "@/components/Loader";
import DeleteDialog from "@/components/forms/deleteDialog";
import DeleteButton from "@/components/button/deleteButton";

export default function DetailsTab({ eventId }: { eventId: string }) {
  const { data, isLoading, isError } = useGetEventByIdQuery(eventId);
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const event = data?.data?.event;

  console.log("event:", event);

  if (isLoading) {
    return <Loader error={isError} />;
  }
  return (
    <div className="space-y-8">
      {/* Hero Section with Image */}

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Event Information Cards */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-0 shadow-xl py-0">
            <div className="relative">
              <div className="aspect-[2/1] relative overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                <Image
                  src={event?.coverImage ?? ""}
                  alt={event?.name ?? "eventImage"}
                  className="object-cover w-full h-full"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                        {event?.name}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          {/* Date & Time */}
          <Card className="shadow-lg border-l-4 border-l-primary">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="mr-3 h-5 w-5 text-primary" />
                Event Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-green-100">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">
                      {event?.startDate && formatDate(event?.startDate)}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-sm font-medium text-muted-foreground">
                    End Date
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-red-100">
                      <Clock className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium">
                      {formatDate(event?.endDate ?? "")}
                      {/* 20/12/2023 */}
                    </span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <Badge variant="outline" className="font-medium">
                  {calculateDuration(
                    event?.startDate ?? "",
                    event?.endDate ?? ""
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Registration Period */}
          {(event?.registrationStart || event?.registrationEnd) && (
            <Card className="shadow-lg border-l-4 border-l-blue-500">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <UserCheck className="mr-3 h-5 w-5 text-blue-500" />
                  Registration Period
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      Registration Opens
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <CalendarDays className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium">
                        {event?.registrationStart
                          ? formatDate(event?.registrationStart)
                          : "Not set"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      Registration Closes
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-orange-100">
                        <Timer className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="font-medium">
                        {event?.registrationEnd
                          ? formatDate(event?.registrationEnd)
                          : "Not set"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location */}
          <Card className="shadow-lg border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <ScrollText className="mr-3 h-5 w-5 text-emerald-500" />
                About Event
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">{event?.description}</div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Event Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg border">
                  <div className="text-2xl font-bold text-primary">
                    {event?.speakers?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Speakers</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">
                    {event?.sponsors?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Sponsors</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg border">
                  <div className="text-2xl font-bold text-emerald-600">
                    {event?.eventDays?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Event Days
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border">
                  <div className="text-2xl font-bold text-purple-600">
                    {/* {event?.registrations?.length || 0} */}0
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Registered
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Event Type
                </span>
                <Badge variant="default" className="capitalize">
                  {event?.private ? "Private" : "Public"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <Badge variant="default" className="capitalize">
                  {event?.category}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground flex items-center gap-3">
                  Location <MapPin className="h-4 w-4 text-emerald-600" />
                </div>
                <Badge variant="default" className="capitalize">
                  {event?.location}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="text-sm font-medium">
                  {new Date(event?.createdAt ?? "").toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>

              {event?.updatedAt && event?.updatedAt !== event?.createdAt && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Last Updated
                    </div>
                    <div className="text-sm font-medium">
                      {new Date(event.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <div className="flex flex-col gap-5">
            <EventForm
              operation="edit"
              defaultValues={event}
              trigger={
                <EditButton label="Event Details" className="w-full p-5">
                  Edit Event Details
                </EditButton>
              }
            />
            <DeleteDialog
              deleteFn={deleteEvent}
              // getDeleteParams={(row)=>}
              rows={event}
              isLoading={isDeleting}
              trigger={
                <DeleteButton className="w-full" variant="destructive" />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
