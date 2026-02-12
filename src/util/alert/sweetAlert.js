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

export default getSweetAlert;