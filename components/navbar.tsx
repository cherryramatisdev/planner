import { useRouter } from 'next/router';
import { MdOutlineArrowBack } from 'react-icons/md'

interface Props {
  title: string;
}

export const NavBar: React.FC<Props> = ({ title }) => {
  const router = useRouter()

  return (
    <div className={`fixed top-0 left-0 w-screen h-10 bg-white text-black flex items-center ${router.pathname === '/' ? 'justify-center' : 'justify-around'}`}>
      {router.pathname !== '/' && (
        <div onClick={router.back}>
          <MdOutlineArrowBack />
        </div>
      )}

      {title}

      <div />
    </div>
  )
}
