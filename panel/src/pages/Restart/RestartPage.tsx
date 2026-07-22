import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminPerms } from '@/hooks/auth';
import { useOpenConfirmDialog } from '@/hooks/dialogs';
import { ApiTimeout, useBackendApi } from '@/hooks/fetch';
import { fxRunnerStateAtom } from '@/hooks/status';
import { cn } from '@/lib/utils';
import { useAtomValue } from 'jotai';
import {
    AlertTriangleIcon,
    CheckCircle2Icon,
    CloudCogIcon,
    DatabaseBackupIcon,
    GitPullRequestArrowIcon,
    ListChecksIcon,
    LockKeyholeIcon,
    MegaphoneIcon,
    PlayIcon,
    RotateCcwIcon,
    ServerCogIcon,
    ShieldCheckIcon,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type StepStatus = 'ready' | 'planned';

type RestartStep = {
    title: string;
    description: string;
    details: string[];
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    status: StepStatus;
};

const restartSteps: RestartStep[] = [
    {
        title: 'Pré-validação',
        description: 'Confere saúde, jogadores conectados e impedimentos antes de iniciar.',
        details: ['Estado do FXServer', 'Jogadores online', 'Bloqueios operacionais'],
        icon: ListChecksIcon,
        status: 'planned',
    },
    {
        title: 'Avisos e drenagem',
        description: 'Comunica o reinício e prepara uma saída controlada dos jogadores.',
        details: ['Avisos progressivos', 'Bloqueio de novas conexões', 'Encerramento de sessões'],
        icon: MegaphoneIcon,
        status: 'planned',
    },
    {
        title: 'Backup SQL',
        description: 'Gera e valida um backup consistente antes de qualquer atualização.',
        details: ['Dump versionado', 'Verificação de integridade', 'Política de retenção'],
        icon: DatabaseBackupIcon,
        status: 'planned',
    },
    {
        title: 'Sincronização GitHub',
        description: 'Sincroniza somente a revisão aprovada e registra o commit implantado.',
        details: ['Fetch seguro', 'Validação da branch', 'Registro do commit'],
        icon: GitPullRequestArrowIcon,
        status: 'planned',
    },
    {
        title: 'Serviços e APIs',
        description: 'Reinicia dependências externas na ordem definida para o ambiente.',
        details: ['APIs CPXXP', 'Workers e filas', 'Verificação de disponibilidade'],
        icon: CloudCogIcon,
        status: 'planned',
    },
    {
        title: 'FXServer e validação final',
        description: 'Reinicia o servidor e só conclui após os testes essenciais.',
        details: ['Inicialização do FXServer', 'Resources essenciais', 'Health checks finais'],
        icon: ServerCogIcon,
        status: 'planned',
    },
];

const stepStatusConfig: Record<StepStatus, { label: string; className: string }> = {
    ready: {
        label: 'Pronto',
        className: 'border-success/40 bg-success-hint text-success-inline',
    },
    planned: {
        label: 'Planejado',
        className: 'border-info/30 bg-info-hint text-info-inline',
    },
};

export default function RestartPage() {
    const fxRunnerState = useAtomValue(fxRunnerStateAtom);
    const { hasPerm } = useAdminPerms();
    const openConfirmDialog = useOpenConfirmDialog();
    const restartApi = useBackendApi({
        method: 'POST',
        path: '/fxserver/controls',
    });

    const hasControlPermission = hasPerm('control.server');
    const canRestartNow = hasControlPermission && fxRunnerState.isChildAlive;

    const handleImmediateRestart = () => {
        if (!canRestartNow) return;

        openConfirmDialog({
            title: 'Reinício imediato do FXServer',
            message: 'Esta ação ignora o procedimento seguro e reinicia o servidor imediatamente. Deseja continuar?',
            onConfirm: () => restartApi({
                data: { action: 'restart' },
                toastLoadingMessage: 'Reiniciando o FXServer...',
                timeout: ApiTimeout.LONG,
            }),
        });
    };

    return (
        <div className="flex h-contentvh min-w-0 flex-col gap-4 overflow-y-auto pb-4 pr-1">
            <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-card via-card to-primary/10">
                <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className="border-primary/40 bg-primary/15 text-primary" variant="outline">
                                CPXXP Operations
                            </Badge>
                            <Badge className="border-warning/40 bg-warning-hint text-warning-inline" variant="outline">
                                Estrutura inicial
                            </Badge>
                        </div>
                        <CardTitle className="text-2xl text-primary md:text-3xl">Reinício seguro</CardTitle>
                        <CardDescription className="max-w-3xl text-sm leading-relaxed md:text-base">
                            Orquestração controlada do ciclo de manutenção, com validações, backups,
                            sincronização de código e recuperação dos serviços antes da abertura do servidor.
                        </CardDescription>
                    </div>
                    <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                        <RotateCcwIcon className="size-10" />
                    </div>
                </CardHeader>
            </Card>

            <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_22rem]">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <ShieldCheckIcon className="size-5 text-primary" />
                            Procedimento operacional
                        </CardTitle>
                        <CardDescription>
                            Cada etapa será conectada a uma integração real e terá logs, timeout e política de falha próprios.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 lg:grid-cols-2">
                        {restartSteps.map((step, index) => {
                            const Icon = step.icon;
                            const status = stepStatusConfig[step.status];

                            return (
                                <section
                                    key={step.title}
                                    className="group relative overflow-hidden rounded-xl border bg-background/40 p-4 transition-colors hover:border-primary/35"
                                >
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                                                <Icon className="size-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-xs text-muted-foreground">ETAPA {String(index + 1).padStart(2, '0')}</span>
                                                <h3 className="font-semibold leading-tight">{step.title}</h3>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={cn('shrink-0', status.className)}>
                                            {status.label}
                                        </Badge>
                                    </div>
                                    <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                                        {step.details.map((detail) => (
                                            <li key={detail} className="flex items-center gap-2">
                                                <CheckCircle2Icon className="size-3.5 shrink-0 text-primary/70" />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            );
                        })}
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Execução segura</CardTitle>
                            <CardDescription>
                                O botão será liberado quando todas as integrações obrigatórias estiverem configuradas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 rounded-lg border bg-muted/30 p-3 text-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Etapas configuradas</span>
                                    <span className="font-semibold">0/{restartSteps.length}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Política de falha</span>
                                    <span className="font-semibold text-warning-inline">Pendente</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Auditoria</span>
                                    <span className="font-semibold text-warning-inline">Pendente</span>
                                </div>
                            </div>
                            <Button className="w-full gap-2" disabled>
                                <PlayIcon className="size-4" />
                                Executar procedimento
                            </Button>
                            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                                <LockKeyholeIcon className="mt-0.5 size-3.5 shrink-0" />
                                Nenhuma etapa planejada executa comandos enquanto sua integração não estiver implementada.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/35 bg-destructive-hint/40">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg text-destructive-inline">
                                <AlertTriangleIcon className="size-5" />
                                Reinício imediato
                            </CardTitle>
                            <CardDescription>
                                Mantém o controle nativo do txAdmin. O processo atual será encerrado e iniciado novamente sem executar as etapas acima.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="destructive"
                                className="w-full gap-2"
                                disabled={!canRestartNow}
                                onClick={handleImmediateRestart}
                            >
                                <RotateCcwIcon className="size-4" />
                                Reiniciar servidor agora
                            </Button>
                            {!hasControlPermission ? (
                                <p className="text-xs text-destructive-inline">Permissão necessária: control.server</p>
                            ) : !fxRunnerState.isChildAlive ? (
                                <p className="text-xs text-muted-foreground">O FXServer precisa estar em execução.</p>
                            ) : null}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
