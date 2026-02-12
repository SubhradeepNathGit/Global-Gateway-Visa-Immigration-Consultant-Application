import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addContactMessage } from '../../../Redux/Slice/contactSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { MdArrowOutward } from 'react-icons/md';
import { addNotification } from '../../../Redux/Slice/notificationSlice';

const ContactForm = ({ setShowToast }) => {
    const dispatch = useDispatch();

    const form = useForm();
    const { register, handleSubmit, reset, formState } = form;
    const { errors, isSubmitting } = formState;

    const { contactLoading, contactData, contactError } = useSelector(state => state.contact);

    const onSubmit = async (data) => {
        // console.log('Contact message details', data);

        const notification_obj = {
            application_id: null,
            title: `New message received from user, email I'd ${data.email?.slice(0, 5)}######}`,
            receiver_type: 'admin',
            receiver_country_id: null,
            mark_read: false
        }

        try {
            const msg_obj = {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                status: "pending",
                reply_message: null
            }
            await new Promise(resolve => setTimeout(resolve, 1500));

            dispatch(addContactMessage(msg_obj))
                .then(res => {
                    // console.log('Response for adding contact message', res);

                    if (res.meta.requestStatus === "fulfilled") {

                        dispatch(addNotification(notification_obj))
                            .then(res => {
                                // console.log('Response for adding notification', res);

                                if (res.meta.requestStatus === "fulfilled") {
                                    setShowToast(true);
                                    reset();
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

            setTimeout(() => setShowToast(false), 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    return (
        <div className="flex-none w-1/2 flex items-stretch">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="w-full"
            >
                <div className="bg-gradient-to-br from-[rgba(50,132,209,0.95)] to-[rgba(50,132,209,0.8)] border border-[rgba(50,132,209,0.3)] p-6 xs:p-8 sm:p-10 md:p-12 rounded-3xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] w-full">
                    <h4 className="font-semibold mb-4 text-white text-center text-2xl sm:text-3xl md:text-4xl">
                        Send Us Message
                    </h4>
                    <p className="text-white/90 mb-8 md:mb-10 text-center text-sm md:text-base">
                        Let us know how we can help by filling out the form below.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    autoComplete="name"
                                    {...register("name", {
                                        required: "Name is required",
                                    })}
                                    className={`w-full py-3.5 px-4 rounded-xl bg-white/10 backdrop-blur-xl ${errors.name ? 'border border-red-500' : 'border border-white/20'
                                        } outline-none text-white text-[0.95rem] transition-all duration-300 placeholder:text-white/60 focus:border-white/40 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.2)]`}
                                />
                                {errors.name && (
                                    <p className="text-red-200 text-xs mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex-1">
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    autoComplete="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                                            message: "Enter a valid email",
                                        },
                                    })}
                                    className={`w-full py-3.5 px-4 rounded-xl bg-white/10 backdrop-blur-xl ${errors.email ? 'border border-red-500' : 'border border-white/20'
                                        } outline-none text-white text-[0.95rem] transition-all duration-300 placeholder:text-white/60 focus:border-white/40 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.2)]`}
                                />
                                {errors.email && (
                                    <p className="text-red-200 text-xs mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Your Subject"
                                {...register("subject", {
                                    required: "Subject is required"
                                })}
                                className={`w-full py-3.5 px-4 rounded-xl bg-white/10 backdrop-blur-xl ${errors.subject ? 'border border-red-500' : 'border border-white/20'
                                    } outline-none text-white text-[0.95rem] transition-all duration-300 placeholder:text-white/60 focus:border-white/40 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.2)]`}
                            />
                            {errors.subject && (
                                <p className="text-red-200 text-xs mt-1">
                                    {errors.subject.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-8">
                            <textarea
                                rows={5}
                                placeholder="Your Message"
                                {...register("message", {
                                    required: "Message is required",
                                    maxLength: {
                                        value: 150,
                                        message: "Message should under 150 characters"
                                    }
                                })}
                                className={`w-full py-3.5 px-4 rounded-xl bg-white/10 backdrop-blur-xl ${errors.message ? 'border border-red-500' : 'border border-white/20'
                                    } outline-none text-white text-[0.95rem] resize-none transition-all duration-300 font-[inherit] placeholder:text-white/60 focus:border-white/40 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.2)]`}
                            />
                            {errors.message && (
                                <p className="text-red-200 text-xs mt-1">
                                    {errors.message.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-white/15 backdrop-blur-xl border border-white/30 py-3.5 px-8 rounded-full text-white font-semibold text-[0.95rem] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                } transition-all duration-300 flex items-center justify-center gap-2 ${!isSubmitting && 'hover:bg-white/25 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'
                                }`}
                        >
                            <MdArrowOutward className="text-lg" />
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default ContactForm;