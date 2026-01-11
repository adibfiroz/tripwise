"use server";

import prismadb from "@/lib/prisma";

interface ICreateExpenseParams {
  tripId: string;
  description: string;
  amount: string;
  paidBy: string;
  splitBetween: string[];
}

export default async function CreateExpense(params: ICreateExpenseParams) {
  try {
    // Implementation for creating a expense
    const expense = await prismadb.expense.create({
      data: {
        tripId: params.tripId,
        description: params.description,
        amount: parseInt(params.amount),
        paidBy: params.paidBy,
        splitBetween: params.splitBetween,
      },
    });

    return expense;
  } catch (error: any) {
    throw new Error(error);
  }
}
