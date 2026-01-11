import ClientOnly from '@/components/ClientOnly'
import HomeClient from '@/components/home-client'
import prismadb from '@/lib/prisma'

export const dynamic = 'force-dynamic';

const Home = async () => {
  const trips = await prismadb.trip.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div>
      <ClientOnly>
        <HomeClient trips={trips} />
      </ClientOnly>
    </div>
  )
}

export default Home