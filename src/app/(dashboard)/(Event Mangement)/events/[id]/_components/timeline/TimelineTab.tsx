"use client";
import AddButton from "@/components/button/addButton";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, NotebookText, UserRoundIcon } from "lucide-react";
import PreviewButton from "@/components/button/previewButton";
import DeleteButton from "@/components/button/deleteButton";
import { useEffect, useMemo, useState } from "react";
import { formatDateString, formatTime } from "@/services/helpers/dateHelpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AgendaItemType, TimelineType } from "@/types/eventTimeline";
import SessionForm from "./SessionForm";
import TimeLineForm from "./TimeLineForm";
import DeleteDialog from "@/components/forms/deleteDialog";
import {
  useDeleteAgendaItemMutation,
  useDeleteTimelineMutation,
  useGetTimelinesQuery,
} from "@/services/Api/eventTimeline";
import Loader from "@/components/Loader";
import { useGetEventSpeakersQuery } from "@/services/Api/EventSpeakers";
import EditButton from "@/components/button/editButton";

export default function TimeLineTab({ eventId }: { eventId: string }) {
  // Timeline Queries
  const {
    data: timelineResponse,
    isLoading,
    isError,
  } = useGetTimelinesQuery(eventId);
  const [deleteTimeline, { isLoading: isDeletingTimeline }] =
    useDeleteTimelineMutation();

  // Agedna Queies
  const [deleteAgendaItem, { isLoading: isDeletingAgendaItem }] =
    useDeleteAgendaItemMutation();
  // Get Event Speakers
  const { data: eventSpeakersResponse } = useGetEventSpeakersQuery(eventId);
  const eventSpeakersOptions = useMemo(() => {
    const options =
      eventSpeakersResponse?.data?.map(({ speaker }) => ({
        label: speaker.name,
        value: speaker.id,
      })) || [];
    return options;
  }, [eventSpeakersResponse]);
  if (isLoading) {
    return <Loader error={isError} />;
  }

  const timeline = timelineResponse?.data?.timeline ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-semibold text-xl md:text-xl">Event Timeline</h1>
        <NoPropagationWrapper>
          <TimeLineForm operation="add" eventId={eventId} />
        </NoPropagationWrapper>
      </div>

      {timeline.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <NotebookText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Timeline Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a timeline to clearly communicate your event’s flow and keep
              attendees informed.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <TimeLineForm operation="add" eventId={eventId} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="w-full" defaultValue={["item-0"]}>
          {timeline.map((day, dayIndex) => (
            <AccordionItem
              key={dayIndex}
              value={`item-${dayIndex}`}
              className="border-b-0 mb-4"
            >
              <Card className="overflow-hidden border-l-5 border-l-primary  ">
                <AccordionTrigger className="hover:no-underline p-0 cursor-pointer flex items-center">
                  <CardHeader className=" w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full text-left">
                      <div className="flex flex-col">
                        <CardTitle className="text-xl md:text-xl font-bold flex items-center gap-2">
                          {/* <Calendar /> */}
                          {day.label}
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          {formatDateString(day.date)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-700 px-2 py-0.5">
                          {day.agendaItems.length} session
                          {day.agendaItems.length !== 1 ? "s" : ""}
                        </Badge>
                        <NoPropagationWrapper className="flex gap-2">
                          {/* <DeleteButton label="Session" variant="destructive" /> */}
                          <TimeLineForm
                            operation="edit"
                            eventId={eventId}
                            defaultValues={day}
                            trigger={
                              <EditButton
                                label="Edit Timeline"
                                variant="ghost"
                              />
                            }
                          />

                          <DeleteDialog<
                            TimelineType,
                            {
                              eventId: string;
                              timelineId: string | number;
                            }
                          >
                            deleteFn={deleteTimeline}
                            isLoading={isDeletingTimeline}
                            getDeleteParams={(day) => ({
                              eventId: eventId,
                              timelineId: day.id,
                            })}
                            rows={day}
                            // variant="default"
                            trigger={
                              <DeleteButton
                                variant="ghost"
                                isIcon={true}
                                className=" text-red-500 hover:text-500"
                              />
                            }
                          />
                          <SessionForm
                            operation="add"
                            speakersOptions={eventSpeakersOptions}
                            eventId={eventId}
                            timelineId={day.id}
                          />
                        </NoPropagationWrapper>
                        {/* <SessionForm operation="add" /> */}
                      </div>
                    </div>
                  </CardHeader>
                </AccordionTrigger>

                <AccordionContent>
                  <CardContent className="">
                    {day.agendaItems.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No sessions scheduled</p>
                      </div>
                    ) : (
                      <div className="divide-y flex flex-col gap-4">
                        {day.agendaItems.map((session, sessionIndex) => (
                          <Card
                            key={sessionIndex}
                            className="hover:bg-muted/50 transition-colors "
                          >
                            <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                              {/* Session Details */}
                              <div className="space-y-4 flex flex-col ">
                                <CardTitle className="text-xl font-bold text-primary">
                                  {session.name}
                                </CardTitle>
                                <CardDescription className="flex gap-5 font-semibold">
                                  <div>
                                    <p className="flex items-center gap-1.5">
                                      <Clock size={16} />
                                      {formatTime(session.startTime)} -{" "}
                                      {formatTime(session.endTime)}
                                    </p>
                                  </div>
                                  <Badge className="">
                                    {calculateDuration(
                                      session.startTime,
                                      session.endTime
                                    )}
                                  </Badge>
                                  <div className="flex gap-2 items-center">
                                    <UserRoundIcon size={20} />
                                    <p>{session.speaker.name}</p>
                                  </div>
                                </CardDescription>
                                <div className="text-base  bg-accent p-5">
                                  <p>{session.description}</p>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col sm:flex-row md:flex-col justify-between gap-2 md:gap-3 self-start">
                                <NoPropagationWrapper className="flex gap-2">
                                  <SessionForm
                                    operation="edit"
                                    defaultValues={session}
                                    speakersOptions={eventSpeakersOptions}
                                    eventId={eventId}
                                    timelineId={day.id}
                                    trigger={
                                      <EditButton
                                        label="Edit Session"
                                        variant="ghost"
                                      />
                                    }
                                  />
                                  <DeleteDialog<AgendaItemType>
                                    deleteFn={deleteAgendaItem}
                                    isLoading={isDeletingAgendaItem}
                                    rows={session}
                                    getDeleteParams={(session) => ({
                                      eventId: eventId,
                                      timelineId: day.id,
                                      agendaItemId: session.id,
                                    })}
                                    trigger={
                                      <DeleteButton
                                        variant="ghost"
                                        isIcon={true}
                                        className=" text-red-500 hover:text-500"
                                      />
                                    }
                                  />
                                </NoPropagationWrapper>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

// Helper function to calculate duration
function calculateDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`.trim();
}
export function NoPropagationWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
}
