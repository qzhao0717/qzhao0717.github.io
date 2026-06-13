'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { CardPageConfig } from '@/types/page';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-800 font-medium transition-all duration-200 rounded hover:text-green-900 hover:underline"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    const hasGroups = config.items.some(item => item.group);

    const grouped: { groupName: string | null; items: typeof config.items }[] = [];

    if (hasGroups) {
        const groupMap = new Map<string, typeof config.items>();
        for (const item of config.items) {
            const key = item.group ?? '';
            if (!groupMap.has(key)) groupMap.set(key, []);
            groupMap.get(key)!.push(item);
        }
        for (const [groupName, items] of groupMap.entries()) {
            grouped.push({ groupName: groupName || null, items });
        }
    } else {
        grouped.push({ groupName: null, items: config.items });
    }

    let globalIndex = 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <div className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed`}>
                        <ReactMarkdown components={markdownComponents}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            <div className={`grid ${embedded ? "gap-8" : "gap-10"}`}>
                {grouped.map(({ groupName, items }) => (
                    <div key={groupName ?? '_default'}>
                        {groupName && (
                            <h2 className={`${embedded ? "text-xl" : "text-2xl"} font-serif font-semibold text-primary mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800`}>
                                {groupName}
                            </h2>
                        )}
                        <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                            {items.map((item) => {
                                const i = globalIndex++;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 * i }}
                                        className={`bg-white dark:bg-neutral-900 ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            {item.link ? (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary hover:text-accent transition-colors duration-200`}>
                                                    {item.title}
                                                </a>
                                            ) : (
                                                <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary`}>{item.title}</h3>
                                            )}
                                            {item.date && (
                                                <span className="text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-right whitespace-nowrap">
                                                    {item.date}
                                                </span>
                                            )}
                                        </div>
                                        {item.subtitle && (
                                            <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3`}>{item.subtitle}</p>
                                        )}
                                        <div className="flex gap-6">
                                            {item.image && (
                                                <div className="shrink-0 w-52">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                {item.content && (
                                                    <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed`}>
                                                        <ReactMarkdown components={markdownComponents}>
                                                            {item.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}
                                                {item.tags && (
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {item.tags.map(tag => (
                                                            <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {item.images &&(
                                            <div className="flex gap-4 mt-4">
                                                {item.images.map((img, idx) => (
                                                    <div key={idx} className='flex-1'>
                                                        <img
                                                            src= {img}
                                                            alt={`${item.title} ${idx + 1}`}
                                                            className="w-full h-65 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                        }
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}