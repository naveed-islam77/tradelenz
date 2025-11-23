import { useFormik } from "formik";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import QuillEditor from "../quill-editor";
import {
  useAddStrategyMutation,
  useGetStrategyByIdQuery,
  useUpdateStrategyMutation,
} from "@/redux/services/stratergy";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function StrategyForm({ tradeId }: { tradeId?: string }) {
  const router = useRouter();
  const [createStrategy, { isLoading }] = useAddStrategyMutation();
  const [updateStrategy, { isLoading: isUpdating }] =
    useUpdateStrategyMutation();

  const { data } = useGetStrategyByIdQuery(tradeId!, {
    skip: !tradeId,
  });

  const initialValues = {
    name: data?.name || "",
    rules: data?.rules || "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values, { resetForm }) => {
      if (tradeId) {
        updateStrategy({ id: tradeId, ...values })
          .unwrap()
          .then(() => {
            toast.success("Strategy updated successfully");
          })
          .catch((error) => {
            console.error("Failed to update strategy:", error);
            toast.error("Failed to update strategy");
          });
      } else {
        createStrategy(values)
          .unwrap()
          .then(() => {
            resetForm();
            toast.success("Strategy created successfully");
          })
          .catch((error) => {
            console.error("Failed to create strategy:", error);
            toast.error("Failed to create strategy");
          });
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-6 max-w-6xl mx-auto my-10"
    >
      <div onClick={() => router.back()}>
        <Button variant="outline" className="mb-2" type="button">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      <h1 className="text-3xl font-bold text-foreground">Add New Stratergy</h1>
      {/* Date & Time Section */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Name
            </label>
            <Input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className="w-full bg-input"
              placeholder="Enter Stratergy Name"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm min-h-[420px]">
        <label className="block text-sm font-medium text-foreground mb-2">
          Strategy Rules
        </label>
        <QuillEditor
          value={formik.values.rules}
          setValue={(value: string) => formik.setFieldValue("rules", value)}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-accent hover:bg-accent text-primary-foreground w-[120px]"
        >
          {isLoading || isUpdating ? (
            <Loader2 className="animate-spin" />
          ) : tradeId ? (
            "Update Stratergy"
          ) : (
            "Save Stratergy"
          )}
        </Button>
      </div>
    </form>
  );
}
