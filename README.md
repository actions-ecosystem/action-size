# Action Size

[![actions-workflow-test][actions-workflow-test-badge]][actions-workflow-test]
[![release][release-badge]][release]
[![license][license-badge]][license]

![screenshot](./docs/assets/screenshot-add-label.png)
![screenshot](./docs/assets/screenshot-remove-and-add-label.png)

Determine a label to be added based on the number of lines changed in a pull request.

Counts the number of lines changed in a pull request.
And buckets this number into a few size classes (S, L, XL, etc).

It would be better to work with other actions which add and remove labels.
See [the example below](#example) for detail.

This action is inspired by [Kubernetes Prow's size plugin](https://prow.k8s.io/plugins).

## Prerequisites

You need to create labels indicating a pull request size.
The description about the kinds of labels are below.

## Inputs

All the inputs are optional.

### Size labels

The inputs `size_${size}_label` indicates what name each label has.

|         NAME         |         DESCRIPTION          |   TYPE   | REQUIRED |  DEFAULT   |
|----------------------|------------------------------|----------|----------|------------|
| `size_xs_label`      | The name for size XS label.  | `string` | `false`  | `size/XS`  |
| `size_s_label`       | The name for size S label.   | `string` | `false`  | `size/S`   |
| `size_m_label`       | The name for size M label.   | `string` | `false`  | `size/M`   |
| `size_xl_label`      | The name for size XL label.  | `string` | `false`  | `size/XL`  |
| `size_xxl_label`     | The name for size XXL label. | `string` | `false`  | `size/XXL` |

### Size thresholds

The inputs `size_${size}_threshold` indicates how many lines changed is corresponding to each label.
Must be a maximal number, rather than a range.

|         NAME         |         DESCRIPTION          |   TYPE   | REQUIRED |  DEFAULT   |
|----------------------|------------------------------|----------|----------|------------|
| `size_s_threshold`   | The threshold for size S.    | `number` | `false`  | `10`       |
| `size_m_threshold`   | The threshold for size M.    | `number` | `false`  | `30`       |
| `size_l_threshold`   | The threshold for size L.    | `number` | `false`  | `100`      |
| `size_xl_threshold`  | The threshold for size XL.   | `number` | `false`  | `500`      |
| `size_xxl_threshold` | The threshold for size XXL.  | `number` | `false`  | `1000`     |

## Outputs

|      NAME      |                                                                          DESCRIPTION                                                                           |   TYPE   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `new_label`    | The new label's name to be added. If there's no label to be added, it the value is `''`.                                                                       | `string` |
| `stale_labels` | The stale labels' name to be removed. If there're multiple labels, they're separated by line breaks. If there's no labels to be removed, it the value is `''`. | `string` |

## Example

This action works well with [actions-ecosystem/action-add-labels](https://github.com/actions-ecosystem/action-add-labels) and [actions-ecosystem/action-remove-labels](https://github.com/actions-ecosystem/action-remove-labels).

```yaml
name: Size

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  update_labels:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions-ecosystem/action-size@v2
        id: size
      - uses: actions-ecosystem/action-remove-labels@v1
        with:
          github_token: ${{ secrets.github_token }}
          labels: ${{ steps.size.outputs.stale_labels }}
      - uses: actions-ecosystem/action-add-labels@v1
        with:
          github_token: ${{ secrets.github_token }}
          labels: ${{ steps.size.outputs.new_label }}
```

## License

Copyright 2020 The Actions Ecosystem Authors.

Action Size is released under the [Apache License 2.0](./LICENSE).

<!-- badge links -->

[actions-workflow-test]: https://github.com/actions-ecosystem/action-size/actions?query=workflow%3ATest
[actions-workflow-test-badge]: https://img.shields.io/github/workflow/status/actions-ecosystem/action-size/Test?label=Test&style=for-the-badge&logo=github

[release]: https://github.com/actions-ecosystem/action-size/releases
[release-badge]: https://img.shields.io/github/v/release/actions-ecosystem/action-size?style=for-the-badge&logo=github

[license]: LICENSE
[license-badge]: https://img.shields.io/github/license/actions-ecosystem/action-size?style=for-the-badge
