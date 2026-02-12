import React, { useEffect, useState } from 'react'
import { Upload, Phone, Mail } from 'lucide-react';
import { updateUserProfile } from '../../../Redux/Slice/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const ProfileCard = ({ userAuthData }) => {

    const [uploading, setUploading] = useState(false);
    const [localAvatar, setLocalAvatar] = useState(null);
    const imgType = ['jpeg', 'jpg', 'png'];
    const dispatch = useDispatch(),
        { isUserLoading, getUserData, isUserError } = useSelector(state => state.userProfile);

    const handleAvatarUpload = async (event) => {
        try {
            const file = event.target.files?.[0];

            if (!file) return;

            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }
            if (file.size > 200 * 1024) {
                alert('File size must be less than 200KB');
                return;
            }
            if (!imgType.includes(file.type.split('/')[1])) {
                toastifyAlert.warn("Profile image type should be jpeg / jpg / png");
                return;
            }

            setUploading(true);

            const previewUrl = URL.createObjectURL(file);

            if (localAvatar && localAvatar.startsWith("blob:")) {
                URL.revokeObjectURL(photo);
            }
            setLocalAvatar(previewUrl);

            const image_obj = {
                profile_image: file
            }

            dispatch(updateUserProfile({
                data: image_obj,
                id: userAuthData.id,
            }))
                .then(res => {
                    // console.log('Response from photo update', res);

                    if (res?.payload?.profile_image_url) {
                        const freshUrl = res.payload.profile_image_url + `?t=${Date.now()}`;
                        // console.log(freshUrl);

                        setLocalAvatar(freshUrl);
                    }
                })
                .catch(err => {
                    console.error("Error occurred in uploading photo", err);
                    getSweetAlert("Oops...", "Something went wrong!", "error");
                })
                .finally(() => {
                    setUploading(false);
                });
        }
        catch (error) {
            console.error("Error occurred in uploading photo", err);
            getSweetAlert("Oops...", "Something went wrong!", "error");
        }
    };

    useEffect(() => {
        setLocalAvatar(userAuthData?.avatar_url || '/demo-user.png');
    }, [userAuthData]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 mb-8">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative group">
                        <img
                            src={localAvatar}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-red-500 shadow-lg object-cover"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userAuthData?.name)}&background=ef4444&color=fff&size=200`;
                            }}
                        />
                        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Upload className="w-8 h-8 text-white" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {userAuthData?.name.split(' ')[0] ?? 'User'}!</h2>
                        <div className="space-y-2">
                            {userAuthData?.email && (
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span>{userAuthData?.email ?? 'example@gmail.com'}</span>
                                </div>
                            )}
                            {userAuthData?.phone && (
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span>{userAuthData?.phone ?? '+91 123...'}</span>
                                </div>
                            )}
                        </div>
                        <p className="mt-3 text-gray-500">Track your visa applications and manage your immigration journey</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard