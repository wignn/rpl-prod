import React from "react";

interface Props {
  error: string;
  onRefresh: () => void;
}

function PageError({ error, onRefresh }: Props) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <div className="text-red-500 mb-2">⚠️ {error}</div>
      <button
        onClick={onRefresh}
        className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );
}

export default PageError;
