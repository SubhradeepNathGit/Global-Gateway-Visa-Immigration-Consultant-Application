export default function Tabs({ activeTab, setActiveTab }) {

    const tabs = ["basic", "details", "instructor", "features", "video", "documents", "pricing",];

    return (
        <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-px bg-slate-700/50" />
            <div className="flex gap-6 px-6">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative py-4 text-sm font-medium transition-colors cursor-pointer
              ${activeTab === tab ? "text-blue-400" : "text-slate-400 hover:text-slate-300"}`} >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {activeTab === tab && (
                            <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-blue-500 rounded-full" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
