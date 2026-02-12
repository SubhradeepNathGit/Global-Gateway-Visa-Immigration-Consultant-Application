import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Shield, Smartphone } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

const UPIPayment = forwardRef((props, ref) => {

    const [transactionId, setTransactionId] = useState("");
    const [upiDetails, setUpiDetails] = useState(null);

    const generateTransactionId = (length = 14) => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: { upiId: "" },
        validationSchema: Yup.object({
            upiId: Yup.string()
                .required("UPI ID is required")
                .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/, "Invalid UPI ID"),
        }),
        onSubmit: () => {
            const newTransactionId = generateTransactionId();
            setTransactionId(newTransactionId);

            const payload = {
                transaction_id: newTransactionId,
                total_amount: props?.total_amount,
                payment_method: "upi",
                upi_id: formik.values.upiId,
            };
            setUpiDetails(payload);
        }
    });

    useImperativeHandle(ref, () => ({
        validate: () => formik.submitForm(),
        isValid: () => formik.isValid,
        values: () => formik.values,
        getTransactionId: () => transactionId,
        getUPIDetails: () => upiDetails,
    }));

    return (
        <>
            {/* UPI ID */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID</label>

                <div className="relative">
                    <input
                        type="text"
                        name="upiId"
                        value={formik.values.upiId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="username@upi"
                        className={`w-full border ${formik.errors.upiId && formik.touched.upiId
                            ? "border-red-500"
                            : "border-gray-300"
                            } rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-700`}
                    />
                    <Smartphone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <p className="text-xs text-gray-500 mt-2">Enter your UPI ID (e.g., yourname@paytm, mobile@ybl)</p>
                {formik.errors.upiId && formik.touched.upiId && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.upiId}</p>
                )}
            </div>

            {/* Security Box */}
            <div className="bg-cyan-900/5 border border-cyan-700/30 rounded-lg p-4 mb-8">
                <div className="flex gap-3">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-cyan-700/20 rounded-full flex items-center justify-center">
                            <Shield size={16} className="text-cyan-700" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-cyan-900 mb-1">Secure UPI Payment</h4>
                        <p className="text-xs text-cyan-800">
                            You'll be redirected to your UPI app to complete payment securely.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <p className="text-sm font-semibold text-gray-500 mb-3">Our Partners</p>
                <div className="grid grid-cols-5 gap-7">
                    {[
                        {

                            color: "bg-transparent ",
                            icon: "/payment/Google_Pay.png"
                        },
                        {

                            color: "bg-transparent",
                            icon: "/payment/PhonePe.png"
                        },
                        {

                            color: "bg-transparent",
                            icon: "/payment/Paytm_logo.png"
                        },
                        {

                            color: "bg-transparent",
                            icon: "/payment/amazon-pay.png"
                        },
                        {

                            color: "bg-transparent",
                            icon: "/payment/Bhim.png"
                        }
                    ].map((app, index) => (
                        <div
                            key={index}
                            className={`${app.color} rounded-md py-3 text-center flex flex-col items-center justify-center gap-0`}
                        >
                            <img
                                src={app.icon}
                                alt={app.name}
                                className="h-10 w-auto object-contain"
                            />

                        </div>
                    ))}
                </div>

            </div>
        </>
    );
});

export default UPIPayment;
