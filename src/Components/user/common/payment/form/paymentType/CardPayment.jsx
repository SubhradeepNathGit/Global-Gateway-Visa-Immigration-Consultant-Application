import React, { forwardRef, useImperativeHandle, useState } from "react";
import { CreditCard, ChevronDown } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

const CardPayment = forwardRef((props, ref) => {

    const [transactionId, setTransactionId] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [cardType, setCardType] = useState("visa");
    const [cardDetails, setCardDetails] = useState(null);

    const generateTransactionId = (length = 14) => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    const maskCardNumber = (cardNumber) => {
        if (!cardNumber) return "";

        const last4 = cardNumber.slice(-4);
        return `XXXX-XXXX-XXXX-${last4}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;

        if (name === "cardNumber") {
            formattedValue = value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
        }

        else if (name === "expiryDate") {
            let numbers = value.replace(/\D/g, "").slice(0, 4);

            if (numbers.length >= 3) {
                formattedValue = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
            } else if (numbers.length >= 1) {
                formattedValue = numbers;
            } else {
                formattedValue = "";
            }
        }

        else if (name === "cvv") {
            formattedValue = value.replace(/\D/g, "").slice(0, 3);
        }

        formik.setFieldValue(name, formattedValue);

        formik.setFieldTouched(name, true, false);
    };

    const formik = useFormik({
        initialValues: {
            cardNumber: "",
            cardName: "",
            expiryDate: "",
            cvv: "",
        },
        validationSchema: Yup.object({
            cardNumber: Yup.string()
                .required("Card number is required")
                .matches(/^(\d{4} ){3}\d{4}$/, "Enter a valid 16-digit card number"),
            cardName: Yup.string()
                .required("Cardholder name required")
                .matches(/^[A-Za-z ]+$/, "Only letters allowed"),
            expiryDate: Yup.string()
                .required("Expiry date is required")
                .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY format required")
                .test("expiry-check", "Card has expired", function (value) {
                    if (!value) return false;
                    const [mm, yy] = value.split("/").map(Number);

                    const currentDate = new Date();
                    const currentMonth = currentDate.getMonth() + 1; 
                    const currentYear = currentDate.getFullYear() % 100; 

                    if (yy < currentYear) return false;

                    if (yy === currentYear && mm < currentMonth) return false;

                    return true;
                }),
            cvv: Yup.string()
                .required("CVV is required")
                .matches(/^\d{3,4}$/, "Invalid CVV"),
        }),
        onSubmit: () => {
            const newTransactionId = generateTransactionId();
            setTransactionId(newTransactionId);

            const payload = {
                transaction_id: newTransactionId,
                total_amount: props?.total_amount,
                payment_method: "card",
                card_type: cardType,
                masked_card: maskCardNumber(formik.values.cardNumber),
                card_holder_name: formik.values.cardName?.toUpperCase(),
                expiry_card: formik.values.expiryDate
            };
            setCardDetails(payload);
        }
    });

    useImperativeHandle(ref, () => ({
        validate: () => formik.submitForm(),
        isValid: () => formik.isValid,
        values: () => formik.values,
        getTransactionId: () => transactionId,
        getCardDetails: () => cardDetails
    }));

    const cardOptions = [
        { value: "visa", label: "Visa", logo: "/payment/visa.png" },
        { value: "mastercard", label: "MasterCard", logo: "/payment/master-card.png" },
        { value: "rupay", label: "RuPay", logo: "/payment/Rupay.png" }
    ];

    const selectedCard = cardOptions.find(card => card.value === cardType);

    return (
        <>
            {/* Card Type */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Type</label>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between bg-white"
                    >
                        <div className="flex items-center gap-3">
                            <img src={selectedCard.logo} alt={selectedCard.label} className="h-6" />
                            <span>{selectedCard.label}</span>
                        </div>

                        <ChevronDown size={20} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow z-10">
                            {cardOptions.map(card => (
                                <button
                                    key={card.value}
                                    type="button"
                                    onClick={() => {
                                        setCardType(card.value);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 ${cardType === card.value ? "bg-cyan-900/10" : ""}`}
                                >
                                    <img src={card.logo} className="h-6" />
                                    <span>{card.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Card Number */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                <div className="relative">
                    <input
                        type="text"
                        name="cardNumber"
                        value={formik.values.cardNumber}
                        onChange={handleInputChange}
                        onBlur={formik.handleBlur}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full border px-4 py-3 rounded-lg ${formik.errors.cardNumber && formik.touched.cardNumber ? "border-red-500" : "border-gray-300"}`}
                    />
                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                {formik.errors.cardNumber && formik.touched.cardNumber && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.cardNumber}</p>
                )}
            </div>

            {/* Cardholder Name */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                <input
                    type="text"
                    name="cardName"
                    value={formik.values.cardName}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    placeholder="JOHN DOE"
                    className={`w-full border px-4 py-3 rounded-lg uppercase ${formik.errors.cardName && formik.touched.cardName ? "border-red-500" : "border-gray-300"}`}
                />

                {formik.errors.cardName && formik.touched.cardName && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.cardName}</p>
                )}
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                    <input
                        type="text"
                        name="expiryDate"
                        value={formik.values.expiryDate}
                        onChange={handleInputChange}
                        onBlur={formik.handleBlur}
                        placeholder="MM/YY"
                        className={`w-full border px-4 py-3 rounded-lg ${formik.errors.expiryDate && formik.touched.expiryDate ? "border-red-500" : "border-gray-300"}`}
                    />

                    {formik.errors.expiryDate && formik.touched.expiryDate && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.expiryDate}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                    <input
                        type="password"
                        name="cvv"
                        value={formik.values.cvv}
                        onChange={handleInputChange}
                        onBlur={formik.handleBlur}
                        placeholder="•••"
                        className={`w-full border px-4 py-3 rounded-lg ${formik.errors.cvv && formik.touched.cvv ? "border-red-500" : "border-gray-300"}`}
                    />

                    {formik.errors.cvv && formik.touched.cvv && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.cvv}</p>
                    )}
                </div>
            </div>
        </>
    );
});

export default CardPayment;
