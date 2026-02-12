import React from 'react';
import { AlertCircle, Calendar, Mail, Phone } from 'lucide-react';

const ProfileDetails = ({ profile, isEditing, register, errors }) => {

  const InfoCard = ({ icon: Icon, label, value, field, type = "text", color }) => (
    <div className="bg-transparent p-4 rounded-lg border border-slate-700/50 transition-all hover:border-slate-600/50">
      <label className="text-xs text-slate-400 flex items-center gap-2 mb-2" htmlFor={field}>
        <Icon className={`w-4 h-4 ${color}`} />
        {label}
      </label>

      {isEditing && field ? (
        <div>
          <input id={field} type={type} defaultValue={value}
            {...register(field, {
              required: `${label} is required`,
              ...(field === "phone" && {
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Phone must be 10 digits & start with 6–9",
                },
              }),
            })}
            className={`w-full px-3 py-2 rounded bg-slate-800 border 
              ${errors[field] ? 'border-red-500' : 'border-slate-600'} 
              text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          />
          {errors[field] && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors[field].message}
            </p>
          )}
        </div>
      ) : (
        <p className="text-white font-medium break-words">{value}</p>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
      <InfoCard icon={Mail} label="Email Address" value={profile.email} color="text-blue-400" />
      <InfoCard icon={Phone} label="Phone Number" value={profile.phone} field="phone" color="text-green-400" />
      <InfoCard icon={Calendar} label="Member Since" value={profile.joinDate} color="text-orange-400" />
    </div>
  );
};

export default ProfileDetails;
