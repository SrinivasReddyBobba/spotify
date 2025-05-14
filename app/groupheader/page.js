'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Topheader from '../header/head';
import Sidebar from '../header/slider';

export default function LayoutWrapper({ children }) {
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const toggleSidebar = () => setSidebarToggled(!sidebarToggled);

  return (
    <div id="wrapper" className="flex">
      <Sidebar toggleSidebar={toggleSidebar} sidebarToggled={sidebarToggled} />
      <div className={`flex-1 ${sidebarToggled ? 'sidebar-toggled' : ''}`}>
        <Topheader toggleSidebar={toggleSidebar} />
         <div>
        {children}
      </div>
      </div>
    </div>
  );
}
