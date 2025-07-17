import DeleteDialog from "@/components/forms/deleteDialog";
import { speakerColumns } from "./speakersCoulmns";
import { SpeakerType } from "@/types/speakers";
import { useState } from "react";
import { Plus, User, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "@/components/table/dataTable";
import Image from "next/image";
import { ImageCell } from "@/components/table/imageCell";
import SpeakerForm from "./speakerForm";

export default function SpeakersTab({ eventId }: { eventId: string }) {
  const [speakers, setSpeakers] = useState<SpeakerType[]>([
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
      image: "https://via.placeholder.com/150", // placeholder image or a real image URL
    },
    {
      id: 2,
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
      image: "https://via.placeholder.com/150", // placeholder image or a real image URL
    },
    {
      id: 3,
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
      image: "https://via.placeholder.com/150", // placeholder image or a real image URL
    },
    {
      id: 4,
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
      image: "https://via.placeholder.com/150", // placeholder image or a real image URL
    },
  ]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Speakers</h3>
        <SpeakerForm operation="add" />
      </div>

      {speakers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {speakers.map((speaker) => (
            <Card
              key={speaker.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="flex items-center space-x-4">
                <div className="min-w-18 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src="/images/speaker2.jpg"
                    alt={speaker.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">{speaker.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {speaker.title}
                  </p>
                  {/* {speaker.image && speaker.image.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {speaker.image.length} images available
                    </p>
                  )} */}
                </div>
                <div className="flex space-x-1">
                  <SpeakerForm operation="edit" defaultValues={speaker} />
                  <DeleteDialog
                    rows={speaker}
                    deleteFn={() => {
                      return true;
                    }}
                    isLoading={false}
                    getId={(speaker: SpeakerType) => speaker.id}
                    trigger={
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Speakers Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add speakers to your event to showcase who will be presenting.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Speaker
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
