import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-3 text-gray-300">Page not found.</p>
        <Link to="/" className="inline-block mt-6 px-4 py-2 rounded-md bg-indigo-600">Go home</Link>
      </div>
    </div>
  );
}
