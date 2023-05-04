import * as vscode from 'vscode';

function formatSqlQuery(sql: string): string {
    // Split the raw SQL string into an array of lines
    const lines = sql.split('\n');

    // Trim leading and trailing whitespace from each line
    const trimmedLines = lines.map(line => line.trim());

    // Format the lines with the appropriate prefixes and suffixes
    const formattedLines = trimmedLines.map((line, index) => {
        if (index === 0) {
            return `"${line} "`;
        } else if (index === trimmedLines.length - 1) {
            return `+ "${line}"`;
        } else {
            return `+ "${line} "`;
        }
    });

    // Join the formatted lines together with line breaks and indent them with four spaces
    const indentedSql = formattedLines.join('\n    ');

    // Format the SQL string as a Java string
    const formattedJavaString = `String sql = ${indentedSql};`;

    // Return the formatted Java string
    return formattedJavaString;
}

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('extension.stripJavaSQL', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);

        const strippedText = text.split(' ').map(line => {
            return line.replace(/^\+/, '').replace(/"/g, '');
        }).join(' ');



        // Create a new tab and output the stripped text
        vscode.workspace.openTextDocument({ content: strippedText }).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    });

    const disposable2 = vscode.commands.registerCommand('extension.encodeJavaSQL', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        const selection = editor.selection;
        const text = editor.document.getText(selection);

        // for the first line of the selection, add "String sql =" to the beginning then have double quotes around each line and a + at the beginning of each new line, then at the end have a semi-colon 
        const formattedSql = formatSqlQuery(text);



        // Create a new tab and output the stripped text
        vscode.workspace.openTextDocument({ content: formattedSql }).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    });


    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);
}

