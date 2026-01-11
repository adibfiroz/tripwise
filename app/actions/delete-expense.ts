"use server";

import prismadb from "@/lib/prisma";

interface IDeleteExpenseParams {
  expenseId: string;
}

export default async function DeleteExpense(params: IDeleteExpenseParams) {
  try {
    await prismadb.expense.delete({
      where: {
        id: params.expenseId,
      },
    });

    return "Expense Deleted";
  } catch (error: any) {
    throw new Error(error);
  }
}
