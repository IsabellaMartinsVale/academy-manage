import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogIn, UserPlus } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-primary rounded-full shadow-lg">
              <GraduationCap className="h-16 w-16 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sistema de Gestão de Alunos
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Gerencie seus alunos de forma profissional e eficiente. 
            Cadastre, edite, busque e organize informações acadêmicas com facilidade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
              <LogIn className="mr-2 h-5 w-5" />
              Fazer Login
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8">
              <UserPlus className="mr-2 h-5 w-5" />
              Criar Conta
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-card rounded-lg shadow-md border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Cadastro Simples</h3>
              <p className="text-muted-foreground">
                Adicione novos alunos com informações completas de forma rápida e intuitiva
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-md border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Gestão Completa</h3>
              <p className="text-muted-foreground">
                Edite, atualize e gerencie todos os dados dos seus alunos em um só lugar
              </p>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-md border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Acesso Seguro</h3>
              <p className="text-muted-foreground">
                Sistema com autenticação protegida para garantir a segurança dos dados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
