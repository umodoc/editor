Project Path: src

Source Tree:

```
src
├── app
│   ├── (home)
│   │   ├── navbar.tsx
│   │   ├── search-input.tsx
│   │   ├── templates-gallery.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── api
│   │   └── getConvertToken
│   │       └── route.ts
│   └── documents
│       ├── [documentId]
│       │   ├── navbar.tsx
│       │   ├── verticalRuler.tsx
│       │   ├── ruler.tsx
│       │   ├── toolbar.tsx
│       │   ├── editor.tsx
│       │   ├── document-input.tsx
│       │   └── page.tsx
│       └── page.tsx
├── constants
│   └── templates.tsx
├── extensions
│   ├── line-height.ts
│   └── font-size.ts
├── components
│   └── ui
│       ├── aspect-ratio.tsx
│       ├── alert-dialog.tsx
│       ├── pagination.tsx
│       ├── tabs.tsx
│       ├── card.tsx
│       ├── slider.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── toaster.tsx
│       ├── input-otp.tsx
│       ├── chart.tsx
│       ├── hover-card.tsx
│       ├── sheet.tsx
│       ├── scroll-area.tsx
│       ├── resizable.tsx
│       ├── label.tsx
│       ├── sonner.tsx
│       ├── navigation-menu.tsx
│       ├── accordion.tsx
│       ├── drawer.tsx
│       ├── tooltip.tsx
│       ├── alert.tsx
│       ├── switch.tsx
│       ├── calendar.tsx
│       ├── breadcrumb.tsx
│       ├── radio-group.tsx
│       ├── command.tsx
│       ├── toggle-group.tsx
│       ├── avatar.tsx
│       ├── menubar.tsx
│       ├── dialog.tsx
│       ├── badge.tsx
│       ├── sidebar.tsx
│       ├── table.tsx
│       ├── separator.tsx
│       ├── button.tsx
│       ├── toggle.tsx
│       ├── toast.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── dropdown-menu.tsx
│       ├── select.tsx
│       ├── textarea.tsx
│       ├── input.tsx
│       ├── skeleton.tsx
│       ├── context-menu.tsx
│       ├── form.tsx
│       └── carousel.tsx
├── hooks
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   └── use-search-param.ts
├── lib
│   └── utils.ts
└── store
    └── use-editor-store.ts

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/(home)/navbar.tsx`:

```tsx
   1 | import Link from "next/link";
   2 | import Image from "next/image";
   3 | import { SearchInput } from "./search-input";
   4 | 
   5 | export const Navbar = () => {
   6 |   return (
   7 |     <nav className="flex items-center justify-between h-full w-full">
   8 |       <div className="flex gap-3 items-center shrink-0 pr-6">
   9 |         <Link href="/">
  10 |           <Image
  11 |             src="/IITG_Logo_20241210_01.png"
  12 |             alt="Logo"
  13 |             width={36}
  14 |             height={36}
  15 |           />
  16 |         </Link>
  17 |         <h3 className="text=xl">Docs</h3>
  18 |       </div>
  19 |       {/* <SearchInput /> */}
  20 |       <div />
  21 |     </nav>
  22 |   );
  23 | };

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/(home)/search-input.tsx`:

```tsx
   1 | "use client";
   2 | import React, { useRef, useState } from "react";
   3 | import { SearchIcon, XIcon } from "lucide-react";
   4 | 
   5 | import { Button } from "@/components/ui/button";
   6 | import { Input } from "@/components/ui/input";
   7 | import { useSearchParam } from "@/hooks/use-search-param";
   8 | 
   9 | export const SearchInput = () => {
  10 |   const [search, setSearch] = useSearchParam();
  11 |   const [value, setValue] = useState(search);
  12 | 
  13 |   const inputRef = useRef<HTMLInputElement>(null);
  14 |   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  15 |     setValue(e.target.value);
  16 |   };
  17 | 
  18 |   const handleClear = () => {
  19 |     setValue("");
  20 |     setSearch("");
  21 |     inputRef.current?.blur();
  22 |   };
  23 | 
  24 |   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  25 |     e.preventDefault();
  26 |     setSearch(value);
  27 |     inputRef.current?.blur();
  28 |   };
  29 | 
  30 |   return (
  31 |     <div className="flex-1 flex items-center justify-center">
  32 |       <form onSubmit={handleSubmit} className="relative max-w-[720px] w-full">
  33 |         <Input
  34 |           value={value}
  35 |           onChange={handleChange}
  36 |           ref={inputRef}
  37 |           placeholder="search"
  38 |           className="md:text-base placeholder:text-neutral-800 px-14 w-full border-none focus-visible:shadow-[0_1px_1px_0_rgba(65,69,73,.3),0_1px_3px_1px_rgba(65,69,73,.15)] bg-[#F0F4FB] rounded-full h-[48px] focus-visible:ring-0 focus:bg-white"
  39 |         />
  40 |         <Button
  41 |           type="submit"
  42 |           variant="ghost"
  43 |           size="icon"
  44 |           className="absolute left-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 round-full"
  45 |         >
  46 |           <SearchIcon />
  47 |         </Button>
  48 |         {value && (
  49 |           <Button
  50 |             onClick={handleClear}
  51 |             type="button"
  52 |             variant="ghost"
  53 |             size="icon"
  54 |             className="absolute right-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 round-full"
  55 |           >
  56 |             <XIcon />
  57 |           </Button>
  58 |         )}
  59 |       </form>
  60 |     </div>
  61 |   );
  62 | };

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/(home)/templates-gallery.tsx`:

```tsx
   1 | "use client";
   2 | 
   3 | import { cn } from "@/lib/utils";
   4 | import {
   5 |   Carousel,
   6 |   CarouselContent,
   7 |   CarouselItem,
   8 |   CarouselNext,
   9 |   CarouselPrevious,
  10 | } from "@/components/ui/carousel";
  11 | import { templates } from "@/constants/templates";
  12 | 
  13 | interface TemplateGalleryProps {
  14 |   onTemplateSelect: (templateId: string) => void;
  15 | }
  16 | 
  17 | export const TemplateGallery = ({ onTemplateSelect }: TemplateGalleryProps) => {
  18 |   const isCreating = false;
  19 | 
  20 |   return (
  21 |     <div className="bg-[#F1F3F4]">
  22 |       <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-y-4">
  23 |         <h3 className="font-medium">Start a new document</h3>
  24 |         <Carousel>
  25 |           <CarouselContent className="-ml-4">
  26 |             {templates.map((template) => (
  27 |               <CarouselItem
  28 |                 key={template.id}
  29 |                 className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-4"
  30 |               >
  31 |                 <div
  32 |                   className={cn(
  33 |                     "aspect-[3/4] flex flex-col gap-y-2.5",
  34 |                     isCreating && "pointer-events-none opacity-50"
  35 |                   )}
  36 |                 >
  37 |                   <button
  38 |                     disabled={isCreating}
  39 |                     onClick={() => onTemplateSelect(template.id)} // Handle click to select template
  40 |                     style={{
  41 |                       backgroundImage: `url(${template.imageUrl})`,
  42 |                       backgroundSize: "cover",
  43 |                       backgroundPosition: "center",
  44 |                       backgroundRepeat: "no-repeat",
  45 |                     }}
  46 |                     className="size-full hover:border-blue-500 rounded-ms border hover:bg-blue-50 transition flex flex-col items-center justify-center gap-y-4 bg-white"
  47 |                   />
  48 |                   <p className="text-sm font-medium truncate">
  49 |                     {template.label}
  50 |                   </p>
  51 |                 </div>
  52 |               </CarouselItem>
  53 |             ))}
  54 |           </CarouselContent>
  55 |           <CarouselPrevious />
  56 |           <CarouselNext />
  57 |         </Carousel>
  58 |       </div>
  59 |     </div>
  60 |   );
  61 | };

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/(home)/page.tsx`:

```tsx
   1 | // "use client";
   2 | 
   3 | // import React, { useState } from "react";
   4 | // import { useRouter } from "next/navigation";
   5 | // import axios from "axios";
   6 | // import JSZip from "jszip"; // For ZIP file extraction
   7 | 
   8 | // import { Navbar } from "./navbar";
   9 | // import { TemplateGallery } from "./templates-gallery";
  10 | 
  11 | // const HomePage = () => {
  12 | //   const [uploading, setUploading] = useState(false);
  13 | //   const [htmlContent, setHtmlContent] = useState<string | null>(null);
  14 | //   const router = useRouter();
  15 | 
  16 | //   // Handle template selection
  17 | //   const onTemplateSelect = (templateId: string) => {
  18 | //     if (templateId === "upload") {
  19 | //       handleFileUpload(); // Trigger file upload
  20 | //     } else if (templateId === "blank") {
  21 | //       localStorage.removeItem("htmlContent"); // Clear localStorage when creating a new document
  22 | //       router.push("/documents/new"); // Navigate to create a new document (fresh editor)
  23 | //     }
  24 | //   };
  25 | 
  26 | //   // Handle file upload
  27 | //   const handleFileUpload = async () => {
  28 | //     const fileInput = document.createElement("input");
  29 | //     fileInput.type = "file";
  30 | //     fileInput.accept = ".doc,.docx";
  31 | 
  32 | //     fileInput.onchange = async (event) => {
  33 | //       const input = event.target as HTMLInputElement; // Assert event.target as HTMLInputElement
  34 | //       const file = input?.files?.[0]; // Now TypeScript knows 'files' exists
  35 | 
  36 | //       if (!file) return;
  37 | //       if (
  38 | //         ![
  39 | //           "application/msword",
  40 | //           "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  41 | //         ].includes(file.type)
  42 | //       ) {
  43 | //         alert("Please upload a valid .doc or .docx file.");
  44 | //         return;
  45 | //       }
  46 | 
  47 | //       const formData = new FormData();
  48 | //       formData.append("file", file);
  49 | 
  50 | //       try {
  51 | //         setUploading(true);
  52 | //         const response = await axios.post(
  53 | //           "http://172.16.117.47:7001/upload-docx/",
  54 | //           formData,
  55 | //           {
  56 | //             headers: {
  57 | //               "Content-Type": "multipart/form-data",
  58 | //             },
  59 | //             responseType: "blob", // Server responds with ZIP file
  60 | //           }
  61 | //         );
  62 | 
  63 | //         const zipFile = new Blob([response.data], { type: "application/zip" });
  64 | //         const zip = await JSZip.loadAsync(zipFile);
  65 | //         let extractedHtmlContent = null;
  66 | 
  67 | //         zip.forEach((filename, file) => {
  68 | //           if (filename.endsWith(".html")) {
  69 | //             file.async("text").then((content) => {
  70 | //               extractedHtmlContent = content;
  71 | //               setHtmlContent(content);
  72 | //               localStorage.setItem("htmlContent", content); // Store in localStorage
  73 | //               router.push("/documents/new"); // Redirect to the editor with the loaded content
  74 | //             });
  75 | //           }
  76 | //         });
  77 | //       } catch (error) {
  78 | //         console.error("Error uploading file:", error);
  79 | //         alert("Failed to upload and process the file.");
  80 | //       } finally {
  81 | //         setUploading(false);
  82 | //       }
  83 | //     };
  84 | 
  85 | //     fileInput.click(); // Open file dialog
  86 | //   };
  87 | 
  88 | //   return (
  89 | //     <div className="min-h-screen flex flex-col">
  90 | //       <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
  91 | //         <Navbar />
  92 | //       </div>
  93 | //       <div className="mt-16">
  94 | //         <TemplateGallery onTemplateSelect={onTemplateSelect} />
  95 | //       </div>
  96 | //       <div className="flex flex-col items-center justify-center mt-10">
  97 | //         {uploading && (
  98 | //           <p className="mt-4 text-blue-500">
  99 | //             Uploading and processing your file...
 100 | //           </p>
 101 | //         )}
 102 | //       </div>
 103 | //     </div>
 104 | //   );
 105 | // };
 106 | 
 107 | // export default HomePage;
 108 | 
 109 | 
 110 | // ===================================================================================
 111 | // ROOM20241220_Backendda v1 nd v2 happa
 112 | 
 113 | "use client";
 114 | 
 115 | import React, { useState } from "react";
 116 | import { useRouter } from "next/navigation";
 117 | import axios from "axios";
 118 | 
 119 | import { Navbar } from "./navbar";
 120 | import { TemplateGallery } from "./templates-gallery";
 121 | 
 122 | const HomePage = () => {
 123 |   const [uploading, setUploading] = useState(false);
 124 |   const [htmlContent, setHtmlContent] = useState<string | null>(null);
 125 |   const router = useRouter();
 126 | 
 127 |   // Handle template selection
 128 |   const onTemplateSelect = (templateId: string) => {
 129 |     if (templateId === "upload") {
 130 |       handleFileUpload(); // Trigger file upload
 131 |     } else if (templateId === "blank") {
 132 |       localStorage.removeItem("htmlContent"); // Clear localStorage when creating a new document
 133 |       router.push("/documents/new"); // Navigate to create a new document (fresh editor)
 134 |     }
 135 |   };
 136 | 
 137 |   // Handle file upload
 138 |   const handleFileUpload = async () => {
 139 |     const fileInput = document.createElement("input");
 140 |     fileInput.type = "file";
 141 |     fileInput.accept = ".doc,.docx";
 142 | 
 143 |     fileInput.onchange = async (event) => {
 144 |       const input = event.target as HTMLInputElement; // Assert event.target as HTMLInputElement
 145 |       const file = input?.files?.[0]; // Now TypeScript knows 'files' exists
 146 | 
 147 |       if (!file) return;
 148 |       if (
 149 |         ![
 150 |           "application/msword",
 151 |           "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
 152 |         ].includes(file.type)
 153 |       ) {
 154 |         alert("Please upload a valid .doc or .docx file.");
 155 |         return;
 156 |       }
 157 | 
 158 |       const formData = new FormData();
 159 |       formData.append("file", file);
 160 | 
 161 |       try {
 162 |         setUploading(true);
 163 |         const response = await axios.post(
 164 |           "http://172.16.117.201:7002/api/v2/convert/upload-docx/",
 165 |           formData,
 166 |           {
 167 |             headers: {
 168 |               "Content-Type": "multipart/form-data",
 169 |             },
 170 |             responseType: "text", // Server now responds with HTML content directly
 171 |           }
 172 |         );
 173 | 
 174 |         const extractedHtmlContent = response.data;
 175 | 
 176 |         setHtmlContent(extractedHtmlContent);
 177 |         localStorage.setItem("htmlContent", extractedHtmlContent); // Store in localStorage
 178 |         router.push("/documents/new"); // Redirect to the editor with the loaded content
 179 | 
 180 |       } catch (error) {
 181 |         console.error("Error uploading file:", error);
 182 |         alert("Failed to upload and process the file.");
 183 |       } finally {
 184 |         setUploading(false);
 185 |       }
 186 |     };
 187 | 
 188 |     fileInput.click(); // Open file dialog
 189 |   };
 190 | 
 191 |   return (
 192 |     <div className="min-h-screen flex flex-col">
 193 |       <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
 194 |         <Navbar />
 195 |       </div>
 196 |       <div className="mt-16">
 197 |         <TemplateGallery onTemplateSelect={onTemplateSelect} />
 198 |       </div>
 199 |       <div className="flex flex-col items-center justify-center mt-10">
 200 |         {uploading && (
 201 |           <p className="mt-4 text-blue-500">
 202 |             Uploading and processing your file...
 203 |           </p>
 204 |         )}
 205 |       </div>
 206 |     </div>
 207 |   );
 208 | };
 209 | 
 210 | export default HomePage;

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/layout.tsx`:

```tsx
   1 | import type { Metadata } from "next";
   2 | import { Inter } from "next/font/google";
   3 | import { NuqsAdapter } from "nuqs/adapters/next/app";
   4 | 
   5 | import "./globals.css";
   6 | 
   7 | const inter = Inter({
   8 |   subsets: ["latin"],
   9 | });
  10 | 
  11 | export const metadata: Metadata = {
  12 |   title: "GHC Tools",
  13 |   description: "Generated by CLST",
  14 | };
  15 | 
  16 | export default function RootLayout({
  17 |   children,
  18 | }: Readonly<{
  19 |   children: React.ReactNode;
  20 | }>) {
  21 |   return (
  22 |     <html lang="en">
  23 |       <body className={inter.className}>
  24 |         <NuqsAdapter>{children}</NuqsAdapter>
  25 |       </body>
  26 |     </html>
  27 |   );
  28 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/api/getConvertToken/route.ts`:

```ts
   1 | import jwt from "jsonwebtoken";
   2 | import { NextRequest, NextResponse } from "next/server";
   3 | 
   4 | // Define response payload type
   5 | interface TokenResponse {
   6 |   token: string;
   7 | }
   8 | 
   9 | export async function GET(req: NextRequest) {
  10 |   console.log("Request received at /api/getConvertToken");
  11 |   
  12 |   const payload = { userId: "8mz4xr3" };
  13 |   const secretKey = process.env.JWT_SECRET!;
  14 |   const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  15 | 
  16 |   return NextResponse.json({ token } as TokenResponse, { status: 200 });
  17 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/documents/[documentId]/navbar.tsx`:

```tsx
   1 | "use client";
   2 | 
   3 | import Link from "next/link";
   4 | import Image from "next/image";
   5 | import { BsFilePdf } from "react-icons/bs";
   6 | import { generateHTML } from '@tiptap/core'; 
   7 | import {
   8 |   BoldIcon,
   9 |   ImportIcon,
  10 |   FileIcon,
  11 |   FileJsonIcon,
  12 |   FilePenIcon,
  13 |   FilePlus,
  14 |   FileTextIcon,
  15 |   FileUpIcon,
  16 |   GlobeIcon,
  17 |   ItalicIcon,
  18 |   PrinterIcon,
  19 |   Redo2Icon,
  20 |   RemoveFormattingIcon,
  21 |   StrikethroughIcon,
  22 |   TextIcon,
  23 |   TrashIcon,
  24 |   UnderlineIcon,
  25 |   Undo2Icon,
  26 | } from "lucide-react";
  27 | 
  28 | import {
  29 |   Menubar,
  30 |   MenubarContent,
  31 |   MenubarItem,
  32 |   MenubarMenu,
  33 |   MenubarSeparator,
  34 |   MenubarShortcut,
  35 |   MenubarSub,
  36 |   MenubarSubContent,
  37 |   MenubarSubTrigger,
  38 |   MenubarTrigger,
  39 | } from "@/components/ui/menubar";
  40 | 
  41 | import { DocumentInput } from "./document-input";
  42 | import { useEditorStore } from "@/store/use-editor-store";
  43 | import { useState } from "react";
  44 | 
  45 | export const Navbar = () => {
  46 |   const { editor } = useEditorStore();
  47 | 
  48 |   const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
  49 |     editor
  50 |       ?.chain()
  51 |       .focus()
  52 |       .insertTable({ rows, cols, withHeaderRow: false })
  53 |       .run();
  54 |   };
  55 | 
  56 |   const onDownload = (blob: Blob, filename: string) => {
  57 |     const url = URL.createObjectURL(blob);
  58 |     const a = document.createElement("a");
  59 |     a.href = url;
  60 |     a.download = filename;
  61 |     a.click();
  62 |   };
  63 | 
  64 |   const onSaveJSON = () => {
  65 |     if (!editor) return;
  66 | 
  67 |     const content = editor.getJSON();
  68 |     const blob = new Blob([JSON.stringify(content)], {
  69 |       type: "application/json",
  70 |     });
  71 |     onDownload(blob, "document.json"); //TODO: Use document name
  72 |   };
  73 | 
  74 |   const onSaveHTML = () => {
  75 |     if (!editor) return;
  76 | 
  77 |     const content = editor.generateHTML();
  78 |     const blob = new Blob([content], {
  79 |       type: "text/html",
  80 |     });
  81 |     onDownload(blob, "document.html"); //TODO: Use document name
  82 |   };
  83 | 
  84 |   const onSaveText = () => {
  85 |     if (!editor) return;
  86 | 
  87 |     const content = editor.getHTML();
  88 |     const blob = new Blob([content], {
  89 |       type: "text/plain",
  90 |     });
  91 |     onDownload(blob, "document.txt"); //TODO: Use document name
  92 |   };
  93 | 
  94 |   // State to hold dynamic row and column values
  95 |   const [rows, setRows] = useState(1);
  96 |   const [cols, setCols] = useState(1);
  97 | 
  98 |   const handleInsertTable = () => {
  99 |     insertTable({ rows, cols });
 100 |   };
 101 | 
 102 |   // State to track full screen status
 103 |   const [isFullScreen, setIsFullScreen] = useState(false);
 104 | 
 105 |   const toggleFullScreen = () => {
 106 |     const element = document.documentElement; // Or any specific element you want to make fullscreen
 107 | 
 108 |     if (
 109 |       document.fullscreenElement ||
 110 |       (document as any).webkitFullscreenElement ||
 111 |       (document as any).mozFullScreenElement ||
 112 |       (document as any).msFullscreenElement
 113 |     ) {
 114 |       // If already in fullscreen, exit fullscreen
 115 |       if (document.exitFullscreen) {
 116 |         document.exitFullscreen();
 117 |       } else if ((document as any).webkitExitFullscreen) {
 118 |         (document as any).webkitExitFullscreen();
 119 |       } else if ((document as any).mozCancelFullScreen) {
 120 |         (document as any).mozCancelFullScreen();
 121 |       } else if ((document as any).msExitFullscreen) {
 122 |         (document as any).msExitFullscreen();
 123 |       }
 124 | 
 125 |       setIsFullScreen(false); // Update the state to reflect exiting fullscreen
 126 |     } else {
 127 |       // If not in fullscreen, request fullscreen
 128 |       if (element.requestFullscreen) {
 129 |         element.requestFullscreen();
 130 |       } else if ((element as any).webkitRequestFullscreen) {
 131 |         (element as any).webkitRequestFullscreen();
 132 |       } else if ((element as any).msRequestFullscreen) {
 133 |         (element as any).msRequestFullscreen();
 134 |       } else if ((element as any).mozRequestFullScreen) {
 135 |         (element as any).mozRequestFullScreen();
 136 |       }
 137 | 
 138 |       setIsFullScreen(true); // Update the state to reflect entering fullscreen
 139 |     }
 140 |   };
 141 | 
 142 |   return (
 143 |     <nav className="flex items-center justify-between">
 144 |       <div className="flex gap-2 items-center">
 145 |         <Link href="/">
 146 |           <Image
 147 |             src="/IITG_Logo_20241210_01.png"
 148 |             alt="Logo"
 149 |             width={36}
 150 |             height={36}
 151 |           />
 152 |         </Link>
 153 |         <div className="flex flex-col">
 154 |           <DocumentInput />
 155 |           <div className="flex">
 156 |             <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
 157 |               {/* File Menu */}
 158 |               <MenubarMenu>
 159 |                 <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
 160 |                   File
 161 |                 </MenubarTrigger>
 162 |                 <MenubarContent className="print:hidden">
 163 |                   <MenubarSub>
 164 |                     <MenubarSubTrigger>
 165 |                       <FileIcon className="size-4 mr-2" />
 166 |                       Save
 167 |                     </MenubarSubTrigger>
 168 |                     <MenubarSubContent>
 169 |                       <MenubarItem onClick={() => window.print()}>
 170 |                         <BsFilePdf className="size-4 mr-2" />
 171 |                         PDF
 172 |                       </MenubarItem>
 173 |                       <MenubarItem onClick={onSaveText}>
 174 |                         <FileTextIcon className="size-4 mr-2" />
 175 |                         Text
 176 |                       </MenubarItem>
 177 |                     </MenubarSubContent>
 178 |                   </MenubarSub>
 179 |                   <MenubarItem>
 180 |                     <ImportIcon className="size-4 mr-2" />
 181 |                     Import / Open
 182 |                   </MenubarItem>
 183 |                   <MenubarItem>
 184 |                     <FilePlus className="size-4 mr-2" />
 185 |                     New Document
 186 |                   </MenubarItem>
 187 |                   <MenubarSeparator />
 188 |                   <MenubarItem>
 189 |                     <FilePenIcon className="size-4 mr-2" />
 190 |                     Rename
 191 |                   </MenubarItem>
 192 |                   <MenubarItem>
 193 |                     <TrashIcon className="size-4 mr-2" />
 194 |                     Remove
 195 |                   </MenubarItem>
 196 |                   <MenubarSeparator />
 197 |                   <MenubarItem onClick={() => window.print()}>
 198 |                     <PrinterIcon className="size-4 mr-2" />
 199 |                     Print <MenubarShortcut>⌘P</MenubarShortcut>
 200 |                   </MenubarItem>
 201 |                 </MenubarContent>
 202 |               </MenubarMenu>
 203 |               {/* Edit Menu */}
 204 |               <MenubarMenu>
 205 |                 <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
 206 |                   Edit
 207 |                 </MenubarTrigger>
 208 |                 <MenubarContent>
 209 |                   <MenubarItem
 210 |                     onClick={() => editor?.chain().focus().undo().run()}
 211 |                   >
 212 |                     <Undo2Icon className="size-4 mr-2" />
 213 |                     Undo <MenubarShortcut>⌘Z</MenubarShortcut>
 214 |                   </MenubarItem>
 215 |                   <MenubarItem
 216 |                     onClick={() => editor?.chain().focus().redo().run()}
 217 |                   >
 218 |                     <Redo2Icon className="size-4 mr-2" />
 219 |                     Redo <MenubarShortcut>⌘Y</MenubarShortcut>
 220 |                   </MenubarItem>
 221 |                 </MenubarContent>
 222 |               </MenubarMenu>
 223 |               {/* Insert Menu */}
 224 |               <MenubarMenu>
 225 |                 <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
 226 |                   Insert
 227 |                 </MenubarTrigger>
 228 |                 <MenubarContent>
 229 |                   <MenubarSub>
 230 |                     <MenubarSubTrigger>Table</MenubarSubTrigger>
 231 |                     <MenubarSubContent>
 232 |                       <div className="p-2">
 233 |                         <div className="mb-2">
 234 |                           <label htmlFor="rows" className="text-sm">
 235 |                             Rows:
 236 |                           </label>
 237 |                           <input
 238 |                             type="number"
 239 |                             id="rows"
 240 |                             value={rows}
 241 |                             onChange={(e) => setRows(Number(e.target.value))}
 242 |                             min="1"
 243 |                             className="ml-2 p-1 border rounded-sm"
 244 |                           />
 245 |                         </div>
 246 |                         <div className="mb-2">
 247 |                           <label htmlFor="cols" className="text-sm">
 248 |                             Columns:
 249 |                           </label>
 250 |                           <input
 251 |                             type="number"
 252 |                             id="cols"
 253 |                             value={cols}
 254 |                             onChange={(e) => setCols(Number(e.target.value))}
 255 |                             min="1"
 256 |                             className="ml-2 p-1 border rounded-sm"
 257 |                           />
 258 |                         </div>
 259 |                         <MenubarItem
 260 |                           onClick={handleInsertTable}
 261 |                           className="text-sm p-1 hover:bg-muted"
 262 |                         >
 263 |                           Insert Table ({rows} X {cols})
 264 |                         </MenubarItem>
 265 |                       </div>
 266 |                     </MenubarSubContent>
 267 |                   </MenubarSub>
 268 |                 </MenubarContent>
 269 |               </MenubarMenu>
 270 |               {/* Format Menu */}
 271 |               <MenubarMenu>
 272 |                 <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
 273 |                   Format
 274 |                 </MenubarTrigger>
 275 |                 <MenubarContent>
 276 |                   <MenubarSub>
 277 |                     <MenubarSubTrigger>
 278 |                       <TextIcon className="size-4 mr-2" />
 279 |                       Text
 280 |                     </MenubarSubTrigger>
 281 |                     <MenubarSubContent>
 282 |                       <MenubarItem
 283 |                         onClick={() =>
 284 |                           editor?.chain().focus().toggleBold().run()
 285 |                         }
 286 |                       >
 287 |                         <BoldIcon className="size-4 mr-2" />
 288 |                         Bold <MenubarShortcut>⌘B</MenubarShortcut>
 289 |                       </MenubarItem>
 290 |                       <MenubarItem
 291 |                         onClick={() =>
 292 |                           editor?.chain().focus().toggleItalic().run()
 293 |                         }
 294 |                       >
 295 |                         <ItalicIcon className="size-4 mr-2" />
 296 |                         Italic <MenubarShortcut>⌘I</MenubarShortcut>
 297 |                       </MenubarItem>
 298 |                       <MenubarItem
 299 |                         onClick={() =>
 300 |                           editor?.chain().focus().toggleUnderline().run()
 301 |                         }
 302 |                       >
 303 |                         <UnderlineIcon className="size-4 mr-2" />
 304 |                         Underline <MenubarShortcut>⌘U</MenubarShortcut>
 305 |                       </MenubarItem>
 306 |                       <MenubarItem
 307 |                         onClick={() =>
 308 |                           editor?.chain().focus().toggleStrike().run()
 309 |                         }
 310 |                       >
 311 |                         <StrikethroughIcon className="size-4 mr-2" />
 312 |                         Strikethrough
 313 |                       </MenubarItem>
 314 |                     </MenubarSubContent>
 315 |                   </MenubarSub>
 316 |                   <MenubarItem
 317 |                     onClick={() =>
 318 |                       editor?.chain().focus().unsetAllMarks().run()
 319 |                     }
 320 |                   >
 321 |                     <RemoveFormattingIcon className="size-4 mr-2" />
 322 |                     Clear formatting
 323 |                   </MenubarItem>
 324 |                 </MenubarContent>
 325 |               </MenubarMenu>
 326 |               {/* Translate Menu */}
 327 |               <MenubarMenu>
 328 |                 <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
 329 |                   Translate
 330 |                 </MenubarTrigger>
 331 |                 <MenubarContent>
 332 |                   <MenubarItem>
 333 |                     <Link href="/translate/assames/">
 334 |                       <div className="flex items-center">
 335 |                         <span className="text-xl mr-2">অ</span>
 336 |                         Assamese
 337 |                       </div>
 338 |                     </Link>
 339 |                   </MenubarItem>
 340 |                 </MenubarContent>
 341 |               </MenubarMenu>
 342 |               {/* Switch Format Menu */}
 343 |               <MenubarMenu>
 344 |                 <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
 345 |                   Switch Format
 346 |                 </MenubarTrigger>
 347 |                 <MenubarContent>
 348 |                   <MenubarItem>
 349 |                     <FileJsonIcon className="size-4 mr-2" />
 350 |                     Switch Format
 351 |                   </MenubarItem>
 352 |                 </MenubarContent>
 353 |               </MenubarMenu>
 354 |               {/* Full Screen Menu */}
 355 |               <MenubarMenu>
 356 |                 <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
 357 |                   Full Screen
 358 |                 </MenubarTrigger>
 359 |                 <MenubarContent>
 360 |                   <MenubarItem onClick={toggleFullScreen}>
 361 |                     <FileUpIcon className="size-4 mr-2" />
 362 |                     Toggle Full Screen
 363 |                   </MenubarItem>
 364 |                 </MenubarContent>
 365 |               </MenubarMenu>
 366 |             </Menubar>
 367 |           </div>
 368 |         </div>
 369 |       </div>
 370 |     </nav>
 371 |   );
 372 | };

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/documents/[documentId]/verticalRuler.tsx`:

```tsx
   1 | import { useRef, useState } from "react";
   2 | import { FaCaretDown } from "react-icons/fa";
   3 | 
   4 | const markers = Array.from({ length: 83 }, (_, i) => i);
   5 | 
   6 | export const VerticalRuler = () => {
   7 |   const [topMargin, setTopMargin] = useState(56);
   8 |   const [bottomMargin, setBottomMargin] = useState(56);
   9 | 
  10 |   const [isDraggingTop, setIsDraggingTop] = useState(false);
  11 |   const [isDraggingBottom, setIsDraggingBottom] = useState(false);
  12 | 
  13 |   const rulerRef = useRef<HTMLDivElement>(null);
  14 | 
  15 |   const handleTopMouseDown = () => setIsDraggingTop(true);
  16 |   const handleBottomMouseDown = () => setIsDraggingBottom(true);
  17 | 
  18 |   const handleMouseMove = (e: React.MouseEvent) => {
  19 |     const PAGE_HEIGHT = 816; // Fixed A4 height at 96 DPI
  20 |     const MINIMUM_SPACE = 100;
  21 | 
  22 |     if ((isDraggingTop || isDraggingBottom) && rulerRef.current) {
  23 |       const containerRect = rulerRef.current.getBoundingClientRect();
  24 |       const relativeY = e.clientY - containerRect.top;
  25 |       const rawPosition = Math.max(0, Math.min(PAGE_HEIGHT, relativeY));
  26 | 
  27 |       if (isDraggingTop) {
  28 |         const maxTopPosition = PAGE_HEIGHT - bottomMargin - MINIMUM_SPACE;
  29 |         const constrainedTopPosition = Math.min(rawPosition, maxTopPosition);
  30 |         setTopMargin(constrainedTopPosition);
  31 |       }
  32 | 
  33 |       if (isDraggingBottom) {
  34 |         const maxBottomPosition = PAGE_HEIGHT - (topMargin + MINIMUM_SPACE);
  35 |         const constrainedBottomPosition = Math.min(Math.max(PAGE_HEIGHT - rawPosition, 0), maxBottomPosition);
  36 |         setBottomMargin(constrainedBottomPosition);
  37 |       }
  38 |     }
  39 |   };
  40 | 
  41 |   const handleMouseUp = () => {
  42 |     setIsDraggingTop(false);
  43 |     setIsDraggingBottom(false);
  44 |   };
  45 | 
  46 |   const handleTopDoubleClick = () => setTopMargin(56);
  47 |   const handleBottomDoubleClick = () => setBottomMargin(56);
  48 | 
  49 |   return (
  50 |     <div
  51 |       ref={rulerRef}
  52 |       onMouseMove={handleMouseMove}
  53 |       onMouseUp={handleMouseUp}
  54 |       onMouseLeave={handleMouseUp}
  55 |       className="w-6 mx-auto h-[816px] border-r border-gray-300 flex items-start relative select-none print:hidden"
  56 |     >
  57 |       <div id="ruler-container" className="w-full h-full relative">
  58 |         {/* Top margin draggable marker */}
  59 |         <Marker
  60 |           position={topMargin}
  61 |           isTop={true}
  62 |           isDragging={isDraggingTop}
  63 |           onMouseDown={handleTopMouseDown}
  64 |           onDoubleClick={handleTopDoubleClick}
  65 |         />
  66 | 
  67 |         {/* Bottom margin draggable marker */}
  68 |         <Marker
  69 |           position={bottomMargin}
  70 |           isTop={false}
  71 |           isDragging={isDraggingBottom}
  72 |           onMouseDown={handleBottomMouseDown}
  73 |           onDoubleClick={handleBottomDoubleClick}
  74 |         />
  75 | 
  76 |         {/* Render markers */}
  77 |         <div className="absolute inset-0 left-0 w-full">
  78 |           {markers.map((marker) => {
  79 |             const position = (marker * 1024) / 82; // Map markers evenly across A4's 816px height
  80 |             return (
  81 |               <div
  82 |                 key={marker}
  83 |                 className="absolute left-0"
  84 |                 style={{ top: `${position}px` }}
  85 |               >
  86 |                 {marker % 10 === 0 && (
  87 |                   <>
  88 |                     <div className="absolute left-0 w-2 h-[1px] bg-neutral-500" />
  89 |                     <span className="absolute left-2 text-[10px] text-neutral-500 transform -translate-y-1/2">
  90 |                       {marker / 10 + 1}
  91 |                     </span>
  92 |                   </>
  93 |                 )}
  94 |                 {marker % 5 === 0 && marker % 10 !== 0 && (
  95 |                   <div className="absolute left-0 w-1.5 h-[1px] bg-neutral-500" />
  96 |                 )}
  97 |                 {marker % 5 !== 0 && (
  98 |                   <div className="absolute left-0 w-1 h-[1px] bg-neutral-500" />
  99 |                 )}
 100 |               </div>
 101 |             );
 102 |           })}
 103 |         </div>
 104 |       </div>
 105 |     </div>
 106 |   );
 107 | };
 108 | 
 109 | interface MarkerProps {
 110 |   position: number;
 111 |   isTop: boolean;
 112 |   isDragging: boolean;
 113 |   onMouseDown: () => void;
 114 |   onDoubleClick: () => void;
 115 | }
 116 | 
 117 | const Marker = ({
 118 |   position,
 119 |   isTop,
 120 |   isDragging,
 121 |   onMouseDown,
 122 |   onDoubleClick,
 123 | }: MarkerProps) => {
 124 |   return (
 125 |     <div
 126 |       className="absolute left-0 w-full h-4 cursor-ns-resize z-[5] group -mt-2"
 127 |       style={{ [isTop ? "top" : "bottom"]: `${position}px` }}
 128 |       onMouseDown={onMouseDown}
 129 |       onDoubleClick={onDoubleClick}
 130 |     >
 131 |       <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
 132 |       <div
 133 |         className="absolute left-1/2 top-4 transform -translate-x-1/2"
 134 |         style={{
 135 |           height: "100%",
 136 |           width: "1px",
 137 |           transform: "scaleY(0.5)",
 138 |           backgroundColor: "#3b72f6",
 139 |           display: isDragging ? "block" : "none",
 140 |         }}
 141 |       />
 142 |     </div>
 143 |   );
 144 | };

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/documents/[documentId]/ruler.tsx`:

```tsx
   1 | import { useRef, useState } from "react";
   2 | import { FaCaretDown } from "react-icons/fa";
   3 | 
   4 | const markers = Array.from({ length: 83 }, (_, i) => i);
   5 | 
   6 | export const Ruler = () => {
   7 |   const [leftMargin, setLeftMargin] = useState(56);
   8 |   const [rightMargin, setRightMargin] = useState(56);
   9 | 
  10 |   const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  11 |   const [isDraggingRight, setIsDraggingRight] = useState(false);
  12 |   const rulerRef = useRef<HTMLDivElement>(null);
  13 | 
  14 |   const handleLeftMouseDown = () => {
  15 |     setIsDraggingLeft(true);
  16 |   };
  17 | 
  18 |   const handleRightMouseDown = () => {
  19 |     setIsDraggingRight(true);
  20 |   };
  21 | 
  22 |   const handleMouseMove = (e: React.MouseEvent) => {
  23 |     const PAGE_WIDTH = 816;
  24 |     const MININUM_SPACE = 100;
  25 | 
  26 |     if ((isDraggingLeft || isDraggingRight) && rulerRef.current) {
  27 |       const container = rulerRef.current.querySelector("#ruler-container");
  28 |       if (container) {
  29 |         const containerRect = container.getBoundingClientRect();
  30 |         const relativeX = e.clientX - containerRect.left;
  31 |         const rawPosition = Math.max(0, Math.min(PAGE_WIDTH, relativeX));
  32 | 
  33 |         if (isDraggingLeft) {
  34 |           const maxLeftPosition = PAGE_WIDTH - rightMargin - MININUM_SPACE;
  35 |           const newLeftPosition = Math.min(rawPosition, maxLeftPosition);
  36 |           setLeftMargin(newLeftPosition); //TODO: Make collaborative
  37 |         } else if (isDraggingRight) {
  38 |           const maxRightPosition = PAGE_WIDTH - (leftMargin + MININUM_SPACE);
  39 |           const newRightPosition = Math.max(PAGE_WIDTH - rawPosition, 0);
  40 |           const constrainedRightPosition = Math.min(
  41 |             newRightPosition,
  42 |             maxRightPosition
  43 |           );
  44 |           setRightMargin(constrainedRightPosition);
  45 |         }
  46 |       }
  47 |     }
  48 |   };
  49 |   const handleMouseUp = () => {
  50 |     setIsDraggingLeft(false);
  51 |     setIsDraggingRight(false);
  52 |   };
  53 | 
  54 |   const handleLeftDoubleClick = () => {
  55 |     setLeftMargin(56);
  56 |   };
  57 |   const handleRightDoubleClick = () => {
  58 |     setRightMargin(56);
  59 |   };
  60 | 
  61 |   return (
  62 |     <div
  63 |       ref={rulerRef}
  64 |       onMouseMove={handleMouseMove}
  65 |       onMouseUp={handleMouseUp}
  66 |       onMouseLeave={handleMouseUp}
  67 |       className="w-[816px] mx-auto h-6 border-b border-gray-300 flex items-end relative select-none print:hidden"
  68 |     >
  69 |       <div id="ruler-container" className=" w-full h-full relative">
  70 |         <Marker
  71 |           position={leftMargin}
  72 |           isLeft={true}
  73 |           isDragging={isDraggingLeft}
  74 |           onMouseDown={handleLeftMouseDown}
  75 |           onDoubleClick={handleLeftDoubleClick}
  76 |         />
  77 |         <Marker
  78 |           position={rightMargin}
  79 |           isLeft={false}
  80 |           isDragging={isDraggingRight}
  81 |           onMouseDown={handleRightMouseDown}
  82 |           onDoubleClick={handleRightDoubleClick}
  83 |         />
  84 |         <div className="absolute inset-0 bottom-0 h-full">
  85 |           <div className="relative h-full w-[816px]">
  86 |             {markers.map((marker) => {
  87 |               const position = (marker * 816) / 82;
  88 | 
  89 |               return (
  90 |                 <div
  91 |                   key={marker}
  92 |                   className="absolute bottom-0"
  93 |                   style={{ left: `${position}px` }}
  94 |                 >
  95 |                   {marker % 10 === 0 && (
  96 |                     <>
  97 |                       <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500" />
  98 |                       <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
  99 |                         {marker / 10 + 1}
 100 |                       </span>
 101 |                     </>
 102 |                   )}
 103 |                   {marker % 5 === 0 && marker % 10 !== 0 && (
 104 |                     <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
 105 |                   )}
 106 |                   {marker % 5 !== 0 && (
 107 |                     <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
 108 |                   )}
 109 |                 </div>
 110 |               );
 111 |             })}
 112 |           </div>
 113 |         </div>
 114 |       </div>
 115 |     </div>
 116 |   );
 117 | };
 118 | 
 119 | interface MarkerProps {
 120 |   position: number;
 121 |   isLeft: boolean;
 122 |   isDragging: boolean;
 123 |   onMouseDown: () => void;
 124 |   onDoubleClick: () => void;
 125 | }
 126 | 
 127 | const Marker = ({
 128 |   position,
 129 |   isLeft,
 130 |   isDragging,
 131 |   onMouseDown,
 132 |   onDoubleClick,
 133 | }: MarkerProps) => {
 134 |   return (
 135 |     <div
 136 |       className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
 137 |       style={{ [isLeft ? "left" : "right"]: `${position}px` }}
 138 |       onMouseDown={onMouseDown}
 139 |       onDoubleClick={onDoubleClick}
 140 |     >
 141 |       <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
 142 |       <div
 143 |         className="absolute left-1/2 top-4 transform -translate-x-1/2"
 144 |         style={{
 145 |           height: "100vh",
 146 |           width: "1px",
 147 |           transform: "scaleX(0.5)",
 148 |           backgroundColor: "#3b72f6",
 149 |           display: isDragging ? "block" : "none",
 150 |         }}
 151 |       />
 152 |     </div>
 153 |   );
 154 | };

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/documents/[documentId]/toolbar.tsx`:

```tsx
   1 | "use client";
   2 | 
   3 | import { useState } from "react";
   4 | import { ColorResult, SketchPicker } from "react-color";
   5 | import { Level } from "@tiptap/extension-heading";
   6 | import {
   7 |   AlignCenterIcon,
   8 |   AlignJustifyIcon,
   9 |   AlignLeftIcon,
  10 |   AlignRightIcon,
  11 |   BoldIcon,
  12 |   ChevronDownIcon,
  13 |   HighlighterIcon,
  14 |   ImageIcon,
  15 |   ItalicIcon,
  16 |   Link2Icon,
  17 |   ListCollapseIcon,
  18 |   ListIcon,
  19 |   ListOrderedIcon,
  20 |   ListTodoIcon,
  21 |   LucideIcon,
  22 |   MessageSquareCodeIcon,
  23 |   MinusIcon,
  24 |   PlusIcon,
  25 |   PrinterIcon,
  26 |   Redo2Icon,
  27 |   RemoveFormattingIcon,
  28 |   SearchIcon,
  29 |   SpellCheckIcon,
  30 |   UnderlineIcon,
  31 |   Undo2Icon,
  32 |   UploadIcon,
  33 | } from "lucide-react";
  34 | import { cn } from "@/lib/utils";
  35 | import { Separator } from "@/components/ui/separator";
  36 | import { useEditorStore } from "@/store/use-editor-store";
  37 | import {
  38 |   DropdownMenu,
  39 |   DropdownMenuContent,
  40 |   DropdownMenuItem,
  41 |   DropdownMenuTrigger,
  42 | } from "@/components/ui/dropdown-menu";
  43 | import {
  44 |   Dialog,
  45 |   DialogContent,
  46 |   DialogFooter,
  47 |   DialogHeader,
  48 |   DialogTitle,
  49 | } from "@/components/ui/dialog";
  50 | // import Color from "@tiptap/extension-color";
  51 | import { Input } from "@/components/ui/input";
  52 | import { Button } from "@/components/ui/button";
  53 | import TextAlign from "@tiptap/extension-text-align";
  54 | import { isActive } from "@tiptap/react";
  55 | import { parse } from "path";
  56 | import { Value } from "@radix-ui/react-select";
  57 | 
  58 | const LineHeightButton = () => {
  59 |   const { editor } = useEditorStore();
  60 | 
  61 |   const lineHeights = [
  62 |     { label: "Default", value: "normal" },
  63 |     { label: "Single", value: "1" },
  64 |     { label: "1.15", value: "1.15" },
  65 |     { label: "1.5", value: "1.5" },
  66 |     { label: "Double", value: "2" },
  67 |   ];
  68 | 
  69 |   return (
  70 |     <DropdownMenu>
  71 |       <DropdownMenuTrigger asChild>
  72 |         <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
  73 |           <ListCollapseIcon className="size-4" />
  74 |         </button>
  75 |       </DropdownMenuTrigger>
  76 |       <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
  77 |         {lineHeights.map(({ label, value }) => (
  78 |           <button
  79 |             key={value}
  80 |             onClick={() => editor?.chain().focus().setLineHeight(value).run()}
  81 |             className={cn(
  82 |               "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
  83 |               editor?.getAttributes("paragraph").lineHeight === value &&
  84 |                 "bg-neutral-200/80"
  85 |             )}
  86 |           >
  87 |             <span className="text-sm">{label}</span>
  88 |           </button>
  89 |         ))}
  90 |       </DropdownMenuContent>
  91 |     </DropdownMenu>
  92 |   );
  93 | };
  94 | 
  95 | const FontSizeButton = () => {
  96 |   const { editor } = useEditorStore();
  97 | 
  98 |   const currentFontSize = editor?.getAttributes("textStyle").fontSize
  99 |     ? editor?.getAttributes("textStyle").fontSize.replace("px", "")
 100 |     : "16";
 101 | 
 102 |   const [fontSize, setFontSize] = useState(currentFontSize);
 103 |   const [inputValue, setInputvalue] = useState(fontSize);
 104 |   const [isEditing, setIsEditing] = useState(false);
 105 | 
 106 |   const updateFontSize = (newSize: string) => {
 107 |     const size = parseInt(newSize);
 108 |     if (!isNaN(size) && size > 0) {
 109 |       editor?.chain().focus().setFontSize(`${size}px`).run();
 110 |       setFontSize(newSize);
 111 |       setInputvalue(newSize);
 112 |       setIsEditing(false);
 113 |     }
 114 |   };
 115 | 
 116 |   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 117 |     setInputvalue(e.target.value);
 118 |   };
 119 | 
 120 |   const handleInputBlur = () => {
 121 |     updateFontSize(inputValue);
 122 |   };
 123 | 
 124 |   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
 125 |     if (e.key === "Enter") {
 126 |       e.preventDefault();
 127 |       updateFontSize(inputValue);
 128 |       editor?.commands.focus();
 129 |     }
 130 |   };
 131 | 
 132 |   const increment = () => {
 133 |     const newSize = parseInt(fontSize) + 1;
 134 |     updateFontSize(newSize.toString());
 135 |   };
 136 | 
 137 |   const decrement = () => {
 138 |     const newSize = parseInt(fontSize) - 1;
 139 |     if (newSize > 0) {
 140 |       updateFontSize(newSize.toString());
 141 |     }
 142 |   };
 143 | 
 144 |   return (
 145 |     <div className="flex items-center gap-x-0.5">
 146 |       <button
 147 |         onClick={decrement}
 148 |         className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 "
 149 |       >
 150 |         <MinusIcon className="size-4" />
 151 |       </button>
 152 |       {isEditing ? (
 153 |         <Input
 154 |           type="text"
 155 |           value={inputValue}
 156 |           onChange={handleInputChange}
 157 |           onBlur={handleInputBlur}
 158 |           onKeyDown={handleKeyDown}
 159 |           className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent focus:outline-none focus:ring-0"
 160 |         />
 161 |       ) : (
 162 |         <button
 163 |           onClick={() => {
 164 |             setIsEditing(true);
 165 |             setFontSize(currentFontSize);
 166 |           }}
 167 |           className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm  hover:bg-neutral-200/80"
 168 |         >
 169 |           {currentFontSize}
 170 |         </button>
 171 |       )}
 172 |       <button
 173 |         onClick={increment}
 174 |         className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 "
 175 |       >
 176 |         <PlusIcon className="size-4" />
 177 |       </button>
 178 |     </div>
 179 |   );
 180 | };
 181 | 
 182 | const ListButton = () => {
 183 |   const { editor } = useEditorStore();
 184 | 
 185 |   const lists = [
 186 |     {
 187 |       label: "Bullet List",
 188 |       icon: ListIcon,
 189 |       isActive: () => editor?.isActive("bulletList"),
 190 |       onClick: () => editor?.chain().focus().toggleBulletList().run(),
 191 |     },
 192 |     {
 193 |       label: "Ordered Lists",
 194 |       icon: ListOrderedIcon,
 195 |       isActive: () => editor?.isActive("orderedList"),
 196 |       onClick: () => editor?.chain().focus().toggleOrderedList().run(),
 197 |     },
 198 |   ];
 199 | 
 200 |   return (
 201 |     <DropdownMenu>
 202 |       <DropdownMenuTrigger asChild>
 203 |         <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
 204 |           <ListIcon className="size-4" />
 205 |         </button>
 206 |       </DropdownMenuTrigger>
 207 |       <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
 208 |         {lists.map(({ label, icon: Icon, onClick, isActive }) => (
 209 |           <button
 210 |             key={label}
 211 |             onClick={onClick}
 212 |             className={cn(
 213 |               "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
 214 |               isActive() && "bg-neutral-200/80"
 215 |             )}
 216 |           >
 217 |             <Icon className="size-4" />
 218 |             <span className="text-sm">{label}</span>
 219 |           </button>
 220 |         ))}
 221 |       </DropdownMenuContent>
 222 |     </DropdownMenu>
 223 |   );
 224 | };
 225 | 
 226 | const AlignButton = () => {
 227 |   const { editor } = useEditorStore();
 228 | 
 229 |   const alignments = [
 230 |     {
 231 |       label: "Align left",
 232 |       value: "left",
 233 |       icon: AlignLeftIcon,
 234 |     },
 235 |     {
 236 |       label: "Align Center",
 237 |       value: "center",
 238 |       icon: AlignCenterIcon,
 239 |     },
 240 |     {
 241 |       label: "Align Right",
 242 |       value: "right",
 243 |       icon: AlignRightIcon,
 244 |     },
 245 |     {
 246 |       label: "Align Justified",
 247 |       value: "justify",
 248 |       icon: AlignJustifyIcon,
 249 |     },
 250 |   ];
 251 | 
 252 |   return (
 253 |     <DropdownMenu>
 254 |       <DropdownMenuTrigger asChild>
 255 |         <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
 256 |           <AlignLeftIcon className="size-4" />
 257 |         </button>
 258 |       </DropdownMenuTrigger>
 259 |       <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
 260 |         {alignments.map(({ label, value, icon: Icon }) => (
 261 |           <button
 262 |             key={value}
 263 |             onClick={() => editor?.chain().focus().setTextAlign(value).run()}
 264 |             className={cn(
 265 |               "flex items-center gap-x2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
 266 |               editor?.isActive({ TextAlign: value }) && "bg-neutral-200/80"
 267 |             )}
 268 |           >
 269 |             <Icon className="size-4" />
 270 |             <span className="text-sm">{label}</span>
 271 |           </button>
 272 |         ))}
 273 |       </DropdownMenuContent>
 274 |     </DropdownMenu>
 275 |   );
 276 | };
 277 | 
 278 | const ImageButton = () => {
 279 |   const { editor } = useEditorStore();
 280 |   const [isDialogOpen, setIsDialogOpen] = useState(false);
 281 |   const [imageUrl, setImageUrl] = useState("");
 282 | 
 283 |   const onChange = (src: string) => {
 284 |     editor?.chain().focus().setImage({ src }).run();
 285 |   };
 286 | 
 287 |   const onUpload = () => {
 288 |     const input = document.createElement("input");
 289 |     input.type = "file";
 290 |     input.accept = "image/*";
 291 | 
 292 |     input.onchange = (e) => {
 293 |       const file = (e.target as HTMLInputElement).files?.[0];
 294 |       if (file) {
 295 |         const imageUrl = URL.createObjectURL(file);
 296 |         onChange(imageUrl);
 297 |       }
 298 |     };
 299 | 
 300 |     input.click();
 301 |   };
 302 | 
 303 |   const handleImageUrlSubmit = () => {
 304 |     if (imageUrl) {
 305 |       onChange(imageUrl);
 306 |       setImageUrl("");
 307 |       setIsDialogOpen(false);
 308 |     }
 309 |   };
 310 | 
 311 |   return (
 312 |     <>
 313 |       <DropdownMenu>
 314 |         <DropdownMenuTrigger asChild>
 315 |           <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
 316 |             <ImageIcon className="size-4" />
 317 |           </button>
 318 |         </DropdownMenuTrigger>
 319 |         <DropdownMenuContent>
 320 |           <DropdownMenuItem onClick={onUpload}>
 321 |             <UploadIcon className="size-2 mr-2" />
 322 |             Upload
 323 |           </DropdownMenuItem>
 324 |           <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
 325 |             <SearchIcon className="size-2 mr-2" />
 326 |             Past image url
 327 |           </DropdownMenuItem>
 328 |         </DropdownMenuContent>
 329 |       </DropdownMenu>
 330 | 
 331 |       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
 332 |         <DialogContent>
 333 |           <DialogHeader>
 334 |             <DialogTitle>Insert image URL</DialogTitle>
 335 |           </DialogHeader>
 336 |           <input
 337 |             placeholder="Insert image URL"
 338 |             value={imageUrl}
 339 |             onChange={(e) => setImageUrl(e.target.value)}
 340 |             onKeyDown={(e) => {
 341 |               if (e.key === "Enter") {
 342 |                 handleImageUrlSubmit();
 343 |               }
 344 |             }}
 345 |           />
 346 |           <DialogFooter>
 347 |             <Button onClick={handleImageUrlSubmit}>Submit</Button>
 348 |             <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
 349 |           </DialogFooter>
 350 |         </DialogContent>
 351 |       </Dialog>
 352 |     </>
 353 |   );
 354 | };
 355 | 
 356 | const LinkButton = () => {
 357 |   const { editor } = useEditorStore();
 358 |   const [value, setValue] = useState("");
 359 | 
 360 |   const onChange = (href: string) => {
 361 |     editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
 362 |     setValue("");
 363 |   };
 364 | 
 365 |   return (
 366 |     <DropdownMenu
 367 |       onOpenChange={(open) => {
 368 |         if (open) {
 369 |           setValue(editor?.getAttributes("link").href || "");
 370 |         }
 371 |       }}
 372 |     >
 373 |       <DropdownMenuTrigger asChild>
 374 |         <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
 375 |           <Link2Icon className="size-4" />
 376 |         </button>
 377 |       </DropdownMenuTrigger>
 378 |       <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
 379 |         <Input
 380 |           placeholder="https://example.com"
 381 |           value={value}
 382 |           onChange={(e) => setValue(e.target.value)}
 383 |         />
 384 |         <Button onClick={() => onChange(value)}>Apply</Button>
 385 |       </DropdownMenuContent>
 386 |     </DropdownMenu>
 387 |   );
 388 | };
 389 | 
 390 | const HighlightColorButton = () => {
 391 |   const { editor } = useEditorStore();
 392 | 
 393 |   const value = editor?.getAttributes("highlight").color || "#ffffff";
 394 | 
 395 |   const onChange = (color: ColorResult) => {
 396 |     editor?.chain().focus().setHighlight({ color: color.hex }).run();
 397 |   };
 398 | 
 399 |   return (
 400 |     <DropdownMenu>
 401 |       <DropdownMenuTrigger asChild>
 402 |         <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
 403 |           <HighlighterIcon className="size-4" />
 404 |         </button>
 405 |       </DropdownMenuTrigger>
 406 |       <DropdownMenuContent className="p-0">
 407 |         <SketchPicker color={value} onChange={onChange} />
 408 |       </DropdownMenuContent>
 409 |     </DropdownMenu>
 410 |   );
 411 | };
 412 | 
 413 | const TextColorButton = () => {
 414 |   const { editor } = useEditorStore();
 415 | 
 416 |   const value = editor?.getAttributes("textStyle").color || "#000000";
 417 | 
 418 |   const onChange = (color: ColorResult) => {
 419 |     editor?.chain().focus().setColor(color.hex).run();
 420 |   };
 421 | 
 422 |   return (
 423 |     <DropdownMenu>
 424 |       <DropdownMenuTrigger asChild>
 425 |         <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
 426 |           <span className="text-xs">A</span>
 427 |           <div className="h-0.5 w-full" style={{ backgroundColor: value }} />
 428 |         </button>
 429 |       </DropdownMenuTrigger>
 430 |       <DropdownMenuContent className="p-0">
 431 |         <SketchPicker color={value} onChange={onChange} />
 432 |       </DropdownMenuContent>
 433 |     </DropdownMenu>
 434 |   );
 435 | };
 436 | 
 437 | const HeadingLevelButton = () => {
 438 |   const { editor } = useEditorStore();
 439 | 
 440 |   const headings = [
 441 |     { label: "Normal text", value: 0, fontSize: "16px" },
 442 |     { label: "Heading 1", value: 1, fontSize: "32px" },
 443 |     { label: "Heading 2", value: 2, fontSize: "28px" },
 444 |     { label: "Heading 3", value: 3, fontSize: "24px" },
 445 |     { label: "Heading 4", value: 4, fontSize: "20px" },
 446 |     { label: "Heading 5", value: 5, fontSize: "18px" },
 447 |     { label: "Heading 6", value: 6, fontSize: "16px" },
 448 |     // { label: "Subheading", value: 7, fontSize: "14px" },
 449 |     // { label: "Body Text", value: 8, fontSize: "12px" },
 450 |     // { label: "Small Text", value: 9, fontSize: "10px" },
 451 |   ];
 452 |   const getCurrentHeading = () => {
 453 |     for (let level = 1; level <= 5; level++) {
 454 |       if (editor?.isActive("heading", { level })) {
 455 |         return `heading ${level}`;
 456 |       }
 457 |     }
 458 | 
 459 |     return "Normal text";
 460 |   };
 461 | 
 462 |   return (
 463 |     <DropdownMenu>
 464 |       <DropdownMenuTrigger asChild>
 465 |         <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
 466 |           <span className="truncate">{getCurrentHeading()}</span>
 467 |           <ChevronDownIcon className="ml-2 size-4 shrink-0" />
 468 |         </button>
 469 |       </DropdownMenuTrigger>
 470 |       <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
 471 |         {headings.map(({ label, value, fontSize }) => (
 472 |           <button
 473 |             key={value}
 474 |             style={{ fontSize }}
 475 |             onClick={() => {
 476 |               if (value === 0) {
 477 |                 editor?.chain().focus().setParagraph().run();
 478 |               } else {
 479 |                 editor
 480 |                   ?.chain()
 481 |                   .focus()
 482 |                   .toggleHeading({ level: value as Level })
 483 |                   .run();
 484 |               }
 485 |             }}
 486 |             className={cn(
 487 |               "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
 488 |               (value === 0 && !editor?.isActive("heading")) ||
 489 |                 (editor?.isActive("heading", { level: value }) &&
 490 |                   "bg-neutral-200/80")
 491 |             )}
 492 |           >
 493 |             {label}
 494 |           </button>
 495 |         ))}
 496 |       </DropdownMenuContent>
 497 |     </DropdownMenu>
 498 |   );
 499 | };
 500 | 
 501 | const FontFamilyButton = () => {
 502 |   const { editor } = useEditorStore();
 503 | 
 504 |   const fonts = [
 505 |     { label: "Arial", value: "Arial" }, // Basic browser support fonts
 506 |     { label: "Times New Roman", value: "Times New Roman" },
 507 |     { label: "Courier New", value: "Courier New" },
 508 |     { label: "Georgia", value: "Georgia" },
 509 |     { label: "Verdana", value: "Verdana" },
 510 |     { label: "Tahoma", value: "Tahoma" }, // Another sans-serif font
 511 |     { label: "Trebuchet MS", value: "Trebuchet MS" }, // A clean, sans-serif font
 512 |     { label: "Impact", value: "Impact" }, // Bold, strong font
 513 |     { label: "Comic Sans MS", value: "Comic Sans MS" }, // Playful font
 514 |     { label: "Lucida Console", value: "Lucida Console" }, // Monospace font
 515 |     { label: "Lucida Sans Unicode", value: "Lucida Sans Unicode" }, // Sans-serif, clean font
 516 |     { label: "Arial Black", value: "Arial Black" }, // Heavier version of Arial
 517 |     { label: "Helvetica", value: "Helvetica" }, // Similar to Arial, popular sans-serif font
 518 |     { label: "Palatino Linotype", value: "Palatino Linotype" }, // Elegant serif font
 519 |     { label: "Book Antiqua", value: "Book Antiqua" }, // Serif font similar to Palatino
 520 |     { label: "Courier", value: "Courier" }, // Another monospace font
 521 |     { label: "MS Sans Serif", value: "MS Sans Serif" }, // Old, basic sans-serif font
 522 |     { label: "MS Serif", value: "MS Serif" }, // Basic serif font
 523 |   ];
 524 | 
 525 |   return (
 526 |     <DropdownMenu>
 527 |       <DropdownMenuTrigger asChild>
 528 |         <button className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
 529 |           <span className="truncate">
 530 |             {editor?.getAttributes("textStyle").fontFamily || "Arial"}
 531 |           </span>
 532 |           <ChevronDownIcon className="ml-2 size-4 shrink-0" />
 533 |         </button>
 534 |       </DropdownMenuTrigger>
 535 |       <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
 536 |         {fonts.map(({ label, value }) => (
 537 |           <button
 538 |             onClick={() => editor?.chain().focus().setFontFamily(value).run()}
 539 |             key={value}
 540 |             className={cn(
 541 |               "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
 542 |               editor?.getAttributes("textStyle").fontfamily === value &&
 543 |                 "bg-neutral-200/80"
 544 |             )}
 545 |             style={{ fontFamily: value }}
 546 |           >
 547 |             <span className="text-sm">{label}</span>
 548 |           </button>
 549 |         ))}
 550 |       </DropdownMenuContent>
 551 |     </DropdownMenu>
 552 |   );
 553 | };
 554 | 
 555 | interface ToolbarButtonProps {
 556 |   onClick?: () => void;
 557 |   isActive?: boolean;
 558 |   icon: LucideIcon;
 559 | }
 560 | 
 561 | const ToolbarButton = ({
 562 |   onClick,
 563 |   isActive,
 564 |   icon: Icon,
 565 | }: ToolbarButtonProps) => {
 566 |   return (
 567 |     <button
 568 |       onClick={onClick}
 569 |       className={cn(
 570 |         "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
 571 |         isActive && "bg-neutral-200/80"
 572 |       )}
 573 |     >
 574 |       <Icon className="size-4" />
 575 |     </button>
 576 |   );
 577 | };
 578 | 
 579 | export const ToolBar = () => {
 580 |   const { editor } = useEditorStore();
 581 | 
 582 |   const sections: {
 583 |     label: string;
 584 |     icon: LucideIcon;
 585 |     onClick: () => void;
 586 |     isActive?: boolean;
 587 |   }[][] = [
 588 |     [
 589 |       {
 590 |         label: "Undo",
 591 |         icon: Undo2Icon,
 592 |         onClick: () => editor?.chain().focus().undo().run(),
 593 |       },
 594 |       {
 595 |         label: "Redo",
 596 |         icon: Redo2Icon,
 597 |         onClick: () => editor?.chain().focus().redo().run(),
 598 |       },
 599 |       {
 600 |         label: "Print",
 601 |         icon: PrinterIcon,
 602 |         onClick: () => window.print(),
 603 |       },
 604 |       {
 605 |         label: "Spell Check",
 606 |         icon: SpellCheckIcon,
 607 |         onClick: () => {
 608 |           const current = editor?.view.dom.getAttribute("spellcheck");
 609 |           editor?.view.dom.setAttribute(
 610 |             "spellcheck",
 611 |             current === "false" ? "ture" : "false"
 612 |           );
 613 |         },
 614 |       },
 615 |     ],
 616 |     [
 617 |       {
 618 |         label: "Bold",
 619 |         icon: BoldIcon,
 620 |         isActive: editor?.isActive("bold"),
 621 |         onClick: () => editor?.chain().focus().toggleBold().run(),
 622 |       },
 623 |       {
 624 |         label: "Italic",
 625 |         icon: ItalicIcon,
 626 |         isActive: editor?.isActive("italic"),
 627 |         onClick: () => editor?.chain().focus().toggleItalic().run(),
 628 |       },
 629 |       {
 630 |         label: "Underline",
 631 |         icon: UnderlineIcon,
 632 |         isActive: editor?.isActive("underline"),
 633 |         onClick: () => editor?.chain().focus().toggleUnderline().run(),
 634 |       },
 635 |     ],
 636 |     [
 637 |       {
 638 |         label: "Commemt",
 639 |         icon: MessageSquareCodeIcon,
 640 |         onClick: () => console.log("TODO:Comment"),
 641 |         isActive: false, //TODO: Enable this functionlity
 642 |       },
 643 |       {
 644 |         label: "List Todo",
 645 |         icon: ListTodoIcon,
 646 |         onClick: () => editor?.chain().focus().toggleTaskList().run(),
 647 |         isActive: editor?.isActive("taskList"),
 648 |       },
 649 |       {
 650 |         label: "Remove Formatting",
 651 |         icon: RemoveFormattingIcon,
 652 |         onClick: () => editor?.chain().focus().unsetAllMarks().run(),
 653 |       },
 654 |     ],
 655 |   ];
 656 |   return (
 657 |     <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
 658 |       {sections[0].map((item) => (
 659 |         <ToolbarButton key={item.label} {...item} />
 660 |       ))}
 661 |       <Separator orientation="vertical" className="h-6 bg-neutral-300 " />
 662 |       <FontFamilyButton />
 663 |       <Separator orientation="vertical" className="h-6 bg-neutral-300 " />
 664 |       <HeadingLevelButton />
 665 |       <Separator orientation="vertical" className="h-6 bg-neutral-300 " />
 666 |       <FontSizeButton />
 667 |       <Separator orientation="vertical" className="h-6 bg-neutral-300 " />
 668 |       {sections[1].map((item) => (
 669 |         <ToolbarButton key={item.label} {...item} />
 670 |       ))}
 671 |       <TextColorButton />
 672 |       <HighlightColorButton />
 673 |       <Separator orientation="vertical" className="h-6 bg-neutral-300 " />
 674 |       <LinkButton />
 675 |       <ImageButton />
 676 |       <AlignButton />
 677 |       <LineHeightButton />
 678 |       <ListButton />
 679 |       {sections[2].map((item) => (
 680 |         <ToolbarButton key={item.label} {...item} />
 681 |       ))}
 682 |     </div>
 683 |   );
 684 | };

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/documents/[documentId]/editor.tsx`:

```tsx
   1 | // "use client";
   2 | 
   3 | // import { useEffect, useState } from "react";
   4 | // import { useEditor, EditorContent } from "@tiptap/react";
   5 | // import StarterKit from "@tiptap/starter-kit";
   6 | // import TaskItem from "@tiptap/extension-task-item";
   7 | // import TaskList from "@tiptap/extension-task-list";
   8 | // import Table from "@tiptap/extension-table";
   9 | // import TableCell from "@tiptap/extension-table-cell";
  10 | // import TableHeader from "@tiptap/extension-table-header";
  11 | // import TableRow from "@tiptap/extension-table-row";
  12 | // import Image from "@tiptap/extension-image";
  13 | // import TextAlign from "@tiptap/extension-text-align";
  14 | // import Link from "@tiptap/extension-link";
  15 | // import { Color } from "@tiptap/extension-color";
  16 | // import Highlight from "@tiptap/extension-highlight";
  17 | // import FontFamily from "@tiptap/extension-font-family";
  18 | // import TextStyle from "@tiptap/extension-text-style";
  19 | // import Underline from "@tiptap/extension-underline";
  20 | // import ImageResize from "tiptap-extension-resize-image";
  21 | // import { useEditorStore } from "@/store/use-editor-store";
  22 | // import { Import } from "@tiptap-pro/extension-import";
  23 | 
  24 | // import { FontSizeExtension } from "@/extensions/font-size";
  25 | // import { LineHeightExtension } from "@/extensions/line-height";
  26 | // import { Ruler } from "./ruler";
  27 | 
  28 | // // Define the type for the Editor props
  29 | // interface EditorProps {
  30 | //   htmlContent: string | null; // Accept htmlContent as a string or null
  31 | // }
  32 | 
  33 | // export const Editor = () => {
  34 | //   const { setEditor } = useEditorStore();
  35 | //   const [content, setContent] = useState<string | null>(null);
  36 | 
  37 | //   // Load the content from localStorage or set an empty document if nothing is in localStorage
  38 | //   useEffect(() => {
  39 | //     const storedHtmlContent = localStorage.getItem("htmlContent");
  40 | 
  41 | //     if (storedHtmlContent) {
  42 | //       setContent(storedHtmlContent); // Use stored content if available
  43 | //     } else {
  44 | //       // Start with an empty document if no content is stored
  45 | //       setContent("");
  46 | //     }
  47 | //   }, []);
  48 | 
  49 | //   const editor = useEditor({
  50 | //     immediatelyRender: false,
  51 | //     onCreate({ editor }) {
  52 | //       setEditor(editor);
  53 | //     },
  54 | //     onDestroy() {
  55 | //       setEditor(null);
  56 | //     },
  57 | //     onUpdate({ editor }) {
  58 | //       setEditor(editor);
  59 | //     },
  60 | //     onSelectionUpdate({ editor }) {
  61 | //       setEditor(editor);
  62 | //     },
  63 | //     onTransaction({ editor }) {
  64 | //       setEditor(editor);
  65 | //     },
  66 | //     onFocus({ editor }) {
  67 | //       setEditor(editor);
  68 | //     },
  69 | //     onBlur({ editor }) {
  70 | //       setEditor(editor);
  71 | //     },
  72 | //     onContentError({ editor }) {
  73 | //       setEditor(editor);
  74 | //     },
  75 | //     editorProps: {
  76 | //       attributes: {
  77 | //         style: "padding-left: 56px; padding-right: 56px;",
  78 | //         class:
  79 | //           "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-10 cursor-text",
  80 | //       },
  81 | //     },
  82 | //     extensions: [
  83 | //       StarterKit,
  84 | //       LineHeightExtension,
  85 | //       FontSizeExtension,
  86 | //       TextAlign.configure({
  87 | //         types: ["heading", "paragraph"],
  88 | //       }),
  89 | //       Link.configure({
  90 | //         openOnClick: false,
  91 | //         autolink: true,
  92 | //         defaultProtocol: "https",
  93 | //       }),
  94 | //       Color,
  95 | //       Highlight.configure({
  96 | //         multicolor: true,
  97 | //       }),
  98 | //       FontFamily,
  99 | //       TextStyle,
 100 | //       Underline,
 101 | //       Image,
 102 | //       ImageResize,
 103 | //       Table,
 104 | //       TableCell,
 105 | //       TableHeader,
 106 | //       TableRow,
 107 | //       TaskItem.configure({
 108 | //         nested: true,
 109 | //       }),
 110 | //       Import.configure({
 111 | //         appId: "your-app-id",
 112 | //         token: "your-token",
 113 | //       }),
 114 | //       TaskList,
 115 | //     ],
 116 | //   });
 117 | 
 118 | //   // Handle inserting the HTML content into the editor once it's available
 119 | //   useEffect(() => {
 120 | //     if (editor && content) {
 121 | //       editor.commands.setContent(content); // Insert the HTML content into the editor
 122 | //     }
 123 | //   }, [editor, content]);
 124 | 
 125 | //   return (
 126 | //     <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
 127 | //       <Ruler />
 128 | //       <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
 129 | //         <EditorContent editor={editor} />
 130 | //       </div>
 131 | //     </div>
 132 | //   );
 133 | // };
 134 | 
 135 | // ====================combine dangerouslysetinnerhtml imagesu laka========================
 136 | 
 137 | // "use client";
 138 | 
 139 | // import { useEffect, useState } from "react";
 140 | // import { useEditor, EditorContent } from "@tiptap/react";
 141 | // import StarterKit from "@tiptap/starter-kit";
 142 | // import TaskItem from "@tiptap/extension-task-item";
 143 | // import TaskList from "@tiptap/extension-task-list";
 144 | // import Table from "@tiptap/extension-table";
 145 | // import TableCell from "@tiptap/extension-table-cell";
 146 | // import TableHeader from "@tiptap/extension-table-header";
 147 | // import TableRow from "@tiptap/extension-table-row";
 148 | // import Image from "@tiptap/extension-image";
 149 | // import TextAlign from "@tiptap/extension-text-align";
 150 | // import Link from "@tiptap/extension-link";
 151 | // import { Color } from "@tiptap/extension-color";
 152 | // import Highlight from "@tiptap/extension-highlight";
 153 | // import FontFamily from "@tiptap/extension-font-family";
 154 | // import TextStyle from "@tiptap/extension-text-style";
 155 | // import Underline from "@tiptap/extension-underline";
 156 | // import ImageResize from "tiptap-extension-resize-image";
 157 | // import { useEditorStore } from "@/store/use-editor-store";
 158 | // import { Import } from "@tiptap-pro/extension-import";
 159 | 
 160 | // import { FontSizeExtension } from "@/extensions/font-size";
 161 | // import { LineHeightExtension } from "@/extensions/line-height";
 162 | // import { Ruler } from "./ruler";
 163 | 
 164 | // // Define the type for the Editor props
 165 | // interface EditorProps {
 166 | //   htmlContent: string | null; // Accept htmlContent as a string or null
 167 | // }
 168 | 
 169 | // export const Editor = () => {
 170 | //   const { setEditor } = useEditorStore();
 171 | //   const [content, setContent] = useState<string | null>(null);
 172 | 
 173 | //   // Load the content from localStorage or set an empty document if nothing is in localStorage
 174 | //   useEffect(() => {
 175 | //     const storedHtmlContent = localStorage.getItem("htmlContent");
 176 | 
 177 | //     if (storedHtmlContent) {
 178 | //       setContent(storedHtmlContent); // Use stored content if available
 179 | //     } else {
 180 | //       // Start with an empty document if no content is stored
 181 | //       setContent("");
 182 | //     }
 183 | //   }, []);
 184 | 
 185 | //   const editor = useEditor({
 186 | //     immediatelyRender: false,
 187 | //     onCreate({ editor }) {
 188 | //       setEditor(editor);
 189 | //     },
 190 | //     onDestroy() {
 191 | //       setEditor(null);
 192 | //     },
 193 | //     onUpdate({ editor }) {
 194 | //       setEditor(editor);
 195 | //     },
 196 | //     onSelectionUpdate({ editor }) {
 197 | //       setEditor(editor);
 198 | //     },
 199 | //     onTransaction({ editor }) {
 200 | //       setEditor(editor);
 201 | //     },
 202 | //     onFocus({ editor }) {
 203 | //       setEditor(editor);
 204 | //     },
 205 | //     onBlur({ editor }) {
 206 | //       setEditor(editor);
 207 | //     },
 208 | //     onContentError({ editor }) {
 209 | //       setEditor(editor);
 210 | //     },
 211 | //     editorProps: {
 212 | //       attributes: {
 213 | //         style: "padding-left: 56px; padding-right: 56px;",
 214 | //         class:
 215 | //           "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-10 cursor-text",
 216 | //       },
 217 | //     },
 218 | //     extensions: [
 219 | //       StarterKit,
 220 | //       LineHeightExtension,
 221 | //       FontSizeExtension,
 222 | //       TextAlign.configure({
 223 | //         types: ["heading", "paragraph"],
 224 | //       }),
 225 | //       Link.configure({
 226 | //         openOnClick: false,
 227 | //         autolink: true,
 228 | //         defaultProtocol: "https",
 229 | //       }),
 230 | //       Color,
 231 | //       Highlight.configure({
 232 | //         multicolor: true,
 233 | //       }),
 234 | //       FontFamily,
 235 | //       TextStyle,
 236 | //       Underline,
 237 | //       Image,
 238 | //       ImageResize,
 239 | //       Table,
 240 | //       TableCell,
 241 | //       TableHeader,
 242 | //       TableRow,
 243 | //       TaskItem.configure({
 244 | //         nested: true,
 245 | //       }),
 246 | //       Import.configure({
 247 | //         appId: "your-app-id",
 248 | //         token: "your-token",
 249 | //       }),
 250 | //       TaskList,
 251 | //     ],
 252 | //   });
 253 | 
 254 | //   // Handle inserting the HTML content into the editor once it's available
 255 | //   useEffect(() => {
 256 | //     if (editor && content) {
 257 | //       editor.commands.setContent(content); // Insert the HTML content into the editor
 258 | //     }
 259 | //   }, [editor, content]);
 260 | 
 261 | //   return (
 262 | //     <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
 263 | //       <Ruler />
 264 | //       <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
 265 | //         <div style={{ position: "relative", width: "100%" }}
 266 | //         className="focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-10 cursor-text">
 267 | //           {/* DOCX Content Rendered for Visual Accuracy */}
 268 | //           <div
 269 | //             dangerouslySetInnerHTML={{ __html: content || "" }}
 270 | //             style={{
 271 | //               position: "absolute",
 272 | //               top: 100,
 273 | //               left: 15,
 274 | //               right: 0,
 275 | //               paddingLeft: 65,
 276 | //               paddingRight:65,
 277 | //               bottom: 0,
 278 | //               zIndex: 6,
 279 | //             }}
 280 | //           />
 281 | 
 282 | //           {/* Tiptap Editor for Editing */}
 283 | //           <div style={{ position: "relative", zIndex: -1 }}>
 284 | //             <EditorContent editor={editor} />
 285 | //           </div>
 286 | //         </div>
 287 | //       </div>
 288 | //     </div>
 289 | //   );
 290 | // };
 291 | 
 292 | // ROOM20241220_01=========================== v0.1 ============================
 293 | // Image load toubadi yaba adubu edit touba yadaba
 294 | 
 295 | // "use client";
 296 | 
 297 | // import { useEffect, useState } from "react";
 298 | // import { useEditor, EditorContent } from "@tiptap/react";
 299 | // import StarterKit from "@tiptap/starter-kit";
 300 | // import TaskItem from "@tiptap/extension-task-item";
 301 | // import TaskList from "@tiptap/extension-task-list";
 302 | // import Table from "@tiptap/extension-table";
 303 | // import TableCell from "@tiptap/extension-table-cell";
 304 | // import TableHeader from "@tiptap/extension-table-header";
 305 | // import TableRow from "@tiptap/extension-table-row";
 306 | // import Image from "@tiptap/extension-image";
 307 | // import TextAlign from "@tiptap/extension-text-align";
 308 | // import Link from "@tiptap/extension-link";
 309 | // import { Color } from "@tiptap/extension-color";
 310 | // import Highlight from "@tiptap/extension-highlight";
 311 | // import FontFamily from "@tiptap/extension-font-family";
 312 | // import TextStyle from "@tiptap/extension-text-style";
 313 | // import Underline from "@tiptap/extension-underline";
 314 | // import ImageResize from "tiptap-extension-resize-image";
 315 | // import { useEditorStore } from "@/store/use-editor-store";
 316 | // import { Import } from "@tiptap-pro/extension-import";
 317 | 
 318 | // import { FontSizeExtension } from "@/extensions/font-size";
 319 | // import { LineHeightExtension } from "@/extensions/line-height";
 320 | // import { Ruler } from "./ruler";
 321 | 
 322 | // // Define the type for the Editor props
 323 | // interface EditorProps {
 324 | //   htmlContent: string | null; // Accept htmlContent as a string or null
 325 | // }
 326 | 
 327 | // export const Editor = () => {
 328 | //   const { setEditor } = useEditorStore();
 329 | //   const [content, setContent] = useState<string | null>(null);
 330 | 
 331 | //   // Load the content from localStorage or set an empty document if nothing is in localStorage
 332 | //   useEffect(() => {
 333 | //     const storedHtmlContent = localStorage.getItem("htmlContent");
 334 | 
 335 | //     if (storedHtmlContent) {
 336 | //       setContent(storedHtmlContent); // Use stored content if available
 337 | //     } else {
 338 | //       // Start with an empty document if no content is stored
 339 | //       setContent("");
 340 | //     }
 341 | //   }, []);
 342 | 
 343 | //   const editor = useEditor({
 344 | //     immediatelyRender: false,
 345 | //     onCreate({ editor }) {
 346 | //       setEditor(editor);
 347 | //     },
 348 | //     onDestroy() {
 349 | //       setEditor(null);
 350 | //     },
 351 | //     onUpdate({ editor }) {
 352 | //       setEditor(editor);
 353 | //     },
 354 | //     onSelectionUpdate({ editor }) {
 355 | //       setEditor(editor);
 356 | //     },
 357 | //     onTransaction({ editor }) {
 358 | //       setEditor(editor);
 359 | //     },
 360 | //     onFocus({ editor }) {
 361 | //       setEditor(editor);
 362 | //     },
 363 | //     onBlur({ editor }) {
 364 | //       setEditor(editor);
 365 | //     },
 366 | //     onContentError({ editor }) {
 367 | //       setEditor(editor);
 368 | //     },
 369 | //     editorProps: {
 370 | //       attributes: {
 371 | //         style: "padding-left: 56px; padding-right: 56px;",
 372 | //         class:
 373 | //           "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-10 cursor-text",
 374 | //       },
 375 | //     },
 376 | //     extensions: [
 377 | //       StarterKit,
 378 | //       LineHeightExtension,
 379 | //       FontSizeExtension,
 380 | //       TextAlign.configure({
 381 | //         types: ["heading", "paragraph"],
 382 | //       }),
 383 | //       Link.configure({
 384 | //         openOnClick: false,
 385 | //         autolink: true,
 386 | //         defaultProtocol: "https",
 387 | //       }),
 388 | //       Color,
 389 | //       Highlight.configure({
 390 | //         multicolor: true,
 391 | //       }),
 392 | //       FontFamily,
 393 | //       TextStyle,
 394 | //       Underline,
 395 | //       Image,
 396 | //       ImageResize,
 397 | //       Table,
 398 | //       TableCell,
 399 | //       TableHeader,
 400 | //       TableRow,
 401 | //       TaskItem.configure({
 402 | //         nested: true,
 403 | //       }),
 404 | //       Import.configure({
 405 | //         appId: "your-app-id",
 406 | //         token: "your-token",
 407 | //       }),
 408 | //       TaskList,
 409 | //     ],
 410 | //   });
 411 | 
 412 | //   // Insert the content into the editor once it's available
 413 | //   useEffect(() => {
 414 | //     if (editor && content) {
 415 | //       editor.commands.setContent(content); // Insert the HTML content into the editor
 416 | //     }
 417 | //   }, [editor, content]);
 418 | 
 419 | //   return (
 420 | //     <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
 421 | //       <Ruler />
 422 | //       <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
 423 | //         <div style={{ position: "relative", width: "95%" }}
 424 | //           className="focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-10 cursor-text">
 425 |           
 426 | //           {/* Render HTML content first for visual accuracy */}
 427 | //           <div
 428 | //             dangerouslySetInnerHTML={{ __html: content || "" }}
 429 | //             style={{
 430 | //               position: "absolute",
 431 | //               top: 100,
 432 | //               left: 15,
 433 | //               right: 0,
 434 | //               paddingLeft: 65,
 435 | //               paddingRight: 65,
 436 | //               bottom: 0,
 437 | //               zIndex: 0,
 438 | //             }}
 439 | //           />
 440 | 
 441 | //           {/* Tiptap Editor for Editing */}
 442 | //           <div style={{ position: "relative", zIndex: -1 }}>
 443 | //             <EditorContent editor={editor} />
 444 | //           </div>
 445 | //         </div>
 446 | //       </div>
 447 | //     </div>
 448 | //   );
 449 | // };
 450 | 
 451 | // Room_20241223_01=========================================================================================
 452 | // backend V2 impaliment touba
 453 | 
 454 | "use client";
 455 | 
 456 | import { useEffect, useState } from "react";
 457 | import { useEditor, EditorContent } from "@tiptap/react";
 458 | import StarterKit from "@tiptap/starter-kit";
 459 | import TaskItem from "@tiptap/extension-task-item";
 460 | import TaskList from "@tiptap/extension-task-list";
 461 | import Table from "@tiptap/extension-table";
 462 | import TableCell from "@tiptap/extension-table-cell";
 463 | import TableHeader from "@tiptap/extension-table-header";
 464 | import TableRow from "@tiptap/extension-table-row";
 465 | import Image from "@tiptap/extension-image";
 466 | import TextAlign from "@tiptap/extension-text-align";
 467 | import Link from "@tiptap/extension-link";
 468 | import { Color } from "@tiptap/extension-color";
 469 | import Highlight from "@tiptap/extension-highlight";
 470 | import FontFamily from "@tiptap/extension-font-family";
 471 | import TextStyle from "@tiptap/extension-text-style";
 472 | import Underline from "@tiptap/extension-underline";
 473 | import ImageResize from "tiptap-extension-resize-image";
 474 | import { useEditorStore } from "@/store/use-editor-store";
 475 | import { Import } from "@tiptap-pro/extension-import";
 476 | 
 477 | import { FontSizeExtension } from "@/extensions/font-size";
 478 | import { LineHeightExtension } from "@/extensions/line-height";
 479 | import { Ruler } from "./ruler";
 480 | 
 481 | // Define the type for the Editor props
 482 | interface EditorProps {
 483 |   htmlContent: string | null; // Accept htmlContent as a string or null
 484 | }
 485 | 
 486 | export const Editor = () => {
 487 |   const { setEditor } = useEditorStore();
 488 |   const [content, setContent] = useState<string | null>(null);
 489 | 
 490 |   // Load the content from localStorage or set an empty document if nothing is in localStorage
 491 |   useEffect(() => {
 492 |     const storedHtmlContent = localStorage.getItem("htmlContent");
 493 | 
 494 |     if (storedHtmlContent) {
 495 |       setContent(storedHtmlContent); // Use stored content if available
 496 |     } else {
 497 |       // Start with an empty document if no content is stored
 498 |       setContent("");
 499 |     }
 500 |   }, []);
 501 | 
 502 |   const editor = useEditor({
 503 |     immediatelyRender: false,
 504 |     onCreate({ editor }) {
 505 |       setEditor(editor);
 506 |     },
 507 |     onDestroy() {
 508 |       setEditor(null);
 509 |     },
 510 |     onUpdate({ editor }) {
 511 |       setEditor(editor);
 512 |     },
 513 |     onSelectionUpdate({ editor }) {
 514 |       setEditor(editor);
 515 |     },
 516 |     onTransaction({ editor }) {
 517 |       setEditor(editor);
 518 |     },
 519 |     onFocus({ editor }) {
 520 |       setEditor(editor);
 521 |     },
 522 |     onBlur({ editor }) {
 523 |       setEditor(editor);
 524 |     },
 525 |     onContentError({ editor }) {
 526 |       setEditor(editor);
 527 |     },
 528 |     editorProps: {
 529 |       attributes: {
 530 |         style: "padding-left: 56px; padding-right: 56px;",
 531 |         class:
 532 |           "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-10 cursor-text",
 533 |       },
 534 |     },
 535 |     extensions: [
 536 |       StarterKit,
 537 |       LineHeightExtension,
 538 |       FontSizeExtension,
 539 |       TextAlign.configure({
 540 |         types: ["heading", "paragraph"],
 541 |       }),
 542 |       Link.configure({
 543 |         openOnClick: false,
 544 |         autolink: true,
 545 |         defaultProtocol: "https",
 546 |       }),
 547 |       Color,
 548 |       Highlight.configure({
 549 |         multicolor: true,
 550 |       }),
 551 |       FontFamily,
 552 |       TextStyle,
 553 |       Underline,
 554 |       Image,
 555 |       ImageResize,
 556 |       Table,
 557 |       TableCell,
 558 |       TableHeader,
 559 |       TableRow,
 560 |       TaskItem.configure({
 561 |         nested: true,
 562 |       }),
 563 |       Import.configure({
 564 |         appId: "your-app-id",
 565 |         token: "your-token",
 566 |       }),
 567 |       TaskList,
 568 |     ],
 569 |   });
 570 | 
 571 |   // Handle inserting the HTML content into the editor once it's available
 572 |   useEffect(() => {
 573 |     if (editor && content) {
 574 |       editor.commands.setContent(content); // Insert the HTML content into the editor
 575 |     }
 576 |   }, [editor, content]);
 577 | 
 578 |   return (
 579 |     <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
 580 |       <Ruler />
 581 |       <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
 582 |         <EditorContent editor={editor} />
 583 |       </div>
 584 |     </div>
 585 |   );
 586 | };
 587 | 
 588 | 

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/documents/[documentId]/document-input.tsx`:

```tsx
   1 | // import { BsCloudCheck } from "react-icons/bs";
   2 | 
   3 | // export const DocumentInput = () => {
   4 | //   return (
   5 | //     <div className="flex items-center gap-2">
   6 | //       <span className="text-lg px-1.5 cursor-pointer truncate">
   7 | //         Untitled Document
   8 | //       </span>
   9 | //       <BsCloudCheck />
  10 | //     </div>
  11 | //   );
  12 | // };
  13 | 
  14 | // Room20241216_01================================================
  15 | // Document Title change touba yadre
  16 | 
  17 | import { BsCloudCheck } from "react-icons/bs";
  18 | import { useState } from "react";
  19 | 
  20 | export const DocumentInput = ({ initialTitle = "Untitled Document" }) => {
  21 |   const [title, setTitle] = useState(initialTitle);
  22 |   const [isSaved, setIsSaved] = useState(true); // Initially saved
  23 | 
  24 |   const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  25 |     setTitle(e.target.value);
  26 |     setIsSaved(false); // Mark as unsaved
  27 |   };
  28 | 
  29 |   return (
  30 |     <div className="flex items-center gap-2">
  31 |       <input
  32 |         type="text"
  33 |         value={title}
  34 |         onChange={handleTitleChange}
  35 |         className="text-lg px-0.1 cursor-pointer truncate bg-transparent border-none outline-none"
  36 |         title="Document title"
  37 |         aria-label="Document title"
  38 |       />
  39 |       {isSaved ? (
  40 |         <BsCloudCheck className="text-green-500" title="Saved" />
  41 |       ) : (
  42 |         <BsCloudCheck className="text-gray-500" title="Unsaved" />
  43 |       )}
  44 |     </div>
  45 |   );
  46 | };

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/documents/[documentId]/page.tsx`:

```tsx
   1 | import { Editor } from "./editor";
   2 | import { Navbar } from "./navbar";
   3 | import { ToolBar } from "./toolbar";
   4 | 
   5 | interface DocumentIdPageProps {
   6 |   params: Promise<{ documentId: string }>;
   7 | }
   8 | 
   9 | const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  10 |   const { documentId } = await params;
  11 |   return (
  12 |     <div className="min-h-screen bg-[#FAFBFD] ">
  13 |       <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
  14 |         <Navbar />
  15 |         <ToolBar />
  16 |       </div>
  17 |       <div className="pt-[114px] print:pt-0">
  18 |         <Editor />
  19 |       </div>
  20 |     </div>
  21 |   );
  22 | };
  23 | 
  24 | export default DocumentIdPage;

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/app/documents/page.tsx`:

```tsx
   1 | const DocumentPage = () => {
   2 |     return ( 
   3 |         <div>
   4 |             Documents Page
   5 |         </div>
   6 |      );
   7 | }
   8 |  
   9 | export default DocumentPage;

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/constants/templates.tsx`:

```tsx
   1 | export const templates = [
   2 |   {
   3 |     id: "upload",
   4 |     label: "Upload A Document",
   5 |     imageUrl: "/upload.svg",
   6 |   },
   7 |   {
   8 |     id: "blank",
   9 |     label: "Blank Document",
  10 |     imageUrl: "/blank-document.svg",
  11 |   },
  12 | ];

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/extensions/line-height.ts`:

```ts
   1 | import { Extension, getAttributes } from "@tiptap/react";
   2 | import { types } from "util";
   3 | 
   4 | declare module "@tiptap/core" {
   5 |   interface Commands<ReturnType> {
   6 |     LineHeight: {
   7 |       setLineHeight: (LineHeight: string) => ReturnType;
   8 |       unsetLineHeight: () => ReturnType;
   9 |     };
  10 |   }
  11 | }
  12 | 
  13 | export const LineHeightExtension = Extension.create({
  14 |   name: "lineHeight",
  15 |   addOptions() {
  16 |     return {
  17 |       types: ["paragraph", "heading"],
  18 |       defaultLineHeight: "normal",
  19 |     };
  20 |   },
  21 |   addGlobalAttributes() {
  22 |     return [
  23 |       {
  24 |         types: this.options.types,
  25 |         attributes: {
  26 |           lineHeight: {
  27 |             default: this.options.defaultLineHeight,
  28 |             renderHTML: (attributes) => {
  29 |               if (!attributes.lineHeight) return {};
  30 |               return {
  31 |                 style: `line-height: ${attributes.lineHeight}`,
  32 |               };
  33 |             },
  34 |             parseHTML: (element) => {
  35 |               return element.style.lineHeight || this.options.defaultLineHeight;
  36 |             },
  37 |           },
  38 |         },
  39 |       },
  40 |     ];
  41 |   },
  42 |   addCommands() {
  43 |     return {
  44 |       setLineHeight:
  45 |         (lineHeight: string) =>
  46 |         ({ tr, state, dispatch }) => {
  47 |           const { selection } = state;
  48 |           tr = tr.setSelection(selection);
  49 | 
  50 |           const { from, to } = selection;
  51 |           state.doc.nodesBetween(from, to, (node, pos) => {
  52 |             if (this.options.types.includes(node.type.name)) {
  53 |               tr = tr.setNodeMarkup(pos, undefined, {
  54 |                 ...node.attrs,
  55 |                 lineHeight,
  56 |               });
  57 |             }
  58 |           });
  59 | 
  60 |           if (dispatch) dispatch(tr);
  61 |           return true;
  62 |         },
  63 |       unsetLineHeight:
  64 |         () =>
  65 |         ({ tr, state, dispatch }) => {
  66 |           const { selection } = state;
  67 |           tr = tr.setSelection(selection);
  68 | 
  69 |           const { from, to } = selection;
  70 |           state.doc.nodesBetween(from, to, (node, pos) => {
  71 |             if (this.options.types.includes(node.type.name)) {
  72 |               tr = tr.setNodeMarkup(pos, undefined, {
  73 |                 ...node.attrs,
  74 |                 lineHeight: this.options.defaultLineHeight,
  75 |               });
  76 |             }
  77 |           });
  78 |           if (dispatch) dispatch(tr);
  79 |           return true;
  80 |         },
  81 |     };
  82 |   },
  83 | });

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/extensions/font-size.ts`:

```ts
   1 | import { Extension } from "@tiptap/react";
   2 | import "@tiptap/extension-text-style";
   3 | 
   4 | declare module "@tiptap/core" {
   5 |   interface Commands<ReturnType> {
   6 |     fontSize: {
   7 |       setFontSize: (size: string) => ReturnType;
   8 |       unsetFontSize: () => ReturnType;
   9 |     };
  10 |   }
  11 | }
  12 | 
  13 | export const FontSizeExtension = Extension.create({
  14 |   name: "fontSize",
  15 | 
  16 |   // Define the types you want to use in addOptions.
  17 |   addOptions() {
  18 |     return {
  19 |       types: ["textStyle"], // directly define the types here
  20 |     };
  21 |   },
  22 | 
  23 |   addGlobalAttributes() {
  24 |     return [
  25 |       {
  26 |         types: this.options.types, // Now, it should work since options is available here
  27 |         attributes: {
  28 |           fontSize: {
  29 |             default: null,
  30 |             parseHTML: (element) => element.style.fontSize,
  31 |             renderHTML: (attributes) => {
  32 |               if (!attributes.fontSize) {
  33 |                 return {};
  34 |               }
  35 | 
  36 |               // Fix the string interpolation issue
  37 |               return {
  38 |                 style: `font-size: ${attributes.fontSize}`, // Use backticks for interpolation
  39 |               };
  40 |             },
  41 |           },
  42 |         },
  43 |       },
  44 |     ];
  45 |   },
  46 | 
  47 |   addCommands() {
  48 |     return {
  49 |       setFontSize:
  50 |         (fontSize: string) =>
  51 |         ({ chain }) => {
  52 |           return chain().setMark("textStyle", { fontSize }).run();
  53 |         },
  54 | 
  55 |       unsetFontSize:
  56 |         () =>
  57 |         ({ chain }) => {
  58 |           return chain()
  59 |             .setMark("textStyle", { fontSize: null })
  60 |             .removeEmptyTextStyle()
  61 |             .run();
  62 |         },
  63 |     };
  64 |   },
  65 | });

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/aspect-ratio.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
   4 | 
   5 | const AspectRatio = AspectRatioPrimitive.Root
   6 | 
   7 | export { AspectRatio }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/alert-dialog.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | import { buttonVariants } from "@/components/ui/button"
   8 | 
   9 | const AlertDialog = AlertDialogPrimitive.Root
  10 | 
  11 | const AlertDialogTrigger = AlertDialogPrimitive.Trigger
  12 | 
  13 | const AlertDialogPortal = AlertDialogPrimitive.Portal
  14 | 
  15 | const AlertDialogOverlay = React.forwardRef<
  16 |   React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  17 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
  18 | >(({ className, ...props }, ref) => (
  19 |   <AlertDialogPrimitive.Overlay
  20 |     className={cn(
  21 |       "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  22 |       className
  23 |     )}
  24 |     {...props}
  25 |     ref={ref}
  26 |   />
  27 | ))
  28 | AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName
  29 | 
  30 | const AlertDialogContent = React.forwardRef<
  31 |   React.ElementRef<typeof AlertDialogPrimitive.Content>,
  32 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
  33 | >(({ className, ...props }, ref) => (
  34 |   <AlertDialogPortal>
  35 |     <AlertDialogOverlay />
  36 |     <AlertDialogPrimitive.Content
  37 |       ref={ref}
  38 |       className={cn(
  39 |         "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  40 |         className
  41 |       )}
  42 |       {...props}
  43 |     />
  44 |   </AlertDialogPortal>
  45 | ))
  46 | AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName
  47 | 
  48 | const AlertDialogHeader = ({
  49 |   className,
  50 |   ...props
  51 | }: React.HTMLAttributes<HTMLDivElement>) => (
  52 |   <div
  53 |     className={cn(
  54 |       "flex flex-col space-y-2 text-center sm:text-left",
  55 |       className
  56 |     )}
  57 |     {...props}
  58 |   />
  59 | )
  60 | AlertDialogHeader.displayName = "AlertDialogHeader"
  61 | 
  62 | const AlertDialogFooter = ({
  63 |   className,
  64 |   ...props
  65 | }: React.HTMLAttributes<HTMLDivElement>) => (
  66 |   <div
  67 |     className={cn(
  68 |       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
  69 |       className
  70 |     )}
  71 |     {...props}
  72 |   />
  73 | )
  74 | AlertDialogFooter.displayName = "AlertDialogFooter"
  75 | 
  76 | const AlertDialogTitle = React.forwardRef<
  77 |   React.ElementRef<typeof AlertDialogPrimitive.Title>,
  78 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
  79 | >(({ className, ...props }, ref) => (
  80 |   <AlertDialogPrimitive.Title
  81 |     ref={ref}
  82 |     className={cn("text-lg font-semibold", className)}
  83 |     {...props}
  84 |   />
  85 | ))
  86 | AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName
  87 | 
  88 | const AlertDialogDescription = React.forwardRef<
  89 |   React.ElementRef<typeof AlertDialogPrimitive.Description>,
  90 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
  91 | >(({ className, ...props }, ref) => (
  92 |   <AlertDialogPrimitive.Description
  93 |     ref={ref}
  94 |     className={cn("text-sm text-muted-foreground", className)}
  95 |     {...props}
  96 |   />
  97 | ))
  98 | AlertDialogDescription.displayName =
  99 |   AlertDialogPrimitive.Description.displayName
 100 | 
 101 | const AlertDialogAction = React.forwardRef<
 102 |   React.ElementRef<typeof AlertDialogPrimitive.Action>,
 103 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
 104 | >(({ className, ...props }, ref) => (
 105 |   <AlertDialogPrimitive.Action
 106 |     ref={ref}
 107 |     className={cn(buttonVariants(), className)}
 108 |     {...props}
 109 |   />
 110 | ))
 111 | AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName
 112 | 
 113 | const AlertDialogCancel = React.forwardRef<
 114 |   React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
 115 |   React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
 116 | >(({ className, ...props }, ref) => (
 117 |   <AlertDialogPrimitive.Cancel
 118 |     ref={ref}
 119 |     className={cn(
 120 |       buttonVariants({ variant: "outline" }),
 121 |       "mt-2 sm:mt-0",
 122 |       className
 123 |     )}
 124 |     {...props}
 125 |   />
 126 | ))
 127 | AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName
 128 | 
 129 | export {
 130 |   AlertDialog,
 131 |   AlertDialogPortal,
 132 |   AlertDialogOverlay,
 133 |   AlertDialogTrigger,
 134 |   AlertDialogContent,
 135 |   AlertDialogHeader,
 136 |   AlertDialogFooter,
 137 |   AlertDialogTitle,
 138 |   AlertDialogDescription,
 139 |   AlertDialogAction,
 140 |   AlertDialogCancel,
 141 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/pagination.tsx`:

```tsx
   1 | import * as React from "react"
   2 | import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
   3 | 
   4 | import { cn } from "@/lib/utils"
   5 | import { ButtonProps, buttonVariants } from "@/components/ui/button"
   6 | 
   7 | const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
   8 |   <nav
   9 |     role="navigation"
  10 |     aria-label="pagination"
  11 |     className={cn("mx-auto flex w-full justify-center", className)}
  12 |     {...props}
  13 |   />
  14 | )
  15 | Pagination.displayName = "Pagination"
  16 | 
  17 | const PaginationContent = React.forwardRef<
  18 |   HTMLUListElement,
  19 |   React.ComponentProps<"ul">
  20 | >(({ className, ...props }, ref) => (
  21 |   <ul
  22 |     ref={ref}
  23 |     className={cn("flex flex-row items-center gap-1", className)}
  24 |     {...props}
  25 |   />
  26 | ))
  27 | PaginationContent.displayName = "PaginationContent"
  28 | 
  29 | const PaginationItem = React.forwardRef<
  30 |   HTMLLIElement,
  31 |   React.ComponentProps<"li">
  32 | >(({ className, ...props }, ref) => (
  33 |   <li ref={ref} className={cn("", className)} {...props} />
  34 | ))
  35 | PaginationItem.displayName = "PaginationItem"
  36 | 
  37 | type PaginationLinkProps = {
  38 |   isActive?: boolean
  39 | } & Pick<ButtonProps, "size"> &
  40 |   React.ComponentProps<"a">
  41 | 
  42 | const PaginationLink = ({
  43 |   className,
  44 |   isActive,
  45 |   size = "icon",
  46 |   ...props
  47 | }: PaginationLinkProps) => (
  48 |   <a
  49 |     aria-current={isActive ? "page" : undefined}
  50 |     className={cn(
  51 |       buttonVariants({
  52 |         variant: isActive ? "outline" : "ghost",
  53 |         size,
  54 |       }),
  55 |       className
  56 |     )}
  57 |     {...props}
  58 |   />
  59 | )
  60 | PaginationLink.displayName = "PaginationLink"
  61 | 
  62 | const PaginationPrevious = ({
  63 |   className,
  64 |   ...props
  65 | }: React.ComponentProps<typeof PaginationLink>) => (
  66 |   <PaginationLink
  67 |     aria-label="Go to previous page"
  68 |     size="default"
  69 |     className={cn("gap-1 pl-2.5", className)}
  70 |     {...props}
  71 |   >
  72 |     <ChevronLeft className="h-4 w-4" />
  73 |     <span>Previous</span>
  74 |   </PaginationLink>
  75 | )
  76 | PaginationPrevious.displayName = "PaginationPrevious"
  77 | 
  78 | const PaginationNext = ({
  79 |   className,
  80 |   ...props
  81 | }: React.ComponentProps<typeof PaginationLink>) => (
  82 |   <PaginationLink
  83 |     aria-label="Go to next page"
  84 |     size="default"
  85 |     className={cn("gap-1 pr-2.5", className)}
  86 |     {...props}
  87 |   >
  88 |     <span>Next</span>
  89 |     <ChevronRight className="h-4 w-4" />
  90 |   </PaginationLink>
  91 | )
  92 | PaginationNext.displayName = "PaginationNext"
  93 | 
  94 | const PaginationEllipsis = ({
  95 |   className,
  96 |   ...props
  97 | }: React.ComponentProps<"span">) => (
  98 |   <span
  99 |     aria-hidden
 100 |     className={cn("flex h-9 w-9 items-center justify-center", className)}
 101 |     {...props}
 102 |   >
 103 |     <MoreHorizontal className="h-4 w-4" />
 104 |     <span className="sr-only">More pages</span>
 105 |   </span>
 106 | )
 107 | PaginationEllipsis.displayName = "PaginationEllipsis"
 108 | 
 109 | export {
 110 |   Pagination,
 111 |   PaginationContent,
 112 |   PaginationLink,
 113 |   PaginationItem,
 114 |   PaginationPrevious,
 115 |   PaginationNext,
 116 |   PaginationEllipsis,
 117 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/tabs.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as TabsPrimitive from "@radix-ui/react-tabs"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | 
   8 | const Tabs = TabsPrimitive.Root
   9 | 
  10 | const TabsList = React.forwardRef<
  11 |   React.ElementRef<typeof TabsPrimitive.List>,
  12 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
  13 | >(({ className, ...props }, ref) => (
  14 |   <TabsPrimitive.List
  15 |     ref={ref}
  16 |     className={cn(
  17 |       "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
  18 |       className
  19 |     )}
  20 |     {...props}
  21 |   />
  22 | ))
  23 | TabsList.displayName = TabsPrimitive.List.displayName
  24 | 
  25 | const TabsTrigger = React.forwardRef<
  26 |   React.ElementRef<typeof TabsPrimitive.Trigger>,
  27 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
  28 | >(({ className, ...props }, ref) => (
  29 |   <TabsPrimitive.Trigger
  30 |     ref={ref}
  31 |     className={cn(
  32 |       "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
  33 |       className
  34 |     )}
  35 |     {...props}
  36 |   />
  37 | ))
  38 | TabsTrigger.displayName = TabsPrimitive.Trigger.displayName
  39 | 
  40 | const TabsContent = React.forwardRef<
  41 |   React.ElementRef<typeof TabsPrimitive.Content>,
  42 |   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
  43 | >(({ className, ...props }, ref) => (
  44 |   <TabsPrimitive.Content
  45 |     ref={ref}
  46 |     className={cn(
  47 |       "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  48 |       className
  49 |     )}
  50 |     {...props}
  51 |   />
  52 | ))
  53 | TabsContent.displayName = TabsPrimitive.Content.displayName
  54 | 
  55 | export { Tabs, TabsList, TabsTrigger, TabsContent }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/card.tsx`:

```tsx
   1 | import * as React from "react"
   2 | 
   3 | import { cn } from "@/lib/utils"
   4 | 
   5 | const Card = React.forwardRef<
   6 |   HTMLDivElement,
   7 |   React.HTMLAttributes<HTMLDivElement>
   8 | >(({ className, ...props }, ref) => (
   9 |   <div
  10 |     ref={ref}
  11 |     className={cn(
  12 |       "rounded-xl border bg-card text-card-foreground shadow",
  13 |       className
  14 |     )}
  15 |     {...props}
  16 |   />
  17 | ))
  18 | Card.displayName = "Card"
  19 | 
  20 | const CardHeader = React.forwardRef<
  21 |   HTMLDivElement,
  22 |   React.HTMLAttributes<HTMLDivElement>
  23 | >(({ className, ...props }, ref) => (
  24 |   <div
  25 |     ref={ref}
  26 |     className={cn("flex flex-col space-y-1.5 p-6", className)}
  27 |     {...props}
  28 |   />
  29 | ))
  30 | CardHeader.displayName = "CardHeader"
  31 | 
  32 | const CardTitle = React.forwardRef<
  33 |   HTMLDivElement,
  34 |   React.HTMLAttributes<HTMLDivElement>
  35 | >(({ className, ...props }, ref) => (
  36 |   <div
  37 |     ref={ref}
  38 |     className={cn("font-semibold leading-none tracking-tight", className)}
  39 |     {...props}
  40 |   />
  41 | ))
  42 | CardTitle.displayName = "CardTitle"
  43 | 
  44 | const CardDescription = React.forwardRef<
  45 |   HTMLDivElement,
  46 |   React.HTMLAttributes<HTMLDivElement>
  47 | >(({ className, ...props }, ref) => (
  48 |   <div
  49 |     ref={ref}
  50 |     className={cn("text-sm text-muted-foreground", className)}
  51 |     {...props}
  52 |   />
  53 | ))
  54 | CardDescription.displayName = "CardDescription"
  55 | 
  56 | const CardContent = React.forwardRef<
  57 |   HTMLDivElement,
  58 |   React.HTMLAttributes<HTMLDivElement>
  59 | >(({ className, ...props }, ref) => (
  60 |   <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  61 | ))
  62 | CardContent.displayName = "CardContent"
  63 | 
  64 | const CardFooter = React.forwardRef<
  65 |   HTMLDivElement,
  66 |   React.HTMLAttributes<HTMLDivElement>
  67 | >(({ className, ...props }, ref) => (
  68 |   <div
  69 |     ref={ref}
  70 |     className={cn("flex items-center p-6 pt-0", className)}
  71 |     {...props}
  72 |   />
  73 | ))
  74 | CardFooter.displayName = "CardFooter"
  75 | 
  76 | export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/slider.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as SliderPrimitive from "@radix-ui/react-slider"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | 
   8 | const Slider = React.forwardRef<
   9 |   React.ElementRef<typeof SliderPrimitive.Root>,
  10 |   React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
  11 | >(({ className, ...props }, ref) => (
  12 |   <SliderPrimitive.Root
  13 |     ref={ref}
  14 |     className={cn(
  15 |       "relative flex w-full touch-none select-none items-center",
  16 |       className
  17 |     )}
  18 |     {...props}
  19 |   >
  20 |     <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
  21 |       <SliderPrimitive.Range className="absolute h-full bg-primary" />
  22 |     </SliderPrimitive.Track>
  23 |     <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  24 |   </SliderPrimitive.Root>
  25 | ))
  26 | Slider.displayName = SliderPrimitive.Root.displayName
  27 | 
  28 | export { Slider }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/popover.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as PopoverPrimitive from "@radix-ui/react-popover"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | 
   8 | const Popover = PopoverPrimitive.Root
   9 | 
  10 | const PopoverTrigger = PopoverPrimitive.Trigger
  11 | 
  12 | const PopoverAnchor = PopoverPrimitive.Anchor
  13 | 
  14 | const PopoverContent = React.forwardRef<
  15 |   React.ElementRef<typeof PopoverPrimitive.Content>,
  16 |   React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
  17 | >(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  18 |   <PopoverPrimitive.Portal>
  19 |     <PopoverPrimitive.Content
  20 |       ref={ref}
  21 |       align={align}
  22 |       sideOffset={sideOffset}
  23 |       className={cn(
  24 |         "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  25 |         className
  26 |       )}
  27 |       {...props}
  28 |     />
  29 |   </PopoverPrimitive.Portal>
  30 | ))
  31 | PopoverContent.displayName = PopoverPrimitive.Content.displayName
  32 | 
  33 | export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/progress.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as ProgressPrimitive from "@radix-ui/react-progress"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | 
   8 | const Progress = React.forwardRef<
   9 |   React.ElementRef<typeof ProgressPrimitive.Root>,
  10 |   React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
  11 | >(({ className, value, ...props }, ref) => (
  12 |   <ProgressPrimitive.Root
  13 |     ref={ref}
  14 |     className={cn(
  15 |       "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
  16 |       className
  17 |     )}
  18 |     {...props}
  19 |   >
  20 |     <ProgressPrimitive.Indicator
  21 |       className="h-full w-full flex-1 bg-primary transition-all"
  22 |       style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
  23 |     />
  24 |   </ProgressPrimitive.Root>
  25 | ))
  26 | Progress.displayName = ProgressPrimitive.Root.displayName
  27 | 
  28 | export { Progress }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/toaster.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import { useToast } from "@/hooks/use-toast"
   4 | import {
   5 |   Toast,
   6 |   ToastClose,
   7 |   ToastDescription,
   8 |   ToastProvider,
   9 |   ToastTitle,
  10 |   ToastViewport,
  11 | } from "@/components/ui/toast"
  12 | 
  13 | export function Toaster() {
  14 |   const { toasts } = useToast()
  15 | 
  16 |   return (
  17 |     <ToastProvider>
  18 |       {toasts.map(function ({ id, title, description, action, ...props }) {
  19 |         return (
  20 |           <Toast key={id} {...props}>
  21 |             <div className="grid gap-1">
  22 |               {title && <ToastTitle>{title}</ToastTitle>}
  23 |               {description && (
  24 |                 <ToastDescription>{description}</ToastDescription>
  25 |               )}
  26 |             </div>
  27 |             {action}
  28 |             <ToastClose />
  29 |           </Toast>
  30 |         )
  31 |       })}
  32 |       <ToastViewport />
  33 |     </ToastProvider>
  34 |   )
  35 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/input-otp.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import { OTPInput, OTPInputContext } from "input-otp"
   5 | import { Minus } from "lucide-react"
   6 | 
   7 | import { cn } from "@/lib/utils"
   8 | 
   9 | const InputOTP = React.forwardRef<
  10 |   React.ElementRef<typeof OTPInput>,
  11 |   React.ComponentPropsWithoutRef<typeof OTPInput>
  12 | >(({ className, containerClassName, ...props }, ref) => (
  13 |   <OTPInput
  14 |     ref={ref}
  15 |     containerClassName={cn(
  16 |       "flex items-center gap-2 has-[:disabled]:opacity-50",
  17 |       containerClassName
  18 |     )}
  19 |     className={cn("disabled:cursor-not-allowed", className)}
  20 |     {...props}
  21 |   />
  22 | ))
  23 | InputOTP.displayName = "InputOTP"
  24 | 
  25 | const InputOTPGroup = React.forwardRef<
  26 |   React.ElementRef<"div">,
  27 |   React.ComponentPropsWithoutRef<"div">
  28 | >(({ className, ...props }, ref) => (
  29 |   <div ref={ref} className={cn("flex items-center", className)} {...props} />
  30 | ))
  31 | InputOTPGroup.displayName = "InputOTPGroup"
  32 | 
  33 | const InputOTPSlot = React.forwardRef<
  34 |   React.ElementRef<"div">,
  35 |   React.ComponentPropsWithoutRef<"div"> & { index: number }
  36 | >(({ index, className, ...props }, ref) => {
  37 |   const inputOTPContext = React.useContext(OTPInputContext)
  38 |   const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]
  39 | 
  40 |   return (
  41 |     <div
  42 |       ref={ref}
  43 |       className={cn(
  44 |         "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
  45 |         isActive && "z-10 ring-1 ring-ring",
  46 |         className
  47 |       )}
  48 |       {...props}
  49 |     >
  50 |       {char}
  51 |       {hasFakeCaret && (
  52 |         <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
  53 |           <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
  54 |         </div>
  55 |       )}
  56 |     </div>
  57 |   )
  58 | })
  59 | InputOTPSlot.displayName = "InputOTPSlot"
  60 | 
  61 | const InputOTPSeparator = React.forwardRef<
  62 |   React.ElementRef<"div">,
  63 |   React.ComponentPropsWithoutRef<"div">
  64 | >(({ ...props }, ref) => (
  65 |   <div ref={ref} role="separator" {...props}>
  66 |     <Minus />
  67 |   </div>
  68 | ))
  69 | InputOTPSeparator.displayName = "InputOTPSeparator"
  70 | 
  71 | export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/chart.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as RechartsPrimitive from "recharts"
   5 | import {
   6 |   NameType,
   7 |   Payload,
   8 |   ValueType,
   9 | } from "recharts/types/component/DefaultTooltipContent"
  10 | 
  11 | import { cn } from "@/lib/utils"
  12 | 
  13 | // Format: { THEME_NAME: CSS_SELECTOR }
  14 | const THEMES = { light: "", dark: ".dark" } as const
  15 | 
  16 | export type ChartConfig = {
  17 |   [k in string]: {
  18 |     label?: React.ReactNode
  19 |     icon?: React.ComponentType
  20 |   } & (
  21 |     | { color?: string; theme?: never }
  22 |     | { color?: never; theme: Record<keyof typeof THEMES, string> }
  23 |   )
  24 | }
  25 | 
  26 | type ChartContextProps = {
  27 |   config: ChartConfig
  28 | }
  29 | 
  30 | const ChartContext = React.createContext<ChartContextProps | null>(null)
  31 | 
  32 | function useChart() {
  33 |   const context = React.useContext(ChartContext)
  34 | 
  35 |   if (!context) {
  36 |     throw new Error("useChart must be used within a <ChartContainer />")
  37 |   }
  38 | 
  39 |   return context
  40 | }
  41 | 
  42 | const ChartContainer = React.forwardRef<
  43 |   HTMLDivElement,
  44 |   React.ComponentProps<"div"> & {
  45 |     config: ChartConfig
  46 |     children: React.ComponentProps<
  47 |       typeof RechartsPrimitive.ResponsiveContainer
  48 |     >["children"]
  49 |   }
  50 | >(({ id, className, children, config, ...props }, ref) => {
  51 |   const uniqueId = React.useId()
  52 |   const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`
  53 | 
  54 |   return (
  55 |     <ChartContext.Provider value={{ config }}>
  56 |       <div
  57 |         data-chart={chartId}
  58 |         ref={ref}
  59 |         className={cn(
  60 |           "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
  61 |           className
  62 |         )}
  63 |         {...props}
  64 |       >
  65 |         <ChartStyle id={chartId} config={config} />
  66 |         <RechartsPrimitive.ResponsiveContainer>
  67 |           {children}
  68 |         </RechartsPrimitive.ResponsiveContainer>
  69 |       </div>
  70 |     </ChartContext.Provider>
  71 |   )
  72 | })
  73 | ChartContainer.displayName = "Chart"
  74 | 
  75 | const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  76 |   const colorConfig = Object.entries(config).filter(
  77 |     ([_, config]) => config.theme || config.color
  78 |   )
  79 | 
  80 |   if (!colorConfig.length) {
  81 |     return null
  82 |   }
  83 | 
  84 |   return (
  85 |     <style
  86 |       dangerouslySetInnerHTML={{
  87 |         __html: Object.entries(THEMES)
  88 |           .map(
  89 |             ([theme, prefix]) => `
  90 | ${prefix} [data-chart=${id}] {
  91 | ${colorConfig
  92 |   .map(([key, itemConfig]) => {
  93 |     const color =
  94 |       itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
  95 |       itemConfig.color
  96 |     return color ? `  --color-${key}: ${color};` : null
  97 |   })
  98 |   .join("\n")}
  99 | }
 100 | `
 101 |           )
 102 |           .join("\n"),
 103 |       }}
 104 |     />
 105 |   )
 106 | }
 107 | 
 108 | const ChartTooltip = RechartsPrimitive.Tooltip
 109 | 
 110 | const ChartTooltipContent = React.forwardRef<
 111 |   HTMLDivElement,
 112 |   React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
 113 |     React.ComponentProps<"div"> & {
 114 |       hideLabel?: boolean
 115 |       hideIndicator?: boolean
 116 |       indicator?: "line" | "dot" | "dashed"
 117 |       nameKey?: string
 118 |       labelKey?: string
 119 |     }
 120 | >(
 121 |   (
 122 |     {
 123 |       active,
 124 |       payload,
 125 |       className,
 126 |       indicator = "dot",
 127 |       hideLabel = false,
 128 |       hideIndicator = false,
 129 |       label,
 130 |       labelFormatter,
 131 |       labelClassName,
 132 |       formatter,
 133 |       color,
 134 |       nameKey,
 135 |       labelKey,
 136 |     },
 137 |     ref
 138 |   ) => {
 139 |     const { config } = useChart()
 140 | 
 141 |     const tooltipLabel = React.useMemo(() => {
 142 |       if (hideLabel || !payload?.length) {
 143 |         return null
 144 |       }
 145 | 
 146 |       const [item] = payload
 147 |       const key = `${labelKey || item.dataKey || item.name || "value"}`
 148 |       const itemConfig = getPayloadConfigFromPayload(config, item, key)
 149 |       const value =
 150 |         !labelKey && typeof label === "string"
 151 |           ? config[label as keyof typeof config]?.label || label
 152 |           : itemConfig?.label
 153 | 
 154 |       if (labelFormatter) {
 155 |         return (
 156 |           <div className={cn("font-medium", labelClassName)}>
 157 |             {labelFormatter(value, payload)}
 158 |           </div>
 159 |         )
 160 |       }
 161 | 
 162 |       if (!value) {
 163 |         return null
 164 |       }
 165 | 
 166 |       return <div className={cn("font-medium", labelClassName)}>{value}</div>
 167 |     }, [
 168 |       label,
 169 |       labelFormatter,
 170 |       payload,
 171 |       hideLabel,
 172 |       labelClassName,
 173 |       config,
 174 |       labelKey,
 175 |     ])
 176 | 
 177 |     if (!active || !payload?.length) {
 178 |       return null
 179 |     }
 180 | 
 181 |     const nestLabel = payload.length === 1 && indicator !== "dot"
 182 | 
 183 |     return (
 184 |       <div
 185 |         ref={ref}
 186 |         className={cn(
 187 |           "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
 188 |           className
 189 |         )}
 190 |       >
 191 |         {!nestLabel ? tooltipLabel : null}
 192 |         <div className="grid gap-1.5">
 193 |           {payload.map((item, index) => {
 194 |             const key = `${nameKey || item.name || item.dataKey || "value"}`
 195 |             const itemConfig = getPayloadConfigFromPayload(config, item, key)
 196 |             const indicatorColor = color || item.payload.fill || item.color
 197 | 
 198 |             return (
 199 |               <div
 200 |                 key={item.dataKey}
 201 |                 className={cn(
 202 |                   "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
 203 |                   indicator === "dot" && "items-center"
 204 |                 )}
 205 |               >
 206 |                 {formatter && item?.value !== undefined && item.name ? (
 207 |                   formatter(item.value, item.name, item, index, item.payload)
 208 |                 ) : (
 209 |                   <>
 210 |                     {itemConfig?.icon ? (
 211 |                       <itemConfig.icon />
 212 |                     ) : (
 213 |                       !hideIndicator && (
 214 |                         <div
 215 |                           className={cn(
 216 |                             "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
 217 |                             {
 218 |                               "h-2.5 w-2.5": indicator === "dot",
 219 |                               "w-1": indicator === "line",
 220 |                               "w-0 border-[1.5px] border-dashed bg-transparent":
 221 |                                 indicator === "dashed",
 222 |                               "my-0.5": nestLabel && indicator === "dashed",
 223 |                             }
 224 |                           )}
 225 |                           style={
 226 |                             {
 227 |                               "--color-bg": indicatorColor,
 228 |                               "--color-border": indicatorColor,
 229 |                             } as React.CSSProperties
 230 |                           }
 231 |                         />
 232 |                       )
 233 |                     )}
 234 |                     <div
 235 |                       className={cn(
 236 |                         "flex flex-1 justify-between leading-none",
 237 |                         nestLabel ? "items-end" : "items-center"
 238 |                       )}
 239 |                     >
 240 |                       <div className="grid gap-1.5">
 241 |                         {nestLabel ? tooltipLabel : null}
 242 |                         <span className="text-muted-foreground">
 243 |                           {itemConfig?.label || item.name}
 244 |                         </span>
 245 |                       </div>
 246 |                       {item.value && (
 247 |                         <span className="font-mono font-medium tabular-nums text-foreground">
 248 |                           {item.value.toLocaleString()}
 249 |                         </span>
 250 |                       )}
 251 |                     </div>
 252 |                   </>
 253 |                 )}
 254 |               </div>
 255 |             )
 256 |           })}
 257 |         </div>
 258 |       </div>
 259 |     )
 260 |   }
 261 | )
 262 | ChartTooltipContent.displayName = "ChartTooltip"
 263 | 
 264 | const ChartLegend = RechartsPrimitive.Legend
 265 | 
 266 | const ChartLegendContent = React.forwardRef<
 267 |   HTMLDivElement,
 268 |   React.ComponentProps<"div"> &
 269 |     Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
 270 |       hideIcon?: boolean
 271 |       nameKey?: string
 272 |     }
 273 | >(
 274 |   (
 275 |     { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
 276 |     ref
 277 |   ) => {
 278 |     const { config } = useChart()
 279 | 
 280 |     if (!payload?.length) {
 281 |       return null
 282 |     }
 283 | 
 284 |     return (
 285 |       <div
 286 |         ref={ref}
 287 |         className={cn(
 288 |           "flex items-center justify-center gap-4",
 289 |           verticalAlign === "top" ? "pb-3" : "pt-3",
 290 |           className
 291 |         )}
 292 |       >
 293 |         {payload.map((item) => {
 294 |           const key = `${nameKey || item.dataKey || "value"}`
 295 |           const itemConfig = getPayloadConfigFromPayload(config, item, key)
 296 | 
 297 |           return (
 298 |             <div
 299 |               key={item.value}
 300 |               className={cn(
 301 |                 "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
 302 |               )}
 303 |             >
 304 |               {itemConfig?.icon && !hideIcon ? (
 305 |                 <itemConfig.icon />
 306 |               ) : (
 307 |                 <div
 308 |                   className="h-2 w-2 shrink-0 rounded-[2px]"
 309 |                   style={{
 310 |                     backgroundColor: item.color,
 311 |                   }}
 312 |                 />
 313 |               )}
 314 |               {itemConfig?.label}
 315 |             </div>
 316 |           )
 317 |         })}
 318 |       </div>
 319 |     )
 320 |   }
 321 | )
 322 | ChartLegendContent.displayName = "ChartLegend"
 323 | 
 324 | // Helper to extract item config from a payload.
 325 | function getPayloadConfigFromPayload(
 326 |   config: ChartConfig,
 327 |   payload: unknown,
 328 |   key: string
 329 | ) {
 330 |   if (typeof payload !== "object" || payload === null) {
 331 |     return undefined
 332 |   }
 333 | 
 334 |   const payloadPayload =
 335 |     "payload" in payload &&
 336 |     typeof payload.payload === "object" &&
 337 |     payload.payload !== null
 338 |       ? payload.payload
 339 |       : undefined
 340 | 
 341 |   let configLabelKey: string = key
 342 | 
 343 |   if (
 344 |     key in payload &&
 345 |     typeof payload[key as keyof typeof payload] === "string"
 346 |   ) {
 347 |     configLabelKey = payload[key as keyof typeof payload] as string
 348 |   } else if (
 349 |     payloadPayload &&
 350 |     key in payloadPayload &&
 351 |     typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
 352 |   ) {
 353 |     configLabelKey = payloadPayload[
 354 |       key as keyof typeof payloadPayload
 355 |     ] as string
 356 |   }
 357 | 
 358 |   return configLabelKey in config
 359 |     ? config[configLabelKey]
 360 |     : config[key as keyof typeof config]
 361 | }
 362 | 
 363 | export {
 364 |   ChartContainer,
 365 |   ChartTooltip,
 366 |   ChartTooltipContent,
 367 |   ChartLegend,
 368 |   ChartLegendContent,
 369 |   ChartStyle,
 370 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/hover-card.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | 
   8 | const HoverCard = HoverCardPrimitive.Root
   9 | 
  10 | const HoverCardTrigger = HoverCardPrimitive.Trigger
  11 | 
  12 | const HoverCardContent = React.forwardRef<
  13 |   React.ElementRef<typeof HoverCardPrimitive.Content>,
  14 |   React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
  15 | >(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  16 |   <HoverCardPrimitive.Content
  17 |     ref={ref}
  18 |     align={align}
  19 |     sideOffset={sideOffset}
  20 |     className={cn(
  21 |       "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  22 |       className
  23 |     )}
  24 |     {...props}
  25 |   />
  26 | ))
  27 | HoverCardContent.displayName = HoverCardPrimitive.Content.displayName
  28 | 
  29 | export { HoverCard, HoverCardTrigger, HoverCardContent }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/sheet.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as SheetPrimitive from "@radix-ui/react-dialog"
   5 | import { cva, type VariantProps } from "class-variance-authority"
   6 | import { X } from "lucide-react"
   7 | 
   8 | import { cn } from "@/lib/utils"
   9 | 
  10 | const Sheet = SheetPrimitive.Root
  11 | 
  12 | const SheetTrigger = SheetPrimitive.Trigger
  13 | 
  14 | const SheetClose = SheetPrimitive.Close
  15 | 
  16 | const SheetPortal = SheetPrimitive.Portal
  17 | 
  18 | const SheetOverlay = React.forwardRef<
  19 |   React.ElementRef<typeof SheetPrimitive.Overlay>,
  20 |   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
  21 | >(({ className, ...props }, ref) => (
  22 |   <SheetPrimitive.Overlay
  23 |     className={cn(
  24 |       "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  25 |       className
  26 |     )}
  27 |     {...props}
  28 |     ref={ref}
  29 |   />
  30 | ))
  31 | SheetOverlay.displayName = SheetPrimitive.Overlay.displayName
  32 | 
  33 | const sheetVariants = cva(
  34 |   "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  35 |   {
  36 |     variants: {
  37 |       side: {
  38 |         top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
  39 |         bottom:
  40 |           "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
  41 |         left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
  42 |         right:
  43 |           "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
  44 |       },
  45 |     },
  46 |     defaultVariants: {
  47 |       side: "right",
  48 |     },
  49 |   }
  50 | )
  51 | 
  52 | interface SheetContentProps
  53 |   extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
  54 |     VariantProps<typeof sheetVariants> {}
  55 | 
  56 | const SheetContent = React.forwardRef<
  57 |   React.ElementRef<typeof SheetPrimitive.Content>,
  58 |   SheetContentProps
  59 | >(({ side = "right", className, children, ...props }, ref) => (
  60 |   <SheetPortal>
  61 |     <SheetOverlay />
  62 |     <SheetPrimitive.Content
  63 |       ref={ref}
  64 |       className={cn(sheetVariants({ side }), className)}
  65 |       {...props}
  66 |     >
  67 |       <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
  68 |         <X className="h-4 w-4" />
  69 |         <span className="sr-only">Close</span>
  70 |       </SheetPrimitive.Close>
  71 |       {children}
  72 |     </SheetPrimitive.Content>
  73 |   </SheetPortal>
  74 | ))
  75 | SheetContent.displayName = SheetPrimitive.Content.displayName
  76 | 
  77 | const SheetHeader = ({
  78 |   className,
  79 |   ...props
  80 | }: React.HTMLAttributes<HTMLDivElement>) => (
  81 |   <div
  82 |     className={cn(
  83 |       "flex flex-col space-y-2 text-center sm:text-left",
  84 |       className
  85 |     )}
  86 |     {...props}
  87 |   />
  88 | )
  89 | SheetHeader.displayName = "SheetHeader"
  90 | 
  91 | const SheetFooter = ({
  92 |   className,
  93 |   ...props
  94 | }: React.HTMLAttributes<HTMLDivElement>) => (
  95 |   <div
  96 |     className={cn(
  97 |       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
  98 |       className
  99 |     )}
 100 |     {...props}
 101 |   />
 102 | )
 103 | SheetFooter.displayName = "SheetFooter"
 104 | 
 105 | const SheetTitle = React.forwardRef<
 106 |   React.ElementRef<typeof SheetPrimitive.Title>,
 107 |   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
 108 | >(({ className, ...props }, ref) => (
 109 |   <SheetPrimitive.Title
 110 |     ref={ref}
 111 |     className={cn("text-lg font-semibold text-foreground", className)}
 112 |     {...props}
 113 |   />
 114 | ))
 115 | SheetTitle.displayName = SheetPrimitive.Title.displayName
 116 | 
 117 | const SheetDescription = React.forwardRef<
 118 |   React.ElementRef<typeof SheetPrimitive.Description>,
 119 |   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
 120 | >(({ className, ...props }, ref) => (
 121 |   <SheetPrimitive.Description
 122 |     ref={ref}
 123 |     className={cn("text-sm text-muted-foreground", className)}
 124 |     {...props}
 125 |   />
 126 | ))
 127 | SheetDescription.displayName = SheetPrimitive.Description.displayName
 128 | 
 129 | export {
 130 |   Sheet,
 131 |   SheetPortal,
 132 |   SheetOverlay,
 133 |   SheetTrigger,
 134 |   SheetClose,
 135 |   SheetContent,
 136 |   SheetHeader,
 137 |   SheetFooter,
 138 |   SheetTitle,
 139 |   SheetDescription,
 140 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/scroll-area.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | 
   8 | const ScrollArea = React.forwardRef<
   9 |   React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  10 |   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
  11 | >(({ className, children, ...props }, ref) => (
  12 |   <ScrollAreaPrimitive.Root
  13 |     ref={ref}
  14 |     className={cn("relative overflow-hidden", className)}
  15 |     {...props}
  16 |   >
  17 |     <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
  18 |       {children}
  19 |     </ScrollAreaPrimitive.Viewport>
  20 |     <ScrollBar />
  21 |     <ScrollAreaPrimitive.Corner />
  22 |   </ScrollAreaPrimitive.Root>
  23 | ))
  24 | ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName
  25 | 
  26 | const ScrollBar = React.forwardRef<
  27 |   React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  28 |   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
  29 | >(({ className, orientation = "vertical", ...props }, ref) => (
  30 |   <ScrollAreaPrimitive.ScrollAreaScrollbar
  31 |     ref={ref}
  32 |     orientation={orientation}
  33 |     className={cn(
  34 |       "flex touch-none select-none transition-colors",
  35 |       orientation === "vertical" &&
  36 |         "h-full w-2.5 border-l border-l-transparent p-[1px]",
  37 |       orientation === "horizontal" &&
  38 |         "h-2.5 flex-col border-t border-t-transparent p-[1px]",
  39 |       className
  40 |     )}
  41 |     {...props}
  42 |   >
  43 |     <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  44 |   </ScrollAreaPrimitive.ScrollAreaScrollbar>
  45 | ))
  46 | ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName
  47 | 
  48 | export { ScrollArea, ScrollBar }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/resizable.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import { GripVertical } from "lucide-react"
   4 | import * as ResizablePrimitive from "react-resizable-panels"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | 
   8 | const ResizablePanelGroup = ({
   9 |   className,
  10 |   ...props
  11 | }: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  12 |   <ResizablePrimitive.PanelGroup
  13 |     className={cn(
  14 |       "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
  15 |       className
  16 |     )}
  17 |     {...props}
  18 |   />
  19 | )
  20 | 
  21 | const ResizablePanel = ResizablePrimitive.Panel
  22 | 
  23 | const ResizableHandle = ({
  24 |   withHandle,
  25 |   className,
  26 |   ...props
  27 | }: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  28 |   withHandle?: boolean
  29 | }) => (
  30 |   <ResizablePrimitive.PanelResizeHandle
  31 |     className={cn(
  32 |       "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
  33 |       className
  34 |     )}
  35 |     {...props}
  36 |   >
  37 |     {withHandle && (
  38 |       <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
  39 |         <GripVertical className="h-2.5 w-2.5" />
  40 |       </div>
  41 |     )}
  42 |   </ResizablePrimitive.PanelResizeHandle>
  43 | )
  44 | 
  45 | export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/label.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as LabelPrimitive from "@radix-ui/react-label"
   5 | import { cva, type VariantProps } from "class-variance-authority"
   6 | 
   7 | import { cn } from "@/lib/utils"
   8 | 
   9 | const labelVariants = cva(
  10 |   "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  11 | )
  12 | 
  13 | const Label = React.forwardRef<
  14 |   React.ElementRef<typeof LabelPrimitive.Root>,
  15 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  16 |     VariantProps<typeof labelVariants>
  17 | >(({ className, ...props }, ref) => (
  18 |   <LabelPrimitive.Root
  19 |     ref={ref}
  20 |     className={cn(labelVariants(), className)}
  21 |     {...props}
  22 |   />
  23 | ))
  24 | Label.displayName = LabelPrimitive.Root.displayName
  25 | 
  26 | export { Label }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/sonner.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import { useTheme } from "next-themes"
   4 | import { Toaster as Sonner } from "sonner"
   5 | 
   6 | type ToasterProps = React.ComponentProps<typeof Sonner>
   7 | 
   8 | const Toaster = ({ ...props }: ToasterProps) => {
   9 |   const { theme = "system" } = useTheme()
  10 | 
  11 |   return (
  12 |     <Sonner
  13 |       theme={theme as ToasterProps["theme"]}
  14 |       className="toaster group"
  15 |       toastOptions={{
  16 |         classNames: {
  17 |           toast:
  18 |             "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
  19 |           description: "group-[.toast]:text-muted-foreground",
  20 |           actionButton:
  21 |             "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
  22 |           cancelButton:
  23 |             "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
  24 |         },
  25 |       }}
  26 |       {...props}
  27 |     />
  28 |   )
  29 | }
  30 | 
  31 | export { Toaster }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/navigation-menu.tsx`:

```tsx
   1 | import * as React from "react"
   2 | import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
   3 | import { cva } from "class-variance-authority"
   4 | import { ChevronDown } from "lucide-react"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | 
   8 | const NavigationMenu = React.forwardRef<
   9 |   React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  10 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
  11 | >(({ className, children, ...props }, ref) => (
  12 |   <NavigationMenuPrimitive.Root
  13 |     ref={ref}
  14 |     className={cn(
  15 |       "relative z-10 flex max-w-max flex-1 items-center justify-center",
  16 |       className
  17 |     )}
  18 |     {...props}
  19 |   >
  20 |     {children}
  21 |     <NavigationMenuViewport />
  22 |   </NavigationMenuPrimitive.Root>
  23 | ))
  24 | NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName
  25 | 
  26 | const NavigationMenuList = React.forwardRef<
  27 |   React.ElementRef<typeof NavigationMenuPrimitive.List>,
  28 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
  29 | >(({ className, ...props }, ref) => (
  30 |   <NavigationMenuPrimitive.List
  31 |     ref={ref}
  32 |     className={cn(
  33 |       "group flex flex-1 list-none items-center justify-center space-x-1",
  34 |       className
  35 |     )}
  36 |     {...props}
  37 |   />
  38 | ))
  39 | NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName
  40 | 
  41 | const NavigationMenuItem = NavigationMenuPrimitive.Item
  42 | 
  43 | const navigationMenuTriggerStyle = cva(
  44 |   "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
  45 | )
  46 | 
  47 | const NavigationMenuTrigger = React.forwardRef<
  48 |   React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  49 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
  50 | >(({ className, children, ...props }, ref) => (
  51 |   <NavigationMenuPrimitive.Trigger
  52 |     ref={ref}
  53 |     className={cn(navigationMenuTriggerStyle(), "group", className)}
  54 |     {...props}
  55 |   >
  56 |     {children}{" "}
  57 |     <ChevronDown
  58 |       className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
  59 |       aria-hidden="true"
  60 |     />
  61 |   </NavigationMenuPrimitive.Trigger>
  62 | ))
  63 | NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName
  64 | 
  65 | const NavigationMenuContent = React.forwardRef<
  66 |   React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  67 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
  68 | >(({ className, ...props }, ref) => (
  69 |   <NavigationMenuPrimitive.Content
  70 |     ref={ref}
  71 |     className={cn(
  72 |       "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
  73 |       className
  74 |     )}
  75 |     {...props}
  76 |   />
  77 | ))
  78 | NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName
  79 | 
  80 | const NavigationMenuLink = NavigationMenuPrimitive.Link
  81 | 
  82 | const NavigationMenuViewport = React.forwardRef<
  83 |   React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  84 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
  85 | >(({ className, ...props }, ref) => (
  86 |   <div className={cn("absolute left-0 top-full flex justify-center")}>
  87 |     <NavigationMenuPrimitive.Viewport
  88 |       className={cn(
  89 |         "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
  90 |         className
  91 |       )}
  92 |       ref={ref}
  93 |       {...props}
  94 |     />
  95 |   </div>
  96 | ))
  97 | NavigationMenuViewport.displayName =
  98 |   NavigationMenuPrimitive.Viewport.displayName
  99 | 
 100 | const NavigationMenuIndicator = React.forwardRef<
 101 |   React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
 102 |   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
 103 | >(({ className, ...props }, ref) => (
 104 |   <NavigationMenuPrimitive.Indicator
 105 |     ref={ref}
 106 |     className={cn(
 107 |       "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
 108 |       className
 109 |     )}
 110 |     {...props}
 111 |   >
 112 |     <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
 113 |   </NavigationMenuPrimitive.Indicator>
 114 | ))
 115 | NavigationMenuIndicator.displayName =
 116 |   NavigationMenuPrimitive.Indicator.displayName
 117 | 
 118 | export {
 119 |   navigationMenuTriggerStyle,
 120 |   NavigationMenu,
 121 |   NavigationMenuList,
 122 |   NavigationMenuItem,
 123 |   NavigationMenuContent,
 124 |   NavigationMenuTrigger,
 125 |   NavigationMenuLink,
 126 |   NavigationMenuIndicator,
 127 |   NavigationMenuViewport,
 128 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/accordion.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as AccordionPrimitive from "@radix-ui/react-accordion"
   5 | import { ChevronDown } from "lucide-react"
   6 | 
   7 | import { cn } from "@/lib/utils"
   8 | 
   9 | const Accordion = AccordionPrimitive.Root
  10 | 
  11 | const AccordionItem = React.forwardRef<
  12 |   React.ElementRef<typeof AccordionPrimitive.Item>,
  13 |   React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
  14 | >(({ className, ...props }, ref) => (
  15 |   <AccordionPrimitive.Item
  16 |     ref={ref}
  17 |     className={cn("border-b", className)}
  18 |     {...props}
  19 |   />
  20 | ))
  21 | AccordionItem.displayName = "AccordionItem"
  22 | 
  23 | const AccordionTrigger = React.forwardRef<
  24 |   React.ElementRef<typeof AccordionPrimitive.Trigger>,
  25 |   React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
  26 | >(({ className, children, ...props }, ref) => (
  27 |   <AccordionPrimitive.Header className="flex">
  28 |     <AccordionPrimitive.Trigger
  29 |       ref={ref}
  30 |       className={cn(
  31 |         "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
  32 |         className
  33 |       )}
  34 |       {...props}
  35 |     >
  36 |       {children}
  37 |       <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
  38 |     </AccordionPrimitive.Trigger>
  39 |   </AccordionPrimitive.Header>
  40 | ))
  41 | AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName
  42 | 
  43 | const AccordionContent = React.forwardRef<
  44 |   React.ElementRef<typeof AccordionPrimitive.Content>,
  45 |   React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
  46 | >(({ className, children, ...props }, ref) => (
  47 |   <AccordionPrimitive.Content
  48 |     ref={ref}
  49 |     className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
  50 |     {...props}
  51 |   >
  52 |     <div className={cn("pb-4 pt-0", className)}>{children}</div>
  53 |   </AccordionPrimitive.Content>
  54 | ))
  55 | AccordionContent.displayName = AccordionPrimitive.Content.displayName
  56 | 
  57 | export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/drawer.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import { Drawer as DrawerPrimitive } from "vaul"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | 
   8 | const Drawer = ({
   9 |   shouldScaleBackground = true,
  10 |   ...props
  11 | }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  12 |   <DrawerPrimitive.Root
  13 |     shouldScaleBackground={shouldScaleBackground}
  14 |     {...props}
  15 |   />
  16 | )
  17 | Drawer.displayName = "Drawer"
  18 | 
  19 | const DrawerTrigger = DrawerPrimitive.Trigger
  20 | 
  21 | const DrawerPortal = DrawerPrimitive.Portal
  22 | 
  23 | const DrawerClose = DrawerPrimitive.Close
  24 | 
  25 | const DrawerOverlay = React.forwardRef<
  26 |   React.ElementRef<typeof DrawerPrimitive.Overlay>,
  27 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
  28 | >(({ className, ...props }, ref) => (
  29 |   <DrawerPrimitive.Overlay
  30 |     ref={ref}
  31 |     className={cn("fixed inset-0 z-50 bg-black/80", className)}
  32 |     {...props}
  33 |   />
  34 | ))
  35 | DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName
  36 | 
  37 | const DrawerContent = React.forwardRef<
  38 |   React.ElementRef<typeof DrawerPrimitive.Content>,
  39 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
  40 | >(({ className, children, ...props }, ref) => (
  41 |   <DrawerPortal>
  42 |     <DrawerOverlay />
  43 |     <DrawerPrimitive.Content
  44 |       ref={ref}
  45 |       className={cn(
  46 |         "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
  47 |         className
  48 |       )}
  49 |       {...props}
  50 |     >
  51 |       <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
  52 |       {children}
  53 |     </DrawerPrimitive.Content>
  54 |   </DrawerPortal>
  55 | ))
  56 | DrawerContent.displayName = "DrawerContent"
  57 | 
  58 | const DrawerHeader = ({
  59 |   className,
  60 |   ...props
  61 | }: React.HTMLAttributes<HTMLDivElement>) => (
  62 |   <div
  63 |     className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
  64 |     {...props}
  65 |   />
  66 | )
  67 | DrawerHeader.displayName = "DrawerHeader"
  68 | 
  69 | const DrawerFooter = ({
  70 |   className,
  71 |   ...props
  72 | }: React.HTMLAttributes<HTMLDivElement>) => (
  73 |   <div
  74 |     className={cn("mt-auto flex flex-col gap-2 p-4", className)}
  75 |     {...props}
  76 |   />
  77 | )
  78 | DrawerFooter.displayName = "DrawerFooter"
  79 | 
  80 | const DrawerTitle = React.forwardRef<
  81 |   React.ElementRef<typeof DrawerPrimitive.Title>,
  82 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
  83 | >(({ className, ...props }, ref) => (
  84 |   <DrawerPrimitive.Title
  85 |     ref={ref}
  86 |     className={cn(
  87 |       "text-lg font-semibold leading-none tracking-tight",
  88 |       className
  89 |     )}
  90 |     {...props}
  91 |   />
  92 | ))
  93 | DrawerTitle.displayName = DrawerPrimitive.Title.displayName
  94 | 
  95 | const DrawerDescription = React.forwardRef<
  96 |   React.ElementRef<typeof DrawerPrimitive.Description>,
  97 |   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
  98 | >(({ className, ...props }, ref) => (
  99 |   <DrawerPrimitive.Description
 100 |     ref={ref}
 101 |     className={cn("text-sm text-muted-foreground", className)}
 102 |     {...props}
 103 |   />
 104 | ))
 105 | DrawerDescription.displayName = DrawerPrimitive.Description.displayName
 106 | 
 107 | export {
 108 |   Drawer,
 109 |   DrawerPortal,
 110 |   DrawerOverlay,
 111 |   DrawerTrigger,
 112 |   DrawerClose,
 113 |   DrawerContent,
 114 |   DrawerHeader,
 115 |   DrawerFooter,
 116 |   DrawerTitle,
 117 |   DrawerDescription,
 118 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/tooltip.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as TooltipPrimitive from "@radix-ui/react-tooltip"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | 
   8 | const TooltipProvider = TooltipPrimitive.Provider
   9 | 
  10 | const Tooltip = TooltipPrimitive.Root
  11 | 
  12 | const TooltipTrigger = TooltipPrimitive.Trigger
  13 | 
  14 | const TooltipContent = React.forwardRef<
  15 |   React.ElementRef<typeof TooltipPrimitive.Content>,
  16 |   React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
  17 | >(({ className, sideOffset = 4, ...props }, ref) => (
  18 |   <TooltipPrimitive.Portal>
  19 |     <TooltipPrimitive.Content
  20 |       ref={ref}
  21 |       sideOffset={sideOffset}
  22 |       className={cn(
  23 |         "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  24 |         className
  25 |       )}
  26 |       {...props}
  27 |     />
  28 |   </TooltipPrimitive.Portal>
  29 | ))
  30 | TooltipContent.displayName = TooltipPrimitive.Content.displayName
  31 | 
  32 | export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/alert.tsx`:

```tsx
   1 | import * as React from "react"
   2 | import { cva, type VariantProps } from "class-variance-authority"
   3 | 
   4 | import { cn } from "@/lib/utils"
   5 | 
   6 | const alertVariants = cva(
   7 |   "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
   8 |   {
   9 |     variants: {
  10 |       variant: {
  11 |         default: "bg-background text-foreground",
  12 |         destructive:
  13 |           "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
  14 |       },
  15 |     },
  16 |     defaultVariants: {
  17 |       variant: "default",
  18 |     },
  19 |   }
  20 | )
  21 | 
  22 | const Alert = React.forwardRef<
  23 |   HTMLDivElement,
  24 |   React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
  25 | >(({ className, variant, ...props }, ref) => (
  26 |   <div
  27 |     ref={ref}
  28 |     role="alert"
  29 |     className={cn(alertVariants({ variant }), className)}
  30 |     {...props}
  31 |   />
  32 | ))
  33 | Alert.displayName = "Alert"
  34 | 
  35 | const AlertTitle = React.forwardRef<
  36 |   HTMLParagraphElement,
  37 |   React.HTMLAttributes<HTMLHeadingElement>
  38 | >(({ className, ...props }, ref) => (
  39 |   <h5
  40 |     ref={ref}
  41 |     className={cn("mb-1 font-medium leading-none tracking-tight", className)}
  42 |     {...props}
  43 |   />
  44 | ))
  45 | AlertTitle.displayName = "AlertTitle"
  46 | 
  47 | const AlertDescription = React.forwardRef<
  48 |   HTMLParagraphElement,
  49 |   React.HTMLAttributes<HTMLParagraphElement>
  50 | >(({ className, ...props }, ref) => (
  51 |   <div
  52 |     ref={ref}
  53 |     className={cn("text-sm [&_p]:leading-relaxed", className)}
  54 |     {...props}
  55 |   />
  56 | ))
  57 | AlertDescription.displayName = "AlertDescription"
  58 | 
  59 | export { Alert, AlertTitle, AlertDescription }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/switch.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as SwitchPrimitives from "@radix-ui/react-switch"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | 
   8 | const Switch = React.forwardRef<
   9 |   React.ElementRef<typeof SwitchPrimitives.Root>,
  10 |   React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
  11 | >(({ className, ...props }, ref) => (
  12 |   <SwitchPrimitives.Root
  13 |     className={cn(
  14 |       "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  15 |       className
  16 |     )}
  17 |     {...props}
  18 |     ref={ref}
  19 |   >
  20 |     <SwitchPrimitives.Thumb
  21 |       className={cn(
  22 |         "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
  23 |       )}
  24 |     />
  25 |   </SwitchPrimitives.Root>
  26 | ))
  27 | Switch.displayName = SwitchPrimitives.Root.displayName
  28 | 
  29 | export { Switch }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/calendar.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import { ChevronLeft, ChevronRight } from "lucide-react"
   5 | import { DayPicker } from "react-day-picker"
   6 | 
   7 | import { cn } from "@/lib/utils"
   8 | import { buttonVariants } from "@/components/ui/button"
   9 | 
  10 | export type CalendarProps = React.ComponentProps<typeof DayPicker>
  11 | 
  12 | function Calendar({
  13 |   className,
  14 |   classNames,
  15 |   showOutsideDays = true,
  16 |   ...props
  17 | }: CalendarProps) {
  18 |   return (
  19 |     <DayPicker
  20 |       showOutsideDays={showOutsideDays}
  21 |       className={cn("p-3", className)}
  22 |       classNames={{
  23 |         months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
  24 |         month: "space-y-4",
  25 |         caption: "flex justify-center pt-1 relative items-center",
  26 |         caption_label: "text-sm font-medium",
  27 |         nav: "space-x-1 flex items-center",
  28 |         nav_button: cn(
  29 |           buttonVariants({ variant: "outline" }),
  30 |           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
  31 |         ),
  32 |         nav_button_previous: "absolute left-1",
  33 |         nav_button_next: "absolute right-1",
  34 |         table: "w-full border-collapse space-y-1",
  35 |         head_row: "flex",
  36 |         head_cell:
  37 |           "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
  38 |         row: "flex w-full mt-2",
  39 |         cell: cn(
  40 |           "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
  41 |           props.mode === "range"
  42 |             ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
  43 |             : "[&:has([aria-selected])]:rounded-md"
  44 |         ),
  45 |         day: cn(
  46 |           buttonVariants({ variant: "ghost" }),
  47 |           "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
  48 |         ),
  49 |         day_range_start: "day-range-start",
  50 |         day_range_end: "day-range-end",
  51 |         day_selected:
  52 |           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
  53 |         day_today: "bg-accent text-accent-foreground",
  54 |         day_outside:
  55 |           "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
  56 |         day_disabled: "text-muted-foreground opacity-50",
  57 |         day_range_middle:
  58 |           "aria-selected:bg-accent aria-selected:text-accent-foreground",
  59 |         day_hidden: "invisible",
  60 |         ...classNames,
  61 |       }}
  62 |       components={{
  63 |         IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
  64 |         IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
  65 |       }}
  66 |       {...props}
  67 |     />
  68 |   )
  69 | }
  70 | Calendar.displayName = "Calendar"
  71 | 
  72 | export { Calendar }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/breadcrumb.tsx`:

```tsx
   1 | import * as React from "react"
   2 | import { Slot } from "@radix-ui/react-slot"
   3 | import { ChevronRight, MoreHorizontal } from "lucide-react"
   4 | 
   5 | import { cn } from "@/lib/utils"
   6 | 
   7 | const Breadcrumb = React.forwardRef<
   8 |   HTMLElement,
   9 |   React.ComponentPropsWithoutRef<"nav"> & {
  10 |     separator?: React.ReactNode
  11 |   }
  12 | >(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
  13 | Breadcrumb.displayName = "Breadcrumb"
  14 | 
  15 | const BreadcrumbList = React.forwardRef<
  16 |   HTMLOListElement,
  17 |   React.ComponentPropsWithoutRef<"ol">
  18 | >(({ className, ...props }, ref) => (
  19 |   <ol
  20 |     ref={ref}
  21 |     className={cn(
  22 |       "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
  23 |       className
  24 |     )}
  25 |     {...props}
  26 |   />
  27 | ))
  28 | BreadcrumbList.displayName = "BreadcrumbList"
  29 | 
  30 | const BreadcrumbItem = React.forwardRef<
  31 |   HTMLLIElement,
  32 |   React.ComponentPropsWithoutRef<"li">
  33 | >(({ className, ...props }, ref) => (
  34 |   <li
  35 |     ref={ref}
  36 |     className={cn("inline-flex items-center gap-1.5", className)}
  37 |     {...props}
  38 |   />
  39 | ))
  40 | BreadcrumbItem.displayName = "BreadcrumbItem"
  41 | 
  42 | const BreadcrumbLink = React.forwardRef<
  43 |   HTMLAnchorElement,
  44 |   React.ComponentPropsWithoutRef<"a"> & {
  45 |     asChild?: boolean
  46 |   }
  47 | >(({ asChild, className, ...props }, ref) => {
  48 |   const Comp = asChild ? Slot : "a"
  49 | 
  50 |   return (
  51 |     <Comp
  52 |       ref={ref}
  53 |       className={cn("transition-colors hover:text-foreground", className)}
  54 |       {...props}
  55 |     />
  56 |   )
  57 | })
  58 | BreadcrumbLink.displayName = "BreadcrumbLink"
  59 | 
  60 | const BreadcrumbPage = React.forwardRef<
  61 |   HTMLSpanElement,
  62 |   React.ComponentPropsWithoutRef<"span">
  63 | >(({ className, ...props }, ref) => (
  64 |   <span
  65 |     ref={ref}
  66 |     role="link"
  67 |     aria-disabled="true"
  68 |     aria-current="page"
  69 |     className={cn("font-normal text-foreground", className)}
  70 |     {...props}
  71 |   />
  72 | ))
  73 | BreadcrumbPage.displayName = "BreadcrumbPage"
  74 | 
  75 | const BreadcrumbSeparator = ({
  76 |   children,
  77 |   className,
  78 |   ...props
  79 | }: React.ComponentProps<"li">) => (
  80 |   <li
  81 |     role="presentation"
  82 |     aria-hidden="true"
  83 |     className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
  84 |     {...props}
  85 |   >
  86 |     {children ?? <ChevronRight />}
  87 |   </li>
  88 | )
  89 | BreadcrumbSeparator.displayName = "BreadcrumbSeparator"
  90 | 
  91 | const BreadcrumbEllipsis = ({
  92 |   className,
  93 |   ...props
  94 | }: React.ComponentProps<"span">) => (
  95 |   <span
  96 |     role="presentation"
  97 |     aria-hidden="true"
  98 |     className={cn("flex h-9 w-9 items-center justify-center", className)}
  99 |     {...props}
 100 |   >
 101 |     <MoreHorizontal className="h-4 w-4" />
 102 |     <span className="sr-only">More</span>
 103 |   </span>
 104 | )
 105 | BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"
 106 | 
 107 | export {
 108 |   Breadcrumb,
 109 |   BreadcrumbList,
 110 |   BreadcrumbItem,
 111 |   BreadcrumbLink,
 112 |   BreadcrumbPage,
 113 |   BreadcrumbSeparator,
 114 |   BreadcrumbEllipsis,
 115 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/radio-group.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
   5 | import { Circle } from "lucide-react"
   6 | 
   7 | import { cn } from "@/lib/utils"
   8 | 
   9 | const RadioGroup = React.forwardRef<
  10 |   React.ElementRef<typeof RadioGroupPrimitive.Root>,
  11 |   React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
  12 | >(({ className, ...props }, ref) => {
  13 |   return (
  14 |     <RadioGroupPrimitive.Root
  15 |       className={cn("grid gap-2", className)}
  16 |       {...props}
  17 |       ref={ref}
  18 |     />
  19 |   )
  20 | })
  21 | RadioGroup.displayName = RadioGroupPrimitive.Root.displayName
  22 | 
  23 | const RadioGroupItem = React.forwardRef<
  24 |   React.ElementRef<typeof RadioGroupPrimitive.Item>,
  25 |   React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
  26 | >(({ className, ...props }, ref) => {
  27 |   return (
  28 |     <RadioGroupPrimitive.Item
  29 |       ref={ref}
  30 |       className={cn(
  31 |         "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  32 |         className
  33 |       )}
  34 |       {...props}
  35 |     >
  36 |       <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
  37 |         <Circle className="h-3.5 w-3.5 fill-primary" />
  38 |       </RadioGroupPrimitive.Indicator>
  39 |     </RadioGroupPrimitive.Item>
  40 |   )
  41 | })
  42 | RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName
  43 | 
  44 | export { RadioGroup, RadioGroupItem }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/command.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import { type DialogProps } from "@radix-ui/react-dialog"
   5 | import { Command as CommandPrimitive } from "cmdk"
   6 | import { Search } from "lucide-react"
   7 | 
   8 | import { cn } from "@/lib/utils"
   9 | import { Dialog, DialogContent } from "@/components/ui/dialog"
  10 | 
  11 | const Command = React.forwardRef<
  12 |   React.ElementRef<typeof CommandPrimitive>,
  13 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive>
  14 | >(({ className, ...props }, ref) => (
  15 |   <CommandPrimitive
  16 |     ref={ref}
  17 |     className={cn(
  18 |       "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
  19 |       className
  20 |     )}
  21 |     {...props}
  22 |   />
  23 | ))
  24 | Command.displayName = CommandPrimitive.displayName
  25 | 
  26 | const CommandDialog = ({ children, ...props }: DialogProps) => {
  27 |   return (
  28 |     <Dialog {...props}>
  29 |       <DialogContent className="overflow-hidden p-0">
  30 |         <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
  31 |           {children}
  32 |         </Command>
  33 |       </DialogContent>
  34 |     </Dialog>
  35 |   )
  36 | }
  37 | 
  38 | const CommandInput = React.forwardRef<
  39 |   React.ElementRef<typeof CommandPrimitive.Input>,
  40 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
  41 | >(({ className, ...props }, ref) => (
  42 |   <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
  43 |     <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
  44 |     <CommandPrimitive.Input
  45 |       ref={ref}
  46 |       className={cn(
  47 |         "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  48 |         className
  49 |       )}
  50 |       {...props}
  51 |     />
  52 |   </div>
  53 | ))
  54 | 
  55 | CommandInput.displayName = CommandPrimitive.Input.displayName
  56 | 
  57 | const CommandList = React.forwardRef<
  58 |   React.ElementRef<typeof CommandPrimitive.List>,
  59 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
  60 | >(({ className, ...props }, ref) => (
  61 |   <CommandPrimitive.List
  62 |     ref={ref}
  63 |     className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
  64 |     {...props}
  65 |   />
  66 | ))
  67 | 
  68 | CommandList.displayName = CommandPrimitive.List.displayName
  69 | 
  70 | const CommandEmpty = React.forwardRef<
  71 |   React.ElementRef<typeof CommandPrimitive.Empty>,
  72 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
  73 | >((props, ref) => (
  74 |   <CommandPrimitive.Empty
  75 |     ref={ref}
  76 |     className="py-6 text-center text-sm"
  77 |     {...props}
  78 |   />
  79 | ))
  80 | 
  81 | CommandEmpty.displayName = CommandPrimitive.Empty.displayName
  82 | 
  83 | const CommandGroup = React.forwardRef<
  84 |   React.ElementRef<typeof CommandPrimitive.Group>,
  85 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
  86 | >(({ className, ...props }, ref) => (
  87 |   <CommandPrimitive.Group
  88 |     ref={ref}
  89 |     className={cn(
  90 |       "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
  91 |       className
  92 |     )}
  93 |     {...props}
  94 |   />
  95 | ))
  96 | 
  97 | CommandGroup.displayName = CommandPrimitive.Group.displayName
  98 | 
  99 | const CommandSeparator = React.forwardRef<
 100 |   React.ElementRef<typeof CommandPrimitive.Separator>,
 101 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
 102 | >(({ className, ...props }, ref) => (
 103 |   <CommandPrimitive.Separator
 104 |     ref={ref}
 105 |     className={cn("-mx-1 h-px bg-border", className)}
 106 |     {...props}
 107 |   />
 108 | ))
 109 | CommandSeparator.displayName = CommandPrimitive.Separator.displayName
 110 | 
 111 | const CommandItem = React.forwardRef<
 112 |   React.ElementRef<typeof CommandPrimitive.Item>,
 113 |   React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
 114 | >(({ className, ...props }, ref) => (
 115 |   <CommandPrimitive.Item
 116 |     ref={ref}
 117 |     className={cn(
 118 |       "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
 119 |       className
 120 |     )}
 121 |     {...props}
 122 |   />
 123 | ))
 124 | 
 125 | CommandItem.displayName = CommandPrimitive.Item.displayName
 126 | 
 127 | const CommandShortcut = ({
 128 |   className,
 129 |   ...props
 130 | }: React.HTMLAttributes<HTMLSpanElement>) => {
 131 |   return (
 132 |     <span
 133 |       className={cn(
 134 |         "ml-auto text-xs tracking-widest text-muted-foreground",
 135 |         className
 136 |       )}
 137 |       {...props}
 138 |     />
 139 |   )
 140 | }
 141 | CommandShortcut.displayName = "CommandShortcut"
 142 | 
 143 | export {
 144 |   Command,
 145 |   CommandDialog,
 146 |   CommandInput,
 147 |   CommandList,
 148 |   CommandEmpty,
 149 |   CommandGroup,
 150 |   CommandItem,
 151 |   CommandShortcut,
 152 |   CommandSeparator,
 153 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/toggle-group.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
   5 | import { type VariantProps } from "class-variance-authority"
   6 | 
   7 | import { cn } from "@/lib/utils"
   8 | import { toggleVariants } from "@/components/ui/toggle"
   9 | 
  10 | const ToggleGroupContext = React.createContext<
  11 |   VariantProps<typeof toggleVariants>
  12 | >({
  13 |   size: "default",
  14 |   variant: "default",
  15 | })
  16 | 
  17 | const ToggleGroup = React.forwardRef<
  18 |   React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  19 |   React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  20 |     VariantProps<typeof toggleVariants>
  21 | >(({ className, variant, size, children, ...props }, ref) => (
  22 |   <ToggleGroupPrimitive.Root
  23 |     ref={ref}
  24 |     className={cn("flex items-center justify-center gap-1", className)}
  25 |     {...props}
  26 |   >
  27 |     <ToggleGroupContext.Provider value={{ variant, size }}>
  28 |       {children}
  29 |     </ToggleGroupContext.Provider>
  30 |   </ToggleGroupPrimitive.Root>
  31 | ))
  32 | 
  33 | ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName
  34 | 
  35 | const ToggleGroupItem = React.forwardRef<
  36 |   React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  37 |   React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  38 |     VariantProps<typeof toggleVariants>
  39 | >(({ className, children, variant, size, ...props }, ref) => {
  40 |   const context = React.useContext(ToggleGroupContext)
  41 | 
  42 |   return (
  43 |     <ToggleGroupPrimitive.Item
  44 |       ref={ref}
  45 |       className={cn(
  46 |         toggleVariants({
  47 |           variant: context.variant || variant,
  48 |           size: context.size || size,
  49 |         }),
  50 |         className
  51 |       )}
  52 |       {...props}
  53 |     >
  54 |       {children}
  55 |     </ToggleGroupPrimitive.Item>
  56 |   )
  57 | })
  58 | 
  59 | ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName
  60 | 
  61 | export { ToggleGroup, ToggleGroupItem }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/avatar.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as AvatarPrimitive from "@radix-ui/react-avatar"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | 
   8 | const Avatar = React.forwardRef<
   9 |   React.ElementRef<typeof AvatarPrimitive.Root>,
  10 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
  11 | >(({ className, ...props }, ref) => (
  12 |   <AvatarPrimitive.Root
  13 |     ref={ref}
  14 |     className={cn(
  15 |       "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
  16 |       className
  17 |     )}
  18 |     {...props}
  19 |   />
  20 | ))
  21 | Avatar.displayName = AvatarPrimitive.Root.displayName
  22 | 
  23 | const AvatarImage = React.forwardRef<
  24 |   React.ElementRef<typeof AvatarPrimitive.Image>,
  25 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
  26 | >(({ className, ...props }, ref) => (
  27 |   <AvatarPrimitive.Image
  28 |     ref={ref}
  29 |     className={cn("aspect-square h-full w-full", className)}
  30 |     {...props}
  31 |   />
  32 | ))
  33 | AvatarImage.displayName = AvatarPrimitive.Image.displayName
  34 | 
  35 | const AvatarFallback = React.forwardRef<
  36 |   React.ElementRef<typeof AvatarPrimitive.Fallback>,
  37 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
  38 | >(({ className, ...props }, ref) => (
  39 |   <AvatarPrimitive.Fallback
  40 |     ref={ref}
  41 |     className={cn(
  42 |       "flex h-full w-full items-center justify-center rounded-full bg-muted",
  43 |       className
  44 |     )}
  45 |     {...props}
  46 |   />
  47 | ))
  48 | AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName
  49 | 
  50 | export { Avatar, AvatarImage, AvatarFallback }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/menubar.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as MenubarPrimitive from "@radix-ui/react-menubar"
   5 | import { Check, ChevronRight, Circle } from "lucide-react"
   6 | 
   7 | import { cn } from "@/lib/utils"
   8 | 
   9 | const MenubarMenu = MenubarPrimitive.Menu
  10 | 
  11 | const MenubarGroup = MenubarPrimitive.Group
  12 | 
  13 | const MenubarPortal = MenubarPrimitive.Portal
  14 | 
  15 | const MenubarSub = MenubarPrimitive.Sub
  16 | 
  17 | const MenubarRadioGroup = MenubarPrimitive.RadioGroup
  18 | 
  19 | const Menubar = React.forwardRef<
  20 |   React.ElementRef<typeof MenubarPrimitive.Root>,
  21 |   React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
  22 | >(({ className, ...props }, ref) => (
  23 |   <MenubarPrimitive.Root
  24 |     ref={ref}
  25 |     className={cn(
  26 |       "flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
  27 |       className
  28 |     )}
  29 |     {...props}
  30 |   />
  31 | ))
  32 | Menubar.displayName = MenubarPrimitive.Root.displayName
  33 | 
  34 | const MenubarTrigger = React.forwardRef<
  35 |   React.ElementRef<typeof MenubarPrimitive.Trigger>,
  36 |   React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
  37 | >(({ className, ...props }, ref) => (
  38 |   <MenubarPrimitive.Trigger
  39 |     ref={ref}
  40 |     className={cn(
  41 |       "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
  42 |       className
  43 |     )}
  44 |     {...props}
  45 |   />
  46 | ))
  47 | MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName
  48 | 
  49 | const MenubarSubTrigger = React.forwardRef<
  50 |   React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  51 |   React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
  52 |     inset?: boolean
  53 |   }
  54 | >(({ className, inset, children, ...props }, ref) => (
  55 |   <MenubarPrimitive.SubTrigger
  56 |     ref={ref}
  57 |     className={cn(
  58 |       "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
  59 |       inset && "pl-8",
  60 |       className
  61 |     )}
  62 |     {...props}
  63 |   >
  64 |     {children}
  65 |     <ChevronRight className="ml-auto h-4 w-4" />
  66 |   </MenubarPrimitive.SubTrigger>
  67 | ))
  68 | MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName
  69 | 
  70 | const MenubarSubContent = React.forwardRef<
  71 |   React.ElementRef<typeof MenubarPrimitive.SubContent>,
  72 |   React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
  73 | >(({ className, ...props }, ref) => (
  74 |   <MenubarPrimitive.SubContent
  75 |     ref={ref}
  76 |     className={cn(
  77 |       "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  78 |       className
  79 |     )}
  80 |     {...props}
  81 |   />
  82 | ))
  83 | MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName
  84 | 
  85 | const MenubarContent = React.forwardRef<
  86 |   React.ElementRef<typeof MenubarPrimitive.Content>,
  87 |   React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
  88 | >(
  89 |   (
  90 |     { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
  91 |     ref
  92 |   ) => (
  93 |     <MenubarPrimitive.Portal>
  94 |       <MenubarPrimitive.Content
  95 |         ref={ref}
  96 |         align={align}
  97 |         alignOffset={alignOffset}
  98 |         sideOffset={sideOffset}
  99 |         className={cn(
 100 |           "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
 101 |           className
 102 |         )}
 103 |         {...props}
 104 |       />
 105 |     </MenubarPrimitive.Portal>
 106 |   )
 107 | )
 108 | MenubarContent.displayName = MenubarPrimitive.Content.displayName
 109 | 
 110 | const MenubarItem = React.forwardRef<
 111 |   React.ElementRef<typeof MenubarPrimitive.Item>,
 112 |   React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
 113 |     inset?: boolean
 114 |   }
 115 | >(({ className, inset, ...props }, ref) => (
 116 |   <MenubarPrimitive.Item
 117 |     ref={ref}
 118 |     className={cn(
 119 |       "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
 120 |       inset && "pl-8",
 121 |       className
 122 |     )}
 123 |     {...props}
 124 |   />
 125 | ))
 126 | MenubarItem.displayName = MenubarPrimitive.Item.displayName
 127 | 
 128 | const MenubarCheckboxItem = React.forwardRef<
 129 |   React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
 130 |   React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
 131 | >(({ className, children, checked, ...props }, ref) => (
 132 |   <MenubarPrimitive.CheckboxItem
 133 |     ref={ref}
 134 |     className={cn(
 135 |       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
 136 |       className
 137 |     )}
 138 |     checked={checked}
 139 |     {...props}
 140 |   >
 141 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
 142 |       <MenubarPrimitive.ItemIndicator>
 143 |         <Check className="h-4 w-4" />
 144 |       </MenubarPrimitive.ItemIndicator>
 145 |     </span>
 146 |     {children}
 147 |   </MenubarPrimitive.CheckboxItem>
 148 | ))
 149 | MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName
 150 | 
 151 | const MenubarRadioItem = React.forwardRef<
 152 |   React.ElementRef<typeof MenubarPrimitive.RadioItem>,
 153 |   React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
 154 | >(({ className, children, ...props }, ref) => (
 155 |   <MenubarPrimitive.RadioItem
 156 |     ref={ref}
 157 |     className={cn(
 158 |       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
 159 |       className
 160 |     )}
 161 |     {...props}
 162 |   >
 163 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
 164 |       <MenubarPrimitive.ItemIndicator>
 165 |         <Circle className="h-4 w-4 fill-current" />
 166 |       </MenubarPrimitive.ItemIndicator>
 167 |     </span>
 168 |     {children}
 169 |   </MenubarPrimitive.RadioItem>
 170 | ))
 171 | MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName
 172 | 
 173 | const MenubarLabel = React.forwardRef<
 174 |   React.ElementRef<typeof MenubarPrimitive.Label>,
 175 |   React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
 176 |     inset?: boolean
 177 |   }
 178 | >(({ className, inset, ...props }, ref) => (
 179 |   <MenubarPrimitive.Label
 180 |     ref={ref}
 181 |     className={cn(
 182 |       "px-2 py-1.5 text-sm font-semibold",
 183 |       inset && "pl-8",
 184 |       className
 185 |     )}
 186 |     {...props}
 187 |   />
 188 | ))
 189 | MenubarLabel.displayName = MenubarPrimitive.Label.displayName
 190 | 
 191 | const MenubarSeparator = React.forwardRef<
 192 |   React.ElementRef<typeof MenubarPrimitive.Separator>,
 193 |   React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
 194 | >(({ className, ...props }, ref) => (
 195 |   <MenubarPrimitive.Separator
 196 |     ref={ref}
 197 |     className={cn("-mx-1 my-1 h-px bg-muted", className)}
 198 |     {...props}
 199 |   />
 200 | ))
 201 | MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName
 202 | 
 203 | const MenubarShortcut = ({
 204 |   className,
 205 |   ...props
 206 | }: React.HTMLAttributes<HTMLSpanElement>) => {
 207 |   return (
 208 |     <span
 209 |       className={cn(
 210 |         "ml-auto text-xs tracking-widest text-muted-foreground",
 211 |         className
 212 |       )}
 213 |       {...props}
 214 |     />
 215 |   )
 216 | }
 217 | MenubarShortcut.displayname = "MenubarShortcut"
 218 | 
 219 | export {
 220 |   Menubar,
 221 |   MenubarMenu,
 222 |   MenubarTrigger,
 223 |   MenubarContent,
 224 |   MenubarItem,
 225 |   MenubarSeparator,
 226 |   MenubarLabel,
 227 |   MenubarCheckboxItem,
 228 |   MenubarRadioGroup,
 229 |   MenubarRadioItem,
 230 |   MenubarPortal,
 231 |   MenubarSubContent,
 232 |   MenubarSubTrigger,
 233 |   MenubarGroup,
 234 |   MenubarSub,
 235 |   MenubarShortcut,
 236 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/dialog.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as DialogPrimitive from "@radix-ui/react-dialog"
   5 | import { X } from "lucide-react"
   6 | 
   7 | import { cn } from "@/lib/utils"
   8 | 
   9 | const Dialog = DialogPrimitive.Root
  10 | 
  11 | const DialogTrigger = DialogPrimitive.Trigger
  12 | 
  13 | const DialogPortal = DialogPrimitive.Portal
  14 | 
  15 | const DialogClose = DialogPrimitive.Close
  16 | 
  17 | const DialogOverlay = React.forwardRef<
  18 |   React.ElementRef<typeof DialogPrimitive.Overlay>,
  19 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
  20 | >(({ className, ...props }, ref) => (
  21 |   <DialogPrimitive.Overlay
  22 |     ref={ref}
  23 |     className={cn(
  24 |       "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  25 |       className
  26 |     )}
  27 |     {...props}
  28 |   />
  29 | ))
  30 | DialogOverlay.displayName = DialogPrimitive.Overlay.displayName
  31 | 
  32 | const DialogContent = React.forwardRef<
  33 |   React.ElementRef<typeof DialogPrimitive.Content>,
  34 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
  35 | >(({ className, children, ...props }, ref) => (
  36 |   <DialogPortal>
  37 |     <DialogOverlay />
  38 |     <DialogPrimitive.Content
  39 |       ref={ref}
  40 |       className={cn(
  41 |         "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  42 |         className
  43 |       )}
  44 |       {...props}
  45 |     >
  46 |       {children}
  47 |       <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
  48 |         <X className="h-4 w-4" />
  49 |         <span className="sr-only">Close</span>
  50 |       </DialogPrimitive.Close>
  51 |     </DialogPrimitive.Content>
  52 |   </DialogPortal>
  53 | ))
  54 | DialogContent.displayName = DialogPrimitive.Content.displayName
  55 | 
  56 | const DialogHeader = ({
  57 |   className,
  58 |   ...props
  59 | }: React.HTMLAttributes<HTMLDivElement>) => (
  60 |   <div
  61 |     className={cn(
  62 |       "flex flex-col space-y-1.5 text-center sm:text-left",
  63 |       className
  64 |     )}
  65 |     {...props}
  66 |   />
  67 | )
  68 | DialogHeader.displayName = "DialogHeader"
  69 | 
  70 | const DialogFooter = ({
  71 |   className,
  72 |   ...props
  73 | }: React.HTMLAttributes<HTMLDivElement>) => (
  74 |   <div
  75 |     className={cn(
  76 |       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
  77 |       className
  78 |     )}
  79 |     {...props}
  80 |   />
  81 | )
  82 | DialogFooter.displayName = "DialogFooter"
  83 | 
  84 | const DialogTitle = React.forwardRef<
  85 |   React.ElementRef<typeof DialogPrimitive.Title>,
  86 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
  87 | >(({ className, ...props }, ref) => (
  88 |   <DialogPrimitive.Title
  89 |     ref={ref}
  90 |     className={cn(
  91 |       "text-lg font-semibold leading-none tracking-tight",
  92 |       className
  93 |     )}
  94 |     {...props}
  95 |   />
  96 | ))
  97 | DialogTitle.displayName = DialogPrimitive.Title.displayName
  98 | 
  99 | const DialogDescription = React.forwardRef<
 100 |   React.ElementRef<typeof DialogPrimitive.Description>,
 101 |   React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
 102 | >(({ className, ...props }, ref) => (
 103 |   <DialogPrimitive.Description
 104 |     ref={ref}
 105 |     className={cn("text-sm text-muted-foreground", className)}
 106 |     {...props}
 107 |   />
 108 | ))
 109 | DialogDescription.displayName = DialogPrimitive.Description.displayName
 110 | 
 111 | export {
 112 |   Dialog,
 113 |   DialogPortal,
 114 |   DialogOverlay,
 115 |   DialogTrigger,
 116 |   DialogClose,
 117 |   DialogContent,
 118 |   DialogHeader,
 119 |   DialogFooter,
 120 |   DialogTitle,
 121 |   DialogDescription,
 122 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/badge.tsx`:

```tsx
   1 | import * as React from "react"
   2 | import { cva, type VariantProps } from "class-variance-authority"
   3 | 
   4 | import { cn } from "@/lib/utils"
   5 | 
   6 | const badgeVariants = cva(
   7 |   "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
   8 |   {
   9 |     variants: {
  10 |       variant: {
  11 |         default:
  12 |           "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
  13 |         secondary:
  14 |           "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  15 |         destructive:
  16 |           "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
  17 |         outline: "text-foreground",
  18 |       },
  19 |     },
  20 |     defaultVariants: {
  21 |       variant: "default",
  22 |     },
  23 |   }
  24 | )
  25 | 
  26 | export interface BadgeProps
  27 |   extends React.HTMLAttributes<HTMLDivElement>,
  28 |     VariantProps<typeof badgeVariants> {}
  29 | 
  30 | function Badge({ className, variant, ...props }: BadgeProps) {
  31 |   return (
  32 |     <div className={cn(badgeVariants({ variant }), className)} {...props} />
  33 |   )
  34 | }
  35 | 
  36 | export { Badge, badgeVariants }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/sidebar.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import { Slot } from "@radix-ui/react-slot"
   5 | import { VariantProps, cva } from "class-variance-authority"
   6 | import { PanelLeft } from "lucide-react"
   7 | 
   8 | import { useIsMobile } from "@/hooks/use-mobile"
   9 | import { cn } from "@/lib/utils"
  10 | import { Button } from "@/components/ui/button"
  11 | import { Input } from "@/components/ui/input"
  12 | import { Separator } from "@/components/ui/separator"
  13 | import { Sheet, SheetContent } from "@/components/ui/sheet"
  14 | import { Skeleton } from "@/components/ui/skeleton"
  15 | import {
  16 |   Tooltip,
  17 |   TooltipContent,
  18 |   TooltipProvider,
  19 |   TooltipTrigger,
  20 | } from "@/components/ui/tooltip"
  21 | 
  22 | const SIDEBAR_COOKIE_NAME = "sidebar:state"
  23 | const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
  24 | const SIDEBAR_WIDTH = "16rem"
  25 | const SIDEBAR_WIDTH_MOBILE = "18rem"
  26 | const SIDEBAR_WIDTH_ICON = "3rem"
  27 | const SIDEBAR_KEYBOARD_SHORTCUT = "b"
  28 | 
  29 | type SidebarContext = {
  30 |   state: "expanded" | "collapsed"
  31 |   open: boolean
  32 |   setOpen: (open: boolean) => void
  33 |   openMobile: boolean
  34 |   setOpenMobile: (open: boolean) => void
  35 |   isMobile: boolean
  36 |   toggleSidebar: () => void
  37 | }
  38 | 
  39 | const SidebarContext = React.createContext<SidebarContext | null>(null)
  40 | 
  41 | function useSidebar() {
  42 |   const context = React.useContext(SidebarContext)
  43 |   if (!context) {
  44 |     throw new Error("useSidebar must be used within a SidebarProvider.")
  45 |   }
  46 | 
  47 |   return context
  48 | }
  49 | 
  50 | const SidebarProvider = React.forwardRef<
  51 |   HTMLDivElement,
  52 |   React.ComponentProps<"div"> & {
  53 |     defaultOpen?: boolean
  54 |     open?: boolean
  55 |     onOpenChange?: (open: boolean) => void
  56 |   }
  57 | >(
  58 |   (
  59 |     {
  60 |       defaultOpen = true,
  61 |       open: openProp,
  62 |       onOpenChange: setOpenProp,
  63 |       className,
  64 |       style,
  65 |       children,
  66 |       ...props
  67 |     },
  68 |     ref
  69 |   ) => {
  70 |     const isMobile = useIsMobile()
  71 |     const [openMobile, setOpenMobile] = React.useState(false)
  72 | 
  73 |     // This is the internal state of the sidebar.
  74 |     // We use openProp and setOpenProp for control from outside the component.
  75 |     const [_open, _setOpen] = React.useState(defaultOpen)
  76 |     const open = openProp ?? _open
  77 |     const setOpen = React.useCallback(
  78 |       (value: boolean | ((value: boolean) => boolean)) => {
  79 |         const openState = typeof value === "function" ? value(open) : value
  80 |         if (setOpenProp) {
  81 |           setOpenProp(openState)
  82 |         } else {
  83 |           _setOpen(openState)
  84 |         }
  85 | 
  86 |         // This sets the cookie to keep the sidebar state.
  87 |         document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
  88 |       },
  89 |       [setOpenProp, open]
  90 |     )
  91 | 
  92 |     // Helper to toggle the sidebar.
  93 |     const toggleSidebar = React.useCallback(() => {
  94 |       return isMobile
  95 |         ? setOpenMobile((open) => !open)
  96 |         : setOpen((open) => !open)
  97 |     }, [isMobile, setOpen, setOpenMobile])
  98 | 
  99 |     // Adds a keyboard shortcut to toggle the sidebar.
 100 |     React.useEffect(() => {
 101 |       const handleKeyDown = (event: KeyboardEvent) => {
 102 |         if (
 103 |           event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
 104 |           (event.metaKey || event.ctrlKey)
 105 |         ) {
 106 |           event.preventDefault()
 107 |           toggleSidebar()
 108 |         }
 109 |       }
 110 | 
 111 |       window.addEventListener("keydown", handleKeyDown)
 112 |       return () => window.removeEventListener("keydown", handleKeyDown)
 113 |     }, [toggleSidebar])
 114 | 
 115 |     // We add a state so that we can do data-state="expanded" or "collapsed".
 116 |     // This makes it easier to style the sidebar with Tailwind classes.
 117 |     const state = open ? "expanded" : "collapsed"
 118 | 
 119 |     const contextValue = React.useMemo<SidebarContext>(
 120 |       () => ({
 121 |         state,
 122 |         open,
 123 |         setOpen,
 124 |         isMobile,
 125 |         openMobile,
 126 |         setOpenMobile,
 127 |         toggleSidebar,
 128 |       }),
 129 |       [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
 130 |     )
 131 | 
 132 |     return (
 133 |       <SidebarContext.Provider value={contextValue}>
 134 |         <TooltipProvider delayDuration={0}>
 135 |           <div
 136 |             style={
 137 |               {
 138 |                 "--sidebar-width": SIDEBAR_WIDTH,
 139 |                 "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
 140 |                 ...style,
 141 |               } as React.CSSProperties
 142 |             }
 143 |             className={cn(
 144 |               "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
 145 |               className
 146 |             )}
 147 |             ref={ref}
 148 |             {...props}
 149 |           >
 150 |             {children}
 151 |           </div>
 152 |         </TooltipProvider>
 153 |       </SidebarContext.Provider>
 154 |     )
 155 |   }
 156 | )
 157 | SidebarProvider.displayName = "SidebarProvider"
 158 | 
 159 | const Sidebar = React.forwardRef<
 160 |   HTMLDivElement,
 161 |   React.ComponentProps<"div"> & {
 162 |     side?: "left" | "right"
 163 |     variant?: "sidebar" | "floating" | "inset"
 164 |     collapsible?: "offcanvas" | "icon" | "none"
 165 |   }
 166 | >(
 167 |   (
 168 |     {
 169 |       side = "left",
 170 |       variant = "sidebar",
 171 |       collapsible = "offcanvas",
 172 |       className,
 173 |       children,
 174 |       ...props
 175 |     },
 176 |     ref
 177 |   ) => {
 178 |     const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
 179 | 
 180 |     if (collapsible === "none") {
 181 |       return (
 182 |         <div
 183 |           className={cn(
 184 |             "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
 185 |             className
 186 |           )}
 187 |           ref={ref}
 188 |           {...props}
 189 |         >
 190 |           {children}
 191 |         </div>
 192 |       )
 193 |     }
 194 | 
 195 |     if (isMobile) {
 196 |       return (
 197 |         <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
 198 |           <SheetContent
 199 |             data-sidebar="sidebar"
 200 |             data-mobile="true"
 201 |             className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
 202 |             style={
 203 |               {
 204 |                 "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
 205 |               } as React.CSSProperties
 206 |             }
 207 |             side={side}
 208 |           >
 209 |             <div className="flex h-full w-full flex-col">{children}</div>
 210 |           </SheetContent>
 211 |         </Sheet>
 212 |       )
 213 |     }
 214 | 
 215 |     return (
 216 |       <div
 217 |         ref={ref}
 218 |         className="group peer hidden md:block text-sidebar-foreground"
 219 |         data-state={state}
 220 |         data-collapsible={state === "collapsed" ? collapsible : ""}
 221 |         data-variant={variant}
 222 |         data-side={side}
 223 |       >
 224 |         {/* This is what handles the sidebar gap on desktop */}
 225 |         <div
 226 |           className={cn(
 227 |             "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
 228 |             "group-data-[collapsible=offcanvas]:w-0",
 229 |             "group-data-[side=right]:rotate-180",
 230 |             variant === "floating" || variant === "inset"
 231 |               ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
 232 |               : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
 233 |           )}
 234 |         />
 235 |         <div
 236 |           className={cn(
 237 |             "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
 238 |             side === "left"
 239 |               ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
 240 |               : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
 241 |             // Adjust the padding for floating and inset variants.
 242 |             variant === "floating" || variant === "inset"
 243 |               ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
 244 |               : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
 245 |             className
 246 |           )}
 247 |           {...props}
 248 |         >
 249 |           <div
 250 |             data-sidebar="sidebar"
 251 |             className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
 252 |           >
 253 |             {children}
 254 |           </div>
 255 |         </div>
 256 |       </div>
 257 |     )
 258 |   }
 259 | )
 260 | Sidebar.displayName = "Sidebar"
 261 | 
 262 | const SidebarTrigger = React.forwardRef<
 263 |   React.ElementRef<typeof Button>,
 264 |   React.ComponentProps<typeof Button>
 265 | >(({ className, onClick, ...props }, ref) => {
 266 |   const { toggleSidebar } = useSidebar()
 267 | 
 268 |   return (
 269 |     <Button
 270 |       ref={ref}
 271 |       data-sidebar="trigger"
 272 |       variant="ghost"
 273 |       size="icon"
 274 |       className={cn("h-7 w-7", className)}
 275 |       onClick={(event) => {
 276 |         onClick?.(event)
 277 |         toggleSidebar()
 278 |       }}
 279 |       {...props}
 280 |     >
 281 |       <PanelLeft />
 282 |       <span className="sr-only">Toggle Sidebar</span>
 283 |     </Button>
 284 |   )
 285 | })
 286 | SidebarTrigger.displayName = "SidebarTrigger"
 287 | 
 288 | const SidebarRail = React.forwardRef<
 289 |   HTMLButtonElement,
 290 |   React.ComponentProps<"button">
 291 | >(({ className, ...props }, ref) => {
 292 |   const { toggleSidebar } = useSidebar()
 293 | 
 294 |   return (
 295 |     <button
 296 |       ref={ref}
 297 |       data-sidebar="rail"
 298 |       aria-label="Toggle Sidebar"
 299 |       tabIndex={-1}
 300 |       onClick={toggleSidebar}
 301 |       title="Toggle Sidebar"
 302 |       className={cn(
 303 |         "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
 304 |         "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
 305 |         "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
 306 |         "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
 307 |         "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
 308 |         "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
 309 |         className
 310 |       )}
 311 |       {...props}
 312 |     />
 313 |   )
 314 | })
 315 | SidebarRail.displayName = "SidebarRail"
 316 | 
 317 | const SidebarInset = React.forwardRef<
 318 |   HTMLDivElement,
 319 |   React.ComponentProps<"main">
 320 | >(({ className, ...props }, ref) => {
 321 |   return (
 322 |     <main
 323 |       ref={ref}
 324 |       className={cn(
 325 |         "relative flex min-h-svh flex-1 flex-col bg-background",
 326 |         "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
 327 |         className
 328 |       )}
 329 |       {...props}
 330 |     />
 331 |   )
 332 | })
 333 | SidebarInset.displayName = "SidebarInset"
 334 | 
 335 | const SidebarInput = React.forwardRef<
 336 |   React.ElementRef<typeof Input>,
 337 |   React.ComponentProps<typeof Input>
 338 | >(({ className, ...props }, ref) => {
 339 |   return (
 340 |     <Input
 341 |       ref={ref}
 342 |       data-sidebar="input"
 343 |       className={cn(
 344 |         "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
 345 |         className
 346 |       )}
 347 |       {...props}
 348 |     />
 349 |   )
 350 | })
 351 | SidebarInput.displayName = "SidebarInput"
 352 | 
 353 | const SidebarHeader = React.forwardRef<
 354 |   HTMLDivElement,
 355 |   React.ComponentProps<"div">
 356 | >(({ className, ...props }, ref) => {
 357 |   return (
 358 |     <div
 359 |       ref={ref}
 360 |       data-sidebar="header"
 361 |       className={cn("flex flex-col gap-2 p-2", className)}
 362 |       {...props}
 363 |     />
 364 |   )
 365 | })
 366 | SidebarHeader.displayName = "SidebarHeader"
 367 | 
 368 | const SidebarFooter = React.forwardRef<
 369 |   HTMLDivElement,
 370 |   React.ComponentProps<"div">
 371 | >(({ className, ...props }, ref) => {
 372 |   return (
 373 |     <div
 374 |       ref={ref}
 375 |       data-sidebar="footer"
 376 |       className={cn("flex flex-col gap-2 p-2", className)}
 377 |       {...props}
 378 |     />
 379 |   )
 380 | })
 381 | SidebarFooter.displayName = "SidebarFooter"
 382 | 
 383 | const SidebarSeparator = React.forwardRef<
 384 |   React.ElementRef<typeof Separator>,
 385 |   React.ComponentProps<typeof Separator>
 386 | >(({ className, ...props }, ref) => {
 387 |   return (
 388 |     <Separator
 389 |       ref={ref}
 390 |       data-sidebar="separator"
 391 |       className={cn("mx-2 w-auto bg-sidebar-border", className)}
 392 |       {...props}
 393 |     />
 394 |   )
 395 | })
 396 | SidebarSeparator.displayName = "SidebarSeparator"
 397 | 
 398 | const SidebarContent = React.forwardRef<
 399 |   HTMLDivElement,
 400 |   React.ComponentProps<"div">
 401 | >(({ className, ...props }, ref) => {
 402 |   return (
 403 |     <div
 404 |       ref={ref}
 405 |       data-sidebar="content"
 406 |       className={cn(
 407 |         "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
 408 |         className
 409 |       )}
 410 |       {...props}
 411 |     />
 412 |   )
 413 | })
 414 | SidebarContent.displayName = "SidebarContent"
 415 | 
 416 | const SidebarGroup = React.forwardRef<
 417 |   HTMLDivElement,
 418 |   React.ComponentProps<"div">
 419 | >(({ className, ...props }, ref) => {
 420 |   return (
 421 |     <div
 422 |       ref={ref}
 423 |       data-sidebar="group"
 424 |       className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
 425 |       {...props}
 426 |     />
 427 |   )
 428 | })
 429 | SidebarGroup.displayName = "SidebarGroup"
 430 | 
 431 | const SidebarGroupLabel = React.forwardRef<
 432 |   HTMLDivElement,
 433 |   React.ComponentProps<"div"> & { asChild?: boolean }
 434 | >(({ className, asChild = false, ...props }, ref) => {
 435 |   const Comp = asChild ? Slot : "div"
 436 | 
 437 |   return (
 438 |     <Comp
 439 |       ref={ref}
 440 |       data-sidebar="group-label"
 441 |       className={cn(
 442 |         "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
 443 |         "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
 444 |         className
 445 |       )}
 446 |       {...props}
 447 |     />
 448 |   )
 449 | })
 450 | SidebarGroupLabel.displayName = "SidebarGroupLabel"
 451 | 
 452 | const SidebarGroupAction = React.forwardRef<
 453 |   HTMLButtonElement,
 454 |   React.ComponentProps<"button"> & { asChild?: boolean }
 455 | >(({ className, asChild = false, ...props }, ref) => {
 456 |   const Comp = asChild ? Slot : "button"
 457 | 
 458 |   return (
 459 |     <Comp
 460 |       ref={ref}
 461 |       data-sidebar="group-action"
 462 |       className={cn(
 463 |         "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
 464 |         // Increases the hit area of the button on mobile.
 465 |         "after:absolute after:-inset-2 after:md:hidden",
 466 |         "group-data-[collapsible=icon]:hidden",
 467 |         className
 468 |       )}
 469 |       {...props}
 470 |     />
 471 |   )
 472 | })
 473 | SidebarGroupAction.displayName = "SidebarGroupAction"
 474 | 
 475 | const SidebarGroupContent = React.forwardRef<
 476 |   HTMLDivElement,
 477 |   React.ComponentProps<"div">
 478 | >(({ className, ...props }, ref) => (
 479 |   <div
 480 |     ref={ref}
 481 |     data-sidebar="group-content"
 482 |     className={cn("w-full text-sm", className)}
 483 |     {...props}
 484 |   />
 485 | ))
 486 | SidebarGroupContent.displayName = "SidebarGroupContent"
 487 | 
 488 | const SidebarMenu = React.forwardRef<
 489 |   HTMLUListElement,
 490 |   React.ComponentProps<"ul">
 491 | >(({ className, ...props }, ref) => (
 492 |   <ul
 493 |     ref={ref}
 494 |     data-sidebar="menu"
 495 |     className={cn("flex w-full min-w-0 flex-col gap-1", className)}
 496 |     {...props}
 497 |   />
 498 | ))
 499 | SidebarMenu.displayName = "SidebarMenu"
 500 | 
 501 | const SidebarMenuItem = React.forwardRef<
 502 |   HTMLLIElement,
 503 |   React.ComponentProps<"li">
 504 | >(({ className, ...props }, ref) => (
 505 |   <li
 506 |     ref={ref}
 507 |     data-sidebar="menu-item"
 508 |     className={cn("group/menu-item relative", className)}
 509 |     {...props}
 510 |   />
 511 | ))
 512 | SidebarMenuItem.displayName = "SidebarMenuItem"
 513 | 
 514 | const sidebarMenuButtonVariants = cva(
 515 |   "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
 516 |   {
 517 |     variants: {
 518 |       variant: {
 519 |         default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
 520 |         outline:
 521 |           "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
 522 |       },
 523 |       size: {
 524 |         default: "h-8 text-sm",
 525 |         sm: "h-7 text-xs",
 526 |         lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
 527 |       },
 528 |     },
 529 |     defaultVariants: {
 530 |       variant: "default",
 531 |       size: "default",
 532 |     },
 533 |   }
 534 | )
 535 | 
 536 | const SidebarMenuButton = React.forwardRef<
 537 |   HTMLButtonElement,
 538 |   React.ComponentProps<"button"> & {
 539 |     asChild?: boolean
 540 |     isActive?: boolean
 541 |     tooltip?: string | React.ComponentProps<typeof TooltipContent>
 542 |   } & VariantProps<typeof sidebarMenuButtonVariants>
 543 | >(
 544 |   (
 545 |     {
 546 |       asChild = false,
 547 |       isActive = false,
 548 |       variant = "default",
 549 |       size = "default",
 550 |       tooltip,
 551 |       className,
 552 |       ...props
 553 |     },
 554 |     ref
 555 |   ) => {
 556 |     const Comp = asChild ? Slot : "button"
 557 |     const { isMobile, state } = useSidebar()
 558 | 
 559 |     const button = (
 560 |       <Comp
 561 |         ref={ref}
 562 |         data-sidebar="menu-button"
 563 |         data-size={size}
 564 |         data-active={isActive}
 565 |         className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
 566 |         {...props}
 567 |       />
 568 |     )
 569 | 
 570 |     if (!tooltip) {
 571 |       return button
 572 |     }
 573 | 
 574 |     if (typeof tooltip === "string") {
 575 |       tooltip = {
 576 |         children: tooltip,
 577 |       }
 578 |     }
 579 | 
 580 |     return (
 581 |       <Tooltip>
 582 |         <TooltipTrigger asChild>{button}</TooltipTrigger>
 583 |         <TooltipContent
 584 |           side="right"
 585 |           align="center"
 586 |           hidden={state !== "collapsed" || isMobile}
 587 |           {...tooltip}
 588 |         />
 589 |       </Tooltip>
 590 |     )
 591 |   }
 592 | )
 593 | SidebarMenuButton.displayName = "SidebarMenuButton"
 594 | 
 595 | const SidebarMenuAction = React.forwardRef<
 596 |   HTMLButtonElement,
 597 |   React.ComponentProps<"button"> & {
 598 |     asChild?: boolean
 599 |     showOnHover?: boolean
 600 |   }
 601 | >(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
 602 |   const Comp = asChild ? Slot : "button"
 603 | 
 604 |   return (
 605 |     <Comp
 606 |       ref={ref}
 607 |       data-sidebar="menu-action"
 608 |       className={cn(
 609 |         "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
 610 |         // Increases the hit area of the button on mobile.
 611 |         "after:absolute after:-inset-2 after:md:hidden",
 612 |         "peer-data-[size=sm]/menu-button:top-1",
 613 |         "peer-data-[size=default]/menu-button:top-1.5",
 614 |         "peer-data-[size=lg]/menu-button:top-2.5",
 615 |         "group-data-[collapsible=icon]:hidden",
 616 |         showOnHover &&
 617 |           "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
 618 |         className
 619 |       )}
 620 |       {...props}
 621 |     />
 622 |   )
 623 | })
 624 | SidebarMenuAction.displayName = "SidebarMenuAction"
 625 | 
 626 | const SidebarMenuBadge = React.forwardRef<
 627 |   HTMLDivElement,
 628 |   React.ComponentProps<"div">
 629 | >(({ className, ...props }, ref) => (
 630 |   <div
 631 |     ref={ref}
 632 |     data-sidebar="menu-badge"
 633 |     className={cn(
 634 |       "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
 635 |       "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
 636 |       "peer-data-[size=sm]/menu-button:top-1",
 637 |       "peer-data-[size=default]/menu-button:top-1.5",
 638 |       "peer-data-[size=lg]/menu-button:top-2.5",
 639 |       "group-data-[collapsible=icon]:hidden",
 640 |       className
 641 |     )}
 642 |     {...props}
 643 |   />
 644 | ))
 645 | SidebarMenuBadge.displayName = "SidebarMenuBadge"
 646 | 
 647 | const SidebarMenuSkeleton = React.forwardRef<
 648 |   HTMLDivElement,
 649 |   React.ComponentProps<"div"> & {
 650 |     showIcon?: boolean
 651 |   }
 652 | >(({ className, showIcon = false, ...props }, ref) => {
 653 |   // Random width between 50 to 90%.
 654 |   const width = React.useMemo(() => {
 655 |     return `${Math.floor(Math.random() * 40) + 50}%`
 656 |   }, [])
 657 | 
 658 |   return (
 659 |     <div
 660 |       ref={ref}
 661 |       data-sidebar="menu-skeleton"
 662 |       className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
 663 |       {...props}
 664 |     >
 665 |       {showIcon && (
 666 |         <Skeleton
 667 |           className="size-4 rounded-md"
 668 |           data-sidebar="menu-skeleton-icon"
 669 |         />
 670 |       )}
 671 |       <Skeleton
 672 |         className="h-4 flex-1 max-w-[--skeleton-width]"
 673 |         data-sidebar="menu-skeleton-text"
 674 |         style={
 675 |           {
 676 |             "--skeleton-width": width,
 677 |           } as React.CSSProperties
 678 |         }
 679 |       />
 680 |     </div>
 681 |   )
 682 | })
 683 | SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"
 684 | 
 685 | const SidebarMenuSub = React.forwardRef<
 686 |   HTMLUListElement,
 687 |   React.ComponentProps<"ul">
 688 | >(({ className, ...props }, ref) => (
 689 |   <ul
 690 |     ref={ref}
 691 |     data-sidebar="menu-sub"
 692 |     className={cn(
 693 |       "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
 694 |       "group-data-[collapsible=icon]:hidden",
 695 |       className
 696 |     )}
 697 |     {...props}
 698 |   />
 699 | ))
 700 | SidebarMenuSub.displayName = "SidebarMenuSub"
 701 | 
 702 | const SidebarMenuSubItem = React.forwardRef<
 703 |   HTMLLIElement,
 704 |   React.ComponentProps<"li">
 705 | >(({ ...props }, ref) => <li ref={ref} {...props} />)
 706 | SidebarMenuSubItem.displayName = "SidebarMenuSubItem"
 707 | 
 708 | const SidebarMenuSubButton = React.forwardRef<
 709 |   HTMLAnchorElement,
 710 |   React.ComponentProps<"a"> & {
 711 |     asChild?: boolean
 712 |     size?: "sm" | "md"
 713 |     isActive?: boolean
 714 |   }
 715 | >(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
 716 |   const Comp = asChild ? Slot : "a"
 717 | 
 718 |   return (
 719 |     <Comp
 720 |       ref={ref}
 721 |       data-sidebar="menu-sub-button"
 722 |       data-size={size}
 723 |       data-active={isActive}
 724 |       className={cn(
 725 |         "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
 726 |         "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
 727 |         size === "sm" && "text-xs",
 728 |         size === "md" && "text-sm",
 729 |         "group-data-[collapsible=icon]:hidden",
 730 |         className
 731 |       )}
 732 |       {...props}
 733 |     />
 734 |   )
 735 | })
 736 | SidebarMenuSubButton.displayName = "SidebarMenuSubButton"
 737 | 
 738 | export {
 739 |   Sidebar,
 740 |   SidebarContent,
 741 |   SidebarFooter,
 742 |   SidebarGroup,
 743 |   SidebarGroupAction,
 744 |   SidebarGroupContent,
 745 |   SidebarGroupLabel,
 746 |   SidebarHeader,
 747 |   SidebarInput,
 748 |   SidebarInset,
 749 |   SidebarMenu,
 750 |   SidebarMenuAction,
 751 |   SidebarMenuBadge,
 752 |   SidebarMenuButton,
 753 |   SidebarMenuItem,
 754 |   SidebarMenuSkeleton,
 755 |   SidebarMenuSub,
 756 |   SidebarMenuSubButton,
 757 |   SidebarMenuSubItem,
 758 |   SidebarProvider,
 759 |   SidebarRail,
 760 |   SidebarSeparator,
 761 |   SidebarTrigger,
 762 |   useSidebar,
 763 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/table.tsx`:

```tsx
   1 | import * as React from "react"
   2 | 
   3 | import { cn } from "@/lib/utils"
   4 | 
   5 | const Table = React.forwardRef<
   6 |   HTMLTableElement,
   7 |   React.HTMLAttributes<HTMLTableElement>
   8 | >(({ className, ...props }, ref) => (
   9 |   <div className="relative w-full overflow-auto">
  10 |     <table
  11 |       ref={ref}
  12 |       className={cn("w-full caption-bottom text-sm", className)}
  13 |       {...props}
  14 |     />
  15 |   </div>
  16 | ))
  17 | Table.displayName = "Table"
  18 | 
  19 | const TableHeader = React.forwardRef<
  20 |   HTMLTableSectionElement,
  21 |   React.HTMLAttributes<HTMLTableSectionElement>
  22 | >(({ className, ...props }, ref) => (
  23 |   <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
  24 | ))
  25 | TableHeader.displayName = "TableHeader"
  26 | 
  27 | const TableBody = React.forwardRef<
  28 |   HTMLTableSectionElement,
  29 |   React.HTMLAttributes<HTMLTableSectionElement>
  30 | >(({ className, ...props }, ref) => (
  31 |   <tbody
  32 |     ref={ref}
  33 |     className={cn("[&_tr:last-child]:border-0", className)}
  34 |     {...props}
  35 |   />
  36 | ))
  37 | TableBody.displayName = "TableBody"
  38 | 
  39 | const TableFooter = React.forwardRef<
  40 |   HTMLTableSectionElement,
  41 |   React.HTMLAttributes<HTMLTableSectionElement>
  42 | >(({ className, ...props }, ref) => (
  43 |   <tfoot
  44 |     ref={ref}
  45 |     className={cn(
  46 |       "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
  47 |       className
  48 |     )}
  49 |     {...props}
  50 |   />
  51 | ))
  52 | TableFooter.displayName = "TableFooter"
  53 | 
  54 | const TableRow = React.forwardRef<
  55 |   HTMLTableRowElement,
  56 |   React.HTMLAttributes<HTMLTableRowElement>
  57 | >(({ className, ...props }, ref) => (
  58 |   <tr
  59 |     ref={ref}
  60 |     className={cn(
  61 |       "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
  62 |       className
  63 |     )}
  64 |     {...props}
  65 |   />
  66 | ))
  67 | TableRow.displayName = "TableRow"
  68 | 
  69 | const TableHead = React.forwardRef<
  70 |   HTMLTableCellElement,
  71 |   React.ThHTMLAttributes<HTMLTableCellElement>
  72 | >(({ className, ...props }, ref) => (
  73 |   <th
  74 |     ref={ref}
  75 |     className={cn(
  76 |       "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  77 |       className
  78 |     )}
  79 |     {...props}
  80 |   />
  81 | ))
  82 | TableHead.displayName = "TableHead"
  83 | 
  84 | const TableCell = React.forwardRef<
  85 |   HTMLTableCellElement,
  86 |   React.TdHTMLAttributes<HTMLTableCellElement>
  87 | >(({ className, ...props }, ref) => (
  88 |   <td
  89 |     ref={ref}
  90 |     className={cn(
  91 |       "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  92 |       className
  93 |     )}
  94 |     {...props}
  95 |   />
  96 | ))
  97 | TableCell.displayName = "TableCell"
  98 | 
  99 | const TableCaption = React.forwardRef<
 100 |   HTMLTableCaptionElement,
 101 |   React.HTMLAttributes<HTMLTableCaptionElement>
 102 | >(({ className, ...props }, ref) => (
 103 |   <caption
 104 |     ref={ref}
 105 |     className={cn("mt-4 text-sm text-muted-foreground", className)}
 106 |     {...props}
 107 |   />
 108 | ))
 109 | TableCaption.displayName = "TableCaption"
 110 | 
 111 | export {
 112 |   Table,
 113 |   TableHeader,
 114 |   TableBody,
 115 |   TableFooter,
 116 |   TableHead,
 117 |   TableRow,
 118 |   TableCell,
 119 |   TableCaption,
 120 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/separator.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as SeparatorPrimitive from "@radix-ui/react-separator"
   5 | 
   6 | import { cn } from "@/lib/utils"
   7 | 
   8 | const Separator = React.forwardRef<
   9 |   React.ElementRef<typeof SeparatorPrimitive.Root>,
  10 |   React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
  11 | >(
  12 |   (
  13 |     { className, orientation = "horizontal", decorative = true, ...props },
  14 |     ref
  15 |   ) => (
  16 |     <SeparatorPrimitive.Root
  17 |       ref={ref}
  18 |       decorative={decorative}
  19 |       orientation={orientation}
  20 |       className={cn(
  21 |         "shrink-0 bg-border",
  22 |         orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
  23 |         className
  24 |       )}
  25 |       {...props}
  26 |     />
  27 |   )
  28 | )
  29 | Separator.displayName = SeparatorPrimitive.Root.displayName
  30 | 
  31 | export { Separator }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/button.tsx`:

```tsx
   1 | import * as React from "react"
   2 | import { Slot } from "@radix-ui/react-slot"
   3 | import { cva, type VariantProps } from "class-variance-authority"
   4 | 
   5 | import { cn } from "@/lib/utils"
   6 | 
   7 | const buttonVariants = cva(
   8 |   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
   9 |   {
  10 |     variants: {
  11 |       variant: {
  12 |         default:
  13 |           "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  14 |         destructive:
  15 |           "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  16 |         outline:
  17 |           "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  18 |         secondary:
  19 |           "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  20 |         ghost: "hover:bg-accent hover:text-accent-foreground",
  21 |         link: "text-primary underline-offset-4 hover:underline",
  22 |       },
  23 |       size: {
  24 |         default: "h-9 px-4 py-2",
  25 |         sm: "h-8 rounded-md px-3 text-xs",
  26 |         lg: "h-10 rounded-md px-8",
  27 |         icon: "h-9 w-9",
  28 |       },
  29 |     },
  30 |     defaultVariants: {
  31 |       variant: "default",
  32 |       size: "default",
  33 |     },
  34 |   }
  35 | )
  36 | 
  37 | export interface ButtonProps
  38 |   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  39 |     VariantProps<typeof buttonVariants> {
  40 |   asChild?: boolean
  41 | }
  42 | 
  43 | const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  44 |   ({ className, variant, size, asChild = false, ...props }, ref) => {
  45 |     const Comp = asChild ? Slot : "button"
  46 |     return (
  47 |       <Comp
  48 |         className={cn(buttonVariants({ variant, size, className }))}
  49 |         ref={ref}
  50 |         {...props}
  51 |       />
  52 |     )
  53 |   }
  54 | )
  55 | Button.displayName = "Button"
  56 | 
  57 | export { Button, buttonVariants }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/toggle.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as TogglePrimitive from "@radix-ui/react-toggle"
   5 | import { cva, type VariantProps } from "class-variance-authority"
   6 | 
   7 | import { cn } from "@/lib/utils"
   8 | 
   9 | const toggleVariants = cva(
  10 |   "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  11 |   {
  12 |     variants: {
  13 |       variant: {
  14 |         default: "bg-transparent",
  15 |         outline:
  16 |           "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
  17 |       },
  18 |       size: {
  19 |         default: "h-9 px-2 min-w-9",
  20 |         sm: "h-8 px-1.5 min-w-8",
  21 |         lg: "h-10 px-2.5 min-w-10",
  22 |       },
  23 |     },
  24 |     defaultVariants: {
  25 |       variant: "default",
  26 |       size: "default",
  27 |     },
  28 |   }
  29 | )
  30 | 
  31 | const Toggle = React.forwardRef<
  32 |   React.ElementRef<typeof TogglePrimitive.Root>,
  33 |   React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
  34 |     VariantProps<typeof toggleVariants>
  35 | >(({ className, variant, size, ...props }, ref) => (
  36 |   <TogglePrimitive.Root
  37 |     ref={ref}
  38 |     className={cn(toggleVariants({ variant, size, className }))}
  39 |     {...props}
  40 |   />
  41 | ))
  42 | 
  43 | Toggle.displayName = TogglePrimitive.Root.displayName
  44 | 
  45 | export { Toggle, toggleVariants }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/toast.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as ToastPrimitives from "@radix-ui/react-toast"
   5 | import { cva, type VariantProps } from "class-variance-authority"
   6 | import { X } from "lucide-react"
   7 | 
   8 | import { cn } from "@/lib/utils"
   9 | 
  10 | const ToastProvider = ToastPrimitives.Provider
  11 | 
  12 | const ToastViewport = React.forwardRef<
  13 |   React.ElementRef<typeof ToastPrimitives.Viewport>,
  14 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
  15 | >(({ className, ...props }, ref) => (
  16 |   <ToastPrimitives.Viewport
  17 |     ref={ref}
  18 |     className={cn(
  19 |       "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
  20 |       className
  21 |     )}
  22 |     {...props}
  23 |   />
  24 | ))
  25 | ToastViewport.displayName = ToastPrimitives.Viewport.displayName
  26 | 
  27 | const toastVariants = cva(
  28 |   "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  29 |   {
  30 |     variants: {
  31 |       variant: {
  32 |         default: "border bg-background text-foreground",
  33 |         destructive:
  34 |           "destructive group border-destructive bg-destructive text-destructive-foreground",
  35 |       },
  36 |     },
  37 |     defaultVariants: {
  38 |       variant: "default",
  39 |     },
  40 |   }
  41 | )
  42 | 
  43 | const Toast = React.forwardRef<
  44 |   React.ElementRef<typeof ToastPrimitives.Root>,
  45 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
  46 |     VariantProps<typeof toastVariants>
  47 | >(({ className, variant, ...props }, ref) => {
  48 |   return (
  49 |     <ToastPrimitives.Root
  50 |       ref={ref}
  51 |       className={cn(toastVariants({ variant }), className)}
  52 |       {...props}
  53 |     />
  54 |   )
  55 | })
  56 | Toast.displayName = ToastPrimitives.Root.displayName
  57 | 
  58 | const ToastAction = React.forwardRef<
  59 |   React.ElementRef<typeof ToastPrimitives.Action>,
  60 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
  61 | >(({ className, ...props }, ref) => (
  62 |   <ToastPrimitives.Action
  63 |     ref={ref}
  64 |     className={cn(
  65 |       "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
  66 |       className
  67 |     )}
  68 |     {...props}
  69 |   />
  70 | ))
  71 | ToastAction.displayName = ToastPrimitives.Action.displayName
  72 | 
  73 | const ToastClose = React.forwardRef<
  74 |   React.ElementRef<typeof ToastPrimitives.Close>,
  75 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
  76 | >(({ className, ...props }, ref) => (
  77 |   <ToastPrimitives.Close
  78 |     ref={ref}
  79 |     className={cn(
  80 |       "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
  81 |       className
  82 |     )}
  83 |     toast-close=""
  84 |     {...props}
  85 |   >
  86 |     <X className="h-4 w-4" />
  87 |   </ToastPrimitives.Close>
  88 | ))
  89 | ToastClose.displayName = ToastPrimitives.Close.displayName
  90 | 
  91 | const ToastTitle = React.forwardRef<
  92 |   React.ElementRef<typeof ToastPrimitives.Title>,
  93 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
  94 | >(({ className, ...props }, ref) => (
  95 |   <ToastPrimitives.Title
  96 |     ref={ref}
  97 |     className={cn("text-sm font-semibold [&+div]:text-xs", className)}
  98 |     {...props}
  99 |   />
 100 | ))
 101 | ToastTitle.displayName = ToastPrimitives.Title.displayName
 102 | 
 103 | const ToastDescription = React.forwardRef<
 104 |   React.ElementRef<typeof ToastPrimitives.Description>,
 105 |   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
 106 | >(({ className, ...props }, ref) => (
 107 |   <ToastPrimitives.Description
 108 |     ref={ref}
 109 |     className={cn("text-sm opacity-90", className)}
 110 |     {...props}
 111 |   />
 112 | ))
 113 | ToastDescription.displayName = ToastPrimitives.Description.displayName
 114 | 
 115 | type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
 116 | 
 117 | type ToastActionElement = React.ReactElement<typeof ToastAction>
 118 | 
 119 | export {
 120 |   type ToastProps,
 121 |   type ToastActionElement,
 122 |   ToastProvider,
 123 |   ToastViewport,
 124 |   Toast,
 125 |   ToastTitle,
 126 |   ToastDescription,
 127 |   ToastClose,
 128 |   ToastAction,
 129 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/checkbox.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
   5 | import { Check } from "lucide-react"
   6 | 
   7 | import { cn } from "@/lib/utils"
   8 | 
   9 | const Checkbox = React.forwardRef<
  10 |   React.ElementRef<typeof CheckboxPrimitive.Root>,
  11 |   React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
  12 | >(({ className, ...props }, ref) => (
  13 |   <CheckboxPrimitive.Root
  14 |     ref={ref}
  15 |     className={cn(
  16 |       "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
  17 |       className
  18 |     )}
  19 |     {...props}
  20 |   >
  21 |     <CheckboxPrimitive.Indicator
  22 |       className={cn("flex items-center justify-center text-current")}
  23 |     >
  24 |       <Check className="h-4 w-4" />
  25 |     </CheckboxPrimitive.Indicator>
  26 |   </CheckboxPrimitive.Root>
  27 | ))
  28 | Checkbox.displayName = CheckboxPrimitive.Root.displayName
  29 | 
  30 | export { Checkbox }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/collapsible.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
   4 | 
   5 | const Collapsible = CollapsiblePrimitive.Root
   6 | 
   7 | const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger
   8 | 
   9 | const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent
  10 | 
  11 | export { Collapsible, CollapsibleTrigger, CollapsibleContent }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/dropdown-menu.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
   5 | import { Check, ChevronRight, Circle } from "lucide-react"
   6 | 
   7 | import { cn } from "@/lib/utils"
   8 | 
   9 | const DropdownMenu = DropdownMenuPrimitive.Root
  10 | 
  11 | const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
  12 | 
  13 | const DropdownMenuGroup = DropdownMenuPrimitive.Group
  14 | 
  15 | const DropdownMenuPortal = DropdownMenuPrimitive.Portal
  16 | 
  17 | const DropdownMenuSub = DropdownMenuPrimitive.Sub
  18 | 
  19 | const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup
  20 | 
  21 | const DropdownMenuSubTrigger = React.forwardRef<
  22 |   React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  23 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
  24 |     inset?: boolean
  25 |   }
  26 | >(({ className, inset, children, ...props }, ref) => (
  27 |   <DropdownMenuPrimitive.SubTrigger
  28 |     ref={ref}
  29 |     className={cn(
  30 |       "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  31 |       inset && "pl-8",
  32 |       className
  33 |     )}
  34 |     {...props}
  35 |   >
  36 |     {children}
  37 |     <ChevronRight className="ml-auto" />
  38 |   </DropdownMenuPrimitive.SubTrigger>
  39 | ))
  40 | DropdownMenuSubTrigger.displayName =
  41 |   DropdownMenuPrimitive.SubTrigger.displayName
  42 | 
  43 | const DropdownMenuSubContent = React.forwardRef<
  44 |   React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  45 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
  46 | >(({ className, ...props }, ref) => (
  47 |   <DropdownMenuPrimitive.SubContent
  48 |     ref={ref}
  49 |     className={cn(
  50 |       "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  51 |       className
  52 |     )}
  53 |     {...props}
  54 |   />
  55 | ))
  56 | DropdownMenuSubContent.displayName =
  57 |   DropdownMenuPrimitive.SubContent.displayName
  58 | 
  59 | const DropdownMenuContent = React.forwardRef<
  60 |   React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  61 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
  62 | >(({ className, sideOffset = 4, ...props }, ref) => (
  63 |   <DropdownMenuPrimitive.Portal>
  64 |     <DropdownMenuPrimitive.Content
  65 |       ref={ref}
  66 |       sideOffset={sideOffset}
  67 |       className={cn(
  68 |         "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
  69 |         "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  70 |         className
  71 |       )}
  72 |       {...props}
  73 |     />
  74 |   </DropdownMenuPrimitive.Portal>
  75 | ))
  76 | DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName
  77 | 
  78 | const DropdownMenuItem = React.forwardRef<
  79 |   React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  80 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  81 |     inset?: boolean
  82 |   }
  83 | >(({ className, inset, ...props }, ref) => (
  84 |   <DropdownMenuPrimitive.Item
  85 |     ref={ref}
  86 |     className={cn(
  87 |       "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
  88 |       inset && "pl-8",
  89 |       className
  90 |     )}
  91 |     {...props}
  92 |   />
  93 | ))
  94 | DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName
  95 | 
  96 | const DropdownMenuCheckboxItem = React.forwardRef<
  97 |   React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  98 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
  99 | >(({ className, children, checked, ...props }, ref) => (
 100 |   <DropdownMenuPrimitive.CheckboxItem
 101 |     ref={ref}
 102 |     className={cn(
 103 |       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
 104 |       className
 105 |     )}
 106 |     checked={checked}
 107 |     {...props}
 108 |   >
 109 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
 110 |       <DropdownMenuPrimitive.ItemIndicator>
 111 |         <Check className="h-4 w-4" />
 112 |       </DropdownMenuPrimitive.ItemIndicator>
 113 |     </span>
 114 |     {children}
 115 |   </DropdownMenuPrimitive.CheckboxItem>
 116 | ))
 117 | DropdownMenuCheckboxItem.displayName =
 118 |   DropdownMenuPrimitive.CheckboxItem.displayName
 119 | 
 120 | const DropdownMenuRadioItem = React.forwardRef<
 121 |   React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
 122 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
 123 | >(({ className, children, ...props }, ref) => (
 124 |   <DropdownMenuPrimitive.RadioItem
 125 |     ref={ref}
 126 |     className={cn(
 127 |       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
 128 |       className
 129 |     )}
 130 |     {...props}
 131 |   >
 132 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
 133 |       <DropdownMenuPrimitive.ItemIndicator>
 134 |         <Circle className="h-2 w-2 fill-current" />
 135 |       </DropdownMenuPrimitive.ItemIndicator>
 136 |     </span>
 137 |     {children}
 138 |   </DropdownMenuPrimitive.RadioItem>
 139 | ))
 140 | DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName
 141 | 
 142 | const DropdownMenuLabel = React.forwardRef<
 143 |   React.ElementRef<typeof DropdownMenuPrimitive.Label>,
 144 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
 145 |     inset?: boolean
 146 |   }
 147 | >(({ className, inset, ...props }, ref) => (
 148 |   <DropdownMenuPrimitive.Label
 149 |     ref={ref}
 150 |     className={cn(
 151 |       "px-2 py-1.5 text-sm font-semibold",
 152 |       inset && "pl-8",
 153 |       className
 154 |     )}
 155 |     {...props}
 156 |   />
 157 | ))
 158 | DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName
 159 | 
 160 | const DropdownMenuSeparator = React.forwardRef<
 161 |   React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
 162 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
 163 | >(({ className, ...props }, ref) => (
 164 |   <DropdownMenuPrimitive.Separator
 165 |     ref={ref}
 166 |     className={cn("-mx-1 my-1 h-px bg-muted", className)}
 167 |     {...props}
 168 |   />
 169 | ))
 170 | DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName
 171 | 
 172 | const DropdownMenuShortcut = ({
 173 |   className,
 174 |   ...props
 175 | }: React.HTMLAttributes<HTMLSpanElement>) => {
 176 |   return (
 177 |     <span
 178 |       className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
 179 |       {...props}
 180 |     />
 181 |   )
 182 | }
 183 | DropdownMenuShortcut.displayName = "DropdownMenuShortcut"
 184 | 
 185 | export {
 186 |   DropdownMenu,
 187 |   DropdownMenuTrigger,
 188 |   DropdownMenuContent,
 189 |   DropdownMenuItem,
 190 |   DropdownMenuCheckboxItem,
 191 |   DropdownMenuRadioItem,
 192 |   DropdownMenuLabel,
 193 |   DropdownMenuSeparator,
 194 |   DropdownMenuShortcut,
 195 |   DropdownMenuGroup,
 196 |   DropdownMenuPortal,
 197 |   DropdownMenuSub,
 198 |   DropdownMenuSubContent,
 199 |   DropdownMenuSubTrigger,
 200 |   DropdownMenuRadioGroup,
 201 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/select.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as SelectPrimitive from "@radix-ui/react-select"
   5 | import { Check, ChevronDown, ChevronUp } from "lucide-react"
   6 | 
   7 | import { cn } from "@/lib/utils"
   8 | 
   9 | const Select = SelectPrimitive.Root
  10 | 
  11 | const SelectGroup = SelectPrimitive.Group
  12 | 
  13 | const SelectValue = SelectPrimitive.Value
  14 | 
  15 | const SelectTrigger = React.forwardRef<
  16 |   React.ElementRef<typeof SelectPrimitive.Trigger>,
  17 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
  18 | >(({ className, children, ...props }, ref) => (
  19 |   <SelectPrimitive.Trigger
  20 |     ref={ref}
  21 |     className={cn(
  22 |       "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  23 |       className
  24 |     )}
  25 |     {...props}
  26 |   >
  27 |     {children}
  28 |     <SelectPrimitive.Icon asChild>
  29 |       <ChevronDown className="h-4 w-4 opacity-50" />
  30 |     </SelectPrimitive.Icon>
  31 |   </SelectPrimitive.Trigger>
  32 | ))
  33 | SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
  34 | 
  35 | const SelectScrollUpButton = React.forwardRef<
  36 |   React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  37 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
  38 | >(({ className, ...props }, ref) => (
  39 |   <SelectPrimitive.ScrollUpButton
  40 |     ref={ref}
  41 |     className={cn(
  42 |       "flex cursor-default items-center justify-center py-1",
  43 |       className
  44 |     )}
  45 |     {...props}
  46 |   >
  47 |     <ChevronUp className="h-4 w-4" />
  48 |   </SelectPrimitive.ScrollUpButton>
  49 | ))
  50 | SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName
  51 | 
  52 | const SelectScrollDownButton = React.forwardRef<
  53 |   React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  54 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
  55 | >(({ className, ...props }, ref) => (
  56 |   <SelectPrimitive.ScrollDownButton
  57 |     ref={ref}
  58 |     className={cn(
  59 |       "flex cursor-default items-center justify-center py-1",
  60 |       className
  61 |     )}
  62 |     {...props}
  63 |   >
  64 |     <ChevronDown className="h-4 w-4" />
  65 |   </SelectPrimitive.ScrollDownButton>
  66 | ))
  67 | SelectScrollDownButton.displayName =
  68 |   SelectPrimitive.ScrollDownButton.displayName
  69 | 
  70 | const SelectContent = React.forwardRef<
  71 |   React.ElementRef<typeof SelectPrimitive.Content>,
  72 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
  73 | >(({ className, children, position = "popper", ...props }, ref) => (
  74 |   <SelectPrimitive.Portal>
  75 |     <SelectPrimitive.Content
  76 |       ref={ref}
  77 |       className={cn(
  78 |         "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  79 |         position === "popper" &&
  80 |           "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
  81 |         className
  82 |       )}
  83 |       position={position}
  84 |       {...props}
  85 |     >
  86 |       <SelectScrollUpButton />
  87 |       <SelectPrimitive.Viewport
  88 |         className={cn(
  89 |           "p-1",
  90 |           position === "popper" &&
  91 |             "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
  92 |         )}
  93 |       >
  94 |         {children}
  95 |       </SelectPrimitive.Viewport>
  96 |       <SelectScrollDownButton />
  97 |     </SelectPrimitive.Content>
  98 |   </SelectPrimitive.Portal>
  99 | ))
 100 | SelectContent.displayName = SelectPrimitive.Content.displayName
 101 | 
 102 | const SelectLabel = React.forwardRef<
 103 |   React.ElementRef<typeof SelectPrimitive.Label>,
 104 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
 105 | >(({ className, ...props }, ref) => (
 106 |   <SelectPrimitive.Label
 107 |     ref={ref}
 108 |     className={cn("px-2 py-1.5 text-sm font-semibold", className)}
 109 |     {...props}
 110 |   />
 111 | ))
 112 | SelectLabel.displayName = SelectPrimitive.Label.displayName
 113 | 
 114 | const SelectItem = React.forwardRef<
 115 |   React.ElementRef<typeof SelectPrimitive.Item>,
 116 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
 117 | >(({ className, children, ...props }, ref) => (
 118 |   <SelectPrimitive.Item
 119 |     ref={ref}
 120 |     className={cn(
 121 |       "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
 122 |       className
 123 |     )}
 124 |     {...props}
 125 |   >
 126 |     <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
 127 |       <SelectPrimitive.ItemIndicator>
 128 |         <Check className="h-4 w-4" />
 129 |       </SelectPrimitive.ItemIndicator>
 130 |     </span>
 131 |     <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
 132 |   </SelectPrimitive.Item>
 133 | ))
 134 | SelectItem.displayName = SelectPrimitive.Item.displayName
 135 | 
 136 | const SelectSeparator = React.forwardRef<
 137 |   React.ElementRef<typeof SelectPrimitive.Separator>,
 138 |   React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
 139 | >(({ className, ...props }, ref) => (
 140 |   <SelectPrimitive.Separator
 141 |     ref={ref}
 142 |     className={cn("-mx-1 my-1 h-px bg-muted", className)}
 143 |     {...props}
 144 |   />
 145 | ))
 146 | SelectSeparator.displayName = SelectPrimitive.Separator.displayName
 147 | 
 148 | export {
 149 |   Select,
 150 |   SelectGroup,
 151 |   SelectValue,
 152 |   SelectTrigger,
 153 |   SelectContent,
 154 |   SelectLabel,
 155 |   SelectItem,
 156 |   SelectSeparator,
 157 |   SelectScrollUpButton,
 158 |   SelectScrollDownButton,
 159 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/textarea.tsx`:

```tsx
   1 | import * as React from "react"
   2 | 
   3 | import { cn } from "@/lib/utils"
   4 | 
   5 | const Textarea = React.forwardRef<
   6 |   HTMLTextAreaElement,
   7 |   React.ComponentProps<"textarea">
   8 | >(({ className, ...props }, ref) => {
   9 |   return (
  10 |     <textarea
  11 |       className={cn(
  12 |         "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  13 |         className
  14 |       )}
  15 |       ref={ref}
  16 |       {...props}
  17 |     />
  18 |   )
  19 | })
  20 | Textarea.displayName = "Textarea"
  21 | 
  22 | export { Textarea }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/input.tsx`:

```tsx
   1 | import * as React from "react"
   2 | 
   3 | import { cn } from "@/lib/utils"
   4 | 
   5 | const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
   6 |   ({ className, type, ...props }, ref) => {
   7 |     return (
   8 |       <input
   9 |         type={type}
  10 |         className={cn(
  11 |           "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  12 |           className
  13 |         )}
  14 |         ref={ref}
  15 |         {...props}
  16 |       />
  17 |     )
  18 |   }
  19 | )
  20 | Input.displayName = "Input"
  21 | 
  22 | export { Input }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/skeleton.tsx`:

```tsx
   1 | import { cn } from "@/lib/utils"
   2 | 
   3 | function Skeleton({
   4 |   className,
   5 |   ...props
   6 | }: React.HTMLAttributes<HTMLDivElement>) {
   7 |   return (
   8 |     <div
   9 |       className={cn("animate-pulse rounded-md bg-primary/10", className)}
  10 |       {...props}
  11 |     />
  12 |   )
  13 | }
  14 | 
  15 | export { Skeleton }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/context-menu.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
   5 | import { Check, ChevronRight, Circle } from "lucide-react"
   6 | 
   7 | import { cn } from "@/lib/utils"
   8 | 
   9 | const ContextMenu = ContextMenuPrimitive.Root
  10 | 
  11 | const ContextMenuTrigger = ContextMenuPrimitive.Trigger
  12 | 
  13 | const ContextMenuGroup = ContextMenuPrimitive.Group
  14 | 
  15 | const ContextMenuPortal = ContextMenuPrimitive.Portal
  16 | 
  17 | const ContextMenuSub = ContextMenuPrimitive.Sub
  18 | 
  19 | const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup
  20 | 
  21 | const ContextMenuSubTrigger = React.forwardRef<
  22 |   React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  23 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
  24 |     inset?: boolean
  25 |   }
  26 | >(({ className, inset, children, ...props }, ref) => (
  27 |   <ContextMenuPrimitive.SubTrigger
  28 |     ref={ref}
  29 |     className={cn(
  30 |       "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
  31 |       inset && "pl-8",
  32 |       className
  33 |     )}
  34 |     {...props}
  35 |   >
  36 |     {children}
  37 |     <ChevronRight className="ml-auto h-4 w-4" />
  38 |   </ContextMenuPrimitive.SubTrigger>
  39 | ))
  40 | ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName
  41 | 
  42 | const ContextMenuSubContent = React.forwardRef<
  43 |   React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  44 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
  45 | >(({ className, ...props }, ref) => (
  46 |   <ContextMenuPrimitive.SubContent
  47 |     ref={ref}
  48 |     className={cn(
  49 |       "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  50 |       className
  51 |     )}
  52 |     {...props}
  53 |   />
  54 | ))
  55 | ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName
  56 | 
  57 | const ContextMenuContent = React.forwardRef<
  58 |   React.ElementRef<typeof ContextMenuPrimitive.Content>,
  59 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
  60 | >(({ className, ...props }, ref) => (
  61 |   <ContextMenuPrimitive.Portal>
  62 |     <ContextMenuPrimitive.Content
  63 |       ref={ref}
  64 |       className={cn(
  65 |         "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  66 |         className
  67 |       )}
  68 |       {...props}
  69 |     />
  70 |   </ContextMenuPrimitive.Portal>
  71 | ))
  72 | ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName
  73 | 
  74 | const ContextMenuItem = React.forwardRef<
  75 |   React.ElementRef<typeof ContextMenuPrimitive.Item>,
  76 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
  77 |     inset?: boolean
  78 |   }
  79 | >(({ className, inset, ...props }, ref) => (
  80 |   <ContextMenuPrimitive.Item
  81 |     ref={ref}
  82 |     className={cn(
  83 |       "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  84 |       inset && "pl-8",
  85 |       className
  86 |     )}
  87 |     {...props}
  88 |   />
  89 | ))
  90 | ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName
  91 | 
  92 | const ContextMenuCheckboxItem = React.forwardRef<
  93 |   React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  94 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
  95 | >(({ className, children, checked, ...props }, ref) => (
  96 |   <ContextMenuPrimitive.CheckboxItem
  97 |     ref={ref}
  98 |     className={cn(
  99 |       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
 100 |       className
 101 |     )}
 102 |     checked={checked}
 103 |     {...props}
 104 |   >
 105 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
 106 |       <ContextMenuPrimitive.ItemIndicator>
 107 |         <Check className="h-4 w-4" />
 108 |       </ContextMenuPrimitive.ItemIndicator>
 109 |     </span>
 110 |     {children}
 111 |   </ContextMenuPrimitive.CheckboxItem>
 112 | ))
 113 | ContextMenuCheckboxItem.displayName =
 114 |   ContextMenuPrimitive.CheckboxItem.displayName
 115 | 
 116 | const ContextMenuRadioItem = React.forwardRef<
 117 |   React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
 118 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
 119 | >(({ className, children, ...props }, ref) => (
 120 |   <ContextMenuPrimitive.RadioItem
 121 |     ref={ref}
 122 |     className={cn(
 123 |       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
 124 |       className
 125 |     )}
 126 |     {...props}
 127 |   >
 128 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
 129 |       <ContextMenuPrimitive.ItemIndicator>
 130 |         <Circle className="h-4 w-4 fill-current" />
 131 |       </ContextMenuPrimitive.ItemIndicator>
 132 |     </span>
 133 |     {children}
 134 |   </ContextMenuPrimitive.RadioItem>
 135 | ))
 136 | ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName
 137 | 
 138 | const ContextMenuLabel = React.forwardRef<
 139 |   React.ElementRef<typeof ContextMenuPrimitive.Label>,
 140 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
 141 |     inset?: boolean
 142 |   }
 143 | >(({ className, inset, ...props }, ref) => (
 144 |   <ContextMenuPrimitive.Label
 145 |     ref={ref}
 146 |     className={cn(
 147 |       "px-2 py-1.5 text-sm font-semibold text-foreground",
 148 |       inset && "pl-8",
 149 |       className
 150 |     )}
 151 |     {...props}
 152 |   />
 153 | ))
 154 | ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName
 155 | 
 156 | const ContextMenuSeparator = React.forwardRef<
 157 |   React.ElementRef<typeof ContextMenuPrimitive.Separator>,
 158 |   React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
 159 | >(({ className, ...props }, ref) => (
 160 |   <ContextMenuPrimitive.Separator
 161 |     ref={ref}
 162 |     className={cn("-mx-1 my-1 h-px bg-border", className)}
 163 |     {...props}
 164 |   />
 165 | ))
 166 | ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName
 167 | 
 168 | const ContextMenuShortcut = ({
 169 |   className,
 170 |   ...props
 171 | }: React.HTMLAttributes<HTMLSpanElement>) => {
 172 |   return (
 173 |     <span
 174 |       className={cn(
 175 |         "ml-auto text-xs tracking-widest text-muted-foreground",
 176 |         className
 177 |       )}
 178 |       {...props}
 179 |     />
 180 |   )
 181 | }
 182 | ContextMenuShortcut.displayName = "ContextMenuShortcut"
 183 | 
 184 | export {
 185 |   ContextMenu,
 186 |   ContextMenuTrigger,
 187 |   ContextMenuContent,
 188 |   ContextMenuItem,
 189 |   ContextMenuCheckboxItem,
 190 |   ContextMenuRadioItem,
 191 |   ContextMenuLabel,
 192 |   ContextMenuSeparator,
 193 |   ContextMenuShortcut,
 194 |   ContextMenuGroup,
 195 |   ContextMenuPortal,
 196 |   ContextMenuSub,
 197 |   ContextMenuSubContent,
 198 |   ContextMenuSubTrigger,
 199 |   ContextMenuRadioGroup,
 200 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/form.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import * as LabelPrimitive from "@radix-ui/react-label"
   5 | import { Slot } from "@radix-ui/react-slot"
   6 | import {
   7 |   Controller,
   8 |   ControllerProps,
   9 |   FieldPath,
  10 |   FieldValues,
  11 |   FormProvider,
  12 |   useFormContext,
  13 | } from "react-hook-form"
  14 | 
  15 | import { cn } from "@/lib/utils"
  16 | import { Label } from "@/components/ui/label"
  17 | 
  18 | const Form = FormProvider
  19 | 
  20 | type FormFieldContextValue<
  21 |   TFieldValues extends FieldValues = FieldValues,
  22 |   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  23 | > = {
  24 |   name: TName
  25 | }
  26 | 
  27 | const FormFieldContext = React.createContext<FormFieldContextValue>(
  28 |   {} as FormFieldContextValue
  29 | )
  30 | 
  31 | const FormField = <
  32 |   TFieldValues extends FieldValues = FieldValues,
  33 |   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  34 | >({
  35 |   ...props
  36 | }: ControllerProps<TFieldValues, TName>) => {
  37 |   return (
  38 |     <FormFieldContext.Provider value={{ name: props.name }}>
  39 |       <Controller {...props} />
  40 |     </FormFieldContext.Provider>
  41 |   )
  42 | }
  43 | 
  44 | const useFormField = () => {
  45 |   const fieldContext = React.useContext(FormFieldContext)
  46 |   const itemContext = React.useContext(FormItemContext)
  47 |   const { getFieldState, formState } = useFormContext()
  48 | 
  49 |   const fieldState = getFieldState(fieldContext.name, formState)
  50 | 
  51 |   if (!fieldContext) {
  52 |     throw new Error("useFormField should be used within <FormField>")
  53 |   }
  54 | 
  55 |   const { id } = itemContext
  56 | 
  57 |   return {
  58 |     id,
  59 |     name: fieldContext.name,
  60 |     formItemId: `${id}-form-item`,
  61 |     formDescriptionId: `${id}-form-item-description`,
  62 |     formMessageId: `${id}-form-item-message`,
  63 |     ...fieldState,
  64 |   }
  65 | }
  66 | 
  67 | type FormItemContextValue = {
  68 |   id: string
  69 | }
  70 | 
  71 | const FormItemContext = React.createContext<FormItemContextValue>(
  72 |   {} as FormItemContextValue
  73 | )
  74 | 
  75 | const FormItem = React.forwardRef<
  76 |   HTMLDivElement,
  77 |   React.HTMLAttributes<HTMLDivElement>
  78 | >(({ className, ...props }, ref) => {
  79 |   const id = React.useId()
  80 | 
  81 |   return (
  82 |     <FormItemContext.Provider value={{ id }}>
  83 |       <div ref={ref} className={cn("space-y-2", className)} {...props} />
  84 |     </FormItemContext.Provider>
  85 |   )
  86 | })
  87 | FormItem.displayName = "FormItem"
  88 | 
  89 | const FormLabel = React.forwardRef<
  90 |   React.ElementRef<typeof LabelPrimitive.Root>,
  91 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
  92 | >(({ className, ...props }, ref) => {
  93 |   const { error, formItemId } = useFormField()
  94 | 
  95 |   return (
  96 |     <Label
  97 |       ref={ref}
  98 |       className={cn(error && "text-destructive", className)}
  99 |       htmlFor={formItemId}
 100 |       {...props}
 101 |     />
 102 |   )
 103 | })
 104 | FormLabel.displayName = "FormLabel"
 105 | 
 106 | const FormControl = React.forwardRef<
 107 |   React.ElementRef<typeof Slot>,
 108 |   React.ComponentPropsWithoutRef<typeof Slot>
 109 | >(({ ...props }, ref) => {
 110 |   const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
 111 | 
 112 |   return (
 113 |     <Slot
 114 |       ref={ref}
 115 |       id={formItemId}
 116 |       aria-describedby={
 117 |         !error
 118 |           ? `${formDescriptionId}`
 119 |           : `${formDescriptionId} ${formMessageId}`
 120 |       }
 121 |       aria-invalid={!!error}
 122 |       {...props}
 123 |     />
 124 |   )
 125 | })
 126 | FormControl.displayName = "FormControl"
 127 | 
 128 | const FormDescription = React.forwardRef<
 129 |   HTMLParagraphElement,
 130 |   React.HTMLAttributes<HTMLParagraphElement>
 131 | >(({ className, ...props }, ref) => {
 132 |   const { formDescriptionId } = useFormField()
 133 | 
 134 |   return (
 135 |     <p
 136 |       ref={ref}
 137 |       id={formDescriptionId}
 138 |       className={cn("text-[0.8rem] text-muted-foreground", className)}
 139 |       {...props}
 140 |     />
 141 |   )
 142 | })
 143 | FormDescription.displayName = "FormDescription"
 144 | 
 145 | const FormMessage = React.forwardRef<
 146 |   HTMLParagraphElement,
 147 |   React.HTMLAttributes<HTMLParagraphElement>
 148 | >(({ className, children, ...props }, ref) => {
 149 |   const { error, formMessageId } = useFormField()
 150 |   const body = error ? String(error?.message) : children
 151 | 
 152 |   if (!body) {
 153 |     return null
 154 |   }
 155 | 
 156 |   return (
 157 |     <p
 158 |       ref={ref}
 159 |       id={formMessageId}
 160 |       className={cn("text-[0.8rem] font-medium text-destructive", className)}
 161 |       {...props}
 162 |     >
 163 |       {body}
 164 |     </p>
 165 |   )
 166 | })
 167 | FormMessage.displayName = "FormMessage"
 168 | 
 169 | export {
 170 |   useFormField,
 171 |   Form,
 172 |   FormItem,
 173 |   FormLabel,
 174 |   FormControl,
 175 |   FormDescription,
 176 |   FormMessage,
 177 |   FormField,
 178 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/components/ui/carousel.tsx`:

```tsx
   1 | "use client"
   2 | 
   3 | import * as React from "react"
   4 | import useEmblaCarousel, {
   5 |   type UseEmblaCarouselType,
   6 | } from "embla-carousel-react"
   7 | import { ArrowLeft, ArrowRight } from "lucide-react"
   8 | 
   9 | import { cn } from "@/lib/utils"
  10 | import { Button } from "@/components/ui/button"
  11 | 
  12 | type CarouselApi = UseEmblaCarouselType[1]
  13 | type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
  14 | type CarouselOptions = UseCarouselParameters[0]
  15 | type CarouselPlugin = UseCarouselParameters[1]
  16 | 
  17 | type CarouselProps = {
  18 |   opts?: CarouselOptions
  19 |   plugins?: CarouselPlugin
  20 |   orientation?: "horizontal" | "vertical"
  21 |   setApi?: (api: CarouselApi) => void
  22 | }
  23 | 
  24 | type CarouselContextProps = {
  25 |   carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  26 |   api: ReturnType<typeof useEmblaCarousel>[1]
  27 |   scrollPrev: () => void
  28 |   scrollNext: () => void
  29 |   canScrollPrev: boolean
  30 |   canScrollNext: boolean
  31 | } & CarouselProps
  32 | 
  33 | const CarouselContext = React.createContext<CarouselContextProps | null>(null)
  34 | 
  35 | function useCarousel() {
  36 |   const context = React.useContext(CarouselContext)
  37 | 
  38 |   if (!context) {
  39 |     throw new Error("useCarousel must be used within a <Carousel />")
  40 |   }
  41 | 
  42 |   return context
  43 | }
  44 | 
  45 | const Carousel = React.forwardRef<
  46 |   HTMLDivElement,
  47 |   React.HTMLAttributes<HTMLDivElement> & CarouselProps
  48 | >(
  49 |   (
  50 |     {
  51 |       orientation = "horizontal",
  52 |       opts,
  53 |       setApi,
  54 |       plugins,
  55 |       className,
  56 |       children,
  57 |       ...props
  58 |     },
  59 |     ref
  60 |   ) => {
  61 |     const [carouselRef, api] = useEmblaCarousel(
  62 |       {
  63 |         ...opts,
  64 |         axis: orientation === "horizontal" ? "x" : "y",
  65 |       },
  66 |       plugins
  67 |     )
  68 |     const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  69 |     const [canScrollNext, setCanScrollNext] = React.useState(false)
  70 | 
  71 |     const onSelect = React.useCallback((api: CarouselApi) => {
  72 |       if (!api) {
  73 |         return
  74 |       }
  75 | 
  76 |       setCanScrollPrev(api.canScrollPrev())
  77 |       setCanScrollNext(api.canScrollNext())
  78 |     }, [])
  79 | 
  80 |     const scrollPrev = React.useCallback(() => {
  81 |       api?.scrollPrev()
  82 |     }, [api])
  83 | 
  84 |     const scrollNext = React.useCallback(() => {
  85 |       api?.scrollNext()
  86 |     }, [api])
  87 | 
  88 |     const handleKeyDown = React.useCallback(
  89 |       (event: React.KeyboardEvent<HTMLDivElement>) => {
  90 |         if (event.key === "ArrowLeft") {
  91 |           event.preventDefault()
  92 |           scrollPrev()
  93 |         } else if (event.key === "ArrowRight") {
  94 |           event.preventDefault()
  95 |           scrollNext()
  96 |         }
  97 |       },
  98 |       [scrollPrev, scrollNext]
  99 |     )
 100 | 
 101 |     React.useEffect(() => {
 102 |       if (!api || !setApi) {
 103 |         return
 104 |       }
 105 | 
 106 |       setApi(api)
 107 |     }, [api, setApi])
 108 | 
 109 |     React.useEffect(() => {
 110 |       if (!api) {
 111 |         return
 112 |       }
 113 | 
 114 |       onSelect(api)
 115 |       api.on("reInit", onSelect)
 116 |       api.on("select", onSelect)
 117 | 
 118 |       return () => {
 119 |         api?.off("select", onSelect)
 120 |       }
 121 |     }, [api, onSelect])
 122 | 
 123 |     return (
 124 |       <CarouselContext.Provider
 125 |         value={{
 126 |           carouselRef,
 127 |           api: api,
 128 |           opts,
 129 |           orientation:
 130 |             orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
 131 |           scrollPrev,
 132 |           scrollNext,
 133 |           canScrollPrev,
 134 |           canScrollNext,
 135 |         }}
 136 |       >
 137 |         <div
 138 |           ref={ref}
 139 |           onKeyDownCapture={handleKeyDown}
 140 |           className={cn("relative", className)}
 141 |           role="region"
 142 |           aria-roledescription="carousel"
 143 |           {...props}
 144 |         >
 145 |           {children}
 146 |         </div>
 147 |       </CarouselContext.Provider>
 148 |     )
 149 |   }
 150 | )
 151 | Carousel.displayName = "Carousel"
 152 | 
 153 | const CarouselContent = React.forwardRef<
 154 |   HTMLDivElement,
 155 |   React.HTMLAttributes<HTMLDivElement>
 156 | >(({ className, ...props }, ref) => {
 157 |   const { carouselRef, orientation } = useCarousel()
 158 | 
 159 |   return (
 160 |     <div ref={carouselRef} className="overflow-hidden">
 161 |       <div
 162 |         ref={ref}
 163 |         className={cn(
 164 |           "flex",
 165 |           orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
 166 |           className
 167 |         )}
 168 |         {...props}
 169 |       />
 170 |     </div>
 171 |   )
 172 | })
 173 | CarouselContent.displayName = "CarouselContent"
 174 | 
 175 | const CarouselItem = React.forwardRef<
 176 |   HTMLDivElement,
 177 |   React.HTMLAttributes<HTMLDivElement>
 178 | >(({ className, ...props }, ref) => {
 179 |   const { orientation } = useCarousel()
 180 | 
 181 |   return (
 182 |     <div
 183 |       ref={ref}
 184 |       role="group"
 185 |       aria-roledescription="slide"
 186 |       className={cn(
 187 |         "min-w-0 shrink-0 grow-0 basis-full",
 188 |         orientation === "horizontal" ? "pl-4" : "pt-4",
 189 |         className
 190 |       )}
 191 |       {...props}
 192 |     />
 193 |   )
 194 | })
 195 | CarouselItem.displayName = "CarouselItem"
 196 | 
 197 | const CarouselPrevious = React.forwardRef<
 198 |   HTMLButtonElement,
 199 |   React.ComponentProps<typeof Button>
 200 | >(({ className, variant = "outline", size = "icon", ...props }, ref) => {
 201 |   const { orientation, scrollPrev, canScrollPrev } = useCarousel()
 202 | 
 203 |   return (
 204 |     <Button
 205 |       ref={ref}
 206 |       variant={variant}
 207 |       size={size}
 208 |       className={cn(
 209 |         "absolute  h-8 w-8 rounded-full",
 210 |         orientation === "horizontal"
 211 |           ? "-left-12 top-1/2 -translate-y-1/2"
 212 |           : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
 213 |         className
 214 |       )}
 215 |       disabled={!canScrollPrev}
 216 |       onClick={scrollPrev}
 217 |       {...props}
 218 |     >
 219 |       <ArrowLeft className="h-4 w-4" />
 220 |       <span className="sr-only">Previous slide</span>
 221 |     </Button>
 222 |   )
 223 | })
 224 | CarouselPrevious.displayName = "CarouselPrevious"
 225 | 
 226 | const CarouselNext = React.forwardRef<
 227 |   HTMLButtonElement,
 228 |   React.ComponentProps<typeof Button>
 229 | >(({ className, variant = "outline", size = "icon", ...props }, ref) => {
 230 |   const { orientation, scrollNext, canScrollNext } = useCarousel()
 231 | 
 232 |   return (
 233 |     <Button
 234 |       ref={ref}
 235 |       variant={variant}
 236 |       size={size}
 237 |       className={cn(
 238 |         "absolute h-8 w-8 rounded-full",
 239 |         orientation === "horizontal"
 240 |           ? "-right-12 top-1/2 -translate-y-1/2"
 241 |           : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
 242 |         className
 243 |       )}
 244 |       disabled={!canScrollNext}
 245 |       onClick={scrollNext}
 246 |       {...props}
 247 |     >
 248 |       <ArrowRight className="h-4 w-4" />
 249 |       <span className="sr-only">Next slide</span>
 250 |     </Button>
 251 |   )
 252 | })
 253 | CarouselNext.displayName = "CarouselNext"
 254 | 
 255 | export {
 256 |   type CarouselApi,
 257 |   Carousel,
 258 |   CarouselContent,
 259 |   CarouselItem,
 260 |   CarouselPrevious,
 261 |   CarouselNext,
 262 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/hooks/use-mobile.tsx`:

```tsx
   1 | import * as React from "react"
   2 | 
   3 | const MOBILE_BREAKPOINT = 768
   4 | 
   5 | export function useIsMobile() {
   6 |   const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
   7 | 
   8 |   React.useEffect(() => {
   9 |     const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  10 |     const onChange = () => {
  11 |       setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
  12 |     }
  13 |     mql.addEventListener("change", onChange)
  14 |     setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
  15 |     return () => mql.removeEventListener("change", onChange)
  16 |   }, [])
  17 | 
  18 |   return !!isMobile
  19 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/hooks/use-toast.ts`:

```ts
   1 | "use client"
   2 | 
   3 | // Inspired by react-hot-toast library
   4 | import * as React from "react"
   5 | 
   6 | import type {
   7 |   ToastActionElement,
   8 |   ToastProps,
   9 | } from "@/components/ui/toast"
  10 | 
  11 | const TOAST_LIMIT = 1
  12 | const TOAST_REMOVE_DELAY = 1000000
  13 | 
  14 | type ToasterToast = ToastProps & {
  15 |   id: string
  16 |   title?: React.ReactNode
  17 |   description?: React.ReactNode
  18 |   action?: ToastActionElement
  19 | }
  20 | 
  21 | const actionTypes = {
  22 |   ADD_TOAST: "ADD_TOAST",
  23 |   UPDATE_TOAST: "UPDATE_TOAST",
  24 |   DISMISS_TOAST: "DISMISS_TOAST",
  25 |   REMOVE_TOAST: "REMOVE_TOAST",
  26 | } as const
  27 | 
  28 | let count = 0
  29 | 
  30 | function genId() {
  31 |   count = (count + 1) % Number.MAX_SAFE_INTEGER
  32 |   return count.toString()
  33 | }
  34 | 
  35 | type ActionType = typeof actionTypes
  36 | 
  37 | type Action =
  38 |   | {
  39 |       type: ActionType["ADD_TOAST"]
  40 |       toast: ToasterToast
  41 |     }
  42 |   | {
  43 |       type: ActionType["UPDATE_TOAST"]
  44 |       toast: Partial<ToasterToast>
  45 |     }
  46 |   | {
  47 |       type: ActionType["DISMISS_TOAST"]
  48 |       toastId?: ToasterToast["id"]
  49 |     }
  50 |   | {
  51 |       type: ActionType["REMOVE_TOAST"]
  52 |       toastId?: ToasterToast["id"]
  53 |     }
  54 | 
  55 | interface State {
  56 |   toasts: ToasterToast[]
  57 | }
  58 | 
  59 | const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
  60 | 
  61 | const addToRemoveQueue = (toastId: string) => {
  62 |   if (toastTimeouts.has(toastId)) {
  63 |     return
  64 |   }
  65 | 
  66 |   const timeout = setTimeout(() => {
  67 |     toastTimeouts.delete(toastId)
  68 |     dispatch({
  69 |       type: "REMOVE_TOAST",
  70 |       toastId: toastId,
  71 |     })
  72 |   }, TOAST_REMOVE_DELAY)
  73 | 
  74 |   toastTimeouts.set(toastId, timeout)
  75 | }
  76 | 
  77 | export const reducer = (state: State, action: Action): State => {
  78 |   switch (action.type) {
  79 |     case "ADD_TOAST":
  80 |       return {
  81 |         ...state,
  82 |         toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
  83 |       }
  84 | 
  85 |     case "UPDATE_TOAST":
  86 |       return {
  87 |         ...state,
  88 |         toasts: state.toasts.map((t) =>
  89 |           t.id === action.toast.id ? { ...t, ...action.toast } : t
  90 |         ),
  91 |       }
  92 | 
  93 |     case "DISMISS_TOAST": {
  94 |       const { toastId } = action
  95 | 
  96 |       // ! Side effects ! - This could be extracted into a dismissToast() action,
  97 |       // but I'll keep it here for simplicity
  98 |       if (toastId) {
  99 |         addToRemoveQueue(toastId)
 100 |       } else {
 101 |         state.toasts.forEach((toast) => {
 102 |           addToRemoveQueue(toast.id)
 103 |         })
 104 |       }
 105 | 
 106 |       return {
 107 |         ...state,
 108 |         toasts: state.toasts.map((t) =>
 109 |           t.id === toastId || toastId === undefined
 110 |             ? {
 111 |                 ...t,
 112 |                 open: false,
 113 |               }
 114 |             : t
 115 |         ),
 116 |       }
 117 |     }
 118 |     case "REMOVE_TOAST":
 119 |       if (action.toastId === undefined) {
 120 |         return {
 121 |           ...state,
 122 |           toasts: [],
 123 |         }
 124 |       }
 125 |       return {
 126 |         ...state,
 127 |         toasts: state.toasts.filter((t) => t.id !== action.toastId),
 128 |       }
 129 |   }
 130 | }
 131 | 
 132 | const listeners: Array<(state: State) => void> = []
 133 | 
 134 | let memoryState: State = { toasts: [] }
 135 | 
 136 | function dispatch(action: Action) {
 137 |   memoryState = reducer(memoryState, action)
 138 |   listeners.forEach((listener) => {
 139 |     listener(memoryState)
 140 |   })
 141 | }
 142 | 
 143 | type Toast = Omit<ToasterToast, "id">
 144 | 
 145 | function toast({ ...props }: Toast) {
 146 |   const id = genId()
 147 | 
 148 |   const update = (props: ToasterToast) =>
 149 |     dispatch({
 150 |       type: "UPDATE_TOAST",
 151 |       toast: { ...props, id },
 152 |     })
 153 |   const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })
 154 | 
 155 |   dispatch({
 156 |     type: "ADD_TOAST",
 157 |     toast: {
 158 |       ...props,
 159 |       id,
 160 |       open: true,
 161 |       onOpenChange: (open) => {
 162 |         if (!open) dismiss()
 163 |       },
 164 |     },
 165 |   })
 166 | 
 167 |   return {
 168 |     id: id,
 169 |     dismiss,
 170 |     update,
 171 |   }
 172 | }
 173 | 
 174 | function useToast() {
 175 |   const [state, setState] = React.useState<State>(memoryState)
 176 | 
 177 |   React.useEffect(() => {
 178 |     listeners.push(setState)
 179 |     return () => {
 180 |       const index = listeners.indexOf(setState)
 181 |       if (index > -1) {
 182 |         listeners.splice(index, 1)
 183 |       }
 184 |     }
 185 |   }, [state])
 186 | 
 187 |   return {
 188 |     ...state,
 189 |     toast,
 190 |     dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
 191 |   }
 192 | }
 193 | 
 194 | export { useToast, toast }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/hooks/use-search-param.ts`:

```ts
   1 | import { parseAsString, useQueryState } from "nuqs";
   2 | 
   3 | export function useSearchParam() {
   4 |   return useQueryState(
   5 |     "search",
   6 |     parseAsString.withDefault("").withOptions({ clearOnDefault: true })
   7 |   );
   8 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/lib/utils.ts`:

```ts
   1 | import { clsx, type ClassValue } from "clsx"
   2 | import { twMerge } from "tailwind-merge"
   3 | 
   4 | export function cn(...inputs: ClassValue[]) {
   5 |   return twMerge(clsx(inputs))
   6 | }

```

`/Users/arthrod/Library/CloudStorage/GoogleDrive-arthursrodrigues@gmail.com/My Drive/acode/atemp-drive/docx-editor/src/store/use-editor-store.ts`:

```ts
   1 | import { create } from "zustand";
   2 | import { type Editor } from "@tiptap/react";
   3 | 
   4 | interface EditorState {
   5 |   editor: Editor | null;
   6 |   setEditor: (editor: Editor | null) => void;
   7 | }
   8 | 
   9 | export const useEditorStore = create<EditorState>((set) => ({
  10 |   editor: null,
  11 |   setEditor: (editor) => set({ editor }),
  12 | }));

```