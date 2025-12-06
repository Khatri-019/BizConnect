import { useState, useEffect } from "react";
import { expertsAPI } from "../services/api";

/**
 * Hook for fetching experts data
 */
export const useExperts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await expertsAPI.getAll();
        setExperts(res);
        setError(null);
      } catch (err) {
        setError("Failed to fetch experts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  return { experts, loading, error };
};

