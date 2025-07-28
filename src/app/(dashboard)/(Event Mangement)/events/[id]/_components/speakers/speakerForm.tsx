import { SpeakerType } from "@/types/speakers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

import { useEffect, useMemo, useState } from "react";
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

interface SpeakerFormProps {
  operation: "add" | "edit";
  defaultValues?: EventSpeakerType;
  eventId: string;
}
export default function SpeakerForm({
  operation,
  defaultValues,
  eventId,
}: SpeakerFormProps) {
  // RTK
  const [addEventSpeaker, { isLoading: isAdding }] =
    useAddEventSpeakerMutation();
  const [addNewSpeaker] = useAddSpeakerMutation();
  const [updateEventSpeaker, { isLoading: isUpdating }] =
    useUpdateEventSpeakerMutation();
  const { data: speakersResponse, isLoading, isError } = useGetSpeakersQuery();
  const allSpeakers = speakersResponse?.data?.speakers ?? [];
  const [selectedSpeaker, setSelectedSpeaker] = useState<SpeakerType>();
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("details");

  useEffect(() => {
    if (operation === "add" && allSpeakers.length > 0) {
      setIsSearchMode(true);
    }
  }, [operation, allSpeakers]);
  const form = useForm<SpeakerFormValues>({
    resolver: zodResolver(speakerFormSchema(operation === "edit")),
    defaultValues: {
      name: defaultValues?.speaker?.name || "",
      title: defaultValues?.speaker?.title || "",
      image: defaultValues?.speaker?.image || "",
      socialLinks: parseSocialLinks(defaultValues?.speaker?.socialLinks),
      // socialLinks: parseSocialLinks([{ url: "", name: "", icon: "" }]),
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
    console.log("Enter Submition");
    try {
      const formData = new FormData();
      const formatedSocialLinks = data.socialLinks.map((item) => ({
        url: item.url,
        icon: item.platform,
        name: item.platform,
      }));
      // Append basic fields
      formData.append("name", data.name);
      formData.append("title", data.title);

      // Append image if it exists (and is a File object)
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      // Append social links as JSON string
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
        const eventId = defaultValues?.eventId; // Replace with actual eventId from props
        await updateEventSpeaker({
          data: formData,
          speakerId: defaultValues.speakerId,
          eventId,
        }).unwrap();
      }
      toast.success(`Speaker ${operation}ed successfully`);
      form.reset();
    } catch (error) {
      // Handle error (you might want to show a toast notification)
      console.error("Error submitting speaker:", error.message);
      toast.error(`Something wrong`, {
        description: error.message,
      });
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        {operation == "add" ? (
          <AddButton label="speaker" disabled={isAdding} />
        ) : (
          <EditButton
            label="edit speaker"
            asIcon={true}
            variant="ghost"
            disabled={isUpdating}
          />
        )}
      </SheetTrigger>
      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle className="capitalize ">{operation} Speaker</SheetTitle>
        </SheetHeader>
        {isSearchMode ? (
          <div className="flex flex-col gap-5 justify-center  text-center">
            <SpeakerSearch
              speakers={allSpeakers}
              onSelectSpeaker={handleSelectExistingSpeaker}
            />
            <AddButton
              label="New Speaker"
              className="mx-2"
              onClick={() => {
                setIsSearchMode(false);
              }}
            />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-1 w-full ">
              <TabsTrigger value="details">Details</TabsTrigger>
              {/* <TabsTrigger value="social">Social Links</TabsTrigger> */}
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <TabsContent value="details" className="space-y-4 p-4">
                  {/* {selectedSpeaker && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={selectedSpeaker.image || undefined}
                            alt={selectedSpeaker.name}
                          />
                          <AvatarFallback>
                            {selectedSpeaker.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedSpeaker.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedSpeaker.title}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Existing Speaker</Badge>
                    </div>
                  )} */}

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
                          <Input
                            placeholder="Job title or profession"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => {
                      // Get current value
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
                </TabsContent>
                <SheetFooter className="flex flex-row">
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
                  <div className="flex items-center gap-3">
                    <SheetClose asChild>
                      <Button variant="outline">Close</Button>
                    </SheetClose>
                    <Button
                      type="submit"
                      disabled={isAdding || isUpdating}
                      isLoading={isAdding || isUpdating}
                    >
                      {operation == "edit" ? "Update Speaker" : "Add Speaker"}
                    </Button>
                  </div>
                </SheetFooter>
              </form>
            </Form>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
}
