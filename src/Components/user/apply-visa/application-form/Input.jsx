import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

const Input = React.forwardRef(({ label, id, type = "text", register, errors, icon: Icon, placeholder, description,
  required = false, disabled = false, touched = false, ...rest }, ref) => {

  const hasError = errors?.[id];
  const isValid = touched && !hasError;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-800 mb-2"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-600 mb-2">{description}</p>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}

        {/* Input Field */}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={type === "email" ? "email" : type === "tel" ? "tel" : id?.includes("name") ? "name" : "off"}
          ref={ref} {...rest} {...(register ? register(id) : {})}
          className={` w-full 
              ${Icon ? "pl-11" : "pl-4"} 
              ${isValid || hasError ? "pr-11" : "pr-4"}
              py-3 sm:py-3.5 border-2 rounded-xl transition-all duration-300 outline-none text-base ${hasError
              ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-100 shadow-sm" : isValid
                ? "border-green-300 bg-green-50/30 focus:border-green-500 focus:ring-4 focus:ring-green-100 shadow-sm"
                : "border-gray-300 bg-white focus:border-red-500 focus:ring-4 focus:ring-red-50 hover:border-gray-400 shadow-sm hover:shadow-md"
            } ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""} placeholder:text-gray-400 text-gray-900 font-medium `}
          aria-invalid={hasError ? "true" : "false"} />

        {/* Validation Icon */}
        {(isValid || hasError) && !disabled && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 animate-scaleIn">
            {hasError ? (
              <AlertCircle size={20} className="text-red-500" strokeWidth={2.5} />
            ) : (
              <CheckCircle size={20} className="text-green-500" strokeWidth={2.5} />
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <div id={`${id}-error`} className="flex items-center gap-1.5 mt-2 text-sm text-red-600 animate-slideDown" >
          <AlertCircle size={14} className="flex-shrink-0" strokeWidth={2.5} />
          <span>{errors[id].message}</span>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        /* Remove autofill yellow background */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px white inset;
          -webkit-text-fill-color: #111827;
          transition: background-color 5000s ease-in-out 0s;
        }
        
        /* Number input arrows removal for better mobile UX */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
);

export default Input;