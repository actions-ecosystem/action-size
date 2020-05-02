import * as core from '@actions/core';
import * as github from '@actions/github';
import * as Webhooks from '@octokit/webhooks';

export interface ProcessorOptions {
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
}

/***
 * Processor handles processing.
 */
export class Processor {
  readonly options: ProcessorOptions;

  constructor(options: ProcessorOptions) {
    this.options = options;
  }

  process() {
    const changes = Processor.getChangedLines();

    const newLabel = this.determineLabel(changes);
    core.setOutput('new_label', newLabel);

    const staleLabels = this.getCurrentSizeLabels();
    core.setOutput('stale_labels', staleLabels.join('\n'));
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
    }
    if (changes < this.options.sizeMThreshold) {
      return this.options.sizeSLabel;
    }
    if (changes < this.options.sizeLThreshold) {
      return this.options.sizeMLabel;
    }
    if (changes < this.options.sizeXLThreshold) {
      return this.options.sizeLLabel;
    }
    if (changes < this.options.sizeXXLThreshold) {
      return this.options.sizeXLLabel;
    }
    return this.options.sizeXXLLabel;
  }

  private static getChangedLines(): number {
    const payload = github.context
      .payload as Webhooks.WebhookPayloadPullRequest;

    return payload.pull_request.additions + payload.pull_request.deletions;
  }
}
