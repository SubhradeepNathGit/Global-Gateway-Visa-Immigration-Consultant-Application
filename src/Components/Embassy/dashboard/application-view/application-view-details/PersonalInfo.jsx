import React from 'react'
import { Briefcase, Mail, MapPin, Phone, User } from 'lucide-react'

const PersonalInfo = ({ application }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={20} className="text-blue-600" />
                    Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-600">First Name</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_personal_info?.first_name ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Last Name</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_personal_info?.last_name ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Date of Birth</label>
                        <p className="text-base font-medium text-gray-900 mt-1">
                            {new Date(application?.application_personal_info?.date_of_birth).toLocaleDateString() ?? 'N/A'}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Gender</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_personal_info?.gender ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Marital Status</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_personal_info?.marital_status ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Nationality</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_personal_info?.nationality ?? 'N/A'}</p>
                    </div>

                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Mail size={20} className="text-blue-600" />
                    Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Mail size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Email</label>
                            <p className="text-base font-medium text-gray-900 mt-1">{application?.application_personal_info?.email ?? 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Phone size={18} className="text-green-600" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Phone</label>
                            <p className="text-base font-medium text-gray-900 mt-1">{application?.application_personal_info?.phone ?? 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-blue-600" />
                    Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-600">Street Address</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_personal_info?.address ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">City</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_personal_info?.city ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">State/Province</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_personal_info?.state ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">ZIP/Postal Code</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_personal_info?.postal_code ?? 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Country</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application?.application_personal_info?.country ?? 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase size={20} className="text-blue-600" />
                    Employment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-600">Employment Status</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application.employment.status??'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Occupation</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application.employment.occupation??'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Company</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application.employment.company??'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Monthly Income</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application.employment.monthlyIncome??'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Company Address</label>
                        <p className="text-base font-medium text-gray-900 mt-1">{application.employment.companyAddress??'N/A'}</p>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default PersonalInfo