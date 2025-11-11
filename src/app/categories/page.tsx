"use client";

import { useState, useEffect } from "react";
import { Tag, PlusCircle, Loader2, FolderKanban } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (res.ok) {
        setNewCategory("");
        await fetchCategories();
      }
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-300">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 
            className="text-5xl md:text-6xl font-bold mb-4 text-neon-green"
            style={{ textShadow: '0 0 10px hsl(var(--neon-green)), 0 0 20px hsl(var(--neon-green))' }}
          >
            Categories
          </h1>
          <p className="text-lg text-slate-400">Organize and manage market categories</p>
        </div>

        {/* Create Category Form */}
        <div className="bg-secondary/30 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-neon-green/20 mb-10 shadow-[0_0_20px_hsl(var(--neon-green)/0.1)]">
          <h2 className="text-2xl font-bold text-neon-green mb-5 flex items-center gap-3">
            <PlusCircle size={24} />
            Create New Category
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category name..."
              className="flex-1 px-5 py-3 bg-background/50 border-2 border-slate-700 rounded-xl focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none transition-all duration-300 placeholder-slate-500"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting || !newCategory.trim()}
              className="px-8 py-3 bg-neon-green text-background font-bold rounded-xl transition-all duration-300 ease-in-out
                         hover:bg-white hover:shadow-[0_0_20px_hsl(var(--neon-green))]
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neon-green disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl border border-slate-800/50 shadow-lg">
          <div className="px-6 py-4 border-b border-slate-800/50">
            <h2 className="text-xl font-bold text-slate-200">All Categories ({categories.length})</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-neon-green animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 px-6">
              <FolderKanban className="mx-auto text-slate-600 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-slate-300 mb-2">No Categories Found</h3>
              <p className="text-slate-500">Get started by creating your first category above.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="px-6 py-5 hover:bg-background/30 transition-colors duration-200 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-slate-200 text-lg">{category.name}</h3>
                    <p className="text-sm text-slate-400 mt-1 bg-background/40 px-3 py-1 rounded-full inline-block font-mono">{category.slug}</p>
                  </div>
                  <div className="text-sm font-semibold text-neon-green bg-neon-green/10 px-4 py-2 rounded-full flex items-center gap-2">
                    <Tag size={16} />
                    <span>Category</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
