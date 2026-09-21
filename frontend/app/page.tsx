import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-black">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-2">Welcome</h1>
        <p className="text-gray-600 mb-6 text-sm">FastAPI & Next.js Auth System</p>
        
        <div className="space-y-3">
          <Link 
            href="/login" 
            className="block w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          
          <Link 
            href="/signup" 
            className="block w-full bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300 transition"
          >
            Sign Up
          </Link>

        </div>
      </div>
    </div>
  );
}