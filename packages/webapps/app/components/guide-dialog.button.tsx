"use client";

import { useState } from "react";
import { FaQuestion } from "react-icons/fa6";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/retroui/Dialog";
import { Button } from "@/components/retroui/Button";
import { Badge } from "@/components/retroui/Badge";
import {
  UserPlus,
  Users,
  Heart,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  ArrowRightLeft,
  Globe,
  Wallet,
  ArrowRightIcon,
} from "lucide-react";
import posthog from "posthog-js";
import { HelpCircleIcon } from "lucide-react";

const GUIDE_STEPS = [
  {
    id: 1,
    title: "登入",
    description: "连接您的钱包开始体验",
    icon: UserPlus,
    details: (
      <div className="flex items-center">
        点击右上角
        <Button className="mx-2 flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          连接钱包
        </Button>
        ( <span className="text-muted-foreground">这个是假的，点不动</span>)
      </div>
    ),
    color: "text-blue-500",
  },
  {
    id: 2,
    title: "加入团队",
    description: "选择一个团队或创建新团队",
    icon: Users,
    details:
      "浏览下方的团队列表，点击任意团队卡片查看详情并申请加入，或者创建自己的团队。",
    color: "text-green-500",
  },
  {
    id: 3,
    title: "每日打卡",
    description: "点击 Kiosk 按钮进行签到",
    icon: Heart,
    details: (
      <p>
        点击
        <Button
          variant="outline"
          size="icon"
          className="inline-block mx-2 bg-white rounded-full"
        >
          <Heart className="w-4 h-4 fill-red-500 stroke-0" />
        </Button>
        后，您会看到一个弹窗，在弹窗内{" "}
        <Button
          variant="outline"
          size="icon"
          className="inline-block mx-2 bg-white rounded-full"
        >
          <Heart className="w-4 h-4 fill-red-500 stroke-0" />
        </Button>{" "}
        即可完成签到。
      </p>
    ),
    color: "text-red-500",
  },
  {
    id: 4,
    title: "观察变化",
    description: "查看团队 IDO 和 WEDO 变化",
    icon: TrendingUp,
    details:
      "打卡后观察团队详情页面，您会看到团队的 IDO 代币和 WEDO 代币数量增加，排名也可能提升。",
    color: "text-purple-500",
  },
  {
    id: 5,
    title: "转化代币",
    description: "将 WEDO 转化为 IDO",
    icon: ArrowRightLeft,
    details: (
      <div className="">
        <p>
          还是在详情页面
          <div className="inline-block">
            <Button size="sm" className="gap-1 mx-2">
              <ArrowRightIcon className="w-4 h-4" />
              提取
            </Button>
          </div>
          将 WEDO 转化为 IDO。
        </p>
        <p>团队金库会清空，每个队员都能获得转化后的 IDO。</p>
        <p>
          在个人IDO余额旁点击
          <div className="inline-block">
            <Button size="sm" className="gap-1 mx-2">
              <ArrowRightIcon className="w-4 h-4" />
              领取
            </Button>
          </div>
          将待领取的IDO领到你的钱包内
        </p>
      </div>
    ),
    color: "text-orange-500",
  },
  {
    id: 6,
    title: "体验同步",
    description: "感受全局消息同步",
    icon: Globe,
    details:
      "打开另一个浏览器窗口或无痕模式，连接不同的钱包地址。当任意一个窗口中有人进行打卡、加入团队等操作时，观察两个窗口的排行榜、代币数量、团队信息如何实时同步更新，体验我们的实时数据同步功能。",
    color: "text-cyan-500",
  },
];

export function GuideDialogButton() {
  const [currentStep, setCurrentStep] = useState(0);
  const [open, setOpen] = useState(false);

  const handleNext = () => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      posthog.capture("guide_step_next", {
        current_step: currentStep + 1,
        next_step: currentStep + 2,
      });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      posthog.capture("guide_step_previous", {
        current_step: currentStep + 1,
        previous_step: currentStep,
      });
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    posthog.capture("guide_step_jump", {
      from_step: currentStep + 1,
      to_step: stepIndex + 1,
    });
  };

  const handleClose = () => {
    setOpen(false);
    posthog.capture("guide_dialog_closed", {
      completed_steps: currentStep + 1,
      total_steps: GUIDE_STEPS.length,
      final_step: GUIDE_STEPS[currentStep]?.title || "unknown",
    });
  };

  const currentStepData = GUIDE_STEPS[currentStep];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-white rounded-full "
        >
          {/* <HelpCircleIcon className="w-4 h-4 stroke-1" /> */}
          <FaQuestion className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-xl font-bold text-center">体验指南</div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Current Step Content */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-white inline-block text-sm outline-white"
                >
                  {currentStep + 1} / {GUIDE_STEPS.length}
                </Badge>
                {/* <IconComponent className="w-8 h-8 text-muted" /> */}
                <h3 className="text-xl font-semibold flex-1">
                  {currentStepData.title}
                </h3>

                <Badge variant="outline" className="inline-block text-sm">
                  {currentStep + 1} / {GUIDE_STEPS.length}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {currentStepData.description}
              </p>
            </div>

            <div className="bg-retro-lime p-4 text-left">
              <p className="text-sm leading-relaxed">
                {currentStepData.details}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              上一步
            </Button>

            <div className="flex items-center gap-2">
              {currentStep === GUIDE_STEPS.length - 1 ? (
                <Button
                  onClick={handleClose}
                  className="flex items-center gap-2"
                >
                  开始体验
                  <CheckCircle className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  下一步
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
