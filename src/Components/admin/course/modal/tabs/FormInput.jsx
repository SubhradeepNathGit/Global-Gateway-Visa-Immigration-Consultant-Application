export default function FormInput({ label, name, register, disabled = false, required = false, rules, errors, ...rest }) {
  const error = name.split(".").reduce((acc, key) => acc?.[key], errors);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label} {required ? (<span className="text-red-400">*</span>) : null}
      </label>

      <input
        {...register(name, rules)}
        {...rest} disabled={disabled}
        className={`w-full px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 text-sm ${disabled ? 'cursor-not-allowed' : ''}`}
      />

      {error?.message && (
        <p className="mt-1 text-xs text-red-400">{error.message}</p>
      )}
    </div>
  );
}
