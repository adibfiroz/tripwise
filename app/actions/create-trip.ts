"use server";

import { prisma } from "@/lib/prisma";

interface ICreateTripParams {
  name: string;
  startDate: string;
  endDate: string;
  participants: string[];
}

export default async function CreateTrip(params: ICreateTripParams) {
  try {
    // Implementation for creating a trip
    const trip = await prisma.trip.create({
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
