const Setting = ({ title, children }) => {
  return (
    <>
      <span className="text-md font-bold pt-2">{title}</span>
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </>
  )
}

export default Setting