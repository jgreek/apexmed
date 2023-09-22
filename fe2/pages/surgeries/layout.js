import React from 'react';
import { useRouter } from 'next/router';
export default function SurgeriesLayout({ children }) {
 const router = useRouter();
  const pathname = router.pathname; // Getting the current pathname
  return (
    <section className="flex h-screen bg-gray-100">
      {/* Left sidebar */}
      <nav className="bg-blue-600 w-64 min-h-screen p-4">
        <div className="container mx-auto px-4 py-6 text-gray-800">
            <h1 className="text-4xl font-bold text-white mb-4 border-b-2 border-blue-400 pb-2">ApexMed</h1>
        </div>
        <ul>
          <NavItem href="/surgeries" currentPath={pathname}>
            Surgeries
          </NavItem>
          <NavItem href="/medications" currentPath={pathname}>
            Medical Inventory
          </NavItem>
            <NavItem href="/upload" currentPath={pathname}>
            Data Upload
          </NavItem>
          {/* Add other links as needed */}
        </ul>
      </nav>

      {/* Main content */}
      <div className="flex-1 p-10">
        {children}
      </div>
    </section>
  );
}

const NavItem = ({ href, currentPath, children }) => (
  <li className={`text-white mb-2 p-2 rounded ${currentPath === href ? 'bg-blue-800' : 'hover:bg-blue-500'}`}>
    <a href={href}>{children}</a>
  </li>
);
