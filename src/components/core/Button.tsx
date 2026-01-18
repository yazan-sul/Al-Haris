import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      className={`${className} ${
        isLoading || disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
