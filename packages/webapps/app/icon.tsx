import { ImageResponse } from "next/og";
import { GiBrokenHeartZone } from "react-icons/gi";

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
          fontSize: 24,
          background: "#3a3a3a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          color: "white",
        }}
      >
        Is
      </div>
    ),
    //   <GiWoodAxe className="size-100 text-2xl self-center justify-center text-center " />
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
