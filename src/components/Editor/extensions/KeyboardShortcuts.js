import { Extension } from '@tiptap/core';

/**
 * Custom keyboard shortcuts extension for enhanced editor functionality
 */
export const KeyboardShortcuts = Extension.create({
  name: 'keyboardShortcuts',

  addKeyboardShortcuts() {
    return {
      // Text formatting shortcuts
      'Mod-b': () => this.editor.chain().focus().toggleBold().run(),
      'Mod-i': () => this.editor.chain().focus().toggleItalic().run(),
      'Mod-u': () => this.editor.chain().focus().toggleUnderline().run(),
      'Mod-`': () => this.editor.chain().focus().toggleCode().run(),
      
      // Heading shortcuts
      'Mod-Alt-1': () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      'Mod-Alt-2': () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      'Mod-Alt-3': () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
      'Mod-Alt-0': () => this.editor.chain().focus().setParagraph().run(),
      
      // List shortcuts
      'Mod-Shift-8': () => this.editor.chain().focus().toggleBulletList().run(),
      'Mod-Shift-7': () => this.editor.chain().focus().toggleOrderedList().run(),
      
      // Link shortcut
      'Mod-k': () => {
        const url = window.prompt('Enter URL:');
        if (url) {
          this.editor.chain().focus().setLink({ href: url }).run();
        }
        return true;
      },
      
      // Quote shortcut
      'Mod-Shift-9': () => this.editor.chain().focus().toggleBlockquote().run(),
      
      // Table shortcuts
      'Mod-Alt-t': () => this.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      
      // Clear formatting
      'Mod-\\': () => this.editor.chain().focus().unsetAllMarks().clearNodes().run(),
      
      // Undo/Redo (handled by history extension but we can add custom logic)
      'Mod-z': () => this.editor.chain().focus().undo().run(),
      'Mod-Shift-z': () => this.editor.chain().focus().redo().run(),
      'Mod-y': () => this.editor.chain().focus().redo().run(),
      
      // Select all
      'Mod-a': () => {
        this.editor.commands.selectAll();
        return true;
      },
      
      // Save shortcut (custom - could trigger parent component save)
      'Mod-s': () => {
        // Prevent default browser save
        // Could emit custom save event here
        const saveEvent = new CustomEvent('editorSave', {
          detail: { content: this.editor.getHTML() }
        });
        window.dispatchEvent(saveEvent);
        return true;
      }
    };
  },
});