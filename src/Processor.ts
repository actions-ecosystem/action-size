import * as core from '@actions/core';
import * as github from '@actions/github';
import * as Webhooks from '@octokit/webhooks';

export interface ProcessorOptions {
  githubToken: string;

  sizeXSLabel: string;
  sizeSLabel: string;
  sizeMLabel: string;
  sizeLLabel: string;
  sizeXLLabel: string;
  sizeXXLLabel: string;

  sizeSThreshold: number;
  sizeMThreshold: number;
  sizeLThreshold: number;
  sizeXLThreshold: number;
  sizeXXLThreshold: number;

  dryRun: boolean;
}

/***
 * Processor handles processing.
 */
export class Processor {
  readonly client: github.GitHub;
  readonly options: ProcessorOptions;

  constructor(options: ProcessorOptions) {
    this.options = options;
    this.client = new github.GitHub(options.githubToken);

    if (this.options.dryRun) {
      core.debug(
        'Running in dry-run mode. Debug output will be written but nothing will be processed.'
      );
    }
  }

  process() {
    const changes = Processor.getChangedLines();
    const desiredLabel = this.determineLabel(changes);
    const currentLabels = this.getCurrentSizeLabels();
    core.debug(`desiredLabel=${desiredLabel}, currentLabels=${currentLabels}`);
    this.updateSizeLabel(desiredLabel, currentLabels);
  }

  private getCurrentSizeLabels(): string[] {
    const payload = github.context
      .payload as Webhooks.WebhookPayloadPullRequest;

    return payload.pull_request.labels
      .filter(label =>
        [
          this.options.sizeXSLabel,
          this.options.sizeSLabel,
          this.options.sizeMLabel,
          this.options.sizeLLabel,
          this.options.sizeXLLabel,
          this.options.sizeXXLLabel
        ].includes(label.name)
      )
      .map(label => label.name);
  }

  private determineLabel(changes: number): string {
    if (changes < this.options.sizeSThreshold) {
      return this.options.sizeXSLabel;
    } else if (changes < this.options.sizeMThreshold) {
      return this.options.sizeSLabel;
    } else if (changes < this.options.sizeLThreshold) {
      return this.options.sizeMLabel;
    } else if (changes < this.options.sizeXLThreshold) {
      return this.options.sizeLLabel;
    } else if (changes < this.options.sizeXXLThreshold) {
      return this.options.sizeXLLabel;
    } else {
      return this.options.sizeXXLLabel;
    }
  }

  private updateSizeLabel(desiredLabel: string, currentLabels: string[]) {
    const payload = github.context
      .payload as Webhooks.WebhookPayloadPullRequest;

    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const number = payload.pull_request.number;

    // TODO(micnncim): Make processes asynchronous.
    for (const currentLabel of currentLabels.filter(
      label => label !== desiredLabel
    )) {
      if (!this.options.dryRun) {
        this.client.issues.removeLabel({
          owner,
          repo,
          issue_number: number,
          name: currentLabel
        });
      }
      core.debug(`removed label ${currentLabel} in ${owner}/${repo}#${number}`);
    }

    if (!this.options.dryRun && !currentLabels.includes(desiredLabel)) {
      this.client.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: number,
        labels: [desiredLabel]
      });
      core.debug(`added label ${desiredLabel} in ${owner}/${repo}#${number}`);
    }
  }

  private static getChangedLines(): number {
    const payload = github.context
      .payload as Webhooks.WebhookPayloadPullRequest;

    return payload.pull_request.additions + payload.pull_request.deletions;
  }
}
