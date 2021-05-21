import GitHubIcon from '@assets/svg/github-logo.svg'
import {Button} from '@components/ui'
import {constants} from '@lib/common'

const GoToRepoButton: React.FC = () => (
  <Button
    href={constants.site.githubRepoUrl}
    target="_blank"
    rel="noopener noreferrer"
    icon={<GitHubIcon />}
  >
    Check GitHub Repo
  </Button>
)

export default GoToRepoButton
