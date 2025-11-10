export default function Empty({ label }: { label: string }) {
  return (
    <div className="text-center text-gray-500 py-2">
      <div className="text-xl mb-2">Empty</div>
      <div>{label}</div>
    </div>
  );
}
