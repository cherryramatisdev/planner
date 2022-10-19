import { publicProcedure, router } from "../trpc";
import { prisma } from '../../lib/db'
import { currencyFormat } from "../../utils/currencyFormat";
import { groupBy } from "../../utils/groupBy";
import { z } from "zod";

export const appRouter = router({
  listMonths: publicProcedure
    .query(async () => {
      const months = await prisma.month.findMany({ include: { debits: true } })

      let monthTotal = 0

      return months.map(month => {
        if (!month.debits.length) {
          return { ...month, total: `Total: 0` }
        }

        const debitsNotPaid = month.debits.filter(debit => !debit.paid)

        monthTotal = monthTotal + debitsNotPaid.reduce((prev, cur) => prev + cur.price, 0)
        const groupedBy = groupBy(debitsNotPaid, 'payerName')

        const t = Object.keys(groupedBy).map(t => {
          return { name: t, total: groupedBy[t].reduce((prev: any, cur: { price: any; }) => prev + cur.price, 0) }
        })

        const formattedPayerTotal = t.map(c => ` | ${c.name}: ${currencyFormat(c.total)}`)

        return {
          ...month,
          total: `Total: ${currencyFormat(monthTotal)} ${formattedPayerTotal}`
        }
      })
    }),
  createMonth: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (req) => {
      const month = await prisma.month.create({ data: { name: req.input.name } })

      return month
    }),
  deleteMonth: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async (req) => {
      const month = await prisma.month.delete({ where: { id: req.input.id }})

      return month
    }),
  getMonthDebits: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async (req) => {
      const month = await prisma.month.findFirstOrThrow({ where: { id: req.input.id }, include: { debits: true } })

      return month
    }),
  updateDebitPaid: publicProcedure
    .input(z.object({ id: z.number(), paid: z.boolean() }))
    .mutation(async req => {
      const debit = await prisma.debit.update({
        where: { id: req.input.id },
        data: { paid: !req.input.paid },
      })

      return debit
    }),
  createDebit: publicProcedure
    .input(z.object({ title: z.string(), price: z.number(), payerName: z.string(), monthId: z.number() }))
    .mutation(async (req) => {
      const debit = await prisma.debit.create({
        data: {
          payerName: req.input.payerName,
          title: req.input.title,
          price: req.input.price,
          paid: false,
          monthId: req.input.monthId
        }
      })

      return debit
    }),
  deleteDebit: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async (req) => {
      const debit = await prisma.debit.delete({
        where: {
          id: req.input.id,
        }
      })

      return debit
    }),
})

export type AppRouter = typeof appRouter
