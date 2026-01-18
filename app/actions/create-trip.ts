"use server";

import prismadb from "@/lib/prisma";
import getCurrentUser from "./getCurrentUser";

interface ICreateTripParams {
  name: string;
  startDate: string;
  endDate: string;
  participants: string[];
}

export default async function CreateTrip(params: ICreateTripParams) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const trip = await prismadb.trip.create({
      data: {
        userId: currentUser?.id,
        name: params.name,
        startDate: new Date(params.startDate),
        endDate: new Date(params.endDate),
        participants: params.participants,
      },
    });

    return trip;
  } catch (error: any) {
    throw new Error(error);
  }
}
