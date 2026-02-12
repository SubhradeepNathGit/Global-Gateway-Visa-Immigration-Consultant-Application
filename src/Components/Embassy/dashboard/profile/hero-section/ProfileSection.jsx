import React from 'react'

const ProfileSection = ({ profileData }) => {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto relative">
                {/* Embassy Logo - Absolute positioned, half overlapping cover */}
                <div className="absolute left-0 -mt-16 sm:-mt-20">
                    <div className="w-32 h-32 sm:w-45 sm:h-45 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-white overflow-hidden">
                        <img
                            src={profileData?.details?.flag_url ?? `https://flagcdn.com/w320/${profileData?.details?.code?.toLowerCase()}.png`}
                            alt={`${profileData?.name} flag`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Embassy Info - Independent positioning */}
                <div className="pt-4 pb-6 pl-0 -mt-3 sm:pl-48">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1">
                        <span className="text-gray-900">
                            {profileData?.name?.split(" ")?.length > 1 ? profileData?.name?.split(" ")?.map(n => n?.charAt(0)?.toUpperCase())?.join("") : profileData?.name?.charAt(0)?.toUpperCase() + profileData?.name?.slice(1)}
                        </span>
                        <span className="text-gray-800">
                            {" "}Embassy
                        </span>
                    </h1>

                    <p className="text-md text-gray-600 font-medium ml-1">{profileData?.name}, {profileData?.details?.continents}</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileSection