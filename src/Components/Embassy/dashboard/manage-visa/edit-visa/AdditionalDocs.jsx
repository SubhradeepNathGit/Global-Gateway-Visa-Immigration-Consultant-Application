import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Controller } from 'react-hook-form'

const AdditionalDocs = ({ register, errors, control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time *</label>
        <div className="flex gap-2">
          <Controller
            name="processingTime"
            control={control}
            rules={{ required: "Processing time is required*", min: 1 }}
            render={({ field }) => (
              <input type="number" {...field} placeholder="45"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          />
          <Controller
            name="processingUnit"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="px-4 py-2.5 border border-gray-300 rounded-lg"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            )}
          />

        </div>
        {errors?.processingTime && <p className="text-red-500 text-xs mt-1">{errors?.processingTime?.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Validity Period *</label>
        <div className="flex gap-2">
          <Controller
            name="validityPeriod"
            control={control}
            rules={{ required: "Validity period is required*", min: 1 }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                placeholder="1"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          />
          <Controller
            name="validityUnit"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="px-4 py-2.5 border border-gray-300 rounded-lg"
              >
                <option value="day">Day</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            )}
          />
        </div>
        {errors?.validityPeriod && <p className="text-red-500 text-xs mt-1">{errors?.validityPeriod?.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Application Fees (₹) *</label>
        <Controller
          name="applicationFees"
          control={control}
          rules={{ required: "Application fees are required*", min: 0 }}
          render={({ field }) => (
            <input
              type="number"
              {...field}
              placeholder="10000"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        />
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Enter 0 to make this visa free
        </p>
        {errors?.applicationFees && <p className="text-red-500 text-xs mt-1">{errors?.applicationFees?.message}</p>}
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
            <select
              {...register('status', { required: "Status is required" })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors?.status && <p className="text-red-500 text-xs mt-1">{errors?.status?.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Entry Type *</label>
            <select
              {...register('visa_type', { required: "Entry type is required" })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Single Entry">Single</option>
              <option value="Double Entry">Double</option>
              <option value="Multiple Entry">Multiple</option>
            </select>
            {errors?.visa_type && <p className="text-red-500 text-xs mt-1">{errors?.visa_type?.message}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdditionalDocs
