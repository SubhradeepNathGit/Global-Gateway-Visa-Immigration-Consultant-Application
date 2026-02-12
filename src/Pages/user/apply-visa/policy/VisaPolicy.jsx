import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PolicyBanner from '../../../../Components/user/apply-visa/policy/PolicyBanner';
import PolicyHeader from '../../../../Components/user/apply-visa/policy/PolicyHeader';
import PolicySidebar from '../../../../Components/user/apply-visa/policy/PolicySidebar';
import PolicyTermAccordion from '../../../../Components/user/apply-visa/policy/PolicyTermAccordion';
import ApplicationProcessAccordion from '../../../../Components/user/apply-visa/policy/ApplicationProcessAccordion';
import RequirementsAccordion from '../../../../Components/user/apply-visa/policy/RequirementsAccordion';
import { Loader2 } from 'lucide-react';
import { useFullCountryDetails } from '../../../../tanstack/query/getCountryDetails';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import { decodeBase64Url, encodeBase64Url } from '../../../../util/encodeDecode/base64';
import { useDispatch, useSelector } from 'react-redux';
import { checkLoggedInUser } from '../../../../Redux/Slice/auth/checkAuthSlice';
import { useVisaDetailsByCountryAndVisitor } from '../../../../tanstack/query/getVisaDetailsViaCountryNameAndVisitorCountryId';

const policyData = {
    'General Policies': {
        title: 'General Visa Policies & Guidelines',
        description: 'Overview of our comprehensive visa policy framework and general requirements applicable to all visa categories.',
        requirements: [
            'Valid passport with minimum 6 months validity',
            'Completed visa application form',
            'Recent passport-sized photographs',
            'Proof of financial means',
            'Travel insurance coverage',
            'No criminal background check',
        ],
        processingTime: 'Varies by visa type',
        visaType: 'Varies by visa type',
        validityPeriod: 'Varies by visa type',
        fees: 'Varies by visa type',

        status: 'Active / Inactive'
    }
};

const VisaPolicies = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedCategory, setSelectedCategory] = useState('General Policies');
    const [expandedAccordion, setExpandedAccordion] = useState('requirements');
    const [hasReadPolicy, setHasReadPolicy] = useState(false);
    const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);
    const { country_id } = useParams();

    const countryId = decodeBase64Url(country_id);
    const { data: countryDetails, isLoading: isCountryDetailsloading, error: isCountryDetailserror } = useFullCountryDetails(countryId);
    const { data: countryWiseVisaDetails = [], isLoading: isCountryWiseVisaLoading, isError } = useVisaDetailsByCountryAndVisitor(countryId, userAuthData?.country);

    let currentPolicy;

    // console.log("Logged user data", userAuthData);
    // console.log("Country wise visa details", countryWiseVisaDetails);

    useEffect(() => {
        dispatch(checkLoggedInUser())
            .then(res => {
                // console.log('Response for fetching user profile', res);
            })
            .catch((err) => {
                console.log("Error occurred", err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    }, [dispatch]);

    if (selectedCategory === "General Policies") {
        currentPolicy = policyData["General Policies"];
    } else {
        // console.log(selectedCategory);

        const selectedVisa = countryWiseVisaDetails?.find(
            v => v.id === selectedCategory
        );
        // console.log('Selected visa details', selectedVisa);

        if (selectedVisa) {
            currentPolicy = {
                title: `${selectedVisa?.visa?.visa_type} Policy`,
                country: countryDetails?.name || "N/A",
                requirements: selectedVisa?.visa_documents || [],
                fees: selectedVisa?.visa_fees || "N/A",
                processingTime: selectedVisa?.visa_processing_time || "N/A",
                visaType: selectedVisa?.entry_type || "N/A",
                validityPeriod: selectedVisa?.visa_validity || "N/A",
                status: selectedVisa?.status || "N/A"
            };
        }
    }

    const handleAccordionToggle = (panel) => {
        setExpandedAccordion(expandedAccordion === panel ? null : panel);
    };

    const unblockVisaList = countryWiseVisaDetails?.filter(visa=>visa?.status=='active');

    const handleContinueToApplication = () => {
        if (hasReadPolicy) {
            countryWiseVisaDetails?.length > 0 ? (unblockVisaList?.length>0? navigate(`/application-form/${encodeBase64Url(String(countryId))}`):getSweetAlert('Oops...', 'Currently No Active Visa Available!', 'warning') ): getSweetAlert('Oops...', 'No Visa Available!', 'warning');
        }
    };

    if (isCountryWiseVisaLoading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-18 h-18 text-red-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading visa policy...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner */}
            <PolicyBanner />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left Sidebar */}
                    <PolicySidebar visaPolicyCategories={countryWiseVisaDetails} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} currentPolicy={currentPolicy} />

                    {/* Right Content */}
                    <div className="flex-1">
                        {/* Policy Header Card */}
                        {/* <PolicyHeader policyData={policyData} selectedCategory={selectedCategory} /> */}
                        <PolicyHeader currentPolicy={currentPolicy} />

                        {/* Accordions */}
                        <div className="space-y-4">
                            {/* Requirements Accordion */}
                            <RequirementsAccordion expandedAccordion={expandedAccordion} handleAccordionToggle={handleAccordionToggle} currentPolicy={currentPolicy} />

                            {/* Application Process Accordion */}
                            <ApplicationProcessAccordion expandedAccordion={expandedAccordion} handleAccordionToggle={handleAccordionToggle} />

                            {/* Policy Terms Accordion */}
                            <PolicyTermAccordion expandedAccordion={expandedAccordion} handleAccordionToggle={handleAccordionToggle} />
                        </div>

                        {/* Policy Acknowledgment Checkbox */}
                        <div className="bg-white rounded-lg shadow-md p-5 md:p-6 mt-6">
                            <div className="flex items-start gap-4">
                                <input
                                    type="checkbox"
                                    id="policyAgreement"
                                    checked={hasReadPolicy}
                                    onChange={(e) => setHasReadPolicy(e.target.checked)}
                                    className="w-5 h-5 mt-1 rounded border-gray-300 text-red-600 cursor-pointer flex-shrink-0 accent-red-600"
                                />
                                <label htmlFor="policyAgreement" className="text-sm md:text-base text-gray-700 cursor-pointer">
                                    <span className="font-semibold">I have read and understood the visa policy</span>
                                    <p className="text-gray-600 mt-1">
                                        By checking this box, you confirm that you have carefully reviewed all policy requirements,
                                        terms, and conditions outlined above and understand your obligations as a visa applicant.
                                    </p>
                                </label>
                            </div>
                        </div>

                        {/* Continue Button */}
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleContinueToApplication}
                                disabled={!hasReadPolicy}
                                className={`px-8 md:px-12 py-3 md:py-4 rounded-lg text-base md:text-lg font-bold transition-all duration-300 shadow-lg ${hasReadPolicy
                                    ? "bg-transparent text-red-500 border border-red-500 hover:bg-red-500 hover:text-white  cursor-pointer"

                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Continue to Visa Application
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisaPolicies;