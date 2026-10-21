function text(value) {
    return String(value ?? '').trim();
}

function textList(value, limit = 12) {
    if (!Array.isArray(value)) return [];
    return value
        .map(item => typeof item === 'string' ? item : item?.content)
        .map(text)
        .filter(Boolean)
        .slice(0, limit);
}

export function parseChapterResponse(raw) {
    const source = text(raw).replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const start = source.indexOf('{');
    const end = source.lastIndexOf('}');
    if (start < 0 || end < start) throw new Error('The model did not return a JSON object.');

    let value;
    try {
        value = JSON.parse(source.slice(start, end + 1));
    } catch {
        throw new Error('The model returned invalid JSON.');
    }

    const chapter = {
        title: text(value.title).slice(0, 120),
        summary: text(value.summary).slice(0, 6000),
        timeline: textList(value.timeline),
        characterChanges: textList(value.character_changes ?? value.characterChanges),
        itemsAndClues: textList(value.items_and_clues ?? value.itemsAndClues),
        unresolved: textList(value.unresolved),
    };

    if (!chapter.title) throw new Error('The model did not generate a chapter title.');
    if (!chapter.summary) throw new Error('The model did not generate a chapter summary.');
    return chapter;
}

export function hashText(value) {
    const source = String(value ?? '');
    let hash = 0x811c9dc5;
    for (let index = 0; index < source.length; index += 1) {
        hash ^= source.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
}

export function fingerprintMessages(messages) {
    return hashText(messages.map(message => [
        message?.is_user ? 'user' : 'character',
        message?.name ?? '',
        message?.mes ?? '',
        message?.swipe_id ?? '',
    ].join('\u241f')).join('\u241e'));
}

export function getNextChapterStart(chapters) {
    if (!Array.isArray(chapters) || !chapters.length) return 0;
    return Math.max(...chapters.map(chapter => Number(chapter.endIndex) || 0)) + 1;
}

export function chapterToMarkdown(chapter, number) {
    const range = `Messages ${Number(chapter.startIndex) + 1}–${Number(chapter.endIndex) + 1}`;
    const sections = [
        `## Chapter ${number}: ${text(chapter.title)}`,
        '',
        `> ${range}`,
        '',
        text(chapter.summary),
    ];
    const appendList = (heading, items) => {
        if (!Array.isArray(items) || !items.length) return;
        sections.push('', `### ${heading}`, '', ...items.map(item => `- ${text(item)}`));
    };

    appendList('Timeline', chapter.timeline);
    appendList('Character Changes', chapter.characterChanges);
    appendList('Items & Clues', chapter.itemsAndClues);
    appendList('Unresolved Threads', chapter.unresolved);
    return sections.join('\n').trim();
}

export function exportChaptersMarkdown(chapters, heading = 'Story Chapters') {
    const ordered = [...chapters].sort((a, b) => a.startIndex - b.startIndex);
    return [`# ${text(heading) || 'Story Chapters'}`, '', ...ordered.flatMap((chapter, index) => [
        chapterToMarkdown(chapter, index + 1),
        '',
    ])].join('\n').trim() + '\n';
}

export function makeChapterId() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `chapter-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
