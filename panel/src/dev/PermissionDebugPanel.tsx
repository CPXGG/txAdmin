import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAtom } from 'jotai';
import { BugIcon, CheckCheckIcon, RotateCcwIcon, ShieldAlertIcon, ShieldCheckIcon, ShieldOffIcon } from 'lucide-react';
import {
    devPermissionDefinitions,
    devPermissionOverrideAtom,
    type DevPermissionDefinition,
} from './permissionDebugState';

const groups: DevPermissionDefinition['group'][] = ['Sistema', 'Jogadores e menu'];
const readOnlyPreset = [
    'settings.view',
    'console.view',
    'txadmin.log.view',
    'server.log.view',
];

export default function PermissionDebugPanel() {
    const [override, setOverride] = useAtom(devPermissionOverrideAtom);
    const grantsEverything = override.isMaster || override.permissions.includes('all_permissions');

    const updateOverride = (patch: Partial<typeof override>) => {
        setOverride((current) => ({ ...current, ...patch }));
    };

    const togglePermission = (permission: string, checked: boolean) => {
        setOverride((current) => ({
            ...current,
            permissions: checked
                ? [...new Set([...current.permissions, permission])]
                : current.permissions.filter((item) => item !== permission),
        }));
    };

    const resetToSession = () => {
        setOverride({ enabled: false, isMaster: false, permissions: [] });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="relative flex size-10 items-center justify-center rounded-md border border-warning/40 bg-warning-hint text-warning-inline transition-colors hover:bg-warning hover:text-warning-foreground"
                    title="Debug de permissões"
                >
                    <BugIcon className="size-5" />
                    {override.enabled && (
                        <span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-background bg-success" />
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[min(26rem,calc(100vw-1rem))] overflow-hidden p-0">
                <div className="border-b bg-warning-hint/60 p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <BugIcon className="size-5 text-warning-inline" />
                                <h2 className="font-semibold">Debug de permissões</h2>
                                <Badge variant="outline" className="border-warning/40 text-warning-inline">DEV</Badge>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                Override visual do frontend. O backend continua validando as permissões reais da sessão.
                            </p>
                        </div>
                        <Switch
                            aria-label="Ativar override de permissões"
                            checked={override.enabled}
                            onCheckedChange={(checked) => updateOverride({ enabled: checked })}
                        />
                    </div>
                </div>

                <div className="space-y-3 p-4">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="xs"
                            variant="outline-muted"
                            onClick={() => updateOverride({ enabled: true, isMaster: false, permissions: [] })}
                        >
                            <ShieldOffIcon className="mr-1.5 size-3.5" />Nenhuma
                        </Button>
                        <Button
                            size="xs"
                            variant="outline-info"
                            onClick={() => updateOverride({ enabled: true, isMaster: false, permissions: readOnlyPreset })}
                        >
                            <ShieldCheckIcon className="mr-1.5 size-3.5" />Leitura
                        </Button>
                        <Button
                            size="xs"
                            variant="outline-success"
                            onClick={() => updateOverride({ enabled: true, isMaster: false, permissions: ['all_permissions'] })}
                        >
                            <CheckCheckIcon className="mr-1.5 size-3.5" />Todas
                        </Button>
                        <Button size="xs" variant="ghost-muted" onClick={resetToSession}>
                            <RotateCcwIcon className="mr-1.5 size-3.5" />Sessão real
                        </Button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-muted/25 p-3">
                        <div className="flex items-center gap-2">
                            <ShieldAlertIcon className="size-4 text-primary" />
                            <div>
                                <Label htmlFor="dev-master" className="cursor-pointer">Simular Master Admin</Label>
                                <p className="text-[0.65rem] text-muted-foreground">Concede acesso visual irrestrito.</p>
                            </div>
                        </div>
                        <Checkbox
                            id="dev-master"
                            checked={override.isMaster}
                            disabled={!override.enabled}
                            onCheckedChange={(checked) => updateOverride({ isMaster: checked === true })}
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{override.enabled ? 'Override ativo' : 'Usando sessão real'}</span>
                        <span>{grantsEverything ? 'Acesso total' : `${override.permissions.length} selecionadas`}</span>
                    </div>
                </div>

                <Separator />

                <ScrollArea className="h-[min(24rem,48vh)]">
                    <div className="space-y-5 p-4">
                        {groups.map((group) => (
                            <section key={group} className="space-y-2.5">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">{group}</h3>
                                {devPermissionDefinitions
                                    .filter((permission) => permission.group === group)
                                    .map((permission) => (
                                        <label
                                            key={permission.id}
                                            htmlFor={`dev-permission-${permission.id}`}
                                            className="flex cursor-pointer items-start gap-3 rounded-md border border-transparent p-2 transition-colors hover:border-border hover:bg-muted/30"
                                        >
                                            <Checkbox
                                                id={`dev-permission-${permission.id}`}
                                                className="mt-0.5"
                                                checked={override.permissions.includes(permission.id)}
                                                disabled={!override.enabled || override.isMaster}
                                                onCheckedChange={(checked) => togglePermission(permission.id, checked === true)}
                                            />
                                            <span className="min-w-0">
                                                <span className="block text-sm leading-tight">{permission.label}</span>
                                                <code className="block truncate text-[0.65rem] text-muted-foreground">{permission.id}</code>
                                            </span>
                                        </label>
                                    ))}
                            </section>
                        ))}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}

