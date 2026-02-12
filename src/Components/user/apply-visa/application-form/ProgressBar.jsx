import React from "react";
import { Check } from "lucide-react";

export default function ProgressBar({
  step = 1,
  steps = ["Personal", "Passport", "Visa", "Uploads", "Review", "Payment"]
}) {
  return (
    <div className="w-full px-2 sm:px-4 mb-8 sm:mb-10">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((label, i) => {
          const idx = i + 1;
          const active = step === idx;
          const done = step > idx;

          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center relative">
                {/* Circle */}
                <div
                  className={`
                    w-11 h-11 rounded-full flex items-center justify-center
                    font-bold text-base transition-all duration-500 z-10
                    ${done
                      ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200 scale-100"
                      : active
                        ? "bg-gradient-to-br from-red-600 to-red-500 text-white shadow-lg shadow-red-200 scale-110 ring-4 ring-red-100"
                        : "bg-gray-200 text-gray-500 shadow-sm"
                    }
                  `}
                >
                  {done ? <Check size={20} strokeWidth={3} /> : idx}
                </div>

                {/* Label */}
                <div
                  className={`text-xs font-semibold mt-2.5 whitespace-nowrap transition-all duration-300
                    ${active ? "text-red-600 scale-105" : done ? "text-green-600" : "text-gray-500"}`}>
                  {label}
                </div>
              </div>

              {/* Connector Line - Positioned to touch circles */}
              {i < steps.length - 1 && (
                <div
                  className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden relative"
                  style={{
                    marginLeft: '-0.5px',
                    marginRight: '-0.5px',
                    marginTop: '-28px'
                  }}
                >
                  <div
                    className={`
                      h-full rounded-full transition-all duration-700 ease-out
                      ${done
                        ? "w-full bg-gradient-to-r from-green-500 to-green-600"
                        : "w-0 bg-gradient-to-r from-red-500 to-red-600"
                      } `} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((label, i) => {
            const idx = i + 1;
            const active = step === idx;
            const done = step > idx;

            return (
              <React.Fragment key={label}>
                {/* Circle */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    font-bold text-xs transition-all duration-500 flex-shrink-0 z-10
                    ${done
                      ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md"
                      : active
                        ? "bg-gradient-to-br from-red-600 to-red-500 text-white shadow-md ring-2 ring-red-200 scale-110"
                        : "bg-gray-200 text-gray-400"
                    }`}>
                  {done ? <Check size={14} strokeWidth={3} /> : idx}
                </div>

                {/* Connector Line - Positioned to touch circles */}
                {i < steps.length - 1 && (
                  <div
                    className="flex-1 h-0.5 bg-gray-200 rounded-full overflow-hidden relative"
                    style={{
                      marginLeft: '-0.5px',
                      marginRight: '-0.5px'
                    }}>
                    <div
                      className={`
                        h-full rounded-full transition-all duration-700
                        ${done
                          ? "w-full bg-gradient-to-r from-green-500 to-green-600"
                          : "w-0"
                        }`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Active Step Label */}
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium">Step {step} of {steps.length}</p>
          <p className="text-sm font-bold text-red-600 mt-1">{steps[step - 1]}</p>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}