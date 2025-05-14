"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Router } from "next/router";
import { FaPowerOff } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";

export default function Topheader({ toggleSidebar }) {

    return (
        <>
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4  shadow justify-content-between">
                    <button id="sidebarToggleTop" className="btn btn-link rounded-circle mr-3" onClick={toggleSidebar}>
                        <IoMenu />
                    </button>
                   <ul className="navbar-nav ml-auto">
    <li className="nav-item dropdown no-arrow float-end">
        <a className="nav-link dropdown-toggle" href="/" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="d-lg-inline text-gray-600 small text-dark">
                LogOut
            </span>
            <FaPowerOff />
        </a>
        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
            <a className="dropdown-item" href="/" >Log Out</a>
        </div>
    </li>
</ul>

                </nav>
        </>
    );
}
