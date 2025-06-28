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
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Highlighter,
  Type,
  ChevronDown,
  Code2
} from 'lucide-react';
import ImageUploadButton from './ImageUploadButton';

interface TiptapEditorProps {
  value: any;
  onChange: (content: any) => void;
  placeholder?: string;
  maxWords?: number;
  className?: string;
  readOnly?: boolean;
}

function TiptapEditor({ 
  value, 
  onChange, 
  placeholder = "Start typing...", 
  maxWords = 350,
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
        code: false, // Disable inline code from StarterKit
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
        mode: 'textSize',
      }),
      TextStyle,
      Color,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 rounded-lg p-4 font-mono text-sm',
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

  // Get word count from editor text
  const getWordCount = () => {
    const text = editor.getText();
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const wordCount = getWordCount();
  const isAtLimit = wordCount >= maxWords;

  // Color palette matching the design
  const colorPalette = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
  ];

  // Highlight color palette matching the design
  const highlightPalette = [
    { value: '#bbf7d0' },
    { value: '#bfdbfe' },
    { value: '#fbcfe8' },
    { value: '#e9d5ff' },
    { value: '#fef08a' },
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
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20 min-w-[280px]">
                <div className="flex items-center justify-center space-x-3">
                  {colorPalette.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setColor(color.value)}
                      className="group relative"
                      title={color.name}
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:scale-110 shadow-sm"
                        style={{ backgroundColor: color.value }}
                      />
                    </button>
                  ))}
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
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20 min-w-[260px]">
                <div className="flex items-center justify-center space-x-3">
                  {highlightPalette.map((highlight) => (
                    <button
                      key={highlight.value}
                      onClick={() => setHighlight(highlight.value)}
                      className="group relative"
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:scale-110 shadow-sm"
                        style={{ backgroundColor: highlight.value }}
                      />
                    </button>
                  ))}
                  {/* No highlight option */}
                  <button
                    onClick={() => setHighlight('none')}
                    className="group relative"
                    title="No highlight"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:scale-110 shadow-sm bg-white flex items-center justify-center">
                      <div className="w-6 h-0.5 bg-red-400 rotate-45 absolute"></div>
                      <div className="w-6 h-0.5 bg-red-400 -rotate-45 absolute"></div>
                    </div>
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
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
              editor.isActive('codeBlock') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Code Block"
          >
            <Code2 className="w-4 h-4" />
          </button>
          <ImageUploadButton editor={editor} />
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none p-4 min-h-[120px] focus-within:outline-none"
        />
        
        {/* Word Count */}
        <div className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-white/80 ${
          isAtLimit ? 'text-red-600' : 'text-gray-500'
        }`}>
          {wordCount}/{maxWords} words
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
        
        .ProseMirror mark {
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }
        
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
}

export default TiptapEditor;