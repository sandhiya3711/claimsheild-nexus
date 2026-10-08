import React, { useState, useEffect, useRef } from 'react';
import { Network, Database, Layers, Eye, ShieldAlert, Sparkles, Filter, Info, ZoomIn, ZoomOut, RotateCcw, Target, ShieldCheck, RefreshCw } from 'lucide-react';

export default function NetworkView({ selectedCase }) {
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);

  const [layers, setLayers] = useState({
    owners: true,
    facilities: true,
    patients: true,
    referrals: true,
    phoenix: true,
    highlightRing: true,
  });

  // State-backed mutable node positions for interactive dragging
  const [nodes, setNodes] = useState([
    // Core Ring Providers
    { id: 'P101', name: 'Metro Internal Medicine Assoc', specialty: 'Internal Medicine', type: 'core_provider', x: 420, y: 240, owner: 'OWN-77', address: '12 MG Road', lvl5_share: '92%', claims: 680, inRing: true },
    { id: 'P102', name: 'Metro Advanced Rehab & Physio', specialty: 'Physical Therapy', type: 'core_provider', x: 570, y: 170, owner: 'OWN-77', address: '12 MG Road', claims: 450, inRing: true },
    { id: 'P103', name: 'Metro Comprehensive Pain', specialty: 'Pain Management', type: 'core_provider', x: 570, y: 320, owner: 'OWN-77', address: '12 MG Road', claims: 520, inRing: true },
    { id: 'P105', name: 'Metro Diagnostic Imaging', specialty: 'Radiology', type: 'core_provider', x: 480, y: 390, owner: 'OWN-77', address: '12 MG Road', claims: 390, inRing: true },
    { id: 'P106', name: 'Metro Wellness & IV Infusions', specialty: 'Wellness & Infusion', type: 'core_provider', x: 330, y: 350, owner: 'OWN-77', address: '12 MG Road', claims: 310, inRing: true },

    // Innocent Tenant (Crucial Distinction)
    { id: 'P104', name: 'Dr. Clara Evans Dermatology', specialty: 'Dermatology', type: 'innocent_tenant', x: 270, y: 190, owner: 'OWN-78', address: '12 MG Road', claims: 180, note: 'Innocent tenant at same address; zero referral links with ring.', inRing: false },

    // Phoenix Predecessor
    { id: 'P090', name: 'Harborview Primary Care (Closed)', specialty: 'Internal Medicine', type: 'phoenix_closed', x: 170, y: 380, owner: 'OWN-77', address: '84 Old Harbor Way', status: 'Closed 2025-11-30', claims: 420, inRing: false },

    // Beneficial Owners
    { id: 'OWN-77', name: 'Apex Syndicate Group LLC', type: 'owner', x: 470, y: 60, owned_entities: 'P101, P102, P103, P105, P106, P090' },
    { id: 'OWN-78', name: 'Dr. Clara Evans Medical Corp', type: 'owner', x: 190, y: 100, owned_entities: 'P104' },

    // Facility
    { id: 'F100', name: 'MG Metro Complex', address: '12 MG Road', type: 'facility', x: 440, y: 220 },

    // Shared Patients
    { id: 'M0501', name: 'Rotating Patient M0501', type: 'patient', x: 690, y: 200, visits: 'Rotates weekly P101->P102->P103' },
    { id: 'M0502', name: 'Rotating Patient M0502', type: 'patient', x: 690, y: 280, visits: 'Rotates weekly P101->P102->P103' },
  ]);

  const networkEdges = [
    // Circular Referral Loop (P101 -> P102 -> P103 -> P101)
    { source: 'P101', target: 'P102', type: 'referral_loop', label: 'Referral Loop (40x)' },
    { source: 'P102', target: 'P103', type: 'referral_loop', label: 'Referral Loop (40x)' },
    { source: 'P103', target: 'P101', type: 'referral_loop', label: 'Referral Loop (40x)' },
    { source: 'P101', target: 'P105', type: 'referral_loop', label: 'Referral (28x)' },
    { source: 'P101', target: 'P106', type: 'referral_loop', label: 'Referral (24x)' },

    // Ownership Links
    { source: 'OWN-77', target: 'P101', type: 'ownership', label: 'Owns' },
    { source: 'OWN-77', target: 'P102', type: 'ownership', label: 'Owns' },
    { source: 'OWN-77', target: 'P103', type: 'ownership', label: 'Owns' },
    { source: 'OWN-77', target: 'P105', type: 'ownership', label: 'Owns' },
    { source: 'OWN-77', target: 'P106', type: 'ownership', label: 'Owns' },
    { source: 'OWN-77', target: 'P090', type: 'ownership', label: 'Owns (Closed)' },
    { source: 'OWN-78', target: 'P104', type: 'ownership', label: 'Owns (Separate)' },

    // Phoenix Reincarnation Link
    { source: 'P090', target: 'P101', type: 'phoenix', label: 'Phoenix Link (Score 0.88)' },

    // Co-location at 12 MG Road
    { source: 'P101', target: 'F100', type: 'colocated', label: 'At 12 MG Rd' },
    { source: 'P104', target: 'F100', type: 'colocated', label: 'At 12 MG Rd' },

    // Patient Rotation
    { source: 'M0501', target: 'P101', type: 'patient_claim', label: 'Claim' },
    { source: 'M0501', target: 'P102', type: 'patient_claim', label: 'Claim' },
    { source: 'M0501', target: 'P103', type: 'patient_claim', label: 'Claim' },
  ];

  // Canvas Renderer with Drag & Zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = 500 * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId;

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.offsetWidth, 500);
      ctx.save();
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(zoomLevel, zoomLevel);

      // Draw Edges
      networkEdges.forEach((edge) => {
        const s = nodes.find((n) => n.id === edge.source);
        const t = nodes.find((n) => n.id === edge.target);
        if (!s || !t) return;

        // Layer visibility filter
        if (edge.type === 'ownership' && !layers.owners) return;
        if (edge.type === 'referral_loop' && !layers.referrals) return;
        if (edge.type === 'phoenix' && !layers.phoenix) return;
        if (edge.type === 'patient_claim' && !layers.patients) return;
        if (edge.type === 'colocated' && !layers.facilities) return;

        const isHighlighted =
          hoveredNode && (hoveredNode.id === edge.source || hoveredNode.id === edge.target);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);

        if (edge.type === 'referral_loop') {
          ctx.strokeStyle = isHighlighted ? '#e11d48' : '#ec4899';
          ctx.lineWidth = isHighlighted ? 4 : 2.5;
          const dashOffset = (time / 40) % 16;
          ctx.setLineDash([8, 4]);
          ctx.lineDashOffset = -dashOffset;
        } else if (edge.type === 'phoenix') {
          ctx.strokeStyle = isHighlighted ? '#7c3aed' : '#a855f7';
          ctx.lineWidth = isHighlighted ? 3.5 : 2.5;
          ctx.setLineDash([5, 5]);
        } else if (edge.type === 'ownership') {
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = isHighlighted ? 3 : 1.8;
          ctx.setLineDash([]);
        } else if (edge.type === 'colocated') {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([2, 4]);
        } else {
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
        }

        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw Nodes
      nodes.forEach((node) => {
        if (node.type === 'owner' && !layers.owners) return;
        if (node.type === 'facility' && !layers.facilities) return;
        if (node.type === 'patient' && !layers.patients) return;

        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;

        ctx.beginPath();

        if (node.type === 'owner') {
          ctx.arc(node.x, node.y, isSelected ? 24 : isHovered ? 21 : 18, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = isSelected ? 3.5 : 2;
          ctx.stroke();
        } else if (node.type === 'facility') {
          ctx.rect(node.x - 14, node.y - 14, 28, 28);
          ctx.fillStyle = '#10b981';
          ctx.fill();
          ctx.strokeStyle = '#047857';
          ctx.lineWidth = isSelected ? 3 : 2;
          ctx.stroke();
        } else if (node.type === 'patient') {
          ctx.arc(node.x, node.y, isHovered ? 13 : 10, 0, Math.PI * 2);
          ctx.fillStyle = '#8b5cf6';
          ctx.fill();
          ctx.strokeStyle = '#6d28d9';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (node.type === 'innocent_tenant') {
          ctx.arc(node.x, node.y, isSelected ? 22 : isHovered ? 19 : 16, 0, Math.PI * 2);
          ctx.fillStyle = '#06b6d4';
          ctx.fill();
          ctx.strokeStyle = '#0e7490';
          ctx.lineWidth = isSelected ? 4 : 2.5;
          ctx.stroke();
        } else if (node.type === 'phoenix_closed') {
          ctx.arc(node.x, node.y, isSelected ? 22 : isHovered ? 19 : 16, 0, Math.PI * 2);
          ctx.fillStyle = '#9333ea';
          ctx.fill();
          ctx.strokeStyle = '#581c87';
          ctx.lineWidth = isSelected ? 3.5 : 2;
          ctx.stroke();
        } else {
          // Core Ring Provider
          ctx.arc(node.x, node.y, isSelected ? 24 : isHovered ? 21 : 18, 0, Math.PI * 2);
          ctx.fillStyle = '#e11d48';
          ctx.fill();
          ctx.strokeStyle = '#881337';
          ctx.lineWidth = isSelected ? 4 : 2.5;
          ctx.stroke();
        }

        // Label
        ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
        ctx.fillStyle = isSelected ? '#9333ea' : '#1e1b2e';
        ctx.textAlign = 'center';
        ctx.fillText(node.id, node.x, node.y + (node.type === 'patient' ? 20 : 28));
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [layers, selectedNode, hoveredNode, zoomLevel, panOffset, nodes]);

  // Mouse handlers for dragging & clicking
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
    const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;

    const hit = nodes.find((n) => {
      const dx = n.x - mouseX;
      const dy = n.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= 24;
    });

    if (hit) {
      setDraggedNode(hit.id);
      setSelectedNode(hit);
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
    const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;

    if (isDragging && draggedNode) {
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === draggedNode ? { ...n, x: mouseX, y: mouseY } : n
        )
      );
    } else {
      const hit = nodes.find((n) => {
        const dx = n.x - mouseX;
        const dy = n.y - mouseY;
        return Math.sqrt(dx * dx + dy * dy) <= 24;
      });
      setHoveredNode(hit || null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  const resetView = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
    setSelectedNode(nodes[0]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1e1b2e] dark:text-white tracking-tight flex items-center gap-2">
            <Network className="w-6 h-6 text-[#9333ea]" /> Doctor Referral Network & Ownership Map
          </h2>
          <p className="text-xs text-[#6b7280] dark:text-slate-400 mt-0.5">
            Visual map showing doctor referral loops, clinic owners, shared patients, and reopened clinics.
          </p>
        </div>

        {/* Quick Focus Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedNode(nodes.find((n) => n.id === 'P101'))}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" /> View Referral Group (P101-P106)
          </button>
          <button
            onClick={() => setSelectedNode(nodes.find((n) => n.id === 'P104'))}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> View Innocent Clinic (P104)
          </button>
          <button
            onClick={() => setSelectedNode(nodes.find((n) => n.id === 'P090'))}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> View Reopened Clinic (P090 → P101)
          </button>
        </div>
      </div>

      {/* Main Canvas & Inspector View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Graph View */}
        <div className="lg:col-span-8 app-card p-5 bg-white dark:bg-slate-900 relative flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f0f7] dark:border-slate-800 text-xs">
            <span className="font-mono text-[#9333ea] font-bold">
              Active Graph: Ring P101-P106 + Phoenix Chain (P090 → P101)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.15))}
                className="p-1.5 rounded-lg border border-[#e2e8f0] dark:border-slate-700 hover:bg-[#f8fafc]"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
                className="p-1.5 rounded-lg border border-[#e2e8f0] dark:border-slate-700 hover:bg-[#f8fafc]"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetView}
                className="p-1.5 rounded-lg border border-[#e2e8f0] dark:border-slate-700 hover:bg-[#f8fafc]"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="w-full h-[460px] cursor-grab active:cursor-grabbing bg-[#fbf9fd] dark:bg-slate-950/40 rounded-xl my-3"
          />

          {/* Interactive Legend Bar */}
          <div className="pt-3 border-t border-[#f1f0f7] dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Ring (P101-P106)
              </span>
              <span className="flex items-center gap-1.5 text-cyan-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" /> Tenant (P104)
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Owner (OWN-77)
              </span>
              <span className="flex items-center gap-1.5 text-purple-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Phoenix (P090)
              </span>
            </div>
            <span className="text-emerald-600 font-bold font-mono">12 MG Road Multi-Specialty</span>
          </div>
        </div>

        {/* Node Inspector Drawer */}
        <div className="lg:col-span-4 app-card p-6 bg-white dark:bg-slate-900 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f0f7] dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#9333ea]" /> Selected Doctor / Clinic Details
              </h3>
              {selectedNode && (
                <span className="badge-pink-pill text-[10px] font-mono">{selectedNode.id}</span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-3.5 text-xs mt-4 animate-fadeIn">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#9ca3af]">Entity Name</span>
                  <div className="text-sm font-bold text-[#1e1b2e] dark:text-white mt-0.5">{selectedNode.name}</div>
                </div>

                {selectedNode.specialty && (
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#9ca3af]">Specialty</span>
                    <div className="text-xs text-[#9333ea] font-semibold">{selectedNode.specialty}</div>
                  </div>
                )}

                {selectedNode.owner && (
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#9ca3af]">Beneficial Owner</span>
                    <div className="text-xs text-amber-600 font-mono font-bold">{selectedNode.owner}</div>
                  </div>
                )}

                {selectedNode.address && (
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#9ca3af]">Physical Address</span>
                    <div className="text-xs text-[#475569] dark:text-slate-300">{selectedNode.address}</div>
                  </div>
                )}

                {selectedNode.lvl5_share && (
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#9ca3af]">Level-5 Billing Share</span>
                    <div className="text-sm font-black font-mono text-[#e11d48]">{selectedNode.lvl5_share}</div>
                  </div>
                )}

                {selectedNode.note && (
                  <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/40 rounded-xl text-cyan-900 dark:text-cyan-200 text-xs leading-relaxed">
                    <strong className="text-cyan-800 dark:text-cyan-300 font-bold block mb-1">Innocent Tenant Segregation:</strong>
                    {selectedNode.note}
                  </div>
                )}

                {selectedNode.id === 'P090' && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/40 rounded-xl text-purple-900 dark:text-purple-200 text-xs leading-relaxed">
                    <strong className="text-purple-800 dark:text-purple-300 font-bold block mb-1">Phoenix Entity Match (0.88):</strong>
                    Shuttered on 2025-11-30. Re-emerged as P101 on 2025-12-12 under same owner OWN-77 with 28 overlapping rotating patients.
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-[#9ca3af] text-xs space-y-2">
                <Eye className="w-8 h-8 text-[#cbd5e1] mx-auto" />
                <p>Click any node on the graph to inspect clinical profile, ownership, and referral links.</p>
              </div>
            )}
          </div>

          {/* Headline Demo Callout */}
          <div className="pt-4 border-t border-[#f1f0f7] dark:border-slate-800 bg-[#fbf9fd] dark:bg-slate-800/60 p-3.5 rounded-xl border border-[#e9e5f0] space-y-1.5">
            <span className="badge-pink-pill text-[9px] font-mono">Headline Graph Signal</span>
            <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">
              <strong>Referral Loop:</strong> P101 refers to P102 (Rehab), P102 to P103 (Pain), P103 back to P101 under owner OWN-77.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
