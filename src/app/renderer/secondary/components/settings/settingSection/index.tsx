const SettingSection = ({ title, children }) => {
  return (
    <div className="flex flex-col h-full px-5 py-2">
      <span className="text-xl font-bold text-center">{ title }</span>
      <div className="divider -mt-0 -mb-0"/>
      { children }
    </div>
  )
}

export default SettingSection