import {PosterSteps} from '@nebula/types/poster'

export const steps = {
  [PosterSteps.PREPARING]: {
    title: 'Year In Code assemble begins.\nWe’re analyzing your Github...',
    subtitle:
      'Our bots are checking your activity.\nWe need to understand your work before we create the right canvas.',
    percent: 25,
  },
  [PosterSteps.START]: {
    title: 'Year In Code assemble begins.\nWe’re analyzing your Github...',
    subtitle:
      'Our bots are checking your activity.\nWe need to understand your work before we create the right canvas.',
    percent: 25,
  },
  [PosterSteps.GATHERING]: {
    title: 'We’re gathering info about all of your commits...',
    subtitle:
      'Our bots are checking your activity. We need to understand your work before we create the right canvas.',
    percent: 50,
  },
  [PosterSteps.LAST_TOUCHES]: {
    title: 'Last touches!\nYour Year In Code is almost ready...',
    subtitle:
      'Our bots are checking your activity. We need to understand your work before we create the right canvas.',
    percent: 75,
  },
  [PosterSteps.READY]: {
    title: 'Your Year In Code is ready!\nGo, take a look...',
    subtitle: 'Our bots made a good job!',
    percent: 100,
  },
}
