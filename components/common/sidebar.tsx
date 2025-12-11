'use client';

import { numoniLogoDark } from '@/constant/icons';
import { navigationItems } from '@/data';
import { isNavigationItemActive } from '@/lib/helper';
import { SidebarProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const allPaths = navigationItems.map(item => item.path);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-50",
          "transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:w-64",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Close Button */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Image src={numoniLogoDark} alt="nuMoni" width={120} height={40} />
            {/* Close button - only visible on mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = isNavigationItemActive(item.path, pathname, allPaths);
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={cn(
                    "flex items-center px-3 py-4 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-gradient-to-r from-white to-green-50 text-theme-dark-green border-r-4 font-bold border-theme-dark-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className={cn(
                    "mr-3",
                    isActive ? "text-theme-dark-green" : "text-gray-600"
                  )}>
                    <IconComponent size={20} />
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}