import {Layout} from '@components/common'
import {Celebrate, Hero, MeetDeathStar, ShowcaseGrid} from '@components/home'

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <Celebrate />
      <MeetDeathStar />
      <ShowcaseGrid />
    </div>
  )
}

Home.Layout = Layout
