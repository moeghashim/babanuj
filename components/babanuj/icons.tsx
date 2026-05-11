import {
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  TruckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

type IconName =
  | "box"
  | "clipboard"
  | "globe"
  | "handshake"
  | "shield"
  | "truck";

const icons = {
  box: ArchiveBoxIcon,
  clipboard: ClipboardDocumentListIcon,
  globe: GlobeAltIcon,
  handshake: UserGroupIcon,
  shield: ShieldCheckIcon,
  truck: TruckIcon,
};

export function BabanujIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Icon = icons[name];

  return (
    <Icon
      className={clsx("h-8 w-8 stroke-[1.5] text-[#294621]", className)}
      aria-hidden="true"
    />
  );
}
