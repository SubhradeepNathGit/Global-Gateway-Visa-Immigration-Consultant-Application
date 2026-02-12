export default function DetailsTab({ register, errors }) {
    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Description <span className="text-red-400">*</span>
            </label>

            <textarea
                {...register("fullDescription", {
                    required: "Full description is required",
                })}
                rows={6} className="w-full px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white text-sm"
                placeholder="Detailed course description" />

            {errors.fullDescription && (
                <p className="text-xs text-red-400 mt-[-10px]">
                    {errors.fullDescription.message}
                </p>
            )}
        </div>
    );
}
