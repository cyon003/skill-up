export function Button({ className = "", ...props }) {
    return (
      <button
        {...props}
        className={
          "px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 disabled:opacity-50 " + className
        }
      />
    );
  }