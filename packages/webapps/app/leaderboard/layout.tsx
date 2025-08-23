import Header from "@/components/header";

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background bg-[url('/bg-leaderboard.png')] bg-cover bg-center p-4 lg:p-8 gap-2">
      {/* Header */}
      <Header />
      {children}
    </div>
  );
}
