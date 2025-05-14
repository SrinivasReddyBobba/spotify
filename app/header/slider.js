'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Sidebar({ toggleSidebar, sidebarToggled }) {
    const [windowWidth, setWindowWidth] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
                if (window.innerWidth < 768) {
                    toggleSidebar(false);
                }
            };
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [toggleSidebar]);

    return (
        <div
            className={`navbar-nav bg-primary sidebar sidebar-dark accordion ${sidebarToggled ? 'toggled' : ''
                }`}
            id="accordionSidebar"
        >
            <Link
                href="/"
                className="sidebar-brand d-flex align-items-center justify-content-center"
            >
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink"></i>
                </div>
                <div className="sidebar-brand-text mx-3">Spotify</div>
            </Link>

            <hr className="sidebar-divider my-0" />

            <ul className="nav flex-column">
                <li className={`nav-item ${pathname.includes('/callback') && typeof window !== 'undefined' && window.location.search.includes('tab=playlists') ? 'active' : ''}`}>
                    <Link href="/callback?tab=playlists" className="nav-link">
                        <i className="fas fa-fw fa-music"></i>
                        <span>Playlists</span>
                    </Link>
                </li>

                <li className={`nav-item ${pathname.includes('/callback') && typeof window !== 'undefined' && window.location.search.includes('tab=saved') ? 'active' : ''}`}>
                    <Link href="/callback?tab=saved" className="nav-link">
                        <i className="fas fa-fw fa-heart"></i>
                        <span>Saved Tracks</span>
                    </Link>
                </li>
            </ul>


            <div className="text-center d-none d-md-inline mt-auto mb-3">
                <button
                    className="rounded-circle border-0"
                    id="sidebarToggle"
                    onClick={toggleSidebar}
                ></button>
            </div>
        </div>
    );
}
