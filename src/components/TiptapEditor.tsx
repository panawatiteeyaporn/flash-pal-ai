import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo
} from 'lucide-react';

interface TiptapEditorProps {
  value: any;
  onChange: (content: any) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  readOnly?: boolean;
}

function TiptapEditor({ 
  value, 
  onChange, 
  placeholder = "Start typing...", 
  maxLength = 350,
  className = "",
  readOnly = false
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Typography,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 hover:text-indigo-700 underline cursor-pointer',
        },
      }),
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getJSON()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const characterCount = editor.storage.characterCount.characters();
  const isAtLimit = characterCount >= maxLength;

  if (readOnly) {
    return (
      <div className={`prose prose-sm max-w-none ${className}`}>
        <EditorContent editor={editor} />
      </div>
    );
  }

  return (
    <div className={`border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm ${className}`}>
      {/* Simple Toolbar */}
      <div className="border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">
        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            editor.isActive('bold') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            editor.isActive('italic') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            editor.isActive('strike') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            editor.isActive('code') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium ${
            editor.isActive('paragraph') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
          }`}
          title="Paragraph"
        >
          P
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            editor.isActive('bulletList') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            editor.isActive('orderedList') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
          }`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Quote */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            editor.isActive('blockquote') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-4 min-h-[120px] focus-within:outline-none"
        />
        
        {/* Character Count */}
        <div className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-white/80 ${
          isAtLimit ? 'text-red-600' : 'text-gray-500'
        }`}>
          {characterCount}/{maxLength}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        
        .ProseMirror h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }
        
        .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        
        .ProseMirror p {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .ProseMirror li {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }
        
        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
          font-size: 0.875em;
          color: #374151;
        }
        
        .ProseMirror pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .ProseMirror pre code {
          background: none;
          padding: 0;
          font-size: 0.875rem;
          color: inherit;
        }
        
        .ProseMirror mark {
          background-color: #fef08a;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }
        
        .ProseMirror a {
          color: #4f46e5;
          text-decoration: underline;
        }
        
        .ProseMirror a:hover {
          color: #3730a3;
        }

        /* Focus styles */
        .ProseMirror:focus {
          outline: none;
        }

        /* Selection styles */
        .ProseMirror ::selection {
          background-color: #ddd6fe;
        }

        /* Placeholder styles */
        .ProseMirror .is-empty::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}

export default TiptapEditor;