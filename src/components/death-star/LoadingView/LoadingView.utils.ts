import {DeathStarSteps} from '@nebula/types/death-star'

export const steps = {
  [DeathStarSteps.PREPARING]: {
    title: 'Death Star assemble begins.\nWe’re analyzing your Github...',
    subtitle:
      'Our bots are checking your activity.\nWe need to understand your work before we create the right canvas.',
    percent: 25,
  },
  [DeathStarSteps.START]: {
    title: 'Death Star assemble begins.\nWe’re analyzing your Github...',
    subtitle:
      'Our bots are checking your activity.\nWe need to understand your work before we create the right canvas.',
    percent: 25,
  },
  [DeathStarSteps.GATHERING]: {
    title: 'We’re gathering info about all of your commits...',
    subtitle:
      'Our bots are checking your activity. We need to understand your work before we create the right canvas.',
    percent: 50,
  },
  [DeathStarSteps.LAST_TOUCHES]: {
    title: 'Last touches!\nYour Death Star is almost ready...',
    subtitle:
      'Our bots are checking your activity. We need to understand your work before we create the right canvas.',
    percent: 75,
  },
  [DeathStarSteps.READY]: {
    title: 'Your Death Star is ready!\nGo, take a look...',
    subtitle: 'Our bots made a good job!',
    percent: 100,
  },
}
