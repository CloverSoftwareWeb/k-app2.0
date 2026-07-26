const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const buildPrintDocument = ({ title, subtitle, sections, footer }) => {
  const sectionHtml = sections
    .map(({ heading, columns, rows, emptyMessage }) => {
      if (!rows?.length) {
        return `
          <section class="section">
            ${heading ? `<h2>${escapeHtml(heading)}</h2>` : ""}
            <p class="empty">${escapeHtml(emptyMessage || "No data available.")}</p>
          </section>
        `;
      }

      const headerCells = columns.map((col) => `<th>${escapeHtml(col.label)}</th>`).join("");
      const bodyRows = rows
        .map(
          (row) =>
            `<tr>${columns.map((col) => `<td>${escapeHtml(row[col.key])}</td>`).join("")}</tr>`
        )
        .join("");

      return `
        <section class="section">
          ${heading ? `<h2>${escapeHtml(heading)}</h2>` : ""}
          <table>
            <thead><tr>${headerCells}</tr></thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </section>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #1f2937;
            margin: 24px;
          }
          h1 {
            margin: 0 0 4px;
            font-size: 22px;
          }
          .subtitle {
            margin: 0 0 20px;
            color: #6b7280;
            font-size: 12px;
          }
          .section {
            margin-bottom: 24px;
            page-break-inside: avoid;
          }
          h2 {
            margin: 0 0 10px;
            font-size: 15px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          th, td {
            border: 1px solid #d1d5db;
            padding: 8px 10px;
            text-align: left;
          }
          th {
            background: #f3f4f6;
            font-weight: 600;
          }
          tr:nth-child(even) td {
            background: #fafafa;
          }
          .empty {
            color: #6b7280;
            font-size: 13px;
          }
          .footer {
            margin-top: 16px;
            font-size: 13px;
            font-weight: 600;
          }
          @media print {
            body { margin: 12mm; }
          }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        ${subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : ""}
        ${sectionHtml}
        ${footer ? `<p class="footer">${escapeHtml(footer)}</p>` : ""}
      </body>
    </html>
  `;
};

export const printDocument = ({ title, subtitle, sections, footer }) => {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    alert("Please allow pop-ups to print this report.");
    return;
  }

  const html = buildPrintDocument({ title, subtitle, sections, footer });

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  let printed = false; // guard against double print

  const triggerPrint = () => {
    if (printed || printWindow.closed) return;
    printed = true;

    printWindow.focus();
    printWindow.print();
    // Optional: close after printing
    // setTimeout(() => printWindow.close(), 300);
  };

  // Preferred path
  printWindow.onload = triggerPrint;

  // Fallback – only runs if onload never fired
  setTimeout(() => {
    if (!printed && printWindow.document.readyState === "complete") {
      triggerPrint();
    }
  }, 600);
};

const normalizeRole = (workType) => {
  const raw = (workType ?? "Unassigned").toString();
  const normalized = raw.trim() === "" ? "UNASSIGNED" : raw.trim().toUpperCase();

  if (normalized === "UNASSIGNED") return "Unassigned";

  return normalized.charAt(0) + normalized.slice(1).toLowerCase();
};

export const printFunctionMatrixSummary = (roleCounts) => {
  const totalMembers = roleCounts.reduce((sum, row) => sum + row.count, 0);

  printDocument({
    title: "Function Matrix",
    subtitle: `Generated on ${new Date().toLocaleString()}`,
    sections: [
      {
        columns: [
          { key: "role", label: "Role" },
          { key: "count", label: "Count" },
        ],
        rows: roleCounts,
        emptyMessage: "No member data available.",
      },
    ],
    footer: `Total Members: ${totalMembers}`,
  });
};

export const printFunctionMatrixDetailed = (roleCounts, userData) => {
  console.log(roleCounts, userData);
  const totalMembers = roleCounts.reduce((sum, row) => sum + row.count, 0);
  const membersByRole = roleCounts.reduce((groups, { role }) => {
    groups[role] = userData
      .filter((member) => normalizeRole(member.workType) === role)
      .map((member) => ({
        name: member.name || "N/A",
        phoneNo: member.phoneNo || "N/A",
        crNo: member.crNo || "N/A",
        expireDate: member.expireDate || "N/A",
      }));
    return groups;
  }, {});

  const sections = [
    {
      heading: "Summary",
      columns: [
        { key: "role", label: "Role" },
        { key: "count", label: "Count" },
      ],
      rows: roleCounts,
      emptyMessage: "No member data available.",
    },
    ...roleCounts.map(({ role }) => ({
      heading: `${role} (${membersByRole[role]?.length || 0})`,
      columns: [
        { key: "name", label: "Name" },
        { key: "crNo", label: "CR No." },
        { key: "phoneNo", label: "Mobile" },
        { key: "expireDate", label: "Card Expiry" },
      ],
      rows: membersByRole[role] || [],
      emptyMessage: "No members in this role.",
    })),
  ];

  printDocument({
    title: "Function Matrix - Detailed Report",
    subtitle: `Generated on ${new Date().toLocaleString()}`,
    sections,
    footer: `Total Members: ${totalMembers}`,
  });
};