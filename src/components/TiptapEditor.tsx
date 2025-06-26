import React, { useEffect, useState } from 'react';
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
  Type,
  ChevronDown
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
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showHighlightPalette, setShowHighlightPalette] = useState(false);

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

  // Close palettes when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.color-palette-container')) {
        setShowColorPalette(false);
      }
      if (!target.closest('.highlight-palette-container')) {
        setShowHighlightPalette(false);
      }
    };

    if (showColorPalette || showHighlightPalette) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPalette, showHighlightPalette]);

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
    setShowColorPalette(false);
  };

  const setHighlight = (color: string) => {
    if (color === 'none') {
      editor.chain().focus().unsetHighlight().run();
    } else {
      editor.chain().focus().setHighlight({ color }).run();
    }
    setShowHighlightPalette(false);
  };

  const characterCount = editor.storage.characterCount.characters();
  const isAtLimit = characterCount >= maxLength;

  // Curated color palette with better spacing and fewer options
  const colorPalette = [
    { name: 'Black', value: '#000000' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Yellow', value: '#d97706' },
    { name: 'Green', value: '#059669' },
    { name: 'Blue', value: '#2563eb' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Pink', value: '#e11d48' },
  ];

  // Highlight color palette
  const highlightPalette = [
    { name: 'Yellow', value: '#fef08a', preview: '#fef08a' },
    { name: 'Green', value: '#bbf7d0', preview: '#bbf7d0' },
    { name: 'Blue', value: '#bfdbfe', preview: '#bfdbfe' },
    { name: 'Purple', value: '#e9d5ff', preview: '#e9d5ff' },
    { name: 'Pink', value: '#fbcfe8', preview: '#fbcfe8' },
    { name: 'Orange', value: '#fed7aa', preview: '#fed7aa' },
  ];

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
          {/* Text Color */}
          <div className="relative color-palette-container">
            <button
              onClick={() => setShowColorPalette(!showColorPalette)}
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-1 ${
                showColorPalette ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
              }`}
              title="Text Color"
            >
              <Type className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showColorPalette && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20 min-w-[200px]">
                <div className="text-xs font-medium text-gray-700 mb-2">Text Color</div>
                <div className="grid grid-cols-3 gap-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setColor(color.value)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      title={`Set color to ${color.name}`}
                    >
                      <div
                        className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-xs text-gray-700">{color.name}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={() => setColor('#000000')}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Reset to default
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Highlight Color */}
          <div className="relative highlight-palette-container">
            <button
              onClick={() => setShowHighlightPalette(!showHighlightPalette)}
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-1 ${
                showHighlightPalette || editor.isActive('highlight') ? 'bg-yellow-100 text-yellow-600' : 'text-gray-600'
              }`}
              title="Highlight Color"
            >
              <Highlighter className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </button>

            {showHighlightPalette && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20 min-w-[200px]">
                <div className="text-xs font-medium text-gray-700 mb-2">Highlight Color</div>
                <div className="grid grid-cols-2 gap-2">
                  {highlightPalette.map((highlight) => (
                    <button
                      key={highlight.value}
                      onClick={() => setHighlight(highlight.value)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      title={`Highlight with ${highlight.name}`}
                    >
                      <div
                        className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: highlight.preview }}
                      />
                      <span className="text-xs text-gray-700">{highlight.name}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={() => setHighlight('none')}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Remove highlight
                  </button>
                </div>
              </div>
            )}
          </div>
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