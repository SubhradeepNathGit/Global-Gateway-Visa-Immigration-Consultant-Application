import React from 'react'

const ChargesHeader = () => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Charges and Discounts</h1>
                <p className="text-slate-400">Manage your application charges, additional fees and discounts</p>
            </div>
        </div>
    )
}

export default ChargesHeader