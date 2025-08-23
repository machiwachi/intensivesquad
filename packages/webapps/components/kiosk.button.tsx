import { Button } from "@/components/retroui/Button";
import Link from "next/link";
import { Heart } from "lucide-react";
export function KioskButton() {
  return (
    <Button variant="default" size="icon" className="bg-white rounded-full">
      <Link href="/leaderboard/kiosk">
        <Heart className="w-4 h-4 fill-red-500 stroke-0" />
      </Link>
    </Button>
  );
}
