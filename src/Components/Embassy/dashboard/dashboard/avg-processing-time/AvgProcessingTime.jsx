import React from "react";
import AvgProcessingTimeRow from "./AvgProcessingTimeRow";
import { useCountryVisas } from "../../../../../tanstack/query/getCountryVisas";

const AvgProcessingTime = ({ countryDetails }) => {
    const { data, isLoading, isError } = useCountryVisas(countryDetails?.id);

    if (isLoading) return <p>Loading...</p>;
    // if (isError || !data?.visaTypes?.length) return <p>No visa data available</p>;

    // Map all visa types dynamically
    const visaWithDays = data?.visas?.map(visa => ({
        type: visa.type,
        days: Number(visa.days) || 0,
    }));

    // Max days for percentage
    const maxDays = visaWithDays?.length > 0 ? Math.max(...visaWithDays.map(v => v.days)) : 0;

    const visaMap = {};

    visaWithDays?.forEach(visa => {
        if (!visaMap[visa.type]) {
            visaMap[visa.type] = { ...visa, totalDays: visa.days, count: 1 };
        } else {
            visaMap[visa.type].totalDays += visa.days;
            visaMap[visa.type].count += 1;
        }
    });

    //  Convert map back to array with average days
    const uniqueVisasWithAvgDays = Object.values(visaMap).map(visa => ({
        type: visa.type,
        days: visa.totalDays / visa.count
    }));

    // Add colors and percentage
    const avgProcessingTimes = uniqueVisasWithAvgDays?.map((visa, idx) => ({
        ...visa,
        percentage: maxDays ? Math.round((visa.days / maxDays) * 100) : 0,
        color: ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"][idx % 5],
    }));

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Avg Processing Times</h2>
            <div className="space-y-4 h-50 overflow-auto glass-scrollbar">
                {avgProcessingTimes?.length>0?
                avgProcessingTimes.map((item, idx) => (
                    <AvgProcessingTimeRow key={idx} item={item} />
                )): 'No visa data available'}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-600 leading-relaxed">
                    Based on last 90 days of processed applications
                </p>
            </div>
        </div>
    );
};

export default AvgProcessingTime;