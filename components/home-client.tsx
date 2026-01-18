'use client';

import React, { useState, } from 'react';
import {
    Plus, Calendar, Users, Edit,
    Edit2,
    Trash2
} from 'lucide-react';
import TripForm from './trip-form';
import Link from 'next/link';
import { Expense, Trip } from '@prisma/client';
import { SafeUser } from '@/app/types';
import { signIn, signOut } from 'next-auth/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import TripDeleteModal from './trip-delete-modal';

interface HomeClientProps {
    trips: Trip[] & { expenses: Expense[] } | any
    currentUser?: SafeUser | null
}

export default function HomeClient({
    trips,
    currentUser
}: HomeClientProps) {

    const [isCreatingTrip, setIsCreatingTrip] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
    const [showDeleteTripModal, setShowDeleteTripModal] = useState(false);

    const handleEdit = (e: any, trip: Trip) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedTrip(trip);
        setIsCreatingTrip(true);
    }

    const handleDeleteTrip = (e: any, trip: Trip) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedTrip(trip)
        setShowDeleteTripModal(true)
    }


    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Trip<span className='text-indigo-600'>wise</span></h1>
                        <p className="text-slate-500 hidden sm:block">Track and settle group expenses</p>
                    </div>
                    {currentUser ?
                        <div className='flex gap-4'>
                            <button
                                onClick={() => { setSelectedTrip(null); setIsCreatingTrip(true); }}
                                className="bg-indigo-600 active:scale-95 cursor-pointer text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                            >
                                <Plus className='hidden sm:block' size={20} /> Create Trip
                            </button>
                            <DropdownMenu>
                                <DropdownMenuTrigger className=' outline-none '>
                                    <img
                                        className={('rounded-full cursor-pointer border-2 border-transparent  hover:border-blue-400 transition-all duration-300 size-12'
                                        )}
                                        src={currentUser?.image || ""}
                                        alt={currentUser?.name || "user"}
                                        width={50}
                                        height={50}
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {/* <DropdownMenuItem>Trips</DropdownMenuItem> */}
                                    <DropdownMenuItem onClick={() => signOut()} className=' cursor-pointer'>Sign Out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        :
                        <button
                            onClick={() => signIn('google')}
                            className="bg-indigo-600 active:scale-95 cursor-pointer text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                        >
                            Login
                        </button>
                    }
                </header>

                {isCreatingTrip && (
                    <TripForm
                        currentUser={currentUser}
                        onClose={() => setIsCreatingTrip(false)}
                        trip={selectedTrip}
                    />
                )}

                {(showDeleteTripModal && selectedTrip) &&
                    <TripDeleteModal
                        selectedTrip={selectedTrip}
                        onClose={() => { setShowDeleteTripModal(false); setSelectedTrip(null) }}
                    />
                }

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentUser ?
                        <>
                            {trips.length === 0 && !isCreatingTrip && (
                                <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <Calendar size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">No trips planned</h3>
                                    <p className="text-slate-500">Start by creating your first group trip.</p>
                                </div>
                            )}
                        </>
                        :
                        <div className="col-span-full py-20 bg-no-repeat bg-cover bg-center  rounded-3xl  text-center bg-[linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('/bg-login.jpg')]">
                            <p className="text-slate-100 text-2xl md:text-3xl font-medium mb-4">
                                Login, create & share
                            </p>
                            <button
                                onClick={() => signIn('google')}
                                className=" active:scale-95 flex items-center justify-center border border-gray-500/50 cursor-pointer rounded-md text-white  backdrop-blur-sm gap-2 py-3 px-6 mx-auto">
                                <img src="/google.png" alt="google" width="30" height="30" />Continue with Google
                            </button>
                        </div>
                    }
                    {currentUser &&
                        <>
                            {trips.map((trip: any) => (
                                <Link
                                    key={trip.id}
                                    href={`/trip/${trip.id}`}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-400 relative cursor-pointer transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600">{trip.name}</h3>
                                    </div>
                                    <div className="space-y-3 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className='flex justify-between hap-2'>
                                            <div className="flex items-center gap-2">
                                                <Users size={16} />
                                                <span>{trip.participants.length} members</span>
                                            </div>
                                            <div className="group-hover:flex gap-1 md:hidden absolute bottom-4 right-4">
                                                <button
                                                    onClick={(e) => handleEdit(e, trip)}
                                                    className="p-2 cursor-pointer text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteTrip(e, trip)}
                                                    className="p-2 cursor-pointer text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

