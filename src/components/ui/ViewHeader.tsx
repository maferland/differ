import { IconButton } from "./IconButton";
import { ChevronLeft } from "./icons";

interface ViewHeaderProps {
  projectName: string;
  onBack: () => void;
  backTitle?: string;
  children?: React.ReactNode;
}

export function ViewHeader({ projectName, onBack, backTitle = "Back", children }: ViewHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <IconButton onClick={onBack} title={backTitle}>
        <ChevronLeft />
      </IconButton>
      {projectName !== "default" && (
        <span className="text-sm text-zinc-500">{projectName}</span>
      )}
      {children}
    </div>
  );
}
