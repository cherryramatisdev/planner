import type { NextPage } from 'next'
import { FormEvent, useState } from 'react'
import { Modal } from '../components/modal'
import { Month } from '../components/month'
import { GrAdd } from 'react-icons/gr'

import { trpc } from '../utils/trpc'
import { NavBar } from '../components/navbar'

const Home: NextPage = () => {
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const ctx = trpc.useContext()
  const months = trpc.listMonths.useQuery()
  const createMonth = trpc.createMonth.useMutation()

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const month = await createMonth.mutateAsync({ name })

    if (month) {
      ctx.listMonths.invalidate()
      setOpen(false)
      setName('')
    }
  }

  if (!months.data) return <div>Loading...</div>

  return (
    <div className="relative p-10 w-screen h-screen flex flex-col items-center justify-start gap-5">
      <NavBar title="Pagina inicial - Selecione ou crie um mes"/>

      {months.data.map(data => (
        <Month key={data.id} title={data.name} totals={data.total} href={`/debit/${data.id}`} />
      ))}

      <Modal open={open} onClose={() => setOpen(false)}>
        <form className="w-full flex flex-col items-center justify-center text-black" onSubmit={onSubmit}>
          <fieldset>
            <label className="mr-5" htmlFor="monthName">Deseja criar um novo mes?</label>
            <br />
            <input
              className="mt-2 px-2 rounded-md bg-white border border-black"
              type="text"
              id="monthName"
              name="monthName"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Exemplo: Janeiro 2022"
            />
          </fieldset>

          <button className="w-40 p-2 mt-10 rounded-lg bg-black text-white">Criar</button>
        </form>
      </Modal>

      <button
        onClick={() => setOpen(current => !current)}
        className="w-12 h-12 bg-white rounded-full absolute bottom-10 right-10 flex items-center justify-center"
      >
        <GrAdd />
      </button>
    </div>
  )
}

export default Home
