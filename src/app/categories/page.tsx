"use client";

import { useState, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function Categories() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, slug, description }),
      });

      const data = await res.json();
      if (data.status === "success") {
        await fetchCategories();
        setName("");
        setSlug("");
        setDescription("");
        alert("Category created successfully!");
      } else {
        alert(data.message || "Error creating category");
      }
    } catch {
      alert("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(generateSlug(value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Categories
          </h1>
          <p className="text-gray-400">
            Organize markets by categories for better discovery
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Category Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <h2 className="text-2xl font-bold mb-6">Create Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category Name *
                </label>
                <input
                  className="w-full p-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Sports, Politics, Technology"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug * (auto-generated)
                </label>
                <input
                  className="w-full p-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="auto-generated-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  className="w-full p-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Brief description of this category"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Category"}
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <h2 className="text-2xl font-bold mb-6">
              All Categories ({categories.length})
            </h2>

            {categories.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-gray-400">No categories yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Create your first category to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-bold text-lg text-white mb-1">
                          {cat.name}
                        </div>
                        <div className="text-xs text-gray-400 mb-2">
                          Slug: <span className="font-mono">{cat.slug}</span>
                        </div>
                        {cat.description && (
                          <div className="text-sm text-gray-500">
                            {cat.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
