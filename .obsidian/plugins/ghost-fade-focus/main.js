/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

'use strict';

var obsidian = require('obsidian');
var view = require('@codemirror/view');
var state = require('@codemirror/state');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const DEFAULT_SETTINGS = {
    enabled: false,
    opacity_1: 0.85,
    opacity_2: 0.7,
    opacity_3: 0.55,
    opacity_4: 0.4,
    opacity_5: 0.25,
    opacity: 0.1,
};
class GhostFocusSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        this.containerEl.createEl("h1", { text: "Ghost Fade Focus settings" });
        new obsidian.Setting(containerEl)
            .setName("Enable Ghost Fade Focus")
            .setDesc("Toggles the fade; using command palette or shortcut toggles this same value.")
            .addToggle((toggle) => toggle
            .setValue(this.plugin.settings.enabled)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.enabled = value;
            yield this.plugin.saveSettings();
            this.plugin.cssVariablesBasedOnEnabledState();
        })));
        this.containerEl.createEl("h2", { text: "Opacity" });
        this.containerEl.createEl("p", {
            text: "These will change the opacity levels used.",
        });
        let opacityLevel1;
        new obsidian.Setting(containerEl)
            .setName("Opacity - level 1")
            .setDesc("(Default 0.85)")
            .addSlider((slider) => slider
            .setLimits(0.1, 0.9, 0.05)
            .setValue(this.plugin.settings.opacity_1)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            opacityLevel1.innerText = " " + value.toString();
            this.plugin.settings.opacity_1 = value;
            this.plugin.rootElement.style.setProperty("--ghost-fade-focus-opacity-1", `${value}`);
            yield this.plugin.saveSettings();
        })))
            .settingEl.createDiv("", (el) => {
            opacityLevel1 = el;
            el.style.minWidth = "2.0em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.opacity_1.toString();
        });
        let opacityLevel2;
        new obsidian.Setting(containerEl)
            .setName("Opacity - level 2")
            .setDesc("(Default 0.7)")
            .addSlider((slider) => slider
            .setLimits(0.1, 0.9, 0.05)
            .setValue(this.plugin.settings.opacity_2)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            opacityLevel2.innerText = " " + value.toString();
            this.plugin.settings.opacity_2 = value;
            this.plugin.rootElement.style.setProperty("--ghost-fade-focus-opacity-2", `${value}`);
            yield this.plugin.saveSettings();
        })))
            .settingEl.createDiv("", (el) => {
            opacityLevel2 = el;
            el.style.minWidth = "2.0em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.opacity_2.toString();
        });
        let opacityLevel3;
        new obsidian.Setting(containerEl)
            .setName("Opacity - level 3")
            .setDesc("(Default 0.55)")
            .addSlider((slider) => slider
            .setLimits(0.1, 0.9, 0.05)
            .setValue(this.plugin.settings.opacity_3)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            opacityLevel3.innerText = " " + value.toString();
            this.plugin.settings.opacity_3 = value;
            this.plugin.rootElement.style.setProperty("--ghost-fade-focus-opacity-3", `${value}`);
            yield this.plugin.saveSettings();
        })))
            .settingEl.createDiv("", (el) => {
            opacityLevel3 = el;
            el.style.minWidth = "2.0em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.opacity_3.toString();
        });
        let opacityLevel4;
        new obsidian.Setting(containerEl)
            .setName("Opacity - level 4")
            .setDesc("(Default 0.4)")
            .addSlider((slider) => slider
            .setLimits(0.1, 0.9, 0.05)
            .setValue(this.plugin.settings.opacity_4)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            opacityLevel4.innerText = " " + value.toString();
            this.plugin.settings.opacity_4 = value;
            this.plugin.rootElement.style.setProperty("--ghost-fade-focus-opacity-4", `${value}`);
            yield this.plugin.saveSettings();
        })))
            .settingEl.createDiv("", (el) => {
            opacityLevel4 = el;
            el.style.minWidth = "2.0em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.opacity_4.toString();
        });
        let opacityLevel5;
        new obsidian.Setting(containerEl)
            .setName("Opacity - level 5")
            .setDesc("(Default 0.25)")
            .addSlider((slider) => slider
            .setLimits(0.1, 0.9, 0.05)
            .setValue(this.plugin.settings.opacity_5)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            opacityLevel5.innerText = " " + value.toString();
            this.plugin.settings.opacity_5 = value;
            this.plugin.rootElement.style.setProperty("--ghost-fade-focus-opacity-5", `${value}`);
            yield this.plugin.saveSettings();
        })))
            .settingEl.createDiv("", (el) => {
            opacityLevel5 = el;
            el.style.minWidth = "2.0em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.opacity_5.toString();
        });
        let opacityLevel;
        new obsidian.Setting(containerEl)
            .setName("Opacity level outside of 5 steps")
            .setDesc("(Default 0.1)")
            .addSlider((slider) => slider
            .setLimits(0.1, 0.9, 0.05)
            .setValue(this.plugin.settings.opacity)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            opacityLevel.innerText = " " + value.toString();
            this.plugin.settings.opacity = value;
            this.plugin.rootElement.style.setProperty("--ghost-fade-focus-opacity", `${value}`);
            yield this.plugin.saveSettings();
        })))
            .settingEl.createDiv("", (el) => {
            opacityLevel = el;
            el.style.minWidth = "2.0em";
            el.style.textAlign = "right";
            el.innerText = " " + this.plugin.settings.opacity.toString();
        });
    }
}

class GhostFocusPlugin extends obsidian.Plugin {
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign(DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    addCSSVariables() {
        this.rootElement = document.documentElement;
        this.rootElement.style.setProperty("--ghost-fade-focus-opacity-1", `${this.settings.opacity_1}`);
        this.rootElement.style.setProperty("--ghost-fade-focus-opacity-2", `${this.settings.opacity_2}`);
        this.rootElement.style.setProperty("--ghost-fade-focus-opacity-3", `${this.settings.opacity_3}`);
        this.rootElement.style.setProperty("--ghost-fade-focus-opacity-4", `${this.settings.opacity_4}`);
        this.rootElement.style.setProperty("--ghost-fade-focus-opacity-5", `${this.settings.opacity_5}`);
        this.rootElement.style.setProperty("--ghost-fade-focus-opacity", `${this.settings.opacity}`);
    }
    removeCSSVariables() {
        this.rootElement = document.documentElement;
        this.rootElement.style.removeProperty("--ghost-fade-focus-opacity-1");
        this.rootElement.style.removeProperty("--ghost-fade-focus-opacity-2");
        this.rootElement.style.removeProperty("--ghost-fade-focus-opacity-3");
        this.rootElement.style.removeProperty("--ghost-fade-focus-opacity-4");
        this.rootElement.style.removeProperty("--ghost-fade-focus-opacity-5");
        this.rootElement.style.removeProperty("--ghost-fade-focus-opacity");
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.addSettingTab(new GhostFocusSettingTab(this.app, this));
            this.addCommand({
                id: "toggle-plugin",
                name: "Toggle plugin on/off",
                checkCallback: (checking) => {
                    const mdView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (mdView && mdView.getMode() === "source") {
                        if (!checking) {
                            this.settings.enabled = !this.settings.enabled;
                            this.saveSettings();
                            this.cssVariablesBasedOnEnabledState();
                        }
                        return true;
                    }
                    return false;
                },
            });
            const baseTheme = view.EditorView.baseTheme({});
            const fadedLines = () => {
                return [baseTheme, [], showFadedLines];
            };
            const showFadedLines = view.ViewPlugin.fromClass(class {
                constructor(view) {
                    this.decorations = fadedLineDeco(view);
                }
                update(update) {
                    if (update.docChanged ||
                        update.viewportChanged ||
                        update.selectionSet) {
                        this.decorations = fadedLineDeco(update.view);
                    }
                }
            }, {
                decorations: (v) => v.decorations,
            });
            const fadedLine = (index) => view.Decoration.line({
                attributes: {
                    class: `ghost-fade-focus--${index}`,
                },
            });
            const fadedLineOther = () => view.Decoration.line({
                attributes: {
                    class: `ghost-fade-focus`,
                },
            });
            const fadedLineDeco = (view) => {
                const cursorPos = view.state.selection.main.head;
                const cursorPosLine = view.state.doc.lineAt(cursorPos).number;
                let builder = new state.RangeSetBuilder();
                for (let { from, to } of view.visibleRanges) {
                    for (let pos = from; pos <= to;) {
                        let line = view.state.doc.lineAt(pos);
                        if (line.number >= cursorPosLine - 5 &&
                            line.number <= cursorPosLine + 5) {
                            builder.add(line.from, line.from, fadedLine(Math.abs(line.number - cursorPosLine)));
                        }
                        else {
                            builder.add(line.from, line.from, fadedLineOther());
                        }
                        pos = line.to + 1;
                    }
                }
                return builder.finish();
            };
            this.registerEditorExtension(fadedLines());
            this.cssVariablesBasedOnEnabledState();
        });
    }
    cssVariablesBasedOnEnabledState() {
        if (this.settings.enabled) {
            this.addCSSVariables();
        }
        else {
            this.removeCSSVariables();
        }
    }
}

module.exports = GhostFocusPlugin;


/* nosourcemap */