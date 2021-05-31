import GitHubIcon from '@assets/svg/github-logo.svg'
import TwitterIcon from '@assets/svg/twitter-logo.svg'
import InstagramIcon from '@assets/svg/instagram-logo.svg'
import LinkedInIcon from '@assets/svg/linkedin-logo.svg'
import {constants} from '@lib/common'

export const links = [
  {
    name: 'Legal',
    href: '#',
  },
  {
    name: 'Privacy',
    href: '#',
  },
]

export const socials = [
  {
    id: '1',
    icon: GitHubIcon,
    link: constants.site.githubRepoUrl,
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  {
    id: '2',
    icon: InstagramIcon,
    link: '#',
  },
  {
    id: '3',
    icon: LinkedInIcon,
    link: '#',
  },
  {
    id: '4',
    icon: TwitterIcon,
    link: '#',
  },
]
