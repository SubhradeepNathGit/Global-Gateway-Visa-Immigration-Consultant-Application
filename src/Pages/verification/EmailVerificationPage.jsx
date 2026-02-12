import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import supabase from "../../util/Supabase/supabase";
import { verifyUser } from "../../Redux/Slice/auth/verification";
import { useGetIdByEmail } from "../../tanstack/query/getIdByEmail";
import { CircularProgress } from "@mui/material";
import { encodeBase64Url } from "../../util/encodeDecode/base64";

export default function EmailVerificationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  const { email, user_type } = useParams();

  const { data: userId } = useGetIdByEmail(email, user_type);

  // console.log('Verifying user details', email, user_type, userId);

  useEffect(() => {
    const verifyMagicLink = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        // console.log('Data', sessionData.session);

        if (error || !sessionData.session) {
          setStatus('error');

          dispatch(verifyUser({ email: email, user_type: user_type, status: 'failure', verification: 'failed' }))
            .then(res => {
              // console.log('Verifying response', res);
            })
            .catch(err => {
              console.log('Error occured', err);
            })
        }
        else {
          setStatus('success');

          dispatch(verifyUser({ email: email, user_type: user_type, status: 'success', verification: 'success' }))
            .then(res => {
              // console.log('Verifying response', res);
            })
            .catch(err => {
              console.log('Error occured', err);
            })

          setTimeout(() => navigate(user_type === 'user' ? '/authentication' : user_type === 'admin' ? '/admin/' : user_type === 'embassy' ? `/embassy/contact-setup/${encodeBase64Url(String(email))}/${encodeBase64Url('login')}` : '/'), 2000);
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    if (userId == null || !userId) {
      <div className="flex justify-center py-12">
        <CircularProgress />
      </div>
    }
    else {
      verifyMagicLink();
    }
  }, [navigate, userId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundImage: "url('/bgsign.jpg')" }}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="bg-white p-3 rounded-full shadow-lg flex items-center justify-center w-20 h-20">
        <FlightTakeoffIcon sx={{ fontSize: 40, color: 'red' }} />
      </motion.div>

      <motion.div className="mt-6 bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {status === "verifying" && (
          <>
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin" style={{ color: "#e53935" }} />
            <h2 className="text-2xl font-semibold text-gray-700">Verifying...</h2>
            <p className="text-gray-500 mt-2">Completing the confirmation — please wait.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="mx-auto mb-4 h-12 w-12" style={{ color: "#4caf50" }} />
            <h2 className="text-2xl font-semibold text-gray-700">Email Verified!</h2>
            <p className="text-gray-500 mt-2">Redirecting to login...</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto mb-4 h-12 w-12" style={{ color: "#c62828" }} />
            <h2 className="text-2xl font-semibold text-gray-700">Verification Failed</h2>
            <p className="text-gray-500 mt-2">Invalid or expired link — try signing up again or contact support.</p>
          </>
        )}
      </motion.div>
    </div>
  );
}





// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { CheckCircle, XCircle, Loader2 } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
// import supabase from "../../util/Supabase/supabase";
// import { verifyUser } from "../../Redux/Slice/auth/verification";

// export default function EmailVerificationPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [status, setStatus] = useState("verifying");

//   useEffect(() => {
//     const verifyMagicLink = async () => {
//       try {
//         // 1️⃣ Get session created by magic link
//         const { data, error } = await supabase.auth.getSession();

//         if (error || !data.session) {
//           setStatus("error");
//           return;
//         }

//         const user = data.session.user;
//         const email = user.email;
//         const role = user.user_metadata?.role || user.app_metadata?.role;

//         if (!email || !role) {
//           setStatus("error");
//           return;
//         }

//         // 2️⃣ Update verification status
//         await dispatch(
//           verifyUser({
//             email,
//             user_type: role,
//             status: "success",
//           })
//         ).unwrap();

//         setStatus("success");

//         // 3️⃣ Redirect by role
//         setTimeout(() => {
//           if (role === "user") navigate("/authentication");
//           else if (role === "embassy") navigate("/embassy/contact-setup");
//           else navigate("/admin/");
//         }, 2000);
//       } catch (err) {
//         console.error(err);
//         setStatus("error");
//       }
//     };

//     verifyMagicLink();
//   }, [dispatch, navigate]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-cover" style={{ backgroundImage: "url('/bgsign.jpg')" }}>
//       <motion.div
//         initial={{ opacity: 0, scale: 0.8 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6 }}
//         className="bg-white p-3 rounded-full shadow-lg w-20 h-20 flex items-center justify-center"
//       >
//         <FlightTakeoffIcon sx={{ fontSize: 40, color: "red" }} />
//       </motion.div>

//       <motion.div
//         className="mt-6 bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center"
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         {status === "verifying" && (
//           <>
//             <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-red-600" />
//             <h2 className="text-2xl font-semibold text-gray-700">Verifying...</h2>
//             <p className="text-gray-500 mt-2">Completing the confirmation — please wait.</p>
//           </>
//         )}

//         {status === "success" && (
//           <>
//             <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
//             <h2 className="text-2xl font-semibold text-gray-700">Email Verified!</h2>
//             <p className="text-gray-500 mt-2">Redirecting...</p>
//           </>
//         )}

//         {status === "error" && (
//           <>
//             <XCircle className="mx-auto mb-4 h-12 w-12 text-red-700" />
//             <h2 className="text-2xl font-semibold text-gray-700">Verification Failed</h2>
//             <p className="text-gray-500 mt-2">Invalid or expired link.</p>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// }
