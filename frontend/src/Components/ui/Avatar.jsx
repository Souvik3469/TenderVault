import React from "react";

/** Simple avatar — no Chakra UI dependency */
const Avatar = ({ name = "", src, size = "md", className = "" }) => {
  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover flex-shrink-0 ${sizes[size] ?? sizes.md} ${className}`}
      />
    );
  }

  return (
    <span
      className={`rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center flex-shrink-0 ${sizes[size] ?? sizes.md} ${className}`}
    >
      {initials || "?"}
    </span>
  );
};

export default Avatar;
