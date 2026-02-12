import React, { useState, useEffect, useRef } from 'react';
import { Plus, Calendar, GraduationCap, Plane, Users, Briefcase, HardHat, Home, Lock, HeartPulse, Ship, Landmark, Globe, ShieldCheck, BookOpen, Stethoscope, Building2, AlertTriangle, Scroll, Navigation, BadgeCheck, FlaskConical, Theater, Trophy, Star } from 'lucide-react';
import StatsGrid from '../../../Components/embassy/dashboard/manage-visa/stats-section/StatsGrid';
import CountrySelector from '../../../Components/embassy/dashboard/manage-visa/country-selector-section/CountrySelector';
import AddVisa from '../../../Components/embassy/dashboard/manage-visa/new-visa/AddVisa';
import EditVisaDetails from '../../../Components/embassy/dashboard/manage-visa/edit-visa/EditVisaDetails';
import VisaTypeCard from '../../../Components/embassy/dashboard/manage-visa/visa-type-grid/VisaTypeCard';
import EmptyVisa from '../../../Components/embassy/dashboard/manage-visa/EmptyVisa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCountryDetails } from '../../../Redux/Slice/countrySlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { useFullCountryDetails } from "../../../tanstack/query/getCountryDetails";
import { useCountryVisaForSpecificCountry } from '../../../tanstack/query/getVisaDetailsCountryWiseForSpecificCountry';
import { useAllVisaPoliciesForCountry } from '../../../tanstack/query/getAllVisaPoliciesForCountry';
import { useSpecificCountryVisaEnable } from '../../../tanstack/query/getSpecificCountryVisaEnable';

// Default visa type icons mapping
const iconMapping = {
  "Student": GraduationCap,
  "Exchange": BookOpen,
  "Tourist": Plane,
  "Visitor": Globe,
  "Transit": Ship,
  "Family": Users,
  "Spouse": HeartPulse,
  "Business": Briefcase,
  "Work": HardHat,
  "Resident": Home,
  "Medical": Stethoscope,
  "Diplomatic": Landmark,
  "Official": BadgeCheck,
  "Conference": Building2,
  "Research": FlaskConical,
  "Journalist": Scroll,
  "Temporary": Calendar,
  "Emergency": AlertTriangle,
  "Restricted": Lock,
  "Airport Transit": Navigation,
  "Government": ShieldCheck,
  "Cultural": Theater,
  "Sports": Trophy,
  "Talent": Star
};

export default function VisaPolicyManage() {
  const dispatch = useDispatch();
  const { embassyData } = useSelector(state => state.embassy);
  const { data: countryDetails, isLoading: isCountryLoading, isError: embassyError } = useFullCountryDetails(embassyData?.country_id);
  const { isAllCountryListLoading, getAllCountryList, isAllCountryListError } = useSelector(state => state.allCountry);
  const { data: visaData = [], isLoading: isVisaDataLoading } = useCountryVisaForSpecificCountry(countryDetails?.id);
  const { data: allCountryPolicy, isLoading: isAllPolicyLoading } = useAllVisaPoliciesForCountry();
  const { data: specificVisaEnableCountry, isLoading: isspecificVisaEnableCountryLoading } = useSpecificCountryVisaEnable(countryDetails?.id);

  const countryListWithoutOwn = getAllCountryList?.filter(country => country?.name?.toLowerCase() != embassyData?.country_name?.toLowerCase());

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [editingVisa, setEditingVisa] = useState(null);
  const [expandedVisa, setExpandedVisa] = useState(null);
  const [visaTypesByCountry, setVisaTypesByCountry] = useState(countryListWithoutOwn);
  const [isAddingVisaType, setIsAddingVisaType] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const editFormRef = useRef(null);
  const addVisaFormRef = useRef(null);

  const visaRow = visaData?.find(v => v?.visitor_country === selectedCountry?.id);
  const visaPolicy = allCountryPolicy?.filter(policy => policy?.country_id == countryDetails?.id && policy?.visitor_country_id == selectedCountry?.id)

  useEffect(() => {
    if (countryListWithoutOwn && countryListWithoutOwn.length > 0 && !selectedCountry) {
      setSelectedCountry(countryListWithoutOwn[0]);
    }
  }, [countryListWithoutOwn]);

  useEffect(() => {
    dispatch(fetchAllCountryDetails())
      .then(res => {
        // console.log('Response for fetching all country', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      });
  }, []);


  // Add this useEffect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // Scroll to form when editing or adding
  useEffect(() => {
    if (editingVisa && editFormRef.current) {
      setTimeout(() => {
        editFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [editingVisa]);

  useEffect(() => {
    if (isAddingVisaType && addVisaFormRef.current) {
      setTimeout(() => {
        addVisaFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isAddingVisaType]);

  const handleEditVisa = (visa) => {
    setEditingVisa(visa);
    setExpandedVisa(null);
    setIsAddingVisaType(false);
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, index) => {
    setDragOverItem(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedItem === null || draggedItem === dropIndex) {
      return;
    }

    const currentVisaTypes = [...(visaTypesByCountry[selectedCountry.id] || [])];
    const draggedItemContent = currentVisaTypes[draggedItem];

    // Remove dragged item
    currentVisaTypes.splice(draggedItem, 1);

    // Insert at new position
    const finalDropIndex = draggedItem < dropIndex ? dropIndex - 1 : dropIndex;
    currentVisaTypes.splice(finalDropIndex, 0, draggedItemContent);

    setVisaTypesByCountry(prev => ({
      ...prev,
      [selectedCountry.id]: currentVisaTypes
    }));

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const currentCountryVisaTypes = visaRow?.visa_id?.length ?? 0;
  const currentCountryVisaTypeDetails = visaRow?.visa_icon ?? [];

  if (isAllCountryListLoading || isCountryLoading || isVisaDataLoading || isAllPolicyLoading || isspecificVisaEnableCountryLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-transparent">
        <div className="w-18 h-18 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <span className="mt-5 text-black">Loading...</span>
      </div>
    );
  }

  // console.log('Logges embassy data', embassyData);
  // console.log('All available country details', getAllCountryList);
  // console.log(countryListWithoutOwn, selectedCountry);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Visa Policies</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Configure visa policies, set fees, and manage country-specific restrictions
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid visaPolicy={visaPolicy} currentCountryVisaTypes={currentCountryVisaTypes} specificVisaEnableCountry={specificVisaEnableCountry} />

      {/* Country Selector */}
      <CountrySelector setIsOpen={setIsOpen} allCountryPolicy={allCountryPolicy} isOpen={isOpen} visaPolicy={visaPolicy} country_id={countryDetails?.id} selectedCountry={selectedCountry} visaData={visaData} mockCountries={countryListWithoutOwn} setSelectedCountry={setSelectedCountry} setIsAddingVisaType={setIsAddingVisaType} dropdownRef={dropdownRef} />

      {/* Add Visa Type Form */}
      {isAddingVisaType && (
        <AddVisa selectedCountry={selectedCountry} setIsAddingVisaType={setIsAddingVisaType} iconMapping={iconMapping} countryDetails={countryDetails} />
      )}

      {/* Edit Form */}
      {editingVisa && (
        <EditVisaDetails currentCountryVisaTypes={currentCountryVisaTypeDetails} countryDetails={countryDetails} selectedCountry={selectedCountry} editingVisa={editingVisa} setEditingVisa={setEditingVisa} />
      )}

      {/* Add Visa Type Button */}
      {!editingVisa && !isAddingVisaType && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Need a new visa type?</h3>
              <p className="text-sm text-gray-600 mt-1">Add custom visa types specific to {selectedCountry?.name}'s embassy requirements</p>
            </div>
            <button
              onClick={() => setIsAddingVisaType(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Visa Type
            </button>
          </div>
        </div>
      )}


      {/* Visa Types Grid with Drag & swap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCountryVisaTypeDetails?.map((visaType, index) => (
          <VisaTypeCard key={index} index={index} countryWiseVisa={visaRow} visaType={visaType} country_id={embassyData?.country_id} expandedVisa={expandedVisa} iconMapping={iconMapping} handleEditVisa={handleEditVisa}
            dragOverItem={dragOverItem} draggedItem={draggedItem} selectedCountry={selectedCountry} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd}
            handleDragOver={handleDragOver} handleDragEnter={handleDragEnter} handleDrop={handleDrop} setExpandedVisa={setExpandedVisa} />
        ))}
      </div>

      {/* Empty State */}
      {currentCountryVisaTypes == 0 && (
        <EmptyVisa selectedCountry={selectedCountry} setIsAddingVisaType={setIsAddingVisaType} />
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}