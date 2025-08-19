"use client";

import type React from "react";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Trophy,
  Zap,
  Shield,
  Crown,
  Star,
  UserPlus,
  Coins,
  Gift,
  Plus,
  BarChart3,
  Skull,
} from "lucide-react";

const SCORE_TOKEN = {
  symbol: "STUDY",
  name: "StudyPoints",
  decimals: 18,
  address: "0x1234...5678",
};

const VAULT_TOKEN = {
  symbol: "STUDY",
  name: "StudyToken",
  decimals: 18,
  address: "0xabcd...efgh",
};

const mockUsers = [
  { id: 1, name: "Alex", score: 3420, clanId: 1, avatar: "/pixel-warrior.png" },
  { id: 2, name: "Sam", score: 3200, clanId: 1, avatar: "/pixel-mage.png" },
  {
    id: 7,
    name: "Taylor",
    score: 3100,
    clanId: 2,
    avatar: "/placeholder-4jpab.png",
  },
  {
    id: 13,
    name: "Phoenix",
    score: 2980,
    clanId: 3,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Jordan",
    score: 2850,
    clanId: 1,
    avatar: "/pixel-archer.png",
  },
  {
    id: 8,
    name: "Blake",
    score: 2750,
    clanId: 2,
    avatar: "/pixel-warrior.png",
  },
  {
    id: 19,
    name: "Echo",
    score: 2650,
    clanId: 4,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 25,
    name: "Orion",
    score: 2580,
    clanId: 5,
    avatar: "/pixel-knight.png",
  },
  { id: 4, name: "Casey", score: 2450, clanId: 1, avatar: "/pixel-knight.png" },
  {
    id: 14,
    name: "Sage",
    score: 2380,
    clanId: 3,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  { id: 9, name: "Avery", score: 2320, clanId: 2, avatar: "/pixel-shield.png" },
  {
    id: 20,
    name: "Storm",
    score: 2280,
    clanId: 4,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 31,
    name: "Sage",
    score: 2150,
    clanId: 6,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  { id: 5, name: "Riley", score: 2100, clanId: 1, avatar: "/pixel-rogue.png" },
  {
    id: 26,
    name: "Vega",
    score: 2050,
    clanId: 5,
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

// Mock data for clans
const mockClans = [
  {
    id: 1,
    name: "Code Crusaders",
    flag: "⚔️",
    rank: 1,
    previousRank: 2,
    totalScore: 15420,
    remainingMembers: 5,
    totalMembers: 6,
    leverage: 2.4,
    dividendVault: {
      totalBalance: 2450.75,
      userClaimable: 408.46,
      lastDistribution: "2 days ago",
      totalDistributed: 12340.5,
    },
    members: [
      { id: 1, name: "Alex", avatar: "/pixel-warrior.png", status: "active" },
      { id: 2, name: "Sam", avatar: "/pixel-mage.png", status: "active" },
      { id: 3, name: "Jordan", avatar: "/pixel-archer.png", status: "active" },
      { id: 4, name: "Casey", avatar: "/pixel-knight.png", status: "active" },
      { id: 5, name: "Riley", avatar: "/pixel-rogue.png", status: "active" },
      {
        id: 6,
        name: "Morgan",
        avatar: "/pixel-paladin.png",
        status: "eliminated",
      },
    ],
    scoreHistory: [12000, 13500, 14200, 15420],
    activities: [
      {
        user: "Alex",
        action: "Completed Math Quiz",
        points: 150,
        time: "2 hours ago",
      },
      {
        user: "Sam",
        action: "Study Session",
        points: 200,
        time: "4 hours ago",
      },
      {
        user: "Jordan",
        action: "Flashcard Review",
        points: 100,
        time: "6 hours ago",
      },
    ],
  },
  {
    id: 2,
    name: "Study Spartans",
    flag: "🛡️",
    rank: 2,
    previousRank: 1,
    totalScore: 14890,
    remainingMembers: 4,
    totalMembers: 6,
    leverage: 1.8,
    dividendVault: {
      totalBalance: 1890.25,
      userClaimable: 0,
      lastDistribution: "1 day ago",
      totalDistributed: 8750.3,
    },
    members: [
      {
        id: 7,
        name: "Taylor",
        avatar: "/placeholder-4jpab.png",
        status: "active",
      },
      { id: 8, name: "Blake", avatar: "/pixel-warrior.png", status: "active" },
      { id: 9, name: "Avery", avatar: "/pixel-shield.png", status: "active" },
      { id: 10, name: "Quinn", avatar: "/pixel-spear.png", status: "active" },
      { id: 11, name: "Sage", avatar: "/pixel-helm.png", status: "eliminated" },
      {
        id: 12,
        name: "River",
        avatar: "/pixel-armor.png",
        status: "eliminated",
      },
    ],
    scoreHistory: [15200, 14800, 14500, 14890],
    activities: [
      {
        user: "Taylor",
        action: "Physics Problem Set",
        points: 180,
        time: "1 hour ago",
      },
      {
        user: "Blake",
        action: "Literature Essay",
        points: 220,
        time: "3 hours ago",
      },
    ],
  },
  {
    id: 3,
    name: "Brain Busters",
    flag: "🧠",
    rank: 3,
    previousRank: 4,
    totalScore: 13750,
    remainingMembers: 6,
    totalMembers: 6,
    leverage: 3.2,
    dividendVault: {
      totalBalance: 3250.8,
      userClaimable: 0,
      lastDistribution: "3 days ago",
      totalDistributed: 15670.9,
    },
    members: [
      {
        id: 13,
        name: "Phoenix",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
      {
        id: 14,
        name: "Sage",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
      {
        id: 15,
        name: "Nova",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
      {
        id: 16,
        name: "Zara",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
      {
        id: 17,
        name: "Kai",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
      {
        id: 18,
        name: "Luna",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
    ],
    scoreHistory: [12800, 13200, 13400, 13750],
    activities: [
      {
        user: "Phoenix",
        action: "Chemistry Lab",
        points: 190,
        time: "30 minutes ago",
      },
      {
        user: "Nova",
        action: "History Timeline",
        points: 160,
        time: "2 hours ago",
      },
    ],
  },
  {
    id: 4,
    name: "Quiz Questers",
    flag: "🏆",
    rank: 4,
    previousRank: 3,
    totalScore: 12980,
    remainingMembers: 3,
    totalMembers: 6,
    leverage: 1.5,
    dividendVault: {
      totalBalance: 980.45,
      userClaimable: 0,
      lastDistribution: "5 days ago",
      totalDistributed: 4520.75,
    },
    members: [
      {
        id: 19,
        name: "Echo",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
      {
        id: 20,
        name: "Storm",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
      {
        id: 21,
        name: "Blaze",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
      {
        id: 22,
        name: "Frost",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "eliminated",
      },
      {
        id: 23,
        name: "Ember",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "eliminated",
      },
      {
        id: 24,
        name: "Mist",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "eliminated",
      },
    ],
    scoreHistory: [13500, 13200, 12800, 12980],
    activities: [
      { user: "Echo", action: "Biology Quiz", points: 140, time: "1 hour ago" },
      {
        user: "Storm",
        action: "Vocabulary Test",
        points: 120,
        time: "5 hours ago",
      },
    ],
  },
  {
    id: 5,
    name: "Knowledge Knights",
    flag: "⚡",
    rank: 5,
    previousRank: 6,
    totalScore: 11650,
    remainingMembers: 4,
    totalMembers: 6,
    leverage: 2.1,
    dividendVault: {
      totalBalance: 1650.3,
      userClaimable: 0,
      lastDistribution: "4 days ago",
      totalDistributed: 7890.25,
    },
    members: [
      { id: 25, name: "Orion", avatar: "/pixel-knight.png", status: "active" },
      {
        id: 26,
        name: "Vega",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
      {
        id: 27,
        name: "Atlas",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
      {
        id: 28,
        name: "Iris",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
      {
        id: 29,
        name: "Zephyr",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "eliminated",
      },
      {
        id: 30,
        name: "Cosmos",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "eliminated",
      },
    ],
    scoreHistory: [10800, 11200, 11400, 11650],
    activities: [
      {
        user: "Orion",
        action: "Algebra Practice",
        points: 130,
        time: "3 hours ago",
      },
      {
        user: "Vega",
        action: "Science Fair Project",
        points: 250,
        time: "7 hours ago",
      },
    ],
  },
  {
    id: 6,
    name: "Wisdom Warriors",
    flag: "📚",
    rank: 6,
    previousRank: 5,
    totalScore: 10420,
    remainingMembers: 2,
    totalMembers: 6,
    leverage: 1.2,
    dividendVault: {
      totalBalance: 420.15,
      userClaimable: 0,
      lastDistribution: "6 days ago",
      totalDistributed: 2340.8,
    },
    members: [
      {
        id: 31,
        name: "Sage",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
      {
        id: 32,
        name: "Raven",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
      },
      {
        id: 33,
        name: "Willow",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "eliminated",
      },
      {
        id: 34,
        name: "Cedar",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "eliminated",
      },
      {
        id: 35,
        name: "Rowan",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "eliminated",
      },
      {
        id: 36,
        name: "Aspen",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "eliminated",
      },
    ],
    scoreHistory: [11200, 10800, 10500, 10420],
    activities: [
      {
        user: "Sage",
        action: "Reading Comprehension",
        points: 110,
        time: "4 hours ago",
      },
      {
        user: "Raven",
        action: "Essay Writing",
        points: 180,
        time: "8 hours ago",
      },
    ],
  },
];

export default function ClansLeaderboard() {
  const { address: walletAddress, isConnected: isWalletConnected } =
    useAccount();
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [selectedClan, setSelectedClan] = useState<
    (typeof mockClans)[0] | null
  >(null);
  const [userClanId, setUserClanId] = useState<number | null>(1); // Mock: user is in Code Crusaders
  const [joinedClans, setJoinedClans] = useState<Set<number>>(new Set([1])); // Mock: already joined clan 1
  const [claimedRewards, setClaimedRewards] = useState<Set<number>>(new Set()); // Track claimed rewards
  const [showCreateClan, setShowCreateClan] = useState(false);
  const [showRankings, setShowRankings] = useState(false);
  const [newClanForm, setNewClanForm] = useState({
    name: "",
    flag: "",
    description: "",
    initialLeverage: "1.0",
  });

  const totalClans = mockClans.length;
  const avgScore = Math.round(
    mockClans.reduce((sum, clan) => sum + clan.totalScore, 0) / totalClans
  );

  const formatTokenAmount = (
    amount: number,
    token: typeof SCORE_TOKEN | typeof VAULT_TOKEN
  ) => {
    const formatted = (amount / Math.pow(10, token.decimals)).toFixed(2);
    return `${formatted} ${token.symbol}`;
  };

  const handleJoinClan = (clanId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening clan details
    if (isWalletConnected && !joinedClans.has(clanId)) {
      setJoinedClans((prev) => new Set([...prev, clanId]));
      // If user doesn't have a primary clan, make this their primary
      if (!userClanId) {
        setUserClanId(clanId);
      }
    }
  };

  const handleClaimRewards = (clanId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening clan details
    if (isWalletConnected && joinedClans.has(clanId)) {
      setClaimedRewards((prev) => new Set([...prev, clanId]));
      // In a real app, this would trigger a blockchain transaction
      console.log(`[v0] Claiming rewards for clan ${clanId}`);
    }
  };

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
    setShowCreateClan(false);

    // Show success feedback (in a real app, this would be after blockchain confirmation)
    alert(`Clan "${newClanForm.name}" created successfully!`);
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Star className="w-5 h-5 text-amber-600" />;
      default:
        return <Shield className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankChange = (current: number, previous: number) => {
    if (current < previous) {
      return <TrendingUp className="w-4 h-4 text-accent" />;
    } else if (current > previous) {
      return <TrendingDown className="w-4 h-4 text-destructive" />;
    }
    return null;
  };

  const MemberRing = ({
    members,
  }: {
    members: (typeof mockClans)[0]["members"];
  }) => {
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

  const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <div className="flex items-end h-8 gap-1">
        {data.map((value, index) => (
          <div
            key={index}
            className="bg-primary/60 w-2 pixel-border"
            style={{
              height: `${((value - min) / range) * 100}%`,
              minHeight: "2px",
            }}
          />
        ))}
      </div>
    );
  };

  const UserRankingsChart = () => {
    const sortedUsers = [...mockUsers].sort((a, b) => b.score - a.score);
    const maxScore = Math.max(...sortedUsers.map((u) => u.score));

    return (
      <div className="space-y-3">
        <h3 className="pixel-font font-bold text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Top Users by {SCORE_TOKEN.symbol} Score
        </h3>
        <div className="space-y-2">
          {sortedUsers.slice(0, 10).map((user, index) => {
            const clan = mockClans.find((c) => c.id === user.clanId);
            const barWidth = (user.score / maxScore) * 100;

            return (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 bg-muted/20 rounded pixel-border"
              >
                <div className="flex items-center gap-2 w-20">
                  <span className="pixel-font text-sm font-bold">
                    #{index + 1}
                  </span>
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback className="pixel-font text-xs">
                      {user.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="pixel-font text-sm font-medium">
                        {user.name}
                      </span>
                      <span className="pixel-font text-xs text-muted-foreground">
                        {clan?.flag} {clan?.name}
                      </span>
                    </div>
                    <span className="pixel-font text-sm font-bold text-primary">
                      {formatTokenAmount(
                        user.score * Math.pow(10, SCORE_TOKEN.decimals),
                        SCORE_TOKEN
                      )}
                    </span>
                  </div>

                  <div className="w-full bg-muted/30 h-3 rounded pixel-border overflow-hidden">
                    <div
                      className="h-full bg-primary/80 transition-all duration-500 pixel-border"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ClanRankingsChart = () => {
    const sortedClans = [...mockClans].sort(
      (a, b) => b.totalScore - a.totalScore
    );
    const maxScore = Math.max(...sortedClans.map((c) => c.totalScore));

    return (
      <div className="space-y-3">
        <h3 className="pixel-font font-bold text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Clan Rankings by Total {SCORE_TOKEN.symbol}
        </h3>
        <div className="space-y-2">
          {sortedClans.map((clan, index) => {
            const barWidth = (clan.totalScore / maxScore) * 100;

            return (
              <div
                key={clan.id}
                className="flex items-center gap-3 p-3 bg-muted/20 rounded pixel-border"
              >
                <div className="flex items-center gap-2 w-16">
                  {getRankIcon(index + 1)}
                  <span className="pixel-font text-sm font-bold">
                    #{index + 1}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{clan.flag}</span>
                      <span className="pixel-font text-sm font-medium">
                        {clan.name}
                      </span>
                      <Badge variant="outline" className="pixel-font text-xs">
                        {clan.remainingMembers}/{clan.totalMembers} active
                      </Badge>
                    </div>
                    <span className="pixel-font text-sm font-bold text-primary">
                      {formatTokenAmount(
                        clan.totalScore * Math.pow(10, SCORE_TOKEN.decimals),
                        SCORE_TOKEN
                      )}
                    </span>
                  </div>

                  <div className="w-full bg-muted/30 h-4 rounded pixel-border overflow-hidden">
                    <div
                      className="h-full bg-accent/80 transition-all duration-500 pixel-border"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const isUserClan = (clanId: number) => {
    return userClanId === clanId;
  };

  const canJoinClan = (clanId: number) => {
    return isWalletConnected && !joinedClans.has(clanId);
  };

  const canClaimRewards = (clanId: number) => {
    const clan = mockClans.find((c) => c.id === clanId);
    return (
      isWalletConnected &&
      joinedClans.has(clanId) &&
      clan &&
      clan.dividendVault.userClaimable > 0 &&
      !claimedRewards.has(clanId)
    );
  };

  const DividendVaultWidget = ({
    clan,
    isCompact = false,
  }: {
    clan: (typeof mockClans)[0];
    isCompact?: boolean;
  }) => {
    const hasClaimableRewards = canClaimRewards(clan.id);
    const isMember = joinedClans.has(clan.id);

    if (isCompact) {
      return (
        <div className="flex items-center justify-between p-2 bg-muted/20 rounded pixel-border">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="pixel-font text-xs text-muted-foreground">
              Vault:
            </span>
            <span className="pixel-font text-xs font-bold">
              {formatTokenAmount(
                clan.dividendVault.totalBalance *
                  Math.pow(10, VAULT_TOKEN.decimals),
                VAULT_TOKEN
              )}
            </span>
          </div>
          {hasClaimableRewards && (
            <Button
              size="sm"
              onClick={(e) => handleClaimRewards(clan.id, e)}
              className="pixel-border pixel-font text-xs h-6 px-2"
            >
              <Gift className="w-3 h-3 mr-1" />
              Claim
            </Button>
          )}
          {isMember &&
            clan.dividendVault.userClaimable > 0 &&
            claimedRewards.has(clan.id) && (
              <Badge variant="outline" className="pixel-font text-xs">
                Claimed
              </Badge>
            )}
        </div>
      );
    }

    return (
      <Card className="pixel-border">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            <h4 className="pixel-font font-bold">Dividend Vault</h4>
            <Badge variant="outline" className="pixel-font text-xs">
              {VAULT_TOKEN.symbol}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="pixel-font text-xs text-muted-foreground">
                Total Balance
              </p>
              <p className="pixel-font text-lg font-bold text-primary pixel-font">
                {formatTokenAmount(
                  clan.dividendVault.totalBalance *
                    Math.pow(10, VAULT_TOKEN.decimals),
                  VAULT_TOKEN
                )}
              </p>
            </div>
            <div>
              <p className="pixel-font text-xs text-muted-foreground">
                Your Share
              </p>
              <p className="pixel-font text-lg font-bold text-accent pixel-font">
                {isMember
                  ? formatTokenAmount(
                      clan.dividendVault.userClaimable *
                        Math.pow(10, VAULT_TOKEN.decimals),
                      VAULT_TOKEN
                    )
                  : `0.00 ${VAULT_TOKEN.symbol}`}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="pixel-font text-sm font-bold text-muted-foreground">
              Member Contributions
            </h5>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {clan.members.map((member, index) => {
                const contribution = Math.random() * 50 + 10; // Mock contribution amount
                const isCurrentUser = member.name === "You" && isMember;
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded pixel-border text-xs ${
                      isCurrentUser
                        ? "bg-primary/10 border-primary"
                        : "bg-muted/10"
                    } ${
                      member.status === "eliminated"
                        ? "opacity-50 grayscale"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
                      <span
                        className={`pixel-font ${
                          isCurrentUser ? "font-bold text-primary" : ""
                        }`}
                      >
                        {member.name}
                      </span>
                      {member.status === "eliminated" && (
                        <Badge variant="outline" className="pixel-font text-xs">
                          Eliminated
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="pixel-font font-bold">
                        {formatTokenAmount(
                          contribution * Math.pow(10, VAULT_TOKEN.decimals),
                          VAULT_TOKEN
                        )}
                      </p>
                      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                          style={{ width: `${(contribution / 60) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-xs pixel-font text-muted-foreground">
            <p>Last distribution: {clan.dividendVault.lastDistribution}</p>
            <p>
              Total distributed:{" "}
              {formatTokenAmount(
                clan.dividendVault.totalDistributed *
                  Math.pow(10, VAULT_TOKEN.decimals),
                VAULT_TOKEN
              )}
            </p>
          </div>

          {hasClaimableRewards && (
            <Button
              onClick={(e) => handleClaimRewards(clan.id, e)}
              className="w-full pixel-border pixel-font"
            >
              <Gift className="w-4 h-4 mr-2" />
              Claim{" "}
              {formatTokenAmount(
                clan.dividendVault.userClaimable *
                  Math.pow(10, VAULT_TOKEN.decimals),
                VAULT_TOKEN
              )}
            </Button>
          )}

          {isMember &&
            clan.dividendVault.userClaimable > 0 &&
            claimedRewards.has(clan.id) && (
              <div className="text-center">
                <Badge variant="outline" className="pixel-font">
                  Rewards Claimed Successfully
                </Badge>
              </div>
            )}

          {!isMember && (
            <div className="text-center text-xs pixel-font text-muted-foreground">
              Join clan to earn dividend rewards
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold pixel-font text-primary mb-2">
              残酷学分！
            </h1>
            <p className="text-muted-foreground pixel-font">为了部落！⛺️</p>
          </div>

          <div className="flex items-center gap-4">
            <Select
              value={selectedTimeframe}
              onValueChange={setSelectedTimeframe}
            >
              <SelectTrigger className="w-48 pixel-border pixel-font">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => setShowRankings(true)}
              variant="outline"
              className="pixel-border pixel-font flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Rankings
            </Button>

            {isWalletConnected && (
              <Button
                onClick={() => setShowCreateClan(true)}
                variant="outline"
                className="pixel-border pixel-font flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Clan
              </Button>
            )}

            <div className="pixel-border rounded-lg overflow-hidden">
              <ConnectButton
                chainStatus="icon"
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="pixel-border">
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold pixel-font">{totalClans}</p>
                <p className="text-sm text-muted-foreground pixel-font">
                  Total Clans
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="pixel-border">
            <CardContent className="p-4 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold pixel-font">
                  {
                    formatTokenAmount(
                      avgScore * Math.pow(10, SCORE_TOKEN.decimals),
                      SCORE_TOKEN
                    ).split(" ")[0]
                  }
                </p>
                <p className="text-sm text-muted-foreground pixel-font">
                  Avg {SCORE_TOKEN.symbol}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="pixel-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold pixel-font">
                      {mockClans.reduce(
                        (sum, clan) => sum + clan.remainingMembers,
                        0
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground pixel-font">
                      Active Warriors
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Skull className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold pixel-font text-red-500">
                      {mockClans.reduce(
                        (sum, clan) =>
                          sum + (clan.totalMembers - clan.remainingMembers),
                        0
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground pixel-font">
                      Eliminated
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini retention chart */}
              <div className="mt-4 pt-3 border-t border-muted">
                <p className="text-xs text-muted-foreground pixel-font mb-2">
                  Daily Retention (Last 7 Days)
                </p>
                <div className="flex items-end gap-1 h-8">
                  {[95, 89, 84, 78, 71, 65, 58].map((percentage, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-cyan-500 to-emerald-400 rounded-sm pixel-border"
                        style={{ height: `${(percentage / 100) * 100}%` }}
                      />
                      <span className="text-xs pixel-font text-muted-foreground mt-1">
                        {percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Clans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockClans.map((clan) => (
          <Card
            key={clan.id}
            className={`pixel-border hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group ${
              isUserClan(clan.id)
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={() => setSelectedClan(clan)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{clan.flag}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold pixel-font text-lg group-hover:text-primary transition-colors">
                        {clan.name}
                      </h3>
                      {isUserClan(clan.id) && (
                        <Badge
                          variant="default"
                          className="pixel-font text-xs bg-primary"
                        >
                          MY CLAN
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getRankIcon(clan.rank)}
                      <span className="pixel-font text-sm">
                        Rank #{clan.rank}
                      </span>
                      {getRankChange(clan.rank, clan.previousRank)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="pixel-font text-xs">
                    {
                      formatTokenAmount(
                        clan.totalScore * Math.pow(10, SCORE_TOKEN.decimals),
                        SCORE_TOKEN
                      ).split(" ")[0]
                    }
                  </Badge>
                  {canJoinClan(clan.id) && (
                    <Button
                      size="sm"
                      onClick={(e) => handleJoinClan(clan.id, e)}
                      className="pixel-border pixel-font text-xs"
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Join
                    </Button>
                  )}
                  {joinedClans.has(clan.id) && !isUserClan(clan.id) && (
                    <Badge variant="outline" className="pixel-font text-xs">
                      Joined
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <MemberRing members={clan.members} />

              <div className="flex justify-between items-center text-sm">
                <div className="pixel-font">
                  <span className="text-primary font-bold">
                    {clan.remainingMembers}
                  </span>
                  <span className="text-muted-foreground">
                    /{clan.totalMembers}
                  </span>
                  <span className="ml-2 text-muted-foreground">remaining</span>
                </div>
                <div className="pixel-font">
                  <span className="text-accent font-bold">
                    L{clan.leverage}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground pixel-font">
                  Score Trend
                </span>
                <Sparkline data={clan.scoreHistory} />
              </div>

              {/* Dividend Vault Widget */}
              <DividendVaultWidget clan={clan} isCompact={true} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showRankings} onOpenChange={setShowRankings}>
        <DialogContent className="max-w-4xl pixel-border max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="pixel-font text-2xl flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Leaderboard Rankings
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserRankingsChart />
            <ClanRankingsChart />
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Clan Dialog */}
      <Dialog open={showCreateClan} onOpenChange={setShowCreateClan}>
        <DialogContent className="max-w-lg pixel-border">
          <DialogHeader>
            <DialogTitle className="pixel-font text-2xl flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Create New Clan
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateClan} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clan-name" className="pixel-font">
                Clan Name
              </Label>
              <Input
                id="clan-name"
                value={newClanForm.name}
                onChange={(e) =>
                  setNewClanForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter clan name"
                className="pixel-border pixel-font"
                required
                maxLength={30}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clan-flag" className="pixel-font">
                Clan Flag (Emoji)
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
                Choose an emoji to represent your clan
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clan-description" className="pixel-font">
                Description (Optional)
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
                placeholder="Describe your clan's mission and values..."
                className="pixel-border pixel-font resize-none"
                rows={3}
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial-leverage" className="pixel-font">
                Initial Leverage
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
                  <SelectItem value="1.0">1.0x (Conservative)</SelectItem>
                  <SelectItem value="1.5">1.5x (Balanced)</SelectItem>
                  <SelectItem value="2.0">2.0x (Aggressive)</SelectItem>
                  <SelectItem value="2.5">2.5x (High Risk)</SelectItem>
                  <SelectItem value="3.0">3.0x (Maximum)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground pixel-font">
                Higher leverage = higher rewards but more risk of elimination
              </p>
            </div>

            <div className="bg-muted/20 p-3 rounded pixel-border">
              <h4 className="pixel-font font-bold text-sm mb-2">
                Creation Cost
              </h4>
              <div className="flex items-center justify-between text-sm pixel-font">
                <span>Platform Fee:</span>
                <span className="font-bold">0.1 ETH</span>
              </div>
              <div className="flex items-center justify-between text-sm pixel-font">
                <span>Initial Vault Deposit:</span>
                <span className="font-bold">0.5 ETH</span>
              </div>
              <hr className="my-2 border-muted" />
              <div className="flex items-center justify-between text-sm pixel-font font-bold">
                <span>Total:</span>
                <span>0.6 ETH</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateClan(false)}
                className="flex-1 pixel-border pixel-font"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newClanForm.name || !newClanForm.flag}
                className="flex-1 pixel-border pixel-font"
              >
                Create Clan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Clan Detail Dialog */}
      <Dialog open={!!selectedClan} onOpenChange={() => setSelectedClan(null)}>
        <DialogContent className="max-w-2xl pixel-border">
          {selectedClan && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 pixel-font text-2xl">
                  <span className="text-3xl">{selectedClan.flag}</span>
                  {selectedClan.name}
                  <Badge variant="secondary" className="pixel-font">
                    Rank #{selectedClan.rank}
                  </Badge>
                  {isUserClan(selectedClan.id) && (
                    <Badge variant="default" className="pixel-font bg-primary">
                      MY CLAN
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>

              {canJoinClan(selectedClan.id) && (
                <Button
                  onClick={(e) => handleJoinClan(selectedClan.id, e)}
                  className="w-full pixel-border pixel-font"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join {selectedClan.name}
                </Button>
              )}

              <div className="space-y-6">
                {/* Dividend Vault Widget */}
                <DividendVaultWidget clan={selectedClan} />

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="pixel-border">
                    <CardContent className="p-4">
                      <h4 className="pixel-font font-bold mb-2">
                        Total {SCORE_TOKEN.symbol}
                      </h4>
                      <p className="text-2xl font-bold text-primary pixel-font">
                        {formatTokenAmount(
                          selectedClan.totalScore *
                            Math.pow(10, SCORE_TOKEN.decimals),
                          SCORE_TOKEN
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="pixel-border">
                    <CardContent className="p-4">
                      <h4 className="pixel-font font-bold mb-2">Leverage</h4>
                      <p className="text-2xl font-bold text-accent pixel-font">
                        {selectedClan.leverage}x
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Members */}
                <div>
                  <h4 className="pixel-font font-bold mb-3">Clan Members</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedClan.members.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center gap-3 p-2 rounded pixel-border ${
                          member.status === "eliminated"
                            ? "eliminated bg-muted/50"
                            : "bg-card"
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                          />
                          <AvatarFallback className="pixel-font text-xs">
                            {member.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="pixel-font text-sm">
                          {member.name}
                        </span>
                        <Badge
                          variant={
                            member.status === "active" ? "default" : "secondary"
                          }
                          className="pixel-font text-xs ml-auto"
                        >
                          {member.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h4 className="pixel-font font-bold mb-3">
                    Recent Activities
                  </h4>
                  <div className="space-y-2">
                    {selectedClan.activities.map((activity, index) => {
                      const dividendContribution = activity.points * 0.1;
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-muted/30 rounded pixel-border"
                          onClick={() =>
                            window.open(
                              "https://sepolia.etherscan.io/tx/0x7509932b2c6e522df9757ea82a269548fce2a7f2eb4bf1856553a6c387fab02b",
                              "_blank"
                            )
                          }
                        >
                          <div>
                            <p className="pixel-font text-sm font-medium">
                              {activity.user}
                            </p>
                            <p className="pixel-font text-xs text-muted-foreground">
                              {activity.action}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="pixel-font text-sm font-bold text-accent">
                              +
                              {formatTokenAmount(
                                activity.points *
                                  Math.pow(10, SCORE_TOKEN.decimals),
                                SCORE_TOKEN
                              )}
                            </p>
                            <p className="pixel-font text-xs text-muted-foreground">
                              Vault: +
                              {formatTokenAmount(
                                dividendContribution *
                                  Math.pow(10, VAULT_TOKEN.decimals),
                                VAULT_TOKEN
                              )}
                            </p>
                            <p className="pixel-font text-xs text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
