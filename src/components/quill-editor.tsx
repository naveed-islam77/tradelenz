import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

function QuillEditor({ value, setValue }: any) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      className="h-[300px] text-primary"
    />
  );
}

export default QuillEditor;
