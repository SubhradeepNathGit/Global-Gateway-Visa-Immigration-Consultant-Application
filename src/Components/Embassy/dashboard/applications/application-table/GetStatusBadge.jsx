// import React from 'react'
// import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

// const GetStatusBadge = ({status}) => {
//   const statusConfig = {
//     pending: {
//       bg: "bg-yellow-100",
//       text: "text-yellow-700",
//       icon: Clock,
//       label: "Pending"
//     },
//     approved: {
//       bg: "bg-green-100",
//       text: "text-green-700",
//       icon: CheckCircle,
//       label: "Approved"
//     },
//     rejected: {
//       bg: "bg-red-100",
//       text: "text-red-700",
//       icon: XCircle,
//       label: "Rejected"
//     },
//     under_review: {
//       bg: "bg-blue-100",
//       text: "text-blue-700",
//       icon: AlertCircle,
//       label: "Under Review"
//     }
//   };

//   const config = statusConfig[status];
//   const Icon = config?.icon;

//   return (
//     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
//       <Icon size={14} />
//       {config?.label}
//     </span>
//   );
// }

// export default GetStatusBadge



import React from 'react';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

const GetStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: Clock,
      label: "Pending"
    },
    approved: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: CheckCircle,
      label: "Approved"
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: XCircle,
      label: "Rejected"
    },
    under_review: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: AlertCircle,
      label: "Under Review"
    }
  };

  const config = statusConfig[status];

  if (!config) {
    return (
      <span className="inline-flex items-center px-7 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        N/A
      </span>
    );
  }

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
};

export default GetStatusBadge;