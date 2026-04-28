import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { ArrowDown, ArrowUp, LogOut, Pencil, Plus, Trash2, X } from "lucide-react";

type Post = {
  id: string;
  type: "video" | "image";
  src: string;
  alt: string | null;
  title: string;
  description: string;
  sort_order: number;
};

type FormState = {
  type: "video" | "image";
  src: string;
  alt: string;
  title: string;
  description: string;
};

const blankForm: FormState = { type: "image", src: "", alt: "", title: "", description: "" };

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(blankForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  const load = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
      return;
    }
    setPosts((data ?? []) as Post[]);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const startNew = () => {
    setEditing(null);
    setForm(blankForm);
    setShowForm(true);
  };

  const startEdit = (p: Post) => {
    setEditing(p);
    setForm({ type: p.type, src: p.src, alt: p.alt ?? "", title: p.title, description: p.description });
    setShowForm(true);
  };

  const cancel = () => {
    setShowForm(false);
    setEditing(null);
    setForm(blankForm);
  };

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setForm((f) => ({ ...f, src: data.publicUrl }));
      toast({ title: "Uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from("posts")
          .update({
            type: form.type,
            src: form.src,
            alt: form.alt || null,
            title: form.title,
            description: form.description,
          })
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const maxOrder = posts.reduce((m, p) => Math.max(m, p.sort_order), 0);
        const { error } = await supabase.from("posts").insert({
          type: form.type,
          src: form.src,
          alt: form.alt || null,
          title: form.title,
          description: form.description,
          sort_order: maxOrder + 10,
        });
        if (error) throw error;
      }
      cancel();
      load();
      toast({ title: "Saved" });
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Post) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const { error } = await supabase.from("posts").delete().eq("id", p.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    load();
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= posts.length) return;
    const a = posts[i];
    const b = posts[j];
    const { error } = await supabase.from("posts").upsert([
      { ...a, sort_order: b.sort_order },
      { ...b, sort_order: a.sort_order },
    ]);
    if (error) {
      toast({ title: "Reorder failed", description: error.message, variant: "destructive" });
      return;
    }
    load();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  if (loading) {
    return <Layout><div className="feed-column py-12">Loading…</div></Layout>;
  }

  if (user && !isAdmin) {
    return (
      <Layout>
        <div className="feed-column py-12">
          <h1 className="font-display text-2xl font-extrabold">Not authorized</h1>
          <p className="mt-2 text-muted-foreground">
            Your account ({user.email}) is signed in but does not have admin access.
            Share this email with the site owner to be granted admin.
          </p>
          <Button onClick={signOut} variant="outline" className="mt-4">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="feed-column py-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-extrabold">Manage Feed</h1>
          <div className="flex gap-2">
            {!showForm && (
              <Button onClick={startNew}>
                <Plus className="mr-2 h-4 w-4" /> New post
              </Button>
            )}
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border border-border/60 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">
                {editing ? "Edit post" : "New post"}
              </h2>
              <Button type="button" variant="ghost" size="sm" onClick={cancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Label>Type</Label>
              <div className="mt-1 flex gap-2">
                <Button
                  type="button"
                  variant={form.type === "image" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setForm({ ...form, type: "image" })}
                >Image</Button>
                <Button
                  type="button"
                  variant={form.type === "video" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setForm({ ...form, type: "video" })}
                >Video</Button>
              </div>
            </div>

            {form.type === "image" ? (
              <div>
                <Label htmlFor="upload">Upload image</Label>
                <Input
                  id="upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
                  disabled={uploading}
                />
                <Label htmlFor="src" className="mt-3 block">Or image URL</Label>
                <Input
                  id="src"
                  value={form.src}
                  onChange={(e) => setForm({ ...form, src: e.target.value })}
                  placeholder="https://…"
                  required
                />
                {form.src && (
                  <img src={form.src} alt="" className="mt-3 max-h-48 rounded-lg" />
                )}
              </div>
            ) : (
              <div>
                <Label htmlFor="src">YouTube ID or URL</Label>
                <Input
                  id="src"
                  value={form.src}
                  onChange={(e) => setForm({ ...form, src: e.target.value })}
                  placeholder="dQw4w9WgXcQ"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="alt">Alt text {form.type === "video" && "(optional)"}</Label>
              <Input id="alt" value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} />
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={6}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saving || uploading}>
                {saving ? "Saving…" : editing ? "Save changes" : "Create post"}
              </Button>
              <Button type="button" variant="outline" onClick={cancel}>Cancel</Button>
            </div>
          </form>
        )}

        <ul className="mt-8 space-y-3">
          {posts.map((p, i) => (
            <li key={p.id} className="flex items-start gap-3 rounded-xl border border-border/60 p-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {p.type === "image" ? (
                  <img src={p.src} alt="" className="h-full w-full object-cover" />
                ) : (
                  <img
                    src={`https://i.ytimg.com/vi/${p.src}/default.jpg`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{p.title}</div>
                <div className="line-clamp-2 text-xs text-muted-foreground">{p.description}</div>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => move(i, -1)} disabled={i === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => move(i, 1)} disabled={i === posts.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(p)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="rounded-xl border border-dashed border-border/60 p-6 text-center text-muted-foreground">
              No posts yet. Click “New post” to add one.
            </li>
          )}
        </ul>
      </div>
    </Layout>
  );
};

export default Admin;
