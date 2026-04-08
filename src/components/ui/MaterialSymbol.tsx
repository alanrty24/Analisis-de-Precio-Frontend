type MaterialSymbolProps = {
  name: string
  className?: string
}

const MaterialSymbol = ({ name, className }: MaterialSymbolProps) => {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined leading-none ${className ?? ''}`.trim()}
    >
      {name}
    </span>
  )
}

export default MaterialSymbol