import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addCourseRating } from '../../../../Redux/Slice/courseRatingsSlice';
import hotToast from '../../../../util/alert/hot-toast';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import { useCourseAvgRating } from '../../../../tanstack/query/getCourseAvgRating';
import { useCourseWiseCourseRating } from '../../../../tanstack/query/getUserWiseCourseRating';

const StarRating = ({ courseId, userId }) => {

    const dispatch = useDispatch();

    const { loading, data: specificRating, error: isRatingLoading } = useCourseWiseCourseRating(courseId, userId);

    const [tempRating, setTempRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [check, setCheck] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (specificRating != null) {
            setSubmitted(true);
            setTempRating(specificRating?.rating);
        }
    }, [specificRating]);

    const displayRating = submitted ? tempRating : hoverRating || check;

    const handleClick = (rating) => {
        if (!submitted) {
            setTempRating(rating);
            setCheck(rating);
        }
    };

    const handleHover = (rating) => {
        if (!submitted) setHoverRating(rating);
    };

    const handleLeave = () => {
        if (!submitted) setHoverRating(0);
    };

    const rating_obj = {
        user_id: userId,
        course_id: courseId,
        rating: tempRating
    }
    const handleSubmit = async () => {
        if (tempRating === 0) return;
        if (!userId) return hotToast("Please login to rate", "error");

        try {
            dispatch(addCourseRating(rating_obj))
                .then(res => {
                    // console.log('Response for adding rating of specific courses', res);

                    if (res.meta.requestStatus === "fulfilled") {
                        setSubmitted(true);
                        hotToast("Rating submitted!", "success");
                    }
                    else {
                        getSweetAlert('Oops...', res.payload, 'info');
                    }
                })
                .catch((err) => {
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                    console.log("Error occurred", err);
                });
        } catch (err) {
            hotToast("Failed to submit rating", "error");
            console.error(err);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5]?.map(star => (
                    <button key={star} onClick={() => handleClick(star)} onMouseEnter={() => handleHover(star)} onMouseLeave={handleLeave} disabled={submitted}
                        className={`transition-all transform focus:outline-none ${submitted ? 'cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}`} >
                        <Star
                            className={`w-5 h-5 transition-colors ${star <= displayRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                    </button>
                ))}
                <span className="text-sm text-slate-600 ml-2">
                    {submitted ? `${tempRating}/5` : tempRating > 0 ? `${tempRating}/5` : 'Rate this course'}
                </span>
            </div>

            {!submitted && tempRating > 0 && (
                <button onClick={handleSubmit}
                    className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors cursor-pointer"
                >
                    Submit
                </button>
            )}

            {submitted && (
                <span className="text-green-600 text-sm font-medium ml-2">
                    Submitted!
                </span>
            )}
        </div>
    );
};

export default StarRating;
