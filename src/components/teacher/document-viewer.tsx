"use client"

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure worker locally or via CDN. 
// For simplicity in this demo, using unpkg or assuming standard build moves it.
// In Next.js App Router, using a CDN is often easiest to avoid webpack config issues.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentViewerProps {
    url: string
}

export function DocumentViewer({ url }: DocumentViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState(true);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    function changePage(offset: number) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    return (
        <div className="flex flex-col items-center w-full min-h-[500px] bg-stone-100 rounded-xl relative p-4">
            {loading && <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10"><Loader2 className="animate-spin" /></div>}

            <div className="flex-1 w-full flex justify-center overflow-auto shadow-sm">
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div className="h-96 w-full flex items-center justify-center">Loading PDF...</div>}
                    className="flex justify-center"
                >
                    <Page
                        pageNumber={pageNumber}
                        width={window.innerWidth > 768 ? 600 : window.innerWidth - 40}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="bg-white"
                    />
                </Document>
            </div>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur border border-stone-200 p-2 rounded-full shadow-lg z-20">
                <Button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <p className="text-sm font-medium w-16 text-center">
                    {pageNumber} / {numPages || '--'}
                </p>
                <Button
                    type="button"
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
