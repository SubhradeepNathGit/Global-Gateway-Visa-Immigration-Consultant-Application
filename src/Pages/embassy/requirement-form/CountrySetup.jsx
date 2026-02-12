import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import CountryInputField from "../../../Components/embassy/addCountry/CountryInputField"
import { useDispatch, useSelector } from "react-redux";
import { checkLoggedInUser } from "../../../Redux/Slice/auth/checkAuthSlice";
import { fetchEmbassyById, updateEmbassyById } from "../../../Redux/Slice/embassySlice";
import getSweetAlert from "../../../util/alert/sweetAlert";
import { addOrUpdateCountry } from "../../../Redux/Slice/countrySlice";
import hotToast from "../../../util/alert/hot-toast";
import { useNavigate } from "react-router-dom";

const CountrySetup = () => {
  const dispatch = useDispatch(),
    { isuserLoading: isEmbassyLoading, userAuthData: loggedEmbassyData, userError } = useSelector(state => state.checkAuth),
    { isEmbassyLoading: isEmbassyDetailsLoading, embassyData, hasEmbassyerror } = useSelector(state => state.embassy),
    { isAllCountryListLoading, getAllCountryList, getSpecificCountry, isAllCountryListError } = useSelector(state => state.allCountry);

  const [image, setImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const { control, register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: {
      country: embassyData?.country_name || "",
      description: "",
      countryImage: null
    }
  });

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setValue("countryImage", file, { shouldValidate: true });
    }
  };

  useEffect(() => {
    dispatch(checkLoggedInUser())
      .then(res => {
        // console.log('Response for fetching user profile', res);
      })
      .catch((err) => {
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
        console.log("Error occurred", err);
      });
  }, [dispatch]);

  // console.log('Logged embassy auth data', loggedEmbassyData);
  // console.log('Logged embassy details', embassyData);

  useEffect(() => {
    if (loggedEmbassyData) {
      dispatch(fetchEmbassyById(loggedEmbassyData?.id))
        .then(res => {
          // console.log('Response for fetching embassy details', res);
        })
        .catch((err) => {
          getSweetAlert('Oops...', 'Something went wrong!', 'error');
          console.log("Error occurred", err);
        });
    }
  }, [dispatch, loggedEmbassyData]);

  useEffect(() => {
    if (embassyData?.country_name) {
      setValue("country", embassyData.country_name);
    }
  }, [embassyData, setValue]);

  // submit country data
  const handleRegisteredCountry = (data) => {
    // console.log("Form Data:", data);

    const { id, ...newEmbassyObj } = embassyData;

    const countryData = {
      name: embassyData?.country_name,
      description: data.description,
      image: data.countryImage,
      is_blocked: true,
      is_approved: "pending",

      user_type: 'embassy'
    };
    // console.log('Received data from embassy form', countryData);

    dispatch(addOrUpdateCountry({ countryData, type: "addCountry" }))
      .then(res => {
        // console.log('Response for adding country', res);

        if (res?.meta?.requestStatus == "fulfilled") {

          const updatedEmbassyObj = { ...newEmbassyObj, is_country_available: true, country_id: res?.payload?.countryRow?.id };
          // console.log('New embassy obj', updatedEmbassyObj);

          dispatch(updateEmbassyById({ id: embassyData?.id, updateData: updatedEmbassyObj }))
            .then(res => {
              // console.log('Response after updating embassy data', res);

              if (res?.meta?.requestStatus == "fulfilled") {
                navigate('/embassy/review');
                hotToast("Request submitted successfully!", "success");
                reset();
                setImage(null);
              }
              else {
                hotToast("Request submission failed!", "error");
              }
            })
            .catch(err => {
              console.log('Error occured', err);
              getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
        }
        else {
          getSweetAlert('Oops...', res?.payload, 'error');
        }
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      });
  }


  if (isEmbassyDetailsLoading) {
    return (
      <div className='flex flex-col h-screen items-center justify-center bg-black'>
        <div className="w-18 h-18 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span className='mt-5 text-white'>Loading...</span>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4 py-8"
      style={{
        backgroundImage: `url(/Slider1.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="w-full max-w-6xl flex flex-col md:flex-row shadow-2xl rounded-xl overflow-hidden
        md:h-[650px]"
      >
        {/* LEFT VIDEO (TABLET + DESKTOP) */}
        <div className="hidden md:block md:w-1/2 relative bg-black/80">
          <video autoPlay loop muted playsInline className="absolute w-full h-full object-cover">
            <source src="/signup.mp4" type="video/mp4" />
          </video>

          <div className="relative z-10 text-white h-full px-10 flex flex-col justify-center bg-black/50">
            <h4 className="text-3xl font-bold mb-4">
              Country Setup
            </h4>
            <p className="text-base mb-6">
              Add your embassy country details to continue verification
            </p>

            <div className="flex items-center gap-2 text-sm text-white/70">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>One-time setup process</span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM (ALL DEVICES) */}
        <form onSubmit={handleSubmit(handleRegisteredCountry)}
          className="w-full md:w-1/2 bg-black/20 backdrop-blur-md text-white
          px-6 sm:px-8 md:px-12 py-8 flex flex-col justify-center gap-6">

          <h4 className="text-2xl sm:text-3xl font-bold">
            Embassy Country Details
          </h4>

          <p className="text-sm text-white/60">
            This information will be reviewed by admin before approval
          </p>

          <Controller name="country" control={control} rules={{ required: "Country is required" }}
            render={({ field }) => (
              <CountryInputField label="Country" name="country" disabled={true} value={field.value} />
            )}
          />

          {errors.country && (
            <p className="text-red-400 text-xs mt-1">{errors.country.message}</p>
          )}

          {/* DESCRIPTION */}
          <div className="relative">
            <textarea
              rows={4}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 400,
                  message: "Minimum 400 characters required",
                },
                maxLength: {
                  value: 600,
                  message: "Description should be between 400–600 characters",
                },
                pattern: {
                  value: /^[A-Za-z0-9,.;\-()\[\]{}'" ]+$/,
                  message: "Only letters, numbers, spaces, and characters , . ; - ( ) [ ] { } ' \" are allowed",
                }
              })}
              placeholder=" "
              className="w-full px-4 py-3 rounded-md bg-transparent text-white placeholder-white/70
              border border-white/50 focus:border-white transition duration-300
              focus:outline-none peer resize-none glass-scrollbar"
            />
            <label
              className="absolute left-3 transition-all duration-300 pointer-events-none
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70
              peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-black/50 peer-focus:px-1 peer-focus:text-white
              peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs
              peer-[:not(:placeholder-shown)]:bg-black/50 peer-[:not(:placeholder-shown)]:px-1"
            >
              Country Description
            </label>
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* IMAGE UPLOAD */}
          <div onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition
            ${dragActive ? "border-white bg-white/10" : "border-white/40"}`}>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="countryImage"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImage(file);
                  setValue("countryImage", file, { shouldValidate: true });
                }
              }}
            />

            <label htmlFor="countryImage" className="cursor-pointer">
              {image ? (
                <p className="text-sm text-white truncate">{image.name}</p>
              ) : (
                <p className="text-sm flex flex-col">
                  <span className="text-white/70">
                    Drag & drop country image or{" "}
                    <span className="underline">browse</span>
                  </span>
                  <span className="text-[12px]">
                    Upload an image (recommended: 800x600px)
                  </span>
                </p>
              )}
            </label>

            <input
              type="hidden"
              {...register("countryImage", {
                required: "Country image is required",
                validate: (file) => {
                  if (!file) return "Country image is required";

                  if (!file.type?.match(/image\/(png|jpeg|jpg)/)) {
                    return "Only PNG, JPG, JPEG files are allowed";
                  }

                  if (file.size > 2 * 1024 * 1024) {
                    return "Maximum file size is 2 MB";
                  }

                  return true;
                },
              })}
            />

            {errors.countryImage && (
              <p className="text-red-400 text-xs mt-2">
                {errors.countryImage.message}
              </p>
            )}
          </div>

          <button type="submit" className={`py-3 mt-2 rounded-md font-semibold text-white bg-black hover:bg-black/80 transition duration-300 ${isAllCountryListLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            {isAllCountryListLoading ? 'Processing...' : 'Submit for Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CountrySetup;
