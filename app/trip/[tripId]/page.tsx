import ClientOnly from '@/components/ClientOnly';
import TripDetailView from '@/components/trip-detail-view';
import { prisma } from '@/lib/prisma';
import React from 'react'

interface IParams {
    tripId?: string;
}


const Page = async ({ params }: { params: IParams }) => {
    const resolvedParams = await params;

    const tripId = resolvedParams.tripId;

    const trip = await prisma.trip.findUnique({
        where: {
            id: tripId
        },
        include: {
            expenses: true
        }
    })

    return (
        <div>
            {trip &&
                <ClientOnly>
                    <TripDetailView
                        trip={trip}
                    />
                </ClientOnly>
            }
        </div>
    )
}

export default Page