"use server";

import prismadb from "@/lib/prisma";

interface IDeleteTripParams {
  tripId: string;
}

export default async function DeleteTrip(params: IDeleteTripParams) {
  try {
    await prismadb.trip.delete({
      where: {
        id: params.tripId,
      },
    });

    return "Trip Deleted";
  } catch (error: any) {
    throw new Error(error);
  }
}
