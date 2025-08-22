// ./utils/notify.tsx
import toast from "react-hot-toast";
import CustomToast from "@/components/CustomToast";

export const notify = {
  success: (msg: string) => toast.custom(<CustomToast type="success" message={msg} />),
  error:   (msg: string) => toast.custom(<CustomToast type="error" message={msg} />),
  info:    (msg: string) => toast.custom(<CustomToast type="info" message={msg} />),
  warning: (msg: string) => toast.custom(<CustomToast type="warning" message={msg} />),

  // resolves true on success, false on failure; never throws
  async promise(p: Promise<any>, labels: { loading: string; success: string; error: string }): Promise<boolean> {
    const id = toast.custom(<CustomToast type="info" message={labels.loading} />);
    try {
      await p;
      toast.dismiss(id);
      notify.success(labels.success);
      return true;
    } catch (e: any) {
      toast.dismiss(id);
      notify.error(labels.error || e?.message || "Something went wrong.");
      return false;
    }
  },
} as const;
