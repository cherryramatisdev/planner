export const currencyFormat = (price: number) => Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
