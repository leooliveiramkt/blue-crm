
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Página não encontrada</p>
        <p className="text-muted-foreground max-w-md mx-auto">
          A página que você está tentando acessar não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/dashboard">Voltar para o Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
