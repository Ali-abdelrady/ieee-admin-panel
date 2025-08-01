import DeleteDialog from "@/components/forms/deleteDialog";
import { useState } from "react";
import { Plus, User, Edit, Trash2, Video, ImagesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  useDeleteEventSpeakerMutation,
  useGetEventSpeakersQuery,
} from "@/services/Api/EventSpeakers";
import Loader from "@/components/Loader";
import {
  useDeleteEventMediaMutation,
  useGetEventMediaQuery,
} from "@/services/Api/evnetMedia";
import MediaForm from "./MediaForm";
import AddButton from "@/components/button/addButton";
import MediaDialog from "@/components/dialogs/mediaDialog";

export default function MediaTab({ eventId }: { eventId: string }) {
  const { data, isLoading, isError } = useGetEventMediaQuery(eventId);
  const [deleteMedia, { isLoading: isDeleting }] =
    useDeleteEventMediaMutation();

  if (isLoading) {
    <Loader error={isError} />;
  }
  const media = data?.data?.eventMedia;
  const images = media?.images ?? [];
  const videos = media?.videos ?? [];
  console.log("Event Media:", media);
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Images</h3>
        </div>
        {images.length > 0 ? (
          <Card>
            <CardContent className="grid grid-cols-4 gap-4">
              {images.map((img) => (
                <MediaDialog
                  mediaType="image"
                  mediaUrl={img.url}
                  key={img.id}
                />
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <ImagesIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Images Yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add Images to your event to showcase our event moments.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <MediaForm
                  eventId={eventId}
                  operation="add"
                  trigger={<AddButton label="Images" />}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Videos</h3>
        </div>
        {videos.length > 0 ? (
          <Card>
            <CardContent>
              {videos.map((video) => (
                <MediaDialog
                  mediaType="video"
                  mediaUrl={video.url}
                  key={video.id}
                />
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Video className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Videos Yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add Videos to your event to showcase our event moments.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <MediaForm
                  eventId={eventId}
                  operation="add"
                  trigger={<AddButton label="Videos" />}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
