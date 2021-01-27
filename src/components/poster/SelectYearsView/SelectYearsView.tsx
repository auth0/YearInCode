import * as React from 'react'

import {
  Button,
  ProgressBar,
  Typography,
  ToggleButton,
  Group,
} from '@components/ui'
import {arrayToObjectKeys} from '@lib/common'
import {useQueueDeathStar} from '@lib/poster/poster-hooks'
import {Years} from '@nebula/types/queue'
import {PosterSteps} from '@nebula/types/poster'

const years: Years = ['2017', '2018', '2019', '2020']

interface SelectYearsProps {
  userId: string
  setStep: (step: PosterSteps) => void
}

const SelectYears: React.FC<SelectYearsProps> = ({userId, setStep}) => {
  const {mutateAsync, isLoading, isSuccess} = useQueueDeathStar()
  const [selectedYears, setSelectedYears] = React.useState(() =>
    arrayToObjectKeys(years),
  )

  // Get years that are toggled
  const toggledYears = Object.keys(selectedYears).filter(
    key => selectedYears[key],
  ) as Years

  const toggleYear = (year: string) => () => {
    const newSelectedYears = {...selectedYears}
    newSelectedYears[year] = !selectedYears[year]

    setSelectedYears(newSelectedYears)
  }

  const submitToQueue = () => {
    // Get years that are toggled

    mutateAsync({userId, years: toggledYears})
      .then(() => setStep(PosterSteps.PREPARING))
      .catch(console.error)
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 space-y-12">
      <ProgressBar className="max-w-md" max={100} value={0} />

      <header className="flex flex-col items-center text-center space-y-12">
        <Typography className="max-w-5xl font-semibold" variant="h1">
          Nice to see you here!
          <br /> Which year do you want to visualize?
        </Typography>
        <Typography
          variant="h6"
          as="p"
          className="max-w-2xl text-white leading-relaxed opacity-60"
        >
          You can select more than one but it’ll take more time to generate.
        </Typography>
      </header>

      <Group className="flex space-x-4">
        {years.map(year => (
          <ToggleButton
            onPress={toggleYear(year)}
            isSelected={selectedYears[year]}
            key={year}
          >
            {year}
          </ToggleButton>
        ))}
      </Group>

      <Button
        onPress={submitToQueue}
        disabled={toggledYears.length === 0}
        loading={isLoading || isSuccess}
        color="primary"
        size="large"
      >
        Generate Death Star
      </Button>
    </section>
  )
}

export default SelectYears
