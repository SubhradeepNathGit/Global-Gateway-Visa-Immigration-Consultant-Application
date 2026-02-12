import React from "react";
import { ArrowLeft } from "lucide-react";

const ApplicationViewHeader = ({ application }) => {
  return (
    <div className="flex flex-col gap-4">

      {/* Top Row */}
      <div className="flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Application Details
          </h1>
        </div>

        {/* Right Section – Application ID */}
        <p className="text-sm md:text-base mr-2 text-gray-600 font-medium text-right">
          Application ID:{" "}
          <span className="text-gray-900 font-semibold">
            {application?.id}
          </span>
        </p>

      </div>
    </div>
  );
};

export default ApplicationViewHeader;
