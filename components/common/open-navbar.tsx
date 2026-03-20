'use client'

import { getPageTitle } from "@/lib/helper";
import { usePathname, useSearchParams } from "next/navigation";

interface OpenNavbarProps {
  onMenuClick?: () => void;
}

export default function OpenNavbar({ onMenuClick }: Readonly<OpenNavbarProps>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 lg:left-64 h-14 sm:h-16">
      <div className="px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left side - Mobile menu button and Dashboard title */}
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-1.5 sm:p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 mr-2"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              {/* Page title */}
              <h1 className="ml-1 sm:ml-2 lg:ml-0 text-md sm:text-lg lg:text-2xl font-semibold text-gray-900 truncate">
                {pathname.includes('pos-transaction-history') && pathname.split('/').length <= 3
                  ? 'POS Transaction History'
                  : getPageTitle(pathname, Object.fromEntries(searchParams.entries()))}
              </h1>

            </div>
          </div>


        </div>
      </div>
    </nav>
  );
}