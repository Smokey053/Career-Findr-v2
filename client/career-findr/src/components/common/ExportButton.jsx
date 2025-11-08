import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  FileDownload,
  PictureAsPdf,
  TableChart,
  Description,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ExportButton({
  data,
  filename,
  columns,
  title,
  disabled,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportToCSV = () => {
    setLoading(true);
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      XLSX.writeFile(workbook, `${filename}.csv`);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const exportToExcel = () => {
    setLoading(true);
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const exportToPDF = () => {
    setLoading(true);
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(16);
      doc.text(title || filename, 14, 15);

      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

      // Prepare table data
      const tableColumns = columns || Object.keys(data[0] || {});
      const tableRows = data.map((item) =>
        tableColumns.map((col) => {
          const value = item[col];
          if (typeof value === "object" && value !== null) {
            return JSON.stringify(value);
          }
          return value || "";
        })
      );

      // Add table
      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 28,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [63, 81, 181] },
      });

      doc.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const exportToJSON = () => {
    setLoading(true);
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.json`;
      link.click();
    } catch (error) {
      console.error("Error exporting to JSON:", error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={loading ? <CircularProgress size={20} /> : <FileDownload />}
        onClick={handleClick}
        disabled={disabled || loading || !data || data.length === 0}
      >
        Export
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={exportToCSV}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={exportToExcel}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={exportToPDF}>
          <ListItemIcon>
            <PictureAsPdf fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={exportToJSON}>
          <ListItemIcon>
            <Description fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as JSON</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
