"use client";

import Link from "next/link";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ServiceCard } from "@/components/dashboard/ServiceCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { type Service } from "@/data/mockServices";
import { ROUTES } from "@/config/routes";
import { useEffect, useState } from "react";
import api from "@vpsphere/api-client";

export default function DashboardPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await api.projects.list();
                // Ensure data is an array
                setServices(Array.isArray(data) ? data : (data.projects || []));
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const hasServices = services.length > 0;

    return (
        <div className="flex flex-col h-full bg-vpsBackground dark:bg-background-dark">
            <Header />
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">

                {/* Project Overview Card */}
                <Card className="flex items-center justify-between !p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex gap-6">
                        <div className="size-20 bg-vpsPurple/10 rounded-xl flex items-center justify-center overflow-hidden">
                            <div className="size-full bg-gradient-to-br from-vpsPurple/20 to-vpsIndigo/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-vpsPurple">rocket_launch</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">My VPS Project</h2>
                                <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800 flex items-center gap-1.5">
                                    <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    Production
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm">
                                <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                                All systems operational.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={ROUTES.SETTINGS}>
                            <Button variant="secondary" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                                <span className="material-symbols-outlined text-lg mr-2">settings</span>
                                Settings
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Services Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Services</h3>
                        {hasServices && (
                            <div className="flex items-center gap-2">
                                <Link href={ROUTES.NEW_SERVICE}>
                                    <Button size="sm" className="bg-vpsPurple hover:bg-vpsPurple/90 text-white rounded-vps font-bold shadow-md shadow-vpsPurple/20">
                                        <span className="material-symbols-outlined text-lg mr-1">add</span>
                                        Add Service
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : hasServices ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <ServiceCard key={service.id || Math.random()} service={service as Service} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </div>

                {/* Metrics Grid (Global) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="flex flex-col justify-between h-32 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total CPU</span>
                            <span className="material-symbols-outlined text-slate-300">show_chart</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">14.2%</span>
                            <span className="text-xs text-emerald-500 font-medium mb-1">↓ 2%</span>
                        </div>
                    </Card>
                    <Card className="flex flex-col justify-between h-32 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Memory Usage</span>
                            <span className="material-symbols-outlined text-slate-300">memory</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">2.4 / 8 GB</span>
                            <span className="text-xs text-slate-400 font-medium mb-1">30% cap</span>
                        </div>
                    </Card>
                    <Card className="flex flex-col justify-between h-32 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Request Rate</span>
                            <span className="material-symbols-outlined text-slate-300">speed</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">124 req/s</span>
                            <span className="text-xs text-emerald-500 font-medium mb-1">↑ 12%</span>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
}
