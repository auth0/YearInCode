interface LayoutProps {
  navigation?: React.ReactNode
  content: React.ReactNode
  footer?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({navigation, content, footer}) => (
  <div className="container flex flex-col min-h-screen mx-auto">
    {navigation}
    <main className="flex flex-col flex-1">{content}</main>
    {footer}
  </div>
)

export default Layout
