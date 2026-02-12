import { Plus, Trash2, FileText, Upload } from "lucide-react";
import { Controller } from "react-hook-form";

export default function DocumentsTab({ control, documentFields, appendDocument, removeDocument, register, setValue, errors, clearErrors }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-300">Course Documents</h3>

        <button
          type="button"
          onClick={() => {
            appendDocument({ name: "", type: "PDF", isFree: false, file: null, previewUrl: "", size: "" });
            if (errors?.documents) clearErrors('documents');
          }}
          className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Document
        </button>
      </div>

      {/* Documents List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {documentFields?.map((field, index) => (
          <div key={field.id} className="p-4 bg-slate-700/20 border border-slate-600/50 rounded-lg space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-300">Document {index + 1}</h4>

              <button
                type="button"
                onClick={() => removeDocument(index)}
                className="p-1.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded hover:bg-red-500/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Upload Box */}
            <Controller
              name={`documents.${index}.file`}
              control={control}
              render={({ field }) => {
                const hasFile = !!field.value; 

                return (
                  <div
                    className="w-full rounded-xl border border-dashed border-slate-600 bg-slate-800/40 p-4 text-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (!file) return;

                      field.onChange(file);
                      setValue(`documents.${index}.previewUrl`, URL.createObjectURL(file));
                      setValue(`documents.${index}.size`, (file.size / (1024 * 1024)).toFixed(2) + " MB");
                      setValue(`documents.${index}.name`, file.name);
                      setValue(`documents.${index}.type`, file.name.split(".").pop().toUpperCase());
                    }}
                  >
                    {hasFile ? (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-400" />
                          <div className="text-left">
                            <p className="text-sm text-white font-medium">{field.name}</p>
                            <p className="text-xs text-slate-400">{field.value.size}</p>
                          </div>
                        </div>

                        {/* Inner Trash Button */}
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(null); // reset RHF field
                            setValue(`documents.${index}.previewUrl`, "");
                            setValue(`documents.${index}.size`, "");
                            setValue(`documents.${index}.name`, "");
                          }}
                          className="p-1.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor={`docUpload-${index}`}
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Upload className="w-5 h-5 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-400">Drag & drop or click to upload</p>
                        <p className="text-xs text-slate-500">PDF, DOCX, XLSX</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                          className="hidden"
                          id={`docUpload-${index}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            field.onChange(file);
                            setValue(`documents.${index}.previewUrl`, URL.createObjectURL(file));
                            setValue(`documents.${index}.size`, (file.size / (1024 * 1024)).toFixed(2) + " MB");
                            setValue(`documents.${index}.name`, file.name);
                            setValue(`documents.${index}.type`, file.name.split(".").pop().toUpperCase());
                          }}
                        />
                      </label>
                    )}
                  </div>
                );
              }}
            />

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3">
              <input
                {...register(`documents.${index}.name`, { required: index === 0 ? "Document name is required" : false })}
                className="col-span-2 px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                placeholder="Document Name"
              />

              <select
                {...register(`documents.${index}.type`)}
                className="px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              >
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="XLSX">XLSX</option>
              </select>

              <select
                {...register(`documents.${index}.isFree`)}
                className="px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              >
                <option value="false">Paid</option>
              </select>
            </div>
          </div>
        ))}

        {(errors?.documents?.[0]?.message || errors?.documents?.message) && (
          <p className="mt-1 text-xs text-red-400">
            {errors.documents[0]?.file?.message || errors.documents?.message}
          </p>
        )}
      </div>
    </div>
  );
}
