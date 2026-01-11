'use client';

import React, { useState, } from 'react';
import {
    Plus, Calendar, Users, Edit
} from 'lucide-react';
import TripForm from './trip-form';
import { Trip } from '@/generated/prisma/client';
import Link from 'next/link';

interface HomeClientProps {
    trips: Trip[]
}

export default function HomeClient({
    trips
}: HomeClientProps) {

    const [isCreatingTrip, setIsCreatingTrip] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tripwise</h1>
                        <p className="text-slate-500">Track and settle group expenses</p>
                    </div>
                    <button
                        onClick={() => { setSelectedTrip(null); setIsCreatingTrip(true); }}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                        <Plus size={20} /> Create Trip
                    </button>
                </header>

                {isCreatingTrip && (
                    <TripForm
                        onClose={() => setIsCreatingTrip(false)}
                        trip={selectedTrip}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.length === 0 && !isCreatingTrip && (
                        <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Calendar size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No trips planned</h3>
                            <p className="text-slate-500">Start by creating your first group trip.</p>
                        </div>
                    )}
                    {trips.map((trip: any) => (
                        <Link
                            key={trip.id}
                            href={`/trip/${trip.id}`}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-400 cursor-pointer transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600">{trip.name}</h3>
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedTrip(trip); setIsCreatingTrip(true); }} className="text-blue-500 md:text-slate-300 cursor-pointer hover:text-blue-500 md:opacity-0 group-hover:opacity-100 transition-all">
                                    <Edit size={18} />
                                </button>
                            </div>
                            <div className="space-y-3 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={16} />
                                    <span>{trip.participants.length} members</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

