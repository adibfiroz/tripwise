import CreateExpense from '@/app/actions/create-expense';
import UpdateExpense from '@/app/actions/update-expense';
import { Expense, Trip } from '@prisma/client';
import { Loader, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface ExpenseFormProps {
    trip: Trip
    expense: Expense
    allExpenses: Expense[]
    onClose: () => void
}

const ExpenseForm = ({
    trip,
    expense,
    allExpenses,
    onClose
}: ExpenseFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const [formData, setFormData] = useState({
        description: expense?.description || '',
        amount: expense?.amount || '',
        category: expense?.category || 'Food',
        paidBy: expense?.paidBy || trip.participants[0],
        splitBetween: expense?.splitBetween || trip.participants,
    });

    const handleToggleParticipant = (p: string) => {
        setFormData(prev => ({
            ...prev,
            splitBetween: prev.splitBetween.includes(p)
                ? prev.splitBetween.filter((x: string) => x !== p)
                : [...prev.splitBetween, p]
        }));
    };

    const onSave = async (formData: any) => {
        setIsSubmitting(true);
        try {
            // await new Promise((resolve) => setTimeout(resolve, 3000));
            const expenseExists = allExpenses?.some((element: any) =>
                element.description.toLowerCase().trim() === formData.description.toLowerCase().trim() &&
                element.id !== expense?.id
            );
            if (expenseExists) {
                setIsSubmitting(false);
                toast.error(`Expense name Already exist!`);
                return
            }
            if (expense) {
                await UpdateExpense({
                    expenseId: expense.id,
                    ...formData,
                });
                toast.success('Expense updated successfully!');
            } else {
                // Handle create mode
                await CreateExpense({
                    tripId: trip?.id,
                    ...formData
                });
                toast.success('Expense created successfully!');
            }

            router.refresh();
            setIsSubmitting(false);
            onClose();
        } catch (error) {
            setIsSubmitting(false);
            toast.error(`Failed to ${expense ? 'update' : 'create'} Expense. Please try again.`);
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-4 md:p-6 border-b flex justify-between items-center bg-indigo-50/30">
                    <h3 className="font-black text-slate-800 text-xl">{expense ? 'Edit Expense' : 'New Expense'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white text-zinc-800 cursor-pointer rounded-full"><X size={20} /></button>
                </div>
                <div className="p-4 md:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block tracking-widest">Description</label>
                            <input
                                className="w-full bg-slate-50 border-indigo-100 border-2  focus:border-indigo-500 py-2 placeholder:text-zinc-400 text-black px-4 rounded-lg outline-none"
                                placeholder="What was this for?"
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block tracking-widest">Amount (₹)</label>
                            <input
                                type="number"
                                className="w-full bg-slate-50 border-indigo-100 border-2  focus:border-indigo-500 py-2 placeholder:text-zinc-400 text-black px-4 rounded-lg outline-none"
                                placeholder="0.00"
                                value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block tracking-widest">Paid By</label>
                            <select
                                className="w-full bg-slate-50 border-indigo-100 border-2  focus:border-indigo-500 py-2 h-11 placeholder:text-zinc-400 text-black px-4 rounded-lg outline-none"
                                value={formData.paidBy} onChange={e => setFormData({ ...formData, paidBy: e.target.value })}
                            >
                                {trip.participants.map((p: string) => <option key={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-slate-400 mb-4 block tracking-widest">Split with (Toggle members)</label>
                        <div className="flex flex-wrap gap-2">
                            {trip.participants.map((p: string) => (
                                <button
                                    key={p}
                                    onClick={() => handleToggleParticipant(p)}
                                    className={`px-4 py-2 cursor-pointer rounded-xl text-sm font-bold transition-all border-2 ${formData.splitBetween.includes(p)
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                                        : 'bg-white border-slate-100 text-slate-400'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-4 md:p-6 bg-slate-50 border-t flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 cursor-pointer font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                    <button
                        onClick={() => { onSave(formData); }}
                        disabled={!formData.description || !formData.amount || formData.splitBetween.length === 0 || isSubmitting}
                        className="flex-1  bg-indigo-600 cursor-pointer text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 disabled:opacity-50"
                    >
                        {isSubmitting ?
                            <Loader className="mx-auto animate-spin" />
                            :
                            expense ? 'Save Changes' : 'Add Expense'
                        }
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ExpenseForm