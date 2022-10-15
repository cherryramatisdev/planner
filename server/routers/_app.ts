import { publicProcedure, router } from "../trpc";
import { prisma } from '../../lib/db'
import { currencyFormat } from "../../utils/currencyFormat";
import { groupBy } from "../../utils/groupBy";

export const appRouter = router({
  listMonths: publicProcedure
    .query(async () => {
      const months = await prisma.month.findMany({ include: { debits: true } })

      let monthTotal = 0

      return months.map(month => {
        if (!month.debits.length) {
          return { ...month, total: `Total: 0` }
        }

        monthTotal = monthTotal + month.debits.reduce((prev, cur) => prev + cur.price, 0)
        const groupedBy = groupBy(month.debits, 'payerName')

        const t = Object.keys(groupedBy).map(t => {
          return { name: t, total: groupedBy[t].reduce((prev: any, cur: { price: any; }) => prev + cur.price, 0) }
        })

        const formattedPayerTotal = t.map(c => ` | ${c.name}: ${currencyFormat(c.total)}`)

        return {
          ...month,
          total: `Total: ${currencyFormat(monthTotal)} ${formattedPayerTotal}`
        }
      })
    })
})

export type AppRouter = typeof appRouter
