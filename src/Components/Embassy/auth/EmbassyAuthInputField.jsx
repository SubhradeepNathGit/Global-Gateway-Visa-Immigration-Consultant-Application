import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const EmbassyAuthInputField = React.forwardRef(
  (
    { label, error, helperText, showPassword, disable = false, setShowPassword, ...inputProps },
    ref
  ) => {
    const isPassword = inputProps.name === "password";

    return (
      <div className="w-full">
        {/* LABEL — OUTSIDE INPUT */}
        <label
          htmlFor={inputProps.name}
          className={`block mb-1 text-sm ${error ? "text-red-500" : "text-white/80"
            }`}
        >
          {label}
        </label>

        {/* INPUT WRAPPER */}
        <div className="relative">
          <input
            ref={ref} disabled={disable}
            id={inputProps.name}
            type={
              isPassword ? showPassword ? "text" : "password" : inputProps.type || "text"
            }
            className={`w-full px-4 py-3 rounded-md bg-transparent text-white border ${disable ? 'cursor-not-allowed' : ''}
              ${error
                ? "border-red-500"
                : "border-white/50 focus:border-white"
              }`}
            {...inputProps}
          />

          {/* PASSWORD TOGGLE */}
          {isPassword && setShowPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          )}
        </div>

        {/* ERROR TEXT */}
        {helperText && (
          <p className="text-red-500 text-xs mt-1 ml-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

EmbassyAuthInputField.displayName = "InputField";
