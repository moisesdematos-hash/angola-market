'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Truck, MapPin, Navigation, Compass, AlertCircle } from 'lucide-react';

interface DeliveryMapProps {
  buyerProvince: string;
  buyerMunicipality: string;
  trackingCode: string;
}

export function DeliveryMap({ buyerProvince, buyerMunicipality, trackingCode }: DeliveryMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [driverPos, setDriverPos] = useState({ x: 100, y: 150 });
  const [etaMinutes, setEtaMinutes] = useState(25);
  const [distanceKm, setDistanceKm] = useState(7.4);
  const [speedKmh, setSpeedKmh] = useState(48);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let progress = 0.0;

    // Route definition: Store (Luanda Center) -> Client (Talatona/Municipality)
    const startPoint = { x: 80, y: 190 };
    const midPoint1 = { x: 180, y: 120 };
    const midPoint2 = { x: 260, y: 160 };
    const endPoint = { x: 340, y: 80 };

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stylized Grid/Map Background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 30) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw Mock Roads / Routes
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(midPoint1.x, midPoint1.y);
      ctx.lineTo(midPoint2.x, midPoint2.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.stroke();

      // Draw active/completed route path
      ctx.strokeStyle = '#059669'; // Emerald-600
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);

      // Calculate driver position along Bezier/line segments
      let currentX = startPoint.x;
      let currentY = startPoint.y;

      if (progress < 0.33) {
        const t = progress / 0.33;
        currentX = startPoint.x + (midPoint1.x - startPoint.x) * t;
        currentY = startPoint.y + (midPoint1.y - startPoint.y) * t;
      } else if (progress < 0.66) {
        ctx.lineTo(midPoint1.x, midPoint1.y);
        const t = (progress - 0.33) / 0.33;
        currentX = midPoint1.x + (midPoint2.x - midPoint1.x) * t;
        currentY = midPoint1.y + (midPoint2.y - midPoint1.y) * t;
      } else {
        ctx.lineTo(midPoint1.x, midPoint1.y);
        ctx.lineTo(midPoint2.x, midPoint2.y);
        const t = (progress - 0.66) / 0.34;
        currentX = midPoint2.x + (endPoint.x - midPoint2.x) * t;
        currentY = midPoint2.y + (endPoint.y - midPoint2.y) * t;
      }

      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      // Store Point (Start)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('Loja', startPoint.x - 10, startPoint.y - 12);

      // Client Point (End)
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(endPoint.x, endPoint.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${buyerMunicipality}`, endPoint.x - 20, endPoint.y - 12);

      // Driver Marker Icon (Moving)
      ctx.fillStyle = '#fbbf24'; // Amber-400
      ctx.beginPath();
      ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Update counters based on progress
      setDriverPos({ x: Math.round(currentX), y: Math.round(currentY) });
      const remainingDistance = Math.max(0.1, 7.4 * (1 - progress));
      setDistanceKm(parseFloat(remainingDistance.toFixed(1)));
      setEtaMinutes(Math.max(1, Math.round(remainingDistance * 3.5)));
      setSpeedKmh(Math.round(45 + Math.sin(progress * 10) * 10));

      // Loop animation
      progress += 0.0005;
      if (progress > 1.0) progress = 0.0;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [buyerMunicipality]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-5 space-y-4">
      {/* Live Map Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-extrabold text-sm">
          <Navigation className="w-5 h-5 text-emerald-400 animate-spin" />
          <span>Localização em Tempo Real (KargaGO Map)</span>
        </div>
        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-500/30">
          GPS Activo
        </span>
      </div>

      {/* HTML5 Canvas Animated Route Map */}
      <div className="relative w-full h-[220px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={220}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute bottom-3 left-3 bg-slate-900/90 text-slate-300 text-[9px] px-2 py-1 rounded border border-slate-800">
          Escala: Luanda Metropolitano
        </div>
      </div>

      {/* Real-time Logistics Dashboard Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Tempo de Chegada</span>
          <span className="text-base font-extrabold text-amber-400 animate-pulse">{etaMinutes} min</span>
        </div>
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Distância Restante</span>
          <span className="text-base font-extrabold text-white">{distanceKm} km</span>
        </div>
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 block uppercase">Velocidade Média</span>
          <span className="text-base font-extrabold text-emerald-400">{speedKmh} km/h</span>
        </div>
      </div>

      {/* Driver info block */}
      <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white shrink-0">
          KM
        </div>
        <div className="flex-1">
          <div className="font-bold text-white">Estafeta: KargaGO - Kianda Moto</div>
          <div className="text-[10px] text-slate-400">Veículo: Moto TVS HLX 150 (Chapa: LD-54-12)</div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-amber-400 font-bold block">PIN SEGURO</span>
          <span className="font-extrabold text-white text-sm">8492</span>
        </div>
      </div>
    </div>
  );
}
