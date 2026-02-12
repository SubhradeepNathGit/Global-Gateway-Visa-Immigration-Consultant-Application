import React, { useEffect, useState } from "react";
import AdminProfileTopSection from "../../Components/admin/profile/AdminProfileTopSection";
import AdminHeader from "../../Components/admin/profile/AdminHeader";
import ActionBtn from "../../Components/admin/profile/ActionBtn";
import ProfileDetails from "../../Components/admin/profile/ProfileDetails";
import { useDispatch, useSelector } from "react-redux";
import getSweetAlert from "../../util/alert/sweetAlert";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { checkLoggedInUser } from "../../Redux/Slice/auth/checkAuthSlice";
import { updateAdmin } from "../../Redux/Slice/adminSlice";
import hotToast from "../../util/alert/hot-toast";

export default function AdminProfile() {
  const dispatch = useDispatch();
  const { userAuthData, isUserLoading } = useSelector(state => state.checkAuth);

  const [isEditing, setIsEditing] = useState(false);
  const [joinDate, setJoinDate] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      phone: ""
    }
  });

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  useEffect(() => {
    dispatch(checkLoggedInUser()).catch(() => {
      getSweetAlert('Oops...', 'Something went wrong!', 'error');
    });
  }, [dispatch]);

  useEffect(() => {
    if (userAuthData) {
      reset({
        name: userAuthData.name,
        phone: userAuthData.phone
      });
      setJoinDate(formatDate(userAuthData.created_at));
    }
  }, [userAuthData, reset]);

  const onSave = (data) => {
    const update_auth_obj = {
      ...userAuthData,
      name: data.name,
      phone: data.phone
    };

    dispatch(updateAdmin({ id: userAuthData.id, updateData: update_auth_obj }))
      .then(res => {
        // console.log('Response for updating profile', res);

        if (res?.meta?.requestStatus === "fulfilled") {
          dispatch(checkLoggedInUser());
          setIsEditing(false);
          hotToast('Profile updated successfully.', "success");
        } else {
          hotToast('Profile updation failed.', "error");
        }
      })
      .catch(() => getSweetAlert('Oops...', 'Something went wrong!', 'error'));
  };

  const onCancel = () => {
    reset({
      name: userAuthData.name,
      phone: userAuthData.phone
    });
    setIsEditing(false);
  };

  // console.log('Logged admin profile', userAuthData);

  if (isUserLoading || !userAuthData) {
    return (
      <div className="w-full min-h-screen">
        <Loader2 className="w-15 h-15 text-white animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="w-full max-h-screen">
      <AdminHeader />

      <div className="bg-transparent p-6 md:p-10 mt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8">
          <AdminProfileTopSection profile={{
            name: userAuthData.name,
            role: "Administrator"
          }} />

          <ActionBtn isEditing={isEditing} setIsEditing={setIsEditing} handleSave={handleSubmit(onSave)} handleCancel={onCancel} />
        </div>

        <ProfileDetails
          profile={{
            email: userAuthData.email,
            phone: userAuthData.phone,
            joinDate
          }}
          isEditing={isEditing} register={register} errors={errors} />
      </div>
    </div>
  );
}
