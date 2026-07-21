"use client";
import { useEffect } from "react";
export function SwRegister() { useEffect(() => { if (window.isSecureContext && "serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined); }, []); return null; }
