import { ImageResponse } from "next/og";
import {
  GiBrokenHeartZone,
  GiDwarfFace,
  GiDwarfKing,
  GiSwordman,
  GiSwordTie,
} from "react-icons/gi";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

import { GiWoodAxe } from "react-icons/gi";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          //   background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          //   color: "black",
        }}
      >
        <GiSwordman
          style={{
            width: "100%",
            height: "100%",
            fontSize: "24px",
            color: "#e63946",
            fill: "yellow",
          }}
        />
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
