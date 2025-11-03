"use client";

import { useState, useEffect } from "react";

export default function Categories() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    };

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, slug, description }),
    });

    const data = await res.json();
    if (data.status === "success") {
      fetchCategories();
      setName("");
      setSlug("");
      setDescription("");
    } else {
      alert(data.message || "Error creating category");
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-6 font-bold">Categories</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Create Category</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              className="p-2 border border-gray-600 bg-gray-900 text-white rounded"
              placeholder="Category Name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
            <input
              className="p-2 border border-gray-600 bg-gray-900 text-white rounded"
              placeholder="Slug (auto-generated)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
            <textarea
              className="p-2 border border-gray-600 bg-gray-900 text-white rounded"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            <button
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
              type="submit"
            >
              Create Category
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">All Categories</h2>
          {categories.length === 0 && (
            <p className="text-gray-400">No categories yet...</p>
          )}
          <ul className="space-y-2">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {categories.map((cat: any) => (
              <li
                key={cat._id}
                className="border border-gray-700 p-3 rounded hover:bg-gray-900"
              >
                <div className="font-semibold">{cat.name}</div>
                <div className="text-sm text-gray-400">Slug: {cat.slug}</div>
                {cat.description && (
                  <div className="text-sm text-gray-500 mt-1">
                    {cat.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
