
import React, { useState } from 'react';
import { Check, ChevronsUpDown, PlusCircle, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTenant } from '@/hooks/useTenant';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function TenantSelector() {
  const { currentTenant, userTenants, setTenant, createNewTenant } = useTenant();
  const [open, setOpen] = useState(false);
  const [showNewTenantDialog, setShowNewTenantDialog] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  
  const tenants = userTenants.map(userTenant => ({
    id: userTenant.tenantId,
    name: userTenant.tenantId, // Em produção, buscar o nome do tenant
    role: userTenant.role
  }));
  
  const handleCreateNewTenant = async () => {
    if (!newTenantName.trim()) return;
    
    const result = await createNewTenant({
      name: newTenantName,
      plan: 'free',
      status: 'active'
    });
    
    if (result) {
      setTenant(result.id);
      setShowNewTenantDialog(false);
      setNewTenantName('');
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Selecione um workspace"
            className="w-[200px] justify-between"
          >
            <Building className="mr-2 h-4 w-4" />
            {currentTenant?.name || "Selecione um workspace"}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Buscar workspace..." />
              <CommandEmpty>Nenhum workspace encontrado.</CommandEmpty>
              <CommandGroup heading="Seus workspaces">
                {tenants.map((tenant) => (
                  <CommandItem
                    key={tenant.id}
                    onSelect={() => {
                      setTenant(tenant.id);
                      setOpen(false);
                    }}
                    className="text-sm flex items-center"
                  >
                    <Building className="mr-2 h-4 w-4" />
                    {tenant.name || tenant.id}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentTenant?.id === tenant.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setShowNewTenantDialog(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar novo workspace
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={showNewTenantDialog} onOpenChange={setShowNewTenantDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar novo workspace</DialogTitle>
            <DialogDescription>
              Crie um novo workspace para organizar seus dados e integrações.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                placeholder="Nome do workspace"
                value={newTenantName}
                onChange={(e) => setNewTenantName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTenantDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateNewTenant}>Criar workspace</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TenantSelector;
