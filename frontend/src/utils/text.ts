export function capitalize(text?: string): string | undefined {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
}