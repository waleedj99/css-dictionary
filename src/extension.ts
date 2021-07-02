// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "css-dictionary" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let myCommandId = 'css-dictionary.cssSort';

	let disposable = vscode.commands.registerCommand(myCommandId, () => {
		// The code you place here will be executed every time your command is executed

		const editor = vscode.window.activeTextEditor;
		if (editor?.document.fileName.slice(editor?.document.fileName.length - 3, editor?.document.fileName.length) === "css") {
			let text: String;


			if (!editor) {
				vscode.window.showInformationMessage("editor does not exist");
				return;
			}
			//Initialises with all the text in the document
			text = editor.document.getText();
			let selectionFlag: "Selection" | "Document";
			selectionFlag = "Document";
			//Checks if the text is selected
			//console.log("Selection is ----", editor.document.getText(editor.selection), "-----", editor.document.getText(editor.selection) !== "");
			if (editor.document.getText(editor.selection) !== "") {
				text = editor.document.getText(editor.selection);
				selectionFlag = "Selection";
			}

			let reCSS = /[#.a-zA-Z0-9]+\{{1}[ \r\na-zA-Z0-9:'",;]*\}/g;
			let fullCSS: any[] | null;

			let reClassname = /[#.a-zA-Z0-9]+\{{1}/g;
			fullCSS = text.match(reCSS);

			if (fullCSS !== null) {
				let cssName: any[] | null | undefined;
				cssName = text.match(reClassname);
				cssName = cssName?.map((val) => {
					return (val.slice(0, val.length - 1));
				});
				//console.log(cssName);

				let cssNameToValue: {
					[x: string]: string;
				} = {};
				cssName?.map((val, index) => {
					if (fullCSS !== null) {
						cssNameToValue[val] = fullCSS[index];
					}

				});


				//console.log(cssNameToValue);

				if (cssName !== undefined) {
					cssName.sort();
				}


				let newString = "";
				fullCSS?.map((val) => {
					newString += val;
				});

				//console.log(text.replace(/\s/g, "").length);
				//console.log(newString.replace(/\s/g, "").length);
				//vscode.window.showInformationMessage(`message is ${result}`);
				if (text.replace(/\s/g, "").length === newString.replace(/\s/g, "").length) {
					editor.edit((editBuilder) => {

						let rangeToSort: vscode.Range;

						if (selectionFlag === "Document") {
							rangeToSort = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(editor.document.lineCount + 1, 0));
							editBuilder.delete(rangeToSort);
						} else if (selectionFlag === "Selection") {
							//console.log(editor.selection.start);
							rangeToSort = new vscode.Range(editor.selection.start, editor.selection.end);
							editBuilder.delete(rangeToSort);
						}

						cssName?.map((val) => {
							editBuilder.insert(rangeToSort.start, cssNameToValue[val]);
							editBuilder.insert(rangeToSort.start, "\n");
						});

					});
					vscode.window.showInformationMessage(`Success! ${fullCSS.length} Classes were sorted`);
				} else {
					vscode.window.showInformationMessage(`Sorting Failed! Classes were not selected properly Only ${fullCSS.length} Classes selected`);
				}

			} else {
				vscode.window.showErrorMessage("Sorting Failed!Classes were not selected properly");
			}
		} else {
			vscode.window.showErrorMessage("Sorting only works on CSS Files");
		}
	});

	context.subscriptions.push(disposable);

	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = myCommandId;
	context.subscriptions.push(myStatusBarItem);

	// context.subscriptions.push(vscode.window.onDidChangeWindowState(() => { updateStatusBarItem("Idle"); }));
	// context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(()=>{updateStatusBarItem("Idle");}));

	// update status bar item once at start
	updateStatusBarItem("Idle");

}

function updateStatusBarItem(iconStatus: "Success" | "Failure" | "Idle"): void {

	if (iconStatus === "Idle") {
		myStatusBarItem.text = `$(list-flat)$(chevron-down)`;
	}
	if (iconStatus === "Success") {
		myStatusBarItem.text = `$(list-flat)$(chevron-down)$(check)`;
	}
	if (iconStatus === "Failure") {
		myStatusBarItem.text = `$(list-flat)$(chevron-down)$(close)`;
	}

	myStatusBarItem.show();
}

// this method is called when your extension is deactivated
export function deactivate() {}