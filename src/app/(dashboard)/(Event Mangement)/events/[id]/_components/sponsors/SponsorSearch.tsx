import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SponsorType } from "@/types/sponsors";
import { useState } from "react";
interface SponsorSearchProps {
  sponsors: SponsorType[];
  onSelectSponsor: (sponsor: SponsorType) => void;
}
export default function SponsorSearch({
  sponsors,
  onSelectSponsor,
}: SponsorSearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredSponsors = sponsors.filter((sponsor) =>
    sponsor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log("sponsors:", sponsors);

  return (
    <div>
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search sponsors..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />

        <CommandList>
          <CommandEmpty>No sponsors found.</CommandEmpty>

          <CommandGroup heading="Available Sponsors">
            {filteredSponsors.map((sponsor) => (
              <CommandItem
                key={sponsor.id}
                value={sponsor.name}
                onSelect={() => onSelectSponsor(sponsor)}
                className="cursor-pointer"
              >
                <div className="flex items-center space-x-3 py-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={sponsor.image || undefined}
                      alt={sponsor.name}
                    />
                    <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{sponsor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {sponsor.name}
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
