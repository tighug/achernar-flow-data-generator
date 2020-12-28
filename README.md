# achernar-flow-data-generator

A power flow data generator for achernar-flow-db.

This generate csv files from the LV network model data published by Electricity North West.

## Installation

```bash
git clone https://github.com/tighug/achernar-flow-data-generator.git
```

## Usage

1. Download "LV network models" from [Electricity North West](https://www.enwl.co.uk/go-net-zero/innovation/smaller-projects/low-carbon-networks-fund/low-voltage-network-solutions/)
2. Copy the contents into the `resource/`
3. Rename a few "Network\_..." directories to "network\_..."
4. Run `yarn start`
5. Get csv files in the `out/`

## License

[MIT](./LICENSE)
