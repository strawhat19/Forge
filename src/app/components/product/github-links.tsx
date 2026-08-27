import { githubLinks } from '@/shared/config/product';
import ForgeIcon from '@/app/components/brand/forge-icon';

type GitHubLinksProps = {
  compact?: boolean;
  className?: string;
};

export default function GitHubLinks({ compact = false, className = `` }: GitHubLinksProps) {
  return (
    <div className={`githubLinks${compact ? ` githubLinksCompact` : ``} ${className}`.trim()} role="group" aria-label="Source repositories">
      <a href={githubLinks.client} target="_blank" rel="noreferrer" aria-label="Open the Forge client repository on GitHub">
        <ForgeIcon name="github" />
        <span>Client</span>
      </a>
      <a href={githubLinks.server} target="_blank" rel="noreferrer" aria-label="Open the cfn-forge server repository on GitHub">
        <ForgeIcon name="github" />
        <span>Server</span>
      </a>
    </div>
  );
}
