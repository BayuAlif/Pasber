// ─── 1. Import kedua component (taruh di atas file) ─────────────────────────
import BookingSuccessPopup, { BookingSuccessData } from "@/app/components/popUp/BookingSuccessPopup";
import BookingFailedPopup from "@/app/components/popUp/BookingFailedPopup";


// ─── 2. Tambah state ini di dalam component ──────────────────────────────────
const [showSuccess, setShowSuccess] = useState(false);
const [showFailed, setShowFailed] = useState(false);
const [failedMessage, setFailedMessage] = useState("");
const [successData, setSuccessData] = useState<BookingSuccessData | undefined>(undefined);


// ─── 3. Ganti handleBooking dengan versi ini ─────────────────────────────────
const handleBooking = async () => {
  try {
    const token = localStorage.getItem("token");
    const bookingDate = new Date(YEAR, selectedMonth, selectedDate);
    const formattedDate =
      `${bookingDate.getFullYear()}-` +
      `${String(bookingDate.getMonth() + 1).padStart(2, "0")}-` +
      `${String(bookingDate.getDate()).padStart(2, "0")} ` +
      `${selectedTime}:00`;

    const keluhanLabel = selectedServices
      .map((sid) => serviceOptions.find((s) => s.id === sid)?.label || "")
      .filter(Boolean)
      .join(", ");

    for (const kendaraanID of selectedVehicleIds) {
      const response = await fetch(`${API_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          kendaraanID,
          bengkel_id: selectedBengkel,
          Keluhan: keluhanLabel,
          jadwalService: formattedDate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setFailedMessage(result.message || "Booking gagal diproses.");
        setShowFailed(true);
        return;
      }
    }

    // Siapkan data untuk popup sukses
    const bengkelNama = bengkels.find((b) => b.id === selectedBengkel)?.nama ?? "-";
    const kendaraanLabel = selectedVehicleList.map((v) => `${v.brand} ${v.model}`).join(", ");
    const tanggalLabel = `${selectedDate} ${months[selectedMonth]} ${YEAR}`;

    setSuccessData({
      bengkel: bengkelNama,
      tanggal: tanggalLabel,
      waktu: selectedTime,
      kendaraan: kendaraanLabel,
      layanan: keluhanLabel,
    });
    setShowSuccess(true);

  } catch (error) {
    console.error(error);
    setFailedMessage("Terjadi kesalahan koneksi. Periksa internet kamu.");
    setShowFailed(true);
  }
};


// ─── 4. Taruh kedua popup ini di dalam return JSX, sebelum </div> penutup ────
<BookingSuccessPopup
  show={showSuccess}
  data={successData}
  onClose={() => setShowSuccess(false)}
  onViewBooking={() => {
    setShowSuccess(false);
    // Ganti dengan router.push("/User/riwayat") kalau mau navigasi
  }}
/>

<BookingFailedPopup
  show={showFailed}
  message={failedMessage}
  onClose={() => setShowFailed(false)}
  onRetry={() => {
    setShowFailed(false);
    handleBooking(); // langsung retry
  }}
/>
