import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SpeakerType } from "@/types/speakers";
import { useState } from "react";
interface SpeakerSearchProps {
  speakers: SpeakerType[];
  onSelectSpeaker: (speaker: SpeakerType) => void;
}
export default function SpeakerSearch({
  speakers,
  onSelectSpeaker,
}: SpeakerSearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredSpeakers = speakers.filter((speaker) =>
    speaker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log("speakers:", speakers);

  return (
    <div>
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search speakers..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />

        <CommandList>
          <CommandEmpty>No speakers found.</CommandEmpty>

          <CommandGroup heading="Available Speakers">
            {filteredSpeakers.map((speaker) => (
              <CommandItem
                key={speaker.id}
                value={speaker.name}
                onSelect={() => onSelectSpeaker(speaker)}
                className="cursor-pointer"
              >
                <div className="flex items-center space-x-3 py-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={speaker?.images[0]?.url}
                      alt={speaker.name}
                    />
                    <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-start">
                    <p className="font-medium">{speaker.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {speaker.title}
                    </p>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
