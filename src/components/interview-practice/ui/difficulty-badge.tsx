import React from "react";

interface DifficultyBadgeProps {
  level: "Beginner" | "Intermediate" | "Expert" | "Advanced";
  size?: "sm" | "md" | "lg";
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  level,
  size = "md",
}) => {
  const getBadgeStyles = () => {
    const baseStyles = {
      Beginner:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      Intermediate:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
      Expert:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      Advanced:
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    };

    return baseStyles[level] || baseStyles.Beginner;
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2 py-1 text-xs",
      lg: "px-3 py-1.5 text-sm",
    };

    return sizes[size];
  };

  return (
    <span
      className={`inline-block rounded-full font-medium ${getBadgeStyles()} ${getSizeStyles()}`}
    >
      {level}
    </span>
  );
};
