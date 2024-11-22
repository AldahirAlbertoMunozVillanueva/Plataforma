import React, { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

export function Edicion({ content, setContent }) {
  const fileInputRef = useRef(null);
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: content || '<p>Escribe aquí...</p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
  });

  React.useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  const addImage = () => {
    const file = fileInputRef.current.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64Image = event.target.result;
      editor.chain().focus().setImage({ src: base64Image }).run();
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const buttons = [
    { name: 'Negrita', action: () => editor.chain().focus().toggleBold().run() },
    { name: 'Cursiva', action: () => editor.chain().focus().toggleItalic().run() },
    { name: 'Subrayado', action: () => editor.chain().focus().toggleUnderline().run() },
    { name: 'Encabezado', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { name: 'Lista con viñetas', action: () => editor.chain().focus().toggleBulletList().run() },
    { name: 'Lista ordenada', action: () => editor.chain().focus().toggleOrderedList().run() },
    { name: 'Enlace', action: () => {
      const url = prompt('Introduce la URL');
      if (url) {
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }
    }},
    { name: 'Código', action: () => editor.chain().focus().toggleCode().run() },
    { name: 'Imagen', action: handleImageUpload },
  ];

  return (
    <div className="border rounded-md p-2 mb-10 text-[13px] sm:text-[15px] bg-white text-black">
      <div className="toolbar mb-2 flex space-x-2">
        {buttons.map((button) => (
          <button
            key={button.name}
            type="button"
            className="p-1 border rounded bg-blue-500 hover:bg-blue-700 text-white"
            onClick={button.action}
          >
            {button.name}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={addImage}
        accept="image/*"
      />
    </div>
  );
}
