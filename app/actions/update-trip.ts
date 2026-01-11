"use server";

import { prisma } from "@/lib/prisma";

interface IUpdateTripParams {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  participants: string[];
}

export default async function UpdateTrip(params: IUpdateTripParams) {
  try {
    const trip = await prisma.trip.update({
      where: {
        id: params.id,
      },
      data: {
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
