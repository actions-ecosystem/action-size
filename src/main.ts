import * as core from '@actions/core';
import {Processor, ProcessorOptions} from './Processor';

async function run(): Promise<void> {
  try {
    const args = getAndValidateArgs();

    const processor: Processor = new Processor(args);
    processor.process();
  } catch (error) {
    core.error(error);
    core.setFailed(error);
  }
}

function getAndValidateArgs(): ProcessorOptions {
  const args: ProcessorOptions = {
    githubToken: core.getInput('github_token', {required: true}),

    sizeXSLabel: core.getInput('size_xs_label'),
    sizeSLabel: core.getInput('size_s_label'),
    sizeMLabel: core.getInput('size_m_label'),
    sizeLLabel: core.getInput('size_l_label'),
    sizeXLLabel: core.getInput('size_xl_label'),
    sizeXXLLabel: core.getInput('size_xxl_label'),

    sizeSThreshold: parseInt(core.getInput('size_s_threshold')),
    sizeMThreshold: parseInt(core.getInput('size_m_threshold')),
    sizeLThreshold: parseInt(core.getInput('size_l_threshold')),
    sizeXLThreshold: parseInt(core.getInput('size_xl_threshold')),
    sizeXXLThreshold: parseInt(core.getInput('size_xxl_threshold')),

    dryRun: core.getInput('dry_run') === 'true'
  };

  for (const numberInput of [
    'size_s_threshold',
    'size_m_threshold',
    'size_l_threshold',
    'size_xl_threshold',
    'size_xxl_threshold'
  ]) {
    if (isNaN(parseInt(core.getInput(numberInput)))) {
      throw Error(`input ${numberInput} did not parse to a valid integer`);
    }
  }

  return args;
}

run();
