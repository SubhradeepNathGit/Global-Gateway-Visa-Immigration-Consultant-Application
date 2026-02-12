import React, { useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, Controller } from 'react-hook-form'

const RequiredDocs = ({ control }) => {
    const { fields, append, remove } = useFieldArray({ control, name: 'requiredDocuments', })

    useEffect(() => {
        if (fields.length === 0) {
            append('')
        }
    }, [fields, append])

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                    Required Documents *
                </label>

                <button
                    type="button"
                    onClick={() => fields.length < 5 && append('')}
                    disabled={fields.length >= 5}
                    className={`text-sm font-medium flex items-center gap-1 ${fields.length >= 5
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-600 hover:text-blue-700'
                        }`}
                >
                    <Plus className="inline h-4 mb-1" /> Add Document
                </button>
            </div>

            <div className="space-y-3">
                {fields.map((item, idx) => (
                    <div key={item.id}>
                        <div className="flex gap-2">
                            <Controller
                                name={`requiredDocuments.${idx}`}
                                control={control}
                                rules={{
                                    required: 'This field is required',
                                    validate: value =>
                                        value.trim() !== '' || 'This field is required',
                                }}
                                render={({ field, fieldState }) => (
                                    <div className="flex-1">
                                        <input {...field} type="text"
                                            placeholder="e.g., Passport copy"
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldState.error
                                                ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {fieldState.error && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </div>
                                )} />

                            {fields.length > 1 && (
                                <button
                                    type="button" onClick={() => remove(idx)}
                                    className="px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {fields.length >= 5 && (
                <p className="text-xs text-gray-500 mt-1">
                    Maximum of 5 documents allowed.
                </p>
            )}
        </div>
    )
}

export default RequiredDocs
