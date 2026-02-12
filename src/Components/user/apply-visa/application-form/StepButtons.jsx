import React from "react";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";

export default function StepButtons({
  onBack,
  onNext,
  nextLabel = "Continue",
  backLabel = "Back",
  showBack = true,
  isLoading = false,
  disabled = false,
  nextIcon = true,
  backIcon = true,
  variant = "red",
  isSubmit = false
}) {

  const getButtonStyles = (type) => {
    if (type === 'back') {
      return `
        px-6 py-3.5
        border-2 border-gray-300 
        text-gray-700 font-semibold
        rounded-xl 
        bg-white
        hover:bg-gray-50 hover:border-gray-400 hover:shadow-md
        active:scale-[0.98]
        transition-all duration-300
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
        shadow-sm
      `;
    }

    // Next/Submit button styles based on variant
    const variantStyles = {
      red: `
        bg-gradient-to-r from-red-600 to-red-500
        text-white 
        hover:from-red-700 hover:to-red-600 
        shadow-lg hover:shadow-xl hover:shadow-red-200
      `,
      gradient: `
        bg-gradient-to-r from-red-600 via-red-500 to-orange-500
        text-white 
        hover:from-red-700 hover:via-red-600 hover:to-orange-600
        shadow-lg hover:shadow-xl hover:shadow-red-200
      `,
      gray: `
        bg-gradient-to-r from-gray-600 to-gray-500
        text-white 
        hover:from-gray-700 hover:to-gray-600
        shadow-lg hover:shadow-xl
      `
    };

    return `
      px-8 py-3.5
      rounded-xl 
      font-bold text-base
      ${variantStyles[variant]}
      active:scale-[0.98]
      transition-all duration-300
      flex items-center justify-center gap-2.5
      disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg
      min-h-[48px]
    `;
  };

  const buttonType = isSubmit && !onNext ? "submit" : "button";

  return (
    <div className="mt-8 flex items-center gap-3 sm:gap-4 flex-col-reverse sm:flex-row w-full">
      {/* Back Button */}
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className={`${getButtonStyles('back')} w-full sm:w-auto sm:min-w-[120px] cursor-pointer`}
          aria-label={backLabel}
        >
          {backIcon && <ArrowLeft size={18} strokeWidth={2.5} />}
          <span>{backLabel}</span>
        </button>
      )}

      {/* Next/Submit Button */}
      <button
        type={buttonType}
        onClick={onNext}
        disabled={disabled || isLoading}
        className={`${isLoading?'cursor-not-allowed':'cursor-pointer'}
          ${getButtonStyles('next')} 
          ${showBack ? 'flex-1 sm:flex-initial sm:ml-auto sm:min-w-[160px]' : 'w-full sm:w-auto sm:min-w-[200px]'}
        `}
        aria-label={nextLabel}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader size={20} className="animate-spin" strokeWidth={2.5} />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>{nextLabel}</span>
            {nextIcon && <ArrowRight size={20} strokeWidth={2.5} />}
          </>
        )}
      </button>

      {/* Global Styles */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}