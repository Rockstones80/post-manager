// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import {
  createPost,
  deletePost,
  fetchPosts,
  updatePost,
} from "../src/types/api";
import type { NewPost, Post, UpdatePost } from "../src/types/type";
import PostForm from "../src/components/Postform";
import PostList from "../src/components/PostList";
import "./index.css";

type Status = { type: "success" | "error"; message: string } | null;

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<Status>(null);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchPosts(10);
        if (alive) setPosts(data);
      } catch {
        if (alive)
          setStatus({ type: "error", message: "Failed to load posts." });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  function toast(next: Status) {
    setStatus(next);
    if (next) {
      setTimeout(() => setStatus(null), 2500);
    }
  }

  // CREATE (optimistic append)
  async function handleCreate(values: NewPost) {
    const temp: Post = { id: Math.floor(Math.random() * 1000000), ...values };
    setPosts((prev) => [temp, ...prev]);
    try {
      const saved = await createPost(values);
      setPosts((prev) => prev.map((p) => (p.id === temp.id ? saved : p)));
      toast({ type: "success", message: "Post created." });
    } catch {
      setPosts((prev) => prev.filter((p) => p.id !== temp.id));
      toast({ type: "error", message: "Failed to create post." });
    }
  }

  // UPDATE (optimistic replace)
  async function handleUpdate(payload: UpdatePost) {
    const prev = posts;
    setPosts((cur) =>
      cur.map((p) => (p.id === payload.id ? { ...p, ...payload } : p))
    );
    try {
      const saved = await updatePost(payload);
      setPosts((cur) => cur.map((p) => (p.id === payload.id ? saved : p)));
      toast({ type: "success", message: "Post updated." });
    } catch {
      setPosts(prev);
      toast({ type: "error", message: "Failed to update post." });
    }
  }

  // DELETE (optimistic remove)
  async function handleDelete(id: number) {
    const prev = posts;
    setPosts((cur) => cur.filter((p) => p.id !== id));
    try {
      await deletePost(id);
      toast({ type: "success", message: "Post deleted." });
    } catch {
      setPosts(prev);
      toast({ type: "error", message: "Failed to delete post." });
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
    );
  }, [posts, query]);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold text-gray-900">Post Manager</h1>

      {/* Status Message */}
      {status ? (
        <div
          role="status"
          className={`mt-3 rounded-md p-3 text-sm ${
            status.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      {/* Create */}
      <section className="mt-6 card">
        <h2 className="text-xl font-semibold mb-3">Create a new post</h2>
        <PostForm onSubmit={handleCreate} submitLabel="Create" />
      </section>

      {/* Search */}
      <section className="mt-6">
        <input
          className="input"
          placeholder="Search posts by title or body..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </section>

      {/* List */}
      <section className="mt-6">
        <h2 className="sr-only">Posts</h2>
        {loading ? (
          <p className="text-gray-600">Loading posts...</p>
        ) : (
          <PostList
            posts={filtered}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
}
