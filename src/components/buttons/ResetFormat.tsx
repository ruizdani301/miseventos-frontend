import type { ResetProps } from "../../types";



export default function ResetFormat({ onClick, name }: ResetProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
    >
      {name}
    </button>
  );
}
