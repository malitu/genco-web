"use client";

/**
 * GENCO — Ana Sayfa (canlı)
 * ---------------------------------------------------------------------------
 * Bu dosya yalnızca veriyi çeker ve ortak <HomePage /> bileşenini besler.
 * Tasarımın tamamı src/components/HomePage.jsx içindedir; stüdyo tuvali de
 * aynı bileşeni kullandığı için önizleme ile canlı site birebir aynıdır.
 *
 * Veri kaynağı:
 *   settings/general      -> heroTitle / heroSub (opsiyonel)
 *   settings/genco_studio  -> pagesContent.home (stüdyoda yayınlanan bloklar)
 *
 * Stüdyoda hiç blok yayınlanmamışsa eski statik tasarım olduğu gibi korunur.
 */

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import HomePage from "../components/HomePage";

export default function Home() {
  const [blocks, setBlocks] = useState([]);
  const [siteData, setSiteData] = useState({});

  useEffect(() => {
    let cancelled = false;

    const fetchSite = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "general"));
        if (!cancelled && snap.exists() && snap.data()?.heroTitle) {
          setSiteData((prev) => ({ ...prev, ...snap.data() }));
        }
      } catch (e) {
        console.log("Genel ayarlar bekleniyor.", e);
      }
    };

    const fetchBlocks = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "genco_studio"));
        if (!cancelled && snap.exists()) {
          const home = snap.data()?.pagesContent?.home;
          if (Array.isArray(home) && home.length) setBlocks(home);
        }
      } catch (e) {
        console.log("Stüdyo blokları bekleniyor.", e);
      }
    };

    fetchSite();
    fetchBlocks();

    return () => {
      cancelled = true;
    };
  }, []);

  return <HomePage blocks={blocks} mode="live" siteData={siteData} />;
}
