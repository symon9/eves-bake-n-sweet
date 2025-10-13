import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

// Define the shape of the order data
interface OrderData {
  _id: string;
  customer: { name: string; email: string; phone?: string; };
  shippingAddress: { street: string; city: string; state: string; };
  items: { name: string; quantity: number; price: number; }[];
  totalAmount: number;
  paymentReference?: string;
  createdAt: Date;
}

export const generateReceiptPDF = (order: OrderData) => {
  const doc = new jsPDF();
  
  const brandColor = '#d91d6c';
  const darkGray = '#333333';

  doc.setFont('helvetica');

  // --- HEADER SECTION ---
  doc.setFillColor(brandColor);
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
  
  doc.setFontSize(26);
  doc.setTextColor('#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.text("Eve's Bake n Sweet", doc.internal.pageSize.width - 14, 25, { align: 'right' });

  // --- RECEIPT DETAILS SECTION ---
  doc.setFontSize(16);
  doc.setTextColor(darkGray);
  doc.setFont('helvetica', 'normal');
  doc.text('Order Receipt', 14, 55);

  doc.setFontSize(10);
  doc.text(`Order ID: #${order._id.slice(-8).toUpperCase()}`, 14, 65);
  doc.text(`Date: ${format(new Date(order.createdAt), 'd MMMM yyyy, p')}`, 14, 70);

  // --- BILLED TO SECTION ---
  const customerX = doc.internal.pageSize.width - 14;
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To:', customerX, 55, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(order.customer.name, customerX, 60, { align: 'right' });
  doc.text(`${order.shippingAddress.street}`, customerX, 65, { align: 'right' });
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, customerX, 70, { align: 'right' });

  // --- ITEMS TABLE (TABLE 1) ---
  const tableColumn = ["Item", "Qty", "Unit Price", "Total"];
  const itemRows: any[] = [];
  
  const sanitizeText = (text: string) => text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();

  // Helper for currency formatting
  const formatCurrency = (amount: number) => {
    // Using "NGN" is safer than the symbol for default PDF fonts
    return `NGN ${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  order.items.forEach(item => {
    itemRows.push([
      sanitizeText(item.name),
      item.quantity,
      formatCurrency(item.price),
      formatCurrency(item.price * item.quantity),
    ]);
  });
  
  autoTable(doc, {
    startY: 85,
    head: [tableColumn],
    body: itemRows,
    theme: 'grid',
    headStyles: { fillColor: brandColor, textColor: '#ffffff', fontStyle: 'bold' },
    styles: { font: 'helvetica', cellPadding: 3 },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' },
    },
  });

  // --- TOTALS TABLE (TABLE 2) ---
  // This is the key fix for alignment. We create a new, separate table for totals.
  const totalsY = (doc as any).lastAutoTable.finalY;
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalRows = [
    ['Subtotal:', formatCurrency(subtotal)],
    ['Shipping:', 'FREE'],
    // Add an empty row for border
    [{ content: '', styles: { cellPadding: { top: 1, bottom: 1 } } }], 
    [{ content: 'Total Amount:', styles: { fontStyle: 'bold' } }, { content: formatCurrency(order.totalAmount), styles: { fontStyle: 'bold' } }],
  ];

  autoTable(doc, {
    startY: totalsY + 5, // Add a 5-unit margin below the first table
    body: totalRows,
    theme: 'plain', // No lines for a clean summary look
    tableWidth: 80, // A fixed width for the totals block
    margin: { left: doc.internal.pageSize.width - 80 - 14 }, // Align the whole table to the right
    styles: { font: 'helvetica' },
    columnStyles: {
      0: { halign: 'right', cellPadding: { right: 2 } },
      1: { halign: 'right' },
    },
  });


  // --- FOOTER SECTION ---
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor('#888');
  const footerText = "Thank you for your purchase! If you have any questions, please contact us at orders@evesbake.com.";
  doc.text(footerText, 14, pageHeight - 20, { maxWidth: doc.internal.pageSize.width - 28 });
  doc.text(`www.evesbake.com | Payment Ref: ${order.paymentReference || 'N/A'}`, 14, pageHeight - 10);
  
  doc.save(`receipt-evesbake-${order._id.slice(-8)}.pdf`);
};