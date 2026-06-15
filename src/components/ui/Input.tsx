import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export default function Input({
  error, className,
  ...props
}: InputProps) {
  return (
    <div>
      <input
        {...props}
        className={`w-full px-4 py-3 border rounded-lg ${className} ${
          error
            ? "border-red-500"
            : "border-gray-300"
        }`}
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}