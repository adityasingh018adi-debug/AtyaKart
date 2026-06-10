"use client";

import { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2, Plus, X, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

interface AdminProduct {
  id: string;
  category: string;
  brand: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  badge: string;
  emoji: string;
  isNew: boolean;
  tags: string;
  sizes: string;
  description: string;
}

type FormState = {
  category: string;
  brand: string;
  name: string;
  price: string;
  originalPrice: string;
  discountPercent: string;
  rating: string;
  reviewCount: string;
  badge: string;
  emoji: string;
  isNew: boolean;
  tags: string;
  sizes: string;
  description: string;
};

const emptyForm: FormState = {
  category: "men",
  brand: "",
  name: "",
  price: "",
  originalPrice: "",
  discountPercent: "0",
  rating: "4.5",
  reviewCount: "0",
  badge: "",
  emoji: "🛍️",
  isNew: true,
  tags: "",
  sizes: "S, M, L, XL",
  description: "",
};

function toForm(p: AdminProduct): FormState {
  return {
    category: p.category,
    brand: p.brand,
    name: p.name,
    price: String(p.price),
    originalPrice: String(p.originalPrice),
    discountPercent: String(p.discountPercent),
    rating: String(p.rating),
    reviewCount: String(p.reviewCount),
    badge: p.badge,
    emoji: p.emoji,
    isNew: p.isNew,
    tags: (JSON.parse(p.tags || "[]") as string[]).join(", "),
    sizes: (JSON.parse(p.sizes || "[]") as string[]).join(", "),
    description: p.description,
  };
}

function toPayload(f: FormState) {
  return {
    category: f.category,
    brand: f.brand,
    name: f.name,
    price: Number(f.price),
    originalPrice: Number(f.originalPrice),
    discountPercent: Number(f.discountPercent),
    rating: Number(f.rating),
    reviewCount: Number(f.reviewCount),
    badge: f.badge,
    emoji: f.emoji,
    isNew: f.isNew,
    tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
    sizes: f.sizes.split(",").map((t) => t.trim()).filter(Boolean),
    description: f.description,
  };
}

export default function ProductsManager() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data.products);
    } catch {
      setError("Couldn't load products. Make sure you're signed in as an admin.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setCreating(true);
  };

  const startEdit = (p: AdminProduct) => {
    setForm(toForm(p));
    setEditing(p);
    setCreating(true);
  };

  const cancelForm = () => {
    setCreating(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = toPayload(form);
      const res = editing
        ? await fetch(`/api/admin/products/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) throw new Error("Save failed");
      cancelForm();
      await load();
    } catch {
      setError("Couldn't save the product. Please check the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  const generateDescription = async () => {
    if (!form.name) {
      setError("Enter a product name first so AI can write a description.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/ai-product-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          brand: form.brand,
          category: form.category,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("Failed to generate description");
      const data = await res.json();
      setForm((f) => ({ ...f, description: data.description }));
    } catch {
      setError("Couldn't generate a description. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Couldn't delete the product.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-fg/50">{products.length} product{products.length === 1 ? "" : "s"} in catalog</p>
        <Button size="sm" onClick={startCreate}>
          <Plus size={15} />
          Add product
        </Button>
      </div>

      {error && (
        <p className="mt-3 rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary">{error}</p>
      )}

      {creating && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-2xl border border-dark/10 bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-fg">
              {editing ? "Edit product" : "New product"}
            </h2>
            <button type="button" onClick={cancelForm} className="text-fg/40 hover:text-fg">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required className="col-span-2 sm:col-span-1" />
            <Field label="Brand" value={form.brand} onChange={(v) => setForm((f) => ({ ...f, brand: v }))} required />
            <SelectField
              label="Category"
              value={form.category}
              onChange={(v) => setForm((f) => ({ ...f, category: v }))}
              options={["men", "women", "kids", "zeng"]}
            />
            <Field label="Emoji" value={form.emoji} onChange={(v) => setForm((f) => ({ ...f, emoji: v }))} />
            <Field label="Badge" value={form.badge} onChange={(v) => setForm((f) => ({ ...f, badge: v }))} placeholder="e.g. BESTSELLER" />
            <Field label="Price (₹)" type="number" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} required />
            <Field label="Original price (₹)" type="number" value={form.originalPrice} onChange={(v) => setForm((f) => ({ ...f, originalPrice: v }))} required />
            <Field label="Discount %" type="number" value={form.discountPercent} onChange={(v) => setForm((f) => ({ ...f, discountPercent: v }))} />
            <Field label="Rating" type="number" step="0.1" value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
            <Field label="Review count" type="number" value={form.reviewCount} onChange={(v) => setForm((f) => ({ ...f, reviewCount: v }))} />
          </div>

          <Field label="Tags (comma separated)" value={form.tags} onChange={(v) => setForm((f) => ({ ...f, tags: v }))} placeholder="cotton, casual, summer" />
          <Field label="Sizes (comma separated)" value={form.sizes} onChange={(v) => setForm((f) => ({ ...f, sizes: v }))} />

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-xs font-medium text-fg/60">Description</label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={generating}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline disabled:opacity-50"
              >
                <Sparkles size={12} />
                {generating ? "Generating…" : "Generate with AI"}
              </button>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-dark/15 px-3 py-2.5 text-sm text-fg placeholder:text-fg/30 focus:border-primary/50 focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-fg/70">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))}
              className="h-4 w-4 rounded border-dark/30"
            />
            Mark as new arrival
          </label>

          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
            </Button>
            <Button type="button" variant="outline" onClick={cancelForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="mt-4 overflow-hidden rounded-2xl border border-dark/10 bg-surface">
        {loading ? (
          <p className="p-8 text-center text-sm text-fg/40">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="p-8 text-center text-sm text-fg/40">No products yet. Add your first one.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-dark/5 text-xs uppercase tracking-wide text-fg/50">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-dark/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{p.emoji}</span>
                      <div>
                        <p className="font-medium text-fg">{p.name}</p>
                        <p className="text-xs text-fg/40">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-fg/60">{p.category}</td>
                  <td className="px-4 py-3 text-fg/70">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-fg/70">{p.rating.toFixed(1)} ★</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => startEdit(p)}
                        className="rounded-lg p-2 text-fg/50 hover:bg-dark/5 hover:text-fg"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded-lg p-2 text-fg/50 hover:bg-primary/10 hover:text-primary"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  step,
  required,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  step?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-fg/60">{label}</label>
      <input
        type={type}
        step={step}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-dark/15 px-3 py-2.5 text-sm text-fg placeholder:text-fg/30 focus:border-primary/50 focus:outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-fg/60">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-dark/15 bg-surface px-3 py-2.5 text-sm text-fg focus:border-primary/50 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o} className="capitalize">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
