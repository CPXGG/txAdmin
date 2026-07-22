import type { ComponentType } from 'react';

/* eslint-disable react-refresh/only-export-components */

export type ExtensionSlotName =
    | 'header.actions'
    | 'sidebar.bottom'
    | 'content.before'
    | 'content.after';

export type PanelExtension = {
    id: string;
    slots: Partial<Record<ExtensionSlotName, ComponentType>>;
};

// Keep custom features registered here. The txAdmin route and API layers remain untouched,
// which makes upstream updates substantially easier to merge.
export const panelExtensions: PanelExtension[] = [];

export function ExtensionSlot({ name }: { name: ExtensionSlotName }) {
    return panelExtensions.map((extension) => {
        const Component = extension.slots[name];
        return Component ? <Component key={`${extension.id}:${name}`} /> : null;
    });
}
