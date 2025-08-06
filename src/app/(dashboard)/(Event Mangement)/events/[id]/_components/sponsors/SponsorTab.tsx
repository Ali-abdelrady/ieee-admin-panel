import DeleteDialog from "@/components/forms/deleteDialog";
import { SponsorType } from "@/types/sponsors";
import { useState } from "react";
import { Plus, User, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  const [deleteSponsor, { isLoading: isDeleting }] = useDeleteEventSponsorMutation();

  if (isLoading) {
    return <Loader error={isError} />;
    return <Loader error={isError} />;
  }
  const sponsors = data?.data ?? [];
  console.log("Event sponsors:", sponsors);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Sponsors</h3>
        <SponsorForm operation="add" eventId={eventId} eventSponsors={sponsors} />
      </div>

      {sponsors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {sponsors.map((item) => {
            const { sponsor } = item;
            return (
              <Card
                key={sponsor.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={sponsor.images?.url ?? "/images/speaker2.jpg"}
                      alt={sponsor.name}
                      width={200}
                      height={100}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex text-center flex-col gap-2  items-center">
                  <div>
                    <h4 className="font-medium">{sponsor.name}</h4>
                    <p className="text-sm text-muted-foreground">{sponsor.url}</p>
                    {/* {sponsor.image && sponsor.image.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {sponsor.image.length} images available
                    </p>
                  )} */}
                  </div>
                  <div className="flex items-center">
                    <SponsorForm
                      operation="edit"
                      defaultValues={sponsor}
                      eventId={eventId}
                      eventSponsors={sponsors}
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
              <SponsorForm operation="add" eventId={eventId} eventSponsors={sponsors} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
