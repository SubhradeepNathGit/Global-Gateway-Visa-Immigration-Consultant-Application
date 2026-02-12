import React from 'react'
import { useNavigate } from 'react-router-dom'
import UpcommingAppointmtntRow from './UpcommingAppointmtntRow';

const UpcommingAppointmtnt = ({ upcomingAppointments }) => {

    const navigate = useNavigate();

    const upcommingAppointmentSorted = upcomingAppointments?.filter(app => new Date() < new Date(app?.appointment_date))

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
                <button
                    onClick={() => navigate("/embassy/dashboard/applications")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                    View All
                </button>
            </div>

            <div className="space-y-3">
                {upcommingAppointmentSorted?.length > 0 ?
                    upcommingAppointmentSorted?.slice(0, 3)?.map((apt, idx) => (
                        <UpcommingAppointmtntRow key={idx} apt={apt} />
                    ))
                    : 'No appointment availabe'}
            </div>
        </div>
    )
}

export default UpcommingAppointmtnt