import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function Edicion({ content, setContent }) {
  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <ReactQuill 
      value={content}  
      onChange={setContent}
      theme='snow'
      modules={modules}
      className='mb-10 text-[13px] sm:text-[15px]'
    />
  );
}
