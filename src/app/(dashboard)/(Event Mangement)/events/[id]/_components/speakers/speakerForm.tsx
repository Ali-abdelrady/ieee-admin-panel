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
import {
  useAddSpeakerMutation,
  useGetSpeakersQuery,
  useUpdateSpeakerMutation,
} from "@/services/Api/speakers";
import { useMemo, useState } from "react";
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

interface SpeakerFormProps {
  operation: "add" | "edit";
  defaultValues?: SpeakerType;
}
export default function SpeakerForm({
  operation,
  defaultValues,
}: SpeakerFormProps) {
  // RTK
  const { data: speakersResponse, isLoading, isError } = useGetSpeakersQuery();
  const [addSpeaker, { isLoading: isAdding }] = useAddSpeakerMutation();
  const [updateSpeaker, { isLoading: isUpdating }] = useUpdateSpeakerMutation();

  // const allSpeakers = speakersResponse?.data?.speakers ??[];
  const allSpeakers = [
    {
      id: 1,
      name: "Ali Mohamed",
      title: "Lead Engineer",
      job: "Software Developer",
      company: "Tech Innovations Inc.",
      bio: "Ali is a passionate software engineer with 5+ years of experience in full-stack development, focusing on modern web technologies and scalable architecture.",
      socialLinks: [
        {
          name: "LinkedIn",
          icon: "LinkedIn",
          url: "https://linkedin.com/in/alimohamed",
        },
        {
          name: "Twitter",
          icon: "Twitter",
          url: "https://twitter.com/alimohameddev",
        },
      ],
      image: "https://via.placeholder.com/150?text=Ali",
    },
    {
      id: 2,
      name: "Sara Mostafa",
      title: "UI/UX Designer",
      job: "Product Designer",
      company: "Creative Minds Studio",
      bio: "Sara has over 6 years of experience in designing user-centric interfaces and creating seamless digital experiences for web and mobile platforms.",
      socialLinks: [
        {
          name: "Dribbble",
          icon: "Dribbble",
          url: "https://dribbble.com/saramostafa",
        },
        {
          name: "LinkedIn",
          icon: "LinkedIn",
          url: "https://linkedin.com/in/saramostafa",
        },
      ],
      image: "https://via.placeholder.com/150?text=Sara",
    },
    {
      id: 3,
      name: "Omar Khaled",
      title: "AI Researcher",
      job: "Machine Learning Engineer",
      company: "NeuralNet Labs",
      bio: "Omar specializes in deep learning and computer vision, with publications in top AI conferences and a strong background in algorithm optimization.",
      socialLinks: [
        {
          name: "GitHub",
          icon: "GitHub",
          url: "https://github.com/omarkhaled",
        },
        {
          name: "LinkedIn",
          icon: "LinkedIn",
          url: "https://linkedin.com/in/omarkhaled",
        },
      ],
      image: "https://via.placeholder.com/150?text=Omar",
    },
    {
      id: 4,
      name: "Laila Nabil",
      title: "Project Manager",
      job: "Agile Coach",
      company: "Digital Flow",
      bio: "Laila has led over 20 agile teams, helping organizations adopt agile practices and improve delivery pipelines with a people-first mindset.",
      socialLinks: [
        {
          name: "LinkedIn",
          icon: "LinkedIn",
          url: "https://linkedin.com/in/lailanabil",
        },
        {
          name: "Twitter",
          icon: "Twitter",
          url: "https://twitter.com/lailanabilpm",
        },
      ],
      image: "https://via.placeholder.com/150?text=Laila",
    },
  ];
  // States
  const [isSearchMode, setIsSearchMode] = useState<boolean>(
    operation == "add" && allSpeakers?.length > 0
  );
  const [activeTab, setActiveTab] = useState<string>("details");
  // const [selectedSpeaker, setSelectedSpeaker] = useState<SpeakerType>();
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
  const form = useForm<SpeakerFormValues>({
    resolver: zodResolver(speakerFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      title: defaultValues?.title || "",
      image: defaultValues?.image || "",
      socialLinks: parseSocialLinks(defaultValues?.socialLinks),
    },
  });
  function handleSelectExistingSpeaker(speaker: SpeakerType) {
    form.reset({
      name: speaker.name,
      title: speaker.title,
      socialLinks: parseSocialLinks(speaker.socialLinks),
      image: speaker.image || "",
    });
    // setSelectedSpeaker(speaker);
    setIsSearchMode(false);
  }
  async function handleSubmit(data: SpeakerFormValues) {}
  return (
    <Sheet>
      <SheetTrigger asChild>
        {operation == "add" ? (
          <AddButton label="speaker" />
        ) : (
          <EditButton label="edit speaker" asIcon={true} variant="ghost" />
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="capitalize ">{operation} Speaker</SheetTitle>
        </SheetHeader>
        {isSearchMode ? (
          <div className="flex flex-col gap-5 justify-center  text-center">
            <SpeakerSearch
              speakers={allSpeakers}
              onSelectSpeaker={handleSelectExistingSpeaker}
            />
            <AddButton label="New Speaker" className="mx-2" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full ">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Speaker Event Image</FormLabel>
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
                    name="socialLinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Links</FormLabel>
                        <FormControl>
                          <SocialLinksManager
                            name="socialLinks"
                            // value={field.value}
                            // defaultValues={field.value}
                            // onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="social" className="space-y-4 p-4">
                  <FormField
                    control={form.control}
                    name="socialLinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Links</FormLabel>
                        <FormControl>
                          <SocialLinksManager name="socialLinks" />
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
                    <Button type="submit">
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
