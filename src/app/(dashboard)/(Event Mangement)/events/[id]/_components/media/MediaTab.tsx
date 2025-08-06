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
import DeleteButton from "@/components/button/deleteButton";

export default function MediaTab({ eventId }: { eventId: string }) {
  const { data, isLoading, isError } = useGetEventMediaQuery(eventId);
  const [deleteMedia, { isLoading: isDeleting }] =
    useDeleteEventMediaMutation();

  if (isLoading) {
    return <Loader error={isError} />;
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
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {images.map((img) => (
                <div key={img.id}>
                  <MediaDialog mediaType="image" mediaUrl={img.url} />
                  <DeleteDialog
                    deleteFn={deleteMedia}
                    rows={img}
                    getDeleteParams={(img) => ({
                      eventId: eventId,
                      mediaId: img.id,
                    })}
                    trigger={
                      <DeleteButton
                        // variant="destructive"
                        className="w-full rounded-t-none text-destructive hover:text-destructive "
                      />
                    }
                  />
                </div>
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
            <CardContent className="grid grid-cols-6 gap-4">
              {videos.map((video) => (
                <div key={video.id}>
                  <MediaDialog mediaType="video" mediaUrl={video.url} />
                  <DeleteDialog
                    deleteFn={deleteMedia}
                    rows={video}
                    getDeleteParams={(img) => ({
                      eventId: eventId,
                      mediaId: video.id,
                    })}
                    trigger={
                      <DeleteButton
                        // variant="destructive"
                        className="w-full rounded-t-none text-destructive hover:text-destructive "
                      />
                    }
                  />
                </div>
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
