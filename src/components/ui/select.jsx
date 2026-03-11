import * as React from "react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext({})

function Select({ value, onValueChange, children }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(value || "")
  const ref = React.useRef(null)

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (val) => {
    setSelected(val)
    onValueChange?.(val)
    setIsOpen(false)
  }

  return (
    <SelectContext.Provider value={{ isOpen, setIsOpen, selected, handleSelect }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({ className, children, ...props }) {
  const { isOpen, setIsOpen } = React.useContext(SelectContext)
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-all duration-200",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <svg className={cn("h-4 w-4 opacity-50 transition-transform duration-200", isOpen && "rotate-180")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
  )
}

function SelectValue({ placeholder }) {
  const { selected } = React.useContext(SelectContext)
  return <span className={cn(!selected && "text-muted-foreground")}>{selected || placeholder}</span>
}

function SelectContent({ className, children, ...props }) {
  const { isOpen } = React.useContext(SelectContext)
  if (!isOpen) return null
  return (
    <div
      className={cn(
        "absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-lg border border-border bg-white shadow-lg animate-fade-in",
        className
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  )
}

function SelectItem({ value, className, children, ...props }) {
  const { selected, handleSelect } = React.useContext(SelectContext)
  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-md py-2 px-3 text-sm outline-none hover:bg-gray-100 transition-colors duration-150",
        selected === value && "bg-gray-100 font-medium",
        className
      )}
      onClick={() => handleSelect(value)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
