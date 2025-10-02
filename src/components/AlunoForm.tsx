import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const alunoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().email("Email inválido").max(255, "Email muito longo"),
  curso: z.string().min(2, "Curso deve ter no mínimo 2 caracteres").max(100, "Curso muito longo"),
  idade: z.number().min(1, "Idade inválida").max(150, "Idade inválida"),
});

type Aluno = {
  id: string;
  nome: string;
  email: string;
  curso: string;
  idade: number;
  user_id: string;
};

type AlunoFormProps = {
  aluno: Aluno | null;
  onSuccess: () => void;
  onCancel: () => void;
};

const AlunoForm = ({ aluno, onSuccess, onCancel }: AlunoFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    curso: "",
    idade: "",
  });

  useEffect(() => {
    if (aluno) {
      setFormData({
        nome: aluno.nome,
        email: aluno.email,
        curso: aluno.curso,
        idade: aluno.idade.toString(),
      });
    }
  }, [aluno]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = alunoSchema.parse({
        ...formData,
        idade: parseInt(formData.idade),
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      if (aluno) {
        const { error } = await supabase
          .from("alunos")
          .update(validated)
          .eq("id", aluno.id);

        if (error) throw error;

        toast({
          title: "Aluno atualizado!",
          description: "Os dados foram atualizados com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("alunos")
          .insert({
            nome: validated.nome,
            email: validated.email,
            curso: validated.curso,
            idade: validated.idade,
            user_id: user.id
          });

        if (error) throw error;

        toast({
          title: "Aluno cadastrado!",
          description: "O aluno foi adicionado com sucesso.",
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Verifique os dados e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome completo</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          placeholder="João Silva"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="joao@exemplo.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="curso">Curso</Label>
        <Input
          id="curso"
          value={formData.curso}
          onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
          placeholder="Engenharia de Software"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="idade">Idade</Label>
        <Input
          id="idade"
          type="number"
          value={formData.idade}
          onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
          placeholder="20"
          min="1"
          max="150"
          required
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Salvando..." : aluno ? "Atualizar" : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
};

export default AlunoForm;
