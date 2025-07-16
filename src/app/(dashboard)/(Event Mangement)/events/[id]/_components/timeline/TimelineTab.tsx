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
import { Calendar, Clock, UserRoundIcon } from "lucide-react";
import EditButton from "@/components/table/editButton";
import PreviewButton from "@/components/button/previewButton";
import DeleteButton from "@/components/button/deleteButton";
import { SpeakerType } from "@/types/speakers";
import { useEffect, useState } from "react";
import { formatDateString, formatTime } from "@/services/helpers/dateHelpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AgendaItemType, TimelineType } from "@/types/timeline";
import SessionForm from "./SessionForm";
import TimeLineForm from "./TimeLineForm";
import DeleteDialog from "@/components/forms/deleteDialog";
import { useDeletePartnerMutation } from "@/services/Api/partners";

export default function TimeLineTab({
  eventId,
  speakers = [],
}: {
  eventId: string;
  speakers: SpeakerType[];
}) {
  const [timeline, setTimeline] = useState<TimelineType[]>([]);
  const [deletePartner, { isLoading: isDeleting }] = useDeletePartnerMutation();

  // Mock data - replace with actual API call
  useEffect(() => {
    setTimeline([
      {
        date: "2025-05-20T00:00:00Z",
        label: "Day 1",
        agenda: [
          {
            name: "AI in 2025",
            description: "A deep dive into modern AI trends.",
            startTime: "2025-05-20T10:30:00Z",
            endTime: "2025-05-20T11:30:00Z",
            speakerId: "8447d38f-96ca-44b1-8fe3-fc992378045d",
          },
          {
            name: "Future of Web Development",
            description: "Exploring next-gen web technologies.",
            startTime: "2025-05-20T13:00:00Z",
            endTime: "2025-05-20T14:30:00Z",
            speakerId: "8447d38f-96ca-44b1-8fe3-fc992378045d",
          },
        ],
      },
      {
        date: "2025-05-21T00:00:00Z",
        label: "Day 2",
        agenda: [
          {
            name: "Quantum Computing",
            description: "Understanding quantum algorithms.",
            startTime: "2025-05-21T09:00:00Z",
            endTime: "2025-05-21T10:30:00Z",
            speakerId: "8447d38f-96ca-44b1-8fe3-fc992378045d",
          },
        ],
      },
    ]);
  }, [eventId]);

  const getSpeakerName = (speakerId: string) => {
    const speaker = speakers.find((s) => s.id === speakerId);
    return speaker ? speaker.name : "Unknown Speaker";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-bold text-2xl md:text-3xl">Event Timeline</h1>
        <NoPropagationWrapper>
          <TimeLineForm operation="add" />
        </NoPropagationWrapper>
      </div>

      {timeline.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-gray-500">No days added yet</p>
        </div>
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
                  <CardHeader className="p-4 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full text-left">
                      <div className="flex flex-col">
                        <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                          <Calendar />
                          {day.label}
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          {formatDateString(day.date)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-700 px-2 py-0.5">
                          {day.agenda.length} session
                          {day.agenda.length !== 1 ? "s" : ""}
                        </Badge>
                        <NoPropagationWrapper className="flex gap-2">
                          {/* <DeleteButton label="Session" variant="destructive" /> */}
                          <DeleteDialog<TimelineType>
                            deleteFn={deletePartner}
                            isLoading={isDeleting}
                            rows={[]}
                            getId={(row) => row.id}
                            variant="destructive"
                          />
                          <SessionForm operation="add" />
                        </NoPropagationWrapper>
                        {/* <SessionForm operation="add" /> */}
                      </div>
                    </div>
                  </CardHeader>
                </AccordionTrigger>

                <AccordionContent>
                  <CardContent className="">
                    {day.agenda.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No sessions scheduled</p>
                      </div>
                    ) : (
                      <div className="divide-y flex flex-col gap-4">
                        {day.agenda.map((session, sessionIndex) => (
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
                                    <p>{getSpeakerName(session.speakerId)}</p>
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
                                    defaultValues={{}}
                                  />
                                  <DeleteDialog<TimelineType>
                                    deleteFn={deletePartner}
                                    isLoading={isDeleting}
                                    rows={[]}
                                    getId={(row) => row.id}
                                    variant="outline"
                                    isIcon={true}
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
