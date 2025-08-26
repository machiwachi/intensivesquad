import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// 图片元数据
export const alt =
  "残酷小队 | IntensiveSquad - 为高强度共学社群打造游戏化链上激励系统";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// 图片生成
export default async function Image() {
  // 加载logo图片
  let logoData: string | null = null;
  try {
    const logoPath = join(process.cwd(), "/public/pixel-archer.png");
    console.log(logoPath);
    const logoFile = await readFile(logoPath);
    logoData = `data:image/png;base64,${logoFile.toString("base64")}`;
  } catch (error) {
    console.warn("Logo file not found");
  }

  const title = "残酷小队";
  const description = "为高强度共学社群打造游戏化链上激励系统";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage: "linear-gradient(135deg, #a5d7e8 0%, #fff 100%)",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* 主要内容 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
        >
          {/* Logo */}
          {logoData && (
            <img
              src={logoData}
              alt="logo"
              width={120}
              height={120}
              style={{
                filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
              }}
            />
          )}

          {/* 文本内容 */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <h1
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color: "#222",
                margin: 0,
                // textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "24px",
                color: "#a1a1aa",
                margin: 0,
                maxWidth: "600px",
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* 品牌标识 */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "30px",
            color: "#71717a",
            fontSize: "18px",
          }}
        >
          IntensiveSquad
        </div>

        {/* 网格背景装饰 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />
      </div>
    ),
    // ImageResponse 选项
    {
      ...size,
    }
  );
}
