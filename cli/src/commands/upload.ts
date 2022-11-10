import {Command, Flags} from '@oclif/core'

export default class Upload extends Command {
  static description = 'Upload File to Bucket'

  static examples = [
    {
      description: 'Upload File to Bucket',
      command: `<%= config.bin %> <%= command.id %>
      --bucket my-bucket-name
      --file path/to/my/file`,
    },
  ]

  static flags = {
    bucket: Flags.string({char: 'b', description: 'Name of the bucket', required: true}),
    file: Flags.string({char: 'f', description: 'Path to the file', required: true}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Upload)
    if (flags.bucket) console.log('--bucket is set')
    if (flags.file) console.log(`--file is: ${flags.file}`)
  }
}
