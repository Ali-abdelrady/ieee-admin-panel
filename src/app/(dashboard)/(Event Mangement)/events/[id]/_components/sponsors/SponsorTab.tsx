import DeleteDialog from "@/components/forms/deleteDialog";
import { SponsorType } from "@/types/sponsors";
import { useState } from "react";
import { Plus, User, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "@/components/table/dataTable";
import Image from "next/image";
import { ImageCell } from "@/components/table/imageCell";
import SponsorForm from "./SponsorForm";
import {
  useDeleteEventSponsorMutation,
  useGetEventSponsorsQuery,
} from "@/services/Api/eventSponsors";
import Loader from "@/components/Loader";

export default function SponsorsTab({ eventId }: { eventId: string }) {
  const { data, isLoading, isError } = useGetEventSponsorsQuery(eventId);
  const [deleteSponsor, { isLoading: isDeleting }] =
    useDeleteEventSponsorMutation();

  if (isLoading) {
    <Loader error={isError} />;
  }
  const sponsors = data?.data ?? [];
  console.log("Event sponsors:", sponsors);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Sponsors</h3>
        <SponsorForm operation="add" eventId={eventId} />
      </div>

      {sponsors.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((item) => {
            const { sponsor } = item;
            return (
              <Card
                key={sponsor.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="flex items-center space-x-4">
                  <div className="min-w-18 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={sponsor.images?.url ?? "/images/speaker2.jpg"}
                      alt={sponsor.name}
                      width={100}
                      height={100}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{sponsor.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {sponsor.url}
                    </p>
                    {/* {sponsor.image && sponsor.image.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {sponsor.image.length} images available
                    </p>
                  )} */}
                  </div>
                  <div className="flex space-x-1">
                    <SponsorForm
                      operation="edit"
                      defaultValues={sponsor}
                      eventId={eventId}
                    />
                    <DeleteDialog
                      rows={sponsor}
                      deleteFn={deleteSponsor}
                      isLoading={false}
                      getDeleteParams={(s) => ({
                        sponsorId: s.id.toString(),
                        eventId: eventId,
                      })}
                      trigger={
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Sponsors Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add sponsors to your event to showcase who will be presenting.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <SponsorForm operation="add" eventId={eventId} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
