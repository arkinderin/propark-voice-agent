import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RandevuForm from "./RandevuForm";

export default function RandevuPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50 py-12 px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Online Randevu</h1>
        <p className="text-center text-gray-500 mb-8">Birkaç adımda randevunuzu oluşturun</p>
        <Suspense fallback={<div className="text-center text-gray-400">Yükleniyor...</div>}>
          <RandevuForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
