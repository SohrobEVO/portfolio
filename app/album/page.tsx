"use client";

import Link from "next/link";

export default function AlbumPage() {
  // รายชื่อรูปภาพในอัลบั้ม (นำไฟล์รูปไปวางในโฟลเดอร์ public/ แล้วแก้ชื่อไฟล์ตรงนี้)
  const photos = [
    {
      id: "IMG_01",
      src: "/avatar.jpg",
      title: "PROFILE_CAPTURE",
      date: "2026-11-25",
    },
    {
      id: "IMG_02",
      src: "/photo1.jpg",
      title: "WORKSPACE_SETUP",
      date: "2026-10-14",
    },
    {
      id: "IMG_03",
      src: "/photo2.jpg",
      title: "CODING_SESSION",
      date: "2026-09-02",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-zinc-100 selection:bg-white selection:text-black">
      {/* พื้นหลังลายตาราง Grid */}
      <div className="pointer-events-none fixed inset-0 bg-cyber-grid opacity-70" />

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        {/* แถบหัวข้อด้านบน + ปุ่มกดย้อนกลับหน้าแรก */}
        <div className="mb-12 flex items-center justify-between border-b border-zinc-800 pb-6 font-mono text-xs">
          <div>
            <p className="text-zinc-500">DIRECTORY // /ALBUM</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
              VISUAL_ARCHIVE
            </h1>
          </div>

          <Link
            href="/"
            className="border border-zinc-700 bg-zinc-950 px-4 py-2.5 font-bold text-zinc-300 transition-all hover:border-white hover:text-white"
          >
            &lt;- RETURN_HOME
          </Link>
        </div>

        {/* ตารางแสดงรูปภาพ 3 คอลัมน์ */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden border border-zinc-800 bg-[#09090b] p-3 transition-all duration-300 hover:border-white"
            >
              {/* กรอบรูปภาพ (ขาวดำ -> เอาเมาส์ชี้แล้วเป็นภาพสี) */}
              <div className="aspect-square overflow-hidden bg-zinc-900">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>

              {/* ชื่อรูปและวันที่ด้านล่าง */}
              <div className="mt-3 flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-white">{photo.title}</span>
                <span className="text-zinc-500">{photo.date}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}