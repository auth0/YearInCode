import * as React from 'react'

import {
  Button,
  ProgressBar,
  Typography,
  ToggleButton,
  Group,
  Alert,
} from '@components/ui'
import {useQueuePoster} from '@lib/poster/poster-hooks'
import {Year} from '@nebula/types/queue'
import {PosterSteps} from '@nebula/types/poster'

const years: Year[] = [2017, 2018, 2019, 2020]

interface SelectYearsProps {
  completedYears: number[]
  setStep: (step: PosterSteps) => void
}

const SelectYears: React.FC<SelectYearsProps> = ({setStep, completedYears}) => {
  const {mutateAsync, isLoading, isSuccess, isError} = useQueuePoster()
  const [selectedYear, setSelectedYear] = React.useState<Year>()

  const toggleYear = (year: Year) => () => {
    setSelectedYear(year)
  }

  const submitToQueue = () => {
    if (!selectedYear) return
    mutateAsync({year: selectedYear})
      .then(() => setStep(PosterSteps.PREPARING))
      .catch(console.error)
  }

  return (
    <section className="flex flex-col items-center justify-center flex-1 px-4 space-y-12">
      <div className="flex flex-col items-center w-full">
        {isError && (
          <Alert type="warning" className="my-12 animate-fade-in">
            Error queuing. Please try again.
          </Alert>
        )}

        <ProgressBar className="max-w-md" max={100} value={0} />
      </div>

      <header className="flex flex-col items-center space-y-12 text-center">
        <Typography className="max-w-5xl font-semibold" variant="h1">
          Nice to see you here!
          <br /> Which year do you want to visualize?
        </Typography>
        <Typography
          variant="h6"
          as="p"
          className="max-w-2xl leading-relaxed text-white opacity-60"
        >
          You will be able to generate more years after this one.
        </Typography>
      </header>

      <Group className="flex flex-wrap justify-center">
        {years.map(year => (
          <ToggleButton
            className="m-2"
            onPress={toggleYear(year)}
            isSelected={selectedYear === year}
            disabled={completedYears.includes(year)}
            key={year}
          >
            {year}
          </ToggleButton>
        ))}
      </Group>

      <Button
        onPress={submitToQueue}
        disabled={!selectedYear}
        loading={isLoading || isSuccess}
        color="primary"
        size="large"
      >
        Generate Year In Code
      </Button>
    </section>
  )
}

export default SelectYears
