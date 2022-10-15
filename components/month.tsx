interface Props {
  title: string;
  totals: string;
}

export const Month: React.FC<Props> = ({ title, totals }) => {
  return (
    <div className="px-5 w-full h-10 bg-white container flex flex-row items-center justify-between">
      <p className="text-black">{title}</p>
      <p className="text-black">{totals}</p>
    </div>
  )
}
