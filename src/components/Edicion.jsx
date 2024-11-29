import React, { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Dropcursor from '@tiptap/extension-dropcursor';
import './styles.scss';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importa los estilos de Font Awesome

export function Edicion({ contenido, setContenido }) {
  const fileInputRef = useRef(null);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: 'Escribe aquí...',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
      Dropcursor,  // Asegurarse de que Dropcursor solo se incluye una vez
    ],
    content: contenido || '<p>Escribe aquí...</p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContenido(html);
    },
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
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

  const addImageFromUrl = () => {
    const url = prompt('Introduce la URL de la imagen');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const buttons = [
    { name: 'Negrita', action: () => editor.chain().focus().toggleBold().run(), icon: 'fas fa-bold' },
    { name: 'Cursiva', action: () => editor.chain().focus().toggleItalic().run(), icon: 'fas fa-italic' },
    { name: 'Tachado', action: () => editor.chain().focus().toggleStrike().run(), icon: 'fas fa-strikethrough' },
    { name: 'Código', action: () => editor.chain().focus().toggleCode().run(), icon: 'fas fa-code' },
    { name: 'Borrar formatos', action: () => editor.chain().focus().unsetAllMarks().run(), icon: 'fas fa-eraser' },
    { name: 'Borrar nodos', action: () => editor.chain().focus().clearNodes().run(), icon: 'fas fa-ban' },
    { name: 'Párrafo', action: () => editor.chain().focus().setParagraph().run(), icon: 'fas fa-paragraph' },
    { name: 'H1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), icon: 'fas fa-heading' },
    { name: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), icon: 'fas fa-heading' },
    { name: 'H3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), icon: 'fas fa-heading' },
    { name: 'Lista con viñetas', action: () => editor.chain().focus().toggleBulletList().run(), icon: 'fas fa-list-ul' },
    { name: 'Lista ordenada', action: () => editor.chain().focus().toggleOrderedList().run(), icon: 'fas fa-list-ol' },
    { name: 'Bloque de código', action: () => editor.chain().focus().toggleCodeBlock().run(), icon: 'fas fa-code' },
    { name: 'Cita', action: () => editor.chain().focus().toggleBlockquote().run(), icon: 'fas fa-quote-right' },
    { name: 'Regla horizontal', action: () => editor.chain().focus().setHorizontalRule().run(), icon: 'fas fa-minus' },
    { name: 'Salto de línea', action: () => editor.chain().focus().setHardBreak().run(), icon: 'fas fa-level-down-alt' },
    { name: 'Deshacer', action: () => editor.chain().focus().undo().run(), icon: 'fas fa-undo' },
    { name: 'Rehacer', action: () => editor.chain().focus().redo().run(), icon: 'fas fa-redo' },
    { name: 'Resaltar', action: () => editor.chain().focus().toggleHighlight().run(), icon: 'fas fa-highlighter' },
    { name: 'Alinear a la izquierda', action: () => editor.chain().focus().setTextAlign('left').run(), icon: 'fas fa-align-left' },
    { name: 'Alinear al centro', action: () => editor.chain().focus().setTextAlign('center').run(), icon: 'fas fa-align-center' },
    { name: 'Alinear a la derecha', action: () => editor.chain().focus().setTextAlign('right').run(), icon: 'fas fa-align-right' },
    { name: 'Justificar', action: () => editor.chain().focus().setTextAlign('justify').run(), icon: 'fas fa-align-justify' },
    { name: 'Morado', action: () => editor.chain().focus().setColor('#958DF1').run(), icon: 'fas fa-palette' },
    { name: 'Imagen desde archivo', action: handleImageUpload, icon: 'fas fa-file-image' },
    { name: 'Imagen desde URL', action: addImageFromUrl, icon: 'fas fa-link' },
    { name: 'Insertar tabla', action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(), icon: 'fas fa-table' },
    { name: 'Lista de tareas', action: () => editor.chain().focus().toggleTaskList().run(), icon: 'fas fa-tasks' },
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
            <i className={button.icon}></i>
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
