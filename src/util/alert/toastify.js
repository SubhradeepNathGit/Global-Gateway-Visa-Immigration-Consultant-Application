import { toast } from "react-toastify";

const defaultConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
};

const toastifyAlert = {
    success: (msg, options = {}) => toast.success(msg, { ...defaultConfig, ...options }),
    error: (msg, options = {}) => toast.error(msg, { ...defaultConfig, ...options }),
    info: (msg, options = {}) => toast.info(msg, { ...defaultConfig, ...options }),
    warn: (msg, options = {}) => toast.warn(msg, { ...defaultConfig, ...options }),
};

export default toastifyAlert;
