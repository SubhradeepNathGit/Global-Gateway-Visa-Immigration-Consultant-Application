import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import successAnimation from "../../../../assets/payment/payment-success.json";
import errorAnimation from "../../../../assets/payment/payment-error.json";
import PaymentSuccess from "../../../../Components/user/payment/status/PaymentSuccess";
import PaymentFailed from "../../../../Components/user/payment/status/PaymentFailed";
import PaymentProcessing from "../../../../Components/user/payment/status/PaymentProcessing";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveTransaction } from "../../../../Redux/Slice/transactionSlice";
import { saveStepPayment, saveStepProgress } from "../../../../Redux/Slice/applicationSlice";
import getSweetAlert from "../../../../util/alert/sweetAlert";
import { addActivity } from "../../../../Redux/Slice/activitySlice";
import { addNotification } from "../../../../Redux/Slice/notificationSlice";
import { decodeBase64Url } from "../../../../util/encodeDecode/base64";
import { addOrder } from "../../../../Redux/Slice/orderSlice";
import { deleteCart } from "../../../../Redux/Slice/cartSlice";
import { updateCoursePurchaseStatus } from "../../../../Redux/Slice/userSlice";
import { addCertificate } from "../../../../Redux/Slice/certificateSlice";

const LottieAnimation = ({ animationData, isSuccess }) => {
    if (!animationData) return null;

    return (
        <div className={`
      w-auto h-auto md:w-60 md:h-60 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out  
      ${isSuccess ? 'bg-blue-100/10' : 'bg-red-100/10'}`}>
            <Lottie animationData={animationData} loop={false} autoplay={true} className="w-full h-full" />
        </div>
    );
};

export default function PaymentStatus() {
    const [paymentStage, setPaymentStage] = useState('processing');
    const [showConfetti, setShowConfetti] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);
    const [isCancelled, setIsCancelled] = useState(false);
    const [isLottieTransitioning, setIsLottieTransitioning] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { type, paymentDetails, personalInfoData, passportData, visaData, visaSpecification, country_id,
        subtotal, total, discountAmount, discount, cartItems, cartId } = location.state || {};

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const payment_obj = {
        transaction_id: paymentDetails?.transaction_id,
        payment_method: paymentDetails?.payment_method,
        upi_id: paymentDetails?.upi_id ? paymentDetails?.upi_id : null,
        card_type: paymentDetails?.card_type ? paymentDetails?.card_type : null,
        masked_card: paymentDetails?.masked_card ? paymentDetails?.masked_card : null,
        card_holder_name: paymentDetails?.card_holder_name ? paymentDetails?.card_holder_name : null,
        card_expiry: paymentDetails?.expiry_card ? paymentDetails?.expiry_card : null,
        amount: paymentDetails?.total_amount,
        txn_for: type
    }

    const application_payment_obj = {
        transaction_id: paymentDetails?.transaction_id,
        provider: 'Paypal',
        amount: paymentDetails?.total_amount,
        currency: 'Rupee',
        payment_date: currentDate
    }

    const application_obj = {
        step: 6,
        completedSteps: [1, 2, 3, 4, 5, 6],
        isCompleted: true,
        status: 'processing',
        applied_at: new Date().toISOString()
    }

    const activity_obj_success = {
        title: 'Application under processing',
        icon: 'processing'
    }

    const activity_obj_failed = {
        title: 'Payment failed',
        icon: 'failed'
    }

    const notification_obj = {
        application_id: personalInfoData?.application_id,
        title: "New application received with application i'd ",
        receiver_type: 'embassy',
        user_id: null,
        receiver_country_id: decodeBase64Url(country_id),
        mark_read: false
    }

    const user_notification_obj = {
        application_id: null,
        receiver_type: 'user',
        user_id: personalInfoData?.id,
        receiver_country_id: null,
        mark_read: false
    }

    const orderObj = {
        orderData: {
            user_id: personalInfoData?.id,
            transaction_id: paymentDetails?.transaction_id,
            amount: total,
            currency: 'Rupee',
            provider: 'Paypal',
            promocode: discount && Number(discount) > 0 ? true : false,
            purchase_date: new Date().toISOString()
        },
        items: cartItems?.map(item => ({
            course_id: item.course_id,
            price: item.courses.pricing
        }))
    }

    useEffect(() => {
        let timeout;
        let progressInterval;

        if (paymentStage === 'processing') {
            progressInterval = setInterval(() => {
                setProcessingProgress(prev => {
                    if (prev >= 100 || isCancelled) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    const step = prev < 80 ? 3.33 : 1;
                    return Math.min(100, prev + step);
                });
            }, 100);

            timeout = setTimeout(() => {
                if (!isCancelled) {

                    dispatch(saveTransaction({ ...payment_obj, status: 'success' }))
                        .then(res => {
                            // console.log('Response after adding transaction details', res);

                            if (res.meta.requestStatus === "fulfilled") {

                                if (type == 'visa') {
                                    dispatch(saveStepPayment({ applicationId: personalInfoData?.application_id, payload: { ...application_payment_obj, status: 'success' } }))
                                        .then(res => {
                                            // console.log('Response after adding payment data in application table', res);

                                            if (res.meta.requestStatus === "fulfilled") {
                                                dispatch(saveStepProgress({ applicationId: personalInfoData?.application_id, ...application_obj }))
                                                    .then(res => {
                                                        // console.log('Response after updating application complitation status', res);

                                                        dispatch(addActivity({ ...activity_obj_success, application_id: res?.meta?.arg?.applicationId }))
                                                            .then(res => {
                                                                // console.log('Response for adding activity', res);

                                                                if (res.meta.requestStatus === "fulfilled") {

                                                                    dispatch(addNotification(notification_obj))
                                                                        .then(res => {
                                                                            // console.log('Response for adding notification', res);

                                                                            if (res.meta.requestStatus === "fulfilled") {

                                                                                dispatch(addNotification({ ...user_notification_obj, title: "Visa application has been placed successfully." }))
                                                                                    .then(res => {
                                                                                        // console.log('Response after adding notification', res);

                                                                                        if (res.meta.requestStatus === "fulfilled") {

                                                                                            setIsLottieTransitioning(true);
                                                                                            setTimeout(() => {
                                                                                                setPaymentStage('success');
                                                                                                setIsLottieTransitioning(false);
                                                                                                setShowConfetti(true);
                                                                                                setTimeout(() => setShowConfetti(false), 4000);
                                                                                            }, 3000);
                                                                                        }
                                                                                        else {
                                                                                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                                                        }
                                                                                    })
                                                                                    .catch(err => {
                                                                                        console.log('Error occured', err);
                                                                                        getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                                                    })
                                                                            }
                                                                            else {
                                                                                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                                            }
                                                                        })
                                                                        .catch(err => {
                                                                            console.log('Error occured', err);
                                                                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                                        })
                                                                }
                                                                else {
                                                                    getSweetAlert('Oops...', 'Something went wrong!', 'info');
                                                                }
                                                            })
                                                            .catch(err => {
                                                                console.log('Error occured', err);
                                                                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                            })
                                                    })
                                                    .catch(err => {
                                                        console.log('Error occured', err);
                                                        handleCancelPayment();
                                                        getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                    })
                                            }
                                            else {
                                                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                            }
                                        })
                                        .catch(err => {
                                            console.log('Error occured', err);
                                            handleCancelPayment();
                                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                        })
                                }
                                else {
                                    dispatch(addOrder({
                                        ...orderObj, orderData: {
                                            ...orderObj.orderData,
                                            status: "success"
                                        }
                                    }))
                                        .then(res => {
                                            console.log('Response after adding order details', res);

                                            if (res.meta.requestStatus === "fulfilled") {

                                                dispatch(addCertificate({ userId: personalInfoData?.id, courses: orderObj?.items }))
                                                    .then(res => {
                                                        console.log('Response after adding certificate details', res);

                                                        if (res.meta.requestStatus === "fulfilled") {

                                                            dispatch(deleteCart(cartId))
                                                                .then(res => {
                                                                    console.log('Response after deleting cart', res);

                                                                    if (res.meta.requestStatus === "fulfilled") {

                                                                        dispatch(updateCoursePurchaseStatus({ id: personalInfoData?.id }))
                                                                            .then(res => {
                                                                                console.log('Response after updating user data', res);

                                                                                if (res.meta.requestStatus === "fulfilled") {

                                                                                    dispatch(addNotification({ ...user_notification_obj, title: "Course purchased successfully" }))
                                                                                        .then(res => {
                                                                                            console.log('Response after adding notification', res);

                                                                                            if (res.meta.requestStatus === "fulfilled") {

                                                                                                setIsLottieTransitioning(true);
                                                                                                setTimeout(() => {
                                                                                                    setPaymentStage('success');
                                                                                                    setIsLottieTransitioning(false);
                                                                                                    setShowConfetti(true);
                                                                                                    setTimeout(() => setShowConfetti(false), 4000);
                                                                                                }, 3000);
                                                                                            }
                                                                                            else {
                                                                                                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                                                            }
                                                                                        })
                                                                                        .catch(err => {
                                                                                            console.log('Error occured', err);
                                                                                            handleCancelPayment();
                                                                                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                                                        })
                                                                                }
                                                                                else {
                                                                                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                                                }
                                                                            })
                                                                            .catch(err => {
                                                                                console.log('Error occured', err);
                                                                                handleCancelPayment();
                                                                                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                                            })
                                                                    }
                                                                    else {
                                                                        getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                                    }
                                                                })
                                                                .catch(err => {
                                                                    console.log('Error occured', err);
                                                                    handleCancelPayment();
                                                                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                                })
                                                        }
                                                        else {
                                                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                        }
                                                    })
                                                    .catch(err => {
                                                        console.log('Error occured', err);
                                                        handleCancelPayment();
                                                        getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                    })
                                            }
                                            else {
                                                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                            }
                                        })
                                        .catch(err => {
                                            console.log('Error occured', err);
                                            handleCancelPayment();
                                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                        })
                                }
                            }
                            else {
                                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                            }
                        })
                        .catch(err => {
                            console.log('Error occured', err);
                            handleCancelPayment();
                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                        })
                }
            }, 4000);
        }

        return () => {
            clearInterval(progressInterval);
            clearTimeout(timeout);
        };
    }, [isCancelled, paymentStage]);

    const handleCancelPayment = () => {

        dispatch(saveTransaction({ ...payment_obj, status: 'failed' }))
            .then(res => {
                // console.log('Response after adding transaction details', res);

                if (res.meta.requestStatus === "fulfilled") {
                    if (type == 'visa') {
                        dispatch(saveStepPayment({ applicationId: personalInfoData?.application_id, payload: { ...application_payment_obj, status: 'failed' } }))
                            .then(res => {
                                // console.log('Response after adding payment data in application table', res);

                                if (res.meta.requestStatus === "fulfilled") {

                                    dispatch(addActivity({ ...activity_obj_failed, application_id: res?.meta?.arg?.applicationId }))
                                        .then(res => {
                                            // console.log('Response for adding activity', res);

                                            if (res.meta.requestStatus === "fulfilled") {

                                                dispatch(addNotification({ ...user_notification_obj, title: "Payment failed. Try to pay fee for visa application again..." }))
                                                    .then(res => {
                                                        // console.log('Response after adding notification', res);

                                                        if (res.meta.requestStatus === "fulfilled") {
                                                            setIsCancelled(true);
                                                            setIsLottieTransitioning(true);
                                                            setTimeout(() => {
                                                                setPaymentStage('failed');
                                                                setIsLottieTransitioning(false);
                                                            }, 1200);
                                                        }
                                                        else {
                                                            getSweetAlert('Oops...', 'Something went wrong!', 'info');
                                                        }
                                                    })
                                                    .catch(err => {
                                                        console.log('Error occured', err);
                                                        getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                                    })
                                            }
                                            else {
                                                getSweetAlert('Oops...', 'Something went wrong!', 'info');
                                            }
                                        })
                                        .catch(err => {
                                            console.log('Error occured', err);
                                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                        })
                                }
                                else {
                                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                }
                            })
                            .catch(err => {
                                console.log('Error occured', err);
                                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                            })
                    }
                    else {
                        dispatch(addOrder({
                            ...orderObj, orderData: {
                                ...orderObj.orderData,
                                status: "failed"
                            }
                        }))
                            .then(res => {
                                // console.log('Response for adding order status', res);

                                if (res.meta.requestStatus === "fulfilled") {

                                    dispatch(addNotification({ ...user_notification_obj, title: "Payment failed. Try to purchase course again..." }))
                                        .then(res => {
                                            // console.log('Response after adding notification', res);

                                            if (res.meta.requestStatus === "fulfilled") {
                                                setIsCancelled(true);
                                                setIsLottieTransitioning(true);
                                                setTimeout(() => {
                                                    setPaymentStage('failed');
                                                    setIsLottieTransitioning(false);
                                                }, 1200);
                                            }
                                            else {
                                                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                            }
                                        })
                                        .catch(err => {
                                            console.log('Error occured', err);
                                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                        })
                                }
                                else {
                                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                                }
                            })
                            .catch(err => {
                                console.log('Error occured', err);
                                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                            })
                    }
                }
                else {
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    };

    const handleRetryPayment = () => {
        // console.log("Redirecting to payment retry...");
        navigate(type == 'visa' ? `/application-form/${country_id}` : '/payment');
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    const handleShareStatus = () => {
        const message = `Visa Application Submitted - Global Gateway\nApplication ID: ${personalInfoData?.application_id}\n\nYour trusted platform for secure and seamless visa processing.`;

        if (navigator.share) {
            navigator.share({
                title: 'Visa Application Submitted',
                text: message,
            }).catch(() => {
                navigator.clipboard.writeText(message);
                console.log('Application details copied to clipboard!');
            });
        } else {
            navigator.clipboard.writeText(message);
            // console.log('Application details copied to clipboard!');
        }
    };

    // console.log('Received data', paymentDetails, personalInfoData, currentDate, visaData);

    if (isLottieTransitioning) {
        const isSuccess = !isCancelled;
        const animationData = isSuccess ? successAnimation : errorAnimation;
        const transitionText = isSuccess ? "Confirming Your Payment" : "Cancelling Transaction";

        return (
            <div className="fixed inset-0 w-screen h-screen bg-white flex flex-col items-center justify-center overflow-hidden z-[100] font-inter">
                <LottieAnimation
                    animationData={animationData}
                    isSuccess={isSuccess}
                />
                <h2 className="mt-8 text-2xl font-bold text-gray-800">
                    {transitionText}
                </h2>
                <p className="text-gray-500 mt-2">Please wait a moment</p>
            </div>
        );
    }

    // Processing Screen
    if (paymentStage === "processing") {
        return (
            <PaymentProcessing handleCancelPayment={handleCancelPayment} processingProgress={processingProgress} />
        )
    }

    // Failed Screen - ALL RED
    if (paymentStage === 'failed') {
        return (
            <PaymentFailed currentDate={currentDate} handleRetryPayment={handleRetryPayment} totalAmount={type == 'visa' ? paymentDetails?.total_amount : total} />
        )
    }

    // Success Screen
    return (
        <PaymentSuccess paymentDetails={paymentDetails} personalInfoData={personalInfoData} currentDate={currentDate} passportData={passportData} visaData={visaData} visaSpecification={visaSpecification} handlePrintReceipt={handlePrintReceipt} handleShareStatus={handleShareStatus} showConfetti={showConfetti}
            type={type} no_course={cartItems?.length} promocode={discount && Number(discount) > 0 ? true : false} />
    )
}