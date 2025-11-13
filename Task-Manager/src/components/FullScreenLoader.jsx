import { Loader2 } from "lucide-react";

const FullScreenLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <Loader2 className="animate-spin h-12 w-12 text-red-600" />
      <p className="mt-4 text-gray-700 font-medium">{message}</p>
    </div>
  );
};

export default FullScreenLoader;
