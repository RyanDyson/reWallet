export type toastProps = {
  title: string;
  description: string;
};

export function ToastItem({ title, description }: toastProps) {
  return (
    <div>
      <div className="text-lg">{title}</div>
      <div className="text-muted">{description}</div>
    </div>
  );
}
