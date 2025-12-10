import React from "react";
import { Button, ButtonProps, CircularProgress, useTheme, Theme } from "@mui/material";
import { darken } from "@mui/system";

interface PrimaryButtonProps extends Omit<ButtonProps, "color"> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  colored?: boolean;
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  loading?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  startIcon,
  endIcon,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  colored = false,
  variant = "contained",
  size = "medium",
  fullWidth = false,
  color = "primary",
  loading = false,
  ...rest
}) => {
  const theme: Theme = useTheme();

  const getButtonStyles = () => {
    const primaryMain = theme.palette.primary.main;
    const primaryContrast = theme.palette.primary.contrastText;
    const disabledColor = theme.palette.action?.disabled || "#ccc";

    return {
      backgroundColor: variant === "contained" ? primaryMain : "transparent",
      color: variant === "contained" ? primaryContrast : primaryMain,
      borderColor: variant === "outlined" ? primaryMain : "transparent",
      "&:hover": {
        backgroundColor:
          variant === "contained"
            ? darken(primaryMain, 0.2)
            : variant === "outlined"
            ? primaryMain + "08"
            : primaryMain + "08",
        borderColor: variant === "outlined" ? darken(primaryMain, 0.1) : "transparent",
      },
      "&:disabled": {
        backgroundColor: variant === "contained" ? disabledColor : "transparent",
        color: disabledColor,
        borderColor: variant === "outlined" ? disabledColor : "transparent",
      },
    };
  };

  const getProgressSize = () => {
    switch (size) {
      case "small":
        return 16;
      case "large":
        return 24;
      default:
        return 20;
    }
  };

  const getProgressColor = () => (variant === "contained" ? "inherit" : "primary");

  return (
    <Button
      variant={variant}
      startIcon={
        loading ? (
          <CircularProgress size={getProgressSize()} color={getProgressColor()} thickness={4} />
        ) : (
          startIcon
        )
      }
      endIcon={endIcon}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      size={size}
      fullWidth={fullWidth}
      color={colored ? undefined : color}
      className={`rounded-8 ${className}`}
      sx={getButtonStyles()}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
