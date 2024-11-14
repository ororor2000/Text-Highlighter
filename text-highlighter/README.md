Here's a full example of what your `README.md` file could look like for the Text Highlighter extension:

```markdown
# Text Highlighter

A Visual Studio Code extension to highlight text with dynamic colors based on your selection. It supports highlighting specific words, clearing all highlights, and removing highlights from specific groups.

## Features

- Highlight selected text with dynamic colors.
- Remove highlights from all groups or from a specific group based on the selected text.
- Highlights persist across editor sessions and are saved to a temporary folder.
- Customize the colors used for highlights.

## Commands

- **Highlight Text Based on Selection**
  `Ctrl+1` (Windows/Linux) or `Cmd+1` (macOS)
  Highlights the selected text with a dynamic color.

- **Clear All Highlights**
  `Ctrl+Shift+2` (Windows/Linux) or `Cmd+Shift+2` (macOS)
  Clears all highlights from the editor.

- **Remove Highlight From Group**
  `Ctrl+Shift+1` (Windows/Linux) or `Cmd+Shift+1` (macOS)
  Removes highlights from the group that matches the selected text.

## Configuration

You can configure the colors used for highlighting through the settings:

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Search for `Preferences: Open Settings (JSON)`.
3. Add or modify the `textHighlighter.colors` setting:

```json
"textHighlighter.colors": [
    "rgba(255, 85, 85, 1)",  // Red
    "rgba(85, 255, 85, 1)",  // Green
    "rgba(85, 85, 255, 1)",  // Blue
    "rgba(255, 255, 85, 1)",  // Yellow
    "rgba(255, 85, 255, 1)",  // Pink
    "rgba(85, 255, 255, 1)",  // Cyan
    "rgba(255, 165, 0, 1)",   // Orange
    "rgba(160, 32, 240, 1)"   // Purple
]
```

Feel free to adjust the list to your preferences.

## Installation

### From the Visual Studio Marketplace:

1. Open VS Code.
2. Go to the Extensions view by pressing `Ctrl+Shift+X` (or `Cmd+Shift+X` on macOS).
3. Search for "Text Highlighter".
4. Click Install.

### Manually (via VSIX file):

1. Run `vsce package` in the terminal to generate the `.vsix` file.
2. In VS Code, run the following command to install the `.vsix` file:
   ```bash
   code --install-extension text-highlighter-1.0.0.vsix
   ```

## How to Use

1. Select a portion of text in your editor.
2. Use `Ctrl+1` (or `Cmd+1` on macOS) to highlight the selected text.
3. To remove highlights, use the `Ctrl+Shift+1` (or `Cmd+Shift+1` on macOS) command after selecting the highlighted text.
4. To clear all highlights, use `Ctrl+Shift+2` (or `Cmd+Shift+2` on macOS).

## Development

To contribute to this extension or make changes:

1. Clone the repository.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the extension in VS Code by pressing `F5` (opens a new VS Code window with the extension running).

## License

This extension is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Credits

- This extension was built by [Your Name or Company].
- For any questions, please feel free to contact me via [your-email@example.com](mailto:your-email@example.com).

```

### Explanation of Sections:

- **Features**: Lists what the extension can do.
- **Commands**: Describes the available commands and their keyboard shortcuts.
- **Configuration**: Explains how users can customize highlight colors.
- **Installation**: Provides instructions for installing the extension via VS Code Marketplace or manually using a `.vsix` file.
- **How to Use**: Gives instructions for using the extension within VS Code.
- **Development**: Describes how to contribute or develop the extension.
- **License**: Adds the license type (MIT License in this case, but you can change it based on your needs).
- **Credits**: If you have collaborators, mention them here.

This `README.md` file should work well for guiding users through installing, configuring, and using your extension!
