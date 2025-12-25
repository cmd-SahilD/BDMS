import Link from "next/link";

/**
 * Reusable navigation item component for portal sidebars
 * Extracted from duplicate NavItem functions in all Shell components
 */
export default function NavItem({ href, icon: Icon, label, active, count }) {
    return (
        <Link
            href={href}
            className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all
                ${active 
                    ? 'bg-red-600 text-white shadow-md shadow-red-200' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
        >
            <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
                {label}
            </div>
            {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full 
                    ${active ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'}`}>
                    {count}
                </span>
            )}
        </Link>
    );
}
