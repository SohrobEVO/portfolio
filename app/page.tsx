// บังคับให้ไฟล์นี้ทำงานฝั่ง Browser (Client Component) เพราะมีการใช้ useState, useEffect และจับการขยับเมาส์
"use client";

// นำเข้า Hook พื้นฐานของ React:
// - useState: เก็บค่าที่เปลี่ยนแปลงได้บนหน้าจอ (เช่น พิกัดเมาส์, เวลา, ข้อความใน Terminal)
// - useEffect: สั่งให้โค้ดทำงานอัตโนมัติ (เช่น นาฬิกาเดินทุกวินาที)
// - useRef: ใช้อ้างอิงตำแหน่งของ Element บนหน้าจอ (ใช้เลื่อนแชท Terminal ลงล่างสุด)
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  // 1. State เก็บตำแหน่งเมาส์ (แกน X และ Y) เริ่มต้นที่ 0, 0
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 2. State เก็บเวลาปัจจุบันสำหรับแสดงบนแถบด้านบน
  const [time, setTime] = useState<string>("");

  // 3. State เก็บข้อความที่ผู้ใช้กำลังพิมพ์ในช่อง Terminal
  const [terminalInput, setTerminalInput] = useState("");

  // 4. State เก็บประวัติคำสั่งและผลลัพธ์ทั้งหมดใน Terminal (รูปแบบ Array ของ Object)
  const [terminalHistory, setTerminalHistory] = useState<
    { cmd: string; out: string }[]
  >([
    {
      cmd: "whoami",
      out: "sohrob@dev — Full-Stack Developer & Systems Architect",
    },
    {
      cmd: "status",
      out: "[OK] All systems operational. Type 'help' for commands.",
    },
  ]);

  // ตัวอ้างอิงจุดล่างสุดของกล่อง Terminal เพื่อสั่ง Scroll อัตโนมัติ
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Effect 1: สร้างนาฬิกา Real-time อัปเดตทุกๆ 1,000 มิลลิวินาที (1 วินาที)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date(); // ดึงเวลาปัจจุบันจากเครื่องผู้ใช้
      // แปลงเวลาเป็นรูปแบบ 24 ชั่วโมง (เช่น 14:30:05)
      setTime(now.toLocaleTimeString("en-GB", { hour12: false }));
    };
    updateClock(); // เรียกทำงานทันที 1 ครั้งตอนเปิดเว็บ
    const interval = setInterval(updateClock, 1000); // ตั้งเวลาให้ทำงานซ้ำทุก 1 วิ
    return () => clearInterval(interval); // ล้างตัวจับเวลาทิ้งเมื่อปิดหน้าเว็บ (ป้องกันเมมโมรีรั่ว)
  }, []);

  // Effect 2: ทุกครั้งที่ terminalHistory เปลี่ยนแปลง ให้เลื่อนจอ Terminal ลงล่างสุดอัตโนมัติ
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  // ฟังก์ชันอัปเดตพิกัดเมาส์ทุกครั้งที่ผู้ใช้ขยับเมาส์บนหน้าเว็บ
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // ฟังก์ชันประมวลผลคำสั่งเมื่อผู้ใช้กด Enter ในกล่อง Terminal
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชเวลา Submit Form
    const raw = terminalInput.trim(); // ตัดช่องว่างหน้า-หลังข้อความออก
    const cmd = raw.toLowerCase();    // แปลงเป็นตัวพิมพ์เล็กทั้งหมดเพื่อให้เช็กคำสั่งง่ายขึ้น
    if (!cmd) return;                 // ถ้าไม่ได้พิมพ์อะไรเลย ให้จบการทำงาน

    let output = "";
    // ตรวจสอบว่าผู้ใช้พิมพ์คำสั่งอะไรเข้ามา
    switch (cmd) {
      case "help":
        output = "Available commands: whoami, skills, projects, contact, clear";
        break;
      case "whoami":
        output = "Sohrob — Software Engineer specializing in Next.js, TypeScript & Scalable Web Systems.";
        break;
      case "skills":
        output = "Core Stack: Next.js 16, React, TypeScript, Node.js, Tailwind CSS, Docker, Git.";
        break;
      case "projects":
        output = "Loaded 4 featured builds below. Scroll down or click #projects to inspect.";
        break;
      case "contact":
        output = "Email: your.email@example.com | GitHub: github.com/sohrob";
        break;
      case "clear":
        setTerminalHistory([]); // ล้างประวัติใน Terminal ทั้งหมด
        setTerminalInput("");   // ล้างช่องพิมพ์
        return;
      default:
        // กรณีพิมพ์คำสั่งที่ไม่มีในระบบ
        output = `Command not found: '${raw}'. Type 'help' for available commands.`;
    }

    // นำคำสั่งใหม่และผลลัพธ์ไปต่อท้ายประวัติเดิม (...prev)
    setTerminalHistory((prev) => [...prev, { cmd: raw, out: output }]);
    // ล้างช่องพิมพ์ให้ว่างพร้อมรับคำสั่งถัดไป
    setTerminalInput("");
  };

  // ข้อมูลโปรเจกต์ทั้งหมด (แก้ไขชื่อ, คำอธิบาย, แท็ก และลิงก์ GitHub ได้ตรงนี้)
  const projects = [
    {
      id: "01",
      title: "NEURAL_DASHBOARD",
      category: "FULL-STACK / REAL-TIME",
      description:
        "High-frequency telemetry and analytics dashboard engineered with Next.js App Router, WebSockets, and zero-latency UI updates.",
      tags: ["Next.js", "TypeScript", "WebSockets"],
      link: "https://github.com",
    },
    {
      id: "02",
      title: "CIPHER_AUTH_CORE",
      category: "SECURITY / BACKEND",
      description:
        "Zero-trust authentication microservice featuring JWT rotation, rate-limiting middleware, and encrypted session storage.",
      tags: ["Node.js", "Security", "REST API"],
      link: "https://github.com",
    },
    {
      id: "03",
      title: "KINETIC_COMMERCE",
      category: "WEB ARCHITECTURE",
      description:
        "Minimalist headless storefront optimized for 100/100 Lighthouse performance, edge caching, and seamless checkout.",
      tags: ["React", "Tailwind", "Edge"],
      link: "https://github.com",
    },
    {
      id: "04",
      title: "CLI_DEPLOY_ENGINE",
      category: "DEVOPS / AUTOMATION",
      description:
        "Automated build and deployment pipeline tool reducing container rollout times by 65% across cloud environments.",
      tags: ["TypeScript", "CLI", "Docker"],
      link: "https://github.com",
    },
  ];

  // ข้อมูลทักษะแบ่งตามหมวดหมู่ (แก้ไขหรือเพิ่มทักษะของตัวเองได้ตรงนี้)
  const skillGroups = [
    {
      label: "FRONTEND // UI",
      items: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "HTML5 / CSS3"],
    },
    {
      label: "BACKEND // DATA",
      items: ["Node.js", "REST APIs", "PostgreSQL", "Prisma", "Authentication"],
    },
    {
      label: "DEVOPS // TOOLS",
      items: ["Git & GitHub", "Docker", "Linux CLI", "Vercel", "CI/CD"],
    },
  ];

  // ส่วนแสดงผล HTML/JSX บนหน้าจอ
  return (
    // กล่องครอบนอกสุด: ดักจับการขยับเมาส์ (onMouseMove) และกำหนดสีพื้นหลังดำสนิท
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#050505] font-sans text-zinc-100 selection:bg-white selection:text-black"
    >
      {/* เลเยอร์ 1: พื้นหลังลายตารางวิศวกรรม (เรียกใช้คลาส .bg-cyber-grid จาก globals.css) */}
      <div className="pointer-events-none fixed inset-0 bg-cyber-grid opacity-70" />

      {/* เลเยอร์ 2: วงแสง Spotlight สีขาวจางๆ ที่วิ่งตามพิกัดเมาส์ (mousePos.x, mousePos.y) */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.08), transparent 75%)`,
        }}
      />

      {/* เลเยอร์ 3: แถบเมนูด้านบนแบบ HUD (sticky top-0 = เกาะติดขอบบนตลอดเวลาที่เลื่อนหน้าจอ) */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#050505]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5 font-mono text-xs">
          {/* ชื่อระบบด้านซ้าย + จุดสี่เหลี่ยมกระพริบ */}
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 animate-pulse bg-white" />
            <span className="font-bold tracking-widest text-white">
              SOHROB.SYS
            </span>
            <span className="hidden text-zinc-600 sm:inline">
              // V2.0.26
            </span>
          </div>

          {/* ลิงก์เมนูตรงกลาง กดแล้วเลื่อนไปยังส่วนต่างๆ ของหน้า (#projects, #skills, #contact) */}
          <nav className="flex items-center gap-6 text-zinc-400">
            <a href="#projects" className="transition-colors hover:text-white">
              [01.PROJECTS]
            </a>
            <a href="#skills" className="transition-colors hover:text-white">
              [02.STACK]
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              [03.CONTACT]
            </a>
          </nav>

          {/* แสดงพิกัดเมาส์ X/Y และเวลาปัจจุบันด้านขวา (ซ่อนบนจอมือถือด้วย hidden md:flex) */}
          <div className="hidden items-center gap-4 text-zinc-500 md:flex">
            <span>
              X:{mousePos.x.toString().padStart(4, "0")} Y:
              {mousePos.y.toString().padStart(4, "0")}
            </span>
            <span className="text-zinc-300">{time || "00:00:00"}</span>
          </div>
        </div>
      </header>

      {/* ส่วนเนื้อหาหลักตรงกลางหน้าเว็บ (จำกัดความกว้างสูงสุด max-w-5xl) */}
      <main className="relative z-20 mx-auto flex max-w-5xl flex-col gap-28 px-6 py-16">
        
        {/* =========================================================
            SECTION 1: HERO (ส่วนแนะนำตัวด้านบน แบ่งเป็น 12 คอลัมน์)
        ========================================================= */}
        <section className="grid items-center gap-12 lg:grid-cols-12">
          
          {/* ฝั่งซ้าย (กินพื้นที่ 7 คอลัมน์): รูปโปรไฟล์ + ชื่อ + ปุ่มกด */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <div className="animate-reveal flex items-center gap-4">
              {/* กรอบรูปโปรไฟล์: ปกติเป็นภาพขาวดำ (grayscale) พอเอาเมาส์ชี้จะกลายเป็นภาพสีและซูมเข้า */}
             <Link
              href="/album"
              title="Open Photo Album"
              className="group relative block h-20 w-20 cursor-pointer overflow-hidden border border-zinc-700 bg-zinc-900 p-1 transition-colors hover:border-white"
>
            <img
             src="/avatar.jpg"
             alt="Sohrob Avatar"
             className="h-full w-full object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-110 
             group-hover:grayscale-0"/>
            {/* HUD Corner Brackets */}
            <span className="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-white" />
            <span className="absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2 border-white" />
            
            </Link>

              {/* ป้ายสถานะการทำงาน */}
              <div className="font-mono text-xs">
                <div className="inline-flex items-center gap-2 border border-zinc-800 bg-zinc-900/90 px-3 py-1 text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                  STATUS: AVAILABLE_FOR_HIRE
                </div>
                <p className="mt-1.5 text-zinc-500">
                  LOC: THAILAND // ROLE: SOFTWARE_DEV
                </p>
              </div>
            </div>

            {/* หัวข้อชื่อขนาดใหญ่ + เอฟเฟกต์สั่น (glitch-hover) */}
            <div className="animate-reveal delay-100">
              <p className="mb-2 font-mono text-xs tracking-widest text-zinc-500 uppercase">
                &gt; Initializing Portfolio Interface...
              </p>
              <h1 className="glitch-hover cursor-default text-5xl font-black tracking-tighter text-white sm:text-7xl">
                SOHROB
                <span className="block text-zinc-500">ENGINEER.</span>
              </h1>
            </div>

            {/* คำอธิบายตัวเองสั้นๆ */}
            <p className="animate-reveal delay-200 max-w-xl text-base leading-relaxed text-zinc-400">
              Name นาย วีรยุทธ เวสโมราดี้ <br />
              School KMUTNB <br />
              ID 6906021410255 <br />
              Major ITI <br />
              Sec A


              
              
            </p>

            {/* ปุ่ม Action 2 ปุ่ม (ปุ่มขาวทึบ และ ปุ่มขอบดำ) */}
            <div className="animate-reveal delay-300 flex flex-wrap gap-4 pt-2 font-mono text-xs">
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-3 border border-white bg-white px-6 py-3.5 font-bold text-black transition-all duration-300 hover:bg-transparent hover:text-white"
              >
                <span>EXECUTE_PROJECTS</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  -&gt;
                </span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-zinc-700 bg-zinc-950 px-6 py-3.5 font-bold text-zinc-300 transition-all duration-300 hover:border-white hover:text-white"
              >
                <span>INIT_CONTACT</span>
              </a>
            </div>
          </div>

          {/* ฝั่งขวา (กินพื้นที่ 5 คอลัมน์): กล่อง Interactive Terminal */}
          <div className="animate-reveal delay-400 lg:col-span-5">
            <div className="overflow-hidden border border-zinc-800 bg-[#0a0a0a] shadow-2xl shadow-black">
              {/* แถบหัวหน้าต่าง Terminal (จุด 3 จุด + ชื่อ bash) */}
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5 font-mono text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                </div>
                <span>bash — sohrob@system</span>
                <span className="text-[10px] text-zinc-600">UTF-8</span>
              </div>

              {/* พื้นที่แสดงข้อความโต้ตอบใน Terminal */}
              <div className="flex h-64 flex-col justify-between p-4 font-mono text-xs">
                <div className="space-y-3 overflow-y-auto pr-1">
                  {/* วนลูปแสดงประวัติคำสั่งทั้งหมดจากตัวแปร terminalHistory */}
                  {terminalHistory.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <span className="text-zinc-500">$</span>
                        <span className="font-semibold text-white">
                          {item.cmd}
                        </span>
                      </div>
                      <p className="pl-4 leading-relaxed text-zinc-400">
                        {item.out}
                      </p>
                    </div>
                  ))}
                  {/* จุดอ้างอิงสำหรับเลื่อนลงล่างสุดอัตโนมัติ */}
                  <div ref={terminalEndRef} />
                </div>

                {/* ฟอร์มช่องรับคำสั่งจากคีย์บอร์ด */}
                <form
                  onSubmit={handleCommand}
                  className="mt-3 flex items-center gap-2 border-t border-zinc-800/80 pt-3"
                >
                  <span className="text-white">$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type 'help' or 'skills'..."
                    className="w-full bg-transparent text-white placeholder-zinc-600 focus:outline-none"
                  />
                  {/* เคอร์เซอร์กระพริบ */}
                  <span className="cursor-blink inline-block h-4 w-2 bg-white" />
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 2: PROJECTS (แสดงผลงานแบบตาราง 2 คอลัมน์)
        ========================================================= */}
        <section id="projects" className="scroll-mt-24 flex flex-col gap-8">
          <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
            <div>
              <p className="font-mono text-xs text-zinc-500">01 // ARCHIVE</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">
                SELECTED_SYSTEMS
              </h2>
            </div>
            {/* แสดงจำนวนโปรเจกต์อัตโนมัติตามความยาวของ Array */}
            <span className="font-mono text-xs text-zinc-500">
              [TOTAL: 0{projects.length}]
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* วนลูปสร้างการ์ดโปรเจกต์ทีละใบจากตัวแปร projects */}
            {projects.map((project) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col justify-between overflow-hidden border border-zinc-800 bg-[#09090b] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-white hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
              >
                {/* เส้นเลเซอร์สีขาวที่จะวิ่งสแกนลงมาเมื่อเอาเมาส์ชี้ที่การ์ด */}
                <div className="animate-scanline pointer-events-none absolute right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0" />

                <div>
                  {/* รหัสโปรเจกต์และหมวดหมู่ */}
                  <div className="mb-4 flex items-center justify-between font-mono text-xs text-zinc-500">
                    <span>ID_{project.id}</span>
                    <span>{project.category}</span>
                  </div>

                  {/* ชื่อโปรเจกต์และลูกศรชี้เฉียงขึ้น */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:underline">
                      {project.title}
                    </h3>
                    <span className="font-mono text-sm text-zinc-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white">
                      [↗]
                    </span>
                  </div>

                  {/* คำอธิบายโปรเจกต์ */}
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {project.description}
                  </p>
                </div>

                {/* แถบแสดงป้าย Tags เทคโนโลยีที่ใช้ด้านล่างการ์ด */}
                <div className="mt-8 flex flex-wrap gap-2 border-t border-zinc-800/80 pt-4 font-mono text-[11px]">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-zinc-300 transition-colors group-hover:border-zinc-600 group-hover:text-white"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* =========================================================
            SECTION 3: TECH STACK (แสดงทักษะแบ่งเป็น 3 กล่อง)
        ========================================================= */}
        <section id="skills" className="scroll-mt-24 flex flex-col gap-8">
          <div className="border-b border-zinc-800 pb-4">
            <p className="font-mono text-xs text-zinc-500">02 // CAPABILITIES</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">
              TECHNICAL_STACK
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* วนลูปสร้างกล่องหมวดหมู่ทักษะ 3 กล่อง */}
            {skillGroups.map((group) => (
              <div
                key={group.label}
                className="border border-zinc-800 bg-[#09090b] p-6 transition-colors hover:border-zinc-600"
              >
                <h3 className="mb-4 font-mono text-xs font-bold tracking-wider text-zinc-400">
                  {group.label}
                </h3>
                <ul className="space-y-2.5 font-mono text-sm">
                  {/* วนลูปรายชื่อทักษะในแต่ละหมวดหมู่ */}
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-zinc-300 transition-transform duration-200 hover:translate-x-1.5 hover:text-white"
                    >
                      <span className="text-xs text-zinc-600">&gt;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            SECTION 4: FOOTER / CONTACT (ช่องทางติดต่อด้านล่างสุด)
        ========================================================= */}
        <footer
          id="contact"
          className="scroll-mt-24 border-t border-zinc-800 pt-12 pb-8"
        >
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="font-mono text-xs text-zinc-500">
                03 // ESTABLISH_CONNECTION
              </p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">
                READY TO DEPLOY?
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Open for software engineering roles, freelance systems, and
                technical collaborations.
              </p>
            </div>

            {/* ปุ่มลิงก์ช่องทางติดต่อ */}
            <div className="flex flex-wrap gap-3 font-mono text-xs">
              <a
                href="mailto:your.email@example.com"
                className="border border-white bg-white px-5 py-3 font-bold text-black transition-all hover:bg-transparent hover:text-white"
              >
                SEND_EMAIL
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-zinc-700 px-5 py-3 text-zinc-300 transition-all hover:border-white hover:text-white"
              >
                GITHUB
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-zinc-700 px-5 py-3 text-zinc-300 transition-all hover:border-white hover:text-white"
              >
                LINKEDIN
              </a>
            </div>
          </div>

          {/* แถบ Copyright ด้านล่างสุด */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-900 pt-6 font-mono text-[11px] text-zinc-600 sm:flex-row">
            <span>© 2026 SOHROB.SYS — ALL RIGHTS RESERVED.</span>
            <span>BUILT WITH NEXT.JS // MONOCHROME EDITION</span>
          </div>
        </footer>
      </main>
    </div>
  );
}