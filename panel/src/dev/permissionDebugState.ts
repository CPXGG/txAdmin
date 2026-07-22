import { atomWithStorage } from 'jotai/utils';

export type DevPermissionOverride = {
    enabled: boolean;
    isMaster: boolean;
    permissions: string[];
};

export type DevPermissionDefinition = {
    id: string;
    label: string;
    group: 'Sistema' | 'Jogadores e menu';
};

export const devPermissionDefinitions: DevPermissionDefinition[] = [
    { id: 'all_permissions', label: 'Todas as permissões', group: 'Sistema' },
    { id: 'manage.admins', label: 'Gerenciar administradores', group: 'Sistema' },
    { id: 'settings.view', label: 'Visualizar configurações', group: 'Sistema' },
    { id: 'settings.write', label: 'Alterar configurações', group: 'Sistema' },
    { id: 'console.view', label: 'Visualizar console', group: 'Sistema' },
    { id: 'console.write', label: 'Escrever no console', group: 'Sistema' },
    { id: 'control.server', label: 'Controlar servidor e agendamentos', group: 'Sistema' },
    { id: 'announcement', label: 'Enviar anúncios', group: 'Sistema' },
    { id: 'commands.resources', label: 'Controlar resources', group: 'Sistema' },
    { id: 'server.cfg.editor', label: 'Editar server.cfg', group: 'Sistema' },
    { id: 'txadmin.log.view', label: 'Visualizar logs do sistema', group: 'Sistema' },
    { id: 'server.log.view', label: 'Visualizar logs do servidor', group: 'Sistema' },
    { id: 'players.remove_ids', label: 'Remover identificadores', group: 'Sistema' },
    { id: 'menu.vehicle', label: 'Criar e reparar veículos', group: 'Jogadores e menu' },
    { id: 'menu.clear_area', label: 'Limpar área do mundo', group: 'Jogadores e menu' },
    { id: 'menu.viewids', label: 'Visualizar IDs em jogo', group: 'Jogadores e menu' },
    { id: 'players.direct_message', label: 'Enviar mensagem direta', group: 'Jogadores e menu' },
    { id: 'players.whitelist', label: 'Gerenciar allowlist', group: 'Jogadores e menu' },
    { id: 'players.warn', label: 'Advertir jogadores', group: 'Jogadores e menu' },
    { id: 'players.kick', label: 'Expulsar jogadores', group: 'Jogadores e menu' },
    { id: 'players.ban', label: 'Banir jogadores', group: 'Jogadores e menu' },
    { id: 'players.freeze', label: 'Congelar jogadores', group: 'Jogadores e menu' },
    { id: 'players.heal', label: 'Curar jogadores', group: 'Jogadores e menu' },
    { id: 'players.playermode', label: 'NoClip e God Mode', group: 'Jogadores e menu' },
    { id: 'players.spectate', label: 'Espectar jogadores', group: 'Jogadores e menu' },
    { id: 'players.teleport', label: 'Teleportar jogadores', group: 'Jogadores e menu' },
    { id: 'players.troll', label: 'Ações de troll', group: 'Jogadores e menu' },
];

export const devPermissionOverrideAtom = atomWithStorage<DevPermissionOverride>(
    'cpxxp:dev-permission-override',
    {
        enabled: false,
        isMaster: false,
        permissions: [],
    },
);

