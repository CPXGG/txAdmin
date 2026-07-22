import { cn } from '@/lib/utils';

type CpxxpBrandProps = {
    compact?: boolean;
    className?: string;
};

export default function CpxxpBrand({ compact = false, className }: CpxxpBrandProps) {
    return (
        <div className={cn('flex items-center gap-2.5 select-none', className)} aria-label="CPXXP Control">
            <div className="relative size-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#100e1b] shadow-[0_0_28px_rgba(245,10,70,0.22)]">
                <img className="size-full object-cover" src="/img/cpxxp-mark.png" alt="" />
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#f50a46]" />
            </div>
            {!compact && (
                <div className="flex min-w-0 flex-col leading-none">
                    <span className="text-[1.05rem] font-bold tracking-[0.14em] text-foreground">CPXXP</span>
                    <span className="cpx-eyebrow mt-1">Control system</span>
                </div>
            )}
        </div>
    );
}
