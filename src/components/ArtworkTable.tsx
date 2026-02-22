import React, { useState, useCallback } from "react";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import type { Artwork } from "../types/artwork";
import { useArtworks } from "../hooks/useArtwork";
import SelectionOverlay from "./SelectionOverlay";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./ArtworkTable.css";

const ArtworkTable: React.FC = () => {
    const {
        artworks,
        pagination,
        currentPage,
        setCurrentPage,
        loading,
        rowsPerPage,
    } = useArtworks();

    const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());
    const [deselectedRowIds, setDeselectedRowIds] = useState<Set<number>>(
        new Set()
    );
    const [globalSelectCount, setGlobalSelectCount] = useState<number>(0);

    const getGlobalIndex = useCallback(
        (localIndex: number): number => {
            return (currentPage - 1) * rowsPerPage + localIndex;
        },
        [currentPage, rowsPerPage]
    );

    const isRowSelected = useCallback(
        (artwork: Artwork, localIndex: number): boolean => {
            if (selectedRowIds.has(artwork.id)) return true;
            if (deselectedRowIds.has(artwork.id)) return false;
            return getGlobalIndex(localIndex) < globalSelectCount;
        },
        [selectedRowIds, deselectedRowIds, globalSelectCount, getGlobalIndex]
    );

    const selectedArtworks: Artwork[] = artworks.filter((artwork, index) =>
        isRowSelected(artwork, index)
    );

    const handleSelectionChange = (e: { value: Artwork[] }) => {
        const nowSelectedOnPage = new Set(e.value.map((a) => a.id));

        setSelectedRowIds((prev) => {
            const next = new Set(prev);
            artworks.forEach((artwork, index) => {
                const wasSelected = isRowSelected(artwork, index);
                const isNowSelected = nowSelectedOnPage.has(artwork.id);
                if (!wasSelected && isNowSelected) next.add(artwork.id);
                else if (wasSelected && !isNowSelected) next.delete(artwork.id);
            });
            return next;
        });

        setDeselectedRowIds((prev) => {
            const next = new Set(prev);
            artworks.forEach((artwork, index) => {
                const wasSelected = isRowSelected(artwork, index);
                const isNowSelected = nowSelectedOnPage.has(artwork.id);
                if (wasSelected && !isNowSelected) next.add(artwork.id);
                else if (!wasSelected && isNowSelected) next.delete(artwork.id);
            });
            return next;
        });
    };

    const handleCustomSelectCount = (count: number) => {
        setGlobalSelectCount(count);
        setSelectedRowIds(new Set());
        setDeselectedRowIds(new Set());
    };

    const handlePageChange = (e: DataTablePageEvent) => {
        setCurrentPage((e.page ?? 0) + 1);
    };

    const totalRecords = pagination?.total ?? 0;
    const firstIndex = (currentPage - 1) * rowsPerPage + 1;
    const lastIndex = Math.min(currentPage * rowsPerPage, totalRecords);

    const truncate = (text: string | null, max = 120): string => {
        if (!text) return "N/A";
        return text.length > max ? text.substring(0, max) + "..." : text;
    };

    const checkboxHeader = (
    <div className="checkbox-header">
        <SelectionOverlay
            onSelectCount={handleCustomSelectCount}
            totalRecords={totalRecords}
        />
    </div>
);

    return (
        <div className="table-wrapper">
            <DataTable
                value={artworks}
                loading={loading}
                selection={selectedArtworks}
                onSelectionChange={handleSelectionChange}
                selectionMode="multiple"
                dataKey="id"
                lazy
                paginator={false}
                rows={rowsPerPage}
                totalRecords={totalRecords}
                first={(currentPage - 1) * rowsPerPage}
                onPage={handlePageChange}
                tableStyle={{ width: "100%" }}
                emptyMessage="No artworks found."
                className="artwork-table"
            >
                <Column
                    selectionMode="multiple"
                    headerStyle={{ width: "80px", textAlign: "center" }}
                    bodyStyle={{ textAlign: "center" }}
                    header={checkboxHeader}
                    className="custom-checkbox-header"
                />

{/* <Column
    header={
        <div className="custom-checkbox-header">
            <input
                type="checkbox"
                checked={selectedArtworks.length === artworks.length}
                onChange={(e) => {
                    if (e.target.checked) {
                        handleCustomSelectCount(totalRecords);
                    } else {
                        handleCustomSelectCount(0);
                    }
                }}
            />
            <SelectionOverlay
                onSelectCount={handleCustomSelectCount}
                totalRecords={totalRecords}
            />
        </div>
    }
    body={(rowData, options) => (
        <input
            type="checkbox"
            checked={isRowSelected(rowData, options.rowIndex)}
            onChange={() => {
                const fakeEvent = {
                    value: isRowSelected(rowData, options.rowIndex)
                        ? selectedArtworks.filter(a => a.id !== rowData.id)
                        : [...selectedArtworks, rowData]
                };
                handleSelectionChange(fakeEvent);
            }}
        />
    )}
    headerStyle={{ width: "80px" }}
    bodyStyle={{ textAlign: "center" }}
/> */}
                <Column
                    field="title"
                    header="TITLE"
                    body={(row) => <span className="title-cell">{row.title || "N/A"}</span>}
                    style={{ minWidth: "220px" }}
                />
                
                <Column
                    field="place_of_origin"
                    header="PLACE OF ORIGIN"
                    body={(row) => row.place_of_origin || "N/A"}
                    style={{ minWidth: "130px" }}
                />
                <Column
                    field="artist_display"
                    header="ARTIST"
                    body={(row) => truncate(row.artist_display)}
                    style={{ minWidth: "220px" }}
                />
                <Column
                    field="inscriptions"
                    header="INSCRIPTIONS"
                    body={(row) => truncate(row.inscriptions)}
                    style={{ minWidth: "220px" }}
                />
                <Column
                    field="date_start"
                    header="START DATE"
                    body={(row) => (row.date_start != null ? row.date_start : "N/A")}
                    style={{ minWidth: "90px", textAlign: "right" }}
                    headerStyle={{ textAlign: "right" }}
                />
                <Column
                    field="date_end"
                    header="END DATE"
                    body={(row) => (row.date_end != null ? row.date_end : "N/A")}
                    style={{ minWidth: "90px", textAlign: "right" }}
                    headerStyle={{ textAlign: "right" }}
                />
            </DataTable>

            {/* Custom Footer */}
            <div className="table-footer">
                <span className="footer-info">
                    Showing <strong>{firstIndex}</strong> to <strong>{lastIndex}</strong>{" "}
                    of <strong>{totalRecords.toLocaleString()}</strong> entries
                </span>
                <CustomPaginator
                    currentPage={currentPage}
                    totalPages={pagination?.total_pages ?? 1}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

/* ── Custom Paginator ─────────────────────────────────────── */
interface CustomPaginatorProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CustomPaginator: React.FC<CustomPaginatorProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const getPageNumbers = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];
        const delta = 2;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);
        if (currentPage > delta + 2) pages.push("...");

        const start = Math.max(2, currentPage - delta);
        const end = Math.min(totalPages - 1, currentPage + delta);

        for (let i = start; i <= end; i++) pages.push(i);

        if (currentPage < totalPages - delta - 1) pages.push("...");
        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="paginator">
            <button
                className="page-btn nav-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                    <span key={`ellipsis-${idx}`} className="page-ellipsis">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        className={`page-btn ${currentPage === page ? "active" : ""}`}
                        onClick={() => onPageChange(page as number)}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                className="page-btn nav-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default ArtworkTable;