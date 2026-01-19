interface Props {
  label: string;
  name: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  defaultValue?: string;
  placeHolder?: string;
  type: string;
}
export default function InputField({
  label,
  name,
  inputRef,
  defaultValue,
  placeHolder,
  type,
}: Props) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-lg font-semibold text-gray-700"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        ref={inputRef}
        defaultValue={defaultValue && defaultValue}
        placeholder={placeHolder && placeHolder}
        className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
