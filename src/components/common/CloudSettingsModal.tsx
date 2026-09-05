import React, { useState } from 'react';
import {
  X,
  Cloud,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  UploadCloud,
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  SUPABASE_SQL_SETUP,
  syncAllLocalToCloud,
} from '../../services/supabase';
import type { Product } from '../../types/product';

interface CloudSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCloudConnected: boolean;
  onConfigChanged: () => void;
  products: Product[];
  onNotify: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const CloudSettingsModal: React.FC<CloudSettingsModalProps> = ({
  isOpen,
  onClose,
  isCloudConnected,
  onConfigChanged,
  products,
  onNotify,
}) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveSupabaseConfig({ url: url.trim(), anonKey: anonKey.trim() });
    onConfigChanged();
    onNotify(
      'success',
      'Đã lưu thông tin Cloud',
      'Hệ thống đang kết nối và đồng bộ dữ liệu Real-time...'
    );
    onClose();
  };

  const handleDisconnect = () => {
    saveSupabaseConfig({ url: '', anonKey: '' });
    setUrl('');
    setAnonKey('');
    onConfigChanged();
    onNotify('info', 'Đã ngắt kết nối', 'Hệ thống đã chuyển về chế độ lưu trữ LocalStorage.');
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    try {
      await syncAllLocalToCloud(products);
      onNotify(
        'success',
        'Đồng bộ thành công!',
        `Đã tải lên toàn bộ ${products.length} sản phẩm lên cơ sở dữ liệu đám mây.`
      );
    } catch (err: any) {
      console.error(err);
      onNotify('error', 'Lỗi đồng bộ', err.message || 'Không thể đồng bộ dữ liệu lên Cloud.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Đồng Bộ Real-Time Qua Cloud (Supabase)
              </h3>
              <p className="text-xs text-slate-500">
                Chỉnh sửa trên máy này, máy người khác và điện thoại lập tức cập nhật
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status Box */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isCloudConnected
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/60 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${
                  isCloudConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <div>
                <div className="text-xs font-bold">
                  {isCloudConnected
                    ? '🟢 Đã kích hoạt Real-Time Cloud (Supabase)'
                    : '🟡 Đang ở chế độ Offline (LocalStorage)'}
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  {isCloudConnected
                    ? 'Dữ liệu được lưu trữ vĩnh viễn trên đám mây và đồng bộ tức thì giữa các thiết bị.'
                    : 'Mỗi máy/trình duyệt đang lưu độc lập. Kết nối Cloud bên dưới để đồng bộ chung cho mọi người.'}
                </div>
              </div>
            </div>

            {isCloudConnected && (
              <button
                type="button"
                onClick={handleSyncToCloud}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors shrink-0"
                title="Đẩy dữ liệu hiện tại lên Cloud"
              >
                {isSyncing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5" />
                )}
                <span>Đồng bộ kho lên Cloud</span>
              </button>
            )}
          </div>

          {/* Guide Steps */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2.5">
            <div className="font-bold text-slate-800 flex items-center justify-between">
              <span>Hướng dẫn kết nối Supabase (Miễn phí 100% trong 1 phút):</span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 hover:text-brand-800 flex items-center gap-1 font-semibold"
              >
                <span>Mở Supabase.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600 leading-relaxed">
              <li>
                Đăng nhập <strong>Supabase.com</strong> (bằng tài khoản GitHub của bạn) và bấm <strong>New project</strong>.
              </li>
              <li>
                Vào mục <strong>SQL Editor</strong> ở thanh bên trái của Supabase, dán đoạn mã SQL bên dưới rồi bấm <strong>Run</strong>:
              </li>
            </ol>

            {/* SQL Copy Box */}
            <div className="relative mt-2">
              <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-32 border border-slate-800">
                {SUPABASE_SQL_SETUP}
              </pre>
              <button
                type="button"
                onClick={handleCopySql}
                className="absolute top-2 right-2 px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors shadow-sm"
              >
                {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? 'Đã sao chép' : 'Sao chép SQL'}</span>
              </button>
            </div>

            <p className="text-slate-600 mt-2">
              3. Vào mục <strong>Project Settings $\rightarrow$ API</strong> trên Supabase để lấy <strong>Project URL</strong> và <strong>anon / public key</strong> dán vào 2 ô bên dưới:
            </p>
          </div>

          {/* Form Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xxxxxxxxxxxxxxxxxxxx.supabase.co"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Anon / Public API Key
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          {isCloudConnected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
            >
              Ngắt kết nối Cloud
            </button>
          ) : (
            <span className="text-[11px] text-slate-400">
              * Có thể dán cấu hình trên bất kỳ thiết bị nào
            </span>
          )}

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Lưu & Kích hoạt Real-Time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
