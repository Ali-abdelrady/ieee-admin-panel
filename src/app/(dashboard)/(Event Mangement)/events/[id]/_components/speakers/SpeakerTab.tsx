import DeleteDialog from "@/components/forms/deleteDialog";
import { speakerColumns } from "./speakersCoulmns";
import { SpeakerType } from "@/types/speakers";
import { useState } from "react";
import { Plus, User, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import DataTable from "@/components/table/dataTable";
import Image from "next/image";
import { ImageCell } from "@/components/table/imageCell";
import SpeakerForm from "./speakerForm";
import {
  useDeleteEventSpeakerMutation,
  useGetEventSpeakersQuery,
} from "@/services/Api/EventSpeakers";
import Loader from "@/components/Loader";

export default function SpeakersTab({ eventId }: { eventId: string }) {
  const { data, isLoading, isError } = useGetEventSpeakersQuery(eventId);
  const [deleteSpeaker, { isLoading: isDeleting }] =
    useDeleteEventSpeakerMutation();

  if (isLoading) {
    return <Loader error={isError} />;
  }
  const speakers = data?.data ?? [];
  console.log("Event Speakers:", speakers);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Speakers</h3>
        <SpeakerForm
          operation="add"
          eventId={eventId}
          eventSpeakers={speakers}
        />
      </div>

      {speakers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {speakers.map((item) => {
            const { speaker } = item;
            return (
              <Card
                key={speaker.id}
                className="hover:shadow-md transition-shadow "
              >
                <CardHeader>
                  <div className="rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={speaker.images?.url ?? "/images/speaker2.jpg"}
                      alt={speaker.name}
                      width={200}
                      height={100}
                      className="h-full w-full object-cover aspect-square"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex text-center flex-col gap-2  items-center ">
                  <div className="">
                    <h4 className="font-medium">{speaker.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {speaker.title}
                    </p>
                    {/* {speaker.image && speaker.image.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {speaker.image.length} images available
                    </p>
                  )} */}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-center mt-auto">
                  <SpeakerForm
                    key={item.id ?? "new"}
                    operation="edit"
                    defaultValues={item}
                    eventId={eventId}
                    eventSpeakers={speakers}
                  />
                  <DeleteDialog
                    rows={speaker}
                    deleteFn={deleteSpeaker}
                    getDeleteParams={(row) => ({
                      speakerId: row.id.toString(),
                      eventId: eventId,
                    })}
                    isLoading={isDeleting}
                    // getId={(speaker: SpeakerType) => speaker.id}
                    trigger={
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    }
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Speakers Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add speakers to your event to showcase who will be presenting.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <SpeakerForm
                operation="add"
                eventId={eventId}
                eventSpeakers={speakers}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
