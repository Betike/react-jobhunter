import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback } from 'react';
import { apiURL } from '../constants';
import SearchBar from './SearchBar.jsx';
import JobsTable from './JobsTable.jsx';
import NavBar from './NavBar';
import { Button } from "@/components/ui/button";

const Index = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        minSal: '',
        maxSal: '',
        jobType: '',
        city: '',
        homeOffice: false,
    });
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const searchMutation = useMutation({
        mutationFn: async ({ filters, page }) => {
            const response = await fetch(apiURL + `/jobs?company[$like]=%${filters.search}%` +
                (filters.minSal !== '' ? `&salaryFrom[$gt]=${filters.minSal}` : '') +
                (filters.maxSal !== '' ? `&salaryTo[$lt]=${filters.maxSal}` : '') +
                (filters.jobType !== '' ? `&type=${filters.jobType}` : '') +
                (filters.city !== '' ? `&city=${filters.city}` : '') +
                (filters.homeOffice === true ? '&homeOffice=true' : '') +
                `&$limit=5&$skip=${page * 5}`,
                {
                    method: "GET",
                });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            return responseData;
        },
        onSuccess: (data) => {
            setSearchResults(prev => [...prev, ...data.data]);
            setIsSearching(false);
            if (data.data.length === 0) {
                setHasMore(false);
            }
        },
    });

    const { isLoading, data, error } = useQuery({
        queryKey: ["jobs"],
        queryFn: async () => {
            const response = await fetch(apiURL + "/jobs?$limit=5&$skip=0", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setSearchResults(data.data)
            return data;
        },
    });

    const handleSearch = (filters) => {
        setPage(0);
        setHasMore(true);
        setSearchResults([]);
        searchMutation.mutate({ filters, page: 0 });
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const loadMore = useCallback(() => {
        if (hasMore && !isSearching) {
            setIsSearching(true);
            setPage(prevPage => prevPage + 1);
            searchMutation.mutate({ filters, page: page + 1 });
        }
    }, [hasMore, isSearching, filters, page]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
                loadMore();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loadMore]);

    if (isLoading) {
        return <>Loading...</>;
    }

    if (error) {
        return <>Error loading data...</>;
    }

    return (
        <>
            <NavBar />
            <div className='text-[40px] font-bold p-10 border-b-2'>Főoldal</div>
            <SearchBar data={data} filters={filters} onFilterChange={handleFilterChange} />
            <div className='flex justify-center'>
                <Button onClick={() => handleSearch(filters)}>Keresés</Button>
            </div>
            <JobsTable data={searchResults} />
            {isSearching && <div>Loading more jobs...</div>}
        </>
    );
}

export default Index;
