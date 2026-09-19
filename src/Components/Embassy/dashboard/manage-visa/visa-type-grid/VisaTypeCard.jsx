import React from 'react'
import VisaCardHeader from './VisaCardHeader';
import VisaCardActiveBody from './VisaCardActiveBody';
import VisaCardFooter from './VisaCardFooter';
import VisaCardConfigBtn from './VisaCardConfigBtn';
import { useVisaDetailsViaId } from '../../../../../tanstack/query/getVisaDetailsViaId';
import { useVisaDetails } from '../../../../../tanstack/query/getVisaDetails';

const VisaTypeCard = ({ visaType,countryWiseVisa, country_id, expandedVisa, iconMapping, handleEditVisa, dragOverItem, index, draggedItem, selectedCountry,
 handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop, setExpandedVisa }) => {

    // Safely resolve visaId and iconName whether visaType is an object or string
    let resolvedVisaId = null;
    let iconName = null;

    if (visaType && typeof visaType === 'object' && !Array.isArray(visaType)) {
        const keys = Object.keys(visaType);
        if (keys.length > 0 && keys[0] !== "0") {
            resolvedVisaId = keys[0];
            iconName = visaType[resolvedVisaId];
        }
    } else if (typeof visaType === 'string') {
        resolvedVisaId = countryWiseVisa?.visa_id?.[index] || null;
        iconName = visaType;
    }

    if (!resolvedVisaId || resolvedVisaId === "0") {
        resolvedVisaId = countryWiseVisa?.visa_id?.[index] || null;
    }

    const { data: visaData, isLoading: isVisaDataLoading } = useVisaDetailsViaId(resolvedVisaId);
    const { data: specificVisaDetails, isLoading: isSpecificVisaDetails } = useVisaDetails({ countryId: country_id, visitorCountryId: selectedCountry?.id, visaId: resolvedVisaId });
    const visaDetails = specificVisaDetails?.[0];

    const Icon = (iconName && iconMapping?.[iconName]) || (visaData?.visa_type && iconMapping?.[visaData.visa_type]) || null;

    if (isVisaDataLoading || isSpecificVisaDetails) {
        return (
            <div className="flex flex-col mt-20 items-center justify-center bg-transparent">
                <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span className="mt-5 text-black">Loading...</span>
            </div>
        );
    }
    return (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all cursor-move ${visaDetails?.status != "active" ? 'border-red-300' : 'border-gray-200'
                } ${dragOverItem === index ? 'border-blue-500 border-2 scale-105' : ''} ${draggedItem === index ? 'opacity-50' : ''
                }`}
        >
            <div className="p-5">
                {/* Drag Handle */}
                <VisaCardHeader visaDetails={visaDetails} iconMapping={iconMapping} visaData={visaData} Icon={Icon} />

                {visaDetails ? (
                    <div className="space-y-3">
                        {visaDetails?.status == "active" && (
                            <VisaCardActiveBody visaDetails={visaDetails} expandedVisa={expandedVisa} setExpandedVisa={setExpandedVisa} />
                        )}

                        {visaDetails?.status != "active" && (
                            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                                <p className="text-sm text-red-800 font-medium">Blocked for {selectedCountry.name}</p>
                            </div>
                        )}

                        <VisaCardFooter handleEditVisa={handleEditVisa} visaDetails={visaDetails} visaData={visaData} />
                    </div>
                ) : (
                    <VisaCardConfigBtn handleEditVisa={handleEditVisa} visaType={visaType} visaId={resolvedVisaId} visaData={countryWiseVisa} country_id={country_id} />
                )}
            </div>
        </div>
    );
}

export default VisaTypeCard