import { useRouter } from "next/router"
import { FormEvent, useState } from "react"
import CurrencyInput from "react-currency-input-field"
import { GrAdd } from "react-icons/gr"
import { Modal } from "../../components/modal"
import { NavBar } from "../../components/navbar"
import { currencyFormat } from "../../utils/currencyFormat"
import { groupBy } from "../../utils/groupBy"
import { trpc } from "../../utils/trpc"

type Debit = {
  id: number,
  title: string,
  price: number,
  paid: boolean,
  payerName: string,
  monthId: number
}

export default function DebitPage() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    payerName: ''
  })
  const { query: { month: monthId } } = useRouter()
  const ctx = trpc.useContext()
  const month = trpc.getMonthDebits.useQuery({ id: Number(monthId) })
  const updatePaid = trpc.updateDebitPaid.useMutation()
  const createDebit = trpc.createDebit.useMutation()

  const togglePaid = async (id: number, paid: boolean) => {
    const debit = await updatePaid.mutateAsync({ id, paid })

    if (debit) {
      ctx.getMonthDebits.invalidate()
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const debit = await createDebit.mutateAsync({
      ...formData,
      monthId: Number(monthId),
      price: Number(formData.price.replace(',', '.'))
    })

    if (debit) {
      ctx.getMonthDebits.invalidate()
      setOpen(false)
      setFormData({
        title: '',
        price: '',
        payerName: ''
      })
    }
  }

  if (!month.data) return <>Loading...</>

  const groupedByPayer = groupBy(month.data.debits, 'payerName')

  return (
    <div className="p-10 container flex gap-10 items-center justify-around">
      <NavBar title={`Lista de debitos para o mes - ${month.data.name}`} />

      {Object.keys(groupedByPayer).map((payer) => (
        <div key={payer} className="mt-10">
          <p className="text-white">{payer}</p>

          {groupedByPayer[payer].map((debit: Debit) => (
            <button key={debit.id} onClick={() => togglePaid(debit.id, debit.paid)} className={`flex items-center justify-between bg-white text-black px-10 mb-2 ${debit.paid && 'opacity-30'}`}>
              <p>{debit.title} - {currencyFormat(debit.price)}</p>
              <p className={`${debit.paid ? 'text-red-500' : 'text-white'} ml-5 font-bold`}>PG</p>
            </button>
          ))}
        </div>
      ))}

      <button
        onClick={() => setOpen(current => !current)}
        className="w-12 h-12 bg-white rounded-full absolute bottom-10 right-10 flex items-center justify-center"
      >
        <GrAdd />
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <form className="w-full flex flex-col items-center justify-center text-black" onSubmit={onSubmit}>
          <p>Deseja adicionar um debito novo?</p>
          <fieldset>
            <input
              className="mt-2 px-2 rounded-md bg-white border border-black"
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={e => setFormData(current => ({ ...current, title: e.target.value }))}
              placeholder="Proposito do debito"
            />
          </fieldset>

          <fieldset>
            <CurrencyInput
              className="mt-2 px-2 rounded-md bg-white border border-black"
              id="price"
              name="price"
              placeholder="Preço"
              intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
              defaultValue={0}
              decimalsLimit={2}
              value={formData.price}
              onValueChange={(value, _name) => {
                setFormData(current => ({ ...current, price: value ?? '' }))
              }}
            />
          </fieldset>

          <fieldset>
            <input
              className="mt-2 px-2 rounded-md bg-white border border-black"
              type="text"
              id="payerName"
              name="payerName"
              value={formData.payerName}
              onChange={e => setFormData(current => ({ ...current, payerName: e.target.value }))}
              placeholder="Nome do pagador"
            />
          </fieldset>

          <button className="w-40 p-2 mt-10 rounded-lg bg-black text-white">Criar</button>
        </form>
      </Modal>
    </div>
  )
}
