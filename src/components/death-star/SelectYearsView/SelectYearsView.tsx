import {
  Button,
  ProgressBar,
  Typography,
  ToggleButton,
  Group,
} from '@components/ui'

import {years} from './SelectYearsView.utils'

interface SelectYearsProps {
  setInProgress: (value: boolean) => void
}

const SelectYears: React.FC<SelectYearsProps> = ({setInProgress}) => {
  // TODO: Request generation with selected year(s)
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
          <ToggleButton key={year}>{year}</ToggleButton>
        ))}
      </Group>

      <Button onPress={() => setInProgress(true)} color="primary" size="large">
        Generate Death Star
      </Button>
    </section>
  )
}

export default SelectYears
