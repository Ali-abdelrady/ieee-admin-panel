"use client";
import { PartnerType } from "@/types/sponsors";
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
import { toast } from "sonner";
import FileUploadField from "@/components/forms/fields/FileUploader";
import { CustomDialog } from "@/components/forms/customModal";

interface SponsorFormProps {
  operation: "add" | "edit";
  defaultValues?: PartnerType;
  partners: PartnerType[];
}

export default function SponsorForm({
  operation,
  defaultValues,
  partners,
}: SponsorFormProps) {
  console.log("I Rerenderd");
  const dialogRef = useRef<{ openDialog: () => void; closeDialog: () => void }>(
    null
  );
  const { data: sponsorsResponse, isLoading, isError } = useGetSponsorsQuery();
  const [addSponsor, { isLoading: isAdding }] = useAddSponsorMutation();
  const [updateSponsor, { isLoading: isUpdating }] = useUpdateSponsorMutation();

  const allSponsors = useMemo(() => {
    return (
      sponsorsResponse?.data?.sponsors.filter(
        (sponsor) => !partners.some((s) => s.id === sponsor.id)
      ) ?? []
    );
  }, [sponsorsResponse?.data?.sponsors, partners]);
  // const allSponsors = sponsorsResponse?.data?.sponsors ?? [];
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [selectedSponsor, setSelectedSponsor] = useState<PartnerType>();

  // useEffect(() => {
  //   if (operation === "add" && allSponsors.length > 0 && !selectedSponsor) {
  //     setIsSearchMode(true);
  //   }
  // }, [operation, allSponsors.length, selectedSponsor]);

  const form = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorFormSchema(operation === "edit")),
    defaultValues: {
      name: defaultValues?.name || "",
      image: defaultValues?.image || "",
      isSeasonPartner: defaultValues?.isSeasonPartner || false,
      isSeasonSponsor: defaultValues?.isSeasonSponsor || false,
      id: defaultValues?.id,
    },
  });

  function handleSelectExistingSponsor(sponsor: PartnerType) {
    form.reset({
      name: sponsor.name,
      image: sponsor.image || "",
      isSeasonPartner: sponsor.isSeasonPartner || false,
      isSeasonSponsor: defaultValues?.isSeasonSponsor || false,
    });
    setSelectedSponsor(sponsor);
    setIsSearchMode(false);
  }

  async function handleSubmit(data: SponsorFormValues) {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("isSeasonPartner", String(data.isSeasonPartner));
      formData.append("isSeasonSponsor", String(data.isSeasonSponsor));

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      if (operation === "add") {
        if (selectedSponsor) {
          formData.append("sponsorId", selectedSponsor?.id.toString());
          await addSponsor(formData).unwrap();
        } else {
          await addSponsor(formData).unwrap();
        }
      } else if (operation === "edit") {
        await updateSponsor({
          data: formData,
          sponsorId: defaultValues?.id.toString(),
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
      trigger={
        operation == "add" ? (
          <AddButton label="Sponsor" disabled={isAdding} />
        ) : (
          <EditButton
            label="edit Sponsor"
            asIcon={true}
            variant="outline"
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
            label="New Partner"
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
                    <Input placeholder="Enter sponsor  name" {...field} />
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
                  <FormLabel>Image</FormLabel>
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
              name="isSeasonPartner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Season Partner</FormLabel>
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
                <Button
                  type="submit"
                  disabled={isAdding || isUpdating}
                  isLoading={isAdding || isUpdating}
                >
                  {operation === "edit"
                    ? isUpdating
                      ? "Updating..."
                      : "Update Sponsor"
                    : isAdding
                    ? "Adding..."
                    : "Add Sponsor"}{" "}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </CustomDialog>
  );
}
