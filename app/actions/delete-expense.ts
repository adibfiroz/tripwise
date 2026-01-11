"use server";

import { prisma } from "@/lib/prisma";

interface IDeleteExpenseParams {
  expenseId: string;
}

export default async function DeleteExpense(params: IDeleteExpenseParams) {
  try {
    await prisma.expense.delete({
      where: {
        id: params.expenseId,
      },
    });

    return "Expense Deleted";
  } catch (error: any) {
    throw new Error(error);
  }
}
