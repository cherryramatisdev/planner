import Link from 'next/link'

interface Props {
  title: string;
  totals: string;
  href: string;
}

export const Month: React.FC<Props> = ({ title, totals, href }) => {
  return (
    <Link href={href} passHref>
      <a className="px-5 w-full h-10 bg-white container flex flex-row items-center justify-between">
        <p className="text-black">{title}</p>
        <p className="text-black">{totals}</p>
      </a>
    </Link>
  )
}
