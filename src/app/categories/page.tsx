"use client";

import { useState, useEffect } from "react";

export default function Categories() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories);
  };

  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories);
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name, slug, description }),
    });
    fetchCategories();
    setName("");
    setSlug("");
    setDescription("");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-3 font-bold">Create Category</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
        <input
          className="p-2 border rounded"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          placeholder="slug {eg. politics"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <textarea
          className="p-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="bg-blue-500 text-white p-2 rounded" type="submit">
          Create
        </button>
      </form>
      <hr className="my-6" />
      <h2 className="text-lg font-semibold mb-3">All Categories</h2>
      <ul>
        {categories.map((cat: any) => (
          <li key={cat.id} className="mb-2">
            {cat.name} - <span className="opacity-70">{cat.slug}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
