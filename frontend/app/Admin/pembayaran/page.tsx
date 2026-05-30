'use client';

import { useState, useEffect, FC } from 'react';
import {
  Receipt, AlertCircle, BarChart3, Search, Filter,
  ChevronLeft, ChevronRight, Bell, Car, Wrench, Package,
  Plus, Minus, X, ChevronDown, Send, Save,
} from 'lucide-react';
import SidebarAdmin from '../../components/sidebar-admin/page';
import AuthPopup from "@/app/components/auth_popup/Auth_popup";
// ─────────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────

type InvoiceStatus =
  | "pending"
  | "belum_lunas"
  | "lunas";
type ViewMode = 'list' | 'create';
type ItemTab = 'jasa' | 'material';

interface Invoice {
  id: number;
  noNota: string;
  customerName: string;
  kendaraan: string;
  tanggal: string;
  jam: string;
  total: number;
  status: InvoiceStatus;
}

interface NotaJasa {
  id: number;
  deskripsi: string;
  biaya: number;
}

interface NotaMaterial {
  id: number;          // id frontend
  materialID: number;  // id database
  namaItem: string;
  qty: number;
  satuan: string;
  hargaSatuan: number;
}

interface InventoryItem {
  id: number;
  sku: string;
  nama: string;
  harga: number;
  stok: number;
  satuan: string;
}

interface CartItem {
  item: InventoryItem;
  qty: number;
}

interface JasaRow {
  deskripsi: string;
  biaya: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatRp(val: number): string {
  if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(2).replace('.', ',')} Jt`;
  return `Rp ${val.toLocaleString('id-ID')}`;
}

function formatRpFull(val: number): string {
  return `Rp ${val.toLocaleString('id-ID')}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TambahItemModal  (Image 3 & 4)
// ─────────────────────────────────────────────────────────────────────────────

interface TambahItemModalProps {
  inventoryItems: InventoryItem[];
  onClose: () => void;
  onAddJasa: (items: NotaJasa[]) => void;
  onAddMaterial: (items: NotaMaterial[]) => void;
}

const TambahItemModal: FC<TambahItemModalProps> = ({
  inventoryItems,
  onClose,
  onAddJasa,
  onAddMaterial,
}) => {
  // ── State ──
  const [activeTab, setActiveTab] = useState<ItemTab>('jasa');

  // Jasa tab state
  const [jasaRows, setJasaRows] = useState<JasaRow[]>([{ deskripsi: '', biaya: '' }]);

  // Material tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  // ── Jasa handlers ──
  const updateJasaRow = (idx: number, field: keyof JasaRow, value: string): void => {
    setJasaRows(prev => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  };

  const addJasaRow = (): void => {
    setJasaRows(prev => [...prev, { deskripsi: '', biaya: '' }]);
  };

  const validJasaRows = jasaRows.filter(r => r.deskripsi.trim() && Number(r.biaya) > 0);
  const jasaEstimasi = jasaRows.reduce((acc, r) => acc + Number(r.biaya || 0), 0);

  const handleConfirmJasa = (): void => {
    if (!validJasaRows.length) return;
    onAddJasa(
      validJasaRows.map((r, i) => ({
        id: Date.now() + i,
        deskripsi: r.deskripsi,
        biaya: Number(r.biaya),
      }))
    );
    onClose();
  };

  // ── Material handlers ──
  const filteredItems = inventoryItems.filter(
    (item) =>
      (item.nama ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.sku ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const getQty = (id: number): number => cart.find(c => c.item.id === id)?.qty ?? 0;

  const adjustQty = (item: InventoryItem, delta: number): void => {
    setCart(prev => {
      const found = prev.find(c => c.item.id === item.id);
      const newQty = (found?.qty ?? 0) + delta;
      if (newQty <= 0) return prev.filter(c => c.item.id !== item.id);
      if (found) return prev.map(c => (c.item.id === item.id ? { ...c, qty: newQty } : c));
      return [...prev, { item, qty: 1 }];
    });
  };

  const cartSubtotal = cart.reduce((acc, c) => acc + c.item.harga * c.qty, 0);

  const handleConfirmMaterial = (): void => {
    if (!cart.length) return;
    onAddMaterial(
      cart.map(c => ({
        id: Date.now() + c.item.id,
        materialID: c.item.id,
        namaItem: c.item.nama,
        qty: c.qty,
        satuan: c.item.satuan,
        hargaSatuan: c.item.harga,
      }))
    );
    onClose();
  };



  // ── Render ──
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-4xl mx-4 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/20 flex items-center justify-center">
              <Package size={15} className="text-orange-500" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">
              Tambah Item Inventory
            </h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 px-8 pt-5 pb-0 shrink-0">
          {(['jasa', 'material'] as ItemTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                ? 'bg-orange-600 text-white'
                : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                }`}
            >
              {tab === 'jasa' ? 'Jasa/Labour' : 'Material'}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden mt-4">

          {activeTab === 'jasa' ? (
            // ─── Jasa/Labour tab ───────────────────────────────────────────
            <>
              {/* Left: input form */}
              <div className="flex-1 px-8 py-5 border-r border-white/[0.06] overflow-y-auto flex flex-col gap-5">
                {jasaRows.map((row, idx) => (
                  <div key={idx} className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Deskripsi Jasa
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Masukkan deskripsi pekerjaan..."
                        value={row.deskripsi}
                        onChange={e => updateJasaRow(idx, 'deskripsi', e.target.value)}
                        className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-orange-500/50 resize-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                        Biaya Jasa (Rp)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold select-none">
                          Rp
                        </span>
                        <input
                          type="number"
                          placeholder="0"
                          value={row.biaya}
                          onChange={e => updateJasaRow(idx, 'biaya', e.target.value)}
                          className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-orange-500/50 transition-colors"
                        />
                      </div>
                    </div>
                    {idx < jasaRows.length - 1 && (
                      <div className="border-b border-white/[0.06]" />
                    )}
                  </div>
                ))}

                <button
                  onClick={addJasaRow}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-orange-600 hover:bg-orange-500 rounded-lg text-xs font-black uppercase tracking-widest text-white transition-all"
                >
                  <Plus size={14} />
                  Add Service
                </button>
              </div>

              {/* Right: jasa summary */}
              <div className="w-72 px-6 py-5 flex flex-col gap-4 shrink-0">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                  Ringkasan Jasa
                </p>

                <div className="flex-1 space-y-2 overflow-y-auto">
                  {validJasaRows.length === 0 ? (
                    <p className="text-gray-600 text-xs text-center pt-6">
                      Belum ada jasa ditambahkan
                    </p>
                  ) : (
                    validJasaRows.map((r, i) => (
                      <div key={i} className="bg-white/[0.04] rounded-xl p-4">
                        <p className="text-sm font-semibold text-white">{r.deskripsi}</p>
                        <p className="text-xs text-orange-400 mt-1 font-bold">
                          {formatRpFull(Number(r.biaya))}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {jasaEstimasi > 0 && (
                  <div className="border-t border-white/[0.06] pt-4">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                      Total Estimasi Harga
                    </p>
                    <p className="text-2xl font-black text-orange-500">
                      {formatRpFull(jasaEstimasi)}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleConfirmJasa}
                  disabled={validJasaRows.length === 0}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all"
                >
                  Tambahkan ke Nota
                </button>
              </div>
            </>
          ) : (
            // ─── Material tab ──────────────────────────────────────────────
            <>
              {/* Left: search + item list */}
              <div className="flex-1 px-6 py-5 border-r border-white/[0.06] flex flex-col gap-4">
                <div className="relative shrink-0">
                  <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Cari Nama Part atau Kode SKU..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-orange-500/40 transition-colors"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                  {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2">
                      <Package size={24} className="text-gray-700" />
                      <p className="text-gray-600 text-sm">
                        {searchQuery ? 'Tidak ada hasil' : 'Belum ada data inventory'}
                      </p>
                    </div>
                  ) : (
                    filteredItems.map(item => {
                      const qty = getQty(item.id);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 px-4 py-3 bg-white/[0.03] rounded-xl hover:bg-white/[0.05] transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                            <Package size={14} className="text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{item.nama}</p>
                            <p className="text-[10px] text-gray-500 font-mono">{item.sku}</p>
                            <p className="text-[10px] text-green-400 font-bold">
                              STOCK: {item.stok} {item.satuan.toUpperCase()}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-white shrink-0">
                            {formatRpFull(item.harga)}
                          </p>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => adjustQty(item, -1)}
                              disabled={qty === 0}
                              className="w-8 h-8 rounded-lg bg-white/[0.08] hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-all"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-5 text-center text-sm font-bold text-white">
                              {qty}
                            </span>
                            <button
                              onClick={() => adjustQty(item, 1)}
                              className="w-8 h-8 rounded-lg bg-orange-600 hover:bg-orange-500 flex items-center justify-center transition-all"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right: cart summary */}
              <div className="w-72 px-5 py-5 flex flex-col gap-4 shrink-0">
                <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
                  {cart.length === 0 ? (
                    <p className="text-gray-600 text-xs text-center pt-8">
                      Belum ada item dipilih
                    </p>
                  ) : (
                    cart.map(c => (
                      <div key={c.item.id}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white leading-snug">{c.item.nama}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {formatRpFull(c.item.harga)} × {c.qty}
                            </p>
                            <p className="text-xs font-black text-orange-400 mt-0.5">
                              {formatRpFull(c.item.harga * c.qty)}
                            </p>
                          </div>
                          <button
                            onClick={() => setCart(prev => prev.filter(x => x.item.id !== c.item.id))}
                            className="text-[9px] font-bold text-red-400 hover:text-red-300 uppercase tracking-widest shrink-0 mt-0.5"
                          >
                            HAPUS
                          </button>
                        </div>
                        <div className="border-b border-white/[0.06] mt-2" />
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                      Subtotal
                    </p>
                    <p className="text-xl font-black text-orange-500">{formatRpFull(cartSubtotal)}</p>
                  </div>
                )}

                <button
                  onClick={handleConfirmMaterial}
                  disabled={cart.length === 0}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all"
                >
                  Tambahkan ke Nota
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CreateInvoiceView  (Image 2)
// ─────────────────────────────────────────────────────────────────────────────

interface CreateInvoiceViewProps {
  onBack: () => void;
}

const CreateInvoiceView: FC<CreateInvoiceViewProps> = ({
  onBack
}) => {
  // ── State ──
  const [notaJasa, setNotaJasa] = useState<NotaJasa[]>([]);
  const [notaMaterial, setNotaMaterial] = useState<NotaMaterial[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [workOrders, setWorkOrders] = useState<WorkOrderData[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  const [selectedWO, setSelectedWO] =
    useState<WorkOrderData | null>(null);

  const [popupOpen, setPopupOpen] = useState(false);

  const [popupType, setPopupType] =
    useState<"success" | "error">("error");

  const [popupTitle, setPopupTitle] = useState("");

  const [popupMessage, setPopupMessage] = useState("");

  // ── Derived totals ──
  const subtotalJasa = notaJasa.reduce((acc, j) => acc + j.biaya, 0);
  const subtotalMaterial = notaMaterial.reduce((acc, m) => acc + m.qty * m.hargaSatuan, 0);
  const totalTagihan = subtotalJasa + subtotalMaterial;

  // ── Handlers ──
  const handleAddJasa = async (items: NotaJasa[]) => {
    try {
      const token = localStorage.getItem("token");

      for (const item of items) {
        const response = await fetch(
          "http://localhost:8000/api/detail-nota-jasa",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              WOID: selectedWO?.id,
              namaJasa: item.deskripsi,
              hargaJasa: item.biaya,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Gagal menyimpan jasa");
        }
      }

      setNotaJasa(prev => [...prev, ...items]);

    } catch (error) {
      console.error(error);

      setPopupType("error");
      setPopupTitle("Gagal");
      setPopupMessage("Jasa gagal ditambahkan.");
      setPopupOpen(true);
    }
  };
  const handleAddMaterial = async (items: NotaMaterial[]) => {
    try {
      const token = localStorage.getItem("token");

      for (const item of items) {

        console.log({
          WOID: selectedWO?.id,
          materialID: item.materialID,
          qty: item.qty,
        });

        const response = await fetch(
          "http://localhost:8000/api/detail-nota-material",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              WOID: selectedWO?.id,
              materialID: item.materialID,
              qty: item.qty,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData);

          throw new Error("Gagal menyimpan material");
        }
      }

      setNotaMaterial(prev => [...prev, ...items]);
      console.log("MATERIAL =", items);

    } catch (error) {
      console.error(error);

      setPopupType("error");
      setPopupTitle("Gagal");
      setPopupMessage("Material gagal ditambahkan.");
      setPopupOpen(true);
    }
  };
  const handleTerbitkanNTA = async () => {
    if (!selectedWO) {
      setPopupType("error");
      setPopupTitle("Work Order Belum Dipilih");
      setPopupMessage("Silakan pilih Work Order terlebih dahulu.");
      setPopupOpen(true);
      return;
    }

    if (notaJasa.length === 0 && notaMaterial.length === 0) {
      setPopupType("error");
      setPopupTitle("Nota Masih Kosong");
      setPopupMessage(
        "Tambahkan minimal satu jasa atau material sebelum menerbitkan NTA."
      );
      setPopupOpen(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");


      const response = await fetch(
        `http://localhost:8000/api/nota/terbitkan/${selectedWO.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setPopupType("success");
      setPopupTitle("NTA Berhasil");
      setPopupMessage("Nota berhasil diterbitkan.");
      setPopupOpen(true);

    } catch (error) {
      setPopupType("error");
      setPopupTitle("Gagal");
      setPopupMessage("Terjadi kesalahan saat menerbitkan NTA.");
      setPopupOpen(true);
    }
  };
  const removeJasa = (id: number) => setNotaJasa(prev => prev.filter(j => j.id !== id));
  const removeMaterial = (id: number) => setNotaMaterial(prev => prev.filter(m => m.id !== id));



  interface WorkOrderData {
    id: number;
    status: string;


    created_at: string;
    updated_at: string;

    booking: {
      user: {
        name: string;
      };

      kendaraan: {
        merek: string;
        model: string;
      };
    };

    mekanik: {
      nama: string;
    };
  }

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:8000/api/material",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        console.log(data);

        setInventoryItems(data.data || data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMaterial();
  }, []);

  useEffect(() => {
    const fetchWO = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/work-order-selesai",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("WO RESPONSE =", data);
      console.log("IS ARRAY =", Array.isArray(data));
      setWorkOrders(data);
    };

    fetchWO();
  }, []);

  // ── Render ──
  return (
    <div className="flex-1 overflow-y-auto px-8 pb-10">
      {showModal && (
        <TambahItemModal
          inventoryItems={inventoryItems}
          onClose={() => setShowModal(false)}
          onAddJasa={handleAddJasa}
          onAddMaterial={handleAddMaterial}
        />
      )}

      <p className="text-xs text-gray-500 mb-5">Berdasarkan Work Order yang telah selesai</p>

      {/* ── WO Reference Card ── */}
      <div className="bg-[#161b22] border border-white/[0.08] rounded-xl px-6 py-5 mb-6 grid grid-cols-4 gap-6 items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500/20 flex items-center justify-center shrink-0">
            <Wrench size={17} className="text-orange-500" />
          </div>
          <div>
            <select
              onChange={(e) => {
                const wo = workOrders.find(
                  (item) => item.id === Number(e.target.value)
                );

                setSelectedWO(wo ?? null);;
              }}
            >
              <option>Pilih Work Order</option>

              {workOrders.map((wo) => (
                <option key={wo.id} value={wo.id}>
                  WO-{wo.id}
                </option>
              ))}
            </select>
            <p className="text-sm font-bold text-white">  {selectedWO
              ? selectedWO.booking.user.name
              : "-"
            }</p>
            <p className="text-[10px] text-gray-600">Nomor Referensi Work Order</p>
          </div>
        </div>
        <div className="border-l border-white/[0.08] pl-6">
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            Customer & Unit
          </p>
          <h3 className="font-semibold text-white">
            {selectedWO?.booking?.user?.name ?? "-"}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {selectedWO
              ? `${selectedWO.booking.kendaraan.merek} ${selectedWO.booking.kendaraan.model}`
              : "-"}
          </p>
        </div>
        <div className="border-l border-white/[0.08] pl-6">
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            Tanggal Selesai
          </p>

          <h3 className="font-semibold text-white">
            {selectedWO?.updated_at
              ? new Date(selectedWO.updated_at).toLocaleDateString("id-ID")
              : "-"}
          </h3>
        </div>
        <div className="border-l border-white/[0.08] pl-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">M</span>
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Mekanik</p>
            <p className="text-sm font-bold text-white">{selectedWO
              ? selectedWO.mekanik.nama
              : "-"
            }</p>
          </div>
        </div>
      </div>

      {/* ── Two column layout ── */}
      <div className="flex gap-6 items-start">

        {/* Left: nota sections */}
        <div className="flex-1 space-y-5 min-w-0">
          <div className="flex justify-end items-center mb-4">

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              + Tambah Item
            </button>
          </div>

          {/* Nota Jasa */}
          <div className="bg-[#161b22] border border-white/[0.08] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Wrench size={14} className="text-orange-500" />
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Nota Jasa</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 text-[10px] font-bold text-orange-400 hover:text-orange-300 transition-colors"
              >

              </button>
            </div>

            {notaJasa.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-gray-600 text-sm">Belum ada jasa ditambahkan</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    <th className="px-6 py-3 text-left text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      Deskripsi Pekerjaan
                    </th>
                    <th className="px-6 py-3 text-right text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      Biaya Jasa
                    </th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {notaJasa.map(j => (
                    <tr key={j.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-6 py-4 text-sm text-white">{j.deskripsi}</td>
                      <td className="px-6 py-4 text-sm text-right text-white">{formatRpFull(j.biaya)}</td>
                      <td className="pr-4">
                        <button
                          onClick={() => removeJasa(j.id)}
                          className="text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <X size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-right">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mr-4">
                        Subtotal Jasa
                      </span>
                      <span className="text-sm font-black text-orange-500">
                        {formatRpFull(subtotalJasa)}
                      </span>
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Nota Material */}
          <div className="bg-[#161b22] border border-white/[0.08] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Package size={14} className="text-orange-400" />
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Nota Material</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 text-[10px] font-bold text-orange-400 hover:text-orange-300 transition-colors"
              >

              </button>
            </div>

            {notaMaterial.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-gray-600 text-sm">Belum ada material ditambahkan</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {['Nama Item', 'QTY', 'Satuan', 'Harga/Satuan', 'Subtotal', ''].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {notaMaterial.map(m => (
                    <tr key={m.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-6 py-4 text-sm font-semibold text-white">{m.namaItem}</td>
                      <td className="px-6 py-4 text-sm text-white">{m.qty}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{m.satuan}</td>
                      <td className="px-6 py-4 text-sm text-white">{formatRpFull(m.hargaSatuan)}</td>
                      <td className="px-6 py-4 text-sm text-white">{formatRpFull(m.qty * m.hargaSatuan)}</td>
                      <td className="pr-4">
                        <button
                          onClick={() => removeMaterial(m.id)}
                          className="text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <X size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-right">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mr-4">
                        Subtotal Material
                      </span>
                      <span className="text-sm font-black text-orange-500">
                        {formatRpFull(subtotalMaterial)}
                      </span>
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Ringkasan Tagihan */}
        <div className="w-72 shrink-0">
          <div className="bg-[#161b22] border border-white/[0.08] rounded-xl p-6 sticky top-4">
            <h3 className="text-base font-black text-white mb-5">Ringkasan Tagihan</h3>

            <div className="space-y-3 pb-4 mb-4 border-b border-dashed border-white/[0.08]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Subtotal Jasa</span>
                <span className="text-sm text-white font-semibold">{formatRpFull(subtotalJasa)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Subtotal Material</span>
                <span className="text-sm text-white font-semibold">{formatRpFull(subtotalMaterial)}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Tagihan</p>
              <p className="text-3xl font-black text-orange-500">{formatRpFull(totalTagihan)}</p>
              <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                Harga termasuk PPN 11% dan biaya layanan bengkel.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleTerbitkanNTA}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-600 hover:bg-orange-500 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all"
              >
                <Send size={13} />
                Terbitkan NTA
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-3.5 border border-white/[0.08] hover:border-white/20 rounded-xl text-xs font-black uppercase tracking-widest text-white/70 hover:text-white transition-all">
                <Save size={13} />
                Simpan Draft
              </button>
              <button
                onClick={onBack}
                className="w-full py-3 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
      <AuthPopup
        open={popupOpen}
        type={popupType}
        title={popupTitle}
        message={popupMessage}
        onClose={() => setPopupOpen(false)}
        onContinue={() => {
          setPopupOpen(false);

          if (popupType === "success") {
            onBack();
          }
        }}
      />
    </div>

  );

};

// ─────────────────────────────────────────────────────────────────────────────
// Main Page  (Image 1)
// ─────────────────────────────────────────────────────────────────────────────

export default function InvoicePembayaran() {
  // ── State ──
  const [view, setView] = useState<ViewMode>('list');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [inventoryItems] = useState<InventoryItem[]>([]); // populated from API
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedNota, setSelectedNota] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const ITEMS_PER_PAGE = 10;


  const handleDetailNota = async (id: number) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8000/api/nota/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("STATUS =", response.status);

      const result = await response.json();

      console.log("RESULT =", result);

      if (!result.nota) {
        console.error("NOTA TIDAK ADA", result);
        return;
      }

      setSelectedNota(result);
      setShowDetailModal(true);
    } catch (error) {
      console.error(error);
    }
  };
  // ── Derived ──
  const totalNota = invoices.length;
  const menungguPembayaran = invoices.filter(i => i.status === 'belum_lunas').length;
  const totalPemasukan = invoices.filter(i => i.status === 'lunas').reduce((acc, i) => acc + i.total, 0);
  const belumLunas = invoices.filter(i => i.status === 'belum_lunas').reduce((acc, i) => acc + i.total, 0);

  const filtered = invoices.filter(i => {
    const matchSearch =
      i.noNota.toLowerCase().includes(search.toLowerCase()) ||
      i.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Status' || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = (val: string): void => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleStatusFilter = (val: string): void => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  interface DetailJasa {
    id: number;
    namaJasa: string;
    hargaJasa: string;
  }

  interface DetailMaterial {
    id: number;
    qty: number;
    material: {
      namaMaterial: string;
      harga: number;
    };
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          'http://localhost:8000/api/nota',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          }
        );

        const result = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedInvoices: Invoice[] = result.data.map((item: any) => ({
          id: item.id,

          noNota: `NTA-${item.id.toString().padStart(5, "0")}`,

          customerName:
            item.work_order?.booking?.user?.name ?? "-",

          kendaraan:
            `${item.work_order?.booking?.kendaraan?.merek ?? ""} ${item.work_order?.booking?.kendaraan?.model ?? ""
            }`,

          tanggal: item.tanggal,

          jam: "",

          total: Number(item.totalHarga),

          status: item.status as InvoiceStatus,

        }));

        setInvoices(mappedInvoices);

      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);




  // ── Shared page shell ──
  const shell = (children: React.ReactNode) => (
    <div
      className="flex h-screen overflow-hidden bg-[#0f1117] text-[#e2e8f0]"
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <SidebarAdmin />
      <main className="flex-1 overflow-y-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-5 shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Invoice &amp; Pembayaran</h1>
            <p className="text-gray-500 text-xs mt-0.5">Kelola Jadwal Booking</p>
          </div>
          <button className="w-9 h-9 rounded-lg bg-[#161b22] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <Bell size={16} />
          </button>
        </div>
        {children}
      </main>
    </div>
  );

  // ── Create view ──
  if (view === 'create') {
    return shell(
      <CreateInvoiceView
        onBack={() => setView("list")}
      />
    );
  }



  // ── List view ──
  return shell(
    <>
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-8 pb-5 shrink-0">

        {/* Total Nota */}
        <div className="bg-[#161b22] border border-white/[0.08] rounded-xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Total Nota</p>
            <p className="text-3xl font-black text-white">{totalNota}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Receipt size={18} className="text-orange-500" />
          </div>
        </div>

        {/* Menunggu Pembayaran */}
        <div className="bg-[#161b22] border border-white/[0.08] rounded-xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              Menunggu Pembayaran
            </p>
            <p className="text-3xl font-black text-white">{menungguPembayaran}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <AlertCircle size={18} className="text-yellow-500" />
          </div>
        </div>

        {/* Pemasukan & Piutang */}
        <div className="bg-[#161b22] border border-white/[0.08] rounded-xl px-6 py-5 flex items-center justify-between">
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Total Pemasukan
              </p>
              <p className="text-xl font-black text-orange-500">{formatRp(totalPemasukan)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Belum Lunas
              </p>
              <p className="text-xl font-black text-orange-400">{formatRp(belumLunas)}</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BarChart3 size={18} className="text-blue-400" />
          </div>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="mx-8 mb-8 bg-[#161b22] border border-white/[0.08] rounded-xl flex flex-col">

        {/* Search & Filter toolbar */}
        <div className="px-6 py-5 border-b border-white/[0.05]">
          {/* Label row */}
          <div className="flex items-center gap-3 mb-2">
            <p className="flex-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              Search Records
            </p>
            <p className="shrink-0 w-44 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              Status Filter
            </p>
            <div className="shrink-0 w-[274px]" />
          </div>

          {/* Input row */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative min-w-0">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Cari nota atau nama"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-orange-500/40 transition-colors"
              />
            </div>

            {/* Status select */}
            <div className="shrink-0 w-44 relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="belum_lunas">Belum Lunas</option>
                <option value="lunas">Lunas</option>
              </select>
              
              
            </div>

            {/* Apply Filters */}
            <button className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 active:scale-95 rounded-lg text-xs font-black uppercase tracking-widest text-white transition-all whitespace-nowrap">
              <Filter size={12} />
              Apply Filters
            </button>

            {/* Buat NTA */}
            <button
              onClick={() => setView('create')}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 active:scale-95 rounded-lg text-xs font-black uppercase tracking-widest text-white transition-all whitespace-nowrap"
            >
              <Plus size={12} />
              Buat NTA
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1.2fr_2fr_1.2fr_1.2fr_1fr_0.8fr] gap-4 px-6 py-3 border-b border-white/[0.05]">
          {['No. Nota', 'Customer & Kendaraan', 'Tanggal', 'Total', 'Status', 'Aksi'].map(h => (
            <p key={h} className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{h}</p>
          ))}
        </div>

        {/* Table Body */}
        <div className="flex-1">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                <Receipt size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Belum ada data invoice</p>
              <p className="text-gray-700 text-xs">Data akan muncul setelah ada booking yang selesai</p>
            </div>
          ) : (
            paginated.map(inv => (
              <div
                key={inv.id}
                className={`grid grid-cols-[1.2fr_2fr_1.2fr_1.2fr_1fr_0.8fr] gap-4 px-6 py-4 items-center border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors ${inv.status === 'belum_lunas' ? 'border-l-2 border-l-orange-500' : ''
                  }`}
              >
                <p className="text-sm font-semibold text-white">{inv.noNota}</p>

                <div>
                  <p className="text-sm font-bold text-white">{inv.customerName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Car size={10} className="text-gray-600" />
                    <p className="text-[11px] text-gray-500">{inv.kendaraan}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-white">{inv.tanggal}</p>
                  <p className="text-[11px] text-gray-500">{inv.jam}</p>
                </div>

                <p className={`text-sm font-bold ${inv.status === 'belum_lunas' ? 'text-orange-400' : 'text-white'}`}>
                  {formatRpFull(inv.total)}
                </p>

                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${inv.status === "lunas"
                    ? "bg-green-500/15 text-green-400 border border-green-500/20"
                    : inv.status === "belum_lunas"
                      ? "bg-red-500/15 text-red-400 border border-red-500/20"
                      : "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                    }`}
                >
                  {inv.status === "belum_lunas"
                    ? "Belum Lunas"
                    : inv.status === "lunas"
                      ? "Lunas"
                      : "Pending"}
                </span>

                <button
                  onClick={() => {
                    console.log("ID =", inv.id);
                    handleDetailNota(inv.id);
                  }}
                  className="text-white font-semibold hover:text-orange-400"
                >
                  DETAIL
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.05]">
          <p className="text-[11px] text-gray-500">
            Showing{' '}
            <span className="text-white font-semibold">{filtered.length}</span> of{' '}
            <span className="text-white font-semibold">{invoices.length}</span> bookings
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg bg-[#0d1117] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === p
                  ? 'bg-orange-600 text-white'
                  : 'bg-[#0d1117] border border-white/[0.08] text-gray-400 hover:text-white'
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg bg-[#0d1117] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
      {showDetailModal && selectedNota && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-[#111827] border border-white/10 rounded-2xl overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Detail Nota
                </h2>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-orange-500 font-semibold">

                    NTA-{selectedNota.nota.id.toString().padStart(5, "0")}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedNota.nota.status === "lunas"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-orange-500/20 text-orange-400"
                      }`}
                  >
                    {selectedNota.nota.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="text-white text-2xl hover:text-orange-500"
              >
                ✕
              </button>
            </div>

            {/* INFO */}
            <div className="grid md:grid-cols-3 gap-6 p-6 border-b border-white/10">
              <div>
                <p className="text-gray-400 text-sm">Customer</p>
                <p className="text-white font-semibold mt-1">
                  {selectedNota.nota.work_order.booking.user.name}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Kendaraan</p>
                <p className="text-white font-semibold mt-1">
                  {selectedNota.nota.work_order.booking.kendaraan.merek}
                  {" "}
                  {selectedNota.nota.work_order.booking.kendaraan.model}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Tanggal</p>
                <p className="text-white font-semibold mt-1">
                  {selectedNota.nota.tanggal}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-8 max-h-[500px] overflow-y-auto">

              {/* JASA */}
              <div>
                <h3 className="text-orange-500 font-bold mb-4">
                  JASA / SERVICES
                </h3>

                <div className="space-y-3">
                  {selectedNota.jasa.map((jasa: DetailJasa) => (
                    <div
                      key={jasa.id}
                      className="flex justify-between border-b border-white/5 pb-2"
                    >
                      <span className="text-white">
                        {jasa.namaJasa}
                      </span>

                      <span className="text-white">
                        Rp {Number(jasa.hargaJasa).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4 text-orange-400 font-bold">
                  <span>Subtotal Jasa</span>

                  <span>
                    Rp{" "}
                    {selectedNota.jasa
                      .reduce(
                        (sum: number, item: DetailJasa) =>
                          sum + Number(item.hargaJasa),
                        0
                      )
                      .toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* MATERIAL */}
              <div>
                <h3 className="text-orange-500 font-bold mb-4">
                  MATERIAL
                </h3>

                <div className="space-y-3">
                  {selectedNota.material.map((item: DetailMaterial) => (
                    <div
                      key={item.id}
                      className="flex justify-between border-b border-white/5 pb-2"
                    >
                      <div>
                        <p className="text-white font-medium">
                          {item.material.namaMaterial}
                        </p>

                        <p className="text-gray-400 text-sm">
                          {item.qty} x Rp{" "}
                          {Number(item.material.harga).toLocaleString(
                            "id-ID"
                          )}
                        </p>
                      </div>

                      <span className="text-white">
                        Rp{" "}
                        {(
                          item.qty *
                          Number(item.material.harga)
                        ).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4 text-orange-400 font-bold">
                  <span>Subtotal Material</span>

                  <span>
                    Rp{" "}
                    {selectedNota.material
                      .reduce(
                        (sum: number, item: DetailMaterial) =>
                          sum + item.qty * Number(item.material.harga),
                        0
                      )
                      .toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* TOTAL */}
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
                <p className="text-center text-gray-400 text-sm">
                  GRAND TOTAL
                </p>

                <h2 className="text-center text-4xl font-bold text-orange-500 mt-2">
                  Rp{" "}
                  {Number(
                    selectedNota.nota.totalHarga
                  ).toLocaleString("id-ID")}
                </h2>
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl"
              >
                Cetak Nota
              </button>

              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 border border-white/20 text-white py-3 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>

        </div>

      )}

    </>
  );

}

