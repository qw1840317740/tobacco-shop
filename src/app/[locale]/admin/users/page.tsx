"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface Admin {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("admin");
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);
  const [resetTarget, setResetTarget] = useState<Admin | null>(null);
  const [resetPw, setResetPw] = useState("");

  const loadData = useCallback(async () => {
    const res = await fetch("/api/admins");
    if (res.status === 403) { setAdmins([]); setLoading(false); return; }
    const data = await res.json();
    setAdmins(data.admins || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAdd = async () => {
    if (!newUsername || !newPassword) { toast.error("ユーザー名とパスワードは必須です"); return; }
    if (newPassword.length < 6) { toast.error("パスワードは6文字以上必要です"); return; }
    const res = await fetch("/api/admins", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole }),
    });
    if (res.ok) {
      toast.success("管理者を追加しました");
      setShowAdd(false); setNewUsername(""); setNewPassword(""); setNewRole("admin");
      loadData();
    } else {
      const data = await res.json();
      toast.error(data.error || "追加に失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch("/api/admins", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id }),
    });
    if (res.ok) { toast.success("削除しました"); loadData(); }
    else { const data = await res.json(); toast.error(data.error || "削除に失敗しました"); }
    setDeleteTarget(null);
  };

  const handleReset = async () => {
    if (!resetTarget || !resetPw) return;
    if (resetPw.length < 6) { toast.error("パスワードは6文字以上必要です"); return; }
    const res = await fetch("/api/admins", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: resetTarget.id, newPassword: resetPw }),
    });
    if (res.ok) { toast.success("パスワードを変更しました"); }
    else { toast.error("変更に失敗しました"); }
    setResetTarget(null); setResetPw("");
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center text-[#888888]">読み込み中...</div>;
  }

  if (admins.length === 0) {
    return <div className="flex h-96 items-center justify-center text-[#888888]">権限がありません</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">管理者管理</h1>
          <p className="text-sm text-[#888888]">{admins.length} 人の管理者</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white hover:bg-[#333]">
          + 新規管理者
        </button>
      </div>

      {/* Admin Table */}
      <div className="mt-6 overflow-hidden rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F5F5F5]">
            <tr>
              <th className="px-4 py-3 font-medium text-[#333]">ユーザー名</th>
              <th className="px-4 py-3 font-medium text-[#333]">権限</th>
              <th className="px-4 py-3 font-medium text-[#333]">作成日</th>
              <th className="px-4 py-3 font-medium text-[#333] text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-[#F5F5F5]">
                <td className="px-4 py-3 font-medium">{admin.username}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    admin.role === "superadmin" ? "bg-[#C8A97E]/20 text-[#C8A97E]" : "bg-[#F5F5F5] text-[#333]"
                  }`}>
                    {admin.role === "superadmin" ? "スーパー管理者" : "管理者"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#888888]">{new Date(admin.createdAt).toLocaleDateString("ja-JP")}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => { setResetTarget(admin); setResetPw(""); }} className="text-xs text-[#888888] hover:text-[#C8A97E]">パスワード変更</button>
                  {admin.role !== "superadmin" && (
                    <button onClick={() => setDeleteTarget(admin)} className="text-xs text-red-500 hover:text-red-700">削除</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">新規管理者追加</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-[#888888]">ユーザー名</label>
                <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#888888]">パスワード（6文字以上）</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#888888]">権限</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
                  <option value="admin">管理者</option>
                  <option value="superadmin">スーパー管理者</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleAdd} className="flex-1 rounded-lg bg-[#1A1A1A] py-2.5 text-sm font-medium text-white hover:bg-[#333]">追加</button>
                <button onClick={() => setShowAdd(false)} className="flex-1 rounded-lg border py-2.5 text-sm font-medium text-[#333] hover:bg-[#F5F5F5]">キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">パスワード変更</h2>
            <p className="mt-1 text-sm text-[#888888]">「{resetTarget.username}」の新しいパスワード</p>
            <div className="mt-4 space-y-3">
              <input type="password" value={resetPw} onChange={(e) => setResetPw(e.target.value)} placeholder="新しいパスワード（6文字以上）" className="w-full rounded-lg border px-3 py-2 text-sm" />
              <div className="flex gap-3">
                <button onClick={handleReset} className="flex-1 rounded-lg bg-[#1A1A1A] py-2.5 text-sm font-medium text-white hover:bg-[#333]">変更</button>
                <button onClick={() => setResetTarget(null)} className="flex-1 rounded-lg border py-2.5 text-sm font-medium text-[#333]">キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="管理者を削除"
        message={`「${deleteTarget?.username}」を削除しますか？`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
