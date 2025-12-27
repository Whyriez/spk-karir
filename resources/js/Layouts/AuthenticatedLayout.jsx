import React, {useState} from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import {Link, usePage} from "@inertiajs/react";

export default function Authenticated({user, header, children}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const {app_settings} = usePage().props;

    // --- LOGIC MENU BERDASARKAN ROLE ---
    const getMenus = (role) => {
        switch (role) {
            case "admin":
                return [
                    {
                        label: "Dashboard",
                        route: "dashboard",
                        active: "dashboard",
                        type: "link", // Menu Tunggal
                    },
                    {
                        label: "Kesiswaan",
                        type: "dropdown", // Menu Grouping
                        items: [
                            {
                                label: "Monitoring & Catatan BK",
                                route: "admin.monitoring.index",
                                active: "admin.monitoring.*",
                            },
                            {
                                label: "Kenaikan Kelas",
                                route: "admin.promotion.index",
                                active: "promotion.*",
                            },
                            {
                                label: "Data Alumni",
                                route: "admin.alumni.index",
                                active: "admin.alumni.*",
                            },
                        ],
                    },
                    {
                        label: "Metode SPK",
                        type: "dropdown",
                        items: [
                            {
                                label: "Manajemen Kriteria",
                                route: "admin.kriteria.index",
                                active: "admin.kriteria.*",
                            },
                            {
                                label: "Pengaturan BWM",
                                route: "admin.bwm.setting",
                                active: "admin.bwm.setting",
                            },
                        ],
                    },
                    {
                        label: "Konfigurasi",
                        type: "dropdown",
                        items: [
                            {
                                label: "Pengaturan Sekolah",
                                route: "admin.settings",
                                active: "admin.settings",
                            },
                            {
                                label: "Manajemen Periode",
                                route: "admin.periode.index",
                                active: "admin.periode.*",
                            },
                            // Tambah User Management disini nanti
                        ],
                    },
                ];
            case "pakar":
                return [
                    {
                        label: "Dashboard",
                        route: "dashboard",
                        active: "dashboard",
                        type: "link",
                    },
                    {
                        label: "Input Bobot (BWM)",
                        route: "pakar.bwm",
                        active: "pakar.bwm*",
                        type: "link",
                    },
                ];
            case "siswa":
                return [
                    {
                        label: "Dashboard",
                        route: "dashboard",
                        active: "dashboard",
                        type: "link",
                    },
                    {
                        label: "Input Data & Minat",
                        route: "siswa.input",
                        active: "siswa.input",
                        type: "link",
                    },
                    {
                        label: "Hasil Rekomendasi",
                        route: "siswa.result",
                        active: "siswa.result",
                        type: "link",
                    },
                ];
            default:
                return [];
        }
    };

    const menus = getMenus(user.role);
    // -----------------------------------

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <div className="font-bold text-2xl text-indigo-600 tracking-tighter">
                                        SPK{" "}
                                        <span className="text-gray-800">
                                            {app_settings.school_name}
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                {/* Render Menu Dinamis (Support Dropdown) */}
                                {menus.map((menu, index) => {
                                    if (menu.type === "dropdown") {
                                        // RENDER DROPDOWN GROUP
                                        return (
                                            <div key={index} className="inline-flex items-center">
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <span className="inline-flex rounded-md">
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                            >
                                                                {menu.label}
                                                                <svg
                                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </span>
                                                    </Dropdown.Trigger>

                                                    <Dropdown.Content>
                                                        {menu.items.map((child, cIndex) => (
                                                            <Dropdown.Link
                                                                key={cIndex}
                                                                href={route(child.route)}
                                                            >
                                                                {child.label}
                                                            </Dropdown.Link>
                                                        ))}
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </div>
                                        );
                                    } else {
                                        // RENDER LINK BIASA
                                        return (
                                            <NavLink
                                                key={index}
                                                href={route(menu.route)}
                                                active={route().current(menu.active)}
                                            >
                                                {menu.label}
                                            </NavLink>
                                        );
                                    }
                                })}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name} ({user.role}){" "}
                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        {/* Mobile Menu Loop */}
                        {menus.map((menu, index) => {
                            if (menu.type === "dropdown") {
                                return (
                                    <div key={index}>
                                        <div
                                            className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            {menu.label}
                                        </div>
                                        {menu.items.map((child, cIndex) => (
                                            <ResponsiveNavLink
                                                key={`${index}-${cIndex}`}
                                                href={route(child.route)}
                                                active={route().current(child.active)}
                                            >
                                                {child.label}
                                            </ResponsiveNavLink>
                                        ))}
                                    </div>
                                );
                            } else {
                                return (
                                    <ResponsiveNavLink
                                        key={index}
                                        href={route(menu.route)}
                                        active={route().current(menu.active)}
                                    >
                                        {menu.label}
                                    </ResponsiveNavLink>
                                );
                            }
                        })}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
