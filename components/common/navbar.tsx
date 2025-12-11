'use client';

import { getPageTitle } from '@/lib/helper';
import { useBranchStore } from '@/stores/branch-store';
import { Plus } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import UserProfile from './user-profile';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openDialog } = useBranchStore();


  // Debug logging
  // console.log('Navbar - pathname:', pathname);
  // console.log('Navbar - searchParams:', searchParams.toString());
  // console.log('Navbar - searchParams entries:', Object.fromEntries(searchParams.entries()));

  // Function to get action button based on current page
  const getActionButton = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment === 'branch-level' || pathname.includes('branch-level')) {
      return (
        <button
          onClick={openDialog}
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Branch
        </button>
      );
    }

    // Default to Quick Links for Dashboard and other pages
    // return (
    //   <div suppressHydrationWarning>
    //     <Menubar className="border-0 bg-transparent shadow-none">
    //       <MenubarMenu>
    //         <MenubarTrigger className="flex items-center px-5 py-3 text-sm font-medium text-white bg-theme-dark-green rounded-2xl hover:bg-theme-dark-green cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-theme-dark-green data-[state=open]:bg-theme-dark-green data-[state=open]:text-white hover:text-white">
    //           Quick Links
    //           <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    //           </svg>
    //         </MenubarTrigger>
    //         <MenubarContent className="w-48">
    //           <MenubarItem>
    //             <Link href="#" className="w-full">Link 1</Link>
    //           </MenubarItem>
    //           <MenubarItem>
    //             <Link href="#" className="w-full">Link 2</Link>
    //           </MenubarItem>
    //           <MenubarItem>
    //             <Link href="#" className="w-full">Link 3</Link>
    //           </MenubarItem>
    //         </MenubarContent>
    //       </MenubarMenu>
    //     </Menubar>
    //   </div>
    // );
  };



  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 lg:left-64">
      <div className="px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left side - Mobile menu button and Dashboard title */}
          <div className="flex items-center min-w-0 flex-1">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-1.5 sm:p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              {/* Page title */}
              <h1 className="ml-1 sm:ml-2 lg:ml-0 text-md sm:text-lg lg:text-2xl font-semibold text-gray-900 truncate">
                {getPageTitle(pathname, Object.fromEntries(searchParams.entries()))}
              </h1>
              {/* Dynamic Action Button - Hidden on mobile, shown on tablet+ */}
              <div className="hidden sm:flex">
                {getActionButton()}
              </div>
            </div>
          </div>

          {/* Right side - Notifications and User Profile */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Upgrade Business - Hidden on mobile and small screens */}
            {/* <button className="hidden lg:flex items-center px-3 xl:px-4 py-2 xl:py-4 text-xs xl:text-sm font-medium bg-white hover:bg-gray-50 text-black relative overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-green-500 p-[2px]">
                <div className="w-full h-full bg-white rounded-full"></div>
              </div>
              <div className="relative flex items-center">
                <Image src={crownIcon} alt="crown" className="mr-1 xl:mr-2" width={18} height={18} />
                <span className="text-xs xl:text-sm font-medium hidden xl:inline">Upgrade Business</span>
                <span className="text-xs font-medium xl:hidden">Upgrade</span>
              </div>
            </button> */}

            {/* Chat Notifications */}
            {/* <button className="relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 border">
              <Image src={messageIcon} alt="message" width={24} height={24} className="sm:w-8 sm:h-8" />
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                43
              </span>
            </button> */}

            {/* Bell Notifications */}
            {/* <button className="relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 border">
              <Image src={notificationIcon} alt="notification" width={24} height={24} className="sm:w-8 sm:h-8" />
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                43
              </span>
            </button> */}

            {/* User Profile */}
            <div className="ml-1 sm:ml-0">
              <UserProfile />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}