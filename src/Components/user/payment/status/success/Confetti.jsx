import React from 'react'

const Confetti = ({showConfetti}) => {
    return (
        <>
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-20px`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        >
                            <div
                                className="w-2 h-2 md:w-3 md:h-3 rounded-full"
                                style={{
                                    backgroundColor: ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)]
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default Confetti