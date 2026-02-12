import FormInput from "./FormInput";

export default function PricingTab({ register, errors }) {
    return (
        <div className="space-y-6">
            <FormInput label="Base Price (₹)" name="pricing" register={register} errors={errors} type="number" 
            rules={{ required: "Base price is required" }}
            placeholder="15000" required />

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-400 mb-2">
                    <strong>Note:</strong> Price configuration
                </p>
                <ul className="text-xs text-blue-300 space-y-1">
                    <li>• Additional charges can include Tax, platform fees, processing charges, etc.</li>
                    <li>• Students see the final price including all charges at checkout</li>
                    <li>• Price breakdown is shown transparently to students</li>
                </ul>
            </div>
        </div>
    );
}
