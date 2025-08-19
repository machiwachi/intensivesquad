"use client";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function Kiosk() {
  return (
    <div className="flex items-center justify-center py-48 gap-2">
      给我一点点
      <Button
        variant="outline"
        size="icon"
        className="pixel-border pixel-font rounded-full size-14"
      >
        <Heart className="size-10 fill-red-500 stroke-0" />
      </Button>
    </div>
  );
}
