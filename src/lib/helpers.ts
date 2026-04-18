/**
 * Utility functions for common operations
 */

export const getTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

export const formatNumber = (value: string | number): string => {
    if (!value) return '';
    const num = typeof value === 'string' ? Number(value) : value;
    return num.toLocaleString('en-US');
};

export function getColor(name: string): string {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = hash % 360;

    return `hsl(${h}, 70%, 50%)`;
}

export const formatDateTimeLocal = (dateStr: string): string => {
    const date = new Date(dateStr);

    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const fetcherSWR = (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => {
        if (!res.ok) throw new Error("Fetch error");
        return res.json();
});