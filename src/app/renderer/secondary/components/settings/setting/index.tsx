const Setting = ({ title, children }) => {
  return (
    <>
      <span className="text-md font-bold pt-2">{title}</span>
      <div className="flex flex-col">
        {children}
      </div>
    </>
  )
}

export default Setting