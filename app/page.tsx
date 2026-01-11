import ClientOnly from '@/components/ClientOnly'
import HomeClient from '@/components/home-client'
import { prisma } from '@/lib/prisma'

const Home = async () => {
  const trips = await prisma.trip.findMany({
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