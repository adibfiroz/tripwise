'use client';

import { ArrowLeft, ArrowRightLeft, ChevronRight, Edit2, Plus, Receipt, Trash2, X } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import ExpenseForm from './expense-form';
import Link from 'next/link';
import ExpenseDeleteModal from './expense-delete-modal';
import { Expense, Trip } from '@prisma/client';

interface TripDetailViewProps {
    trip: Trip & {
        expenses: Expense[]
    }
}

const TripDetailView = ({
    trip,
}: TripDetailViewProps) => {
    const [activeTab, setActiveTab] = useState<'expenses' | 'settlements'>('expenses');
    const [editingExpense, setEditingExpense] = useState<any | null>(null);
    const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [showDeleteExpenseModal, setShowDeleteExpenseModal] = useState(false);

    const report = useMemo(() => {
        const balances: Record<string, number> = {};
        trip.participants.forEach((p: string) => balances[p] = 0);

        trip.expenses.forEach((exp: any) => {
            balances[exp.paidBy] += exp.amount;
            const share = exp.amount / exp.splitBetween.length;
            exp.splitBetween.forEach((p: string) => balances[p] -= share);
        });

        const debtors = Object.entries(balances).filter(([_, b]) => b < -0.01).map(([n, b]) => ({ n, b: Math.abs(b) }));
        const creditors = Object.entries(balances).filter(([_, b]) => b > 0.01).map(([n, b]) => ({ n, b }));

        const transfers = [];
        let i = 0, j = 0;
        const d = [...debtors].sort((a, b) => b.b - a.b);
        const c = [...creditors].sort((a, b) => b.b - a.b);

        while (i < d.length && j < c.length) {
            const pay = Math.min(d[i].b, c[j].b);
            transfers.push({ from: d[i].n, to: c[j].n, amount: pay });
            d[i].b -= pay; c[j].b -= pay;
            if (d[i].b < 0.01) i++;
            if (c[j].b < 0.01) j++;
        }
        return { transfers, balances };
    }, [trip]);

    const handleDeleteExpense = (exp: any) => {
        setSelectedExpense(exp)
        setShowDeleteExpenseModal(true)
    }

    return (
        <div className='min-h-screen bg-slate-50 pb-12'>
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <Link href={`/`} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                    <div className="flex justify-between gap-5 flex-wrap items-end">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">{trip.name}</h1>
                            <p className="text-slate-500 font-medium mt-1">Group Pot: ₹{trip.expenses.reduce((s: any, e: any) => s + e.amount, 0).toFixed(2)}</p>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button
                                onClick={() => setActiveTab('expenses')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'expenses' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                            >Expenses</button>
                            <button
                                onClick={() => setActiveTab('settlements')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'settlements' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                            >Settlements</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6">
                {activeTab === 'expenses' ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Receipt size={22} className="text-indigo-600" />
                                Activities & Costs
                            </h2>
                            <button
                                onClick={() => { setEditingExpense(null); setShowExpenseForm(true); }}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md hover:bg-indigo-700 transition-all"
                            >
                                <Plus size={18} /> Add Expense
                            </button>
                        </div>

                        <div className="grid gap-3">
                            {trip.expenses.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400">
                                    No expenses added yet.
                                </div>
                            ) : (
                                trip.expenses.slice().reverse().map((exp: any) => (
                                    <div
                                        key={exp.id}
                                        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:shadow-lg transition-all"
                                    >
                                        {/* Left Side: Icon and Details */}
                                        <div className="flex items-start sm:items-center gap-4">
                                            <div className="shrink-0 w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                                <Receipt size={24} />
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-800 text-lg leading-tight">{exp.description}</h4>

                                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                                                    {exp.category && <span className="font-bold text-indigo-600 uppercase bg-indigo-50 px-1.5 py-0.5 rounded">
                                                        {exp.category}
                                                    </span>}
                                                    {/* <span className="hidden sm:inline">•</span> */}
                                                    <span>Paid by <b className='text-gray-600'>{exp.paidBy}</b></span>
                                                </div>

                                                {/* Split Users - Wrap nicely on small screens */}
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {exp.splitBetween.map((p: string) => (
                                                        <span key={p} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                                            {p}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Price and Actions */}
                                        <div className="flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l sm:pl-4 border-slate-100">
                                            <div className="sm:text-right">
                                                <p className="text-xl font-black text-slate-900">₹{exp.amount.toFixed(2)}</p>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                                                    Split x{exp.splitBetween.length}
                                                </p>
                                            </div>

                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => setEditingExpense(exp)}
                                                    className="p-2 cursor-pointer text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteExpense(exp)}
                                                    className="p-2 cursor-pointer text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-200 shadow-sm h-fit">
                            <h3 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2">
                                <ArrowRightLeft className="text-indigo-600" /> Settlement Plan
                            </h3>
                            <div className="space-y-4">
                                {report.transfers.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-700">{t.from}</span>
                                            <div className="w-8 h-px bg-slate-300 relative">
                                                <ChevronRight size={12} className="absolute -right-1 -top-1.5 text-slate-300" />
                                            </div>
                                            <span className="font-bold text-slate-700">{t.to}</span>
                                        </div>
                                        <span className="text-lg font-black text-indigo-600">₹{t.amount.toFixed(2)}</span>
                                    </div>
                                ))}
                                {report.transfers.length === 0 && (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-500">
                                            <X size={24} className="rotate-45" />
                                        </div>
                                        <p className="text-slate-400">Everything is balanced!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-bold mb-6 text-gray-300">Net Individual Balances</h3>
                            <div className="space-y-6">
                                {Object.entries(report.balances).map(([name, bal]) => (
                                    <div key={name}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-bold text-slate-700">{name}</span>
                                            <span className={`font-black ${bal >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                {bal >= 0 ? '+' : ''}₹{bal.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${bal >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                style={{ width: `${Math.max(10, Math.min(Math.abs(bal) / 2, 100))}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>


            {(showDeleteExpenseModal && selectedExpense) &&
                <ExpenseDeleteModal
                    selectedExpense={selectedExpense}
                    onClose={() => { setShowDeleteExpenseModal(false); setSelectedExpense(null) }}
                />
            }

            {(showExpenseForm || editingExpense) && (
                <ExpenseForm
                    trip={trip}
                    expense={editingExpense}
                    allExpenses={trip.expenses}
                    onClose={() => { setShowExpenseForm(false); setEditingExpense(null); }}
                />
            )}
        </div>
    )
}

export default TripDetailView