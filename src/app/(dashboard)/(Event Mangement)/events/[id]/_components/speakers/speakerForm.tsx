import { SpeakerType } from "@/types/speakers";
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
import { useEffect, useMemo, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SpeakerSearch from "./SpeakerSearch";
import { useForm } from "react-hook-form";
import { speakerFormSchema, SpeakerFormValues } from "@/validations/speakers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import SocialLinksManager, {
  parseSocialLinks,
} from "@/components/forms/SocialLinksManger";
import DynamicArrayField from "@/components/forms/DynamicArrayFields";
import {
  useAddEventSpeakerMutation,
  useUpdateEventSpeakerMutation,
} from "@/services/Api/EventSpeakers";
import {
  useAddSpeakerMutation,
  useGetSpeakersQuery,
} from "@/services/Api/speakers";
import { EventSpeakerType } from "@/types/EventSpeakers";
import { toast } from "sonner";
import FileUploadField from "@/components/forms/fields/FileUploader";
import Loader from "@/components/Loader";
import { CustomDialog } from "@/components/forms/customModal";

interface SpeakerFormProps {
  operation: "add" | "edit";
  defaultValues?: EventSpeakerType;
  eventId: string;
  eventSpeakers: EventSpeakerType[];
}

export default function SpeakerForm({
  operation,
  defaultValues,
  eventId,
  eventSpeakers,
}: SpeakerFormProps) {
  const dialogRef = useRef<{ openDialog: () => void; closeDialog: () => void }>(
    null
  );
  const [addEventSpeaker, { isLoading: isAdding }] =
    useAddEventSpeakerMutation();
  const [addNewSpeaker] = useAddSpeakerMutation();
  const [updateEventSpeaker, { isLoading: isUpdating }] =
    useUpdateEventSpeakerMutation();
  const { data: speakersResponse, isLoading, isError } = useGetSpeakersQuery();

  const allSpeakers = useMemo(() => {
    return (
      speakersResponse?.data?.speakers.filter(
        (speaker) => !eventSpeakers.some((s) => s.speaker.id === speaker.id)
      ) ?? []
    );
  }, [speakersResponse?.data?.speakers, eventSpeakers]);

  const [selectedSpeaker, setSelectedSpeaker] = useState<SpeakerType>();
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("details");

  useEffect(() => {
    if (operation === "add" && allSpeakers.length > 0 && !selectedSpeaker) {
      setIsSearchMode(true);
    }
  }, [operation, allSpeakers.length, selectedSpeaker]);
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues?.speaker?.name || "",
        title: defaultValues?.speaker?.title || "",
        image: defaultValues?.speaker?.image || "",
        socialLinks: parseSocialLinks(defaultValues?.speaker?.socialLinks),
        ...defaultValues,
      });
    }
  }, [defaultValues]);
  const form = useForm<SpeakerFormValues>({
    resolver: zodResolver(speakerFormSchema(operation === "edit")),
    defaultValues: {
      name: defaultValues?.speaker?.name || "",
      title: defaultValues?.speaker?.title || "",
      image: defaultValues?.speaker?.image || "",
      socialLinks: parseSocialLinks(defaultValues?.speaker?.socialLinks),
      ...defaultValues,
    },
  });

  function handleSelectExistingSpeaker(speaker: SpeakerType) {
    form.reset({
      name: speaker.name,
      title: speaker.title,
      socialLinks: parseSocialLinks(speaker.socialLinks),
      image: speaker.image || "",
    });
    setSelectedSpeaker(speaker);
    setIsSearchMode(false);
  }

  async function handleSubmit(data: SpeakerFormValues) {
    try {
      const formData = new FormData();
      const formatedSocialLinks = data.socialLinks.map((item) => ({
        url: item.url,
        icon: item.platform,
        name: item.platform,
      }));

      formData.append("name", data.name);
      formData.append("title", data.title);

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      if (data.socialLinks && data.socialLinks.length > 0) {
        formData.append("socialLinks", JSON.stringify(formatedSocialLinks));
      }

      if (operation === "add") {
        if (selectedSpeaker) {
          formData.append("speakerId", selectedSpeaker?.id.toString());
          await addEventSpeaker({
            data: formData,
            eventId,
          });
        } else {
          await addEventSpeaker({
            data: formData,
            eventId,
          }).unwrap();
        }
      } else if (operation === "edit" && defaultValues?.speaker?.id) {
        await updateEventSpeaker({
          data: formData,
          speakerId: defaultValues.speakerId,
          eventId,
        }).unwrap();
      }

      toast.success(`Speaker ${operation}ed successfully`);
      form.reset();
      dialogRef.current?.closeDialog();
    } catch (error) {
      console.error("Error submitting speaker:", error.message);
      toast.error(`Something wrong`, {
        description: error.message,
      });
    }
  }

  if (isLoading) {
    return <Loader error={isError} />;
  }

  return (
    <CustomDialog
      ref={dialogRef}
      title={`${operation == "add" ? "Add" : "Edit"} Speaker`}
      description={
        operation === "add"
          ? "Add a new speaker to the event"
          : "Edit the speaker details"
      }
      trigger={
        operation == "add" ? (
          <AddButton label="speaker" disabled={isAdding} />
        ) : (
          <EditButton
            label="edit speaker"
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
          <SpeakerSearch
            speakers={allSpeakers}
            onSelectSpeaker={handleSelectExistingSpeaker}
          />
          <AddButton
            label="New Speaker"
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
                    <Input placeholder="Enter speaker name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Job title or profession" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => {
                const value = field.value;
                return (
                  <FormItem>
                    <FormLabel>Speaker Event Image</FormLabel>
                    {value && typeof value === "string" && (
                      <div className="mb-2">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={value}
                            alt="Current speaker image"
                          />
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <FileUploadField
                      field={field}
                      form={form}
                      fileUploadConfig={{
                        fileType: "image",
                        maxFiles: 1,
                      }}
                    />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="socialLinks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Links</FormLabel>
                  <FormControl>
                    <DynamicArrayField
                      itemName="socialLink"
                      name="socialLinks"
                      minItems={1}
                      fieldsConfig={[
                        { name: "url", label: "Url", type: "text" },
                        {
                          name: "platform",
                          label: "Platform",
                          type: "select",
                          options: [
                            { value: "facebook", label: "Facebook" },
                            { value: "twitter", label: "Twitter" },
                            { value: "instagram", label: "Instagram" },
                            { value: "linkedin", label: "LinkedIn" },
                            { value: "behance", label: "Behance" },
                          ],
                        },
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row justify-between pt-4">
              {operation == "add" && allSpeakers.length > 0 && (
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
                <Button
                  type="submit"
                  isLoading={isUpdating || isAdding}
                  disabled={isUpdating || isAdding}
                >
                  {operation == "edit"
                    ? isUpdating
                      ? "Updating..."
                      : "Update Sponsor"
                    : isAdding
                    ? "Add..."
                    : "Add Sponsor"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </CustomDialog>
  );
}
