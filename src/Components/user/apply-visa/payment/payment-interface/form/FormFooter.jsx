import React from 'react'

const FormFooter = () => {
    return (
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-8 pt-6 border-t border-gray-200">
            <span>
                Secured by{" "}
                <a
                    href="https://www.paypal.com/in/home"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold italic text-gray-700"
                >
                    PayPal
                </a>
            </span>

            <span>•</span>
            <a
                href="https://www.paypal.com/us/legalhub/paypal/useragreement-full"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-700 transition-colors"
            >
                Terms
            </a>

            <span>•</span>
            <a
                href="https://www.paypal.com/us/legalhub/paypal/privacy-full"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-700 transition-colors"
            >
                Privacy
            </a>

        </div>
    )
}

export default FormFooter