import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function CustomToolTip({
  word,
  sliceEnd,
}: {
  word: string;
  sliceEnd: number;
}) {
  const shortened = word.slice(0, sliceEnd) + "...";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="max-w-[250px] cursor-pointer text-sm text-muted-foreground">
          {shortened}
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{word}</p>
      </TooltipContent>
    </Tooltip>
  );
}
