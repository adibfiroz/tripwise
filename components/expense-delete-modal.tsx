import DeleteExpense from '@/app/actions/delete-expense'
import { Expense } from '@/generated/prisma/client'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface ExpenseDeleteModalProps {
    onClose: () => void
    selectedExpense: Expense
}

const ExpenseDeleteModal = ({
    onClose,
    selectedExpense
}: ExpenseDeleteModalProps) => {

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            //await new Promise((resolve) => setTimeout(resolve, 3000));
            await DeleteExpense({ expenseId: selectedExpense.id })
            setIsLoading(false)
            onClose()
            router.refresh()
            toast.success("Expense Deleted")
        } catch (error) {
            setIsLoading(false)
            toast.error("Something went wrong")
        }
    }

    return (
        <div className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
            <div className='bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in'>
                <div className='text-center py-5 text-xl text-black'>Delete {selectedExpense.description} Expense</div>
                <div className='flex justify-center gap-5 my-5'>
                    <button onClick={onClose} disabled={isLoading} className='bg-black disabled:opacity-50 cursor-pointer text-white p-2 px-4 rounded-lg'>No</button>
                    <button onClick={handleDelete} disabled={isLoading} className='bg-red-500 disabled:opacity-50 cursor-pointer text-white p-2 px-4 rounded-lg'>
                        {isLoading ?
                            <Loader className="mx-auto animate-spin" />
                            :
                            'Yes'
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ExpenseDeleteModal