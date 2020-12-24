import clsx from 'clsx'

import {getBgColor, getIcon} from './Alert.utils'

export interface AlertProps {
  type: 'warning'
  className?: string
}

const Alert: React.FC<AlertProps> = ({type, className, children}) => {
  return (
    <div
      role="alert"
      className={clsx(
        'flex items-center px-8 py-4 rounded space-x-3',
        getBgColor(type),
        className,
      )}
    >
      <span aria-hidden>{getIcon(type)}</span>
      <span>{children}</span>
    </div>
  )
}

export default Alert
