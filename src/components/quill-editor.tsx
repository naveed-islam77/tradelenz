import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

function QuillEditor({ value, setValue }: any) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      className="h-[300px]"
    />
  );
}

export default QuillEditor;
