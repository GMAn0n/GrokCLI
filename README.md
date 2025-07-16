# GrokCLI

A powerful command-line interface for interacting with Grok (xAI) that supports file reading, editing, and creation operations.

## Features

- **File Operations**: Read, edit, and create files through natural language commands
- **Grok Integration**: Direct integration with xAI's Grok model via API
- **Tool System**: Comprehensive tool registry for file management operations
- **Modern UI**: Beautiful terminal interface with themes and real-time feedback
- **Authentication**: Multiple authentication methods including OAuth and API keys

## Quick Start

### Prerequisites

- Node.js 20.0.0 or higher
- xAI API key (get one from [console.x.ai](https://console.x.ai))

### Installation

```bash
# Clone the repository
git clone https://github.com/GMAn0n/GrokCLI
cd GrokCLI

# Install dependencies
npm install

# Build the project
npm run build

# Install GrokCLI globally (so you can run 'grok' from anywhere)
npm install -g .

# Now you can run the CLI from anywhere:
grok
```

### Usage

Once started, you can interact with Grok using natural language:

```
> Create a new file called hello.txt with "Hello World"
> @package.json Add a new script called test: echo hello
> Show me the contents of src/main.ts
> Find all files containing "function"
```

## File Operations

GrokCLI supports the following file operations:

- **Read Files**: `Show me the contents of filename.txt`
- **Create Files**: `Create a new file called filename.txt with content`
- **Edit Files**: `@filename.txt Add a new line at the end`
- **Search Files**: `Find all files containing "search term"`
- **List Directories**: `What files are in the src folder?`

## Authentication

**API Key**: Use your xAI API key directly


## Development

### Project Structure

```
GrokCLI/
├── packages/
│   ├── cli/          # Main CLI application
│   └── core/         # Core library and tools
├── scripts/          # Build and utility scripts
└── docs/            # Documentation
```

### Building

```bash
# Build all packages
npm run build

# Build specific package
npm run build --workspace=packages/cli
```

### Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- packages/core/src/tools/read-file.test.ts
```

## Configuration

The CLI can be configured through:

- Environment variables
- Configuration files
- Command-line arguments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

Apache 2.0 License - see LICENSE file for details.

## Acknowledgments

- Built on top of the original GrokCLI project
- Enhanced with comprehensive file operations
- Integrated with xAI's Grok model
