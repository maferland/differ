import { ImageFile } from "@/lib/types";
import { ViewHeader } from "@/components/ui/ViewHeader";
import { SideBadge } from "@/components/ui/SideBadge";

interface SingleImageViewProps {
  file: ImageFile;
  side: "left" | "right";
  projectName: string;
  onClose: () => void;
}

export function SingleImageView({ file, side, projectName, onClose }: SingleImageViewProps) {
  return (
    <div className="flex h-screen flex-col gap-2 p-4">
      <ViewHeader projectName={projectName} onBack={onClose} backTitle="Back to list (Esc)">
        <span className="ml-auto flex items-center gap-2 text-sm text-zinc-400">
          <SideBadge side={side} />
          {file.name}
        </span>
      </ViewHeader>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-lg border border-zinc-800 bg-zinc-950">
        <img src={file.objectUrl} alt={file.name} className="max-h-full max-w-full object-contain" />
      </div>
    </div>
  );
}
