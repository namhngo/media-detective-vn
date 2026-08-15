import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg viewBox="0 0 512 512" width="180" height="180">
        <rect width="512" height="512" rx="104" fill="#f7c948" />
        <path d="M164 124h184l-24 76H188z" fill="#0a0e1a" />
        <rect x="198" y="190" width="116" height="190" rx="28" fill="#0a0e1a" />
        <path d="M224 380h64" stroke="#f7c948" strokeWidth="18" strokeLinecap="round" />
        <path d="M196 212h120" stroke="#f7c948" strokeWidth="12" strokeLinecap="round" opacity=".8" />
        <path d="M166 124 112 64M346 124l54-60" stroke="#0a0e1a" strokeWidth="18" strokeLinecap="round" opacity=".35" />
      </svg>
    ),
    { ...size },
  );
}
