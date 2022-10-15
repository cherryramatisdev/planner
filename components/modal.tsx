interface Props {
  open: boolean;
  onClose: () => void;
}

export const Modal: React.FC<React.PropsWithChildren<Props>> = ({ open, onClose, children }) => {
  if (!open) return <></>

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 w-screen h-screen bg-black opacity-70" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-10 bg-white">
        {children}
      </div>
    </>
  )
}
