import { useEffect, useState } from "react";

export function Toast({ message }: { message: string }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  );
} 