"use client";

import { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";
import { Color } from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Image as ImageIcon,
  Code as CodeIcon,
  List as BulletListIcon,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
  FileDown,
  Save,
  Keyboard,
  MoreVertical,
  ChevronDown,
  Folder,
  Type,
} from "lucide-react";
import { Keycap as Kbd } from "keycap";
import { toast } from "react-hot-toast";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  AlertTriangle,
} from "lucide-react";
import BetterImageDropzone from "./ui/BetterImageDropzone";
import { nanoid } from "nanoid";

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
  }),
  Image,
];

const HEADING_LEVELS = [
  { level: 3, label: "Titre 1" },
  { level: 4, label: "Titre 2" },
  { level: 5, label: "Titre 3" },
];

const SHORTCUTS = [
  { keys: ["⌘", "↵"], action: "Saut de ligne" },
  { keys: ["⌘", "B"], action: "Gras" },
  { keys: ["⌘", "I"], action: "Italique" },
  { keys: ["⌘", "S"], action: "Enregistrer" },
  { keys: ["⌘", "Z"], action: "Annuler" },
  { keys: ["⇧", "⌘", "Z"], action: "Rétablir" },
];

function HeadingDropdown({ editor }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (buttonRef.current && !buttonRef.current.contains(e.target))
        setOpen(false);
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLevel = [3, 4, 5].find((l) =>
    editor.isActive("heading", { level: l })
  );

  return (
    <div className="relative" ref={buttonRef}>
      <ToolbarButton
        ariaLabel="Niveaux de titre"
        onClick={() => setOpen((o) => !o)}
        active={!!currentLevel}
      >
        <div className="flex items-center gap-1">
          <Type level={currentLevel} size={18} className="mr-0.5" />
          <ChevronDown size={14} />
        </div>
      </ToolbarButton>
      {open && (
        <div className="absolute z-20 mt-1 w-28 rounded-lg border bg-white p-1 shadow-md">
          {[3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: lvl }).run();
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-neutral-100 ${
                editor.isActive("heading", { level: lvl }) && "bg-neutral-200"
              }`}
            >
              <span className="font-semibold ">
                {lvl === 3 ? "Titre 1" : lvl === 4 ? "Titre 2" : "Titre 3"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function ToolbarButton({ onClick, active, disabled, children, ariaLabel }) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition focus:outline-none disabled:opacity-40 ${
        active ? "bg-neutral-200" : "hover:bg-neutral-100"
      }`}
    >
      {children}
    </button>
  );
}
function ImageButton({ editor }) {
  const inputRef = useRef(null);

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Upload l'image sur le serveur
    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("token");
    const res = await fetch(
      "https://leonardwicki.emf-informatique.ch:8080/api/articles/upload-image",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );
    if (res.ok) {
      const data = await res.json();
      // Insère l'URL absolue pour l'aperçu (dev)
      const backendUrl = "https://leonardwicki.emf-informatique.ch:8080";
      editor
        .chain()
        .focus()
        .setImage({ src: backendUrl + data.url })
        .run();
    } else {
      toast.error("Erreur lors de l'upload de l'image");
    }
    // reset so same file can be selected again
    e.target.value = "";
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={onFileChange}
        hidden
      />
      <ToolbarButton
        ariaLabel="Insérer une image"
        onClick={() => inputRef.current?.click()}
      >
        <ImageIcon size={18} />
      </ToolbarButton>
    </>
  );
}

function FormatBar({ editor }) {
  return (
    <div className="flex flex-wrap gap-1">
      {/* Ajoutez le HeadingDropdown en premier */}
      <HeadingDropdown editor={editor} />

      <ToolbarButton
        ariaLabel="Gras"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        <Bold size={18} />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Italique"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        <Italic size={18} />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Barré"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={18} />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Block de code"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
      >
        <CodeIcon size={18} />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Liste à puces"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        <BulletListIcon size={18} />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Liste numérotée"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        <ListOrdered size={18} />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Citation"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      >
        <Quote size={18} />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Séparateur"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={18} />
      </ToolbarButton>
      <ImageButton editor={editor} />
    </div>
  );
}

function HistoryBar({ editor, onOpenShortcuts }) {
  return (
    <div className="flex gap-1 ml-auto">
      <ToolbarButton
        ariaLabel="Annuler"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo2 size={18} />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Rétablir"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo2 size={18} />
      </ToolbarButton>
      <ToolbarButton ariaLabel="Raccourcis clavier" onClick={onOpenShortcuts}>
        <Keyboard size={18} />
      </ToolbarButton>
    </div>
  );
}

function ShortcutsModal({ show, onClose }) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md mx-auto animate-fade-in"
        style={{ boxShadow: "0 8px 40px 0 rgba(0,0,0,0.25)" }}
      >
        <h2 className="text-lg font-bold mb-4 text-center">
          Raccourcis clavier
        </h2>
        <ul className="space-y-2">
          {SHORTCUTS.map(({ keys, action }) => (
            <li key={action} className="flex justify-between items-center">
              <span className="flex gap-1 flex-wrap">
                {keys.map((k) => (
                  <Kbd key={k}>{k}</Kbd>
                ))}
              </span>
              <span className="text-sm text-neutral-600">{action}</span>
            </li>
          ))}
        </ul>
        <button
          className="mt-6 w-full py-2 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-700"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

export function ArticleEditor({ article, mode, onSave }) {
  const [title, setTitle] = useState(article?.title || "");
  const [content, setContent] = useState(article?.content || "");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverImage, setCoverImage] = useState(article?.coverImage || "");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [tags, setTags] = useState(
    Array.isArray(article?.tags)
      ? article.tags
      : article?.tags && typeof article.tags === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(article.tags);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : []
  );
  const [tagInput, setTagInput] = useState("");
  const [summary, setSummary] = useState(article?.summary || "");

  const editor = useEditor({
    extensions,
    content: content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "tiptap prose max-w-[600px] min-h-0 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && article?.content) editor.commands.setContent(article.content);
    // eslint-disable-next-line
  }, [article?.content]);

  // Correction : lors de l'affichage, si une image commence par /uploads, on préfixe avec https://leonardwicki.emf-informatique.ch:8080
  useEffect(() => {
    if (editor && article?.content) {
      // Remplace les src d'image relatifs par des URLs absolues pour l'aperçu
      let content = article.content;
      content = content.replace(
        /src=["'](\/uploads\/[^"']+)["']/g,
        'src="https://leonardwicki.emf-informatique.ch:8080$1"'
      );
      editor.commands.setContent(content);
    }
    // eslint-disable-next-line
  }, [article?.content]);

  // Helper pour forcer le format YYYY-MM-DD
  const formatDate = (d) => {
    if (!d) return new Date().toISOString().slice(0, 10);
    // Si déjà au format YYYY-MM-DD, on ne touche pas
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    // Si format ISO, on tronque
    return d.slice(0, 10);
  };

  // Récupérer le nom d'utilisateur connecté (stocké dans le localStorage après login)
  const getAuthor = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const parsed = JSON.parse(user);
          return parsed.username || parsed.name || "pierre";
        } catch {
          return user;
        }
      }
    }
    return "pierre";
  };

  // Génère une couleur Tailwind unique par tag
  const TAILWIND_COLORS = [
    { bg: "bg-blue-100", text: "text-blue-800" },
    { bg: "bg-green-100", text: "text-green-800" },
    { bg: "bg-yellow-100", text: "text-yellow-800" },
    { bg: "bg-pink-100", text: "text-pink-800" },
    { bg: "bg-purple-100", text: "text-purple-800" },
    { bg: "bg-red-100", text: "text-red-800" },
    { bg: "bg-indigo-100", text: "text-indigo-800" },
    { bg: "bg-teal-100", text: "text-teal-800" },
    { bg: "bg-orange-100", text: "text-orange-800" },
    { bg: "bg-cyan-100", text: "text-cyan-800" },
    { bg: "bg-fuchsia-100", text: "text-fuchsia-800" },
    { bg: "bg-emerald-100", text: "text-emerald-800" },
    { bg: "bg-rose-100", text: "text-rose-800" },
    { bg: "bg-lime-100", text: "text-lime-800" },
    { bg: "bg-violet-100", text: "text-violet-800" },
  ];
  const tagColor = (tag) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++)
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    const idx = Math.abs(hash) % TAILWIND_COLORS.length;
    return TAILWIND_COLORS[idx];
  };

  // Ajout d'un tag
  const addTag = (val) => {
    const t = val.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };
  // Suppression d'un tag
  const removeTag = (t) => setTags(tags.filter((tag) => tag !== t));

  const handleSave = async (status) => {
    setSaving(true);
    const token = localStorage.getItem("token");
    let dateToSend = new Date();
    if (mode === "edit" && article?.date) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(article.date)) {
        dateToSend = article.date;
      } else {
        dateToSend = new Date(article.date).toISOString().slice(0, 10);
      }
    } else {
      dateToSend = new Date().toISOString().slice(0, 10);
    }
    let coverImageUrl = coverImage;
    // Upload image if new file
    if (coverImageFile) {
      const formData = new FormData();
      formData.append("image", coverImageFile);
      const res = await fetch(
        "https://leonardwicki.emf-informatique.ch:8080/api/articles/upload-image",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (res.ok) {
        const data = await res.json();
        coverImageUrl = data.url;
      } else {
        toast.error("Erreur lors de l'upload de l'image");
        setSaving(false);
        return;
      }
    }
    const payload = {
      title,
      content: editor.getHTML(),
      date: dateToSend,
      author: getAuthor(),
      status,
      coverImage: coverImageUrl,
      tags,
      summary,
    };
    let url = "https://leonardwicki.emf-informatique.ch:8080/api/articles";
    let method = "POST";
    if (mode === "edit" && article?.id) {
      url += `/${article.id}`;
      method = "PUT";
    }
    await toast.promise(
      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }),
      {
        loading: (
          <span className="flex items-center gap-2">
            {mode === "edit"
              ? "Mise à jour de l'article..."
              : "Enregistrement de l'article..."}
          </span>
        ),
        success: (res) => {
          if (!res.ok) throw new Error();
          // Ne ferme la page d'édition que si la sauvegarde a réussi
          if (onSave) onSave();
          return (
            <span className="flex items-center gap-2">
              {mode === "edit"
                ? "Article mis à jour !"
                : "Article enregistré !"}
            </span>
          );
        },
        error: (
          <span className="flex items-center gap-2">
            {mode === "edit"
              ? "Impossible de mettre à jour l'article."
              : "Impossible d'enregistrer l'article."}
          </span>
        ),
      },
      {
        style: { borderRadius: "10px" },
      }
    );
    setSaving(false);
    // On ne ferme plus la page d'édition en cas d'erreur
  };

  const handleExportPDF = async () => {
    if (!editor) return;

    // Dynamically import html2pdf.js only on the client side
    const html2pdf = (await import("html2pdf.js")).default;

    // Create a container for the content to be exported
    const exportContainer = document.createElement("div");

    // Add title with large styling
    const titleElement = document.createElement("h1");
    titleElement.textContent = title || "Untitled Article";
    titleElement.style.color = "#222";
    titleElement.style.textAlign = "center";
    titleElement.style.fontFamily = "Inter";
    titleElement.style.fontSize = "64px";
    titleElement.style.fontStyle = "normal";
    titleElement.style.fontWeight = "600";
    titleElement.style.lineHeight = "100%";
    titleElement.style.letterSpacing = "-2.24px";
    titleElement.style.marginBottom = "84px";
    exportContainer.appendChild(titleElement);

    // Add content - clone the editor content
    const contentElement = document.createElement("div");
    contentElement.innerHTML = editor.getHTML();

    // Add styles for code blocks, ordered and unordered lists
    const styles = document.createElement("style");
    styles.textContent = `
      pre { 
        background-color: #f5f5f5;
        padding: 16px;
        border-radius: 4px;
        font-family: monospace;
      }
      code {
        font-family: monospace;
        background-color: #f5f5f5;
        padding: 2px 4px;
      }
      ol {
        list-style-type: decimal;
        padding-left: 20px;
      }
      ul {
        list-style-type: disc;
        padding-left: 20px;
      }
      h1 {
        color: #222;
        font-size: 2em;
        margin-top: 0.67em;
        margin-bottom: 0.67em;
        font-weight: bold;
      }
      h2 {
        color: #222;
        font-size: 1.5em;
        margin-top: 0.83em;
        margin-bottom: 0.83em;
        font-weight: bold;
      }
      h3 {
        color: #222;
        font-size: 1.17em;
        margin-top: 1em;
        margin-bottom: 1em;
        font-weight: bold;
      }
      h4 {
        color: #222;
        font-size: 1em;
        margin-top: 1.33em;
        margin-bottom: 1.33em;
        font-weight: bold;
      }
      h5 {
        color: #222;
        font-size: 0.83em;
        margin-top: 1.67em;
        margin-bottom: 1.67em;
        font-weight: bold;
      }
      h6 {
        color: #222;
        font-size: 0.67em;
        margin-top: 2.33em;
        margin-bottom: 2.33em;
        font-weight: bold;
      }
    `;
    exportContainer.appendChild(styles);
    exportContainer.appendChild(contentElement);

    // Apply some basic styling
    exportContainer.style.padding = "20px";
    exportContainer.style.maxWidth = "800px";
    exportContainer.style.margin = "0 auto";

    // Configure PDF options
    const options = {
      margin: [15, 15],
      filename: `${title || "article"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generate PDF
    html2pdf().from(exportContainer).set(options).save();
  };
  function OptionsMenu({ onExportPDF }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
      function handleClickOutside(e) {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      }
      window.addEventListener("mousedown", handleClickOutside);
      return () => window.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-3.5 bg-white rounded-2xl font-semibold hover:bg-neutral-100 inline-flex justify-center items-center"
          aria-label="Options"
        >
          <MoreVertical size={20} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <ul className="py-1">
              <li>
                <button
                  onClick={() => {
                    onExportPDF();
                    setIsOpen(false);
                  }}
                  className="w-full text-left font-semibold  px-4 py-2 hover:bg-neutral-100 flex items-center gap-2"
                >
                  <FileDown size={18} />
                  <span>PDF</span>
                  <span className="inline-flex items-center font-semibold px-2 py-0.5 rounded text-xs  bg-neutral-100 text-neutral-600">
                    BETA
                  </span>{" "}
                </button>
              </li>
              {/* Vous pourrez ajouter d'autres options ici */}
            </ul>
          </div>
        )}
      </div>
    );
  }

  useEffect(() => {
    const saveShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        // Call your save logic here
        console.log("Save article");
      }
    };
    document.addEventListener("keydown", saveShortcut);
    return () => document.removeEventListener("keydown", saveShortcut);
  }, []);

  // Calcul de la taille de l'article en octets et du nombre de caractères
  const articleHtml = editor?.getHTML() || "";
  const articleSizeBytes = new Blob([articleHtml]).size;
  let sizeDisplay = "";
  if (articleSizeBytes < 1024) {
    sizeDisplay = articleSizeBytes + " octets";
  } else if (articleSizeBytes < 1024 * 1024) {
    sizeDisplay =
      (articleSizeBytes / 1024).toLocaleString("fr-CH", {
        maximumFractionDigits: 2,
      }) + " Ko";
  } else {
    sizeDisplay =
      (articleSizeBytes / (1024 * 1024)).toLocaleString("fr-CH", {
        maximumFractionDigits: 2,
      }) + " Mo";
  }
  const maxSizeMB = 2;
  const sizeExceeded = articleSizeBytes > maxSizeMB * 1024 * 1024;
  // Calcul du nombre de caractères (texte brut sans balises HTML)
  const plainText = articleHtml.replace(/<[^>]+>/g, "");
  const charCount = plainText.length;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-0 min-h-[600px]">
      <BetterImageDropzone
        value={coverImageFile || coverImage}
        onChange={(file) => {
          setCoverImageFile(file);
          if (typeof file === "string") setCoverImage(file);
        }}
        onRemove={() => {
          setCoverImage("");
          setCoverImageFile(null);
        }}
        label="Déposez une image de couverture ici ou cliquez pour importer"
        height={240}
      />
      {/* Zone tags */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => {
            const color = tagColor(tag);
            return (
              <span
                key={tag}
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${color.bg} ${color.text}`}
              >
                {tag}
                <button
                  type="button"
                  className="ml-1 hover:text-red-500"
                  onClick={() => removeTag(tag)}
                  aria-label={`Supprimer le tag ${tag}`}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
        <input
          type="text"
          className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
          placeholder="Ajouter un tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(tagInput);
            }
          }}
        />
      </div>
      {/* Titre */}
      <input
        className="w-full text-4xl font-semibold mb-6 placeholder:text-neutral-400 focus:outline-none bg-transparent"
        placeholder="Titre de l'article…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* Sous-titre */}
      <textarea
        className="w-full focus:outline-none focus:ring-0 border border-[#C5C5C5] px-3 py-2 rounded-lg focus:ring-blue-200 text-base mb-6 bg-neutral-50 resize-y min-h-[48px] max-h-[180px]"
        placeholder="Sous-titre"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        maxLength={255}
        rows={5}
      />
      <div className="w-full flex justify-end mb-2">
        <span
          className={`text-xs select-none ${
            summary.length >= 255
              ? "text-red-600 font-semibold"
              : "text-neutral-400"
          }`}
          title="Nombre de caractères du sous-titre"
        >
          {summary.length}/255 caractères
        </span>
      </div>
      {/* Toolbar */}
      {editor && (
        <div className="flex items-center gap-2 mb-4 flex-wrap border-b pb-3">
          <FormatBar editor={editor} />
          <HistoryBar
            editor={editor}
            onOpenShortcuts={() => setShowShortcuts(true)}
          />
        </div>
      )}
      {/* Zone de rédaction très grande, non scrollable, hauteur auto */}
      <div
        className="focus:outline-none cursor-text bg-neutral-50 px-6 py-4 mb-4  hover:shadow-lg transition-shadow"
        tabIndex={0}
        style={{ cursor: "text", minHeight: 400 }}
        onClick={() => editor && editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
      {/* Boutons d'action sous les zones de texte */}
      <div className="w-full bg-white pt-2 flex flex-col gap-1 z-10 mt-0 items-end">
        <div className="flex flex-row flex-wrap w-full justify-end gap-3 items-center">
          <span
            className={`text-sm mr-auto ml-1 select-none ${
              sizeExceeded ? "text-red-600 font-semibold" : "text-neutral-400"
            }`}
            title="Taille de l'article (HTML envoyé à l'API)"
          >
            Taille de l'article : {sizeDisplay}
          </span>
          <button
            onClick={() => handleSave("draft")}
            className="px-5 py-3.5 bg-white rounded-2xl font-semibold hover:bg-neutral-100 border border-black/10 inline-flex justify-center items-center gap-2"
            disabled={saving}
          >
            <Folder size={20} />
            Brouillons
          </button>
          <button
            onClick={() => handleSave("published")}
            className="px-5 py-3.5 bg-neutral-900 text-white rounded-2xl font-semibold hover:bg-neutral-800 inline-flex justify-center items-center gap-2"
            disabled={saving}
          >
            <Save size={20} />
            Publier
          </button>
          <OptionsMenu onExportPDF={handleExportPDF} />
        </div>
        <span className="text-xs text-neutral-400 mt-1 mr-auto ml-1 select-none">
          Nombre de caractères : {charCount.toLocaleString("fr-CH")}
        </span>
      </div>
      <ShortcutsModal
        show={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
