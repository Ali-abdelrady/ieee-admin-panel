import { SponsorType } from "@/types/sponsors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddButton from "@/components/button/addButton";
import EditButton from "@/components/button/editButton";
import { User } from "lucide-react";
import {
  useAddSponsorMutation,
  useGetSponsorsQuery,
  useUpdateSponsorMutation,
} from "@/services/Api/sponsors";
import { useEffect, useMemo, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SponsorSearch from "./SponsorSearch";
import { useForm } from "react-hook-form";
import { sponsorFormSchema, SponsorFormValues } from "@/validations/sponsors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import SocialLinksManager, {
  parseSocialLinks,
} from "@/components/forms/SocialLinksManger";
import { Switch } from "@/components/ui/switch";
import {
  useAddEventSponsorMutation,
  useUpdateEventSponsorMutation,
} from "@/services/Api/eventSponsors";
import { toast } from "sonner";
import { EventSponsorType } from "@/types/eventSponsors";
import FileUploadField from "@/components/forms/fields/FileUploader";
import { CustomDialog } from "@/components/forms/customModal";

interface SponsorFormProps {
  operation: "add" | "edit";
  defaultValues?: EventSponsorType;
  eventId: string;
  eventSponsors: EventSponsorType[];
}

export default function SponsorForm({
  operation,
  defaultValues,
  eventId,
  eventSponsors,
}: SponsorFormProps) {
  console.log("I Rerenderd");
  const dialogRef = useRef<{ openDialog: () => void; closeDialog: () => void }>(
    null
  );
  const { data: sponsorsResponse, isLoading, isError } = useGetSponsorsQuery();
  const [addEventSponsor, { isLoading: isAdding }] =
    useAddEventSponsorMutation();
  const [updateEventSponsor, { isLoading: isUpdating }] =
    useUpdateEventSponsorMutation();

  const allSponsors = useMemo(() => {
    return (
      sponsorsResponse?.data?.sponsors.filter(
        (sponsor) => !eventSponsors.some((s) => s.sponsor.id === sponsor.id)
      ) ?? []
    );
  }, [sponsorsResponse?.data?.sponsors, eventSponsors]);
  // const allSponsors = sponsorsResponse?.data?.sponsors ?? [];
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [selectedSponsor, setSelectedSponsor] = useState<SponsorType>();

  useEffect(() => {
    if (operation === "add" && allSponsors.length > 0 && !selectedSponsor) {
      setIsSearchMode(true);
    }
  }, [operation, allSponsors.length, selectedSponsor]);

  const form = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorFormSchema(operation === "edit")),
    defaultValues: {
      name: defaultValues?.sponsor?.name || "",
      image: defaultValues?.sponsor?.image || "",
      isSeasonSponsor: defaultValues?.sponsor?.isSeasonSponsor || false,
      ...defaultValues,
    },
  });

  function handleSelectExistingSponsor(sponsor: SponsorType) {
    form.reset({
      name: sponsor.name,
      // url: sponsor.url,
      image: sponsor.image || "",
      isSeasonSponsor: sponsor.isSeasonSponsor || false,
    });
    setSelectedSponsor(sponsor);
    setIsSearchMode(false);
  }

  async function handleSubmit(data: SponsorFormValues) {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("isSeasonSponsor", String(data.isSeasonSponsor));

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      if (operation === "add") {
        if (selectedSponsor) {
          formData.append("sponsorId", selectedSponsor?.id.toString());
          await addEventSponsor({
            data: formData,
            eventId,
          });
        } else {
          await addEventSponsor({
            data: formData,
            eventId,
          }).unwrap();
        }
      } else if (operation === "edit") {
        await updateEventSponsor({
          data: formData,
          sponsorId: defaultValues?.id,
          eventId,
        }).unwrap();
      }
      toast.success(`sponsor ${operation}ed successfully`);
      form.reset();
      dialogRef.current?.closeDialog();
    } catch (error) {
      console.error("Error submitting sponsor:", error.message);
      toast.error(`Something wrong`, {
        description: error.message,
      });
    }
  }

  return (
    <CustomDialog
      ref={dialogRef}
      title={`${operation == "add" ? "Add" : "Edit"} Sponsor`}
      description={
        operation === "add"
          ? "Add a new sponsor to the event"
          : "Edit the sponsor details"
      }
      trigger={
        operation == "add" ? (
          <AddButton label="sponsor" disabled={isAdding} />
        ) : (
          <EditButton
            label="edit sponsor"
            asIcon={true}
            variant="ghost"
            disabled={isUpdating}
          />
        )
      }
      actionLabel={operation == "add" ? "Add" : "Update"}
      isLoading={isAdding || isUpdating}
      onSubmit={form.handleSubmit(handleSubmit)}
      hasFooter={false}
    >
      {isSearchMode ? (
        <div className="flex flex-col gap-5 justify-center text-center">
          <SponsorSearch
            sponsors={allSponsors}
            onSelectSponsor={handleSelectExistingSponsor}
          />
          <AddButton
            label="New Sponsor"
            className="mx-2"
            onClick={() => setIsSearchMode(false)}
          />
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter sponsor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sponsor Event Image</FormLabel>
                  <FileUploadField
                    field={field}
                    form={form}
                    fileUploadConfig={{
                      fileType: "image",
                      maxFiles: 1,
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isSeasonSponsor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Season Sponsor</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-between pt-4">
              {operation == "add" && allSponsors.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSearchMode(true)}
                  className="mr-auto"
                >
                  Back To Search
                </Button>
              )}
              <div className="flex items-center gap-3 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => dialogRef.current?.closeDialog()}
                >
                  Close
                </Button>
                <Button type="submit">
                  {operation == "edit" ? "Update Sponsor" : "Add Sponsor"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </CustomDialog>
  );
}
