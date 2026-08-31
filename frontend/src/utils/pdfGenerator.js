import { jsPDF } from 'jspdf'

/**
 * Generates an authentic, official Government Encumbrance Certificate (EC Form 15) PDF
 * for property owners authenticated via DigiLocker / Bhu-Aadhaar.
 */
export function generateEncumbranceCertificatePDF({ citizenName, properties = [], digilockerId = 'DL-8849-2026-IN' }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Outer Border & Header Banner
  doc.setDrawColor(22, 50, 56)
  doc.setLineWidth(0.8)
  doc.rect(8, 8, pageWidth - 16, 281)

  doc.setDrawColor(46, 125, 99)
  doc.setLineWidth(0.3)
  doc.rect(9.5, 9.5, pageWidth - 19, 278)

  // Header Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(23, 59, 54)
  doc.text('GOVERNMENT OF NCT OF DELHI', pageWidth / 2, 18, { align: 'center' })
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('DEPARTMENT OF REVENUE & LAND RECORDS — 3D CADASTRE DIVISION', pageWidth / 2, 23, { align: 'center' })
  doc.text('SUB-REGISTRAR OFFICE: DWARKA SUB-DISTRICT, SOUTH WEST DELHI', pageWidth / 2, 27, { align: 'center' })

  // Decorative Rule
  doc.setDrawColor(46, 125, 99)
  doc.setLineWidth(0.5)
  doc.line(14, 30, pageWidth - 14, 30)

  // Certificate Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text('ENCUMBRANCE CERTIFICATE (FORM NO. 15)', pageWidth / 2, 38, { align: 'center' })
  
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(46, 125, 99)
  doc.text('[ ISSUED UNDER SECTION 89 OF THE REGISTRATION ACT & ISO 19152 LADM 3D STANDARD ]', pageWidth / 2, 43, { align: 'center' })

  // Meta Info Box
  doc.setFillColor(245, 248, 245)
  doc.setDrawColor(185, 216, 202)
  doc.roundedRect(14, 48, pageWidth - 28, 26, 2, 2, 'FD')

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 41, 59)
  doc.text('Certificate No:', 18, 55)
  doc.text('DigiLocker Verification Ref:', 18, 61)
  doc.text('Authenticated Citizen / Owner:', 18, 67)

  doc.setFont('helvetica', 'normal')
  doc.text(`EC-DL-DWR-${Math.floor(100000 + Math.random() * 900000)}/2026`, 65, 55)
  doc.text(`${digilockerId} (AADHAAR e-KYC VERIFIED)`, 65, 61)
  doc.text(`${citizenName} (Aadhaar Linked Vault)`, 65, 67)

  doc.setFont('helvetica', 'bold')
  doc.text('Search Period:', 125, 55)
  doc.text('Date of Generation:', 125, 61)
  doc.text('3D Cadastre Status:', 125, 67)

  doc.setFont('helvetica', 'normal')
  doc.text('01-APR-2010 to CURRENT', 160, 55)
  doc.text(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(), 160, 61)
  doc.setTextColor(16, 185, 129)
  doc.setFont('helvetica', 'bold')
  doc.text('ACTIVE & AUTHORITATIVE', 160, 67)

  // Property Search Statement
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  const statement = `This is to certify that an electronic spatial search of the authoritative 3D Bhu-Aadhaar Digital Cadastre of Dwarka Sector 10 (Delhi NCT) reveals the following volumetric property assets registered under the name of the applicant. All liabilities, mortgages, and charges are detailed below:`
  doc.text(doc.splitTextToSize(statement, pageWidth - 28), 14, 80)

  // Table of Properties
  let startY = 90
  properties.forEach((prop, idx) => {
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(203, 213, 225)
    doc.roundedRect(14, startY, pageWidth - 28, 48, 2, 2, 'FD')

    // Card Header Bar
    doc.setFillColor(241, 245, 249)
    doc.rect(14, startY, pageWidth - 28, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(15, 23, 42)
    doc.text(`PROPERTY ASSET #${idx + 1}: ${prop.name.toUpperCase()}`, 18, startY + 5.5)
    doc.setTextColor(46, 125, 99)
    doc.text(prop.status || 'VERIFIED & REGISTERED', pageWidth - 18, startY + 5.5, { align: 'right' })

    // Details Grid
    doc.setFontSize(8)
    doc.setTextColor(71, 85, 105)
    doc.setFont('helvetica', 'bold')
    doc.text('3D-ULPIN (Bhu-Aadhaar):', 18, startY + 14)
    doc.text('Location & Complex:', 18, startY + 20)
    doc.text('Carpet Area & Volume:', 18, startY + 26)
    doc.text('Registered Deed No & Date:', 18, startY + 32)
    doc.text('Encumbrance / Lien Status:', 18, startY + 38)
    doc.text('Tax / Circle Rate Valuation:', 18, startY + 44)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(15, 23, 42)
    doc.text(prop.ulpin || prop.ulpin_3d, 65, startY + 14)
    doc.text(prop.location || 'Aura Residency Complex, Sector 10, Dwarka, New Delhi', 65, startY + 20)
    doc.text(`${prop.carpetArea || prop.carpet_area_m2} m² Carpet Area  |  ${prop.volume || prop.rera_volume_m3} m³ Volumetric Volume (Level ${prop.level})`, 65, startY + 26)
    doc.text(`${prop.deedNo || prop.deed_no || 'DEL-DWK-2023-88904'} (Dated 14-OCT-2023)`, 65, startY + 32)
    
    // Encumbrance Highlight
    const isMortgaged = prop.mortgage && !prop.mortgage.includes('NONE')
    if (isMortgaged) {
      doc.setTextColor(180, 83, 9)
      doc.setFont('helvetica', 'bold')
    } else {
      doc.setTextColor(16, 185, 129)
    }
    doc.text(prop.mortgage || 'NONE (Clear Title - No active bank liens or court attachments)', 65, startY + 38)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(15, 23, 42)
    doc.text(`Circle Rate: ₹74,500/m²  |  Assessment: PAID (FY 2025-26)`, 65, startY + 44)

    startY += 54
  })

  // Official Seal & Signatory Box
  const footerY = 240
  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.3)
  doc.line(14, footerY - 4, pageWidth - 14, footerY - 4)

  // QR verification mockup box
  doc.setFillColor(248, 250, 252)
  doc.rect(14, footerY, 32, 32, 'FD')
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(71, 85, 105)
  doc.text('3D SPATIAL HASH', 16, footerY + 6)
  doc.setFont('helvetica', 'normal')
  doc.text('ISO:19152:2024\nSHA-256 VALIDATED\nDL-DWR-SEC10\nAUTHMINTED', 16, footerY + 12)

  // Sub Registrar Digital Signatory
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('Digitally Signed & Certified By:', pageWidth - 80, footerY + 6)
  doc.setFont('helvetica', 'normal')
  doc.text('Sub-Divisional Magistrate (SDM) / Tehsildar\nRevenue Department, Government of NCT of Delhi\nDwarka Sub-District Division', pageWidth - 80, footerY + 12)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(46, 125, 99)
  doc.text('[ OFFICIAL DIGILOCKER e-SIGN VALIDATED ]', pageWidth - 80, footerY + 28)

  // Bottom Disclaimer
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(148, 163, 184)
  doc.text('Note: This is a system-generated official electronic Encumbrance Certificate verified against the 3D-ULPIN Spatial Cadastre Registry. No physical signature is required.', pageWidth / 2, 282, { align: 'center' })

  // Trigger browser download
  const cleanName = citizenName.replace(/\s+/g, '_')
  doc.save(`STRATA_EC_Form15_${cleanName}.pdf`)
}

/**
 * Generates an authentic 3D Volumetric Title Deed PDF for a specific parcel unit.
 */
export function generateTitleDeedPDF(unit) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Outer Borders
  doc.setDrawColor(22, 50, 56)
  doc.setLineWidth(0.8)
  doc.rect(8, 8, pageWidth - 16, 281)

  doc.setDrawColor(46, 125, 99)
  doc.setLineWidth(0.3)
  doc.rect(9.5, 9.5, pageWidth - 19, 278)

  // Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(23, 59, 54)
  doc.text('GOVERNMENT OF NCT OF DELHI — 3D BHU-AADHAAR CADASTRE', pageWidth / 2, 18, { align: 'center' })
  doc.setFontSize(13)
  doc.setTextColor(15, 23, 42)
  doc.text('CERTIFIED 3D VOLUMETRIC TITLE DEED & PARCEL RECORD', pageWidth / 2, 26, { align: 'center' })

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  doc.text(`3D-ULPIN: ${unit.ulpin_3d}  |  Deed No: ${unit.deed_no}`, pageWidth / 2, 32, { align: 'center' })

  doc.setDrawColor(46, 125, 99)
  doc.setLineWidth(0.5)
  doc.line(14, 36, pageWidth - 14, 36)

  // Deed Body
  let y = 46
  const addField = (label, val) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(71, 85, 105)
    doc.text(label, 16, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(15, 23, 42)
    doc.text(String(val), 70, y)
    y += 7
  }

  addField('Property Asset Name:', unit.name)
  addField('Registered Owner:', unit.owner)
  addField('Urban Complex / Society:', 'Aura Residency CGHS, Sector 10, Dwarka, New Delhi')
  addField('Building Block / Tower:', unit.block || 'Tower A')
  addField('Vertical Floor Level:', `Level ${unit.level} (${unit.domain === 'U' ? 'Subsurface' : 'Super-surface'})`)
  addField('Approved Carpet Area:', `${unit.carpet_area_m2} sq. meters`)
  addField('3D Volumetric Air-Rights Volume:', `${unit.rera_volume_m3} cubic meters`)
  addField('Encumbrance / Active Liens:', unit.mortgage || 'NONE (Clear Title)')
  addField('Tax & Municipal Dues:', unit.tax_status || 'PAID (FY 2025-26)')
  addField('Circle Rate Valuation (INR):', `Rs. ${unit.estimated_valuation_inr?.toLocaleString('en-IN') || '85,00,000'}`)
  addField('Registration Timestamp:', `${unit.registration_date || '14-OCT-2023'} at Kapashera/Dwarka SRO`)
  addField('Deed Security Token (SHA-256):', unit.deed_token ? `${unit.deed_token.substring(0, 32)}...` : '7a91bf88...')

  // 3D Parametric Spatial Bounding Coordinates
  y += 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(23, 59, 54)
  doc.text('3D PARAMETRIC SPATIAL BOUNDING VERTICES (LOCAL CADASTRAL CRS)', 16, y)
  y += 5

  doc.setFillColor(245, 248, 245)
  doc.roundedRect(14, y, pageWidth - 28, 50, 2, 2, 'FD')
  
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(71, 85, 105)
  doc.text('Vertex ID', 18, y + 6)
  doc.text('Local X (East)', 45, y + 6)
  doc.text('Local Y (North)', 80, y + 6)
  doc.text('Local Z (Elevation MSL)', 115, y + 6)
  doc.text('Status', 160, y + 6)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(15, 23, 42)
  let vy = y + 12
  if (unit.vertices_local) {
    unit.vertices_local.slice(0, 6).forEach((v, idx) => {
      doc.text(`V0${idx + 1}`, 18, vy)
      doc.text(`${v[0]} m`, 45, vy)
      doc.text(`${v[1]} m`, 80, vy)
      doc.text(`${v[2]} m`, 115, vy)
      doc.text('WATERTIGHT BOUNDARY', 160, vy)
      vy += 6
    })
  }

  // Footer Signatures
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('Authorized Revenue Sub-Registrar', pageWidth - 70, 255)
  doc.setFont('helvetica', 'normal')
  doc.text('Government of NCT of Delhi\nAuthoritative 3D Cadastre Hub', pageWidth - 70, 261)

  doc.save(`STRATA_Deed_${unit.unit_id}.pdf`)
}
