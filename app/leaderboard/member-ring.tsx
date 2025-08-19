import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Clan } from "@/lib/data";

export const MemberRing = ({ members }: { members: Clan["members"] }) => {
  const positions = [
    { top: "0%", left: "50%", transform: "translate(-50%, -50%)" },
    { top: "25%", left: "93.3%", transform: "translate(-50%, -50%)" },
    { top: "75%", left: "93.3%", transform: "translate(-50%, -50%)" },
    { top: "100%", left: "50%", transform: "translate(-50%, -50%)" },
    { top: "75%", left: "6.7%", transform: "translate(-50%, -50%)" },
    { top: "25%", left: "6.7%", transform: "translate(-50%, -50%)" },
  ];

  return (
    <div className="relative w-24 h-24 mx-auto">
      <div className="absolute inset-2 bg-primary/10 rounded-full border-2 border-primary/30 pixel-border" />
      {members.map((member, index) => (
        <div key={member.id} className="absolute" style={positions[index]}>
          <Avatar
            className={`w-8 h-8 border-2 pixel-border ${
              member.status === "eliminated"
                ? "eliminated border-muted"
                : "border-primary"
            }`}
          >
            <AvatarImage
              src={member.avatar || "/placeholder.svg"}
              alt={member.name}
            />
            <AvatarFallback className="pixel-font text-xs">
              {member.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  );
};
