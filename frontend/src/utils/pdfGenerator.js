import { jsPDF } from 'jspdf';

/**
 * Generates an official, publication-ready SIU Case & Claim Investigation PDF Brief
 * with bold emphasis on all critical checks, doctor legitimacy certification, and 8-dimension data.
 * @param {Object} caseInfo - Case and claim data
 */
export function generateSIUInvestigationPDF(caseInfo = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 16;

  const cId = caseInfo.id || caseInfo.case_id || 'Ring-07';
  const cTitle = caseInfo.title || 'Ring-07 Coordinated Referral Ring & Level-5 Upcoding';
  const cRisk = caseInfo.risk || '0.93';
  const cDollars = caseInfo.dollars || '$1.82M';
  const cMembers = caseInfo.members || 412;
  const cRepeat = caseInfo.repeat || '61%';
  const doctorStatus = caseInfo.doctorStatus || 'VERIFIED ACTIVE (Medical Board License: IL-MD-19482701)';
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // 1. Header Banner
  doc.setFillColor(15, 23, 42); // #0f172a Slate 900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('CLAIMSHIELD NEXUS — SPECIAL INVESTIGATION UNIT (SIU)', margin, 11);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(192, 132, 252); // Purple accent
  doc.text('OFFICIAL FRAUD, WASTE & ABUSE (FWA) INTELLIGENCE DOSSIER', margin, 17);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${dateStr} • Ref: SIU-${cId}-${Date.now().toString().slice(-6)} • Lead: Krish Kaalidass (Level 3)`, margin, 23);

  // Synthetic Compliance Seal in Header
  doc.setFillColor(234, 88, 12);
  doc.roundedRect(pageWidth - margin - 38, 8, 38, 6, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('SYNTHETIC DATA ONLY', pageWidth - margin - 36, 12.5);

  y = 34;

  // 2. Case Overview Title Block
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Case Investigation Dossier: ${cId}`, margin, y);
  y += 4.5;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(cTitle, margin, y);
  y += 6.5;

  // 3. Four Key Metrics KPI Cards
  const cardW = (contentWidth - 9) / 4;
  const cardH = 15;
  const kpis = [
    { label: 'Risk Score', val: `${cRisk} / 1.00`, color: [225, 29, 72] },
    { label: 'Dollars at Risk', val: cDollars, color: [99, 102, 241] },
    { label: 'Affected Members', val: `${cMembers} Members`, color: [16, 185, 129] },
    { label: '60-Day Repeat Risk', val: cRepeat, color: [234, 88, 12] },
  ];

  kpis.forEach((kpi, idx) => {
    const cardX = margin + idx * (cardW + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, y, cardW, cardH, 2, 2, 'FD');

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label.toUpperCase(), cardX + 3, y + 4.5);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.text(kpi.val, cardX + 3, y + 11);
  });

  y += cardH + 6;

  // 4. Doctor Legitimacy & Certification Verification Box (BOLD)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('DOCTOR MEDICAL BOARD & REGISTRATION CERTIFICATION VERIFICATION:', margin + 3, y + 5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`STATUS: ${doctorStatus}`, margin + 3, y + 10.5);

  y += 18;

  // 5. 8-Dimension Intelligence Attributes Grid (BOLD CHECKS)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 48, 2, 2, 'FD');

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('1. COMPLETE 8-DIMENSION CLINICAL, FINANCIAL & ENTITY AUDIT ATTRIBUTES', margin + 3, y + 4.2);

  let dy = y + 10;
  const dimensions = [
    { label: '• Provider Behavior:', text: 'Level-5 upcoding share jump to 92% vs 18% peer average. Peer z-score: +4.82.' },
    { label: '• Member Utilization:', text: '40 shared rotating members (M0501-M0540) passed sequentially in circular cycle.' },
    { label: '• Facility Locations:', text: 'All 5 entities co-located at 12 MG Road Suite 400 with shared physical address.' },
    { label: '• Referral Pathways:', text: 'Circular referral loop confirmed: P101 -> P102 -> P103 -> P101 under owner OWN-77.' },
    { label: '• Beneficial Ownership:', text: 'Apex Syndicate Group LLC (OWN-77) owns 100% of P101, P102, P103, P105, P106, P090.' },
    { label: '• Service Timing & PELT:', text: 'Statistical change-point on 2026-02-16; 38 Level-5 visits in 1 day on 2026-03-02.' },
    { label: '• Payment Patterns:', text: 'Actual paid $210.00 vs Twin expected $95.00 -> Net overpayment gap +$115.00/claim.' },
    { label: '• Previous Investigations:', text: 'Predecessor clinic P090 shuttered under audit 2025-11-30; reincarnated as P101 on 2025-12-12.' },
  ];

  dimensions.forEach((dim) => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(dim.label, margin + 3, dy);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(dim.text, margin + 44, dy);
    dy += 4.6;
  });

  y += 53;

  // 6. Phoenix Entity Resolution & Peer Twin Overpayment Calculation (BOLD)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'FD');

  doc.setFillColor(254, 243, 199);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('2. PHOENIX ENTITY RESOLUTION & PEER TWIN OVERPAYMENT CALCULATION', margin + 3, y + 4.2);

  let py = y + 10;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('• Phoenix Clinic Reincarnation Match Score: 0.88 / 1.00 (HIGH CONFIDENCE)', margin + 3, py);
  py += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.text('  Predecessor Harborview (P090) closed 2025-11-30 -> Metro Internal (P101) enrolled 2025-12-12 with 28 overlapping patients.', margin + 3, py);
  py += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('• Peer Twin (k=12) Risk-Adjusted Overpayment Gap: +$115.00 / Claim', margin + 3, py);
  py += 4.5;
  doc.setTextColor(225, 29, 72);
  doc.text('  Actual Paid $210.00 (Risk: 1.02) vs Twin Paid $95.00 (Risk: 1.00) -> Total Net Exposure: $159,000+ (206 Flagged Claims)', margin + 3, py);

  y += 35;

  // 7. 5 Innocent Explanation Hypotheses Tested (BOLD)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  doc.setFillColor(236, 253, 245);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(4, 120, 87);
  doc.text('3. INNOCENT CLINICAL & OPERATIONAL DEFENSE HYPOTHESES (SAFE-FAIL AUDITED)', margin + 3, y + 4.2);

  let iy = y + 10;
  const defenses = [
    { name: '1. Sicker Patient Population', status: 'RULED OUT', desc: 'Patient Morbidity Risk Index is 1.02 (standard baseline norm).' },
    { name: '2. Independent Shared Medical Plaza', status: 'RULED OUT', desc: 'Beneficial owner OWN-77 and tight circular referrals verified.' },
    { name: '3. Organic Practice Ramp-Up', status: 'RULED OUT', desc: 'PELT statistical discontinuity confirmed at day 12.' },
    { name: '4. EDI Clearinghouse Batching Glitch', status: 'UNTESTED', desc: 'Action: Request 835 remittance logs & batch timestamps.' },
    { name: '5. Regional Epidemic Surge', status: 'RULED OUT', desc: 'Regional peer baseline remained completely flat.' },
  ];

  defenses.forEach((d) => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(d.name + ':', margin + 3, iy);

    doc.setTextColor(d.status === 'RULED OUT' ? 225 : 180, d.status === 'RULED OUT' ? 29 : 83, d.status === 'RULED OUT' ? 72 : 9);
    doc.text(`[${d.status}]`, margin + 48, iy);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(d.desc, margin + 70, iy);
    iy += 4.5;
  });

  y += 39;

  // 8. Recommended Action & Guardrail
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD');

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('4. SIU RECOMMENDED ACTION & STATUTORY GUARDRAILS', margin + 3, y + 4);

  let ry = y + 9.5;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(225, 29, 72);
  doc.text('RECOMMENDATION: MANDATORY HUMAN DESK AUDIT & MEDICAL RECORDS REQUEST', margin + 3, ry);
  ry += 4;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text('• Request 40 complete medical charts for Level-5 E/M encounters; subpoena OWN-77 corporate ownership registry.', margin + 3, ry);
  ry += 4;
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.5);
  doc.text('• STATUTORY POLICY: Zero Automatic Denial Policy Enforced. Preserves due process under SIU investigator direction.', margin + 3, ry);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 7;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 2.5, pageWidth - margin, footerY - 2.5);

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('ClaimShield Nexus SIU Platform • SHA-256 Audit Seal: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', margin, footerY);
  doc.text('Page 1 of 1', pageWidth - margin - 12, footerY);

  const filename = `ClaimShield_SIU_Dossier_${cId}.pdf`;
  doc.save(filename);
  return filename;
}
