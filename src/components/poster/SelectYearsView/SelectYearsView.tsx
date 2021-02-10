import * as React from 'react'

import {
  Button,
  ProgressBar,
  Typography,
  ToggleButton,
  Group,
  Alert,
} from '@components/ui'
import {useQueueDeathStar} from '@lib/poster/poster-hooks'
import {Years} from '@nebula/types/queue'
import {PosterSteps} from '@nebula/types/poster'

const years: Years = ['2017', '2018', '2019', '2020']

interface SelectYearsProps {
  userId: string
  setStep: (step: PosterSteps) => void
}

const SelectYears: React.FC<SelectYearsProps> = ({userId, setStep}) => {
  const {mutateAsync, isLoading, isSuccess, isError} = useQueueDeathStar()
  const [selectedYear, setSelectedYear] = React.useState<Years[0]>()

  const toggleYear = (year: Years[0]) => () => {
    setSelectedYear(year)
  }

  const submitToQueue = () => {
    mutateAsync({userId, years: [selectedYear]})
      .then(() => setStep(PosterSteps.PREPARING))
      .catch(console.error)
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 space-y-12">
      <div className="flex flex-col items-center w-full">
        {isError && (
          <Alert type="warning" className="my-12 animate-fade-in">
            Error queuing. Please try again.
          </Alert>
        )}

        <ProgressBar className="max-w-md" max={100} value={0} />
      </div>

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
            isSelected={selectedYear === year}
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
        Generate Death Star
      </Button>
    </section>
  )
}

export default SelectYears
