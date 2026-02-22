import { useState, useEffect } from "react";
import type { Artwork, ApiResponse, Pagination } from "../types/artwork";

const ROWS_PER_PAGE = 12;

export const useArtworks = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchArtworks = async (page: number) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${ROWS_PER_PAGE}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`
            );
            const data: ApiResponse = await response.json();
            setArtworks(data.data);
            setPagination(data.pagination);
        } catch (error) {
            console.error("Error fetching artworks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtworks(currentPage);
    }, [currentPage]);

    return {
        artworks,
        pagination,
        currentPage,
        setCurrentPage,
        loading,
        rowsPerPage: ROWS_PER_PAGE,
    };
};