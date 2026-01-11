"use server";

import prismadb from "@/lib/prisma";

interface IUpdateExpenseParams {
  expenseId: string;
  description: string;
  amount: string;
  paidBy: string;
  splitBetween: string[];
}

export default async function UpdateExpense(params: IUpdateExpenseParams) {
  try {
    // Implementation for updating a expense
    const expense = await prismadb.expense.update({
      where: {
        id: params.expenseId,
      },
      data: {
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
