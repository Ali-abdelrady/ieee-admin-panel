import { SponsorType } from "@/types/sponsors";
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
import {
  useAddSponsorMutation,
  useGetSponsorsQuery,
  useUpdateSponsorMutation,
} from "@/services/Api/sponsors";
import { useMemo, useState } from "react";
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

interface SponsorFormProps {
  operation: "add" | "edit";
  defaultValues?: SponsorType;
}
export default function SponsorForm({
  operation,
  defaultValues,
}: SponsorFormProps) {
  // RTK
  const { data: sponsorsResponse, isLoading, isError } = useGetSponsorsQuery();
  const [addSponsor, { isLoading: isAdding }] = useAddSponsorMutation();
  const [updateSponsor, { isLoading: isUpdating }] = useUpdateSponsorMutation();

  // const allSponsors = sponsorsResponse?.data?.sponsors ??[];
  const allSponsors = [
    {
      id: "6",
      name: "CloudNova",
      url: "https://www.cloudnova.tech",
      image: "/sponsor1.png",
      isSeasonSponsor: true,
    },
    {
      id: "7",
      name: "GreenSpark",
      url: "https://www.greenspark.co",
      image: "https://assets.greenspark.co/logo.svg",
      isSeasonSponsor: false,
    },
    {
      id: "8",
      name: "AlphaStack",
      url: "https://www.alphastack.dev",
      image: "https://images.alphastack.dev/banner.png",
      isSeasonSponsor: true,
    },
    {
      id: "9",
      name: "DevX Labs",
      url: "https://www.devxlabs.com",
      image: "https://cdn.devxlabs.com/images/logo.jpg",
      isSeasonSponsor: false,
    },
    {
      id: "10",
      name: "PixelLogic",
      url: "https://www.pixellogic.ai",
      image: "https://cdn.pixellogic.ai/logo.png",
      isSeasonSponsor: false,
    },
  ];
  // States
  const [isSearchMode, setIsSearchMode] = useState<boolean>(
    operation == "add" && allSponsors?.length > 0
  );
  const [activeTab, setActiveTab] = useState<string>("details");
  // const [selectedSponsor, setSelectedSponsor] = useState<SponsorType>();
  // const parsedSocialLinks = defaultValues?.socialLinks?.map((item) => ({
  //   platform: item.icon.toLowerCase(), // or name.toLowerCase()
  //   url: item.url,
  // })) || [
  //   {
  //     platform: "",
  //     url: "",
  //   },
  // ];
  // console.log("parsed:", parsedSocialLinks);
  const form = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      url: defaultValues?.url || "",
      image: defaultValues?.image || "",
      isSeasonSponsor: defaultValues?.isSeasonSponsor || false,
    },
  });
  function handleSelectExistingSponsor(sponsor: SponsorType) {
    form.reset({
      name: sponsor.name,
      url: sponsor.url,
      image: sponsor.image || "",
      isSeasonSponsor: sponsor.isSeasonSponsor || false,
    });
    // setSelectedSponsor(sponsor);
    setIsSearchMode(false);
  }
  async function handleSubmit(data: SponsorFormValues) {}
  return (
    <Sheet>
      <SheetTrigger asChild>
        {operation == "add" ? (
          <AddButton label="sponsor" />
        ) : (
          <EditButton label="edit sponsor" asIcon={true} variant="ghost" />
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="capitalize ">{operation} Sponsor</SheetTitle>
        </SheetHeader>
        {isSearchMode ? (
          <div className="flex flex-col gap-5 justify-center  text-center">
            <SponsorSearch
              sponsors={allSponsors}
              onSelectSponsor={handleSelectExistingSponsor}
            />
            <AddButton label="New Sponsor" className="mx-2" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 p-4"
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
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Sponsor URL " {...field} />
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
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file); // Update field value with selected File
                          }
                        }}
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
              <SheetFooter className="flex flex-row justify-between p-0">
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
                <div className="flex items-center gap-3">
                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                  <Button type="submit">
                    {operation == "edit" ? "Update Sponsor" : "Add Sponsor"}
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}
