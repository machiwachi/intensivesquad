"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";

export function CreateClanDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { address: walletAddress, isConnected: isWalletConnected } =
    useAccount();

  const [newClanForm, setNewClanForm] = useState({
    name: "",
    flag: "",
    description: "",
    initialLeverage: "1.0",
  });

  const handleCreateClan = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isWalletConnected) return;

    // In a real app, this would create the clan on the blockchain
    console.log("[v0] Creating new clan:", newClanForm);

    // Reset form and close dialog
    setNewClanForm({
      name: "",
      flag: "",
      description: "",
      initialLeverage: "1.0",
    });
    onOpenChange(false);

    // Show success feedback (in a real app, this would be after blockchain confirmation)
    alert(`Clan "${newClanForm.name}" created successfully!`);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg pixel-border">
        <DialogHeader>
          <DialogTitle className="pixel-font text-2xl flex items-center gap-2">
            <Plus className="w-6 h-6" />
            创建新部落
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateClan} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clan-name" className="pixel-font">
              部落名称
            </Label>
            <Input
              id="clan-name"
              value={newClanForm.name}
              onChange={(e) =>
                setNewClanForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="输入部落名称"
              className="pixel-border pixel-font"
              required
              maxLength={30}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clan-flag" className="pixel-font">
              部落旗帜（Emoji）
            </Label>
            <Input
              id="clan-flag"
              value={newClanForm.flag}
              onChange={(e) =>
                setNewClanForm((prev) => ({ ...prev, flag: e.target.value }))
              }
              placeholder="🏴‍☠️"
              className="pixel-border pixel-font text-center text-2xl"
              required
              maxLength={2}
            />
            <p className="text-xs text-muted-foreground pixel-font">
              选择一个表情符号作为部落旗帜
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clan-description" className="pixel-font">
              描述（可选）
            </Label>
            <Textarea
              id="clan-description"
              value={newClanForm.description}
              onChange={(e) =>
                setNewClanForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="描述你们部落的使命与价值观..."
              className="pixel-border pixel-font resize-none"
              rows={3}
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initial-leverage" className="pixel-font">
              初始杠杆
            </Label>
            <Select
              value={newClanForm.initialLeverage}
              onValueChange={(value) =>
                setNewClanForm((prev) => ({
                  ...prev,
                  initialLeverage: value,
                }))
              }
            >
              <SelectTrigger className="pixel-border pixel-font">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.0">1.0x（保守）</SelectItem>
                <SelectItem value="1.5">1.5x（均衡）</SelectItem>
                <SelectItem value="2.0">2.0x（激进）</SelectItem>
                <SelectItem value="2.5">2.5x（高风险）</SelectItem>
                <SelectItem value="3.0">3.0x（最大）</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground pixel-font">
              杠杆越高 = 奖励越高，但被淘汰的风险也越大
            </p>
          </div>

          <div className="bg-muted/20 p-3 rounded pixel-border">
            <h4 className="pixel-font font-bold text-sm mb-2">创建成本</h4>
            <div className="flex items-center justify-between text-sm pixel-font">
              <span>平台费用：</span>
              <span className="font-bold">0.1 ETH</span>
            </div>
            <div className="flex items-center justify-between text-sm pixel-font">
              <span>初始金库存入：</span>
              <span className="font-bold">0.5 ETH</span>
            </div>
            <hr className="my-2 border-muted" />
            <div className="flex items-center justify-between text-sm pixel-font font-bold">
              <span>合计：</span>
              <span>0.6 ETH</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 pixel-border pixel-font"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={!newClanForm.name || !newClanForm.flag}
              className="flex-1 pixel-border pixel-font"
            >
              创建部落
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
