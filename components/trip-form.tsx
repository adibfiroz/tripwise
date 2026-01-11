import CreateTrip from '@/app/actions/create-trip';
import UpdateTrip from '@/app/actions/update-trip';
import { Trip } from '@prisma/client';
import { Loader, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { use, useState, useEffect } from 'react'
import toast from 'react-hot-toast';

interface TripFormProps {
    onClose: () => void
    trip?: Trip | null
}
const TripForm = ({
    onClose,
    trip
}: TripFormProps) => {

    const [tripName, setTripName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [participants, setParticipants] = useState<string[]>([]);
    const [newParticipant, setNewParticipant] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const isEditing = !!trip;

    useEffect(() => {
        if (trip) {
            setTripName(trip.name || '');
            setStartDate(trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : '');
            setEndDate(trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : '');
            setParticipants(trip.participants || []);
        }
    }, [trip]);

    const handleAddParticipant = (e: any) => {
        e.preventDefault();
        if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
            setParticipants([...participants, newParticipant.trim()]);
            setNewParticipant('');
        }
    };

    const removeParticipant = (p: any) => {
        setParticipants(participants.filter(x => x !== p));
    };

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            // await new Promise((resolve) => setTimeout(resolve, 5000));

            const tripData = {
                name: tripName,
                startDate: startDate,
                endDate: endDate,
                participants: participants,
            };

            if (isEditing && trip?.id) {
                await UpdateTrip({
                    id: trip.id,
                    ...tripData,
                });
                toast.success('Trip updated successfully!');
            } else {
                // Handle create mode
                await CreateTrip({
                    name: tripData.name as string,
                    startDate: tripData.startDate as string,
                    endDate: tripData.endDate as string,
                    participants: tripData.participants,
                });
                toast.success('Trip created successfully!');
            }

            router.refresh();
            setIsSubmitting(false);
            onClose();
        } catch (error) {
            setIsSubmitting(false);
            toast.error(`Failed to ${isEditing ? 'update' : 'create'} trip. Please try again.`);
        }
    }


    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <form
                onSubmit={(e: any) => {
                    e.preventDefault();
                    onSubmit();
                }}
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            >
                <div className="p-6 border-b flex justify-between items-center bg-indigo-50/30">
                    <h3 className="font-black text-slate-800 text-xl">{isEditing ? 'Edit Trip' : 'New Trip'}</h3>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-white text-zinc-800 cursor-pointer rounded-full">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 md:p-8 space-y-5">
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-400 mb-2 block tracking-widest">Trip Name</label>
                        <input value={tripName} onChange={e => setTripName(e.target.value)} placeholder="e.g. Nagpur trip" className="w-full bg-slate-50 border-indigo-100 border-2  focus:border-indigo-500 py-2 placeholder:text-zinc-400 text-black px-4 rounded-lg outline-none" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block tracking-widest">Start Date</label>
                            <input value={startDate} onChange={e => setStartDate(e.target.value)} type="date" className="w-full bg-slate-50 border-2 border-indigo-100 py-2 placeholder:text-zinc-400 text-black px-4 rounded-lg focus:border-indigo-500 outline-none" required />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block tracking-widest">End Date</label>
                            <input value={endDate} onChange={e => setEndDate(e.target.value)} type="date" className="w-full bg-slate-50 border-2 border-indigo-100 py-2 placeholder:text-zinc-400 text-black px-4 rounded-lg focus:border-indigo-500 outline-none" required />
                        </div>
                    </div>
                    <div className="">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Participants</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                value={newParticipant} onChange={e => setNewParticipant(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddParticipant(e)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-black outline-none"
                                placeholder="Add person name..."
                            />
                            <button onClick={handleAddParticipant} className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {participants.map(p => (
                                <span key={p} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm border border-indigo-100">
                                    {p}
                                    <button onClick={() => removeParticipant(p)} className="hover:text-red-500"><X size={14} /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
                <div className="p-6 bg-slate-50 border-t flex gap-4">
                    <button type="button" onClick={onClose} className="flex-1 cursor-pointer py-4 font-bold text-slate-500">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 cursor-pointer bg-indigo-600 text-white py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed font-black shadow-lg shadow-indigo-100">
                        {isSubmitting ?
                            <Loader className="mx-auto animate-spin" />
                            :
                            isEditing ? 'Update Trip' : 'Create Trip'
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default TripForm