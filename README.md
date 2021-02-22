# achernar-flow-data-generator

A power flow data generator for achernar.

This generate csv files from the LV network model data published by Electricity North West.

## Installation

```bash
git clone https://github.com/tighug/achernar-flow-data-generator.git
```

## Usage

1. Download "LV network models" and "LCT Profiles" from [Electricity North West](https://www.enwl.co.uk/go-net-zero/innovation/smaller-projects/low-carbon-networks-fund/low-voltage-network-solutions/)
2. Unzip the both zip files
3. Copy the contents of "LV network models" into the `resource/lvn/`
4. Copy the contents of "lct-profiles" into the `resource/lct/`
5. Rename a few "Network\_..." directories to "network\_..." in `lvn/`
6. Run `yarn start`
7. Get csv files in the `out/`

## Contributing

Please open issues and pull requests for new features, questions, and bug fixes.

### Requirements

- `yarn v1.22.10`

## License

[MIT](./LICENSE)
