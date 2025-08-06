import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col items-center justify-center p-8">
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-wider mb-6">
          <span className="text-zinc-100">Multi</span>
          <span className="text-red-500">Tool</span>
        </h1>
        <p className="text-zinc-400 text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto">
          Quick and Useful Tools and Utilities
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mb-16">
        {/* File Converter Card */}
        <Link href="/file-converter">
          <div className="group cursor-pointer bg-zinc-800/50 border border-zinc-700 rounded-2xl p-8 hover:border-red-500 hover:bg-zinc-800/80 transition-all duration-300 hover:scale-[1.02]">
            <div className="h-12 w-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-2 group-hover:text-red-300 transition-colors">
              File Converter
            </h3>
            <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
              Convert files between different formats quickly and easily
            </p>
          </div>
        </Link>

        {/* Coming Soon Cards */}
        <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-8 opacity-60">
          <div className="h-12 w-12 bg-zinc-700 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-zinc-400 mb-2">
            Coming Soon
          </h3>
          <p className="text-zinc-600">
            More tools are being developed
          </p>
        </div>

        <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-8 opacity-60">
          <div className="h-12 w-12 bg-zinc-700 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-zinc-400 mb-2">
            Coming Soon
          </h3>
          <p className="text-zinc-600">
            More tools are being developed
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Link href="/file-converter">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-3 text-lg">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}