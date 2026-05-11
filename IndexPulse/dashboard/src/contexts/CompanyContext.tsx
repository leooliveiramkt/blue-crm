"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Company {
  id: string;
  name: string;
  domain: string;
  score: number;
  autoPublishPills: boolean;
}

interface CompanyContextType {
  companies: Company[];
  activeCompany: Company | null;
  setActiveCompany: (company: Company) => void;
  updateActiveCompanyData: (data: Partial<Company>) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompanyState] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/v1/auth/companies');
        const data = await res.json();
        
        if (data.success && data.companies.length > 0) {
          setCompanies(data.companies);
          
          // Tenta recuperar do localStorage ao carregar
          const savedId = localStorage.getItem('indexpulse_active_company');
          if (savedId) {
            const found = data.companies.find((c: Company) => c.id === savedId);
            if (found) {
              setActiveCompanyState(found);
              setIsLoading(false);
              return;
            }
          }
          // Fallback: Primeira empresa da lista
          setActiveCompanyState(data.companies[0]);
        }
      } catch (err) {
        console.error("Falha ao buscar empresas", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const setActiveCompany = (company: Company) => {
    setActiveCompanyState(company);
    localStorage.setItem('indexpulse_active_company', company.id);
  };

  const updateActiveCompanyData = (data: Partial<Company>) => {
    if (activeCompany) {
      setActiveCompanyState({ ...activeCompany, ...data });
    }
  };

  return (
    <CompanyContext.Provider value={{ companies, activeCompany, setActiveCompany, updateActiveCompanyData }}>
      {!isLoading && children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
