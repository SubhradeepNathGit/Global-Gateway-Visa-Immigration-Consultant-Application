import React from 'react'
import { useForm } from 'react-hook-form';
import { ArrowLeft, Send, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { updateMessage } from '../../../Redux/Slice/contactSlice';
import hotToast from '../../../util/alert/hot-toast';
import getSweetAlert from '../../../util/alert/sweetAlert';

const ReplyModal = ({ onClose, setIsReplying, message }) => {
    const dispatch = useDispatch();
     const { contactLoading, contactData, contactError } = useSelector(state => state.contact);
     
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            subject: `Re: Message from ${message.name}`,
            replyMessage: "",
        },
    });

    const replyMessage = watch("replyMessage");

    const onSubmit = async (data) => {

        const reply_obj = {
            id: message.id,
            reply_subject: data.subject,
            reply_message: data.replyMessage,
            status: 'replied'
        }
        // console.log("Reply data:", reply_obj);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        dispatch(updateMessage(reply_obj))
            .then(res => {
                // console.log('Response for replying message', res);

                if (res?.meta?.requestStatus == "fulfilled") {
                    hotToast('Message replied successfully', "success");
                    onClose();
                }
                else {
                    hotToast('Message replied failed', "error");
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 w-full max-w-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-slate-700/50 p-5 sm:p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsReplying(false)}
                            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-400" />
                        </button>
                        <h2 className="text-lg sm:text-xl font-semibold text-white">Reply to Message</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6 space-y-4">
                    <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-400 font-semibold text-sm">
                                    {message.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white">To: {message.name}</div>
                                <div className="text-xs text-slate-400 truncate">{message.email}</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                        <input
                            type="text"
                            {...register("subject", { required: "Subject is required" })}
                            className="w-full px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                            placeholder="Enter subject"
                        />
                        {errors.subject && (
                            <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Your Reply</label>
                        <textarea
                            {...register("replyMessage", {
                                required: "Reply message cannot be empty",
                                minLength: {
                                    value: 12,
                                    message: "Reply must be at least 12 characters",
                                },
                            })} rows={6}
                            className="w-full px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
                            placeholder="Type your reply here..."
                        />
                        <div className="text-xs text-slate-400 mt-1">
                            {replyMessage?.length || 0} characters
                        </div>
                        {errors.replyMessage && (
                            <p className="text-red-400 text-xs mt-1">{errors.replyMessage.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm transition-all flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            {isSubmitting ? "Sending..." : "Send Reply"}
                        </button>
                        <button type="button"
                            onClick={() => setIsReplying(false)}
                            className="px-4 py-2.5 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 text-white text-sm transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ReplyModal