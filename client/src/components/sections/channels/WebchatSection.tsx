import React from "react";
import { Button } from "@/components/ui/button";

const instances = [{ id: 1, name: "TestTiagoStage" }];

export default function WebchatSection() {
  return (
    <div className="p-6">
      <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
              <svg className="h-6 w-6 text-blue-600" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">Webchat</h3>
              <p className="text-sm text-muted-foreground">Create a Webchat interface that allows visitors to communicate with your business in real-time directly from a website.</p>
            </div>
          </div>

          <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
            Add new
          </Button>
        </div>

        <div className="p-4">
          <ul>
          {instances.map((inst) => (
            <li key={inst.id} className="flex items-center justify-between px-4 py-3 hover:bg-sky-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-50 text-black-600 rounded-md flex items-center justify-center font-medium">{inst.name.charAt(0)}</div>
                <div>
                  <div className="text-sm font-medium text-black-700">{inst.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sky-500">
                <button aria-label="Publish" title="Publish" className="p-2 hover:bg-sky-100 rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3 7h7l-5.6 4.2L20 22 12 17l-8 5 1.6-8.8L0 9h7l5-7z" stroke="currentColor" strokeWidth="0" fill="currentColor" />
                  </svg>
                </button>

                <button aria-label="Copy link" title="Copy link" className="p-2 hover:bg-sky-100 rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 14a3 3 0 0 1 0-4l1-1a3 3 0 0 1 4 4l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 10a3 3 0 0 1 0 4l-1 1a3 3 0 0 1-4-4l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <button aria-label="Edit" title="Edit" className="p-2 hover:bg-sky-100 rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21v-3l11-11 3 3L6 21H3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <button aria-label="Delete" title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </li>
          ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
