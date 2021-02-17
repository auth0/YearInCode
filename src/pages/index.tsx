import {Layout} from '@components/common'
import {Celebrate, Hero, ShowcaseGrid} from '@components/home'

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <Celebrate />
      <ShowcaseGrid />
    </div>
  )
}

Home.Layout = Layout
