import Swal from "sweetalert2";

const getSweetAlert = (alertTitle, alertText, alertIcon) => {
  Swal.fire({
    title: alertTitle,
    html: alertText,
    icon: alertIcon,
    background: "rgba(255, 255, 255, 0.06)",
    backdrop: ` rgba(0, 0, 0, 0.1) blur(10px)`,
    color: "#fff",
    showConfirmButton: true,
    confirmButtonColor: "red",
    scrollbarPadding: false,
    heightAuto: false,
    customClass: {
      popup: [
        "backdrop-blur-2xl",
        "bg-white/10",
        "border",
        "border-white/25",

        "shadow-2xl",
        "p-6",
        "text-white",
        "saturate-150",
        "brightness-110",
        "max-w-sm",
      ].join(" "),
    },
  });
};

export const getConfirmSweetAlert = ({
  title = "Activate without embassy?",
  text = "Admin want to activate without embassy?",
  confirmButtonText = "Yes, Proceed",
  cancelButtonText = "Not Now",
  icon = "warning",
}) => {
  return Swal.fire({
    title,
    html: `<div style="font-size: 0.95rem; color: #cbd5e1; margin-top: 0.5rem; line-height: 1.5;">${text}</div>`,
    icon,
    background: "rgba(30, 41, 59, 0.95)",
    backdrop: `rgba(0, 0, 0, 0.5) blur(10px)`,
    color: "#fff",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#475569",
    reverseButtons: true,
    focusCancel: false,
    scrollbarPadding: false,
    heightAuto: false,
    customClass: {
      popup: [
        "backdrop-blur-2xl",
        "bg-slate-900/90",
        "border",
        "border-slate-700/60",
        "shadow-2xl",
        "p-6",
        "text-white",
        "max-w-md",
        "rounded-2xl",
      ].join(" "),
      title: "text-lg font-bold text-white",
      confirmButton: "px-5 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-lg",
      cancelButton: "px-5 py-2.5 rounded-xl font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer",
    },
  });
};

export default getSweetAlert;