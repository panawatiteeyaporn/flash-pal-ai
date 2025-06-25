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
  Underline as UnderlineIcon, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Highlighter,
  Palette,
  Link as LinkIcon,
  Type
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
        heading: {
          levels: [1, 2, 3],
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

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

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
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 flex flex-wrap items-center gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              editor.isActive('bold') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              editor.isActive('italic') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              editor.isActive('underline') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              editor.isActive('strike') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium ${
              editor.isActive('heading', { level: 1 }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium ${
              editor.isActive('heading', { level: 2 }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium ${
              editor.isActive('heading', { level: 3 }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
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
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Colors and Highlight */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
          <div className="relative group">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
              title="Text Color"
            >
              <Type className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 hidden group-hover:block z-10">
              <div className="grid grid-cols-6 gap-1">
                {['#000000', '#374151', '#dc2626', '#ea580c', '#d97706', '#65a30d', '#059669', '#0891b2', '#2563eb', '#7c3aed', '#c026d3', '#e11d48'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setColor(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={`Set color to ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              editor.isActive('highlight') ? 'bg-yellow-100 text-yellow-600' : 'text-gray-600'
            }`}
            title="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </button>
        </div>

        {/* Other Formatting */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              editor.isActive('blockquote') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              editor.isActive('code') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={addLink}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              editor.isActive('link') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
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
        }
        
        .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
        }
        
        .ProseMirror h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 0.5rem;
          margin-bottom: 0.25rem;
        }
        
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5rem;
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
      `}</style>
    </div>
  );
}

export default TiptapEditor;