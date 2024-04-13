'use client';

import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';

import { UploadDropzone } from '@/lib/uploadthing';

import '@uploadthing/react/styles.css';

interface FileUploadProps {
  onChange: (file?: { name: string; url: string }) => void;
  value: { name: string; url: string };
  // endpoint matches the key in ourFileRouter created in app/api/uploadthing/core.ts
  endpoint: 'messageFile' | 'serverImage';
  setError: (isError: string) => void;
}

export const FileUpload = ({ onChange, value, endpoint, setError }: FileUploadProps) => {
  const fileType = value?.name.split('.').pop();

  if (value.name && value.url && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value.url} alt={value.name} className="rounded-full" />
        <button
          onClick={() => onChange({ name: '', url: '' })}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X 
            onClick={() => setError("Attachment is required")}
            className="h-4 w-4" 
          />
        </button>
      </div>
    );
  }

  if (value.name && value.url && fileType === 'pdf') {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value.name}
        </a>
        <button
          onClick={() => onChange({ name: '', url: '' })}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X 
            onClick={() => setError("Attachment is required")}
            className="h-4 w-4" 
          />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res: any) => {
        if (res && res.length > 0) {
          setError("");
          onChange({ name: res[0].name, url: res[0].url });
        } else {
          setError("Attachment is required");
        }
      }}
      onUploadError={(error: Error) => {
        setError(error.message);
        console.log(error);
      }}
    />
  );
};
