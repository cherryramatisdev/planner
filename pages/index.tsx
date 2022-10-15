import type { NextPage } from 'next'
import { Month } from '../components/month'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
  const months = trpc.listMonths.useQuery()

  if (!months.data) return <div>Loading...</div>

  return (
    <div className="p-10 w-screen h-screen flex flex-col items-start justify-start gap-5">
      {months.data.map(data => (
        <Month title={data.name} totals={data.total} />
      ))}
    </div>
  )
}

export default Home
