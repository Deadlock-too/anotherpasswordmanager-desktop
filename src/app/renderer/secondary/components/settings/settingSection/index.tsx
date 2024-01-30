const SettingSection = ({ title, children }) => {
  return (
    <div className="flex flex-col h-full px-5 py-2">
      <span className="text-xl font-bold text-start">{ title }</span>
      <div className="divider pt-2 pb-2 -mb-0 -mt-0 -mr-2 -ml-2"/>
      { children }
    </div>
  )
}

export default SettingSection