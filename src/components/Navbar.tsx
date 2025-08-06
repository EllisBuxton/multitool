"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/80">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Left side - Logo and Title */}
        <div className="flex items-center space-x-3">
          {/* Placeholder logo */}
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">MT</span>
          </div>
          <span className="text-xl font-bold text-zinc-100 tracking-wide">
            <span className="text-zinc-100">Multi</span>
            <span className="text-purple-400">Tool</span>
          </span>
        </div>

        {/* Center - Navigation buttons */}
        <div className="flex items-center space-x-2 mx-auto">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              Home
            </Button>
          </Link>
          <Link href="/file-converter">
            <Button 
              variant="ghost" 
              className="font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              File Converter
            </Button>
          </Link>
        </div>

        {/* Right side - Keep empty for balance */}
        <div className="w-32"></div>
      </div>
    </nav>
  );
}