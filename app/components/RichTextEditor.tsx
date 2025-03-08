"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write a detailed description...",
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      // Link.configure({
      //   openOnClick: false,
      //   HTMLAttributes: {
      //     class: 'text-primary underline',
      //   },
      // }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 flex flex-wrap gap-2 items-center border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted-foreground/20" : ""}
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted-foreground/20" : ""}
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-muted-foreground/20"
              : ""
          }
          type="button"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-muted-foreground/20"
              : ""
          }
          type="button"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList") ? "bg-muted-foreground/20" : ""
          }
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList") ? "bg-muted-foreground/20" : ""
          }
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={editor.isActive("link") ? "bg-muted-foreground/20" : ""}
          type="button"
        >
          <LinkIcon className="h-4 w-4" />
        </Button> */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {showLinkInput && (
        <div className="p-2 bg-muted flex gap-2 items-center">
          <input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 p-1 text-sm border rounded"
            onKeyDown={(e) => e.key === "Enter" && addLink()}
          />
          <Button size="sm" onClick={addLink} type="button">
            Add
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowLinkInput(false)}
            type="button"
          >
            Cancel
          </Button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none bg-white"
      />
      <style jsx global>{`
        .ProseMirror {
          min-height: 200px;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        /* List styling */
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin: 0.5em 0;
        }

        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin: 0.5em 0;
        }

        .ProseMirror li {
          margin-bottom: 0.25em;
        }

        /* Heading styling */
        .ProseMirror h1 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 1em 0 0.5em;
        }

        .ProseMirror h2 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 1em 0 0.5em;
        }
      `}</style>
    </div>
  );
}

export function RichTextContent({ content }: { content: string }) {
  return (
    <div
      className="prose prose-sm max-w-none rich-text-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

// Add global styles for the rich text content display
// This ensures that the content is displayed correctly when viewed
export function RichTextStyles() {
  return (
    <style jsx global>{`
      .rich-text-content ul {
        list-style-type: disc;
        padding-left: 1.5em;
        margin: 0.5em 0;
      }

      .rich-text-content ol {
        list-style-type: decimal;
        padding-left: 1.5em;
        margin: 0.5em 0;
      }

      .rich-text-content li {
        margin-bottom: 0.25em;
      }

      .rich-text-content h1 {
        font-size: 1.5em;
        font-weight: bold;
        margin: 1em 0 0.5em;
      }

      .rich-text-content h2 {
        font-size: 1.25em;
        font-weight: bold;
        margin: 1em 0 0.5em;
      }
    `}</style>
  );
}
