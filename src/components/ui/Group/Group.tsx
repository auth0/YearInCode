type DivProps = React.HTMLAttributes<HTMLDivElement>

interface GroupProps extends DivProps {
  className?: string
}

const Group: React.FC<GroupProps> = ({children, className, ...rest}) => {
  return (
    <div role="group" className={className} {...rest}>
      {children}
    </div>
  )
}

export default Group
