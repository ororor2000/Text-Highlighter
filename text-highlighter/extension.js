const vscode = require('vscode');
const fs = require('fs-extra');
const path = require('path');

const decorations = {};
let highlights = {};
let colorCounter = 0;
let colors = [];

const tempFolderPath = '/tmp/vscode-highlights'; // Temporary folder path

// Ensure the temporary folder exists
fs.ensureDirSync(tempFolderPath);

function applyHighlight() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        console.log('No active editor');
        return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection).trim();

    if (!selectedText) {
        console.log('No text selected');
        return;
    }

    const color = getNextColor();
    const group = colorCounter;

    const regex = new RegExp(`\\b${selectedText}\\b`, 'g');
    const decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: color
    });

    decorations[group] = { decorationType, color };

    const ranges = [];
    const newRanges = [];

    for (let i = 0; i < editor.document.lineCount; i++) {
        const line = editor.document.lineAt(i);
        let match;
        while ((match = regex.exec(line.text)) !== null) {
            const startPos = line.range.start.translate(0, match.index);
            const endPos = startPos.translate(0, selectedText.length);
            const range = new vscode.Range(startPos, endPos);
            ranges.push({ range });
            newRanges.push(range);
        }
    }

    if (!highlights[group]) {
        highlights[group] = new Map();
    }
    highlights[group].set(selectedText, newRanges);

    editor.setDecorations(decorationType, ranges);
}

function getNextColor() {
    if (!colors.length) {
        colors = vscode.workspace.getConfiguration("textHighlighter").get("colors") || [];
        console.log('Colors loaded:', colors);
    }
    const color = colors[colorCounter % colors.length];
    colorCounter++;
    return color;
}

function clearAllHighlights() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    for (const group in decorations) {
        if (decorations[group]) {
            editor.setDecorations(decorations[group].decorationType, []);
            decorations[group].decorationType.dispose();
            delete decorations[group];
        }
    }
    highlights = {};
    console.log('All highlights cleared');
}

function removeHighlightFromGroup() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const selectedText = editor.document.getText(editor.selection).trim();
    if (!selectedText) return;

    for (const group in highlights) {
        const wordRanges = highlights[group];
        if (wordRanges.has(selectedText)) {
            clearGroup(Number(group));
            break;
        }
    }
}

function clearGroup(group) {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !decorations[group]) return;

    editor.setDecorations(decorations[group].decorationType, []);
    decorations[group].decorationType.dispose();
    delete decorations[group];
    highlights[group]?.clear();
    console.log(`Cleared highlight for group ${group}`);
}

function saveHighlights(document) {
    let filename = document.fileName;

    // Remove .git extension if present
    filename = filename.replace(/\.git$/, '');

    const highlightsToSave = [];

    for (const group in highlights) {
        const wordRanges = highlights[group];
        wordRanges.forEach((ranges, word) => {
            const color = decorations[group]?.color || '';
            const rangesToSave = ranges.map(range => ({
                startLine: range.start.line,
                startCharacter: range.start.character,
                endLine: range.end.line,
                endCharacter: range.end.character
            }));
            highlightsToSave.push({ group, color, word, ranges: rangesToSave });
        });
    }

    if (highlightsToSave.length > 0) {
        const tempFileName = path.join(tempFolderPath, `${path.basename(filename)}.json`);
        console.log(`Saving highlights for ${filename} to ${tempFileName}`);
        fs.writeJsonSync(tempFileName, highlightsToSave, { spaces: 2 });
    } else {
        console.log(`No highlights to save for ${filename}`);
    }
}

function loadHighlights(editor) {
    let filename = editor.document.fileName;

    // Remove .git extension if present
    filename = filename.replace(/\.git$/, '');

    const tempFileName = path.join(tempFolderPath, `${path.basename(filename)}.json`);

    if (fs.existsSync(tempFileName)) {
        console.log(`Loading saved highlights for ${filename} from ${tempFileName}`);
        const savedHighlights = fs.readJsonSync(tempFileName);

        savedHighlights.forEach(highlight => {
            const { group, color, word, ranges } = highlight;
            const decorationType = vscode.window.createTextEditorDecorationType({
                backgroundColor: color
            });
            decorations[group] = { decorationType, color };

            const rangesToApply = ranges.map(range => ({
                range: new vscode.Range(
                    new vscode.Position(range.startLine, range.startCharacter),
                    new vscode.Position(range.endLine, range.endCharacter)
                )
            }));

            editor.setDecorations(decorationType, rangesToApply);

            if (!highlights[group]) {
                highlights[group] = new Map();
            }
            highlights[group].set(word, rangesToApply.map(option => option.range));
        });
    } else {
        console.log(`No saved highlights found for ${filename}`);
    }
}

function activate(context) {
    const highlightCommand = vscode.commands.registerCommand('extension.highlight', applyHighlight);
    const clearAllCommand = vscode.commands.registerCommand('extension.clearAllHighlights', clearAllHighlights);
    const removeGroupHighlightCommand = vscode.commands.registerCommand('extension.removeHighlightFromGroup', removeHighlightFromGroup);

    context.subscriptions.push(highlightCommand, clearAllCommand, removeGroupHighlightCommand);

    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(document => saveHighlights(document)));

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            loadHighlights(editor);
        }
    }));
}

function deactivate() {
    clearAllHighlights();
}

module.exports = {
    activate,
    deactivate
};
