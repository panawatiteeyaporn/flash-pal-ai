import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: any;
  onChange: (content: any) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  readOnly?: boolean;
}

function QuillEditor({ 
  value, 
  onChange, 
  placeholder = "Start typing...", 
  maxLength = 350,
  className = "",
  readOnly = false
}: QuillEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: readOnly ? false : [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block', 'link'
  ];

  const handleChange = (content: string, delta: any, source: string, editor: any) => {
    const text = editor.getText();
    
    // Enforce character limit
    if (text.length > maxLength) {
      // Truncate the content
      const truncatedText = text.substring(0, maxLength);
      const quill = quillRef.current?.getEditor();
      if (quill) {
        quill.setText(truncatedText);
        return;
      }
    }
    
    // Get the Delta format for storage
    const deltaContent = editor.getContents();
    onChange(deltaContent);
  };

  const getCharacterCount = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      return editor.getText().length - 1; // Subtract 1 for the trailing newline
    }
    return 0;
  };

  return (
    <div className={`relative ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${readOnly ? 'quill-readonly' : ''}`}
      />
      {!readOnly && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
          {getCharacterCount()}/{maxLength}
        </div>
      )}
      
      <style jsx global>{`
        .quill-readonly .ql-toolbar {
          display: none;
        }
        
        .quill-readonly .ql-container {
          border-top: 1px solid #ccc;
        }
        
        .ql-editor {
          min-height: 120px;
        }
        
        .ql-editor.ql-blank::before {
          font-style: italic;
          color: #999;
        }
      `}</style>
    </div>
  );
}

export default QuillEditor;