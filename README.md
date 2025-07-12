# GrokCLI

> **Note:** If running from source, GrokCLI is in the `packages/cli` directory. Use `npm install` and `npm start` from there. For published versions, use the `npx` or global install instructions below.

GrokCLI is a command-line AI workflow tool powered by xAI's Grok-4 model. It enables you to:

- Query and edit large codebases in multiple languages
- Generate, edit, and organize files and folders
- Run terminal commands and automate workflows
- Use Grok's multimodal capabilities, including image understanding

## Quickstart

1. **Prerequisites:** Ensure you have [Node.js version 20](https://nodejs.org/en/download) or higher installed.
2. **Install and Run GrokCLI:**

   **One-line install and run:**
   ```bash
   npx grok-cli
   ```
   Or install globally:
   ```bash
   npm install -g grok-cli
   grok
   ```

3. **Authenticate with Grok (xAI):**
   - [Create an xAI account and API key](https://docs.x.ai/docs/getting-started)
   - Set your API key as an environment variable:
     ```bash
     export XAI_API_KEY="your_xai_api_key"
     ```
   - When prompted, select "Grok (xAI) API Key" in the authentication dialog.

4. **Start using GrokCLI!**

## Example Usage

Start a project or work in any directory:
```sh
cd my-project/
grok
> Refactor all Python scripts to use pathlib instead of os.path
```

Automate tasks:
```sh
grok
> Create a new folder called "reports" and move all .md files into it
```

Run terminal commands via Grok:
```sh
grok
> List all files larger than 10MB and delete any .tmp files
```

Use Grok's image understanding:
```sh
grok
> What is shown in screenshot.png?
```

## Features
- **File and folder management:** Create, edit, move, and delete files/folders
- **Terminal access:** Run shell commands with user approval
- **Multimodal:** Send images for analysis (see [xAI docs](https://docs.x.ai/docs/image-understanding))
- **Cross-platform:** Works on macOS, Linux, and Windows (Powershell)

## Authentication Options
- **Grok (xAI) API Key:** Set `XAI_API_KEY` and select in the UI
- **Gemini/Vertex/Google Cloud:** Also supported (see below)

## Troubleshooting
If you have issues, check your `XAI_API_KEY` and review the [xAI docs](https://docs.x.ai/docs/getting-started) or [troubleshooting guide](docs/troubleshooting.md).

## Uninstall
See [Uninstall](docs/Uninstall.md) for instructions.

## Terms of Service and Privacy Notice
See [Terms of Service and Privacy Notice](./docs/tos-privacy.md).

---

# Legacy Information

This project was originally forked from Gemini CLI. For historical reference, the original Gemini CLI repository can be found at [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli).

## Development

### Building from Source

1. **Clone the repository:**
   ```bash
   git clone https://github.com/xai-org/grok-cli.git
   cd grok-cli
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Run from source:**
   ```bash
   npm start
   ```

### Project Structure

- `packages/cli/` - Main CLI application
- `packages/core/` - Core functionality and tools
- `docs/` - Documentation
- `scripts/` - Build and utility scripts

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
