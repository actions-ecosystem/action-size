# Action Size

![screenshot](./docs/assets/screenshot.png)

Add label based on the number of lines changed in a pull request.

Counts the number of lines changed in a pull request.
And buckets this number into a few size classes (S, L, XL, etc), and finally labels the pull request with this size.

This action is inspired by [Kubernetes Prow's size plugin](https://prow.k8s.io/plugins).

## Prerequisites

You need to create labels indicating a pull request size.
The description about the kinds of labels are below.

## Inputs

`github_token`: **Required**. Must be in form of `github_token: ${{ secrets.github_token }}`.

The inputs for labels are optional. The default values are below.

|   Label    | Threshold |
| ---------- | --------- |
| `size/XS`  | `0-9`     |
| `size/S`   | `10-29`   |
| `size/M`   | `30-99`   |
| `size/L`   | `100-499` |
| `size/XL`  | `500-999` |
| `size/XXL` | `1000+`   |

### Size labels

The inputs `size_${size}_label` indicates what name each label has.

|       Key        |  Default   |
| ---------------- | ---------- |
| `size_xs_label`  | `size/XS`  |
| `size_s_label`   | `size/S`   |
| `size_m_label`   | `size/M`   |
| `size_l_label`   | `size/L`   |
| `size_xl_label`  | `size/XL`  |
| `size_xxl_label` | `size/XXL` |

### Size thresholds

The inputs `size_${size}_threshold` indicates how many lines changed is corresponding to each label.
Must be a maximal number, rather than a range.

|         Key          | Default |
| -------------------- | ------- |
| `size_s_threshold`   | `10`    |
| `size_m_threshold`   | `30`    |
| `size_l_threshold`   | `100`   |
| `size_xl_threshold`  | `500`   |
| `size_xxl_threshold` | `1000`  |

## Example

```yaml
name: Size

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions-ecosystem/action-size@v1
        with:
          github_token: ${{ secrets.github_token }}
```

## License

Copyright 2020 The Actions Ecosystem Authors.

Action Size is released under the [Apache License 2.0](./LICENSE).
