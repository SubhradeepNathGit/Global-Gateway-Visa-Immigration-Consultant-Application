import { Plus, Trash2 } from "lucide-react";

export default function FeaturesTab({ featureFields, appendFeature, removeFeature, register, errors,clearErrors }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-300">What You'll Learn</h3>
                <button
                    type="button"
                    onClick={() => {
                        appendFeature('');

                        if (errors?.features) {
                            clearErrors('features');
                        }
                    }}
                    className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add Feature
                </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {featureFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                        <input
                            {...register(`features.${index}`, {
                                required:
                                    index === 0 ? "At least one feature is required" : false,
                            })}
                            className="flex-1 px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            placeholder="Enter a feature or learning outcome"
                        />
                        <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="px-3 py-2.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {(errors?.features?.[0]?.message || errors?.features?.message) && (
                    <p className="mt-1 text-xs text-red-400">
                        {errors.features[0]?.message || errors.features?.message}
                    </p>
                )}
            </div>
        </div>
    );
}
