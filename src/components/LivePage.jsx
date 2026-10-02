"use client";

/**
 * GENCO — Canlı Alt Sayfa
 * ---------------------------------------------------------------------------
 * Veriyi çeker ve ortak <SitePage /> bileşenini besler:
 *   • Stüdyoda yayınlanmış blok varsa (pagesContent.<pageKey>) o kullanılır.
 *   • Yoksa src/components/PageTemplates.js içindeki şablon gösterilir.
 * Böylece site hiçbir zaman boş kalmaz ve her sayfa panelden düzenlenebilir.
 */

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import SitePage from "./SitePage";

export default function LivePage({ pageKey }) {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "genco_studio"));
        if (cancelled) return;
        const list = snap.data()?.pagesContent?.[pageKey];
        if (Array.isArray(list) && list.length) setBlocks(list);
      } catch (e) {
        console.log("Stüdyo blokları bekleniyor.", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pageKey]);

  return <SitePage pageKey={pageKey} blocks={blocks} mode="live" />;
}