import ClientOnly from '@/components/ClientOnly'
import HomeClient from '@/components/home-client'
import prismadb from '@/lib/prisma'
import getCurrentUser from './actions/getCurrentUser';

export const dynamic = 'force-dynamic';

const Home = async () => {

  const currentUser = await getCurrentUser();

  const trips = await prismadb.trip.findMany({
    where: {
      userId: currentUser?.id
    },
    include: {
      expenses: true
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div>
      <ClientOnly>
        <HomeClient currentUser={currentUser} trips={trips} />
      </ClientOnly>
    </div>
  )
}

export default Home