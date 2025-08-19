"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession, signOut } from "next-auth/react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              SIWE 身份验证测试
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 钱包连接状态 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">钱包连接状态</h3>
              <div className="flex items-center gap-2">
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? "已连接" : "未连接"}
                </Badge>
                {address && (
                  <span className="text-sm font-mono">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                )}
              </div>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>

            {/* 身份验证状态 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">身份验证状态</h3>
              <div className="flex items-center gap-2">
                <Badge variant={session ? "default" : "secondary"}>
                  {status === "loading"
                    ? "加载中..."
                    : session
                    ? "已认证"
                    : "未认证"}
                </Badge>
                {session?.address && (
                  <span className="text-sm font-mono">
                    认证地址: {session.address.slice(0, 6)}...
                    {session.address.slice(-4)}
                  </span>
                )}
              </div>
            </div>

            {/* 会话信息 */}
            {session && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">会话信息</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="w-full"
                >
                  退出登录
                </Button>
              </div>
            )}

            {/* 说明文本 */}
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                🔐 这个页面演示了 SIWE (Sign-In with Ethereum) 身份验证流程：
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>首先连接你的钱包</li>
                <li>连接成功后，系统会提示你签名一条消息来验证身份</li>
                <li>签名成功后，你将获得一个认证会话</li>
                <li>会话包含你的钱包地址和其他验证信息</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 功能说明卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>功能特性</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">✅ 已实现</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• RainbowKit 钱包连接</li>
                  <li>• SIWE 消息签名</li>
                  <li>• NextAuth 会话管理</li>
                  <li>• 服务器端会话验证</li>
                  <li>• 类型安全的会话数据</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🎯 安全特性</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 加密签名验证</li>
                  <li>• 防重放攻击保护</li>
                  <li>• 域名验证</li>
                  <li>• 会话令牌安全</li>
                  <li>• 自动会话过期</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
