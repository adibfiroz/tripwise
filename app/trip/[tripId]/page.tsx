import ClientOnly from '@/components/ClientOnly';
import TripDetailView from '@/components/trip-detail-view';
import prismadb from '@/lib/prisma';

export const dynamic = 'force-dynamic';
interface IParams {
    tripId?: string;
}


const Page = async ({ params }: { params: IParams }) => {
    const resolvedParams = await params;

    const tripId = resolvedParams.tripId;

    const trip = await prismadb.trip.findUnique({
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